import Button from '../../components/Button.jsx'
import Modal from '../../components/Modal.jsx'

// Provides a consistent confirmation step for sensitive account actions.
function ConfirmDialog({ busy = false, confirmLabel = 'Confirm', message, onCancel, onConfirm, open, title }) {
  return (
    <Modal
      footer={(
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} variant="outline">Cancel</Button>
          <Button disabled={busy} loading={busy} onClick={onConfirm} variant="primary">{confirmLabel}</Button>
        </div>
      )}
      onClose={onCancel}
      open={open}
      title={title}
    >
      <p>{message}</p>
    </Modal>
  )
}

export default ConfirmDialog
