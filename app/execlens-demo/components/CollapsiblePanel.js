/**
 * CollapsiblePanel.js
 * Presentation-layer collapsible panel wrapper.
 *
 * Children are ALWAYS mounted — no data is unloaded on collapse.
 * Visibility is controlled via CSS (display:none on .cp-body).
 * No query re-runs. No state resets. No side effects.
 *
 * Interaction boundary:
 *   The header uses <div role="button"> NOT <button>. A native <button> element
 *   participates in the browser's activation model and can capture mousedown
 *   events from the containing block, preventing links inside .cp-body from
 *   completing their click sequence (mousedown → mouseup → click → navigate).
 *   A <div role="button"> has no native activation model — it receives clicks
 *   only through the explicit onClick handler, with zero interference on body
 *   content or anchor elements.
 *
 * Props:
 *   id            string   — key used by parent's togglePanel handler
 *   label         string   — header text (always visible)
 *   open          boolean  — expanded (true) or collapsed (false)
 *   onToggle      fn(id)   — called when header is clicked
 *   children      node     — panel content (mounted regardless of open state)
 *   badge         string?  — optional count/status chip next to label
 *   sectionId     string?  — if set, written to data-demo-section on root element
 *   hideInnerTitle bool?   — adds cp-no-inner-title: suppresses .panel > .panel-title
 *                            inside cp-body for components that own their own title
 */

export default function CollapsiblePanel({
  id,
  label,
  open,
  onToggle,
  children,
  badge,
  sectionId,
  hideInnerTitle,
}) {
  const rootClass = [
    'cp-wrap',
    open ? 'cp-expanded' : 'cp-collapsed',
    hideInnerTitle ? 'cp-no-inner-title' : '',
  ].filter(Boolean).join(' ')

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle(id)
    }
  }

  return (
    <div className={rootClass} data-demo-section={sectionId || undefined}>
      {/* div role="button" — no native activation model, no mousedown capture */}
      <div
        role="button"
        tabIndex={0}
        className="cp-header"
        onClick={() => onToggle(id)}
        onKeyDown={handleKeyDown}
        aria-expanded={open}
      >
        <span className="cp-toggle">{open ? '▼' : '▶'}</span>
        <span className="cp-label">{label}</span>
        {badge && <span className="cp-badge">{badge}</span>}
      </div>
      <div className="cp-body">
        {children}
      </div>
    </div>
  )
}
