/**
 * TraversalEngine.js
 * PIOS-51.6-RUN01-CONTRACT-v1
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
 * Authority: docs/pios/51.6/enl_traversal_runtime_model.md
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
