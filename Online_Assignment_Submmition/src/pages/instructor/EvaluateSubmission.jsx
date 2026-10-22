import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '../../components/Button.jsx'
import {
  fetchInstructorAssignments,
  fetchInstructorSubmission,
  fetchInstructorSubmissions,
  publishEvaluation,
  saveEvaluationDraft,
} from '../../services/api.js'
import { cardClass, fieldClass, formatDate, labelClass, pageClass, studentName } from './instructorData.js'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  StatusPill,
} from './shared.jsx'
import { useInstructorResource } from './useInstructorResource.js'

function EvaluateSubmission({ submissionId, onNavigate, loading: externalLoading = false, error: externalError = '', onRetry }) {
  const loadSubmissions = useCallback(
    () => Promise.all([fetchInstructorSubmissions(), fetchInstructorAssignments()]),
    [],
  )
  const listResource = useInstructorResource(loadSubmissions, [[], []])
  const [selectedId, setSelectedId] = useState(submissionId || '')
  const [marks, setMarks] = useState('')
  const [feedback, setFeedback] = useState('')
  const [markError, setMarkError] = useState('')
  const [pending, setPending] = useState(false)
  const [formError, setFormError] = useState('')
  const [message, setMessage] = useState('')
  const [detail, setDetail] = useState(null)
  const [detailError, setDetailError] = useState('')
  const [detailRequest, setDetailRequest] = useState(0)

  const [submissionRows = [], assignmentRows = []] = listResource.data || []
  const records = useMemo(() => submissionRows
    .filter((submission) => assignmentRows.some((assignment) => assignment.id === submission.assignmentId))
    .filter((submission) => submission.status !== 'Not Submitted'), [assignmentRows, submissionRows])
  const activeId = selectedId || records[0]?.id || ''
  const selected = detail || records.find((record) => record.id === activeId)
  const assignment = assignmentRows.find((item) => item.id === selected?.assignmentId)

  useEffect(() => {
    if (!activeId) return undefined
    let active = true
    fetchInstructorSubmission(activeId)
      .then((result) => {
        if (!active) return
        if (!result || result.status === 'Not Submitted') {
          setDetail(null)
          setDetailError(result ? 'This assignment has not been submitted and cannot be evaluated.' : 'Submission was not found.')
          return
        }
        setDetail(result)
        setMarks(result.grade == null ? '' : String(result.grade))
        setFeedback(result.feedback || '')
        setMarkError('')
        setFormError('')
        setMessage('')
      })
      .catch((cause) => {
        if (active) setDetailError(cause?.message || 'Could not load this submission.')
      })
    return () => {
      active = false
    }
  }, [activeId, detailRequest])

  const selectSubmission = (nextId) => {
    setSelectedId(nextId)
    setDetail(null)
    setDetailError('')
    setMarkError('')
    setFormError('')
    setMessage('')
  }

  const retryDetail = () => {
    setDetailError('')
    setDetailRequest((current) => current + 1)
  }

  const save = async (publish) => {
    const numericMarks = Number(marks)
    if (!selected || marks === '' || !Number.isFinite(numericMarks) || numericMarks < 0 || numericMarks > Number(selected.maxMarks)) {
      setMarkError(`Enter marks from 0 to ${selected?.maxMarks ?? 0}.`)
      document.getElementById('evaluation-marks')?.focus()
      return
    }
    if (!feedback.trim()) {
      setFormError('Feedback is required before saving or publishing an evaluation.')
      document.getElementById('evaluation-feedback')?.focus()
      return
    }
    setMarkError('')
    setFormError('')
    setPending(true)
    try {
      const evaluation = { marks: numericMarks, feedback: feedback.trim() }
      const updated = publish
        ? await publishEvaluation(selected.id, evaluation)
        : await saveEvaluationDraft(selected.id, evaluation)
      setDetail(updated)
      setMessage(publish ? 'Evaluation published to the student.' : 'Evaluation draft saved.')
    } catch (cause) {
      setFormError(cause?.message || 'The evaluation could not be saved.')
    } finally {
      setPending(false)
    }
  }

  const loading = externalLoading || listResource.loading || Boolean(activeId && !detail && !detailError)
  const pageError = externalError || listResource.error
  if (loading) return <LoadingState label="Loading submission…" />
  if (pageError) return <ErrorState message={pageError} onRetry={onRetry || listResource.retry} />

  return (
    <div className={pageClass}>
      <PageHeading title="Evaluate submission" description="Score the work, add clear feedback, then save privately as a draft or publish the evaluation." />
      {formError ? <ErrorState message={formError} /> : null}
      {detailError ? <ErrorState message={detailError} onRetry={retryDetail} /> : null}
      {message ? <p className="rounded-lg border border-brand-gold/50 bg-brand-gold/15 p-3 text-sm text-brand-navy" role="status">{message}</p> : null}
      {!records.length ? (
        <EmptyState
          title="No submissions to evaluate"
          message="Submitted student work for your courses will appear here. Assignments not yet submitted cannot be evaluated."
          action={<Button onClick={() => onNavigate?.('instructor-submissions')} variant="outline">View submissions</Button>}
        />
      ) : (
        <>
          <section className={cardClass}>
            <label className={labelClass} htmlFor="submission-select">Choose a submission</label>
            <select className={`${fieldClass} mt-1 max-w-2xl`} id="submission-select" onChange={(event) => selectSubmission(event.target.value)} value={activeId}>
              {records.map((record) => {
                const title = assignmentRows.find((item) => item.id === record.assignmentId)?.title || record.assignmentTitle
                return <option key={record.id} value={record.id}>{title} · {record.id}</option>
              })}
            </select>
          </section>
          {selected && selected.status !== 'Not Submitted' ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
              <section aria-labelledby="submission-details-title" className={cardClass}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-brand-royal">{assignment?.course || 'Course submission'}</p>
                    <h2 className="mt-1 text-xl font-bold text-brand-navy" id="submission-details-title">{assignment?.title || selected.assignmentTitle}</h2>
                    <p className="mt-2 text-sm text-brand-dark">Submitted {formatDate(selected.submittedAt)}</p>
                  </div>
                  <StatusPill status={selected.status} />
                </div>
                <dl className="mt-5 grid gap-4 border-y border-brand-silver py-4 sm:grid-cols-2">
                  <div><dt className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Student</dt><dd className="mt-1 text-sm text-brand-navy">{studentName()}</dd></div>
                  <div><dt className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Maximum marks</dt><dd className="mt-1 text-sm text-brand-navy">{selected.maxMarks}</dd></div>
                </dl>
                <div className="mt-5">
                  <h3 className="font-semibold text-brand-navy">Assignment description</h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-brand-dark">{assignment?.description || 'No assignment description is available.'}</p>
                </div>
              </section>

              <form aria-label="Evaluation form" className={cardClass} noValidate onSubmit={(event) => { event.preventDefault(); save(true) }}>
                <h2 className="text-lg font-semibold text-brand-navy">Your evaluation</h2>
                <div className="mt-5">
                  <label className={labelClass} htmlFor="evaluation-marks">Marks awarded <span className="font-normal text-brand-dark">(0–{selected.maxMarks})</span></label>
                  <input
                    aria-describedby={markError ? 'evaluation-marks-error' : 'evaluation-marks-help'}
                    aria-invalid={Boolean(markError)}
                    className={fieldClass}
                    id="evaluation-marks"
                    max={selected.maxMarks}
                    min="0"
                    onChange={(event) => { setMarks(event.target.value); setMarkError('') }}
                    required
                    step="any"
                    type="number"
                    value={marks}
                  />
                  {markError ? <p className="mt-1 text-sm text-brand-navy" id="evaluation-marks-error">{markError}</p> : <p className="mt-1 text-xs text-brand-dark" id="evaluation-marks-help">Marks cannot be below zero or exceed the assignment maximum.</p>}
                </div>
                <div className="mt-5">
                  <label className={labelClass} htmlFor="evaluation-feedback">Feedback <span aria-hidden="true">*</span></label>
                  <textarea aria-invalid={Boolean(formError && !feedback.trim())} className={fieldClass} id="evaluation-feedback" maxLength="3000" onChange={(event) => { setFeedback(event.target.value); setFormError('') }} placeholder="Share specific strengths and suggestions for improvement." required rows="6" value={feedback} />
                  <p className="mt-1 text-right text-xs text-brand-dark">{feedback.length}/3000</p>
                </div>
                <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-brand-silver pt-5">
                  <Button disabled={pending} loading={pending} onClick={() => save(false)} type="button" variant="outline">Save draft</Button>
                  <Button disabled={pending} loading={pending} type="submit" variant="accent">Publish evaluation</Button>
                </div>
              </form>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

export default EvaluateSubmission
