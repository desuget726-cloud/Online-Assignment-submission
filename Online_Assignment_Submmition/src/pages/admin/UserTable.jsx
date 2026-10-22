import { useEffect, useMemo, useState } from 'react'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'

// Provides searchable, sortable, paginated user rows and account actions.
function UserTable({ onActivate, onBulkStatus, onEdit, onFilteredChange, onResetPassword, onView, rows }) {
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('all')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState([])
  const pageSize = 8
  const departments = [...new Set(rows.map((user) => user.department).filter(Boolean))].sort()

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const found = rows.filter((user) => {
      const userId = user.userId || user.universityId || user.id
      const matchesQuery = !needle || [user.name, userId, user.email].some((item) => String(item || '').toLowerCase().includes(needle))
      return matchesQuery &&
        (department === 'all' || user.department === department) &&
        (status === 'all' || user.status === status)
    })
    return [...found].sort((left, right) => {
      const a = String(sort.key === 'userId' ? left.userId || left.universityId || left.id : left[sort.key] || '').toLowerCase()
      const b = String(sort.key === 'userId' ? right.userId || right.universityId || right.id : right[sort.key] || '').toLowerCase()
      return (a.localeCompare(b) || left.id.localeCompare(right.id)) * (sort.direction === 'asc' ? 1 : -1)
    })
  }, [department, query, rows, sort, status])
  useEffect(() => {
    onFilteredChange?.(filtered)
  }, [filtered, onFilteredChange])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const allSelected = pageRows.length > 0 && pageRows.every((user) => selected.includes(user.id))

  const selectPage = () => setSelected((current) => allSelected
    ? current.filter((id) => !pageRows.some((user) => user.id === id))
    : [...new Set([...current, ...pageRows.map((user) => user.id)])])
  const toggleSort = (key) => setSort((current) => ({
    key,
    direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
  }))

  return (
    <div className="space-y-4">
      <section aria-label="User filters" className="grid gap-3 rounded-xl border border-brand-silver bg-white p-4 shadow-sm sm:grid-cols-3">
        <label className="sr-only" htmlFor="managed-user-search">Search users</label>
        <input className="rounded-lg border border-brand-silver px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-royal" id="managed-user-search" onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search name, ID, or email" type="search" value={query} />
        <label className="sr-only" htmlFor="managed-user-department-filter">Filter by department</label>
        <select className="rounded-lg border border-brand-silver px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-royal" id="managed-user-department-filter" onChange={(event) => { setDepartment(event.target.value); setPage(1) }} value={department}>
          <option value="all">All departments</option>
          {departments.map((item) => <option key={item}>{item}</option>)}
        </select>
        <label className="sr-only" htmlFor="managed-user-status-filter">Filter by status</label>
        <select className="rounded-lg border border-brand-silver px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-royal" id="managed-user-status-filter" onChange={(event) => { setStatus(event.target.value); setPage(1) }} value={status}>
          <option value="all">All statuses</option><option>Active</option><option>Pending</option><option>Inactive</option>
        </select>
      </section>
      {selected.length ? (
        <div className="flex flex-wrap items-center gap-2" aria-live="polite">
          <span className="mr-2 text-sm">{selected.length} selected</span>
          <Button onClick={() => onBulkStatus(selected, 'Active')} size="sm" variant="secondary">Activate selected</Button>
          <Button onClick={() => onBulkStatus(selected, 'Inactive')} size="sm" variant="outline">Deactivate selected</Button>
        </div>
      ) : null}
      {filtered.length === 0 ? (
        <EmptyState title="No matching users" description="Try a different search or filter." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-brand-silver bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full text-left text-sm">
              <thead className="bg-brand-cream text-brand-dark"><tr>
                <th className="px-3 py-3"><input aria-label="Select visible users" checked={allSelected} onChange={selectPage} type="checkbox" /></th>
                {[
                  ['name', 'Name'],
                  ['userId', 'User ID'],
                  ['email', 'Email'],
                  ['department', 'Department'],
                  ['role', 'Role'],
                  ['status', 'Status'],
                ].map(([key, label]) => <th className="px-3 py-3 font-semibold" key={key} scope="col"><button className="focus-visible:outline-2 focus-visible:outline-brand-royal" onClick={() => toggleSort(key)} type="button">{label} {sort.key === key ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}</button></th>)}
                <th className="px-3 py-3" scope="col">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-brand-silver">
                {pageRows.map((user) => (
                  <tr className="hover:bg-brand-cream" key={user.id}>
                    <td className="px-3 py-3"><input aria-label={`Select ${user.name}`} checked={selected.includes(user.id)} onChange={() => setSelected((current) => current.includes(user.id) ? current.filter((id) => id !== user.id) : [...current, user.id])} type="checkbox" /></td>
                    <td className="px-3 py-3 font-medium">{user.name}</td>
                    <td className="px-3 py-3">{user.userId || user.universityId || user.id}</td>
                    <td className="px-3 py-3">{user.email}</td>
                    <td className="px-3 py-3">{user.department || '—'}</td>
                    <td className="px-3 py-3 capitalize">{user.role}</td>
                    <td className="px-3 py-3"><StatusBadge status={user.status} /></td>
                    <td className="px-3 py-3"><div className="flex flex-wrap gap-1">
                      <Button onClick={() => onView(user)} size="sm" variant="outline">View</Button>
                      <Button onClick={() => onEdit(user)} size="sm" variant="outline">Edit</Button>
                      <Button onClick={() => onActivate(user)} size="sm" variant="secondary">{user.status === 'Active' ? 'Deactivate' : 'Activate'}</Button>
                      <Button onClick={() => onResetPassword(user)} size="sm" variant="outline">Reset password</Button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-brand-silver px-4 py-3 text-sm">
            <span>Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}</span>
            <div className="flex gap-2">
              <Button disabled={currentPage === 1} onClick={() => setPage((value) => value - 1)} size="sm" variant="outline">Previous</Button>
              <Button disabled={currentPage === totalPages} onClick={() => setPage((value) => value + 1)} size="sm" variant="outline">Next</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserTable
