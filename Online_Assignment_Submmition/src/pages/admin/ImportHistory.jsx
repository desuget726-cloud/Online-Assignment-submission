import { useMemo } from 'react'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { fetchAdminImportHistory } from '../../services/api.js'
import { PageHeader, PageState } from './AdminUI.jsx'
import { formatDate, useMockResource } from './adminUtils.js'

const loadImportHistory = () => fetchAdminImportHistory()

// Lists recent CSV import runs and opens their stored result summaries.
function ImportHistory({ onNavigate }) {
  const { data, error, loading, retry } = useMockResource(loadImportHistory)
  const imports = useMemo(
    () => [...(data || [])].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
    [data],
  )
  return (
    <PageState error={error} loading={loading} onRetry={retry} title="Import history unavailable">
      <div className="space-y-6">
        <PageHeader action={<Button onClick={() => onNavigate('admin-bulk-upload')}>Bulk Upload</Button>} description="Review previous user imports and their account counts." title="Import history" />
        {!imports.length ? <EmptyState title="No imports yet" description="Completed imports will appear here." /> : (
          <div className="overflow-x-auto rounded-xl border border-brand-silver bg-white shadow-sm">
            <table className="min-w-[850px] w-full text-left text-sm">
              <thead className="bg-brand-cream text-brand-dark"><tr>
                {['Date', 'File name', 'User type', 'Imported by', 'Successful', 'Failed', 'Skipped', 'Report'].map((label) => <th className="px-4 py-3 font-semibold" key={label} scope="col">{label}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-brand-silver">
                {imports.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3"><time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time></td>
                    <td className="px-4 py-3">{item.fileName}</td>
                    <td className="px-4 py-3 capitalize">{item.type}s</td>
                    <td className="px-4 py-3">{item.admin}</td>
                    <td className="px-4 py-3">{item.successful}</td>
                    <td className="px-4 py-3">{item.failed}</td>
                    <td className="px-4 py-3">{item.skipped}</td>
                    <td className="px-4 py-3"><Button onClick={() => onNavigate('admin-import-results', item.id)} size="sm" variant="outline">View report</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageState>
  )
}

export default ImportHistory
