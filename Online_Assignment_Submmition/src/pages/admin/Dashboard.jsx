import EmptyState from '../../components/EmptyState.jsx'
import StatCard from '../../components/StatCard.jsx'
import { fetchAdminDashboard } from '../../services/api.js'
import { PageHeader, PageState } from './AdminUI.jsx'
import { formatDate, useMockResource } from './adminUtils.js'
import Button from '../../components/Button.jsx'

const loadDashboard = () => fetchAdminDashboard()

function Dashboard({ onNavigate }) {
  const { data, error, loading, retry } = useMockResource(loadDashboard)
  const recentActivity = [...(data?.recentActivity || [])]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 5)

  return (
    <PageState error={error} loading={loading} onRetry={retry} title="Dashboard unavailable">
      {data ? (
        <div className="space-y-6">
          <PageHeader
            action={(
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => onNavigate('admin-add-student')} size="sm">Add Student</Button>
                <Button onClick={() => onNavigate('admin-add-instructor')} size="sm">Add Instructor</Button>
                <Button onClick={() => onNavigate('admin-bulk-upload')} size="sm" variant="outline">Bulk Upload</Button>
              </div>
            )}
            description="A snapshot of accounts, courses, and learning activity across the platform."
            title="Admin dashboard"
          />
          <section aria-label="Account summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Total students" value={data.accountStats?.students ?? data.students} tone="blue" />
            <StatCard label="Total instructors" value={data.accountStats?.instructors ?? data.instructors} tone="green" />
            <StatCard label="Active accounts" value={data.accountStats?.active ?? 0} tone="green" />
            <StatCard label="Pending accounts" value={data.accountStats?.pending ?? 0} tone="amber" />
            <StatCard label="Inactive accounts" value={data.accountStats?.inactive ?? 0} tone="slate" />
          </section>
          <section aria-label="Learning platform summary" className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Courses" value={data.totalCourses} tone="blue" />
            <StatCard label="Published assignments" value={data.activeAssignments} tone="amber" />
            <StatCard label="Submissions" value={data.totalSubmissions} tone="slate" />
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <section aria-labelledby="recent-registrations-title" className="rounded-2xl border border-brand-silver bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-brand-navy" id="recent-registrations-title">Recent registrations</h2>
                <button className="text-sm font-medium text-brand-royal hover:underline focus-visible:outline-2 focus-visible:outline-brand-royal" onClick={() => onNavigate('admin-users')} type="button">Manage users</button>
              </div>
              {data.recentRegistrations?.length ? (
                <ul className="mt-4 divide-y divide-brand-silver">
                  {data.recentRegistrations.map((user) => (
                    <li className="flex items-center justify-between gap-3 py-3" key={user.id}>
                      <div><p className="text-sm font-medium text-brand-navy">{user.name}</p><p className="text-xs capitalize text-brand-dark">{user.role} · {user.department}</p></div>
                      <div className="text-right"><p className="text-xs text-brand-dark">{user.userId || user.universityId || user.id}</p><time className="text-xs text-brand-dark" dateTime={user.joinedAt}>{formatDate(user.joinedAt, { dateStyle: 'medium' })}</time></div>
                    </li>
                  ))}
                </ul>
              ) : <EmptyState title="No recent registrations" description="New accounts will appear here." />}
            </section>

            <section aria-labelledby="recent-imports-title" className="rounded-2xl border border-brand-silver bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-brand-navy" id="recent-imports-title">Recent imports</h2>
                <button className="text-sm font-medium text-brand-royal hover:underline focus-visible:outline-2 focus-visible:outline-brand-royal" onClick={() => onNavigate('admin-import-history')} type="button">Import history</button>
              </div>
              {data.recentImports?.length ? (
                <ul className="mt-4 divide-y divide-brand-silver">
                  {data.recentImports.map((item) => (
                    <li className="flex items-center justify-between gap-3 py-3" key={item.id}>
                      <div><p className="text-sm font-medium text-brand-navy">{item.fileName}</p><p className="text-xs capitalize text-brand-dark">{item.type}s · {item.admin}</p></div>
                      <div className="text-right"><p className="text-xs text-brand-dark">{item.successful} created · {item.skipped} skipped</p><time className="text-xs text-brand-dark" dateTime={item.createdAt}>{formatDate(item.createdAt)}</time></div>
                    </li>
                  ))}
                </ul>
              ) : <EmptyState title="No imports yet" description="Completed bulk imports will appear here." />}
            </section>
          </div>
          <section aria-labelledby="recent-activity-title" className="rounded-2xl border border-brand-silver bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-brand-navy" id="recent-activity-title">Recent activity</h2>
            {data.recentActivity?.length ? (
              <ol className="mt-4 divide-y divide-brand-silver">
                {recentActivity.map((item) => (
                  <li className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between" key={item.id}>
                    <div><p className="text-sm font-medium text-brand-navy">{item.action}</p><p className="mt-1 text-sm text-brand-dark">{item.actor} <span aria-hidden="true">·</span> {item.target}</p></div>
                    <time className="text-xs text-brand-dark" dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
                  </li>
                ))}
              </ol>
            ) : <EmptyState title="No recent activity" description="Activity will appear here as users work in the platform." />}
          </section>
        </div>
      ) : <EmptyState title="No dashboard data" description="Dashboard information is not available yet." />}
    </PageState>
  )
}

export default Dashboard
