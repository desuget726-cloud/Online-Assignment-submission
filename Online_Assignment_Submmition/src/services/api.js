import {
  activityLog as sampleActivityLog,
  assignments as sampleAssignments,
  courses as sampleCourses,
  grades as sampleGrades,
  notifications as sampleNotifications,
  studentProfile,
  submissions as sampleSubmissions,
  users as sampleUsers,
} from '../data/mockData.js'
import { mockUsers } from '../data/mockUsers.js'
import { mockImportHistory } from '../data/mockImportHistory.js'

export const REST_ENDPOINTS = {
  fetchStudentDashboardData: 'GET /api/students/me/dashboard',
  fetchStudentCourses: 'GET /api/students/me/courses',
  fetchStudentAssignments: 'GET /api/students/me/assignments',
  fetchStudentAssignmentById: 'GET /api/assignments/:assignmentId',
  fetchStudentSubmissions: 'GET /api/students/me/submissions',
  fetchStudentGrades: 'GET /api/students/me/grades',
  fetchStudentNotifications: 'GET /api/students/me/notifications',
  markNotificationRead: 'PATCH /api/notifications/:notificationId',
  markAllNotificationsRead: 'POST /api/notifications/mark-all-read',
  fetchStudentProfile: 'GET /api/students/me/profile',
  submitAssignment: 'POST /api/submissions',
  fetchInstructorDashboard: 'GET /api/instructors/me/dashboard',
  fetchInstructorAssignments: 'GET /api/instructors/me/assignments',
  createInstructorAssignment: 'POST /api/assignments',
  updateInstructorAssignment: 'PATCH /api/assignments/:assignmentId',
  fetchInstructorSubmissions: 'GET /api/instructors/me/submissions',
  fetchInstructorSubmission: 'GET /api/submissions/:submissionId',
  saveEvaluationDraft: 'PUT /api/submissions/:submissionId/evaluation/draft',
  publishEvaluation: 'POST /api/submissions/:submissionId/evaluation',
  fetchInstructorReports: 'GET /api/instructors/me/reports',
  fetchInstructorNotifications: 'GET /api/instructors/me/notifications',
  fetchInstructorProfile: 'GET /api/instructors/me/profile',
  fetchAdminDashboard: 'GET /api/admin/dashboard',
  fetchAdminUsers: 'GET /api/admin/users',
  updateAdminUser: 'PATCH /api/admin/users/:userId',
  fetchAdminCourses: 'GET /api/admin/courses',
  createAdminCourse: 'POST /api/admin/courses',
  updateAdminCourse: 'PATCH /api/admin/courses/:courseId',
  deleteAdminCourse: 'DELETE /api/admin/courses/:courseId',
  fetchAdminActivityLog: 'GET /api/admin/activity-log',
  fetchAdminReports: 'GET /api/admin/reports',
  fetchAdminSettings: 'GET /api/admin/settings',
  updateAdminSettings: 'PUT /api/admin/settings',
}

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))
const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

let assignments = [...sampleAssignments]
let courses = [...sampleCourses]
let submissions = [...sampleSubmissions]
let grades = [...sampleGrades]
let notifications = [...sampleNotifications]
let users = [...sampleUsers, ...mockUsers]
let activityLog = [...sampleActivityLog]
let importHistory = [...mockImportHistory]
let adminSettings = {
  institutionName: 'Mekdela Amba University',
  assignmentMaxSizeMB: 10,
  lateSubmissionsAllowed: true,
  emailNotifications: true,
}

// MOCK: keeps events in memory. BACKEND REQUIRED to persist these actions to the audit log.
function addActivity(actor, action, target, category) {
  activityLog = [
    {
      id: makeId('activity'),
      actor,
      action,
      target,
      category,
      createdAt: new Date().toISOString(),
    },
    ...activityLog,
  ]
}

function dispatchNotificationsUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('assignment-system:notifications-updated'))
  }
}

