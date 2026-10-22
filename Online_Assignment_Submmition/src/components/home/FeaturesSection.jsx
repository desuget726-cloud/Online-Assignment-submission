import { homeFeatures } from '../../data/homeContent.js'
import Reveal from './Reveal.jsx'

const featurePaths = {
  submission: 'M12 16V4m0 0L7 9m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3',
  grading: 'm4 16 4-1 9-9a2.1 2.1 0 0 0-3-3l-9 9-1 4ZM13 5l3 3M4 20h16',
  feedback: 'M8 10h8m-8 4h5m-1 7-4-4H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4l-3 4Z',
  notifications: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4',
  performance: 'M4 19V5m0 14h17m-14-4 4-4 3 2 6-7',
}

// Highlights the core features available to students and instructors.
function FeaturesSection() {
  return (
    <section aria-labelledby="features-title" className="scroll-mt-20 bg-brand-cream py-16 sm:py-20" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-royal">One connected workflow</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy sm:text-4xl" id="features-title">
            Tools for every step of the assignment journey
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {homeFeatures.map((feature) => (
            <Reveal key={feature.title}>
              <article className="h-full rounded-2xl border border-brand-silver bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-gold hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-navy">
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d={featurePaths[feature.icon]} />
                  </svg>
                </div>
                <h3 className="mt-5 text-xl font-bold text-brand-navy">{feature.title}</h3>
                <p className="mt-3 leading-7 text-brand-dark">{feature.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
