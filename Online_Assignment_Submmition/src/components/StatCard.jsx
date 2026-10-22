function StatCard({ icon, label, value, trend, tone = 'blue' }) {
  const toneMap = {
    blue: 'bg-brand-cream text-brand-royal',
    green: 'bg-brand-gold/15 text-brand-navy',
    amber: 'bg-brand-gold/15 text-brand-navy',
    red: 'bg-brand-cream text-brand-navy',
    slate: 'bg-brand-silver text-brand-dark',
  }

  return (
    <div className="rounded-xl border border-brand-silver bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-brand-dark">{label}</p>
          <p className="mt-2 text-3xl font-bold text-brand-navy">{value}</p>
        </div>
        <div className={`rounded-lg p-2 ${toneMap[tone] || toneMap.blue}`}>
          {icon}
        </div>
      </div>
      {trend ? (
        <p className="mt-3 text-sm font-medium text-brand-dark">
          <span className="text-brand-navy">{trend}</span> vs last period
        </p>
      ) : null}
    </div>
  )
}

export default StatCard
