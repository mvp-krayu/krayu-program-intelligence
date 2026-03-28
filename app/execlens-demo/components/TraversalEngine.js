/**
 * TraversalEngine.js
 * PIOS-51.6-RUN01-CONTRACT-v1 | D.3-LENS-RUNTIME-ACTIVATION
 *
 * Traversal runtime engine — orchestration constants only.
 * No computation. No state. No data mutation.
 *
 * Rules:
 *   R1  NODE_TO_PANEL: static mapping of node types to existing panel IDs
 *   R2  TRAVERSAL_FLOWS: ordered node sequences — visibility control only
 *   R3  PERSONA_AUTO_OPEN: reveal depth only — zero content variation
 *   R4  getFlowPanels: pure derivation from static constants
 *   R5  no data structures beyond orchestration metadata
 *
 * D.3 additions (docs/governance/architecture/lens_runtime_activation.md):
 *   D3.1  PANEL_STATES: canonical D.2 state names
 *   D3.2  D2_PANEL_MAP: D.2 panel name → code panel ID
 *   D3.3  D2_PATH_MAP: four D.2 traversal paths with code sequences
 *   D3.4  PERSONA_DEPTH_ENVELOPE: per-persona reachable panel sets
 *   D3.5  computePanelState: derive D.2 state from session context
 *   D3.6  validatePanelTransition: REMOVED [A.9] — transition validation authority belongs to CONTROL only
 *
 * Authority: docs/pios/51.6/enl_traversal_runtime_model.md
 *            docs/governance/architecture/execlens_traversal_binding.md (D.2)
 */

// ---------------------------------------------------------------------------
// Node type → panel ID mapping [R1]
// Maps logical traversal node roles to existing panel IDs
// ---------------------------------------------------------------------------

export const NODE_TO_PANEL = {
  ENTRY:        'persona',
  ANSWER:       'narrative',
  SIGNAL:       'signals',
  STRUCTURE:    'situation',
  EVIDENCE:     'evidence',
  TRACEABILITY: 'evidence',
  NAVIGATION:   'evidence',
}

// ---------------------------------------------------------------------------
// Ordered traversal sequences per DemoFlow [R2]
// Reorder visibility only — NEVER alter content
// ---------------------------------------------------------------------------

export const TRAVERSAL_FLOWS = {
  executive_insight: {
    label:       'Executive Insight',
    description: 'Answer-first · signals · evidence',
    nodes:       ['ANSWER', 'SIGNAL', 'EVIDENCE'],
  },
  structural_analysis: {
    label:       'Structural Analysis',
    description: 'Answer · structure · signals · evidence',
    nodes:       ['ANSWER', 'STRUCTURE', 'SIGNAL', 'EVIDENCE'],
  },
  evidence_audit: {
    label:       'Evidence Audit',
    description: 'Evidence-first · structure · signals · answer',
    nodes:       ['EVIDENCE', 'STRUCTURE', 'SIGNAL', 'ANSWER'],
  },
}

// ---------------------------------------------------------------------------
// Persona auto-open — reveal depth only [R3]
// Identical data across personas. Only panel open depth differs.
// ---------------------------------------------------------------------------

export const PERSONA_AUTO_OPEN = {
  EXECUTIVE: ['narrative'],                           // ANSWER only
  CTO:       ['narrative', 'situation', 'signals'],   // ANSWER + STRUCTURE + SIGNAL
  ANALYST:   ['narrative', 'signals'],                // ANSWER + SIGNAL
}

// ---------------------------------------------------------------------------
// Node labels — display only
// ---------------------------------------------------------------------------

export const NODE_LABELS = {
  ENTRY:        'Entry',
  ANSWER:       'Answer',
  SIGNAL:       'Signal',
  STRUCTURE:    'Structure',
  EVIDENCE:     'Evidence',
  TRACEABILITY: 'Traceability',
  NAVIGATION:   'Navigation',
}

// ---------------------------------------------------------------------------
// getFlowPanels — derive ordered panel sequence from flow [R4]
// Pure function. No computation.
// ---------------------------------------------------------------------------

export function getFlowPanels(flowId) {
  const flow = TRAVERSAL_FLOWS[flowId]
  if (!flow) return []
  return flow.nodes.map(n => NODE_TO_PANEL[n])
}

// getFlowNodes — derive ordered node labels for display
export function getFlowNodes(flowId) {
  const flow = TRAVERSAL_FLOWS[flowId]
  if (!flow) return []
  return flow.nodes.map(n => ({ node: n, label: NODE_LABELS[n], panelId: NODE_TO_PANEL[n] }))
}

// ---------------------------------------------------------------------------
// D3.1 — PANEL_STATES [D.2 canonical state names]
// Authority: docs/governance/architecture/execlens_panel_state_model.md §3
// ---------------------------------------------------------------------------

export const PANEL_STATES = {
  HIDDEN:    'HIDDEN',    // not in traversal context; unreachable by any action
  AVAILABLE: 'AVAILABLE', // reachable as next valid step; not yet entered
  ACTIVE:    'ACTIVE',    // current traversal position; exactly one per session
  EXPANDED:  'EXPANDED',  // sub-state of ACTIVE; panel open to full depth
  LOCKED:    'LOCKED',    // exists but outside current traversal envelope
}

// ---------------------------------------------------------------------------
// D3.2 — D2_PANEL_MAP [D.2 panel name → code panel ID]
// Authority: docs/governance/architecture/lens_runtime_state_mapping.md §2
// Null entries are governed gaps — panels not yet implemented in runtime.
// ---------------------------------------------------------------------------

