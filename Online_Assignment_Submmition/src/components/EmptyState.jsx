import Button from './Button.jsx'

function EmptyState({ actionLabel, description, onAction, title }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-silver bg-brand-cream px-6 py-12 text-center text-brand-dark">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-silver text-2xl text-brand-dark">•</div>
      <h3 className="text-lg font-semibold text-brand-navy">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm leading-6 text-brand-dark">{description}</p> : null}
      {onAction && actionLabel ? (
        <div className="mt-5">
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default EmptyState
