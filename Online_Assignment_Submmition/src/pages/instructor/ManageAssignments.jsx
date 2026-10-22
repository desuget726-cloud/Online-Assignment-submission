import { useCallback, useMemo, useState } from 'react'
import Button from '../../components/Button.jsx'
import Modal from '../../components/Modal.jsx'
import { courses } from '../../data/mockData.js'
import { fetchInstructorAssignments, updateInstructorAssignment } from '../../services/api.js'
import { cardClass, fieldClass, formatDate, instructorCourseIds, labelClass, pageClass } from './instructorData.js'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  StatusPill,
} from './shared.jsx'
import { useInstructorResource } from './useInstructorResource.js'

function normalizeAssignment(assignment) {
  const status = ['Draft', 'Closed'].includes(assignment.status) ? assignment.status : 'Published'
  return { ...assignment, status }
}

function toLocalInput(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16)
}

function ManageAssignments({ onNavigate, loading: externalLoading = false, error: externalError = '', onRetry }) {
  const resource = useInstructorResource(fetchInstructorAssignments, [])
  const [overrides, setOverrides] = useState({})
  const [filter, setFilter] = useState('All')
  const [editing, setEditing] = useState(null)
  const [pendingId, setPendingId] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const closeEdit = useCallback(() => setEditing(null), [])

  const loading = externalLoading || resource.loading
  const pageError = externalError || resource.error
  const rows = useMemo(() => (Array.isArray(resource.data) ? resource.data : [])
    .filter((row) => instructorCourseIds.has(row.courseId))
    .map((row) => ({ ...normalizeAssignment(row), ...overrides[row.id] })), [overrides, resource.data])

  const visibleRows = useMemo(
    () => rows.filter((row) => filter === 'All' || row.status === filter),
    [filter, rows],
  )

  const saveEdit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const title = String(formData.get('title') || '').trim()
    const dueDate = String(formData.get('dueDate') || '')
    const maxMarks = Number(formData.get('maxMarks'))
    if (!title || !dueDate || !Number.isFinite(maxMarks) || maxMarks <= 0) {
      setError('Enter a title, due date, and a maximum mark greater than zero.')
      return
    }
    setPendingId(editing.id)
    setError('')
    try {
      const update = {
        title,
        dueDate,
        maxMarks,
        description: String(formData.get('description') || '').trim(),
        instructions: String(formData.get('instructions') || '').trim(),
      }
      await updateInstructorAssignment(editing.id, update)
      setOverrides((current) => ({ ...current, [editing.id]: { ...current[editing.id], ...update } }))
      setMessage('Assignment updated.')
      setEditing(null)
    } catch (cause) {
      setError(cause?.message || 'The assignment could not be updated.')
    } finally {
      setPendingId('')
    }
  }

  const changeStatus = async (row, status) => {
    setPendingId(row.id)
    setError('')
    setMessage('')
    try {
      await updateInstructorAssignment(row.id, { status })
      setOverrides((current) => ({ ...current, [row.id]: { ...current[row.id], status } }))
      setMessage(`“${row.title}” ${status.toLowerCase()}.`)
    } catch (cause) {
      setError(cause?.message || `Could not ${status.toLowerCase()} the assignment.`)
    } finally {
      setPendingId('')
    }
  }

  if (loading) return <LoadingState label="Loading assignments…" />
  if (pageError) return <ErrorState message={pageError} onRetry={onRetry || resource.retry} />

  return (
    <div className={pageClass}>
      <PageHeading
        title="Manage assignments"
        description="Edit assignment details, publish drafts, or close assignments that are no longer accepting work."
      >
        <Button onClick={() => onNavigate?.('instructor-create-assignment')}>Create assignment</Button>
      </PageHeading>
      {error ? <ErrorState message={error} /> : null}
      {message ? <p className="rounded-lg border border-brand-gold/50 bg-brand-gold/15 p-3 text-sm text-brand-navy" role="status">{message}</p> : null}

      <section aria-label="Assignment list" className={cardClass}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-brand-navy">Your assignments</h2>
            <p className="mt-1 text-sm text-brand-dark">{rows.length} assignment{rows.length === 1 ? '' : 's'}</p>
          </div>
          <div>
            <label className={labelClass} htmlFor="assignment-status-filter">Filter by status</label>
            <select className={`${fieldClass} mt-1 min-w-40`} id="assignment-status-filter" onChange={(event) => setFilter(event.target.value)} value={filter}>
              {['All', 'Published', 'Draft', 'Closed'].map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>
        </div>
        {visibleRows.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-brand-silver bg-brand-cream text-xs uppercase tracking-wide text-brand-dark">
                <tr><th className="px-3 py-3 font-semibold">Assignment</th><th className="px-3 py-3 font-semibold">Course</th><th className="px-3 py-3 font-semibold">Due date</th><th className="px-3 py-3 font-semibold">Marks</th><th className="px-3 py-3 font-semibold">Status</th><th className="px-3 py-3 font-semibold">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-brand-silver">
                {visibleRows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-3 py-4 font-medium text-brand-navy">{row.title}</td>
                    <td className="px-3 py-4 text-brand-dark">{courses.find((course) => course.id === row.courseId)?.code || row.course}</td>
                    <td className="px-3 py-4 text-brand-dark">{formatDate(row.dueDate)}</td>
                    <td className="px-3 py-4 text-brand-dark">{row.maxMarks}</td>
                    <td className="px-3 py-4"><StatusPill status={row.status} /></td>
                    <td className="px-3 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button aria-label={`Edit ${row.title}`} onClick={() => { setEditing(row); setError('') }} size="sm" variant="outline">Edit</Button>
                        {row.status === 'Draft' ? (
                          <Button disabled={pendingId === row.id} loading={pendingId === row.id} onClick={() => changeStatus(row, 'Published')} size="sm" variant="accent">Publish</Button>
                        ) : row.status === 'Published' ? (
                          <Button disabled={pendingId === row.id} loading={pendingId === row.id} onClick={() => changeStatus(row, 'Closed')} size="sm" variant="secondary">Close</Button>
                        ) : (
                          <Button disabled={pendingId === row.id} loading={pendingId === row.id} onClick={() => changeStatus(row, 'Published')} size="sm" variant="outline">Reopen</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title={rows.length ? 'No assignments match this filter' : 'No assignments yet'} message={rows.length ? 'Choose another status to see assignments.' : 'Create an assignment to share work with your students.'} />
        )}
      </section>

      <Modal
        onClose={closeEdit}
        open={Boolean(editing)}
        size="lg"
        title="Edit assignment"
      >
        {editing ? (
          <>
            <p className="text-sm text-brand-dark">{editing.course}</p>
            <form className="mt-5 space-y-4" onSubmit={saveEdit}>
              <div><label className={labelClass} htmlFor="edit-title">Title</label><input className={fieldClass} defaultValue={editing.title} id="edit-title" maxLength="120" name="title" required /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelClass} htmlFor="edit-dueDate">Due date and time</label><input className={fieldClass} defaultValue={toLocalInput(editing.dueDate)} id="edit-dueDate" name="dueDate" required type="datetime-local" /></div>
                <div><label className={labelClass} htmlFor="edit-maxMarks">Maximum marks</label><input className={fieldClass} defaultValue={editing.maxMarks} id="edit-maxMarks" max="10000" min="1" name="maxMarks" required type="number" /></div>
              </div>
              <div><label className={labelClass} htmlFor="edit-description">Description</label><textarea className={fieldClass} defaultValue={editing.description} id="edit-description" name="description" rows="3" /></div>
              <div><label className={labelClass} htmlFor="edit-instructions">Instructions</label><textarea className={fieldClass} defaultValue={editing.instructions} id="edit-instructions" name="instructions" rows="3" /></div>
              <div className="flex justify-end gap-3 border-t border-brand-silver pt-4">
                <Button onClick={closeEdit} variant="outline">Cancel</Button>
                <Button disabled={pendingId === editing.id} loading={pendingId === editing.id} type="submit">Save changes</Button>
              </div>
            </form>
          </>
        ) : null}
      </Modal>
    </div>
  )
}

export default ManageAssignments
