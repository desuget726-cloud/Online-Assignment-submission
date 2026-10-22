export function validateEmail(value) {
  const normalized = (value || '').trim()

  if (!normalized) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return 'Enter a valid email address.'
  }

  return ''
}

export function validatePassword(value, minLength = 8) {
  if (!value) return 'Password is required.'
  if (String(value).length < minLength) {
    return `Password must be at least ${minLength} characters.`
  }

  return ''
}

export function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password.'
  if (String(password) !== String(confirmPassword)) {
    return 'Passwords do not match.'
  }

  return ''
}

export function validateUserId(value) {
  const normalized = String(value || '').trim()
  if (!normalized) return 'User ID is required.'
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{2,19}$/.test(normalized)) {
    return 'Use 3–20 letters, numbers, hyphens, or underscores.'
  }
  return ''
}
