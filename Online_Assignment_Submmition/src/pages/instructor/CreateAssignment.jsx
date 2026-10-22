import { useState } from 'react'
import Button from '../../components/Button.jsx'
import FileUpload from '../../components/FileUpload.jsx'
import { courses } from '../../data/mockData.js'
import { createInstructorAssignment } from '../../services/api.js'
import { fieldClass, instructor, instructorCourses, labelClass, pageClass, cardClass } from './instructorData.js'
import {
  ErrorState,
  LoadingState,
  PageHeading,
} from './shared.jsx'

const blankForm = { title: '', courseId: '', dueDate: '', maxMarks: '', description: '', instructions: '' }

function validate(values) {
  const issues = {}
  if (!values.title.trim()) issues.title = 'Enter an assignment title.'
  if (!instructorCourses.some((course) => course.id === values.courseId)) issues.courseId = 'Choose one of your courses.'
  if (!values.dueDate) issues.dueDate = 'Choose a due date and time.'
  else if (Number.isNaN(new Date(values.dueDate).getTime())) issues.dueDate = 'Enter a valid due date.'
  if (!Number.isFinite(Number(values.maxMarks)) || Number(values.maxMarks) <= 0) {
    issues.maxMarks = 'Maximum marks must be greater than zero.'
  }
  if (!values.description.trim()) issues.description = 'Add a short assignment description.'
  if (!values.instructions.trim()) issues.instructions = 'Add submission instructions.'
  return issues
}

