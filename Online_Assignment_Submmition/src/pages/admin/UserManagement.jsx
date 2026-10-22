import { useMemo, useState } from 'react'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Modal from '../../components/Modal.jsx'
import { fetchAdminUsers, logAdminExport, resetAdminUserPassword, updateAdminUser } from '../../services/api.js'
import { downloadCsv } from '../../utils/exportCsv.js'
import { PageHeader, PageState } from './AdminUI.jsx'
import { useMockResource } from './adminUtils.js'
import ConfirmDialog from './ConfirmDialog.jsx'
import UserForm from './UserForm.jsx'
import UserTable from './UserTable.jsx'

const loadUsers = () => fetchAdminUsers()

// Shares account search, editing, activation, reset, selection, and export flows.
function UserManagement({ onNavigate, role = 'all' }) {
  const { data, error, loading, retry, setData } = useMockResource(loadUsers)
  const allManaged = useMemo(
    () => (data || []).filter((user) => ['student', 'instructor'].includes(user.role)),
    [data],
  )
  const rows = useMemo(
    () => (role === 'all' ? allManaged : allManaged.filter((user) => user.role === role)),
    [allManaged, role],
  )
  const [filteredRows, setFilteredRows] = useState([])
  const [notice, setNotice] = useState('')
  const [actionError, setActionError] = useState('')
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [busy, setBusy] = useState(false)

  const title = role === 'student' ? 'Manage students' : role === 'instructor' ? 'Manage instructors' : 'Manage users'
  const roleLabel = role === 'student' ? 'Student' : role === 'instructor' ? 'Instructor' : 'User'
  const addTarget = role === 'student' ? 'admin-add-student' : role === 'instructor' ? 'admin-add-instructor' : ''

  const updateUser = async (userId, changes) => {
    const updated = await updateAdminUser(userId, changes)
    setData((current) => current.map((user) => user.id === userId ? updated : user))
    return updated
  }

  const onSave = async (values) => {
    setBusy(true)
    setActionError('')
    try {
      const updated = await updateUser(editing.id, values)
      setNotice(`${updated.name}'s account was updated.`)
      setEditing(null)
    } catch (saveError) {
      setActionError(saveError.message || 'Unable to update the account.')
    } finally {
      setBusy(false)
    }
  }

  const handleConfirm = async () => {
    if (!confirm) return
    setBusy(true)
    setActionError('')
    try {
      if (confirm.type === 'reset') {
        const result = await resetAdminUserPassword(confirm.user.id)
        setNotice(result.message)
      } else {
        const targets = confirm.type === 'bulk'
          ? confirm.users
          : [confirm.user]
        await Promise.all(targets.map((user) => updateUser(user.id, { status: confirm.status })))
        setNotice(`${targets.length} account${targets.length === 1 ? '' : 's'} ${confirm.status === 'Active' ? 'activated' : 'deactivated'}.`)
      }
      setConfirm(null)
    } catch (operationError) {
      setActionError(operationError.message || 'The account action could not be completed.')
    } finally {
      setBusy(false)
    }
  }

  const handleExport = async () => {
    const authorizedFields = ['Name', 'User ID', 'Email', 'Department', 'Role', 'Status']
    downloadCsv(
      `${role === 'all' ? 'users' : `${role}s`}-export.csv`,
      authorizedFields,
      filteredRows.map((user) => [
        user.name,
        user.userId || user.universityId || user.id,
        user.email,
        user.department,
        user.role,
        user.status,
      ]),
    )
    try {
      await logAdminExport(`${filteredRows.length} ${roleLabel.toLowerCase()} records`)
      setNotice(`Exported ${filteredRows.length} account${filteredRows.length === 1 ? '' : 's'}.`)
    } catch (exportError) {
      setActionError(exportError.message || 'The export could not be recorded in the audit log.')
    }
  }

  const addAction = addTarget ? (
    <Button onClick={() => onNavigate(addTarget)}>Add {roleLabel}</Button>
  ) : (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => onNavigate('admin-add-student')} size="sm">Add Student</Button>
      <Button onClick={() => onNavigate('admin-add-instructor')} size="sm">Add Instructor</Button>
    </div>
  )

  return (
    <PageState error={error} loading={loading} onRetry={retry} title={`${title} unavailable`}>
      <div className="space-y-6">
        <PageHeader
          action={<div className="flex flex-wrap gap-2">{addAction}<Button onClick={handleExport} variant="outline">Export User List (CSV)</Button></div>}
          description={`Search and manage ${role === 'all' ? 'student and instructor' : `${role} `}accounts.`}
          title={title}
        />
        {actionError ? <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{actionError}</p> : null}
        <p aria-live="polite" className="sr-only">{notice}</p>
        {rows.length ? (
          <UserTable
            onActivate={(user) => setConfirm({ type: 'status', user, status: user.status === 'Active' ? 'Inactive' : 'Active' })}
            onBulkStatus={(ids, status) => setConfirm({ type: 'bulk', users: rows.filter((user) => ids.includes(user.id)), status })}
            onEdit={setEditing}
            onFilteredChange={setFilteredRows}
            onResetPassword={(user) => setConfirm({ type: 'reset', user })}
            onView={setViewing}
            rows={rows}
          />
        ) : <EmptyState title={`No ${roleLabel.toLowerCase()} accounts`} description="New accounts will appear here after an administrator creates them." />}
        {editing ? (
          <Modal onClose={() => setEditing(null)} open title={`Edit ${editing.name}`}>
            <UserForm initialUser={editing} onCancel={() => setEditing(null)} onSubmit={onSave} users={data || []} />
            {busy ? <p className="sr-only" role="status">Saving account changes</p> : null}
          </Modal>
        ) : null}
        {viewing ? (
          <Modal onClose={() => setViewing(null)} open title="Account details">
            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                ['Full name', viewing.name],
                ['User ID', viewing.userId || viewing.universityId || viewing.id],
                ['Email', viewing.email],
                ['Department', viewing.department],
                ['Role', viewing.role],
                ['Status', viewing.status],
              ].map(([label, value]) => <div key={label}><dt className="text-xs font-semibold uppercase text-brand-dark">{label}</dt><dd className="mt-1 text-sm text-brand-navy">{value || '—'}</dd></div>)}
            </dl>
          </Modal>
        ) : null}
        <ConfirmDialog
          busy={busy}
          confirmLabel={confirm?.type === 'reset' ? 'Send reset link' : 'Confirm'}
          message={confirm?.type === 'reset'
            ? `Send a password reset link to ${confirm.user.email}? No password will be displayed.`
            : confirm?.type === 'bulk'
              ? `${confirm.status === 'Active' ? 'Activate' : 'Deactivate'} ${confirm.users.length} selected accounts?`
              : `Set ${confirm?.user?.name}'s account to ${confirm?.status}?`}
          onCancel={() => setConfirm(null)}
          onConfirm={handleConfirm}
          open={Boolean(confirm)}
          title={confirm?.type === 'reset' ? 'Reset password' : 'Confirm account status'}
        />
      </div>
    </PageState>
  )
}

export default UserManagement
