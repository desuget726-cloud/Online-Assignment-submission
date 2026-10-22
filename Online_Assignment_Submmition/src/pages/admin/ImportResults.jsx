import { useCallback } from 'react'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import ImportSummary from './ImportSummary.jsx'
import { fetchAdminImportById, fetchAdminImportHistory } from '../../services/api.js'
import { downloadCsv } from '../../utils/exportCsv.js'
import { PageHeader, PageState } from './AdminUI.jsx'
import { useMockResource } from './adminUtils.js'

// Shows the final outcome and downloadable error report for a single import run.
function ImportResults({ importId, onNavigate }) {
  const loadResult = useCallback(async () => {
    if (importId) return fetchAdminImportById(importId)
    const history = await fetchAdminImportHistory()
    return history[0] || null
  }, [importId])
  const { data, error, loading, retry } = useMockResource(loadResult)

  const downloadReport = () => {
    if (!data) return
    downloadCsv(
      `${data.fileName.replace(/\.csv$/i, '')}-report.csv`,
      ['row_number', 'status', 'user_id', 'email', 'reason'],
      (data.records || []).map((record) => [record.rowNumber, record.status, record.userId, record.email, record.reason]),
    )
  }

  return (
    <PageState error={error} loading={loading} onRetry={retry} title="Import results unavailable">
      <div className="space-y-6">
        <PageHeader description={data ? `${data.fileName} · ${data.type === 'student' ? 'Students' : 'Instructors'} · ${new Date(data.createdAt).toLocaleString()}` : 'Import summary'} title="Import results" />
        {!data ? <EmptyState title="Import not found" description="Choose another import from the history." /> : (
          <>
            <ImportSummary result={data} />
            <div className="flex flex-wrap gap-3">
              <Button onClick={downloadReport} variant="outline">Download report (CSV)</Button>
              <Button onClick={() => onNavigate('admin-users')} variant="outline">Back to Manage Users</Button>
              <Button onClick={() => onNavigate('admin-bulk-upload')}>Import another file</Button>
            </div>
          </>
        )}
      </div>
    </PageState>
  )
}

export default ImportResults
