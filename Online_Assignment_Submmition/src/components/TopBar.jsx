import {
  topBarInfo,
  topBarQuickLinks,
  topBarSocialLinks,
} from '../data/homeContent.js'

const socialIcons = {
  facebook: <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z" />,
  telegram: <path d="m21 3-3.2 18-6.1-5.1-3.3 3.2.5-5.8L18 6 7.2 12.3 3 10.9 21 3Z" />,
  youtube: <path d="M21 8.2a2.5 2.5 0 0 0-1.8-1.8C17.6 6 12 6 12 6s-5.6 0-7.2.4A2.5 2.5 0 0 0 3 8.2 26 26 0 0 0 2.6 12c0 1.3.1 2.6.4 3.8a2.5 2.5 0 0 0 1.8 1.8C6.4 18 12 18 12 18s5.6 0 7.2-.4a2.5 2.5 0 0 0 1.8-1.8c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8ZM10 15V9l5 3-5 3Z" />,
  linkedin: <path d="M6.5 8.5A2 2 0 1 0 6.5 4.5a2 2 0 0 0 0 4ZM5 10h3v10H5zm5 0h3v1.4c.5-.9 1.5-1.6 3-1.6 3 0 4 1.9 4 4.7V20h-3v-4.8c0-1.5-.3-2.7-1.9-2.7-1.7 0-2.1 1.3-2.1 2.7V20h-3z" />,
}

function ContactIcon({ type }) {
  if (type === 'email') {
    return (
      <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
        <rect height="14" rx="2" stroke="currentColor" strokeWidth="1.7" width="20" x="2" y="5" />
        <path d="m3 7 9 7 9-7" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    )
  }
  if (type === 'phone') {
    return (
      <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
        <path d="m7 3 3 1-1 4-2 1a14 14 0 0 0 8 8l1-2 4-1 1 3-1 3a2 2 0 0 1-2 1C10 20 4 14 3 6a2 2 0 0 1 1-2l3-1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  )
}

// Displays university contact details and quick public-site shortcuts.
function TopBar({ onNavigate }) {
  const handleQuickLink = (link) => {
    onNavigate(link.page, link.role)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      aria-label="University contact and quick links"
      className="border-b border-brand-gold/40 bg-brand-dark text-xs text-white sm:text-sm"
      role="complementary"
    >
      <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-between gap-3 px-4 py-1.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <a
            className="inline-flex min-w-0 items-center gap-1.5 rounded-sm text-brand-cream transition hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            href={`mailto:${topBarInfo.email}`}
          >
            <ContactIcon type="email" />
            <span className="truncate">{topBarInfo.email}</span>
          </a>
          <a
            className="inline-flex shrink-0 items-center gap-1.5 rounded-sm text-brand-cream transition hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            href={`tel:${topBarInfo.phone.replaceAll(' ', '')}`}
          >
            <ContactIcon type="phone" />
            <span>{topBarInfo.phone}</span>
          </a>
          <span className="hidden items-center gap-1.5 text-brand-cream xl:inline-flex">
            <ContactIcon type="time" />
            {topBarInfo.workingHours}
          </span>
        </div>

        <div className="hidden shrink-0 items-center gap-4 md:flex">
          <nav aria-label="Quick links" className="flex items-center gap-3">
            {topBarQuickLinks.map((link) => (
              <button
                className="rounded-sm text-brand-cream transition hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                key={link.label}
                onClick={() => handleQuickLink(link)}
                type="button"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div aria-label="University social media" className="flex items-center gap-2">
            {topBarSocialLinks.map((link) => (
              <a
                aria-label={link.label}
                className="rounded-sm text-brand-cream transition hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                href={link.href}
                key={link.label}
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  {socialIcons[link.icon]}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
