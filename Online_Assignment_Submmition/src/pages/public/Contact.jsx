import { useState } from 'react'
import { validateEmail } from '../../utils/validators.js'

const emptyForm = { name: '', email: '', message: '' }

function Contact() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setSent(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {
      name: form.name.trim() ? '' : 'Name is required.',
      email: validateEmail(form.email),
      message: form.message.trim() ? '' : 'Message is required.',
    }
    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) return

    setSent(true)
    setForm(emptyForm)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-royal">Get in touch</p>
        <h1 className="mt-3 text-4xl font-bold text-brand-navy sm:text-5xl">Contact us</h1>
        <p className="mt-4 leading-7 text-brand-dark">
          Send a message to the Mekdela Amba University team. This sample form does not
          send information to a server.
        </p>
      </header>

      <div className="mt-9 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          className="rounded-2xl border border-brand-silver bg-white p-6 shadow-sm sm:p-8"
          noValidate
          onSubmit={handleSubmit}
        >
          {sent ? (
            <p
              aria-live="polite"
              className="mb-6 rounded-xl border border-brand-gold bg-brand-cream px-4 py-3 font-medium text-brand-navy"
              role="status"
            >
              Thank you. Your message has been recorded for this sample.
            </p>
          ) : null}

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-dark" htmlFor="contact-name">
                Name
              </label>
              <input
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                aria-invalid={Boolean(errors.name)}
                className="w-full rounded-xl border border-brand-silver px-3.5 py-2.5 text-brand-navy focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                id="contact-name"
                name="name"
                onChange={handleChange}
                type="text"
                value={form.name}
              />
              {errors.name ? <p className="mt-2 text-sm text-brand-navy" id="contact-name-error">{errors.name}</p> : null}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-dark" htmlFor="contact-email">
                Email
              </label>
              <input
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                aria-invalid={Boolean(errors.email)}
                className="w-full rounded-xl border border-brand-silver px-3.5 py-2.5 text-brand-navy focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                id="contact-email"
                name="email"
                onChange={handleChange}
                type="email"
                value={form.email}
              />
              {errors.email ? <p className="mt-2 text-sm text-brand-navy" id="contact-email-error">{errors.email}</p> : null}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-dark" htmlFor="contact-message">
                Message
              </label>
              <textarea
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                aria-invalid={Boolean(errors.message)}
                className="min-h-36 w-full rounded-xl border border-brand-silver px-3.5 py-2.5 text-brand-navy focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                id="contact-message"
                name="message"
                onChange={handleChange}
                rows="5"
                value={form.message}
              />
              {errors.message ? <p className="mt-2 text-sm text-brand-navy" id="contact-message-error">{errors.message}</p> : null}
            </div>
          </div>

          <button
            className="mt-6 rounded-lg bg-brand-gold px-6 py-3 font-semibold text-brand-navy transition hover:bg-brand-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            type="submit"
          >
            Send message
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-brand-silver bg-white p-6 shadow-sm sm:p-8">
          <div aria-hidden="true" className="mb-5 h-1.5 w-12 rounded-full bg-brand-gold" />
          <h2 className="text-2xl font-bold text-brand-navy">University contact</h2>
          <address className="mt-5 space-y-4 not-italic leading-7 text-brand-dark">
            <p className="font-semibold">Mekdela Amba University</p>
            <p>
              <span className="block text-sm font-semibold text-brand-navy">Email</span>
              <a className="break-all text-brand-royal hover:underline" href="mailto:info@mekdela.edu.et">
                info@mekdela.edu.et (placeholder)
              </a>
            </p>
            <p>
              <span className="block text-sm font-semibold text-brand-navy">Phone</span>
              <a className="text-brand-royal hover:underline" href="tel:+251000000000">
                +251 00 000 0000 (placeholder)
              </a>
            </p>
          </address>
        </aside>
      </div>
    </main>
  )
}

export default Contact
