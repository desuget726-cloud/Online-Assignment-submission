import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { fetchStudentSubmissions } from '../../services/api.js'

function MySubmissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchStudentSubmissions()
        if (isMounted) setSubmissions(data)
      } catch (loadError) {
        if (isMounted) setError(loadError.message || 'Unable to load submissions.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) return <LoadingSpinner label="Loading submissions..." />
  if (error) return <EmptyState title="Submission history unavailable" description={error} />

  const columns = [
    { key: 'assignmentTitle', label: 'Assignment' },
    { key: 'submittedAt', label: 'Submitted', render: (row) => row.submittedAt ? new Date(row.submittedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not submitted' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'grade', label: 'Grade', render: (row) => (row.grade === null ? '—' : `${row.grade}/${row.maxMarks}`) },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-royal">Work history</p>
        <h2 className="mt-2 text-3xl font-bold text-brand-navy">My submissions</h2>
      </div>

      {submissions.length ? (
        <DataTable
          columns={columns}
          data={submissions}
          emptyMessage="Your submission history is empty."
          emptyTitle="No submissions yet"
          pageSize={5}
          searchPlaceholder="Search submissions"
        />
      ) : (
        <EmptyState title="No submissions yet" description="Your submitted assignments will appear here." />
      )}
    </div>
  )
}

export default MySubmissions
