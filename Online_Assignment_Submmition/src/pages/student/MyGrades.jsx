import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { fetchStudentGrades } from '../../services/api.js'

function MyGrades() {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchStudentGrades()
        if (isMounted) setGrades(data)
      } catch (loadError) {
        if (isMounted) setError(loadError.message || 'Unable to load grades.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) return <LoadingSpinner label="Loading grades..." />
  if (error) return <EmptyState title="Gradebook unavailable" description={error} />

  const columns = [
    { key: 'assignment', label: 'Assignment' },
    { key: 'course', label: 'Course' },
    { key: 'grade', label: 'Result', render: (row) => (row.grade === null ? 'Pending' : `${row.grade}/${row.maxMarks}`) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-royal">Assessment</p>
        <h2 className="mt-2 text-3xl font-bold text-brand-navy">My grades</h2>
      </div>

      {grades.length ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-brand-silver bg-white p-4 shadow-sm">
              <p className="text-sm text-brand-dark">Average grade</p>
              <p className="mt-2 text-3xl font-bold text-brand-navy">
                {((grades.filter((item) => item.grade !== null).reduce((sum, item) => sum + item.grade, 0) / Math.max(1, grades.filter((item) => item.grade !== null).length)) || 0).toFixed(1)}
              </p>
            </div>
            <div className="rounded-2xl border border-brand-silver bg-white p-4 shadow-sm">
              <p className="text-sm text-brand-dark">Completed</p>
              <p className="mt-2 text-3xl font-bold text-brand-navy">{grades.filter((item) => item.grade !== null).length}</p>
            </div>
            <div className="rounded-2xl border border-brand-silver bg-white p-4 shadow-sm">
              <p className="text-sm text-brand-dark">Pending</p>
              <p className="mt-2 text-3xl font-bold text-brand-navy">{grades.filter((item) => item.grade === null).length}</p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={grades}
            emptyMessage="No graded work available yet."
            emptyTitle="No grades found"
            pageSize={5}
            searchPlaceholder="Search grades"
          />
        </div>
      ) : (
        <EmptyState title="No grades available" description="Once instructors publish marks, they will appear here." />
      )}
    </div>
  )
}

export default MyGrades
