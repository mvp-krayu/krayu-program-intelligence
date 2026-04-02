/**
 * DisclosurePanel.js
 * PIOS-51.4-RUN01-CONTRACT-v1
 *
 * Generic collapsible panel — presentation layer only.
 * Expand / collapse. No logic. No computation.
 *
 * Props:
 *   id       — panel identifier (string)
 *   title    — panel heading
 *   subtitle — secondary heading (optional)
 *   badge    — small indicator string (optional)
 *   expanded — boolean: is panel open
 *   onToggle — callback: user clicked header
 *   children — panel body content
 */

// 51.14: active — projection-layer attention guidance; applies dp-active class for visual emphasis only [51.14]
export default function DisclosurePanel({ id, title, subtitle, badge, expanded, onToggle, active, children }) {
  return (
    <div
      className={`dp${expanded ? ' dp-open' : ''}${active ? ' dp-active' : ''}`}
      data-panel-id={id}
    >
      <button
        className="dp-header"
        onClick={onToggle}
        aria-expanded={expanded}
        type="button"
      >
        <div className="dp-header-left">
          <span className="dp-title">{title}</span>
          {subtitle && <span className="dp-subtitle">{subtitle}</span>}
        </div>
        <div className="dp-header-right">
          {badge && <span className="dp-badge">{badge}</span>}
          <span className="dp-chevron" aria-hidden="true">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="dp-body">
          {children}
        </div>
      )}
    </div>
  )
}
