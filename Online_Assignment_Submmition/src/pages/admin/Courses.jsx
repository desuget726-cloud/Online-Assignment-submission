import { useMemo, useState } from 'react'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import {
  createAdminCourse,
  deleteAdminCourse,
  fetchAdminCourses,
  fetchAdminUsers,
  updateAdminCourse,
} from '../../services/api.js'
import { AdminModal, Field, PageHeader, PageState } from './AdminUI.jsx'
import { inputClass, useMockResource } from './adminUtils.js'

const loadCourses = async () => {
  const [courses, users] = await Promise.all([fetchAdminCourses(), fetchAdminUsers()])
  return { courses, instructors: users.filter((user) => user.role === 'instructor') }
}
const emptyCourse = { code: '', name: '', credits: '3', category: 'Core', instructorId: '' }
const emptyCourses = []
const emptyInstructors = []

function Courses() {
  const { data, error, loading, retry, setData } = useMockResource(loadCourses)
  const courses = data?.courses || emptyCourses
  const instructors = data?.instructors || emptyInstructors
  const [query, setQuery] = useState('')
  const [modalMode, setModalMode] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [form, setForm] = useState(emptyCourse)
  const [formError, setFormError] = useState('')
  const [actionError, setActionError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return courses.filter((course) => {
      const instructor = instructors.find((item) => item.id === course.instructorId)?.name || course.instructor || ''
      return !normalizedQuery || [course.code, course.name, instructor, course.category]
        .some((value) => String(value || '').toLowerCase().includes(normalizedQuery))
    })
  }, [courses, instructors, query])

  const closeModal = () => {
    setModalMode('')
    setSelectedCourse(null)
    setFormError('')
  }

  const openCourseModal = (mode, course = null) => {
    setModalMode(mode)
    setSelectedCourse(course)
    setFormError('')
    setActionError('')
    if (course) {
      setForm({
        code: course.code || '',
        name: course.name || '',
        credits: String(course.credits ?? 3),
        category: course.category || 'Core',
        instructorId: course.instructorId || '',
      })
    } else {
      setForm({ ...emptyCourse, instructorId: instructors[0]?.id || '' })
    }
  }

  const saveCourse = async (event) => {
    event.preventDefault()
    const code = form.code.trim().toUpperCase()
    const name = form.name.trim()
    const credits = Number(form.credits)
    if (!code || !name || !Number.isFinite(credits) || credits < 1 || credits > 30) {
      setFormError('Enter a course code, name, and a credit value between 1 and 30.')
      return
    }
    if (courses.some((course) => course.id !== selectedCourse?.id && course.code.toLowerCase() === code.toLowerCase())) {
      setFormError('A course with this code already exists.')
      return
    }
    const instructor = instructors.find((item) => item.id === form.instructorId)
    const values = { ...form, code, name, credits, instructor: instructor?.name || '' }
    setSaving(true)
    setActionError('')
    try {
      if (modalMode === 'add') {
        const created = await createAdminCourse(values)
        setData((current) => ({ ...current, courses: [created, ...current.courses] }))
        setNotice(`${name} was added.`)
      } else {
        const updated = await updateAdminCourse(selectedCourse.id, values)
        setData((current) => ({
          ...current,
          courses: current.courses.map((course) => course.id === updated.id ? updated : course),
        }))
        setNotice(`${name} was updated.`)
      }
      closeModal()
    } catch (saveError) {
      setFormError(saveError.message || `Unable to ${modalMode} course.`)
    } finally {
      setSaving(false)
    }
  }

  const deleteCourse = async (event) => {
    event.preventDefault()
    setDeleting(true)
    setActionError('')
    try {
      await deleteAdminCourse(selectedCourse.id)
      setData((current) => ({ ...current, courses: current.courses.filter((course) => course.id !== selectedCourse.id) }))
      setNotice(`${selectedCourse.name} was deleted.`)
      closeModal()
    } catch (deleteError) {
      setFormError(deleteError.message || 'Unable to delete this course.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <PageState error={error} loading={loading} onRetry={retry} title="Courses unavailable">
      <div className="space-y-6">
        <PageHeader
          action={<Button onClick={() => openCourseModal('add')}>Add course</Button>}
          description="Create and maintain course details and assign an instructor."
          title="Manage courses"
        />
        {actionError ? <p className="rounded-lg bg-brand-cream px-4 py-3 text-sm text-brand-navy" role="alert">{actionError}</p> : null}
        <p aria-live="polite" className="sr-only">{notice}</p>
        <div className="rounded-xl border border-brand-silver bg-white p-4 shadow-sm">
          <label className="sr-only" htmlFor="course-search">Search courses</label>
          <input
            className={`${inputClass} mt-0 sm:max-w-sm`}
            id="course-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search code, course, instructor..."
            type="search"
            value={query}
          />
        </div>

        {courses.length === 0 ? (
          <EmptyState actionLabel="Add a course" description="Start by creating the first course." onAction={() => openCourseModal('add')} title="No courses yet" />
        ) : filteredCourses.length === 0 ? (
          <EmptyState title="No matching courses" description="Try a different search term." />
        ) : (
          <section aria-label="Courses" className="overflow-hidden rounded-xl border border-brand-silver bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full text-left text-sm">
                <thead className="bg-brand-cream text-xs uppercase tracking-wide text-brand-dark">
                  <tr>
                    <th className="px-4 py-3 font-semibold" scope="col">Course</th>
                    <th className="px-4 py-3 font-semibold" scope="col">Instructor</th>
                    <th className="px-4 py-3 font-semibold" scope="col">Category</th>
                    <th className="px-4 py-3 font-semibold" scope="col">Credits</th>
                    <th className="px-4 py-3 font-semibold" scope="col"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-silver">
                  {filteredCourses.map((course) => {
                    const assigned = instructors.find((item) => item.id === course.instructorId)
                    return (
                      <tr className="hover:bg-brand-cream" key={course.id}>
                        <td className="px-4 py-4">
                          <span className="font-semibold text-brand-royal">{course.code}</span>
                          <p className="mt-1 font-medium text-brand-navy">{course.name}</p>
                        </td>
                        <td className="px-4 py-4 text-brand-dark">{assigned?.name || course.instructor || 'Unassigned'}</td>
                        <td className="px-4 py-4 text-brand-dark">{course.category || '—'}</td>
                        <td className="px-4 py-4 text-brand-dark">{course.credits ?? '—'}</td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <Button onClick={() => openCourseModal('edit', course)} size="sm" variant="outline">Edit</Button>
                            <Button onClick={() => openCourseModal('delete', course)} size="sm" variant="danger">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p aria-live="polite" className="border-t border-brand-silver px-4 py-3 text-xs text-brand-dark">
              Showing {filteredCourses.length} of {courses.length} courses
            </p>
          </section>
        )}

        <AdminModal
          busy={modalMode === 'delete' ? deleting : saving}
          onClose={closeModal}
          onSubmit={modalMode === 'delete' ? deleteCourse : saveCourse}
          open={Boolean(modalMode)}
          submitLabel={modalMode === 'add' ? 'Add course' : modalMode === 'delete' ? 'Delete course' : 'Save course'}
          submitVariant={modalMode === 'delete' ? 'danger' : 'primary'}
          title={modalMode === 'add' ? 'Add course' : modalMode === 'delete' ? 'Delete course' : 'Edit course'}
        >
          {formError ? <p className="mb-4 rounded-lg bg-brand-cream px-3 py-2 text-sm text-brand-navy" role="alert">{formError}</p> : null}
          {modalMode === 'delete' ? (
            <p className="text-sm leading-6 text-brand-dark">
              Delete <strong>{selectedCourse?.name}</strong>? This removes the course from this page&apos;s mock data and cannot be undone.
            </p>
          ) : (
            <div className="space-y-4">
              {formError ? <p className="rounded-lg bg-brand-cream px-3 py-2 text-sm text-brand-navy" role="alert">{formError}</p> : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Course code" required>{(props) => <input {...props} className={inputClass} onChange={(event) => setForm({ ...form, code: event.target.value })} placeholder="e.g. CS-332" required value={form.code} />}</Field>
                <Field label="Credits" required>{(props) => <input {...props} className={inputClass} max="30" min="1" onChange={(event) => setForm({ ...form, credits: event.target.value })} required type="number" value={form.credits} />}</Field>
              </div>
              <Field label="Course name" required>{(props) => <input {...props} className={inputClass} onChange={(event) => setForm({ ...form, name: event.target.value })} required value={form.name} />}</Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category" required>{(props) => <select {...props} className={inputClass} onChange={(event) => setForm({ ...form, category: event.target.value })} value={form.category}><option>Core</option><option>Elective</option></select>}</Field>
                <Field label="Instructor">{(props) => <select {...props} className={inputClass} onChange={(event) => setForm({ ...form, instructorId: event.target.value })} value={form.instructorId}><option value="">Unassigned</option>{instructors.map((instructor) => <option key={instructor.id} value={instructor.id}>{instructor.name}</option>)}</select>}</Field>
              </div>
              {instructors.length === 0 ? <p className="text-xs text-brand-navy">No instructor accounts are available to assign.</p> : null}
            </div>
          )}
        </AdminModal>
      </div>
    </PageState>
  )
}

export default Courses
