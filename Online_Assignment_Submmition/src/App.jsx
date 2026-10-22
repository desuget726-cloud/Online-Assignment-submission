import { useEffect, useMemo, useState } from 'react'
import { useAuth } from './context/useAuth.js'
import AdminLayout from './layouts/AdminLayout.jsx'
import InstructorLayout from './layouts/InstructorLayout.jsx'
import StudentLayout from './layouts/StudentLayout.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import Register from './pages/auth/Register.jsx'
import About from './pages/public/About.jsx'
import Contact from './pages/public/Contact.jsx'
import Home from './pages/public/Home.jsx'
import Services from './pages/public/Services.jsx'
import AccessSection from './components/home/AccessSection.jsx'
import AssignmentDetails from './pages/student/AssignmentDetails.jsx'
import Dashboard from './pages/student/Dashboard.jsx'
import MyAssignments from './pages/student/MyAssignments.jsx'
import MyCourses from './pages/student/MyCourses.jsx'
import MyGrades from './pages/student/MyGrades.jsx'
import MySubmissions from './pages/student/MySubmissions.jsx'
import Notifications from './pages/student/Notifications.jsx'
import Profile from './pages/student/Profile.jsx'
import SubmitAssignment from './pages/student/SubmitAssignment.jsx'
import InstructorDashboard from './pages/instructor/Dashboard.jsx'
import CreateAssignment from './pages/instructor/CreateAssignment.jsx'
import ManageAssignments from './pages/instructor/ManageAssignments.jsx'
import InstructorSubmissions from './pages/instructor/Submissions.jsx'
import EvaluateSubmission from './pages/instructor/EvaluateSubmission.jsx'
import InstructorReports from './pages/instructor/Reports.jsx'
import InstructorNotifications from './pages/instructor/Notifications.jsx'
import InstructorProfile from './pages/instructor/Profile.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import ManageUsers from './pages/admin/Users.jsx'
import ManageCourses from './pages/admin/Courses.jsx'
import ActivityLog from './pages/admin/ActivityLog.jsx'
import AdminReports from './pages/admin/Reports.jsx'
import AdminSettings from './pages/admin/Settings.jsx'
import ManageStudents from './pages/admin/ManageStudents.jsx'
import ManageInstructors from './pages/admin/ManageInstructors.jsx'
import AddUser from './pages/admin/AddUser.jsx'
import BulkUpload from './pages/admin/BulkUpload.jsx'
import ImportResults from './pages/admin/ImportResults.jsx'
import ImportHistory from './pages/admin/ImportHistory.jsx'
import { pagesByRole } from './utils/navigation.js'

const roleTitles = {
  student: 'Student',
  instructor: 'Instructor',
  admin: 'Administrator',
}

function AccessDenied({ requiredRole, onGoToDashboard }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-cream px-4">
      <section
        aria-labelledby="access-denied-title"
        className="w-full max-w-md rounded-2xl border border-brand-silver bg-white p-8 text-center shadow-sm"
      >
        <h1 className="text-2xl font-bold text-brand-navy" id="access-denied-title">
          This page is not available for your role
        </h1>
        <p className="mt-3 text-brand-dark">
          Switch to an account with {roleTitles[requiredRole]} access to continue.
        </p>
        <button
          className="mt-6 rounded-lg bg-brand-navy px-4 py-2.5 font-semibold text-white hover:bg-brand-royal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-royal"
          onClick={onGoToDashboard}
          type="button"
        >
          Go to my dashboard
        </button>
      </section>
    </main>
  )
}

