/**
 * DemoController.js
 * PIOS-51.6-RUN01-CONTRACT-v1
 * (supersedes PIOS-51.4-RUN01-CONTRACT-v1)
 *
 * Demo choreography layer — panel orchestration.
 * Extends 51.4 with traversal flow selection and node position indicator.
 *
 * Modes:
 *   standard   — 51.4 stage-based flow (5 stages)
 *   traversal  — 51.6 flow-based single-focus-node (executive_insight / structural_analysis / evidence_audit)
 *
 * Rules:
 *   R1  no scroll orchestration — panels handle visibility
 *   R2  no content modification — stage/node signaling only
 *   R3  keyboard navigation: →/Enter/Space = next, Escape = exit
 *   R4  flow selector shown before demo starts (pre-entry)
 *   R5  traversal mode enforces single focus node at a time
 *   R6  standard mode (no flow selected) falls back to 51.4 behavior
 *
 * Sequence authority: docs/pios/51.6/enl_traversal_runtime_model.md
 */

import { useEffect, useCallback } from 'react'
import { TRAVERSAL_FLOWS } from './TraversalEngine'

// ---------------------------------------------------------------------------
// Demo stage definitions — 5-stage panel flow (51.4 compat)
// ---------------------------------------------------------------------------

export const DEMO_STAGES = [
  { num: 1, label: 'Situation', title: 'Structural baseline — architecture and projection emphasis', panelId: 'situation' },
  { num: 2, label: 'Signals',   title: 'Why is this critical? — bound intelligence signals', panelId: 'signals' },
  { num: 3, label: 'Persona',   title: 'What does this mean for your audience?', panelId: 'persona' },
  { num: 4, label: 'Evidence',  title: 'Show evidence — chain and traceability', panelId: 'evidence' },
  { num: 5, label: 'Narrative', title: 'So what — executive summary', panelId: 'narrative' },
]

// ---------------------------------------------------------------------------
// FlowSelector — pre-entry flow selection (shown before demo starts)
// ---------------------------------------------------------------------------

function FlowSelector({ selectedFlow, onFlowSelect }) {
  return (
    <div className="te-flow-selector">
      <div className="te-flow-selector-label">Select traversal flow</div>
      <div className="te-flow-options">
        <button
          className={`te-flow-btn${!selectedFlow ? ' te-flow-btn-none' : ''}`}
          onClick={() => onFlowSelect(null)}
          type="button"
        >
          <span className="te-flow-btn-title">Standard</span>
          <span className="te-flow-btn-desc">5-stage panel flow</span>
        </button>
        {Object.entries(TRAVERSAL_FLOWS).map(([id, flow]) => (
          <button
            key={id}
            className={`te-flow-btn${selectedFlow === id ? ' te-flow-btn-active' : ''}`}
            onClick={() => onFlowSelect(id)}
            type="button"
          >
            <span className="te-flow-btn-title">{flow.label}</span>
            <span className="te-flow-btn-desc">{flow.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TraversalBar — node-position indicator (traversal mode)
// ---------------------------------------------------------------------------

function TraversalBar({ flowId, nodeIndex, nodes, onNext, onExit }) {
  const flow    = TRAVERSAL_FLOWS[flowId]
  const isLast  = nodeIndex >= nodes.length - 1
  const current = nodes[nodeIndex]

  return (
    <div className="demo-bar demo-bar-traversal" role="navigation" aria-label="Traversal navigation">

      {/* Flow label */}
      <div className="te-bar-flow-label">{flow?.label}</div>

      {/* Node sequence indicators */}
      <div className="te-node-row">
        {nodes.map((n, i) => {
          const state = i === nodeIndex ? 'active' : i < nodeIndex ? 'done' : 'future'
          return (
            <span key={i} className={`te-node-dot te-node-dot-${state}`} title={n.label}>
              <span className="te-node-label">{n.label}</span>
            </span>
          )
        })}
      </div>

      {/* Current node */}
      <div className="te-current-node">
        {current ? `${nodeIndex + 1} / ${nodes.length} — ${current.label}` : ''}
      </div>

      {/* Controls */}
      <div className="demo-controls">
        <button className="demo-btn demo-btn-exit" onClick={onExit} type="button">Exit</button>
        <button className="demo-btn demo-btn-next" onClick={onNext} type="button">
          {isLast ? 'Finish ✓' : 'Next →'}
        </button>
      </div>

    </div>
  )
}

// ---------------------------------------------------------------------------
// StageBar — 51.4 standard stage indicator
// ---------------------------------------------------------------------------

function StageBar({ stage, onNext, onExit }) {
  const stageDef = DEMO_STAGES[stage - 1]
  const isLast   = stage >= DEMO_STAGES.length

  return (
    <div className="demo-bar" role="navigation" aria-label="Demo navigation">

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

      {stageDef && <div className="demo-step-title">{stageDef.title}</div>}

      <div className="demo-controls">
        <button className="demo-btn demo-btn-exit" onClick={onExit} type="button">Exit</button>
        <button className="demo-btn demo-btn-next" onClick={onNext} type="button">
          {isLast ? 'Finish ✓' : 'Next →'}
        </button>
      </div>

    </div>
  )
}

// ---------------------------------------------------------------------------
// DemoController
// ---------------------------------------------------------------------------

export default function DemoController({
  active,
  stage,
  onNext,
  onExit,
  // Traversal engine props (51.6)
  selectedFlow,
  onFlowSelect,
  traversalNodeIndex,
  traversalNodes,
}) {

  // Keyboard navigation [R3]
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

  // Pre-demo: show flow selector [R4]
  if (!active) {
    if (onFlowSelect) {
      return (
        <div className="te-pre-demo">
          <FlowSelector selectedFlow={selectedFlow} onFlowSelect={onFlowSelect} />
        </div>
      )
    }
    return null
  }

  // Traversal mode [R5]
  if (selectedFlow && traversalNodes && traversalNodes.length > 0) {
    return (
      <TraversalBar
        flowId={selectedFlow}
        nodeIndex={traversalNodeIndex}
        nodes={traversalNodes}
        onNext={onNext}
        onExit={onExit}
      />
    )
  }

  // Standard 51.4 stage mode [R6]
  return <StageBar stage={stage} onNext={onNext} onExit={onExit} />
}
