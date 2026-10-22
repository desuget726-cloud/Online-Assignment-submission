import { useState } from 'react'
import Button from '../../components/Button.jsx'
import FileUpload from '../../components/FileUpload.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import { importAdminUsers, fetchAdminUsers } from '../../services/api.js'
import { csvHeaders, parseCsv } from '../../utils/csvParser.js'
import { downloadCsv } from '../../utils/exportCsv.js'
import { validateImportRows } from '../../utils/userValidation.js'
import { PageHeader, PageState } from './AdminUI.jsx'
import { useMockResource } from './adminUtils.js'

const loadUsers = () => fetchAdminUsers()
const sampleRows = [
  ['Abebe Kebede', 'MAU001', 'abebe@example.com', 'Information Technology', 'Student'],
  ['Hana Tesfaye', 'MAU002', 'hana@example.com', 'Information Technology', 'Student'],
  ['Dawit Alemu', 'EMP001', 'dawit@example.com', 'Computer Science', 'Instructor'],
]
const stepTitles = ['Choose type', 'Download template', 'Upload CSV', 'Preview & validate', 'Confirm & import']

// Guides administrators through safe CSV review and pending-account creation.
function BulkUpload({ onNavigate }) {
  const { data, error, loading, retry } = useMockResource(loadUsers)
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('student')
  const [file, setFile] = useState(null)
  const [rows, setRows] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [uploadError, setUploadError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const counts = rows.reduce((total, row) => ({ ...total, [row.status]: total[row.status] + 1 }), { Valid: 0, Duplicate: 0, Invalid: 0 })
  const visibleRows = statusFilter === 'all' ? rows : rows.filter((row) => row.status === statusFilter)
  const roleLabel = role === 'student' ? 'Students' : 'Instructors'

  const readFile = async () => {
    if (!file) {
      setUploadError('Choose a CSV file before continuing.')
      return
    }
    try {
      const parsed = parseCsv(await file.text())
      setRows(validateImportRows(parsed, role, data || []))
      setUploadError('')
      setStep(4)
    } catch (parseError) {
      setUploadError(parseError.message || 'The CSV could not be read.')
    }
  }

  const downloadTemplate = () => downloadCsv('user-import-template.csv', csvHeaders, sampleRows)

  const downloadErrors = () => {
    const failedRows = rows.filter((row) => row.status !== 'Valid')
    downloadCsv(
      'user-import-errors.csv',
      ['row_number', 'full_name', 'user_id', 'email', 'department', 'role', 'status', 'reason'],
      failedRows.map((row) => [row.rowNumber, row.full_name, row.user_id, row.email, row.department, row.role, row.status, row.reason]),
    )
  }

  const importUsers = async () => {
    setBusy(true)
    setUploadError('')
    try {
      const result = await importAdminUsers({ fileName: file.name, role, rows })
      setConfirmOpen(false)
      onNavigate('admin-import-results', result.id)
    } catch (importError) {
      setUploadError(importError.message || 'The import could not be completed.')
      setConfirmOpen(false)
    } finally {
      setBusy(false)
    }
  }

  const back = () => {
    setUploadError('')
    setStep((current) => Math.max(1, current - 1))
  }

  return (
    <PageState error={error} loading={loading} onRetry={retry} title="Bulk upload unavailable">
      <div className="space-y-6">
        <PageHeader description="Import up to 1,000 student or instructor accounts from a reviewed CSV file." title="Bulk user upload" />
        <ol aria-label="Bulk upload steps" className="grid gap-2 sm:grid-cols-5">
          {stepTitles.map((title, index) => (
            <li aria-current={step === index + 1 ? 'step' : undefined} className={`rounded-lg border px-3 py-2 text-sm ${step === index + 1 ? 'border-brand-royal bg-brand-royal text-white' : 'border-brand-silver bg-white text-brand-dark'}`} key={title}>
              <span className="mr-2 font-bold">{index + 1}</span>{title}
            </li>
          ))}
        </ol>
        {uploadError ? <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{uploadError}</p> : null}
        <section className="min-h-72 rounded-2xl border border-brand-silver bg-white p-5 shadow-sm sm:p-7">
          {step === 1 ? (
            <div className="max-w-xl space-y-5">
              <h2 className="text-xl font-semibold text-brand-navy">Choose account type</h2>
              <p className="text-sm text-brand-dark">The selected type applies to every row. A conflicting role value in the CSV will be flagged.</p>
              <label className="flex items-center gap-3 rounded-lg border border-brand-silver p-4 text-sm font-medium"><input checked={role === 'student'} className="accent-brand-royal" name="bulk-role" onChange={() => setRole('student')} type="radio" /> Students</label>
              <label className="flex items-center gap-3 rounded-lg border border-brand-silver p-4 text-sm font-medium"><input checked={role === 'instructor'} className="accent-brand-royal" name="bulk-role" onChange={() => setRole('instructor')} type="radio" /> Instructors</label>
            </div>
          ) : null}
          {step === 2 ? (
            <div className="max-w-2xl space-y-5">
              <h2 className="text-xl font-semibold text-brand-navy">Download the CSV template</h2>
              <p className="text-sm text-brand-dark">Keep the header names unchanged and enter one account per row. Sample data only, not real users.</p>
              <div className="overflow-x-auto rounded-lg border border-brand-silver">
                <table className="min-w-full text-left text-xs sm:text-sm">
                  <thead className="bg-brand-cream"><tr>{csvHeaders.map((header) => <th className="px-3 py-2" key={header}>{header}</th>)}</tr></thead>
                  <tbody>{sampleRows.map((row) => <tr className="border-t border-brand-silver" key={row[1]}>{row.map((value, index) => <td className="px-3 py-2" key={`${row[1]}-${index}`}>{value}</td>)}</tr>)}</tbody>
                </table>
              </div>
              <Button onClick={downloadTemplate} variant="outline">Download CSV template</Button>
            </div>
          ) : null}
          {step === 3 ? (
            <div className="max-w-2xl space-y-4">
              <h2 className="text-xl font-semibold text-brand-navy">Upload a CSV file</h2>
              <FileUpload accept=".csv" description="Drag and drop a CSV file or browse" label="User list CSV" maxSizeMB={2} onFilesChange={(files) => { setFile(files[0] || null); setUploadError('') }} />
              {/* BACKEND REQUIRED: parse Excel workbook data server-side; this frontend supports CSV only. */}
              <p className="text-sm text-brand-dark">Excel support requires backend parsing. CSV files up to 2 MB are supported.</p>
            </div>
          ) : null}
          {step === 4 ? (
            <div className="space-y-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div><h2 className="text-xl font-semibold text-brand-navy">Preview and validate</h2><p className="mt-1 text-sm text-brand-dark">{file?.name} · {roleLabel}</p></div>
                <div aria-label="Import row counts" className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                  {[
                    ['Total', rows.length],
                    ['Valid', counts.Valid],
                    ['Duplicate', counts.Duplicate],
                    ['Invalid', counts.Invalid],
                  ].map(([label, count]) => <p className="rounded-lg bg-brand-cream px-3 py-2" key={label}>{label}: <strong>{count}</strong></p>)}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm font-medium" htmlFor="import-status-filter">Filter rows</label>
                <select className="rounded-lg border border-brand-silver px-3 py-2 text-sm" id="import-status-filter" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
                  <option value="all">All statuses</option><option>Valid</option><option>Duplicate</option><option>Invalid</option>
                </select>
                <Button onClick={downloadErrors} size="sm" variant="outline">Download error report (CSV)</Button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-brand-silver">
                <table className="min-w-[900px] w-full text-left text-sm">
                  <thead className="bg-brand-cream"><tr>{['Row', 'Full name', 'User ID', 'Email', 'Department', 'Role', 'Status / reason', 'Action'].map((label) => <th className="px-3 py-3" key={label} scope="col">{label}</th>)}</tr></thead>
                  <tbody className="divide-y divide-brand-silver">
                    {visibleRows.map((row) => (
                      <tr className={row.status === 'Invalid' ? 'bg-red-50' : row.status === 'Duplicate' ? 'bg-amber-50' : ''} key={row.rowNumber}>
                        <td className="px-3 py-3">{row.rowNumber}</td><td className="px-3 py-3">{row.full_name || '—'}</td><td className="px-3 py-3">{row.user_id || '—'}</td><td className="px-3 py-3">{row.email || '—'}</td><td className="px-3 py-3">{row.department || '—'}</td><td className="px-3 py-3">{row.role || '—'}</td>
                        <td className="px-3 py-3"><span className="font-semibold">{row.status}</span>{row.reason ? <span className="block text-xs">{row.reason}</span> : null}</td>
                        <td className="px-3 py-3"><Button onClick={() => setRows((current) => current.filter((item) => item.rowNumber !== row.rowNumber))} size="sm" variant="outline">Remove row</Button></td>
                      </tr>
                    ))}
                    {!visibleRows.length ? <tr><td className="px-4 py-6 text-center" colSpan="8">No rows match this filter.</td></tr> : null}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
          {step === 5 ? (
            <div className="max-w-2xl space-y-4">
              <h2 className="text-xl font-semibold text-brand-navy">Confirm and import</h2>
              <p className="text-sm leading-6 text-brand-dark">Ready to create {counts.Valid} pending {roleLabel.toLowerCase()} accounts from <strong>{file?.name}</strong>. {counts.Duplicate} duplicate rows will be skipped and {counts.Invalid} invalid rows will be reported. No passwords are created or displayed in this frontend mock.</p>
              {busy ? <LoadingSpinner label="Importing accounts..." /> : null}
            </div>
          ) : null}
        </section>
        <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <Button disabled={step === 1 || busy} onClick={back} variant="outline">Back</Button>
          {step < 5 ? (
            <Button
              disabled={busy || (step === 4 && counts.Valid === 0)}
              onClick={step === 3 ? readFile : () => { setUploadError(''); setStep((current) => current + 1) }}
            >
              {step === 4 ? 'Continue to confirmation' : 'Continue'}
            </Button>
          ) : (
            <Button disabled={counts.Valid === 0 || busy} onClick={() => setConfirmOpen(true)}>Confirm import</Button>
          )}
        </div>
        <ConfirmDialog
          busy={busy}
          confirmLabel={`Create ${counts.Valid} accounts`}
          message={`Create ${counts.Valid} ${roleLabel.toLowerCase()} accounts from this file?`}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={importUsers}
          open={confirmOpen}
          title="Confirm bulk import"
        />
      </div>
    </PageState>
  )
}

export default BulkUpload
