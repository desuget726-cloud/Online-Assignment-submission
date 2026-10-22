import { useState } from 'react'
import Button from '../../components/Button.jsx'
import { fetchAdminSettings, updateAdminSettings } from '../../services/api.js'
import { Field, PageHeader, PageState } from './AdminUI.jsx'
import { inputClass, useMockResource } from './adminUtils.js'

const defaultSettings = {
  institutionName: 'Mekdela Amba University',
  assignmentMaxSizeMB: 10,
  lateSubmissionsAllowed: true,
  emailNotifications: true,
  timezone: 'Africa/Addis_Ababa',
  sessionTimeout: '30',
}

const loadSettings = () => fetchAdminSettings()

function Settings() {
  const { data, error, loading, retry, setData } = useMockResource(loadSettings)
  const [draft, setDraft] = useState(null)
  const [notice, setNotice] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const settings = { ...defaultSettings, ...(data || {}), ...(draft || {}) }

  const update = (key, value) => setDraft((current) => ({ ...settings, ...(current || {}), [key]: value }))

  const persistSettings = async (values) => {
    setSaving(true)
    setFormError('')
    setNotice('')
    try {
      const saved = await updateAdminSettings(values)
      setData(saved)
      setDraft(saved)
      setNotice('Settings saved successfully.')
    } catch (saveError) {
      setFormError(saveError.message || 'Unable to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const saveSettings = (event) => {
    event.preventDefault()
    const institutionName = settings.institutionName.trim()
    const assignmentMaxSizeMB = Number(settings.assignmentMaxSizeMB)
    if (!institutionName || !Number.isFinite(assignmentMaxSizeMB) || assignmentMaxSizeMB < 1 || assignmentMaxSizeMB > 100) {
      setFormError('Enter an institution name and a file size limit between 1 and 100 MB.')
      setNotice('')
      return
    }
    persistSettings({ ...settings, institutionName, assignmentMaxSizeMB })
  }

  return (
    <PageState error={error} loading={loading} onRetry={retry} title="Settings unavailable">
      <div className="space-y-6">
        <PageHeader description="Configure institution preferences and assignment policies." title="Settings" />
        <form className="space-y-5" onSubmit={saveSettings}>
          {formError ? <p className="rounded-lg bg-brand-cream px-4 py-3 text-sm text-brand-navy" role="alert">{formError}</p> : null}
          {notice ? <p className="rounded-lg bg-brand-gold/15 px-4 py-3 text-sm text-brand-navy" role="status">{notice}</p> : null}

          <section aria-labelledby="general-settings-title" className="rounded-2xl border border-brand-silver bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-brand-navy" id="general-settings-title">General</h2>
              <p className="mt-1 text-sm text-brand-dark">Institution details and assignment upload constraints.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Institution name" required>{(props) => <input {...props} autoComplete="organization" className={inputClass} onChange={(event) => update('institutionName', event.target.value)} required value={settings.institutionName} />}</Field>
              <Field label="Maximum assignment file size (MB)" required>{(props) => <input {...props} className={inputClass} max="100" min="1" onChange={(event) => update('assignmentMaxSizeMB', event.target.value)} required type="number" value={settings.assignmentMaxSizeMB} />}</Field>
              <Field label="Time zone">{(props) => (
                <select {...props} className={inputClass} onChange={(event) => update('timezone', event.target.value)} value={settings.timezone}>
                  <option value="Africa/Addis_Ababa">East Africa Time (Addis Ababa)</option>
                  <option value="UTC">UTC</option>
                  <option value="Europe/London">London</option>
                </select>
              )}</Field>
              <Field label="Session timeout">{(props) => (
                <select {...props} className={inputClass} onChange={(event) => update('sessionTimeout', event.target.value)} value={settings.sessionTimeout}>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              )}</Field>
            </div>
          </section>

          <section aria-labelledby="policy-settings-title" className="rounded-2xl border border-brand-silver bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-brand-navy" id="policy-settings-title">Policies and notifications</h2>
            <div className="mt-4 divide-y divide-brand-silver">
              {[
                ['lateSubmissionsAllowed', 'Allow late submissions', 'Students can submit assignments after their due date.'],
                ['emailNotifications', 'Email notifications', 'Send important account and course updates by email.'],
              ].map(([key, title, description]) => (
                <label className="flex cursor-pointer items-start justify-between gap-4 py-4 first:pt-0 last:pb-0" key={key}>
                  <span>
                    <span className="block text-sm font-medium text-brand-navy">{title}</span>
                    <span className="mt-1 block text-sm text-brand-dark">{description}</span>
                  </span>
                  <input
                    checked={Boolean(settings[key])}
                    className="mt-1 h-4 w-4 rounded border-brand-silver text-brand-royal focus:ring-brand-royal"
                    onChange={(event) => update(key, event.target.checked)}
                    type="checkbox"
                  />
                </label>
              ))}
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              disabled={saving}
              onClick={() => persistSettings({ ...defaultSettings })}
              variant="outline"
            >
              Restore defaults
            </Button>
            <Button disabled={saving} loading={saving} type="submit">Save settings</Button>
          </div>
        </form>
      </div>
    </PageState>
  )
}

export default Settings
