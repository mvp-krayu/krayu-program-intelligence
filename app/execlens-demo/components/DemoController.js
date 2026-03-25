/**
 * DemoController.js
 * PIOS-51.3-RUN01-CONTRACT-v1
 *
 * Demo choreography layer — presentation-only.
 * Supersedes: PIOS-42.8-RUN01-CONTRACT-v1 (7-step flow → 9-step unified flow)
 *
 * Manages:
 *   - Step sequence (9 fixed steps, deterministic, no branching)
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
 *
 * Sequence authority: docs/pios/51.3/demo_sequence.md
 */

import { useEffect, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Demo step definitions — 9-step unified flow (51.3)
// ---------------------------------------------------------------------------

export const DEMO_STEPS = [
  {
    num:    1,
    label:  'Entry',
    title:  'ExecLens — evidence-first program intelligence, governed and deployable',
    target: null,   // Verbal framing only — scroll to top
  },
  {
    num:    2,
    label:  'Query',
    title:  'GQ-003 — What is the blast radius if a core platform component fails?',
    target: 'query',
    // Auto-select GQ-003 handled in parent (index.js) via useEffect on demoStep === 2
  },
  {
    num:    3,
    label:  'Overview',
    title:  'Structural baseline — coordination pressure, dependency load, visibility deficit',
    target: 'gauges',
  },
  {
    num:    4,
    label:  'Topology',
    title:  'BlueEdge architecture — 4 domains, 5 capabilities, 9 components from governed artifacts',
    target: 'topology',
  },
  {
    num:    5,
    label:  'Focus',
    title:  'Query-linked highlighting — GQ-003 relevant nodes traced through evidence index',
    target: 'topology',
  },
  {
    num:    6,
    label:  'Emphasis',
    title:  'Projection-driven RED node — C_30_Domain_Event_Bus emphasis:high via 44.4C',
    target: 'topology',
  },
  {
    num:    7,
    label:  'Persona',
    title:  'Audience lens — Exec / CTO / Analyst perspective selection',
    target: 'persona',
  },
  {
    num:    8,
    label:  'ENL',
    title:  'ENL lens — projection-enriched signal view for GQ-003',
    target: 'enl',
  },
  {
    num:    9,
    label:  'Narrative',
    title:  'Executive narrative — evidence-grounded program intelligence summary',
    target: 'signals',
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
      // Step 1 (Entry) and any null-target step: scroll to top, no spotlight
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
