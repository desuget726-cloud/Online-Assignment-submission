import { useEffect, useState } from 'react'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import { fetchStudentCourses } from '../../services/api.js'

function MyCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        const result = await fetchStudentCourses()
        if (isMounted) setCourses(result)
      } catch (loadError) {
        if (isMounted) setError(loadError.message || 'Unable to load courses.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) return <LoadingSpinner label="Loading courses..." />
  if (error) return <EmptyState title="Course list unavailable" description={error} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-royal">Academic record</p>
          <h2 className="mt-2 text-3xl font-bold text-brand-navy">My courses</h2>
        </div>
        <Button variant="outline">Register new course</Button>
      </div>

      {courses.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {courses.map((course) => (
            <article key={course.id} className="rounded-2xl border border-brand-silver bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-dark">{course.code}</p>
                  <h3 className="mt-2 text-xl font-semibold text-brand-navy">{course.name}</h3>
                </div>
                <span className="rounded-full bg-brand-gold/15 px-2 py-1 text-xs font-semibold text-brand-navy">
                  {course.category}
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-brand-dark">Instructor</p>
                  <p className="mt-1 text-sm font-medium text-brand-dark">{course.instructor}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-brand-dark">Credits</p>
                  <p className="mt-1 text-sm font-medium text-brand-dark">{course.credits}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-brand-dark">Next lecture</p>
                  <p className="mt-1 text-sm font-medium text-brand-dark">
                    {new Date(course.nextLecture).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm text-brand-dark">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-brand-silver">
                  <div className="h-full rounded-full bg-brand-navy" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No courses found" description="You are not enrolled in any active course yet." />
      )}
    </div>
  )
}

export default MyCourses
