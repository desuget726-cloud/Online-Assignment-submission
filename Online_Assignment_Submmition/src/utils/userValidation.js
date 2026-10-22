import { validateEmail, validateUserId } from './validators.js'

export const departments = [
  'Accounting',
  'Business',
  'Computer Science',
  'Education',
  'Information Technology',
  'Management',
]

const normalize = (value) => String(value || '').trim().toLowerCase()

export function validateManagedUser(values, users, excludedId = '') {
  const errors = {}
  const name = String(values.name || '').trim()
  if (!name) errors.name = 'Full name is required.'

  const userIdError = validateUserId(values.userId)
  if (userIdError) errors.userId = userIdError

  const emailError = validateEmail(values.email)
  if (emailError) errors.email = emailError

  if (!values.department) errors.department = 'Choose a department.'
  if (!['student', 'instructor'].includes(values.role)) errors.role = 'Choose Student or Instructor.'
  if (!['Active', 'Pending', 'Inactive'].includes(values.status)) errors.status = 'Choose a valid status.'

  const otherUsers = users.filter((user) => user.id !== excludedId)
  if (
    values.userId &&
    otherUsers.some((user) => normalize(user.userId || user.universityId || user.id) === normalize(values.userId))
  ) {
    errors.userId = 'This User ID is already in use.'
  }
  if (
    values.email &&
    otherUsers.some((user) => normalize(user.email) === normalize(values.email))
  ) {
    errors.email = 'This email address is already in use.'
  }

  return errors
}

export function validateImportRows(rows, role, users) {
  const seenIds = new Set()
  const seenEmails = new Set()
  return rows.map((row) => {
    const values = {
      name: row.full_name,
      userId: row.user_id,
      email: row.email,
      department: row.department,
      role,
      status: 'Pending',
    }
    const errors = validateManagedUser(values, users)
    const rowRole = normalize(row.role)
    if (rowRole !== role) errors.role = `Role must be ${role === 'student' ? 'Student' : 'Instructor'}.`

    const userId = normalize(row.user_id)
    const email = normalize(row.email)
    const duplicateInFile = (userId && seenIds.has(userId)) || (email && seenEmails.has(email))
    if (userId) seenIds.add(userId)
    if (email) seenEmails.add(email)

    const duplicateInUsers =
      (userId && users.some((user) => normalize(user.userId || user.universityId || user.id) === userId)) ||
      (email && users.some((user) => normalize(user.email) === email))

    if (duplicateInUsers) {
      if (errors.userId === 'This User ID is already in use.') delete errors.userId
      if (errors.email === 'This email address is already in use.') delete errors.email
    }
    const reason = Object.values(errors).join(' ')
    const duplicateReason = duplicateInFile
      ? 'Duplicate User ID or email in this file.'
      : duplicateInUsers
        ? 'User ID or email already exists.'
        : ''

    return {
      ...row,
      user: values,
      errors,
      status: reason ? 'Invalid' : duplicateReason ? 'Duplicate' : 'Valid',
      reason: reason || duplicateReason,
    }
  })
}
