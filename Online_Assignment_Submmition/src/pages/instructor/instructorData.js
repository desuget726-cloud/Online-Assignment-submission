import { assignments, courses, studentProfile, users } from '../../data/mockData.js'

export const instructor = users.find((user) => user.role === 'instructor')
export const instructorCourses = courses.filter((course) => course.instructorId === instructor?.id)
export const instructorCourseIds = new Set(instructorCourses.map((course) => course.id))
export const instructorAssignments = assignments.filter((assignment) =>
  instructorCourseIds.has(assignment.courseId),
)

export const pageClass = 'space-y-6'
export const cardClass = 'rounded-xl border border-brand-silver bg-white p-5 shadow-sm sm:p-6'
export const fieldClass =
  'mt-1 block w-full rounded-lg border border-brand-silver bg-white px-3 py-2 text-sm text-brand-navy shadow-sm placeholder:text-brand-dark focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-brand-gold/40'
export const labelClass = 'block text-sm font-medium text-brand-dark'

export function formatDate(value, options = { dateStyle: 'medium', timeStyle: 'short' }) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(undefined, options).format(date)
}

export function studentName() {
  return studentProfile.name
}