function CreateAssignment({ onNavigate, loading = false, error: pageError = '', onRetry }) {
  const [form, setForm] = useState(blankForm)
  const [attachmentFiles, setAttachmentFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [preview, setPreview] = useState(false)
  const [pending, setPending] = useState(false)
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setFormError('')
    setSuccess('')
  }

  const showPreview = (event) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setPreview(false)
      document.getElementById(Object.keys(nextErrors)[0])?.focus()
      return
    }
    setPreview(true)
  }

  const save = async (status) => {
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setPreview(false)
      document.getElementById(Object.keys(nextErrors)[0])?.focus()
      return
    }
    setPending(true)
    setFormError('')
    try {
      await createInstructorAssignment({
        ...form,
        maxMarks: Number(form.maxMarks),
        course: courses.find((course) => course.id === form.courseId)?.name || '',
        instructorId: instructor?.id,
        status,
        attachmentFiles,
      })
      setSuccess(status === 'Published' ? 'Assignment published successfully.' : 'Assignment saved as a draft.')
      if (status === 'Published') onNavigate?.('instructor-assignments')
    } catch (cause) {
      setFormError(cause?.message || 'The assignment could not be saved. Please try again.')
    } finally {
      setPending(false)
    }
  }

  if (loading) return <LoadingState label="Loading assignment form…" />
  if (pageError) return <ErrorState message={pageError} onRetry={onRetry} />

  const selectedCourse = courses.find((course) => course.id === form.courseId)

  return (
    <div className={pageClass}>
      <PageHeading
        title="Create assignment"
        description="Set the assignment details, preview what students will see, then publish or save it as a draft."
      />
      {formError ? <ErrorState message={formError} /> : null}
      {success ? <p className="rounded-lg border border-brand-gold/50 bg-brand-gold/15 p-3 text-sm text-brand-navy" role="status">{success}</p> : null}

      {preview ? (
        <section aria-labelledby="assignment-preview-title" className={`${cardClass} max-w-3xl`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-brand-royal">Student view</p>
              <h2 className="mt-1 text-xl font-bold text-brand-navy" id="assignment-preview-title">{form.title}</h2>
              <p className="mt-1 text-sm text-brand-dark">{selectedCourse?.code} · {selectedCourse?.name}</p>
            </div>
            <span className="rounded-full bg-brand-cream px-3 py-1 text-sm font-semibold text-brand-navy">{form.maxMarks} marks</span>
          </div>
          <dl className="mt-6 grid gap-4 border-y border-brand-silver py-4 sm:grid-cols-2">
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Due date</dt><dd className="mt-1 text-sm text-brand-navy">{new Date(form.dueDate).toLocaleString()}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-brand-dark">Instructor</dt><dd className="mt-1 text-sm text-brand-navy">{instructor?.name || 'Instructor'}</dd></div>
          </dl>
          <div className="mt-5 space-y-4">
            <div><h3 className="font-semibold text-brand-navy">Description</h3><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-brand-dark">{form.description}</p></div>
            <div><h3 className="font-semibold text-brand-navy">Submission instructions</h3><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-brand-dark">{form.instructions}</p></div>
          </div>
          {attachmentFiles.length ? (
            <div className="mt-5 rounded-xl bg-brand-cream p-4">
              <h3 className="font-semibold text-brand-navy">Supporting file</h3>
              <p className="mt-1 text-sm text-brand-dark">{attachmentFiles[0].name}</p>
            </div>
          ) : null}
          <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-brand-silver pt-5">
            <Button onClick={() => setPreview(false)} variant="outline">Back to edit</Button>
            <Button disabled={pending} loading={pending} onClick={() => save('Draft')} variant="secondary">Save draft</Button>
            <Button disabled={pending} loading={pending} onClick={() => save('Published')} variant="accent">Publish assignment</Button>
          </div>
        </section>
      ) : (
        <form className={`${cardClass} max-w-3xl`} noValidate onSubmit={showPreview}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="title">Assignment title</label>
              <input aria-describedby={errors.title ? 'title-error' : undefined} aria-invalid={Boolean(errors.title)} autoComplete="off" className={fieldClass} id="title" maxLength={120} name="title" onChange={update} required value={form.title} />
              {errors.title ? <p className="mt-1 text-sm text-brand-navy" id="title-error">{errors.title}</p> : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="courseId">Course</label>
              <select aria-describedby={errors.courseId ? 'course-error' : undefined} aria-invalid={Boolean(errors.courseId)} className={fieldClass} id="courseId" name="courseId" onChange={update} required value={form.courseId}>
                <option value="">Select a course</option>
                {instructorCourses.map((course) => <option key={course.id} value={course.id}>{course.code} · {course.name}</option>)}
              </select>
              {errors.courseId ? <p className="mt-1 text-sm text-brand-navy" id="course-error">{errors.courseId}</p> : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="maxMarks">Maximum marks</label>
              <input aria-describedby={errors.maxMarks ? 'marks-error' : undefined} aria-invalid={Boolean(errors.maxMarks)} className={fieldClass} id="maxMarks" max="10000" min="1" name="maxMarks" onChange={update} required type="number" value={form.maxMarks} />
              {errors.maxMarks ? <p className="mt-1 text-sm text-brand-navy" id="marks-error">{errors.maxMarks}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="dueDate">Due date and time</label>
              <input aria-describedby={errors.dueDate ? 'dueDate-error' : undefined} aria-invalid={Boolean(errors.dueDate)} className={fieldClass} id="dueDate" name="dueDate" onChange={update} required type="datetime-local" value={form.dueDate} />
              {errors.dueDate ? <p className="mt-1 text-sm text-brand-navy" id="dueDate-error">{errors.dueDate}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="description">Description</label>
              <textarea aria-describedby={errors.description ? 'description-error' : undefined} aria-invalid={Boolean(errors.description)} className={fieldClass} id="description" maxLength={2000} name="description" onChange={update} required rows="4" value={form.description} />
              {errors.description ? <p className="mt-1 text-sm text-brand-navy" id="description-error">{errors.description}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="instructions">Submission instructions</label>
              <textarea aria-describedby={errors.instructions ? 'instructions-error' : undefined} aria-invalid={Boolean(errors.instructions)} className={fieldClass} id="instructions" maxLength={3000} name="instructions" onChange={update} required rows="4" value={form.instructions} />
              {errors.instructions ? <p className="mt-1 text-sm text-brand-navy" id="instructions-error">{errors.instructions}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <FileUpload
                accept=".pdf,.doc,.docx,.zip,.ppt,.pptx"
                description="Add an optional reference or instruction file"
                label="Optional attachment"
                maxSizeMB={10}
                onFilesChange={setAttachmentFiles}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end border-t border-brand-silver pt-5">
            <Button disabled={pending} type="submit">Preview assignment</Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CreateAssignment
