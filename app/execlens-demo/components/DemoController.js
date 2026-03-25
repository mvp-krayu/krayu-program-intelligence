/**
 * DemoController.js
 * PIOS-51.4-RUN01-CONTRACT-v1
 *
 * Demo choreography layer — panel orchestration.
 * Supersedes: PIOS-51.3-RUN01-CONTRACT-v1 (9-step scroll navigation)
 *
 * Manages:
 *   - Panel stage sequence (5 stages, deterministic)
 *   - Stage indicator bar
 *   - Keyboard navigation (→/Enter/Space = next, Escape = exit)
 *
 * Rules:
 *   R1  no scroll orchestration — panels handle their own visibility
 *   R2  no content modification — stage signaling only
 *   R3  no step pips — stage indicators only
 *   R4  keyboard navigation preserved
 *   G4  if panel absent from DOM → stage advances regardless
 *
 * Sequence authority: docs/pios/51.4/panel_orchestration_spec.md
 */

import { useEffect, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Demo stage definitions — 5-stage panel flow (51.4)
// ---------------------------------------------------------------------------

export const DEMO_STAGES = [
  {
    num:     1,
    label:   'Situation',
    title:   'Structural baseline — architecture and projection emphasis',
    panelId: 'situation',
  },
  {
    num:     2,
    label:   'Signals',
    title:   'Why is this critical? — bound intelligence signals',
    panelId: 'signals',
  },
  {
    num:     3,
    label:   'Persona',
    title:   'What does this mean for your audience?',
    panelId: 'persona',
  },
  {
    num:     4,
    label:   'Evidence',
    title:   'Show evidence — chain and traceability',
    panelId: 'evidence',
  },
  {
    num:     5,
    label:   'Narrative',
    title:   'So what — executive summary',
    panelId: 'narrative',
  },
]

// ---------------------------------------------------------------------------
// DemoController
// ---------------------------------------------------------------------------

export default function DemoController({ active, stage, onNext, onExit }) {

  // Keyboard navigation (→/Enter/Space = next, Escape = exit)
  const handleKey = useCallback((e) => {
    if (!active) return
    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onNext()
    }
    if (e.key === 'Escape') {
      onExit()
    }
  }, [active, onNext, onExit])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  if (!active) return null

  const stageDef = DEMO_STAGES[stage - 1]
  const isLast   = stage >= DEMO_STAGES.length

  return (
    <div className="demo-bar" role="navigation" aria-label="Demo navigation">

      {/* Stage indicators — 5 dots, no step labels */}
      <div className="demo-stages-row">
        {DEMO_STAGES.map((s) => {
          const state = s.num === stage ? 'active' : s.num < stage ? 'done' : 'future'
          return (
            <span
              key={s.num}
              className={`demo-stage-dot demo-stage-dot-${state}`}
              title={s.label}
              aria-label={s.label}
            />
          )
        })}
        <span className="demo-stage-current-label">
          {stageDef ? stageDef.label : ''}
        </span>
      </div>

      {/* Current stage title */}
      {stageDef && (
        <div className="demo-step-title">{stageDef.title}</div>
      )}

      {/* Controls */}
      <div className="demo-controls">
        <button className="demo-btn demo-btn-exit" onClick={onExit} type="button">
          Exit
        </button>
        <button className="demo-btn demo-btn-next" onClick={onNext} type="button">
          {isLast ? 'Finish ✓' : 'Next →'}
        </button>
      </div>

    </div>
  )
}
