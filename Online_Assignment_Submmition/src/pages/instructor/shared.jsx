export function PageHeading({ eyebrow = 'Instructor workspace', title, description, children }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-brand-royal">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-dark">{description}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  )
}

export function LoadingState({ label = 'Loading instructor workspace…' }) {
  return (
    <div role="status" className="rounded-xl border border-brand-silver bg-white p-8 text-center text-sm text-brand-dark">
      <span className="mx-auto mb-3 block h-6 w-6 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
      {label}
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div role="alert" className="rounded-xl border border-brand-gold/50 bg-brand-cream p-4 text-sm text-brand-navy">
      <p className="font-semibold">Unable to load this page</p>
      <p className="mt-1">{message}</p>
      {onRetry ? (
        <button
          className="mt-3 rounded-md font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-royal"
          onClick={onRetry}
          type="button"
        >
          Try again
        </button>
      ) : null}
    </div>
  )
}

export function EmptyState({ title, message, action }) {
  return (
    <div className={`${cardClass} py-10 text-center`}>
      <h2 className="text-lg font-semibold text-brand-navy">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-brand-dark">{message}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function StatusPill({ status }) {
  const key = String(status || '').toLowerCase()
  const styles =
    key.includes('graded') || key === 'active'
      ? 'bg-emerald-100 text-emerald-900 ring-emerald-200'
      : key.includes('late')
        ? 'bg-amber-100 text-amber-900 ring-amber-200'
        : key.includes('not submitted')
          ? 'bg-red-100 text-red-900 ring-red-200'
          : key.includes('pending')
            ? 'bg-brand-silver text-brand-dark ring-brand-silver'
            : key.includes('closed')
              ? 'bg-brand-silver text-brand-dark ring-brand-silver'
              : key.includes('draft')
                ? 'bg-brand-gold/20 text-brand-navy ring-brand-gold/50'
                : 'bg-brand-royal/15 text-brand-navy ring-brand-royal/30'
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${styles}`}>
      {status || 'Unknown'}
    </span>
  )
}
