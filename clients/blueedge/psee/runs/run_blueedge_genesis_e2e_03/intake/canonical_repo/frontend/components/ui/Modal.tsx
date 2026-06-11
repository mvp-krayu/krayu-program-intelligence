// Extracted from dashboard.html — Modal
// Line 1247 | 16 lines

import ReactDOM from 'react-dom';

export default function Modal({ open, onClose, title, children, footer, lg }: any) {
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${lg ? 'modal-lg' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
