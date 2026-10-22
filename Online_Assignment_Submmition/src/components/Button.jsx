const variantClasses = {
  primary:
    'bg-brand-navy text-white hover:bg-brand-royal focus-visible:outline-brand-royal disabled:bg-brand-silver',
  secondary:
    'bg-brand-silver text-brand-navy hover:bg-brand-gold/20 focus-visible:outline-brand-royal disabled:bg-brand-silver',
  accent:
    'bg-brand-gold text-brand-navy hover:bg-brand-gold-dark focus-visible:outline-brand-royal disabled:bg-brand-silver',
  danger:
    'bg-brand-navy text-white hover:bg-brand-royal focus-visible:outline-brand-royal disabled:bg-brand-silver',
  outline:
    'border border-brand-silver bg-white text-brand-dark hover:bg-brand-cream focus-visible:outline-brand-royal disabled:border-brand-silver disabled:text-brand-dark',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

function Spinner({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  )
}

function Button({
  children,
  className = '',
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? <Spinner className="-ml-0.5" /> : leftIcon}
      <span>{loading ? 'Please wait...' : children}</span>
      {!loading && rightIcon}
    </button>
  )
}

export default Button
