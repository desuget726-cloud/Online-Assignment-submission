import { useState } from 'react'
import Button from '../../components/Button.jsx'
import { useAuth } from '../../context/useAuth.js'
import { validateEmail, validatePassword } from '../../utils/validators.js'

function Login({ onNavigate }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setSubmitError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const emailError = validateEmail(form.email)
    const passwordError = validatePassword(form.password)
    const nextErrors = {
      email: emailError,
      password: passwordError,
    }

    setErrors(nextErrors)
    if (emailError || passwordError) return

    const account = login({
      email: form.email,
      password: form.password,
    })

    if (!account) {
      setSubmitError('Invalid email or password. Check your sign-in details and try again.')
      return
    }

    onNavigate(`${account.role}-dashboard`)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-cream px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-brand-silver bg-white shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-center bg-gradient-to-br from-brand-navy to-brand-royal px-8 py-10 text-white sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-cream">
            Mekdela Amba University
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            Online Assignment Submission and Evaluation System
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-brand-cream">
            Streamline assignment delivery, grading, and review for students, instructors,
            and administrators in one secure portal.
          </p>

        </section>

        <section className="px-5 py-8 sm:px-8">
          <div className="mx-auto max-w-md">
            <img
              alt="Mekdela Amba University logo"
              className="mx-auto mb-6 h-20 w-auto rounded-full border-4 border-brand-gold object-cover"
              src="/logo.png"
            />
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-royal">
                Welcome back
              </p>
              <h2 className="mt-2 text-3xl font-bold text-brand-navy">Log in</h2>
            </div>

            <form className="space-y-5" noValidate onSubmit={handleSubmit}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-dark" htmlFor="login-email">
                  Email address
                </label>
                <input
                  aria-invalid={Boolean(errors.email)}
                  className="w-full rounded-xl border border-brand-silver bg-white px-3.5 py-2.5 text-brand-navy transition focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  id="login-email"
                  name="email"
                  onChange={handleChange}
                  placeholder="student@mekdela.edu"
                  type="email"
                  value={form.email}
                />
                {errors.email ? <p className="mt-2 text-sm text-brand-navy">{errors.email}</p> : null}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-dark" htmlFor="login-password">
                  Password
                </label>
                <div className="relative">
                  <input
                    aria-invalid={Boolean(errors.password)}
                    className="w-full rounded-xl border border-brand-silver bg-white px-3.5 py-2.5 pr-12 text-brand-navy transition focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                    id="login-password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-3 flex items-center text-sm font-medium text-brand-dark hover:text-brand-dark"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password ? <p className="mt-2 text-sm text-brand-navy">{errors.password}</p> : null}
              </div>

              {submitError ? (
                <p className="rounded-xl border border-brand-gold/50 bg-brand-cream px-3 py-2 text-sm text-brand-navy">
                  {submitError}
                </p>
              ) : null}

              <Button className="w-full" type="submit" variant="accent">
                Sign in
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-between gap-3 text-sm">
              <button
                type="button"
                className="font-medium text-brand-royal hover:text-brand-navy"
                onClick={() => onNavigate('forgot-password')}
              >
                Forgot password?
              </button>
              <button
                type="button"
                className="font-medium text-brand-dark hover:text-brand-dark"
                onClick={() => onNavigate('register')}
              >
                Create account
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Login
