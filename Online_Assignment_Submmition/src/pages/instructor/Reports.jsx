import { fetchInstructorReports } from '../../services/api.js'
import { cardClass, pageClass } from './instructorData.js'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
} from './shared.jsx'
import { useInstructorResource } from './useInstructorResource.js'

function Bar({ label, value, max = 100, color = 'bg-brand-navy', detail }) {
  const width = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-brand-dark">{label}</span>
        <span className="shrink-0 text-brand-dark">{detail ?? value}</span>
      </div>
      <div aria-label={`${label}: ${Math.round(width)} percent`} className="h-3 overflow-hidden rounded-full bg-brand-silver" role="img">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

function Reports({ loading: externalLoading = false, error: externalError = '', onRetry }) {
  const resource = useInstructorResource(fetchInstructorReports)
  const data = resource.data
  const assignmentPerformance = data?.assignmentPerformance || []
  const gradeDistribution = data?.gradeDistribution || []
  const submittedCount = data?.totalSubmissions || 0
  const averageGrade = Number(data?.averageGrade)
  const averageLabel = Number.isFinite(averageGrade) ? averageGrade.toFixed(1) : '—'
  const maxAssignments = Math.max(1, ...assignmentPerformance.map((item) => Number(item.value) || 0))
  const maxGrades = Math.max(1, ...gradeDistribution.map((item) => Number(item.value) || 0))
  const loading = externalLoading || resource.loading
  const error = externalError || resource.error

  if (loading) return <LoadingState label="Preparing course reports…" />
  if (error) return <ErrorState message={error} onRetry={onRetry || resource.retry} />

  return (
    <div className={pageClass}>
      <PageHeading title="Reports" description="A snapshot of assignment activity and grading outcomes across your courses." />

      <section aria-label="Summary metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Assignments', assignmentPerformance.length],
          ['Submissions', submittedCount],
          ['Average marks', averageLabel],
          ['Grade bands', gradeDistribution.length],
        ].map(([label, value]) => (
          <article className={`${cardClass} p-5`} key={label}>
            <p className="text-sm font-medium text-brand-dark">{label}</p>
            <p className="mt-2 text-3xl font-bold text-brand-navy">{value}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section aria-labelledby="course-activity-title" className={cardClass}>
          <h2 className="text-lg font-semibold text-brand-navy" id="course-activity-title">Submissions by assignment</h2>
          <p className="mt-1 text-sm text-brand-dark">Number of student submissions received for each assignment.</p>
          {assignmentPerformance.length ? (
            <div className="mt-6 space-y-5">
              {assignmentPerformance.map((item) => (
                <Bar color="bg-brand-navy" detail={`${item.value} submission${item.value === 1 ? '' : 's'}`} key={item.label} label={item.label} max={maxAssignments} value={item.value} />
              ))}
            </div>
          ) : <EmptyState title="No assignment activity" message="Assignment activity will appear when students submit their work." />}
        </section>

        <section aria-labelledby="grade-distribution-title" className={cardClass}>
          <h2 className="text-lg font-semibold text-brand-navy" id="grade-distribution-title">Grade distribution</h2>
          <p className="mt-1 text-sm text-brand-dark">Published evaluation totals grouped by grade band.</p>
          {gradeDistribution.length ? (
            <div>
              <div className="mt-6 space-y-5">
                {gradeDistribution.map((band) => (
                  <Bar color="bg-brand-gold" detail={`${band.value} evaluation${band.value === 1 ? '' : 's'}`} key={band.label} label={band.label} max={maxGrades} value={band.value} />
                ))}
              </div>
              <p className="mt-6 rounded-lg bg-brand-cream p-3 text-sm text-brand-dark">Average marks: <strong>{averageLabel}</strong> across all recorded grades.</p>
            </div>
          ) : <EmptyState title="No grades to report" message="Publish evaluations to see the grade distribution and average score." />}
        </section>
      </div>
    </div>
  )
}

export default Reports
