import { useEffect, useState } from 'react'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { fetchStudentAssignmentById } from '../../services/api.js'

function getCountdown(dateValue) {
  const diff = new Date(dateValue).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, overdue: true }

  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds, overdue: false }
}

function AssignmentDetails({ assignmentId, onNavigate, onSelectAssignment }) {
  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    overdue: false,
  })

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const data = await fetchStudentAssignmentById(assignmentId)
        if (isMounted) setAssignment(data)
      } catch (loadError) {
        if (isMounted) setError(loadError.message || 'Unable to load assignment details.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (assignmentId) load()

    return () => {
      isMounted = false
    }
  }, [assignmentId])

  useEffect(() => {
    if (!assignment?.dueDate) return undefined

    const tick = () => setTimeLeft(getCountdown(assignment.dueDate))
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [assignment])

  if (!assignmentId) {
    return <EmptyState title="No assignment selected" description="Choose an assignment from the list to view its details." />
  }

  if (loading) return <LoadingSpinner label="Loading assignment..." />
  if (error) return <EmptyState title="Assignment unavailable" description={error} />
  if (!assignment) return <EmptyState title="Assignment not found" description="This assignment could not be loaded." />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-royal">Assignment details</p>
          <h2 className="mt-2 text-3xl font-bold text-brand-navy">{assignment.title}</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onNavigate('student-assignments')} variant="outline">
            Back to list
          </Button>
          <Button
            onClick={() => {
              onSelectAssignment(assignment.id)
              onNavigate('student-submit-assignment')
            }}
          >
            Submit work
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-5 rounded-2xl border border-brand-silver bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={assignment.status} />
            <span className="rounded-full bg-brand-silver px-2 py-1 text-xs font-semibold text-brand-dark">
              {assignment.course}
            </span>
          </div>

          <div className="space-y-3 text-brand-dark">
            <p>{assignment.description}</p>
            <div className="rounded-xl bg-brand-cream p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-dark">Instructions</p>
              <p className="mt-2 leading-7">{assignment.instructions}</p>
            </div>
          </div>
        </section>

        <aside className="space-y-4 rounded-2xl border border-brand-silver bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-dark">Deadline</p>
            <p className="mt-2 text-lg font-semibold text-brand-navy">
              {new Date(assignment.dueDate).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 rounded-xl bg-brand-cream p-3 text-center">
            {[
              ['Days', timeLeft.days ?? 0],
              ['Hours', timeLeft.hours ?? 0],
              ['Min', timeLeft.minutes ?? 0],
              ['Sec', timeLeft.seconds ?? 0],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-white p-2">
                <div className="text-2xl font-bold text-brand-navy">{value}</div>
                <div className="text-[10px] uppercase tracking-[0.12em] text-brand-dark">{label}</div>
              </div>
            ))}
          </div>

          {timeLeft.overdue ? (
            <div className="rounded-xl border border-brand-gold/50 bg-brand-cream p-3 text-sm text-brand-navy">
              This assignment is overdue. Late submissions may incur deduction or be marked as late.
            </div>
          ) : (
            <div className="rounded-xl border border-brand-gold/50 bg-brand-gold/15 p-3 text-sm text-brand-navy">
              Submission is still within the allowed timeline.
            </div>
          )}

          <div className="rounded-xl bg-brand-cream p-3 text-sm text-brand-dark">
            <p className="font-medium text-brand-navy">Max marks: {assignment.maxMarks}</p>
            <p className="mt-1">Status: {assignment.status}</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default AssignmentDetails
