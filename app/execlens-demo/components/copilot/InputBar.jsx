import { useState, useRef, useCallback } from 'react'

const AUDIENCE_PRESETS = [
  '',
  'Board of Directors',
  'CTO / VP Engineering',
  'Chief Architect',
  'Program Director',
  'Release Train Engineer (RTE)',
  'Engineering Director',
  'Transformation Leader',
  'PE Acquisition Team',
  'Investor',
  'GOD / Founder-Operator',
]

export default function InputBar({ onSubmit, disabled }) {
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState('')
  const textareaRef = useRef(null)

  const handleSubmit = useCallback(() => {
    const trimmed = message.trim()
    if (!trimmed || disabled) return
    onSubmit({ message: trimmed, audience: audience || undefined })
    setMessage('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [message, audience, disabled, onSubmit])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  const handleInput = useCallback((e) => {
    setMessage(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [])

  return (
    <div className="copilot-input-bar">
      <div className="copilot-input-row">
        <textarea
          ref={textareaRef}
          className="copilot-input-field"
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you need..."
          rows={1}
          disabled={disabled}
        />
        <button
          className="copilot-send-btn"
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          aria-label="Send"
        >
          &rarr;
        </button>
      </div>
      <div className="copilot-input-meta">
        <label className="copilot-audience-label">
          <span>Audience</span>
          <select
            className="copilot-audience-select"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option value="">General</option>
            {AUDIENCE_PRESETS.filter(Boolean).map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
