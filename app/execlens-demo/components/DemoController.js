/**
 * DemoController.js
 * PIOS-42.8-RUN01-CONTRACT-v1
 *
 * Demo choreography layer — presentation-only.
 *
 * Manages:
 *   - Step sequence (7 fixed steps, deterministic, no branching)
 *   - Scroll orchestration (smooth scroll to data-demo-section targets)
 *   - Spotlight highlight (CSS class applied/removed per step)
 *   - Step indicator (fixed bottom bar, visible in demo mode only)
 *   - Keyboard navigation (→/Enter/Space = next, Escape = exit)
 *
 * Rules:
 *   R3  no content modification — only scroll + CSS class application
 *   R4  spotlight via .demo-spotlight CSS class — no DOM mutation beyond class
 *   R6  highlight removed when advancing forward
 *   G4  if target section absent from DOM → skip scroll, continue
 *   G5  no synthetic narration, no injected text
 */

import { useEffect, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Demo step definitions
// ---------------------------------------------------------------------------

export const DEMO_STEPS = [
  {
    num:    1,
    label:  'System',
    title:  'Live structural metrics — no query required',
    target: 'gauges',
  },
  {
    num:    2,
    label:  'Structure',
    title:  'BlueEdge architecture — 4 domains from governed artifacts',
    target: 'topology',
  },
  {
    num:    3,
    label:  'Query',
    title:  'GQ-003 — Blast radius if a core platform component fails',
    target: 'query',
    // Auto-select handled in parent (index.js) via useEffect
  },
  {
    num:    4,
    label:  'Signals',
    title:  'Bound intelligence signals — evidence-first, no inference',
    target: 'signals',
  },
  {
    num:    5,
    label:  'Evidence',
    title:  'Evidence chains — structural basis for every signal',
    target: 'evidence',
  },
  {
    num:    6,
    label:  'Navigate',
    title:  'Vault-resolved deep links — direct access to architecture artifacts',
    target: 'navigation',
  },
  {
    num:    7,
    label:  'Complete',
    title:  'Program Intelligence — evidence-first, governed, deployable',
    target: null,   // Scroll to top
  },
]

// ---------------------------------------------------------------------------
// DemoController
// ---------------------------------------------------------------------------

export default function DemoController({ active, step, onNext, onExit }) {

  // Scroll to section + apply spotlight on step change
  useEffect(() => {
    if (!active) {
      // Remove all spotlights on exit (G4: clean reset)
      document.querySelectorAll('.demo-spotlight').forEach(el =>
        el.classList.remove('demo-spotlight')
      )
      return
    }

    // Clear previous spotlight
    document.querySelectorAll('.demo-spotlight').forEach(el =>
      el.classList.remove('demo-spotlight')
    )

    const stepDef = DEMO_STEPS[step - 1]
    if (!stepDef) return

    if (stepDef.target) {
      // Find and highlight target section (G4: skip if absent)
      const el = document.querySelector(`[data-demo-section="${stepDef.target}"]`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // Brief delay to let scroll settle before applying spotlight
        setTimeout(() => el.classList.add('demo-spotlight'), 100)
      }
    } else {
      // Step 7: scroll to top, no spotlight (full-page completion state)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [active, step])

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

  const stepDef  = DEMO_STEPS[step - 1]
  const isLast   = step >= DEMO_STEPS.length

  return (
    <div className="demo-bar" role="navigation" aria-label="Demo navigation">

      {/* Step pips */}
      <div className="demo-steps-row">
        {DEMO_STEPS.map((s) => {
          const state = s.num === step ? 'active' : s.num < step ? 'done' : 'future'
          return (
            <span key={s.num} className={`demo-pip demo-pip-${state}`} title={s.title}>
              <span className="demo-pip-num">{s.num}</span>
              <span className="demo-pip-label">{s.label}</span>
            </span>
          )
        })}
      </div>

      {/* Current step title */}
      {stepDef && (
        <div className="demo-step-title">{stepDef.title}</div>
      )}

      {/* Controls */}
      <div className="demo-controls">
        <button className="demo-btn demo-btn-exit" onClick={onExit}>
          Exit
        </button>
        <button className="demo-btn demo-btn-next" onClick={onNext}>
          {isLast ? 'Finish ✓' : 'Next →'}
        </button>
      </div>

    </div>
  )
}
