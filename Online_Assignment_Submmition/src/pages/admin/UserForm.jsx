import { useState } from 'react'
import Button from '../../components/Button.jsx'
import { departments, validateManagedUser } from '../../utils/userValidation.js'
import { inputClass } from './adminUtils.js'

// Collects and validates student or instructor account details without handling passwords.
function UserForm({ initialUser, lockedRole, onCancel, onSubmit, users = [] }) {
  const [form, setForm] = useState({
    name: initialUser?.name || '',
    userId: initialUser?.userId || initialUser?.universityId || '',
    email: initialUser?.email || '',
    department: initialUser?.department || '',
    role: lockedRole || initialUser?.role || 'student',
    status: initialUser?.status || 'Pending',
    accountSetup: 'activation',
  })
  const [errors, setErrors] = useState({})

  const change = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = validateManagedUser(form, users, initialUser?.id)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    onSubmit({ ...form, name: form.name.trim(), userId: form.userId.trim(), email: form.email.trim() })
  }

  const controlClass = (field) => `${inputClass} ${errors[field] ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`
  const labelClass = 'block text-sm font-medium text-brand-dark'

  return (
    <form className="space-y-4" noValidate onSubmit={submit}>
      <div>
        <label className={labelClass} htmlFor="managed-user-name">Full name</label>
        <input aria-invalid={Boolean(errors.name)} className={controlClass('name')} id="managed-user-name" onChange={(event) => change('name', event.target.value)} required value={form.name} />
        {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name}</p> : null}
      </div>
      <div>
        <label className={labelClass} htmlFor="managed-user-id">User ID</label>
        <input aria-invalid={Boolean(errors.userId)} className={controlClass('userId')} id="managed-user-id" onChange={(event) => change('userId', event.target.value)} required value={form.userId} disabled={Boolean(initialUser)} />
        <p className="mt-1 text-xs text-brand-dark">{initialUser ? 'User ID is locked during editing.' : 'Student ID or employee ID'}</p>
        {errors.userId ? <p className="mt-1 text-sm text-red-600">{errors.userId}</p> : null}
      </div>
      <div>
        <label className={labelClass} htmlFor="managed-user-email">Email address</label>
        <input aria-invalid={Boolean(errors.email)} className={controlClass('email')} id="managed-user-email" onChange={(event) => change('email', event.target.value)} required type="email" value={form.email} />
        {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
      </div>
      <div>
        <label className={labelClass} htmlFor="managed-user-department">Department</label>
        <select aria-invalid={Boolean(errors.department)} className={controlClass('department')} id="managed-user-department" onChange={(event) => change('department', event.target.value)} required value={form.department}>
          <option value="">Select a department</option>
          {departments.map((department) => <option key={department} value={department}>{department}</option>)}
        </select>
        {errors.department ? <p className="mt-1 text-sm text-red-600">{errors.department}</p> : null}
      </div>
      {lockedRole ? (
        <div>
          <span className={labelClass}>Role</span>
          <p className="mt-1 rounded-lg border border-brand-silver bg-brand-cream px-3 py-2 text-sm capitalize">{lockedRole}</p>
        </div>
      ) : (
        <div>
          <label className={labelClass} htmlFor="managed-user-role">Role</label>
          <select aria-invalid={Boolean(errors.role)} className={controlClass('role')} id="managed-user-role" onChange={(event) => change('role', event.target.value)} value={form.role}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
          {errors.role ? <p className="mt-1 text-sm text-red-600">{errors.role}</p> : null}
        </div>
      )}
      <div>
        <label className={labelClass} htmlFor="managed-user-status">Status</label>
        <select aria-invalid={Boolean(errors.status)} className={controlClass('status')} id="managed-user-status" onChange={(event) => change('status', event.target.value)} value={form.status}>
          <option>Active</option><option>Pending</option><option>Inactive</option>
        </select>
        {errors.status ? <p className="mt-1 text-sm text-red-600">{errors.status}</p> : null}
      </div>
      {!initialUser ? (
        <fieldset className="space-y-2">
          <legend className={labelClass}>Account setup</legend>
          <label className="flex items-start gap-2 text-sm text-brand-dark">
            <input checked={form.accountSetup === 'activation'} className="mt-1 accent-brand-royal" name="account-setup" onChange={() => change('accountSetup', 'activation')} type="radio" />
            Send activation link
          </label>
          <label className="flex items-start gap-2 text-sm text-brand-dark">
            <input checked={form.accountSetup === 'temporary'} className="mt-1 accent-brand-royal" name="account-setup" onChange={() => change('accountSetup', 'temporary')} type="radio" />
            Set temporary password that must be changed at first login
          </label>
        </fieldset>
      ) : null}
      <div className="flex justify-end gap-2 pt-2">
        {onCancel ? <Button onClick={onCancel} variant="outline">Cancel</Button> : null}
        <Button type="submit">{initialUser ? 'Save changes' : 'Continue'}</Button>
      </div>
    </form>
  )
}

export default UserForm
