import Button from '../../components/Button.jsx'
import { fetchInstructorDashboard } from '../../services/api.js'
import { cardClass, formatDate, instructor, pageClass } from './instructorData.js'
import {
  ErrorState,
  LoadingState,
  PageHeading,
  StatusPill,
} from './shared.jsx'
import { useInstructorResource } from './useInstructorResource.js'

function Dashboard({ onNavigate, loading: externalLoading = false, error: externalError = '', onRetry }) {
  const resource = useInstructorResource(fetchInstructorDashboard)
  const data = resource.data
  const assignments = data?.recentAssignments || []
  const recentSubmissions = data?.recentSubmissions || []
  const awaitingReview = data?.submissionsToReview || 0
  const publishedAssignments = data?.publishedAssignments || 0
  const submissionCount = (data?.submissionsToReview || 0) + (data?.gradedSubmissions || 0)
  const error = externalError || resource.error
  const loading = externalLoading || resource.loading

  if (loading) return <LoadingState label="Loading your dashboard…" />
  if (error) return <ErrorState message={error} onRetry={onRetry || resource.retry} />

  return (
    <div className={pageClass}>
      <PageHeading
        eyebrow={`Good day, ${instructor?.name?.split(' ')[0] || 'Instructor'}`}
        title="Instructor dashboard"
        description="A quick overview of your courses, assignments, and student work."
      >
        <Button onClick={() => onNavigate?.('instructor-create-assignment')}>Create assignment</Button>
        <Button onClick={() => onNavigate?.('instructor-submissions')} variant="outline">Review submissions</Button>
      </PageHeading>

      <section aria-label="Teaching overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Assignments', publishedAssignments, 'Available to students'],
          ['Submissions', submissionCount, 'Received in your courses'],
          ['Awaiting review', awaitingReview, 'Need evaluation'],
          ['Evaluated', data?.gradedSubmissions || 0, 'Published evaluations'],
        ].map(([label, value, hint]) => (
          <article className={`${cardClass} p-5`} key={label}>
            <p className="text-sm font-medium text-brand-dark">{label}</p>
            <p className="mt-2 text-3xl font-bold text-brand-navy">{value}</p>
            <p className="mt-1 text-xs text-brand-dark">{hint}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section aria-labelledby="dashboard-assignments" className={cardClass}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-brand-navy" id="dashboard-assignments">Recent assignments</h2>
              <p className="mt-1 text-sm text-brand-dark">Assignments for your courses.</p>
            </div>
            <Button onClick={() => onNavigate?.('instructor-assignments')} size="sm" variant="outline">Manage</Button>
          </div>
          {assignments.length ? (
            <ul className="mt-5 divide-y divide-brand-silver">
              {assignments.slice(0, 4).map((assignment) => (
                <li className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0" key={assignment.id}>
                  <div>
                    <p className="font-medium text-brand-navy">{assignment.title}</p>
                    <p className="mt-1 text-sm text-brand-dark">{assignment.course} · Due {formatDate(assignment.dueDate)}</p>
                  </div>
                  <StatusPill status={assignment.status || 'Published'} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 rounded-lg bg-brand-cream p-4 text-sm text-brand-dark">No assignments yet. Create one to get started.</p>
          )}
        </section>

        <section aria-labelledby="dashboard-activity" className={cardClass}>
          <h2 className="text-lg font-semibold text-brand-navy" id="dashboard-activity">Recent submissions</h2>
          <p className="mt-1 text-sm text-brand-dark">Latest student work awaiting or completing review.</p>
          {recentSubmissions.length ? (
            <ul className="mt-5 space-y-4">
              {recentSubmissions.map((item) => (
                <li className="flex gap-3" key={item.id}>
                  <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-navy" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-dark">{item.assignmentTitle}</p>
                    <p className="truncate text-sm text-brand-dark">{item.status}</p>
                    <time className="mt-1 block text-xs text-brand-dark" dateTime={item.submittedAt || ''}>{formatDate(item.submittedAt)}</time>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="mt-5 text-sm text-brand-dark">No recent submissions.</p>}
          <Button className="mt-5" onClick={() => onNavigate?.('instructor-reports')} size="sm" variant="outline">View reports</Button>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
