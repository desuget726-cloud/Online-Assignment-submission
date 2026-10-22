const objectives = [
  'Provide students with a convenient way to submit assignments online.',
  'Enable instructors to receive and organize student submissions.',
  'Support clear assignment deadlines and timely notifications.',
  'Help instructors evaluate submitted work and share feedback.',
  'Show submission status, including submitted, late, and not submitted work.',
  'Maintain a secure history of assignment submissions and evaluations.',
  'Give students access to their grades and instructor feedback.',
  'Provide reports that help users review academic performance.',
  'Support administrators in overseeing users and assignment activity.',
]

function About() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-royal">About the system</p>
        <h1 className="mt-3 text-4xl font-bold text-brand-navy sm:text-5xl">
          A clearer path from assignment to feedback
        </h1>
        <p className="mt-6 text-lg leading-8 text-brand-dark">
          The Mekdela Amba University Online Assignment Submission and Evaluation System
          brings assignment activities into one digital workspace. Students can submit
          their work online, while instructors can evaluate submissions and provide
          feedback in an organized way.
        </p>
      </header>

      <section className="mt-10 rounded-2xl border-l-4 border-brand-gold bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-bold text-brand-navy">General objective</h2>
        <p className="mt-3 leading-7 text-brand-dark">
          To make assignment submission and evaluation more accessible and organized by
          helping students submit work online and enabling instructors to evaluate it and
          give feedback.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-brand-navy">Specific objectives</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {objectives.map((objective, index) => (
            <li
              className="flex gap-4 rounded-xl border border-brand-silver bg-white p-5"
              key={objective}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/20 font-bold text-brand-navy">
                {index + 1}
              </span>
              <p className="leading-6 text-brand-dark">{objective}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}

export default About
