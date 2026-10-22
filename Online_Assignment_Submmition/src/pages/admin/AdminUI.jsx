import { useEffect, useId, useRef } from 'react'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingSpinner from '../../components/LoadingSpinner.jsx'

export function PageHeader({ eyebrow = 'Administration', title, description, action }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-royal">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-dark">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  )
}

export function PageState({ loading, error, onRetry, title = 'Content unavailable', children }) {
  if (loading) return <LoadingSpinner label="Loading administration data..." />
  if (error) {
    return (
      <div role="alert" className="space-y-4">
        <EmptyState title={title} description={error} />
        {onRetry ? <div className="flex justify-center"><Button onClick={onRetry}>Try again</Button></div> : null}
      </div>
    )
  }
  return children
}

export function AdminModal({ children, onClose, onSubmit, open, submitLabel = 'Save changes', submitVariant = 'primary', title, busy = false, size = 'md' }) {
  const titleId = useId()
  const dialogRef = useRef(null)
  const previousFocus = useRef(null)
  const onCloseRef = useRef(onClose)
  const sizeClass = size === 'lg' ? 'max-w-3xl' : 'max-w-xl'

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined
    previousFocus.current = document.activeElement
    const firstFocusable = dialogRef.current?.querySelector('[autofocus]') ||
      dialogRef.current?.querySelector('input, select, textarea, button')
    firstFocusable?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current?.()
      }
      if (event.key !== 'Tab') return
      const elements = [...(dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) || [])]
      if (!elements.length) return
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus.current?.focus?.()
    }
  }, [open])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brand-dark/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className={`my-auto w-full ${sizeClass} rounded-2xl bg-white shadow-xl`}
        ref={dialogRef}
        role="dialog"
      >
        <div className="flex items-center justify-between gap-4 border-b border-brand-silver px-5 py-4">
          <h2 className="text-lg font-semibold text-brand-navy" id={titleId}>{title}</h2>
          <button
            aria-label="Close dialog"
            className="rounded-md p-2 text-brand-dark hover:bg-brand-silver focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-royal"
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="max-h-[70vh] overflow-y-auto px-5 py-5">{children}</div>
          <div className="flex flex-col-reverse justify-end gap-2 border-t border-brand-silver px-5 py-4 sm:flex-row">
            <Button onClick={onClose} variant="outline">Cancel</Button>
            <Button disabled={busy} loading={busy} type="submit" variant={submitVariant}>{submitLabel}</Button>
          </div>
        </form>
      </section>
    </div>
  )
}

export function Field({ children, error, id, label, required = false }) {
  const generatedId = useId()
  const fieldId = id || generatedId
  const errorId = `${fieldId}-error`
  return (
    <div>
      <label className="block text-sm font-medium text-brand-dark" htmlFor={fieldId}>
        {label}{required ? <span aria-hidden="true" className="text-brand-navy"> *</span> : null}
      </label>
      {typeof children === 'function'
        ? children({ id: fieldId, 'aria-invalid': Boolean(error), 'aria-describedby': error ? errorId : undefined })
        : children}
      {error ? <p className="mt-1 text-xs text-brand-navy" id={errorId}>{error}</p> : null}
    </div>
  )
}