export async function fetchStudentDashboardData() {
  await delay(400)
  return {
    stats: {
      totalCourses: courses.length,
      pendingAssignments: assignments.filter((item) => item.status === 'Pending').length,
      submittedAssignments: assignments.filter((item) => item.status === 'Submitted').length,
      gradedAssignments: grades.filter((item) => item.status === 'Graded').length,
    },
    upcomingAssignments: assignments
      .filter((item) => new Date(item.dueDate).getTime() >= Date.now())
      .sort((left, right) => new Date(left.dueDate) - new Date(right.dueDate))
      .slice(0, 3),
    recentGrades: grades.slice(0, 2),
    notifications: notifications.slice(0, 3),
  }
}

export async function fetchStudentCourses() {
  await delay(350)
  return courses
}

export async function fetchStudentAssignments() {
  await delay(350)
  return assignments
}

export async function fetchStudentAssignmentById(assignmentId) {
  await delay(300)
  return assignments.find((assignment) => assignment.id === assignmentId) || null
}

export async function fetchStudentSubmissions() {
  await delay(400)
  return submissions
}

export async function fetchStudentGrades() {
  await delay(350)
  return grades
}

export async function fetchStudentNotifications() {
  await delay(300)
  return notifications
}

export async function markNotificationRead(notificationId) {
  await delay(180)
  const notification = notifications.find((item) => item.id === notificationId)
  if (!notification) throw new Error('Notification was not found.')
  notifications = notifications.map((item) =>
    item.id === notificationId ? { ...item, unread: false } : item,
  )
  dispatchNotificationsUpdated()
  return notifications.find((item) => item.id === notificationId)
}

export async function markAllNotificationsRead() {
  await delay(180)
  notifications = notifications.map((item) => ({ ...item, unread: false }))
  dispatchNotificationsUpdated()
  return notifications
}

export async function fetchStudentProfile() {
  await delay(250)
  return studentProfile
}

export async function submitAssignment({ assignmentId, files }) {
  await delay(600)
  if (!assignmentId || !files?.length) {
    throw new Error('Please attach a valid file before submitting.')
  }

  // Future POST /api/submissions uses multipart/form-data; the mock keeps it in memory.
  const formData = new FormData()
  formData.append('assignmentId', assignmentId)
  Array.from(files).forEach((file) => formData.append('files', file))
  const assignment = assignments.find((item) => item.id === assignmentId)
  if (!assignment) throw new Error('Assignment was not found.')
  const submission = {
    id: makeId('submission'),
    assignmentId,
    assignmentTitle: assignment?.title || 'Assignment',
    submittedAt: new Date().toISOString(),
    status: assignment && Date.now() > new Date(assignment.dueDate).getTime() ? 'Late' : 'Submitted',
    grade: null,
    maxMarks: assignment?.maxMarks || 0,
    feedback: 'Awaiting instructor review.',
    fileNames: Array.from(formData.getAll('files')).map((file) => file.name),
  }

  submissions = [submission, ...submissions]
  if (assignment) {
    assignments = assignments.map((item) =>
      item.id === assignmentId ? { ...item, status: submission.status } : item,
    )
  }
  addActivity('Samuel Bekele', 'Submitted assignment', submission.assignmentTitle, 'Submission')

  return {
    success: true,
    message: 'Assignment submitted successfully.',
    assignmentId,
    submittedAt: submission.submittedAt,
    submission,
  }
}

function fetchInstructorAssignmentRows() {
  return assignments
    .filter((assignment) => {
      const course = courses.find((item) => item.id === assignment.courseId)
      return course?.instructorId === 'instructor-01'
    })
    .map((assignment) => ({
      ...assignment,
      status: ['Draft', 'Closed'].includes(assignment.status) ? assignment.status : 'Published',
    }))
}

