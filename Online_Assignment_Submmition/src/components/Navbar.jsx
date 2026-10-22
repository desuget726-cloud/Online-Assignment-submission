import { useEffect, useState } from 'react'
import {
  fetchInstructorNotifications,
  fetchStudentNotifications,
} from '../services/api.js'

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  )
}

function Navbar({
  menuOpen = false,
  onMenuClick,
  onNavigate,
  onLogout,
  title,
  user,
}) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationError, setNotificationError] = useState('')
  const profilePage = `${user.role}-profile`

  useEffect(() => {
    let active = true
    const loadUnreadCount = async () => {
      if (!['student', 'instructor'].includes(user.role)) {
        return
      }
      try {
        const items =
          user.role === 'instructor'
            ? await fetchInstructorNotifications()
            : await fetchStudentNotifications()
        if (active) {
          setUnreadCount(items.filter((item) => item.unread).length)
          setNotificationError('')
        }
      } catch (error) {
        if (active) {
          setNotificationError(error.message || 'Unable to refresh notifications.')
        }
      }
    }

    loadUnreadCount()
    window.addEventListener('assignment-system:notifications-updated', loadUnreadCount)
    return () => {
      active = false
      window.removeEventListener('assignment-system:notifications-updated', loadUnreadCount)
    }
  }, [user.role])

  return (
    <header className="flex h-16 items-center justify-between border-b border-brand-silver bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="rounded-md p-2 text-brand-dark hover:bg-brand-silver focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-royal lg:hidden"
          onClick={onMenuClick}
          type="button"
        >
          {menuOpen ? <span aria-hidden="true" className="text-xl leading-none">×</span> : <MenuIcon />}
        </button>
        <div className="flex shrink-0 items-center gap-2">
          <img alt="Mekdela Amba University logo" className="h-10 w-auto rounded-full border-2 border-brand-gold object-cover" src="/logo.png" />
          <span className="max-w-24 text-[10px] font-bold leading-tight text-brand-navy sm:max-w-36 sm:text-xs">Online Assignment submition</span>
        </div>
        <h1 className="hidden truncate text-lg font-semibold text-brand-navy md:block sm:text-xl">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3 sm:gap-5">
        {['student', 'instructor'].includes(user.role) ? (
          <>
            <button
              aria-label={`Notifications, ${unreadCount} unread`}
              aria-describedby={notificationError ? 'navbar-notification-error' : undefined}
              className="relative rounded-md p-2 text-brand-dark hover:bg-brand-silver focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-royal"
              onClick={() => onNavigate(`${user.role}-notifications`)}
              type="button"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {unreadCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-navy px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : null}
            </button>
            {notificationError ? (
              <span className="sr-only" id="navbar-notification-error" role="status">
                {notificationError}
              </span>
            ) : null}
          </>
        ) : null}
        <div className="relative">
          <button
            aria-expanded={profileMenuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-brand-silver focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-royal"
            onClick={() => setProfileMenuOpen((open) => !open)}
            type="button"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/15 text-sm font-semibold text-brand-navy">
              {user.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block max-w-36 truncate text-sm font-semibold text-brand-navy">{user.name}</span>
              <span className="block text-xs capitalize text-brand-dark">{user.role}</span>
            </span>
          </button>
          {profileMenuOpen ? (
            <div
              className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-brand-silver bg-white p-1.5 shadow-lg"
              role="menu"
            >
              <button
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-brand-dark hover:bg-brand-silver focus-visible:outline-2 focus-visible:outline-brand-royal"
                onClick={() => {
                  onNavigate(profilePage)
                  setProfileMenuOpen(false)
                }}
                role="menuitem"
                type="button"
              >
                My profile
              </button>
              <button
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-brand-navy hover:bg-brand-cream focus-visible:outline-2 focus-visible:outline-brand-royal"
                onClick={onLogout}
                role="menuitem"
                type="button"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Navbar
