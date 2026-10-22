import { useState } from 'react'
import Button from '../../components/Button.jsx'
import { fetchInstructorProfile } from '../../services/api.js'
import { cardClass, fieldClass, formatDate, instructor, labelClass, pageClass } from './instructorData.js'
import {
  ErrorState,
  LoadingState,
  PageHeading,
} from './shared.jsx'
import { useInstructorResource } from './useInstructorResource.js'

function Profile({ onUpdateProfile, loading: externalLoading = false, error: externalError = '', onRetry }) {
  const resource = useInstructorResource(fetchInstructorProfile)
  const [editedForm, setEditedForm] = useState(null)
  const profile = resource.data || instructor || {}
  const form = editedForm || {
    name: profile.name || '',
    email: profile.email || '',
    department: profile.department || '',
  }
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const update = (event) => {
    setEditedForm((current) => ({ ...form, ...current, [event.target.name]: event.target.value }))
    setError('')
    setMessage('')
  }

  const save = async (event) => {
    event.preventDefault()
    const profile = {
      name: form.name.trim(),
      email: form.email.trim(),
      department: form.department.trim(),
    }
    if (!profile.name || !profile.email || !profile.department) {
      setError('Name, email, and department are required.')
      return
    }
    setPending(true)
    setError('')
    try {
      if (onUpdateProfile) {
        const updated = await onUpdateProfile(profile)
        setEditedForm({ ...form, ...updated, ...profile })
        setMessage('Your profile has been updated.')
      } else {
        setEditedForm(profile)
        setMessage('Changes are shown for this session. The current API has no profile update method.')
      }
    } catch (cause) {
      setError(cause?.message || 'Your profile could not be updated.')
    } finally {
      setPending(false)
    }
  }

  const loading = externalLoading || resource.loading
  const pageError = externalError || resource.error
  if (loading) return <LoadingState label="Loading your profile…" />
  if (pageError) return <ErrorState message={pageError} onRetry={onRetry || resource.retry} />

  return (
    <div className={pageClass}>
      <PageHeading title="Instructor profile" description="Review and update the contact details associated with your instructor account." />
      {error ? <ErrorState message={error} /> : null}
      {message ? <p className="rounded-lg border border-brand-gold/50 bg-brand-gold/15 p-3 text-sm text-brand-navy" role="status">{message}</p> : null}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
        <form className={cardClass} onSubmit={save}>
          <h2 className="text-lg font-semibold text-brand-navy">Personal information</h2>
          <p className="mt-1 text-sm text-brand-dark">Required fields are marked with an asterisk.</p>
          <div className="mt-5 space-y-5">
            <div>
              <label className={labelClass} htmlFor="profile-name">Full name <span aria-hidden="true">*</span></label>
              <input autoComplete="name" className={fieldClass} id="profile-name" maxLength="100" name="name" onChange={update} required value={form.name} />
            </div>
            <div>
              <label className={labelClass} htmlFor="profile-email">Email address <span aria-hidden="true">*</span></label>
              <input autoComplete="email" className={fieldClass} id="profile-email" maxLength="254" name="email" onChange={update} required type="email" value={form.email} />
            </div>
            <div>
              <label className={labelClass} htmlFor="profile-department">Department <span aria-hidden="true">*</span></label>
              <input className={fieldClass} id="profile-department" maxLength="120" name="department" onChange={update} required value={form.department} />
            </div>
          </div>
          <div className="mt-6 flex justify-end border-t border-brand-silver pt-5">
            <Button disabled={pending} loading={pending} type="submit">Save profile</Button>
          </div>
        </form>
        <aside aria-labelledby="account-details-heading" className={cardClass}>
          <h2 className="text-lg font-semibold text-brand-navy" id="account-details-heading">Account details</h2>
          <dl className="mt-5 space-y-4">
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Role</dt><dd className="mt-1 text-sm capitalize text-brand-navy">{profile.role || 'Instructor'}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Member since</dt><dd className="mt-1 text-sm text-brand-navy">{formatDate(profile.joinedAt || instructor?.joinedAt, { dateStyle: 'long' })}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Account status</dt><dd className="mt-1 text-sm text-brand-navy">{profile.status || 'Active'}</dd></div>
            {profile.office ? <div><dt className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Office</dt><dd className="mt-1 text-sm text-brand-navy">{profile.office}</dd></div> : null}
          </dl>
          <p className="mt-5 border-t border-brand-silver pt-4 text-xs leading-5 text-brand-dark">Your instructor role and account status are managed by your institution.</p>
        </aside>
      </div>
    </div>
  )
}

export default Profile
