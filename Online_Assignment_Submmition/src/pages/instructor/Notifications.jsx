import { useState } from 'react'
import Button from '../../components/Button.jsx'
import { fetchInstructorNotifications, markNotificationRead } from '../../services/api.js'
import { cardClass, formatDate, pageClass } from './instructorData.js'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
} from './shared.jsx'
import { useInstructorResource } from './useInstructorResource.js'

function Notifications({ loading: externalLoading = false, error: externalError = '', onRetry }) {
  const resource = useInstructorResource(fetchInstructorNotifications, [])
  const items = resource.data || []
  const [filter, setFilter] = useState('All')
  const [actionError, setActionError] = useState('')
  const visible = items.filter((item) => filter === 'All' || item.unread)

  const markRead = async (item) => {
    setActionError('')
    try {
      const updated = await markNotificationRead(item.id)
      resource.setData((current) => current.map((notification) => notification.id === item.id ? updated : notification))
    } catch (cause) {
      setActionError(cause?.message || 'Could not update this notification.')
    }
  }

  const markAllRead = async () => {
    const unread = items.filter((item) => item.unread)
    try {
      const updatedRows = await Promise.all(unread.map((item) => markNotificationRead(item.id)))
      const updates = new Map(updatedRows.map((item) => [item.id, item]))
      resource.setData((current) => current.map((item) => updates.get(item.id) || item))
      setActionError('')
    } catch (cause) {
      setActionError(cause?.message || 'Could not mark all notifications as read.')
    }
  }

  const loading = externalLoading || resource.loading
  const error = externalError || resource.error
  if (loading) return <LoadingState label="Loading notifications…" />
  if (error) return <ErrorState message={error} onRetry={onRetry || resource.retry} />

  const unreadCount = items.filter((item) => item.unread).length
  return (
    <div className={pageClass}>
      <PageHeading title="Notifications" description="Keep up with assignment activity, submissions, and course updates.">
        <Button disabled={!unreadCount} onClick={markAllRead} variant="outline">Mark all as read</Button>
      </PageHeading>
      {actionError ? <ErrorState message={actionError} /> : null}
      <section aria-label="Notification filters" className={`${cardClass} p-4`}>
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Unread'].map((option) => (
            <button
              aria-pressed={filter === option}
              className={`rounded-lg px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-royal ${filter === option ? 'bg-brand-navy text-white' : 'text-brand-dark hover:bg-brand-silver'}`}
              key={option}
              onClick={() => setFilter(option)}
              type="button"
            >
              {option}{option === 'Unread' ? ` (${unreadCount})` : ''}
            </button>
          ))}
        </div>
      </section>
      <section aria-label="Notifications list" className="space-y-3">
        {visible.length ? visible.map((item) => (
          <article className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${item.unread ? 'border-l-4 border-l-blue-600' : ''}`} key={item.id}>
            <div className="flex gap-3">
              <span aria-hidden="true" className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.unread ? 'bg-brand-navy' : 'bg-brand-silver'}`} />
              <div>
                <h2 className="font-semibold text-brand-navy">{item.title}{item.unread ? <span className="sr-only">, unread</span> : null}</h2>
                <p className="mt-1 text-sm leading-6 text-brand-dark">{item.message}</p>
                <time className="mt-2 block text-xs text-brand-dark" dateTime={item.time}>{formatDate(item.time)}</time>
              </div>
            </div>
            {item.unread ? <Button onClick={() => markRead(item)} size="sm" variant="outline">Mark as read</Button> : <span className="text-xs font-medium text-brand-dark">Read</span>}
          </article>
        )) : (
          <EmptyState title={filter === 'Unread' ? 'You’re all caught up' : 'No notifications'} message={filter === 'Unread' ? 'There are no unread notifications.' : 'New updates will appear here.'} />
        )}
      </section>
    </div>
  )
}

export default Notifications
