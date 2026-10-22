const roleLabels = {
  student: 'Student',
  instructor: 'Instructor',
  admin: 'Administration',
}

function Sidebar({ activePage, items, onNavigate, onClose, role, user }) {
  return (
    <aside
      aria-label="Main navigation"
      className="flex h-full w-72 flex-col bg-brand-navy text-white lg:w-64"
      id="primary-navigation"
    >
      <div className="border-b border-brand-gold/30 px-6 py-5">
        <div className="flex items-center gap-3">
          <img alt="Online assignment Submission logo" className="h-10 w-auto shrink-0 rounded-full border-2 border-brand-gold object-cover" src="/logo.png" />
          <div className="min-w-0">
            <p className="text-sm font-bold leading-5 text-white">Online assignment Submission</p>
            <p className="mt-1 text-xs text-brand-cream">{roleLabels[role]}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {items.map(([id, label]) => (
          <button
            aria-current={activePage === id ? 'page' : undefined}
            className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-royal ${
              activePage === id
                ? 'border-l-4 border-brand-gold bg-brand-royal text-white'
                : 'border-l-4 border-transparent text-white/85 hover:bg-brand-royal hover:text-white'
            }`}
            key={id}
            onClick={() => {
              onNavigate(id)
              onClose()
            }}
            type="button"
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="border-t border-brand-gold/30 px-5 py-4">
        <p className="truncate text-sm font-medium text-white">{user.name}</p>
        <p className="truncate text-xs text-brand-cream">{user.email}</p>
      </div>
    </aside>
  )
}

export default Sidebar