function App() {
  const { user, logout } = useAuth()
  const [publicPage, setPublicPage] = useState('home')
  const [loginRole, setLoginRole] = useState('student')
  const [page, setPage] = useState('login')
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null)
  const [selectedImportId, setSelectedImportId] = useState(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page, publicPage, user])

  const route = useMemo(() => {
    if (!user) return null

    const activePage = page === 'login' ? `${user.role}-dashboard` : page
    return (
      Object.entries(pagesByRole)
        .flatMap(([role, rolePages]) =>
          rolePages.map(([id, title]) => ({ id, title, role })),
        )
        .find(({ id }) => id === activePage) || {
          id: `${user.role}-dashboard`,
          title: 'Dashboard',
          role: user.role,
        }
    )
  }, [page, user])

  const handleNavigate = (nextPage, resourceId) => {
    setPage(nextPage)
    if (nextPage === 'admin-import-results') setSelectedImportId(resourceId || null)
    if (!['student-assignment-details', 'student-submit-assignment'].includes(nextPage)) {
      setSelectedAssignmentId(null)
    }
    if (nextPage !== 'instructor-evaluate-submission') {
      setSelectedSubmissionId(null)
    }
  }

  const handlePublicNavigate = (target, role) => {
    if (target === 'login' && ['student', 'instructor', 'admin'].includes(role)) {
      setLoginRole(role)
    }

    if (target === 'forgot-password') {
      setPublicPage('forgot')
      return
    }

    if (target?.endsWith('-dashboard')) {
      setPage(target)
      return
    }

    setPublicPage(target || 'login')
  }

  if (!user) {
    const publicViews = {
      home: <Home onNavigate={handlePublicNavigate} />,
      about: <About />,
      services: <Services />,
      contact: <Contact />,
      login: <AccessSection initialRole={loginRole} key={loginRole} onNavigate={handlePublicNavigate} />,
      register: <Register onNavigate={handlePublicNavigate} />,
      forgot: <ForgotPassword onNavigate={handlePublicNavigate} />,
    }
    return (
      <PublicLayout activePage={publicPage} onNavigate={handlePublicNavigate}>
        {publicViews[publicPage] || publicViews.home}
      </PublicLayout>
    )
  }

  const activePage = route?.id || `${user.role}-dashboard`

  // BACKEND REQUIRED: enforce role permissions for every page and API on the server; this client guard is presentation-only.
  if (user.role !== route.role) {
    return (
      <AccessDenied
        onGoToDashboard={() => setPage(`${user.role}-dashboard`)}
        requiredRole={route.role}
      />
    )
  }

  const Layout = {
    student: StudentLayout,
    instructor: InstructorLayout,
    admin: AdminLayout,
  }[route.role]

  const studentViews = {
    'student-dashboard': (
      <Dashboard onNavigate={handleNavigate} onSelectAssignment={(id) => setSelectedAssignmentId(id)} />
    ),
    'student-courses': <MyCourses />,
    'student-assignments': (
      <MyAssignments onNavigate={handleNavigate} onSelectAssignment={(id) => setSelectedAssignmentId(id)} />
    ),
    'student-assignment-details': (
      <AssignmentDetails
        assignmentId={selectedAssignmentId}
        onNavigate={handleNavigate}
        onSelectAssignment={(id) => setSelectedAssignmentId(id)}
      />
    ),
    'student-submit-assignment': (
      <SubmitAssignment assignmentId={selectedAssignmentId} onNavigate={handleNavigate} />
    ),
    'student-submissions': <MySubmissions />,
    'student-grades': <MyGrades />,
    'student-notifications': <Notifications />,
    'student-profile': <Profile />,
  }

  const instructorViews = {
    'instructor-dashboard': <InstructorDashboard onNavigate={handleNavigate} />,
    'instructor-create-assignment': (
      <CreateAssignment onNavigate={handleNavigate} />
    ),
    'instructor-assignments': (
      <ManageAssignments onNavigate={handleNavigate} />
    ),
    'instructor-submissions': (
      <InstructorSubmissions
        onNavigate={handleNavigate}
        onSelectSubmission={setSelectedSubmissionId}
      />
    ),
    'instructor-evaluate-submission': (
      <EvaluateSubmission
        submissionId={selectedSubmissionId}
        onNavigate={handleNavigate}
      />
    ),
    'instructor-reports': <InstructorReports />,
    'instructor-notifications': <InstructorNotifications />,
    'instructor-profile': <InstructorProfile />,
  }

  const adminViews = {
    'admin-dashboard': <AdminDashboard onNavigate={handleNavigate} />,
    'admin-users': <ManageUsers onNavigate={handleNavigate} />,
    'admin-students': <ManageStudents onNavigate={handleNavigate} />,
    'admin-instructors': <ManageInstructors onNavigate={handleNavigate} />,
    'admin-add-student': <AddUser onNavigate={handleNavigate} role="student" />,
    'admin-add-instructor': <AddUser onNavigate={handleNavigate} role="instructor" />,
    'admin-bulk-upload': <BulkUpload onNavigate={handleNavigate} />,
    'admin-import-history': <ImportHistory onNavigate={handleNavigate} />,
    'admin-import-results': <ImportResults importId={selectedImportId} onNavigate={handleNavigate} />,
    'admin-courses': <ManageCourses />,
    'admin-activity': <ActivityLog />,
    'admin-reports': <AdminReports />,
    'admin-settings': <AdminSettings />,
  }

  return (
    <Layout
      activePage={activePage}
      onLogout={() => {
        logout()
        setPage('login')
        setPublicPage('home')
        setSelectedAssignmentId(null)
        setSelectedSubmissionId(null)
      }}
      onNavigate={handleNavigate}
      title={route.title}
      user={user}
    >
      {route.role === 'student'
        ? studentViews[activePage] || studentViews['student-dashboard']
        : route.role === 'instructor'
          ? instructorViews[activePage] || instructorViews['instructor-dashboard']
          : adminViews[activePage] || adminViews['admin-dashboard']}
    </Layout>
  )
}

export default App
