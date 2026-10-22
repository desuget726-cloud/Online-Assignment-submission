function LoadingSpinner({ label = 'Loading...', size = 'md' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div className="flex items-center justify-center gap-3 py-6 text-brand-dark">
      <span
        aria-label={label}
        className={`inline-block animate-spin rounded-full border border-brand-silver border-t-brand-navy ${sizes[size] || sizes.md}`}
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

export default LoadingSpinner