export async function fetchInstructorDashboard() {
  await delay(350)
  const instructorAssignments = fetchInstructorAssignmentRows()
  const instructorSubmissions = fetchInstructorSubmissionRows()
  return {
    totalAssignments: instructorAssignments.length,
    publishedAssignments: instructorAssignments.filter((item) => item.status === 'Published').length,
    submissionsToReview: instructorSubmissions.filter(
      (item) => !['Graded', 'Published'].includes(item.status),
    ).length,
    gradedSubmissions: instructorSubmissions.filter((item) => ['Graded', 'Published'].includes(item.status)).length,
    recentAssignments: instructorAssignments.slice(0, 4),
    recentSubmissions: fetchInstructorSubmissionRows().slice(0, 4),
  }
}

export async function fetchInstructorAssignments() {
  await delay(320)
  return fetchInstructorAssignmentRows()
}

export async function createInstructorAssignment(values) {
  await delay(450)
  const course = courses.find((item) => item.id === values.courseId)
  const attachmentFiles = Array.from(values.attachmentFiles || [])
  // The REST replacement can post this payload as multipart/form-data to retain an optional file.
  const formData = new FormData()
  Object.entries(values).forEach(([key, value]) => {
    if (key !== 'attachmentFiles') formData.append(key, String(value ?? ''))
  })
  attachmentFiles.forEach((file) => formData.append('attachmentFiles', file))
  const assignment = {
    ...values,
    id: makeId('assign'),
    course: values.course || course?.name || 'Course',
    status: values.status || 'Published',
    maxMarks: Number(values.maxMarks),
    attachmentNames: Array.from(formData.getAll('attachmentFiles'), (file) => file.name),
  }
  assignments = [assignment, ...assignments]
  addActivity('Instructor', 'Created assignment', assignment.title, 'Assignment')
  return assignment
}

export async function updateInstructorAssignment(assignmentId, changes) {
  await delay(350)
  const existing = assignments.find((item) => item.id === assignmentId)
  if (!existing) throw new Error('Assignment was not found.')
  const updated = { ...existing, ...changes, maxMarks: Number(changes.maxMarks ?? existing.maxMarks) }
  assignments = assignments.map((item) => (item.id === assignmentId ? updated : item))
  addActivity('Instructor', 'Updated assignment', updated.title, 'Assignment')
  return updated
}

function fetchInstructorSubmissionRows() {
  const instructorAssignmentList = assignments.filter((assignment) => {
    const assignedCourse = courses.find((course) => course.id === assignment.courseId)
    return assignedCourse?.instructorId === 'instructor-01'
  })
  const instructorAssignmentIds = new Set(instructorAssignmentList.map((item) => item.id))
  const received = new Set(
    submissions
      .filter((submission) => instructorAssignmentIds.has(submission.assignmentId))
      .map((submission) => submission.assignmentId),
  )
  const submittedRows = submissions.filter((item) => instructorAssignmentIds.has(item.assignmentId))
  const notSubmitted = instructorAssignmentList
    .filter((assignment) => !received.has(assignment.id))
    .map((assignment) => ({
      id: `not-submitted-${assignment.id}`,
      assignmentId: assignment.id,
      assignmentTitle: assignment.title,
      submittedAt: null,
      status: 'Not Submitted',
      grade: null,
      maxMarks: assignment.maxMarks,
      feedback: 'No submission received yet.',
    }))
  return [...submittedRows, ...notSubmitted]
}

export async function fetchInstructorSubmissions(assignmentId = 'all') {
  await delay(350)
  const rows = fetchInstructorSubmissionRows()
  return assignmentId === 'all'
    ? rows
    : rows.filter((item) => item.assignmentId === assignmentId)
}

export async function fetchInstructorSubmission(submissionId) {
  await delay(250)
  return submissions.find((item) => item.id === submissionId) || null
}

function validateEvaluation(submissionId, marks, feedback) {
  const submission = submissions.find((item) => item.id === submissionId)
  if (!submission) throw new Error('Submission was not found.')
  const numericMarks = Number(marks)
  if (!Number.isFinite(numericMarks) || numericMarks < 0 || numericMarks > submission.maxMarks) {
    throw new Error(`Marks must be between 0 and ${submission.maxMarks}.`)
  }
  if (!String(feedback || '').trim()) throw new Error('Feedback is required.')
  return { submission, numericMarks, feedback: String(feedback).trim() }
}

