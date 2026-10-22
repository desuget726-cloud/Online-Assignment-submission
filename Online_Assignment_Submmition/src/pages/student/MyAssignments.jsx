import { useEffect, useMemo, useState } from 'react'
import AssignmentCard from '../../components/AssignmentCard.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import { fetchStudentAssignments, fetchStudentCourses } from '../../services/api.js'

function MyAssignments({ onNavigate, onSelectAssignment }) {
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deadlineFilter, setDeadlineFilter] = useState('all')
  const [today] = useState(() => Date.now())

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        const [assignmentData, courseData] = await Promise.all([
          fetchStudentAssignments(),
          fetchStudentCourses(),
        ])

        if (isMounted) {
          setAssignments(assignmentData)
          setCourses(courseData)
        }
      } catch (loadError) {
        if (isMounted) setError(loadError.message || 'Unable to load assignments.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase()

    return assignments.filter((assignment) => {
      const matchesQuery =
        !query ||
        assignment.title.toLowerCase().includes(query) ||
        assignment.course.toLowerCase().includes(query)

      const matchesCourse = courseFilter === 'all' || assignment.courseId === courseFilter
      const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter
      const isOverdue =
        assignment.status === 'Late' ||
        new Date(assignment.dueDate).getTime() < today
      const matchesDeadline =
        deadlineFilter === 'all' ||
        (deadlineFilter === 'upcoming' && !isOverdue) ||
        (deadlineFilter === 'overdue' && isOverdue)
      return matchesQuery && matchesCourse && matchesStatus && matchesDeadline
    })
  }, [assignments, courseFilter, deadlineFilter, search, statusFilter, today])

  if (loading) return <LoadingSpinner label="Loading assignments..." />
  if (error) return <EmptyState title="Assignments unavailable" description={error} />

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-royal">Learning</p>
        <h2 className="mt-2 text-3xl font-bold text-brand-navy">My assignments</h2>
      </div>

      <div className="rounded-2xl border border-brand-silver bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            aria-label="Search assignments"
            className="rounded-lg border border-brand-silver bg-white px-3 py-2.5 text-sm focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search assignment or course"
            type="search"
            value={search}
          />

          <select
            aria-label="Filter by course"
            className="rounded-lg border border-brand-silver bg-white px-3 py-2.5 text-sm focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            onChange={(event) => setCourseFilter(event.target.value)}
            value={courseFilter}
          >
            <option value="all">All courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by status"
            className="rounded-lg border border-brand-silver bg-white px-3 py-2.5 text-sm focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            onChange={(event) => setStatusFilter(event.target.value)}
            value={statusFilter}
          >
            <option value="all">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Submitted">Submitted</option>
            <option value="Late">Late</option>
            <option value="Graded">Graded</option>
          </select>

          <select
            aria-label="Filter by deadline"
            className="rounded-lg border border-brand-silver bg-white px-3 py-2.5 text-sm focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            onChange={(event) => setDeadlineFilter(event.target.value)}
            value={deadlineFilter}
          >
            <option value="all">All deadlines</option>
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Past due</option>
          </select>
        </div>
      </div>

      {filteredAssignments.length ? (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              actionLabel="Details"
              assignment={assignment}
              onSubmit={() => {
                onSelectAssignment(assignment.id)
                onNavigate('student-submit-assignment')
              }}
              onView={() => {
                onSelectAssignment(assignment.id)
                onNavigate('student-assignment-details')
              }}
              showSubmit
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No assignments match" description="Try resetting your filters or searching for another term." />
      )}
    </div>
  )
}

export default MyAssignments
