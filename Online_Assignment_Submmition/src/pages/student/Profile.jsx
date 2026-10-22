import { useEffect, useState } from 'react'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import { fetchStudentProfile } from '../../services/api.js'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchStudentProfile()
        if (isMounted) setProfile(data)
      } catch (loadError) {
        if (isMounted) setError(loadError.message || 'Unable to load profile.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) return <LoadingSpinner label="Loading profile..." />
  if (error) return <EmptyState title="Profile unavailable" description={error} />
  if (!profile) return <EmptyState title="Profile not found" description="No student profile is available." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-royal">Account</p>
          <h2 className="mt-2 text-3xl font-bold text-brand-navy">Student profile</h2>
        </div>
        <Button variant="outline">Edit profile</Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border border-brand-silver bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-navy text-xl font-bold text-white">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-navy">{profile.name}</h3>
              <p className="mt-1 text-sm text-brand-dark">{profile.program}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="text-brand-dark">Student ID</p>
              <p className="mt-1 font-medium text-brand-dark">{profile.studentId}</p>
            </div>
            <div>
              <p className="text-brand-dark">Email</p>
              <p className="mt-1 font-medium text-brand-dark">{profile.email}</p>
            </div>
            <div>
              <p className="text-brand-dark">Phone</p>
              <p className="mt-1 font-medium text-brand-dark">{profile.phone}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-brand-silver bg-white p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-brand-cream p-4">
              <p className="text-sm text-brand-dark">Academic year</p>
              <p className="mt-2 text-lg font-semibold text-brand-navy">{profile.year}</p>
            </div>
            <div className="rounded-xl bg-brand-cream p-4">
              <p className="text-sm text-brand-dark">CGPA</p>
              <p className="mt-2 text-lg font-semibold text-brand-navy">{profile.cgpa}</p>
            </div>
          </div>

          <div className="rounded-xl bg-brand-cream p-4 text-sm text-brand-dark">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-dark">Address</p>
            <p className="mt-2 leading-6">{profile.address}</p>
          </div>

          <div className="rounded-xl border border-brand-silver bg-brand-cream p-4">
            <h3 className="text-base font-semibold text-brand-navy">Security notice</h3>
            <p className="mt-2 text-sm leading-6 text-brand-dark">
              Authentication, authorization, and file validation must be enforced by the backend before any real deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
