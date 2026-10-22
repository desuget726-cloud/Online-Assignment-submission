import { useState } from 'react'
import Button from '../Button.jsx'
import { useAuth } from '../../context/useAuth.js'
import { pagesByRole } from '../../utils/navigation.js'
import { validateEmail, validatePassword } from '../../utils/validators.js'
import Reveal from './Reveal.jsx'

const fieldClass =
  'w-full rounded-xl border border-brand-silver bg-white px-3.5 py-2.5 text-brand-navy transition focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-brand-gold/40'

// Provides sign-in and directs registration requests to administrator-controlled onboarding.
function AccessSection({ initialRole = 'student', onNavigate }) {
  const { login } = useAuth()
  const [tab, setTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ role: initialRole, identifier: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  const goToRoleHome = (role) => {
    const destination = pagesByRole[role]?.[0]?.[0]
    if (destination) onNavigate(destination)
    else setSubmitError('Unable to open the selected role workspace.')
  }

  const submit = (event) => {
    event.preventDefault()
    const identifierError = form.identifier.includes('@')
      ? validateEmail(form.identifier)
      : form.identifier.trim() ? '' : 'University ID or email is required.'
    const passwordError = validatePassword(form.password)
    const nextErrors = { identifier: identifierError, password: passwordError }
    setErrors(nextErrors)
    setSubmitError('')
    if (identifierError || passwordError) return

    const account = login({ email: form.identifier, password: form.password, role: form.role })
    if (!account) {
      setSubmitError('The ID or email, password, and selected role do not match an account.')
      return
    }
    goToRoleHome(account.role)
  }

  return (
    <section aria-labelledby="access-title" className="scroll-mt-20 bg-brand-cream py-16 sm:py-20" id="login">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-royal">Your academic workspace</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-navy sm:text-4xl" id="access-title">Access the system</h2>
            <p className="mt-4 leading-7 text-brand-dark">Sign in to continue or contact the university administrator to request an account.</p>
          </div>
          <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-3xl border border-brand-silver bg-white shadow-sm">
            <div aria-label="Account access options" className="grid grid-cols-2 border-b border-brand-silver" role="tablist">
              {['login', 'register'].map((value) => (
                <button
                  aria-controls="access-panel"
                  aria-selected={tab === value}
                  className={`px-5 py-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-royal ${tab === value ? 'border-b-2 border-brand-gold bg-brand-cream text-brand-navy' : 'text-brand-dark hover:bg-brand-cream'}`}
                  id={`access-tab-${value}`}
                  key={value}
                  onClick={() => { setTab(value); setSubmitError(''); setErrors({}) }}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                      event.preventDefault()
                      const next = value === 'login' ? 'register' : 'login'
                      setTab(next)
                      document.getElementById(`access-tab-${next}`)?.focus()
                    }
                  }}
                  role="tab"
                  type="button"
                >{value === 'login' ? 'Login' : 'Register'}</button>
              ))}
            </div>
            <div aria-labelledby={`access-tab-${tab}`} className="p-5 sm:p-8" id="access-panel" role="tabpanel" tabIndex="0">
              {tab === 'login' ? (
                <form className="space-y-5" noValidate onSubmit={submit}>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-brand-dark" htmlFor="access-role">Role</label>
                    <select className={fieldClass} id="access-role" onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} value={form.role}>
                      <option value="student">Student</option><option value="instructor">Instructor</option><option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-brand-dark" htmlFor="access-identifier">University ID or email</label>
                    <input aria-invalid={Boolean(errors.identifier)} className={fieldClass} id="access-identifier" onChange={(event) => setForm((current) => ({ ...current, identifier: event.target.value }))} value={form.identifier} />
                    {errors.identifier ? <p className="mt-2 text-sm text-red-600">{errors.identifier}</p> : null}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-brand-dark" htmlFor="access-password">Password</label>
                    <div className="flex gap-2">
                      <input aria-invalid={Boolean(errors.password)} className={fieldClass} id="access-password" onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} type={showPassword ? 'text' : 'password'} value={form.password} />
                      <button className="rounded-lg px-3 text-sm text-brand-royal focus-visible:outline-2 focus-visible:outline-brand-royal" onClick={() => setShowPassword((value) => !value)} type="button">{showPassword ? 'Hide' : 'Show'}</button>
                    </div>
                    {errors.password ? <p className="mt-2 text-sm text-red-600">{errors.password}</p> : null}
                  </div>
                  {submitError ? <p aria-live="polite" className="rounded-xl border border-brand-gold/50 bg-brand-cream px-3 py-2 text-sm text-brand-navy" role="alert">{submitError}</p> : null}
                  <div className="flex items-center justify-between gap-3">
                    <button className="text-sm font-medium text-brand-royal hover:underline focus-visible:outline-2 focus-visible:outline-brand-royal" onClick={() => onNavigate('forgot-password')} type="button">Forgot password?</button>
                    <Button type="submit" variant="accent">Sign in</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 text-center">
                  <p className="font-semibold text-brand-navy">Accounts are created by the university administrator.</p>
                  <p className="text-sm leading-6 text-brand-dark">Contact the registrar/admin if you do not have one. Public users cannot select a role or create an account.</p>
                  <Button onClick={() => onNavigate('register')} variant="outline">Registration information</Button>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default AccessSection