export async function saveEvaluationDraft(submissionId, evaluation) {
  await delay(350)
  const { submission, numericMarks, feedback } = validateEvaluation(
    submissionId,
    evaluation.marks,
    evaluation.feedback,
  )
  const updated = {
    ...submission,
    grade: numericMarks,
    feedback,
    evaluationStatus: 'Draft',
  }
  submissions = submissions.map((item) => (item.id === submissionId ? updated : item))
  return updated
}

export async function publishEvaluation(submissionId, evaluation) {
  await delay(400)
  const { submission, numericMarks, feedback } = validateEvaluation(
    submissionId,
    evaluation.marks,
    evaluation.feedback,
  )
  const updated = { ...submission, grade: numericMarks, feedback, status: 'Graded', evaluationStatus: 'Published' }
  submissions = submissions.map((item) => (item.id === submissionId ? updated : item))
  grades = [
    {
      id: makeId('grade'),
      assignment: submission.assignmentTitle,
      course: courses.find((item) => item.id === assignments.find((a) => a.id === submission.assignmentId)?.courseId)?.name || 'Course',
      grade: numericMarks,
      maxMarks: submission.maxMarks,
      feedback,
      status: 'Graded',
    },
    ...grades.filter((grade) => grade.assignment !== submission.assignmentTitle),
  ]
  addActivity('Instructor', 'Published evaluation', submission.assignmentTitle, 'Grade')
  return updated
}

export async function fetchInstructorReports() {
  await delay(350)
  const instructorAssignments = fetchInstructorAssignmentRows()
  const instructorAssignmentIds = new Set(instructorAssignments.map((item) => item.id))
  const instructorSubmissions = submissions.filter((item) => instructorAssignmentIds.has(item.assignmentId))
  const gradedSubmissions = instructorSubmissions.filter((item) => ['Graded', 'Published'].includes(item.status))
  const gradeBands = [
    { label: 'A (90-100)', min: 90, max: Number.POSITIVE_INFINITY },
    { label: 'B (80-89)', min: 80, max: 90 },
    { label: 'C (70-79)', min: 70, max: 80 },
    { label: 'D (60-69)', min: 60, max: 70 },
    { label: 'F (<60)', min: 0, max: 60 },
  ]
  const gradeDistribution = gradeBands.map((band) => ({
    label: band.label,
    value: gradedSubmissions.filter((item) => {
      const percentage = item.maxMarks > 0 ? (item.grade / item.maxMarks) * 100 : 0
      return percentage >= band.min && percentage < band.max
    }).length,
  }))
  return {
    assignmentPerformance: instructorAssignments.map((assignment) => ({
      label: assignment.title,
      value: instructorSubmissions.filter((item) => item.assignmentId === assignment.id).length,
    })),
    gradeDistribution,
    totalSubmissions: instructorSubmissions.length,
    averageGrade: gradedSubmissions.length
      ? gradedSubmissions.reduce((sum, item) => sum + item.grade, 0) / gradedSubmissions.length
      : 0,
  }
}

export async function fetchInstructorNotifications() {
  await delay(250)
  return notifications
}

export async function fetchInstructorProfile() {
  await delay(250)
  return {
    id: 'instructor-01',
    name: 'Aster Alemu',
    email: 'instructor@mekdela.edu',
    department: 'Computer Science',
    office: 'Science Building, Room 305',
  }
}

