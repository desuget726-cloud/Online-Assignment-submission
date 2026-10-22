import { useMemo, useState } from 'react'
import EmptyState from '../../components/EmptyState.jsx'
import { fetchAdminActivityLog } from '../../services/api.js'
import { PageHeader, PageState } from './AdminUI.jsx'
import { formatDate, inputClass, useMockResource } from './adminUtils.js'

const loadActivity = () => fetchAdminActivityLog()

function ActivityLog() {
  const { data, error, loading, retry } = useMockResource(loadActivity)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const entries = useMemo(() => {
    if (!data) return []
    const needle = query.trim().toLowerCase()
    return [...data]
      .filter((entry) => {
        const matchesQuery = !needle || [entry.actor, entry.action, entry.target, entry.category]
          .some((value) => String(value || '').toLowerCase().includes(needle))
        return matchesQuery && (category === 'all' || entry.category === category)
      })
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
  }, [category, data, query])
  const categories = [...new Set((data || []).map((entry) => entry.category).filter(Boolean))]

  return (
    <PageState error={error} loading={loading} onRetry={retry} title="Activity log unavailable">
      <div className="space-y-6">
        <PageHeader description="Review notable account and learning activity recorded in the system." title="Activity log" />
        <section aria-label="Activity filters" className="flex flex-col gap-3 rounded-xl border border-brand-silver bg-white p-4 shadow-sm sm:flex-row">
          <div className="flex-1">
            <label className="sr-only" htmlFor="activity-search">Search activity</label>
            <input
              className={`${inputClass} mt-0`}
              id="activity-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search actor, activity, or target"
              type="search"
              value={query}
            />
          </div>
          <div className="sm:w-52">
            <label className="sr-only" htmlFor="activity-category">Filter by activity type</label>
            <select className={`${inputClass} mt-0`} id="activity-category" onChange={(event) => setCategory(event.target.value)} value={category}>
              <option value="all">All activity types</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </section>

        {!data?.length ? (
          <EmptyState title="No activity recorded" description="New activity will be listed here." />
        ) : entries.length === 0 ? (
          <EmptyState title="No matching activity" description="Try another search or category." />
        ) : (
          <section aria-label="Activity entries" className="rounded-2xl border border-brand-silver bg-white p-5 shadow-sm">
            <ol className="divide-y divide-brand-silver">
              {entries.map((entry) => (
                <li className="flex gap-4 py-5 first:pt-0 last:pb-0" key={entry.id}>
                  <span aria-hidden="true" className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-cream text-sm font-semibold text-brand-royal">
                    {(entry.category || 'A').slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium text-brand-navy">{entry.action}</p>
                        <p className="mt-1 text-sm text-brand-dark">{entry.actor} <span aria-hidden="true">·</span> {entry.target}</p>
                      </div>
                      <span className="w-fit rounded-full bg-brand-silver px-2.5 py-1 text-xs font-medium text-brand-dark">{entry.category || 'Other'}</span>
                    </div>
                    <time className="mt-2 block text-xs text-brand-dark" dateTime={entry.createdAt}>{formatDate(entry.createdAt)}</time>
                  </div>
                </li>
              ))}
            </ol>
            <p aria-live="polite" className="mt-5 border-t border-brand-silver pt-4 text-xs text-brand-dark">
              Showing {entries.length} of {data.length} activity records
            </p>
          </section>
        )}
      </div>
    </PageState>
  )
}

export default ActivityLog
