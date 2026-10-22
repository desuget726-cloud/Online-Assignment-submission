import { useState } from 'react'
import Button from '../../components/Button.jsx'
import { validateEmail } from '../../utils/validators.js'

function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const emailError = validateEmail(email)
    setError(emailError)
    if (emailError) {
      setSuccess('')
      return
    }

    setSuccess('Password reset instructions have been queued for this email address.')
    setError('')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-cream px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-brand-silver bg-white p-6 shadow-sm sm:p-8">
        <img
          alt="Mekdela Amba University logo"
          className="mx-auto mb-6 h-20 w-auto rounded-full border-4 border-brand-gold object-cover"
          src="/logo.png"
        />
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-royal">Reset access</p>
          <h1 className="mt-2 text-3xl font-bold text-brand-navy">Forgot password</h1>
        </div>

        <form className="space-y-5" noValidate onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand-dark" htmlFor="forgot-email">
              Email address
            </label>
            <input
              aria-invalid={Boolean(error)}
              className="w-full rounded-xl border border-brand-silver bg-white px-3.5 py-2.5 text-brand-navy transition focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              id="forgot-email"
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
                setSuccess('')
              }}
              placeholder="name@mekdela.edu"
              type="email"
              value={email}
            />
            {error ? <p className="mt-2 text-sm text-brand-navy">{error}</p> : null}
          </div>

          {success ? (
            <p className="rounded-xl border border-brand-gold/50 bg-brand-gold/15 px-3 py-2 text-sm text-brand-navy">
              {success}
            </p>
          ) : null}

          <Button className="w-full" type="submit">
            Send reset link
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-dark">
          Remembered your password?{' '}
          <button
            type="button"
            className="font-medium text-brand-royal hover:text-brand-navy"
            onClick={() => onNavigate('login')}
          >
            Back to login
          </button>
        </p>
      </section>
    </main>
  )
}

export default ForgotPassword
