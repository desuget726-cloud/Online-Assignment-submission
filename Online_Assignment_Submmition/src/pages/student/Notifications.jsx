import { useEffect, useState } from 'react'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import {
  fetchStudentNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../services/api.js'

function Notifications() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchStudentNotifications()
        if (isMounted) setItems(data)
      } catch (loadError) {
        if (isMounted) setError(loadError.message || 'Unable to load notifications.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  const markAsRead = async (id) => {
    setActionError('')
    try {
      await markNotificationRead(id)
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, unread: false } : item)),
      )
    } catch (actionFailure) {
      setActionError(actionFailure.message || 'Unable to mark notification as read.')
    }
  }

  const markAllRead = async () => {
    setActionError('')
    try {
      await markAllNotificationsRead()
      setItems((current) => current.map((item) => ({ ...item, unread: false })))
    } catch (actionFailure) {
      setActionError(actionFailure.message || 'Unable to mark notifications as read.')
    }
  }

  if (loading) return <LoadingSpinner label="Loading notifications..." />
  if (error) return <EmptyState title="Notifications unavailable" description={error} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-royal">Inbox</p>
          <h2 className="mt-2 text-3xl font-bold text-brand-navy">Notifications</h2>
        </div>
        <Button onClick={markAllRead} variant="outline">Mark all read</Button>
      </div>

      {actionError ? (
        <p className="rounded-xl border border-brand-gold/50 bg-brand-cream px-4 py-3 text-sm text-brand-navy" role="alert">
          {actionError}
        </p>
      ) : null}

      {items.length ? (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className={`rounded-2xl border p-4 shadow-sm ${item.unread ? 'border-brand-gold/50 bg-brand-cream' : 'border-brand-silver bg-white'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {item.unread ? <span className="h-2.5 w-2.5 rounded-full bg-brand-navy" /> : null}
                    <h3 className="text-lg font-semibold text-brand-navy">{item.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-brand-dark">{item.message}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-brand-dark">
                    {new Date(item.time).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>

                {item.unread ? (
                  <Button onClick={() => markAsRead(item.id)} size="sm" variant="secondary">
                    Mark as read
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No notifications" description="You are all caught up." />
      )}
    </div>
  )
}

export default Notifications
