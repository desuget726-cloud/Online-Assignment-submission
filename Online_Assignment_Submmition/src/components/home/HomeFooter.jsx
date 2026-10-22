import { homeContent } from '../../data/homeContent.js'

const footerLinks = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
  { label: 'Features', page: 'services' },
  { label: 'Contact', page: 'contact' },
]

// Provides consistent public-site navigation and university contact details.
function HomeFooter({ onNavigate }) {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="text-lg font-bold">Mekdela Amba University</p>
          <p className="mt-3 text-sm leading-6 text-brand-cream">
            Online Assignment Submission and Evaluation System
          </p>
        </div>
        <nav aria-label="Footer quick links">
          <h2 className="font-semibold text-brand-gold">Quick links</h2>
          <ul className="mt-3 space-y-2 text-sm text-brand-cream">
            {footerLinks.map(({ label, page }) => (
              <li key={page}>
                <button
                  className="rounded hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                  onClick={() => onNavigate(page)}
                  type="button"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="font-semibold text-brand-gold">Useful links</h2>
          <ul className="mt-3 space-y-2 text-sm text-brand-cream">
            <li><button className="rounded hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold" onClick={() => onNavigate('login')} type="button">Sign in</button></li>
            <li><button className="rounded hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold" onClick={() => onNavigate('register')} type="button">Create an account</button></li>
          </ul>
          <div aria-label="University social media" className="mt-5 flex items-center gap-3 text-brand-cream">
            <span className="sr-only">Social media links will be published here.</span>
            {['f', 'in', '▶'].map((mark) => (
              <span aria-hidden="true" className="flex h-8 min-w-8 items-center justify-center rounded-full border border-white/30 px-2 text-xs font-bold" key={mark}>
                {mark}
              </span>
            ))}
          </div>
        </div>
        <address className="not-italic text-sm leading-6 text-brand-cream">
          <h2 className="font-semibold text-brand-gold">Contact</h2>
          <p className="mt-3">{homeContent.contact.address}</p>
          <a className="mt-2 block hover:text-brand-gold" href={`tel:${homeContent.contact.phone.replaceAll(' ', '')}`}>{homeContent.contact.phone}</a>
          <a className="mt-1 block break-all hover:text-brand-gold" href={`mailto:${homeContent.contact.email}`}>{homeContent.contact.email}</a>
        </address>
      </div>
      <div className="border-t border-white/15 px-4 py-5 text-center text-sm text-brand-cream">
        © 2026 Mekdela Amba University. All rights reserved.
      </div>
    </footer>
  )
}

export default HomeFooter