export async function fetchAdminDashboard() {
  await delay(350)
  const activeAssignments = assignments.filter((item) => !['Draft', 'Closed'].includes(item.status))
  const managedUsers = users.filter((user) => ['student', 'instructor'].includes(user.role))
  return {
    totalUsers: users.length,
    students: users.filter((user) => user.role === 'student').length,
    instructors: users.filter((user) => user.role === 'instructor').length,
    totalCourses: courses.length,
    activeAssignments: activeAssignments.length,
    totalSubmissions: submissions.length,
    recentActivity: activityLog.slice(0, 4),
    accountStats: {
      students: users.filter((user) => user.role === 'student').length,
      instructors: users.filter((user) => user.role === 'instructor').length,
      active: managedUsers.filter((user) => user.status === 'Active').length,
      pending: managedUsers.filter((user) => user.status === 'Pending').length,
      inactive: managedUsers.filter((user) => user.status === 'Inactive').length,
    },
    recentRegistrations: [...managedUsers]
      .sort((left, right) => new Date(right.joinedAt || 0) - new Date(left.joinedAt || 0))
      .slice(0, 5),
    recentImports: [...importHistory].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)).slice(0, 5),
  }
}

export async function fetchAdminUsers() {
  await delay(350)
  return users
}

export async function updateAdminUser(userId, changes) {
  // MOCK: mutates only the in-memory account list; BACKEND REQUIRED for authorized changes and audit persistence.
  await delay(300)
  const existing = users.find((item) => item.id === userId)
  if (!existing) throw new Error('User was not found.')
  const updated = { ...existing, ...changes }
  users = users.map((item) => (item.id === userId ? updated : item))
  const action = Object.hasOwn(changes, 'status')
    ? `${changes.status === 'Active' ? 'Activated' : 'Deactivated'} account`
    : Object.hasOwn(changes, 'role')
      ? 'Changed account role'
      : 'Updated user account'
  addActivity('Administrator', action, updated.name, 'User')
  return updated
}

// MOCK: creates only an in-memory record; BACKEND REQUIRED for account creation, permission checks, activation, and password hashing.
export async function createAdminUser(values) {
  await delay(350)
  const normalizedEmail = String(values.email || '').trim().toLowerCase()
  const normalizedId = String(values.userId || '').trim().toLowerCase()
  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error('This email address is already in use.')
  }
  if (users.some((user) => String(user.userId || user.universityId || user.id).toLowerCase() === normalizedId)) {
    throw new Error('This User ID is already in use.')
  }
  const created = {
    id: makeId('managed-user'),
    name: String(values.name).trim(),
    userId: String(values.userId).trim(),
    email: normalizedEmail,
    department: String(values.department).trim(),
    role: values.role,
    status: values.status,
    accountSetup: values.accountSetup,
    joinedAt: new Date().toISOString(),
  }
  users = [created, ...users]
  addActivity('Administrator', 'Created account', created.name, 'User')
  return created
}

// MOCK: records a reset request only. BACKEND REQUIRED to authorize and send a one-time reset link.
export async function resetAdminUserPassword(userId) {
  await delay(300)
  const user = users.find((entry) => entry.id === userId)
  if (!user) throw new Error('User was not found.')
  addActivity('Administrator', 'Requested password reset', user.name, 'User')
  return { success: true, message: `Reset link sent to ${user.email}.` }
}

// MOCK: imports into this module's in-memory list. BACKEND REQUIRED for server-side parsing, validation, and atomic persistence.
export async function importAdminUsers({ fileName, role, rows }) {
  await delay(900)
  const records = []
  let successful = 0
  let failed = 0
  let skipped = 0
  const seenIds = new Set()
  const seenEmails = new Set()

  rows.forEach((row) => {
    if (row.status === 'Invalid') {
      failed += 1
      records.push({ rowNumber: row.rowNumber, status: 'Failed', reason: row.reason, userId: row.user_id, email: row.email })
      return
    }
    const userId = String(row.user_id || '').trim()
    const email = String(row.email || '').trim().toLowerCase()
    const duplicate = row.status === 'Duplicate' ||
      seenIds.has(userId.toLowerCase()) ||
      seenEmails.has(email) ||
      users.some((user) =>
        String(user.userId || user.universityId || user.id).toLowerCase() === userId.toLowerCase() ||
        user.email.toLowerCase() === email,
      )
    if (duplicate) {
      skipped += 1
      records.push({
        rowNumber: row.rowNumber,
        status: 'Skipped',
        reason: row.reason || 'User ID or email already exists.',
        userId,
        email,
      })
      return
    }

    seenIds.add(userId.toLowerCase())
    seenEmails.add(email)
    users = [{
      id: makeId('managed-user'),
      name: String(row.full_name).trim(),
      userId,
      email,
      department: String(row.department).trim(),
      role,
      status: 'Pending',
      joinedAt: new Date().toISOString(),
    }, ...users]
    successful += 1
  })

  const result = {
    id: makeId('import'),
    fileName,
    type: role,
    admin: 'Administrator',
    createdAt: new Date().toISOString(),
    successful,
    failed,
    skipped,
    total: rows.length,
    records,
  }
  importHistory = [result, ...importHistory]
  addActivity('Administrator', 'Imported user accounts', `${fileName} (${successful} created)`, 'Bulk import')
  return result
}

