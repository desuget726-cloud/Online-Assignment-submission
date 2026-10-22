import { useId, useMemo, useRef, useState } from 'react'

// Reusable accessible drag-and-drop file picker with client-side type and size feedback.
function formatFileSize(bytes) {
  if (!bytes) return '0 KB'
  const kilobytes = bytes / 1024
  if (kilobytes < 1024) return `${kilobytes.toFixed(1)} KB`
  return `${(kilobytes / 1024).toFixed(1)} MB`
}

function FileUpload({
  accept = '.pdf,.doc,.docx,.zip,.ppt,.pptx',
  className = '',
  description = 'Drag and drop or browse files',
  disabled = false,
  label = 'Upload file',
  maxSizeMB = 10,
  multiple = false,
  onFilesChange,
}) {
  const inputRef = useRef(null)
  const inputId = useId()
  const errorId = `${inputId}-error`
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [files, setFiles] = useState([])

  const allowedList = useMemo(() => accept.split(',').map((item) => item.trim()).filter(Boolean), [accept])

  const validateFiles = (selectedFiles) => {
    const items = Array.from(selectedFiles || [])
    if (!items.length) return []

    if (!multiple && items.length > 1) {
      setError('Select one file at a time.')
      return []
    }

    // This browser-side check improves feedback; file type and content must be verified by the backend.
    const empty = items.find((file) => file.size === 0)
    if (empty) {
      setError(`${empty.name} is empty. Choose a file with content.`)
      return []
    }

    const invalid = items.find((file) => {
      const extension = `.${(file.name.split('.').pop() || '').toLowerCase()}`
      const extensionAllowed = allowedList.some((item) => item.toLowerCase() === extension)
      const mimeTypeAllowed = allowedList.some(
        (item) => item.startsWith('image/') && item === file.type,
      )
      const isTypeAllowed = extensionAllowed || mimeTypeAllowed
      const sizeOk = file.size <= maxSizeMB * 1024 * 1024
      return !isTypeAllowed || !sizeOk
    })

    if (invalid) {
      setError(
        `Unsupported file type or size. Allowed types: ${accept} and max size ${maxSizeMB}MB.`,
      )
      return []
    }

    setError('')
    return items
  }

  const updateFiles = (selectedFiles) => {
    if (disabled) return
    const validFiles = validateFiles(selectedFiles)
    setFiles(validFiles)
    if (onFilesChange) onFilesChange(validFiles)
  }

  const handleInput = (event) => {
    updateFiles(event.target.files)
    event.target.value = ''
  }

  const removeFile = (fileName) => {
    const next = files.filter((file) => file.name !== fileName)
    setFiles(next)
    if (onFilesChange) onFilesChange(next)
  }

  return (
    <div className={`rounded-xl border border-dashed border-brand-silver bg-brand-cream p-4 ${className}`}>
      <label className="mb-3 block text-sm font-medium text-brand-dark" htmlFor={inputId}>{label}</label>
      <div
        aria-describedby={error ? errorId : undefined}
        className={`flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
          dragActive ? 'border-brand-royal bg-brand-cream' : 'border-brand-silver bg-white'
        } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        onKeyDown={(event) => {
          if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onDragEnter={(event) => {
          event.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setDragActive(false)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragActive(true)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragActive(false)
          updateFiles(event.dataTransfer.files)
        }}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          id={inputId}
          accept={accept}
          className="hidden"
          disabled={disabled}
          multiple={multiple}
          onChange={handleInput}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          type="file"
        />
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/15 text-brand-royal">
          <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
            <path d="M12 16V4m0 0 4 4m-4-4-4 4M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm font-medium text-brand-dark">{description}</p>
        <p className="mt-1 text-xs text-brand-dark">Allowed: {accept.replace(/,/g, ', ')} • Max {maxSizeMB}MB</p>
      </div>

      {error ? <p className="mt-3 text-sm font-medium text-brand-navy" id={errorId} role="alert">{error}</p> : null}

      {files.length ? (
        <ul className="mt-4 space-y-2">
          {files.map((file) => (
            <li key={`${file.name}-${file.size}`} className="flex items-center justify-between rounded-lg border border-brand-silver bg-white px-3 py-2 text-sm text-brand-dark">
              <div className="min-w-0">
                <p className="truncate font-medium text-brand-dark">{file.name}</p>
                <p className="text-xs text-brand-dark">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.name)}
                className="ml-3 rounded-md px-2 py-1 text-xs font-medium text-brand-navy hover:bg-brand-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-royal"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default FileUpload
