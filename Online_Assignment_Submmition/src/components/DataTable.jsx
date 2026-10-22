import { useMemo, useState } from 'react'

function defaultSortValue(value) {
  if (value === null || value === undefined || value === '') return ''
  if (typeof value === 'number') return value
  return String(value).toLowerCase()
}

function DataTable({
  columns = [],
  data = [],
  emptyTitle = 'No records found',
  emptyMessage = 'There are no records to display.',
  pageSize = 5,
  searchPlaceholder = 'Search records...',
}) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState(columns[0]?.key || '')
  const [sortDirection, setSortDirection] = useState('asc')
  const [page, setPage] = useState(1)

  const filteredData = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = normalizedQuery
      ? data.filter((row) =>
          Object.values(row).some((value) =>
            String(value ?? '').toLowerCase().includes(normalizedQuery),
          ),
        )
      : data

    if (!sortKey) return filtered

    const sorted = [...filtered].sort((left, right) => {
      const a = defaultSortValue(left[sortKey])
      const b = defaultSortValue(right[sortKey])

      if (a === b) return 0
      if (a < b) return sortDirection === 'asc' ? -1 : 1
      return sortDirection === 'asc' ? 1 : -1
    })

    return sorted
  }, [data, query, sortDirection, sortKey])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(key)
    setSortDirection('asc')
  }

  return (
    <div className="rounded-xl border border-brand-silver bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-brand-silver p-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          aria-label={searchPlaceholder}
          className="w-full rounded-lg border border-brand-silver bg-white px-3 py-2 text-sm text-brand-dark placeholder:text-brand-dark focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-brand-gold/40 sm:max-w-xs"
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(1)
          }}
          placeholder={searchPlaceholder}
          type="search"
          value={query}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-brand-dark">
          <thead className="bg-brand-cream text-brand-dark">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-semibold">
                  {column.sortable !== false ? (
                    <button
                      type="button"
                      onClick={() => handleSort(column.key)}
                      className="inline-flex items-center gap-1 text-left hover:text-brand-navy"
                    >
                      {column.label}
                      <span aria-hidden="true">{sortKey === column.key ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}</span>
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length ? (
              paginatedData.map((row, index) => (
                <tr key={row.id || `${row.name || 'row'}-${index}`} className="border-t border-brand-silver hover:bg-brand-cream">
                  {columns.map((column) => (
                    <td key={`${row.id || index}-${column.key}`} className="px-4 py-3 align-middle">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-10 text-center text-brand-dark" colSpan={columns.length || 1}>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-lg font-semibold text-brand-dark">{emptyTitle}</span>
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > pageSize ? (
        <div className="flex flex-col gap-3 border-t border-brand-silver px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-brand-dark">
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-brand-silver px-3 py-1.5 text-sm text-brand-dark hover:bg-brand-silver disabled:cursor-not-allowed disabled:text-brand-dark"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-md border border-brand-silver px-3 py-1.5 text-sm text-brand-dark hover:bg-brand-silver disabled:cursor-not-allowed disabled:text-brand-dark"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default DataTable
