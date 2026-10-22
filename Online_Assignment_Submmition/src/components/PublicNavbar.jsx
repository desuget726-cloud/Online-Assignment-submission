import { useEffect, useState } from 'react'

const links = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
  { label: 'Features', page: 'services' },
  { label: 'Contact', page: 'contact' },
  { label: 'Login', page: 'login' },
]

const activePages = {
  home: 'home',
  about: 'about',
  services: 'services',
  contact: 'contact',
  login: 'login',
  register: 'login',
  forgot: 'login',
}

function PublicNavbar({ activePage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const selectedPage = activePages[activePage] || activePage

  useEffect(() => {
    if (!menuOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const navigate = (link) => {
    setMenuOpen(false)
    onNavigate(link.page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pageLink = (link, mobile = false) => (
    <button
      aria-current={selectedPage === link.page ? 'page' : undefined}
      className={`relative rounded-md px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 ${
        selectedPage === link.page
          ? 'font-bold text-brand-navy after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:bg-brand-gold'
          : 'font-medium text-brand-dark hover:text-brand-navy'
      } ${mobile ? 'w-full text-left' : ''}`}
      key={link.page}
      onClick={() => navigate(link)}
      type="button"
    >
      {link.label}
    </button>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-brand-silver bg-white">
      <nav
        aria-label="Main"
        className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8"
      >
        <button
          aria-label="Mekdela Amba University home"
          className="flex min-w-0 items-center gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          onClick={() => navigate(links[0])}
          type="button"
        >
          <img
            alt=""
            className="h-10 w-10 shrink-0 rounded-full object-cover object-[53%_40%]"
            src="/logo.png"
          />
          <span className="max-w-52 text-sm font-bold leading-tight text-brand-navy sm:max-w-none sm:text-base">
            Online assignment submission
          </span>
        </button>

        <ul className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <li key={link.page}>{pageLink(link)}</li>
          ))}
        </ul>

        <button
          aria-controls="public-mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-silver text-brand-navy hover:bg-brand-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? (
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
          ) : (
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
          )}
        </button>
      </nav>

      <div
        className={`${menuOpen ? 'block' : 'hidden'} border-t border-brand-silver bg-white px-4 py-3 shadow-md lg:hidden`}
        id="public-mobile-navigation"
      >
        <ul className="mx-auto flex max-w-7xl flex-col gap-1">
          {links.map((link) => <li key={link.page}>{pageLink(link, true)}</li>)}
        </ul>
      </div>
    </header>
  )
}

export default PublicNavbar
