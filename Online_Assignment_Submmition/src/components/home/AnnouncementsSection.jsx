import StatusBadge from '../StatusBadge.jsx'
import { announcements } from '../../data/homeContent.js'
import Reveal from './Reveal.jsx'

// Shares sample academic and system announcements with visitors.
function AnnouncementsSection() {
  return (
    <section aria-labelledby="announcements-title" className="scroll-mt-20 bg-white py-16 sm:py-20" id="announcements">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-royal">Stay informed</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy sm:text-4xl" id="announcements-title">
              Announcements
            </h2>
          </div>
          <p className="max-w-xl leading-7 text-brand-dark">Important reminders and updates for the university community.</p>
        </Reveal>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {announcements.map((announcement) => (
            <Reveal key={announcement.title}>
              <article className="h-full rounded-2xl border border-brand-silver bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <time className="text-sm font-medium text-brand-dark" dateTime={announcement.date}>
                    {new Date(`${announcement.date}T00:00:00`).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  <StatusBadge status={announcement.category} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-brand-navy">{announcement.title}</h3>
                <p className="mt-3 leading-7 text-brand-dark">{announcement.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AnnouncementsSection
