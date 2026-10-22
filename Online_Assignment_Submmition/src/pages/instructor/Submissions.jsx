import { useCallback, useMemo, useState } from 'react'
import Button from '../../components/Button.jsx'
import { fetchInstructorAssignments, fetchInstructorSubmissions } from '../../services/api.js'
import { cardClass, formatDate, pageClass, studentName } from './instructorData.js'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  StatusPill,
} from './shared.jsx'
import { useInstructorResource } from './useInstructorResource.js'

function Submissions({ onNavigate, onSelectSubmission, loading: externalLoading = false, error: externalError = '', onRetry }) {
  const [filter, setFilter] = useState('All')
  const loadSubmissions = useCallback(
    () => Promise.all([fetchInstructorSubmissions(), fetchInstructorAssignments()]),
    [],
  )
  const resource = useInstructorResource(loadSubmissions, [[], []])
  const rows = useMemo(() => {
    const [submissions = [], assignments = []] = resource.data || []
    return submissions
    .filter((submission) => assignments.some((assignment) => assignment.id === submission.assignmentId))
    .map((submission) => ({
      ...submission,
      assignmentTitle: submission.assignmentTitle || assignments.find((item) => item.id === submission.assignmentId)?.title,
    }))
  }, [resource.data])
  const statuses = ['All', ...new Set(rows.map((row) => row.status))]
  const filtered = filter === 'All' ? rows : rows.filter((row) => row.status === filter)
  const loading = externalLoading || resource.loading
  const pageError = externalError || resource.error

  if (loading) return <LoadingState label="Loading submissions…" />
  if (pageError) return <ErrorState message={pageError} onRetry={onRetry || resource.retry} />

  return (
    <div className={pageClass}>
      <PageHeading title="Submissions" description="Review work submitted to your courses and open an evaluation when it is ready to grade." />
      <section aria-label="Submission status filters" className={`${cardClass} p-4`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm font-semibold text-brand-dark">Filter status:</span>
          {statuses.map((status) => (
            <button
              aria-pressed={filter === status}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-royal ${filter === status ? 'bg-brand-navy text-white ring-brand-royal' : 'bg-white text-brand-dark ring-brand-silver hover:bg-brand-cream'}`}
              key={status}
              onClick={() => setFilter(status)}
              type="button"
            >
              {status}
              <span className="sr-only"> submissions</span>
            </button>
          ))}
        </div>
      </section>

      <section aria-label="Submissions list" className={cardClass}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-brand-navy">Student work</h2>
          <p className="text-sm text-brand-dark" aria-live="polite">{filtered.length} result{filtered.length === 1 ? '' : 's'}</p>
        </div>
        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-brand-silver bg-brand-cream text-xs uppercase tracking-wide text-brand-dark">
                <tr><th className="px-3 py-3 font-semibold">Assignment</th><th className="px-3 py-3 font-semibold">Student</th><th className="px-3 py-3 font-semibold">Submitted</th><th className="px-3 py-3 font-semibold">Status</th><th className="px-3 py-3 font-semibold">Grade</th><th className="px-3 py-3 font-semibold">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-brand-silver">
                {filtered.map((row) => (
                  <tr key={row.id}>
                    <td className="px-3 py-4 font-medium text-brand-navy">{row.assignmentTitle}</td>
                    <td className="px-3 py-4 text-brand-dark">{studentName()}</td>
                    <td className="px-3 py-4 text-brand-dark">{formatDate(row.submittedAt)}</td>
                    <td className="px-3 py-4"><StatusPill status={row.status} /></td>
                    <td className="px-3 py-4 text-brand-dark">{row.grade === null ? '—' : `${row.grade} / ${row.maxMarks}`}</td>
                    <td className="px-3 py-4">
                      <Button
                        aria-label={row.status === 'Not Submitted' ? `${row.assignmentTitle} has not been submitted` : `${row.status === 'Graded' ? 'Edit evaluation for' : 'Evaluate'} ${row.assignmentTitle}`}
                        disabled={row.status === 'Not Submitted'}
                        onClick={() => {
                          if (row.status === 'Not Submitted') return
                          onSelectSubmission?.(row.id)
                          onNavigate?.('instructor-evaluate-submission')
                        }}
                        size="sm"
                        variant={row.status === 'Graded' || row.status === 'Not Submitted' ? 'outline' : 'primary'}
                      >
                        {row.status === 'Not Submitted' ? 'Not submitted' : row.status === 'Graded' ? 'View evaluation' : 'Evaluate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title={rows.length ? 'No submissions match this status' : 'No submissions yet'}
            message={rows.length ? 'Choose another status filter to see more results.' : 'Student submissions for your courses will appear here.'}
          />
        )}
      </section>
    </div>
  )
}

export default Submissions
