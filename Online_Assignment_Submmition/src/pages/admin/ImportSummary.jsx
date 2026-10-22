import StatCard from '../../components/StatCard.jsx'

// Displays account import totals and the failed or skipped source rows.
function ImportSummary({ result }) {
  const cards = [
    ['Successful', result.successful, 'green'],
    ['Failed', result.failed, 'red'],
    ['Skipped duplicates', result.skipped, 'amber'],
    ['Total rows', result.total, 'blue'],
  ]
  return (
    <div className="space-y-6">
      <section aria-label="Import summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, tone]) => <StatCard key={label} label={label} tone={tone} value={value} />)}
      </section>
      {result.records?.length ? (
        <div className="overflow-x-auto rounded-xl border border-brand-silver bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-cream"><tr>
              <th className="px-4 py-3" scope="col">Row</th>
              <th className="px-4 py-3" scope="col">Status</th>
              <th className="px-4 py-3" scope="col">User ID</th>
              <th className="px-4 py-3" scope="col">Email</th>
              <th className="px-4 py-3" scope="col">Reason</th>
            </tr></thead>
            <tbody className="divide-y divide-brand-silver">
              {result.records.map((record, index) => (
                <tr key={`${record.rowNumber}-${index}`}>
                  <td className="px-4 py-3">{record.rowNumber}</td>
                  <td className="px-4 py-3">{record.status}</td>
                  <td className="px-4 py-3">{record.userId || '—'}</td>
                  <td className="px-4 py-3">{record.email || '—'}</td>
                  <td className="px-4 py-3">{record.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="rounded-xl border border-brand-silver bg-white p-5 text-sm text-brand-dark">All rows were imported successfully.</p>}
    </div>
  )
}

export default ImportSummary
