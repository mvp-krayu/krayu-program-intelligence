// Extracted from dashboard.html — ConfirmDialog
// Line 1285 | 14 lines

import Modal from '@/components/ui/Modal';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel, danger }: any) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'Confirm Action'}
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className={`btn ${danger ? 'btn-danger' : 'btn-cyan'}`} onClick={onConfirm}>{confirmLabel || 'Confirm'}</button>
      </>}>
      <div className="confirm-body">
        <div className="confirm-icon">{danger ? '⚠️' : 'ℹ️'}</div>
        <div className="confirm-msg">{message}</div>
      </div>
    </Modal>
  );
}
