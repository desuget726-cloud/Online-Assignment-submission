import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './auth-context.js'

const defaultUsers = [
  {
    id: 'student-01',
    name: 'Samuel Bekele',
    email: 'student@mekdela.edu',
    role: 'student',
  },
  {
    id: 'instructor-01',
    name: 'Aster Alemu',
    email: 'instructor@mekdela.edu',
    role: 'instructor',
  },
  {
    id: 'admin-01',
    name: 'Daniel Tessema',
    email: 'admin@mekdela.edu',
    role: 'admin',
  },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const accounts = defaultUsers

  const login = useCallback(
    ({ email, role }) => {
      const normalizedIdentifier = String(email || '').trim().toLowerCase()
      // BACKEND REQUIRED: validate credentials and enforce permissions server-side; this UI mock stores no passwords.
      const account = accounts.find(
        (entry) =>
          (entry.email.toLowerCase() === normalizedIdentifier ||
            entry.id?.toLowerCase() === normalizedIdentifier ||
            entry.universityId?.toLowerCase() === normalizedIdentifier) &&
          (!role || entry.role === role),
      )

      if (!account) return null

      const sessionUser = { ...account }
      setUser(sessionUser)
      return sessionUser
    },
    [accounts],
  )

  const requestPasswordReset = useCallback(
    (email) => {
      const normalizedEmail = String(email || '').trim().toLowerCase()
      const accountExists = accounts.some((entry) => entry.email.toLowerCase() === normalizedEmail)

      return {
        success: accountExists,
        message: accountExists
          ? 'Password reset instructions have been sent to your email.'
          : 'No account matches that email address.',
      }
    },
    [accounts],
  )

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout: () => setUser(null),
      requestPasswordReset,
    }),
    [login, requestPasswordReset, user],
  )

  // Client-side role state is UI-only; authentication, authorization, and file validation/protection must be enforced by the backend.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
