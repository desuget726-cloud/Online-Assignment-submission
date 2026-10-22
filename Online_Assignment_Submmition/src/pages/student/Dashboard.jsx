import { useEffect, useState } from 'react'
import AssignmentCard from '../../components/AssignmentCard.jsx'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import StatCard from '../../components/StatCard.jsx'
import { fetchStudentDashboardData } from '../../services/api.js'

function Dashboard({ onNavigate, onSelectAssignment }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCancelled = false

    const load = async () => {
      try {
        setLoading(true)
        const result = await fetchStudentDashboardData()
        if (!isCancelled) setData(result)
      } catch (loadError) {
        if (!isCancelled) setError(loadError.message || 'Unable to load dashboard data.')
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    load()
    return () => {
      isCancelled = true
    }
  }, [])

  if (loading) return <LoadingSpinner label="Loading dashboard..." />
  if (error) return <EmptyState title="Dashboard unavailable" description={error} />
  if (!data) return <EmptyState title="No dashboard data" description="No dashboard data is available yet." />

  const { stats, upcomingAssignments, recentGrades, notifications } = data

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-royal">Overview</p>
          <h2 className="mt-2 text-3xl font-bold text-brand-navy">Student dashboard</h2>
        </div>
        <Button onClick={() => onNavigate('student-assignments')}>View assignments</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<span className="text-xl">📚</span>} label="Total courses" value={stats.totalCourses} tone="blue" />
        <StatCard icon={<span className="text-xl">⏳</span>} label="Pending" value={stats.pendingAssignments} tone="amber" />
        <StatCard icon={<span className="text-xl">✅</span>} label="Submitted" value={stats.submittedAssignments} tone="green" />
        <StatCard icon={<span className="text-xl">🏅</span>} label="Graded" value={stats.gradedAssignments} tone="slate" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="space-y-4 rounded-2xl border border-brand-silver bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-brand-navy">Upcoming deadlines</h3>
            <button type="button" className="text-sm font-medium text-brand-royal" onClick={() => onNavigate('student-assignments')}>
              All assignments
            </button>
          </div>

          {upcomingAssignments.length ? (
            <div className="space-y-4">
              {upcomingAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  actionLabel="Details"
                  assignment={assignment}
                  onSubmit={() => {
                    onSelectAssignment(assignment.id)
                    onNavigate('student-submit-assignment')
                  }}
                  onView={() => {
                    onSelectAssignment(assignment.id)
                    onNavigate('student-assignment-details')
                  }}
                  showSubmit
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No upcoming work" description="You are all caught up for now." />
          )}
        </section>

        <aside className="space-y-4 rounded-2xl border border-brand-silver bg-white p-5 shadow-sm">
          <h3 className="text-xl font-semibold text-brand-navy">Recent grades</h3>
          {recentGrades.length ? (
            <div className="space-y-3">
              {recentGrades.map((grade) => (
                <div key={grade.id} className="rounded-xl bg-brand-cream p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-brand-navy">{grade.assignment}</p>
                    <span className="rounded-full bg-brand-gold/20 px-2 py-1 text-xs font-semibold text-brand-navy">
                      {grade.grade ?? 'Pending'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-brand-dark">{grade.course}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No grades yet" description="Once graded, your recent results will appear here." />
          )}

          <div className="rounded-xl border border-brand-silver bg-brand-cream p-3">
            <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-dark">Notifications</h4>
            <div className="mt-3 space-y-2">
              {notifications.length ? (
                notifications.map((item) => (
                  <div key={item.id} className="rounded-lg bg-white p-2">
                    <p className="text-sm font-medium text-brand-dark">{item.title}</p>
                    <p className="mt-1 text-xs text-brand-dark">{item.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-brand-dark">You are up to date.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Dashboard
