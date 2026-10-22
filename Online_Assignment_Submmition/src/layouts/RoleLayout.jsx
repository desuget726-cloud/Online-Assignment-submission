import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'

function RoleLayout({ activePage, children, onLogout, onNavigate, role, title, user, items }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-brand-cream text-brand-navy">
      <div className="flex min-h-screen">
        {sidebarOpen && (
          <button
            aria-label="Close navigation menu"
            className="fixed inset-0 z-30 bg-brand-dark/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            type="button"
          />
        )}
        <div
          className={`fixed inset-y-0 left-0 z-40 transform transition-transform lg:static lg:transform-none ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar
            activePage={activePage}
            items={items}
            onClose={() => setSidebarOpen(false)}
            onNavigate={onNavigate}
            role={role}
            user={user}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar
            menuOpen={sidebarOpen}
            onLogout={onLogout}
            onMenuClick={() => setSidebarOpen(true)}
            onNavigate={onNavigate}
            title={title}
            user={user}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          <footer className="border-t border-brand-gold bg-brand-navy px-6 py-4 text-center text-xs text-white">
            Mekdela Amba University · Online Assignment Submission and Evaluation System
          </footer>
        </div>
      </div>
    </div>
  )
}

export default RoleLayout
