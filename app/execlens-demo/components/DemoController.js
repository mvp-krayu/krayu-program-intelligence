import { useEffect, useCallback } from 'react'

/**
 * DemoController
 * -----------------------------------------------------------
 * Lightweight guided demo controller for the ExecLens surface.
 *
 * Governing rules (Stream 42.8):
 *   - Step sequence (9 fixed steps, deterministic, no branching)
 *   - Scroll/spotlight only against pre-declared DOM anchors
 *   - No synthetic data, no invented content, no state mutation outside demo UI
 *   - Exit returns page to clean resting state
 *
 * Required anchors on page:
 *   data-demo-section="gauges"
 *   data-demo-section="topology"
 *   data-demo-section="query"
 *   data-demo-section="signals"
 *   data-demo-section="evidence"
 *   data-demo-section="enl"
 *   data-demo-section="navigation"
 *   data-demo-section="persona"
 */

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
    label:  'ENL',
    title:  'ENL chain reveal — same signals, navigation-layer depth',
    target: 'enl',
  },
  {
    num:    7,
    label:  'Navigate',
    title:  'Vault-resolved deep links — direct access to architecture artifacts',
    target: 'navigation',
  },
  {
    num:    8,
    label:  'Persona',
    title:  'Audience lens projection — Executive, CTO, Analyst',
    target: 'persona',
  },
  {
    num:    9,
    label:  'Complete',
    title:  'Program Intelligence — evidence-first, governed, deployable',
    target: null,
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
      // Final step: scroll to top, no spotlight (full-page completion state)
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
