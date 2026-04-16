/**
 * components/lens/AccessGateModal.js
 * PRODUCTIZE.LENS.COMMERCIAL.GATING.01
 *
 * Commercial gating modal.
 * Shown when user attempts to access a gated intelligence layer.
 *
 * Props:
 *   open    — boolean, controls visibility
 *   onClose — dismiss without granting access
 *   onGrant — grant access (UI-only, sets hasAccess=true)
 */

import { useState } from 'react'
import Link from 'next/link'

export default function AccessGateModal({ open, onClose, onGrant }) {
  const [mode, setMode]       = useState('default')  // 'default' | 'key-entry'
  const [keyValue, setKeyValue] = useState('')

  if (!open) return null

  function handleGrant() {
    onGrant()
    setKeyValue('')
    setMode('default')
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="gate-overlay" onClick={handleOverlayClick}>
      <div className="gate-modal" role="dialog" aria-modal="true" aria-labelledby="gate-title">

        <div className="gate-modal-header">
          <span className="gate-modal-eyebrow">INTELLIGENCE ACCESS</span>
          <div className="gate-modal-title" id="gate-title">Secure Access Required</div>
        </div>

        <div className="gate-modal-body">
          {mode === 'default' && (
            <>
              <p className="gate-modal-text">
                Deeper intelligence layers are available within this assessment system.
                Extended access includes:
              </p>
              <ul className="gate-modal-list">
                <li>Full trace interrogation — evidence chain validation at source</li>
                <li>Capability-level topology — structural detail beneath the domain layer</li>
                <li>Operational evidence chains — signal-to-conclusion traceability</li>
              </ul>
              <p className="gate-modal-text">
                Access is governed and entitlement-based. Enter your access key
                or view available plans.
              </p>
              <div className="gate-modal-actions">
                <button
                  className="gate-btn gate-btn--primary"
                  onClick={() => setMode('key-entry')}
                >
                  Enter Access Key
                </button>
                <Link href="/plans" className="gate-btn gate-btn--secondary" onClick={onClose}>
                  View Access Plans
                </Link>
              </div>
            </>
          )}

          {mode === 'key-entry' && (
            <>
              <p className="gate-modal-text">
                Enter your access key to unlock governed intelligence layers.
              </p>
              <input
                className="gate-key-input"
                type="text"
                placeholder="Access key"
                value={keyValue}
                onChange={e => setKeyValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && keyValue.trim()) handleGrant() }}
                autoFocus
              />
              <div className="gate-modal-actions">
                <button
                  className="gate-btn gate-btn--primary"
                  onClick={handleGrant}
                  disabled={!keyValue.trim()}
                >
                  Unlock Access
                </button>
                <button
                  className="gate-btn gate-btn--ghost"
                  onClick={() => { setMode('default'); setKeyValue('') }}
                >
                  ← Back
                </button>
              </div>
            </>
          )}
        </div>

        <div className="gate-modal-footer">
          <button className="gate-dismiss" onClick={onClose}>
            Continue with current view
          </button>
        </div>

      </div>
    </div>
  )
}
