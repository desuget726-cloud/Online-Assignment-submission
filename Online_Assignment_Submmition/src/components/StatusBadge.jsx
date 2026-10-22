const statusStyles = {
  Submitted: 'bg-brand-royal/15 text-brand-navy',
  Late: 'bg-amber-100 text-amber-900',
  'Not Submitted': 'bg-red-100 text-red-900',
  Graded: 'bg-emerald-100 text-emerald-900',
  Pending: 'bg-amber-100 text-amber-900',
  Draft: 'bg-brand-gold/20 text-brand-navy',
  Published: 'bg-brand-royal/15 text-brand-navy',
  Closed: 'bg-brand-silver text-brand-dark',
  Active: 'bg-emerald-100 text-emerald-900',
  Inactive: 'bg-brand-silver text-brand-dark',
  'Academic Notice': 'bg-brand-royal/15 text-brand-navy',
  'Assignment Update': 'bg-brand-gold/20 text-brand-navy',
  'System Announcement': 'bg-brand-silver text-brand-dark',
}

function StatusBadge({ status, className = '' }) {
  const normalized = status && status.trim() ? status : 'Pending'
  const resolvedClass = statusStyles[normalized] || statusStyles.Pending

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${resolvedClass} ${className}`}
    >
      {normalized}
    </span>
  )
}

export default StatusBadge
