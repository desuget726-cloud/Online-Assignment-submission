import { homeWorkflows } from '../../data/homeContent.js'
import Reveal from './Reveal.jsx'

// Shows the student and instructor workflows as ordered steps.
function HowItWorksSection() {
  return (
    <section aria-labelledby="how-it-works-title" className="py-16 sm:py-20" id="how-it-works">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-royal">Simple by design</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy sm:text-4xl" id="how-it-works-title">
            How it works
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {homeWorkflows.map((workflow) => (
            <Reveal key={workflow.role}>
              <article className="h-full rounded-2xl border border-brand-silver bg-white p-6 shadow-sm sm:p-8">
                <h3 className="text-2xl font-bold text-brand-navy">{workflow.role}</h3>
                <p className="mt-2 leading-7 text-brand-dark">{workflow.description}</p>
                <ol className="mt-6 grid gap-3 sm:grid-cols-2">
                  {workflow.steps.map((step, index) => (
                    <li className="flex min-h-20 items-center gap-3 rounded-xl bg-brand-cream p-4" key={step}>
                      <span
                        aria-label={`Step ${index + 1}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gold font-bold text-brand-navy"
                      >
                        {index + 1}
                      </span>
                      <span className="font-semibold text-brand-dark">{step}</span>
                    </li>
                  ))}
                </ol>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
