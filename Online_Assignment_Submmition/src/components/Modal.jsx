import { useEffect, useId, useRef } from 'react'

function Modal({ children, footer, onClose, open = false, size = 'md', title }) {
  const closeButtonRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return undefined
    const previouslyFocused = document.activeElement

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.()
        return
      }

      if (event.key === 'Tab') {
        const dialog = closeButtonRef.current?.closest('[role="dialog"]')
        const focusable = dialog?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]',
        )
        if (!focusable?.length) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    closeButtonRef.current?.focus()
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [onClose, open])

  if (!open) return null

  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brand-dark/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className={`my-auto w-full rounded-2xl bg-white shadow-xl ${sizeMap[size] || sizeMap.md}`}
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-brand-silver px-5 py-4">
          <h3 className="text-lg font-semibold text-brand-navy" id={titleId}>{title}</h3>
          <button
            aria-label="Close modal"
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-brand-dark hover:bg-brand-silver hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-royal"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4 text-brand-dark">{children}</div>
        {footer ? <div className="border-t border-brand-silver px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  )
}

export default Modal
