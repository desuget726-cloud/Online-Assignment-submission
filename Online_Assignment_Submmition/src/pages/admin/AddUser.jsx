import { useState } from 'react'
import Button from '../../components/Button.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import UserForm from './UserForm.jsx'
import { fetchAdminUsers, createAdminUser } from '../../services/api.js'
import { PageHeader, PageState } from './AdminUI.jsx'
import { useMockResource } from './adminUtils.js'

const loadUsers = () => fetchAdminUsers()

// Registers one student or instructor after administrator review and confirmation.
function AddUser({ onNavigate, role }) {
  const { data, error, loading, retry } = useMockResource(loadUsers)
  const [pendingUser, setPendingUser] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const roleLabel = role === 'instructor' ? 'Instructor' : 'Student'

  const create = async () => {
    setBusy(true)
    setFormError('')
    try {
      const created = await createAdminUser(pendingUser)
      setMessage(`${created.name}'s ${created.status.toLowerCase()} ${created.role} account was created.`)
      setPendingUser(null)
      setConfirmOpen(false)
    } catch (createError) {
      setFormError(createError.message || 'Unable to create this account.')
      setConfirmOpen(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <PageState error={error} loading={loading} onRetry={retry} title="Registration form unavailable">
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader description={`Create one ${roleLabel.toLowerCase()} account. Administrators can select only Student or Instructor.`} title={`Add ${roleLabel}`} />
        {message ? (
          <div aria-live="polite" className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800" role="status">
            <p className="font-semibold">Account created</p><p className="mt-1">{message}</p>
            <Button className="mt-3" onClick={() => onNavigate(role === 'student' ? 'admin-students' : 'admin-instructors')} size="sm" variant="outline">Back to Manage {roleLabel}s</Button>
          </div>
        ) : null}
        {formError ? <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{formError}</p> : null}
        <section className="rounded-2xl border border-brand-silver bg-white p-5 shadow-sm sm:p-7">
          <UserForm lockedRole={role} onSubmit={(values) => { setPendingUser(values); setConfirmOpen(true) }} users={data || []} />
        </section>
        <ConfirmDialog
          busy={busy}
          confirmLabel="Create Account"
          message={`Create this ${roleLabel.toLowerCase()} account? The selected account setup will be handled by the university backend.`}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={create}
          open={confirmOpen}
          title="Confirm account creation"
        />
      </div>
    </PageState>
  )
}

export default AddUser
