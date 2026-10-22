import { useEffect, useState } from 'react'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import FileUpload from '../../components/FileUpload.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import Modal from '../../components/Modal.jsx'
import { fetchStudentAssignmentById, submitAssignment } from '../../services/api.js'

function SubmitAssignment({ assignmentId, onNavigate }) {
  const [assignment, setAssignment] = useState(null)
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [dueDateText, setDueDateText] = useState('')
  const [isLate, setIsLate] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [loadAttempt, setLoadAttempt] = useState(0)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setLoading(true)
      setError('')
      setAssignment(null)
      try {
        const data = await fetchStudentAssignmentById(assignmentId)
        if (isMounted) {
          setAssignment(data)
          if (!data) setError('This assignment could not be found.')
          if (data?.dueDate) {
            const dueAt = new Date(data.dueDate)
            setDueDateText(
              dueAt.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              }),
            )
            setIsLate(Date.now() > dueAt.getTime())
          }
        }
      } catch (loadError) {
        if (isMounted) setError(loadError.message || 'Unable to load assignment.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (assignmentId) load()

    return () => {
      isMounted = false
    }
  }, [assignmentId, loadAttempt])

  if (!assignmentId) {
    return <EmptyState title="Select an assignment" description="Choose an assignment before submitting your work." />
  }

  if (loading) return <LoadingSpinner label="Loading submission form..." />
  if (error && !assignment) {
    return (
      <div className="space-y-4 rounded-xl border border-brand-gold/50 bg-brand-cream p-4 text-sm text-brand-navy" role="alert">
        <div>
          <p className="font-semibold">Submission form unavailable</p>
          <p className="mt-1">{error}</p>
        </div>
        <Button onClick={() => setLoadAttempt((current) => current + 1)} variant="outline">Try again</Button>
      </div>
    )
  }
  if (!assignment) return <EmptyState title="Assignment not found" description="This assignment could not be loaded." />

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!files.length) {
      setError('Please select at least one file to submit.')
      return
    }

    try {
      setSubmitting(true)
      const response = await submitAssignment({ assignmentId, files })
      setSuccess(response.message)
      setConfirmationOpen(false)
    } catch (submitError) {
      setError(submitError.message || 'Submission failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-royal">Submission</p>
          <h2 className="mt-2 text-3xl font-bold text-brand-navy">Submit assignment</h2>
        </div>
        <Button onClick={() => onNavigate('student-assignment-details')} variant="outline">
          View details
        </Button>
      </div>

      <div className="rounded-2xl border border-brand-silver bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-brand-navy">{assignment.title}</h3>
            <p className="mt-1 text-sm text-brand-dark">{assignment.course}</p>
          </div>
          <div className="text-sm font-medium text-brand-dark">
            Due: {dueDateText}
          </div>
        </div>

        {isLate ? (
          <div className="mt-4 rounded-xl border border-brand-gold/50 bg-brand-cream p-3 text-sm text-brand-navy">
            Warning: the deadline has passed. This submission will be marked as late.
          </div>
        ) : null}

        <div className="mt-5">
          <FileUpload
            accept=".pdf,.doc,.docx,.zip,.ppt,.pptx"
            description="Upload your assignment file(s)"
            label="Submission file"
            maxSizeMB={10}
            multiple={false}
            onFilesChange={setFiles}
          />
        </div>

        {error ? <p className="mt-4 rounded-xl border border-brand-gold/50 bg-brand-cream px-3 py-2 text-sm text-brand-navy" role="alert">{error}</p> : null}
        {success ? <p className="mt-4 rounded-xl border border-brand-gold/50 bg-brand-gold/15 px-3 py-2 text-sm text-brand-navy" role="status">{success}</p> : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button disabled={submitting || !files.length} onClick={() => setConfirmationOpen(true)} variant="accent">
            Confirm submission
          </Button>
          <Button onClick={() => onNavigate('student-assignments')} variant="outline">
            Cancel
          </Button>
        </div>
      </div>
      <Modal
        footer={
          <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
            <Button onClick={() => setConfirmationOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button loading={submitting} onClick={handleSubmit} variant="accent">
              Submit assignment
            </Button>
          </div>
        }
        onClose={() => setConfirmationOpen(false)}
        open={confirmationOpen}
        title="Confirm your submission"
        size="sm"
      >
        <p>
          Submit the selected file for <strong>{assignment.title}</strong>?
        </p>
        {isLate ? (
          <p className="mt-3 rounded-lg bg-brand-gold/15 p-3 text-sm text-brand-navy">
            This submission will be marked late because the deadline has passed.
          </p>
        ) : null}
      </Modal>
    </div>
  )
}

export default SubmitAssignment