export async function fetchAdminImportHistory() {
  // MOCK: reads in-memory import records. BACKEND REQUIRED for durable history.
  await delay(250)
  return importHistory
}

export async function fetchAdminImportById(importId) {
  // MOCK: reads an in-memory import result. BACKEND REQUIRED for authorized report retrieval.
  await delay(200)
  return importHistory.find((item) => item.id === importId) || null
}

// MOCK: records an export event in memory. BACKEND REQUIRED to authorize and persist audit events.
export async function logAdminExport(description) {
  await delay(100)
  addActivity('Administrator', 'Exported user list', description, 'Export')
}

export async function fetchAdminCourses() {
  await delay(300)
  return courses
}

export async function createAdminCourse(values) {
  await delay(350)
  const course = {
    ...values,
    id: makeId('course'),
    credits: Number(values.credits) || 3,
    progress: 0,
    category: values.category || 'Core',
  }
  courses = [course, ...courses]
  addActivity('Administrator', 'Created course', course.name, 'Course')
  return course
}

export async function updateAdminCourse(courseId, changes) {
  await delay(300)
  const existing = courses.find((item) => item.id === courseId)
  if (!existing) throw new Error('Course was not found.')
  const updated = { ...existing, ...changes }
  courses = courses.map((item) => (item.id === courseId ? updated : item))
  addActivity('Administrator', 'Updated course', updated.name, 'Course')
  return updated
}

export async function deleteAdminCourse(courseId) {
  await delay(300)
  const existing = courses.find((item) => item.id === courseId)
  if (!existing) throw new Error('Course was not found.')
  courses = courses.filter((item) => item.id !== courseId)
  addActivity('Administrator', 'Deleted course', existing.name, 'Course')
  return { success: true, id: courseId }
}

export async function fetchAdminActivityLog() {
  await delay(300)
  return activityLog
}

export async function fetchAdminReports() {
  await delay(350)
  return {
    usersByRole: [
      { label: 'Students', value: users.filter((user) => user.role === 'student').length },
      { label: 'Instructors', value: users.filter((user) => user.role === 'instructor').length },
      { label: 'Admins', value: users.filter((user) => user.role === 'admin').length },
    ],
    submissionsByStatus: [
      { label: 'Graded', value: submissions.filter((item) => item.status === 'Graded').length },
      { label: 'Submitted', value: submissions.filter((item) => item.status === 'Submitted').length },
      { label: 'Late', value: submissions.filter((item) => item.status === 'Late').length },
      { label: 'Not submitted', value: submissions.filter((item) => item.status === 'Not Submitted').length },
    ],
    courseEnrollment: courses.map((course) => ({ label: course.name, value: 20 + (course.credits || 0) * 7 })),
  }
}

export async function fetchAdminSettings() {
  await delay(250)
  return adminSettings
}

export async function updateAdminSettings(changes) {
  await delay(350)
  adminSettings = { ...adminSettings, ...changes }
  addActivity('Administrator', 'Updated system settings', 'Application settings', 'Settings')
  return adminSettings
}
