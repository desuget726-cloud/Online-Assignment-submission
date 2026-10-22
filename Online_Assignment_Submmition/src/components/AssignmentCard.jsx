import Button from './Button.jsx'
import StatusBadge from './StatusBadge.jsx'

function formatDate(dateValue) {
  if (!dateValue) return 'No due date'

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return dateValue

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function AssignmentCard({
  assignment,
  onView,
  onSubmit,
  actionLabel = 'View',
  showSubmit = false,
}) {
  const { title, course, dueDate, status, maxMarks, description } = assignment || {}

  return (
    <article className="rounded-xl border border-brand-silver bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-semibold text-brand-navy">{title}</h3>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm font-medium text-brand-royal">{course}</p>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-brand-dark">{description}</p>
        </div>
        <div className="rounded-lg bg-brand-cream px-3 py-2 text-right text-sm text-brand-dark">
          <div className="font-semibold text-brand-navy">{maxMarks || 0} marks</div>
          <div className="mt-1">Due: {formatDate(dueDate)}</div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2 text-xs text-brand-dark">
          <span className="rounded-full bg-brand-silver px-2 py-1">Coursework</span>
          <span className="rounded-full bg-brand-silver px-2 py-1">Submission</span>
        </div>

        <div className="flex gap-2">
          <Button onClick={onView} size="sm" variant="outline">
            {actionLabel}
          </Button>
          {showSubmit ? (
            <Button onClick={onSubmit} size="sm">
              Submit
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default AssignmentCard