export const D2_PANEL_MAP = {
  Overview:    'narrative',  // canonical node; entry surface
  Signals:     'signals',    // stack node; primary path step 2
  Topology:    'situation',  // stack node; technical deepening step 2
  Drift:       null,         // drift node — NOT IMPLEMENTED; future stream required
  Remediation: null,         // remediation node — NOT IMPLEMENTED; future stream required
  Evidence:    'evidence',   // appendix/evidence node; terminal panel
}

// ---------------------------------------------------------------------------
// D3.3 — D2_PATH_MAP [four D.2 traversal paths with code panel sequences]
// Authority: docs/governance/architecture/execlens_navigation_contract.md §3–6
// codeSequence uses code panel IDs; null entries represent unimplemented panels.
// ---------------------------------------------------------------------------

export const D2_PATH_MAP = {
  primary: {
    label:          'Primary Path',
    canonicalSeq:   ['Overview', 'Signals', 'Evidence'],
    codeSequence:   ['narrative', 'signals', 'evidence'],
  },
  technical_deepening: {
    label:          'Technical Deepening Path',
    canonicalSeq:   ['Overview', 'Topology', 'Evidence'],
    codeSequence:   ['narrative', 'situation', 'evidence'],
  },
  drift_explanation: {
    label:          'Drift Explanation Path',
    canonicalSeq:   ['Overview', 'Signals', 'Drift', 'Remediation', 'Evidence'],
    codeSequence:   ['narrative', 'signals', null, null, 'evidence'], // Drift+Remediation not implemented
  },
  product_bridge: {
    label:          'Product Bridge Path',
    canonicalSeq:   ['Overview', 'Topology', 'Evidence'],
    codeSequence:   ['narrative', 'situation', 'evidence'],
  },
}

// ---------------------------------------------------------------------------
// D3.4 — PERSONA_DEPTH_ENVELOPE [per-persona reachable panel sets]
// Authority: docs/governance/architecture/execlens_persona_binding.md §3–5
// panels: code panel IDs the persona may reach (excludes null/unimplemented)
// maxDepth: maximum traversal steps from Overview
// ---------------------------------------------------------------------------

export const PERSONA_DEPTH_ENVELOPE = {
  EXECUTIVE: {
    panels:   ['narrative', 'signals', 'evidence'],
    maxDepth: 2, // Overview → Signals → Evidence
  },
  CTO: {
    panels:   ['narrative', 'signals', 'situation', 'evidence'],
    maxDepth: 3, // Overview → [Signals|Topology] → [Drift] → Evidence
  },
  ANALYST: {
    panels:   ['narrative', 'signals', 'situation', 'evidence'],
    maxDepth: 4, // full depth; Drift+Remediation excluded only due to implementation gap
  },
}

// ---------------------------------------------------------------------------
// D3.5 — computePanelState
// Derives the D.2 canonical state of a panel given full session context.
// Pure function. No side effects.
// Authority: docs/governance/architecture/lens_runtime_state_mapping.md §4
// ---------------------------------------------------------------------------

export function computePanelState(panelId, openPanels, traversalHistory, persona, demoActive, freeMode) {
  // Operator mode: traversal contract suspended — all implemented panels available
  if (freeMode) {
    if (panelId === null) return PANEL_STATES.LOCKED // null = unimplemented
    return openPanels.includes(panelId) ? PANEL_STATES.ACTIVE : PANEL_STATES.AVAILABLE
  }

  // Null panel IDs are unimplemented — always LOCKED regardless of session state
  if (panelId === null) return PANEL_STATES.LOCKED

  // No persona active — only narrative (query selector / entry surface) is accessible
  if (!persona) {
    return panelId === 'narrative' ? PANEL_STATES.AVAILABLE : PANEL_STATES.HIDDEN
  }

  const envelope = PERSONA_DEPTH_ENVELOPE[persona]

  // Panel outside persona depth envelope — LOCKED
  if (!envelope || !envelope.panels.includes(panelId)) return PANEL_STATES.LOCKED

  // Panel is current traversal position
  if (traversalHistory.length > 0 && traversalHistory[traversalHistory.length - 1] === panelId) {
    return openPanels.includes(panelId) ? PANEL_STATES.EXPANDED : PANEL_STATES.ACTIVE
  }

  // Panel has been visited — prior traversal step (collapsed accessible state)
  if (traversalHistory.includes(panelId)) return PANEL_STATES.AVAILABLE

  // Panel is valid next step from current position
  const currentPanel = traversalHistory[traversalHistory.length - 1] || null
  if (_isValidNextStep(panelId, currentPanel, persona)) return PANEL_STATES.AVAILABLE

  // Panel exists but traversal has not reached it
  return PANEL_STATES.HIDDEN
}

// Internal helper — determines if panelId is a valid next step from currentPanel
function _isValidNextStep(panelId, currentPanel, persona) {
  const envelope = PERSONA_DEPTH_ENVELOPE[persona]
  if (!envelope) return false
  // Find any path whose sequence has currentPanel immediately before panelId
  return Object.values(D2_PATH_MAP).some(path => {
    const seq = path.codeSequence.filter(Boolean) // exclude nulls
    const idx = seq.indexOf(currentPanel)
    return idx !== -1 && seq[idx + 1] === panelId && envelope.panels.includes(panelId)
  })
}

// D3.6 — validatePanelTransition REMOVED [A.9]
// Transition validation authority belongs to CONTROL only.
// This function was not imported by index.js (removed in A.7) or Control.js.
// Its presence as exported runtime logic violated A.9 Rule 3 (transitions must not be runtime-validated).
