import EmptyState from '../../components/EmptyState.jsx'
import StatCard from '../../components/StatCard.jsx'
import { fetchAdminReports } from '../../services/api.js'
import { PageHeader, PageState } from './AdminUI.jsx'
import { useMockResource } from './adminUtils.js'

const loadReports = () => fetchAdminReports()

function BarChart({ data, emptyMessage, title }) {
  const max = Math.max(1, ...data.map((item) => item.value))
  return (
    <section aria-labelledby={`${title.toLowerCase().replaceAll(' ', '-')}-title`} className="rounded-2xl border border-brand-silver bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-brand-navy" id={`${title.toLowerCase().replaceAll(' ', '-')}-title`}>{title}</h2>
      {data.length ? (
        <div
          aria-label={`${title}: ${data.map((item) => `${item.label}: ${item.value}`).join(', ')}`}
          className="mt-5 space-y-4"
          role="img"
        >
          {data.map((item) => (
            <div key={item.label}>
              <div className="mb-1.5 flex justify-between gap-3 text-sm">
                <span className="text-brand-dark">{item.label}</span>
                <span className="font-semibold tabular-nums text-brand-navy">{item.value}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-brand-silver">
                <div
                  className="h-full min-w-1 rounded-full bg-brand-navy transition-[width]"
                  style={{ width: `${item.value ? Math.max(3, (item.value / max) * 100) : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : <EmptyState title="No report data" description={emptyMessage} />}
    </section>
  )
}

function Reports() {
  const { data, error, loading, retry } = useMockResource(loadReports)

  return (
    <PageState error={error} loading={loading} onRetry={retry} title="Reports unavailable">
      {data ? (
        <div className="space-y-6">
          <PageHeader description="A quick view of enrollment, course mix, and submission status." title="Reports" />
          <section aria-label="Report summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={<span aria-hidden="true">👥</span>} label="User accounts" value={data.usersByRole.reduce((sum, item) => sum + item.value, 0)} tone="blue" />
            <StatCard icon={<span aria-hidden="true">👩‍🏫</span>} label="Instructors" value={data.usersByRole.find((item) => item.label.toLowerCase() === 'instructors')?.value || 0} tone="green" />
            <StatCard icon={<span aria-hidden="true">📚</span>} label="Courses with enrollment" value={data.courseEnrollment.length} tone="amber" />
            <StatCard icon={<span aria-hidden="true">📨</span>} label="Submissions" value={data.submissionsByStatus.reduce((sum, item) => sum + item.value, 0)} tone="slate" />
          </section>
          <div className="grid gap-5 lg:grid-cols-2">
            <BarChart
              data={data.usersByRole}
              emptyMessage="User role breakdown is not available."
              title="Users by role"
            />
            <BarChart
              data={data.courseEnrollment}
              emptyMessage="Course enrollment is not available."
              title="Course enrollment"
            />
            <BarChart
              data={data.submissionsByStatus}
              emptyMessage="Submission status breakdown is not available."
              title="Submission status"
            />
          </div>
          <p className="text-xs text-brand-dark">Charts reflect the currently available sample records.</p>
        </div>
      ) : <EmptyState title="No report data" description="Report information is not available yet." />}
    </PageState>
  )
}

export default Reports
