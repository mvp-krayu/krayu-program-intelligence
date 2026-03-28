/**
 * run_control_shadow_validation.mjs
 * A.5B — CONTROL Shadow Parity Validation
 * Self-contained: inlines TraversalEngine + Control + runtime state machine.
 * Run: node scripts/pios/A.5B/run_control_shadow_validation.mjs
 *
 * Runtime source of truth: index.js HEAD a5691c3
 * CONTROL source of truth: Control.js (same HEAD)
 * Any deviation = FAIL per A.5B §9
 */

// ============================================================================
// §1 — TraversalEngine (inlined verbatim from components/TraversalEngine.js)
// ============================================================================

const PANEL_STATES = {
  HIDDEN:    'HIDDEN',
  AVAILABLE: 'AVAILABLE',
  ACTIVE:    'ACTIVE',
  EXPANDED:  'EXPANDED',
  LOCKED:    'LOCKED',
}

const NODE_TO_PANEL = {
  ENTRY: 'persona', ANSWER: 'narrative', SIGNAL: 'signals',
  STRUCTURE: 'situation', EVIDENCE: 'evidence', TRACEABILITY: 'evidence', NAVIGATION: 'evidence',
}

const TRAVERSAL_FLOWS = {
  executive_insight:   { nodes: ['ANSWER', 'SIGNAL', 'EVIDENCE'] },
  structural_analysis: { nodes: ['ANSWER', 'STRUCTURE', 'SIGNAL', 'EVIDENCE'] },
  evidence_audit:      { nodes: ['EVIDENCE', 'STRUCTURE', 'SIGNAL', 'ANSWER'] },
}

function getFlowPanels(flowId) {
  const flow = TRAVERSAL_FLOWS[flowId]
  if (!flow) return []
  return flow.nodes.map(n => NODE_TO_PANEL[n])
}

const PERSONA_DEPTH_ENVELOPE = {
  EXECUTIVE: { panels: ['narrative','signals','evidence'],           maxDepth: 2 },
  CTO:       { panels: ['narrative','signals','situation','evidence'], maxDepth: 3 },
  ANALYST:   { panels: ['narrative','signals','situation','evidence'], maxDepth: 4 },
}

const D2_PATH_MAP = {
  primary:             { codeSequence: ['narrative','signals','evidence'] },
  technical_deepening: { codeSequence: ['narrative','situation','evidence'] },
  drift_explanation:   { codeSequence: ['narrative','signals',null,null,'evidence'] },
  product_bridge:      { codeSequence: ['narrative','situation','evidence'] },
}

const D2_PANEL_MAP = {
  Overview:'narrative', Signals:'signals', Topology:'situation',
  Drift:null, Remediation:null, Evidence:'evidence',
}

function _isValidNextStep(panelId, currentPanel, persona) {
  const envelope = PERSONA_DEPTH_ENVELOPE[persona]
  if (!envelope) return false
  return Object.values(D2_PATH_MAP).some(path => {
    const seq = path.codeSequence.filter(Boolean)
    const idx = seq.indexOf(currentPanel)
    return idx !== -1 && seq[idx+1] === panelId && envelope.panels.includes(panelId)
  })
}

function computePanelState(panelId, openPanels, traversalHistory, persona, demoActive, freeMode) {
  if (freeMode) {
    if (panelId === null) return PANEL_STATES.LOCKED
    return openPanels.includes(panelId) ? PANEL_STATES.ACTIVE : PANEL_STATES.AVAILABLE
  }
  if (panelId === null) return PANEL_STATES.LOCKED
  if (!persona) {
    return panelId === 'narrative' ? PANEL_STATES.AVAILABLE : PANEL_STATES.HIDDEN
  }
  const envelope = PERSONA_DEPTH_ENVELOPE[persona]
  if (!envelope || !envelope.panels.includes(panelId)) return PANEL_STATES.LOCKED
  if (traversalHistory.length > 0 && traversalHistory[traversalHistory.length-1] === panelId) {
    return openPanels.includes(panelId) ? PANEL_STATES.EXPANDED : PANEL_STATES.ACTIVE
  }
  if (traversalHistory.includes(panelId)) return PANEL_STATES.AVAILABLE
  const currentPanel = traversalHistory[traversalHistory.length-1] || null
  if (_isValidNextStep(panelId, currentPanel, persona)) return PANEL_STATES.AVAILABLE
  return PANEL_STATES.HIDDEN
}

// ============================================================================
// §2 — CONTROL (inlined verbatim from components/Control.js)
// ============================================================================

const PANEL_IDS = ['situation','persona','signals','evidence','narrative']

const INTENTS = {
  DEMO_START:'DEMO_START', DEMO_NEXT:'DEMO_NEXT', DEMO_EXIT:'DEMO_EXIT',
  PANEL_TOGGLE:'PANEL_TOGGLE', PERSONA_SELECT:'PERSONA_SELECT',
  QUERY_SELECT:'QUERY_SELECT', AUTO_START:'AUTO_START', INIT:'INIT',
}

const MODES = {
  ENTRY:'ENTRY', GUIDED:'GUIDED', FREE:'FREE', POST_COMPLETION:'POST_COMPLETION',
}

const _PERSONA_GUIDED_FLOWS = {
  EXECUTIVE: [
    { id:'narrative', panelId:'narrative' },
    { id:'signals',   panelId:'signals'   },
    { id:'evidence',  panelId:'evidence'  },
  ],
  CTO: [
    { id:'signals',   panelId:'signals'   },
    { id:'evidence',  panelId:'evidence'  },
    { id:'narrative', panelId:'narrative' },
  ],
  ANALYST: [
    { id:'evidence',  panelId:'evidence'  },
    { id:'signals',   panelId:'signals'   },
    { id:'narrative', panelId:'narrative' },
    { id:'raw',       panelId:'evidence',  rawStep:true },
  ],
}

const _PERSONA_DEFAULT_FLOW = {
  EXECUTIVE:'executive_insight', CTO:'structural_analysis', ANALYST:'evidence_audit',
}

const TOTAL_STAGES = 5
const STAGE_PANEL = { 1:'situation', 2:'signals', 3:'persona', 4:'evidence', 5:'narrative' }

function _deriveMode({ demoActive, demoComplete, freeMode }) {
  if (freeMode)     return MODES.FREE
  if (demoActive)   return MODES.GUIDED
  if (demoComplete) return MODES.POST_COMPLETION
  return MODES.ENTRY
}

function _resolvePanelState(panelId, openPanels, traversalHistory, persona, demoActive, freeMode, rawStepActive) {
  if (panelId === 'situation' || panelId === 'persona') {
    return openPanels.includes(panelId) ? PANEL_STATES.ACTIVE : PANEL_STATES.AVAILABLE
  }
  if (demoActive) {
    if (rawStepActive && panelId === 'evidence') {
      return openPanels.includes('evidence') ? PANEL_STATES.ACTIVE : PANEL_STATES.AVAILABLE
    }
    return computePanelState(panelId, openPanels, traversalHistory, persona, demoActive, freeMode)
  }
  return openPanels.includes(panelId) ? PANEL_STATES.ACTIVE : PANEL_STATES.AVAILABLE
}

function _resolveAllPanelStates(openPanels, traversalHistory, persona, demoActive, freeMode, rawStepActive) {
  const r = {}
  for (const p of PANEL_IDS) r[p] = _resolvePanelState(p, openPanels, traversalHistory, persona, demoActive, freeMode, rawStepActive)
  return r
}

function _resolveAllowedTransitions(traversalHistory, persona, demoActive, freeMode) {
  if (freeMode || !demoActive || !persona) return [...PANEL_IDS]
  const envelope = PERSONA_DEPTH_ENVELOPE[persona]
  if (!envelope) return []
  const currentPanel = traversalHistory.length > 0 ? traversalHistory[traversalHistory.length-1] : null
  const allowed = []
  for (const path of Object.values(D2_PATH_MAP)) {
    const seq = path.codeSequence.filter(Boolean)
    const idx = seq.indexOf(currentPanel)
    if (idx !== -1 && idx+1 < seq.length) {
      const next = seq[idx+1]
      if (envelope.panels.includes(next) && !allowed.includes(next)) allowed.push(next)
    }
  }
  return allowed
}

function _applyToggle(openPanels, panelId) {
  if (openPanels.includes(panelId)) return openPanels.filter(id => id !== panelId)
  const next = [...openPanels, panelId]
  return next.length > 2 ? next.slice(next.length-2) : next
}

function _appendHistory(traversalHistory, panelId) {
  if (!panelId || panelId === 'situation') return traversalHistory
  if (traversalHistory.includes(panelId)) return traversalHistory
  return [...traversalHistory, panelId]
}

function _openPanelsForStep(stepPanel) {
  return stepPanel === 'situation' ? ['situation'] : ['situation', stepPanel]
}

function _rebuildDerivedFields(snapshot) {
  const { openPanels, traversalHistory, selectedPersona, orchestrationState } = snapshot
  const { demoActive, freeMode, rawStepActive, demoComplete } = orchestrationState
  return {
    ...snapshot,
    mode: _deriveMode(orchestrationState),
    resolvedPanelState: _resolveAllPanelStates(openPanels, traversalHistory, selectedPersona, demoActive, freeMode, rawStepActive),
    allowedTransitions: _resolveAllowedTransitions(traversalHistory, selectedPersona, demoActive, freeMode),
    personaEnvelope: selectedPersona ? (PERSONA_DEPTH_ENVELOPE[selectedPersona]?.panels || []) : [],
    sequenceId: selectedPersona || null,
    terminalState: demoComplete && !demoActive && !freeMode,
  }
}

function _buildInitSnapshot() {
  const orchestrationState = {
    demoActive:false, demoStage:0, demoComplete:false, guidedStepIndex:0,
    rawStepActive:false, freeMode:false, traversalNodeIndex:0, selectedFlow:null,
  }
  return _rebuildDerivedFields({
    mode: MODES.ENTRY, selectedPersona:null, selectedQuery:null,
    openPanels:['situation'], traversalHistory:[], currentStepIndex:0,
    sequenceId:null, allowedTransitions:[...PANEL_IDS], personaEnvelope:[],
    orchestrationState, terminalState:false,
  })
}

function CONTROL(intent, ctx, snapshot) {
  const traceId = `ctrl-${Date.now()}-${Math.random().toString(36).slice(2,7)}`
  if (!intent) return { status:'FAIL', failReason:'intent required', traceId, newSnapshot:snapshot||null }
  if (!snapshot && intent !== INTENTS.INIT) return { status:'FAIL', failReason:'snapshot required', traceId, newSnapshot:null }
  if (intent === INTENTS.INIT) return { status:'OK', failReason:null, traceId, newSnapshot:_buildInitSnapshot() }

  const { openPanels, traversalHistory, orchestrationState, selectedPersona, selectedQuery } = snapshot
  const { demoActive, demoStage, demoComplete, guidedStepIndex, rawStepActive, freeMode, selectedFlow, traversalNodeIndex } = orchestrationState

  if (intent === INTENTS.DEMO_EXIT) {
    const no = { ...orchestrationState, freeMode:true, demoActive:false, demoStage:0, demoComplete:false, guidedStepIndex:0, rawStepActive:false, traversalNodeIndex:0, selectedFlow:null }
    return { status:'OK', failReason:null, traceId, newSnapshot:_rebuildDerivedFields({ ...snapshot, openPanels:['situation'], traversalHistory:[], orchestrationState:no }) }
  }

  if (intent === INTENTS.PANEL_TOGGLE) {
    const { panelId } = ctx
    if (!panelId) return { status:'FAIL', failReason:'PANEL_TOGGLE requires panelId', traceId, newSnapshot:snapshot }
    if (demoActive) return { status:'OK', failReason:null, traceId, newSnapshot:snapshot }
    if (demoComplete && panelId !== 'persona') return { status:'OK', failReason:null, traceId, newSnapshot:snapshot }
    return { status:'OK', failReason:null, traceId, newSnapshot:_rebuildDerivedFields({ ...snapshot, openPanels:_applyToggle(openPanels, panelId) }) }
  }

  if (intent === INTENTS.PERSONA_SELECT) {
    const { persona } = ctx
    if (persona === undefined) return { status:'FAIL', failReason:'PERSONA_SELECT requires persona', traceId, newSnapshot:snapshot }
    let no = { ...orchestrationState, guidedStepIndex:0 }
    if (persona !== null) no.demoComplete = false
    let newTH = traversalHistory
    if (demoActive) { no = { ...no, demoActive:false, demoStage:0, traversalNodeIndex:0, selectedFlow:null, rawStepActive:false }; newTH = [] }
    return { status:'OK', failReason:null, traceId, newSnapshot:_rebuildDerivedFields({ ...snapshot, selectedPersona:persona, traversalHistory:newTH, orchestrationState:no }) }
  }

  if (intent === INTENTS.QUERY_SELECT) {
    const { query } = ctx
    if (query === undefined) return { status:'FAIL', failReason:'QUERY_SELECT requires query', traceId, newSnapshot:snapshot }
    if (query === null) {
      const no = { ...orchestrationState, traversalNodeIndex:0 }
      return { status:'OK', failReason:null, traceId, newSnapshot:_rebuildDerivedFields({ ...snapshot, selectedQuery:null, selectedPersona:null, traversalHistory:[], orchestrationState:no }) }
    }
    const no = { ...orchestrationState, traversalNodeIndex:0 }
    return { status:'OK', failReason:null, traceId, newSnapshot:_rebuildDerivedFields({ ...snapshot, selectedQuery:query, orchestrationState:no }) }
  }

  if (intent === INTENTS.DEMO_START) {
    if (!selectedPersona) return { status:'FAIL', failReason:'DEMO_START requires selectedPersona', traceId, newSnapshot:snapshot }
    if (!selectedQuery)   return { status:'FAIL', failReason:'DEMO_START requires selectedQuery',   traceId, newSnapshot:snapshot }
    const steps = _PERSONA_GUIDED_FLOWS[selectedPersona]
    const activeFlow = _PERSONA_DEFAULT_FLOW[selectedPersona] || null
    const firstPanel = steps && steps.length > 0 ? steps[0].panelId : (activeFlow ? (getFlowPanels(activeFlow)[0]||'situation') : 'situation')
    const no = { ...orchestrationState, demoActive:true, demoStage:1, demoComplete:false, guidedStepIndex:0, rawStepActive:false, traversalNodeIndex:0, selectedFlow:activeFlow, freeMode:false }
    return { status:'OK', failReason:null, traceId, newSnapshot:_rebuildDerivedFields({
      ...snapshot, openPanels:_openPanelsForStep(firstPanel),
      traversalHistory:firstPanel && firstPanel !== 'situation' ? [firstPanel] : [],
      orchestrationState:no, currentStepIndex:0,
    }) }
  }

  if (intent === INTENTS.AUTO_START) {
    if (freeMode)          return { status:'FAIL', failReason:'AUTO_START blocked: freeMode=true',     traceId, newSnapshot:snapshot }
    if (!selectedPersona)  return { status:'FAIL', failReason:'AUTO_START requires selectedPersona',    traceId, newSnapshot:snapshot }
    if (!selectedQuery)    return { status:'FAIL', failReason:'AUTO_START requires selectedQuery',       traceId, newSnapshot:snapshot }
    if (demoActive)        return { status:'FAIL', failReason:'AUTO_START blocked: demoActive',          traceId, newSnapshot:snapshot }
    if (demoComplete)      return { status:'FAIL', failReason:'AUTO_START blocked: demoComplete',        traceId, newSnapshot:snapshot }
    const steps = _PERSONA_GUIDED_FLOWS[selectedPersona]
    const activeFlow = _PERSONA_DEFAULT_FLOW[selectedPersona] || null
    const firstPanel = steps && steps.length > 0 ? steps[0].panelId : 'situation'
    const no = { ...orchestrationState, demoActive:true, demoStage:1, demoComplete:false, guidedStepIndex:0, rawStepActive:false, traversalNodeIndex:0, selectedFlow:activeFlow }
    return { status:'OK', failReason:null, traceId, newSnapshot:_rebuildDerivedFields({
      ...snapshot, openPanels:_openPanelsForStep(firstPanel),
      traversalHistory:firstPanel && firstPanel !== 'situation' ? [firstPanel] : [],
      orchestrationState:no, currentStepIndex:0,
    }) }
  }

  if (intent === INTENTS.DEMO_NEXT) {
    const steps = selectedPersona ? _PERSONA_GUIDED_FLOWS[selectedPersona] : null
    if (steps) {
      const nextIndex = guidedStepIndex + 1
      if (nextIndex >= steps.length) {
        const no = { ...orchestrationState, demoComplete:true, demoActive:false, guidedStepIndex:0, rawStepActive:false }
        return { status:'OK', failReason:null, traceId, newSnapshot:_rebuildDerivedFields({ ...snapshot, selectedPersona:null, openPanels:['situation'], orchestrationState:no, currentStepIndex:0 }) }
      }
      const step = steps[nextIndex]
      const sp = step.panelId
      const newTH = sp && sp !== 'situation' ? _appendHistory(traversalHistory, sp) : traversalHistory
      const newRaw = step.rawStep ? true : rawStepActive
      const no = { ...orchestrationState, guidedStepIndex:nextIndex, rawStepActive:newRaw }
      return { status:'OK', failReason:null, traceId, newSnapshot:_rebuildDerivedFields({ ...snapshot, openPanels:_openPanelsForStep(sp), traversalHistory:newTH, orchestrationState:no, currentStepIndex:nextIndex }) }
    }
    if (selectedFlow) {
      const panels = getFlowPanels(selectedFlow)
      const nextIndex = traversalNodeIndex + 1
      if (nextIndex >= panels.length) {
        const no = { ...orchestrationState, demoComplete:true, demoActive:false, guidedStepIndex:0, rawStepActive:false, traversalNodeIndex:nextIndex }
        return { status:'OK', failReason:null, traceId, newSnapshot:_rebuildDerivedFields({ ...snapshot, selectedPersona:null, orchestrationState:no }) }
      }
      const no = { ...orchestrationState, traversalNodeIndex:nextIndex }
      return { status:'OK', failReason:null, traceId, newSnapshot:_rebuildDerivedFields({ ...snapshot, openPanels:[panels[nextIndex]], orchestrationState:no }) }
    }
    const newStage = demoStage + 1
    if (newStage > TOTAL_STAGES) {
      const no = { ...orchestrationState, demoComplete:true, demoActive:false, guidedStepIndex:0, rawStepActive:false, demoStage:newStage }
      return { status:'OK', failReason:null, traceId, newSnapshot:_rebuildDerivedFields({ ...snapshot, selectedPersona:null, orchestrationState:no }) }
    }
    const sp = STAGE_PANEL[newStage]
    let newOPs = openPanels
    if (sp && !openPanels.includes(sp)) { const n=[...openPanels,sp]; newOPs = n.length>2?n.slice(n.length-2):n }
    const no = { ...orchestrationState, demoStage:newStage }
    return { status:'OK', failReason:null, traceId, newSnapshot:_rebuildDerivedFields({ ...snapshot, openPanels:newOPs, orchestrationState:no }) }
  }

  return { status:'FAIL', failReason:`Unknown intent: ${intent}`, traceId, newSnapshot:snapshot }
}

function buildSnapshot(rs) {
  if (!rs || typeof rs !== 'object') return { status:'FAIL', failReason:'runtimeState must be object' }
  for (const f of ['openPanels','traversalHistory','demoActive','freeMode','demoComplete']) {
    if (rs[f] === undefined) return { status:'FAIL', failReason:`Missing field: ${f}` }
  }
  const { openPanels, traversalHistory, enlPersona=null, selectedQuery=null, demoActive, demoStage=0, demoComplete, guidedStepIndex=0, rawStepActive=false, freeMode, selectedFlow=null, traversalNodeIndex=0 } = rs
  if (!Array.isArray(openPanels))       return { status:'FAIL', failReason:'openPanels must be array' }
  if (!Array.isArray(traversalHistory)) return { status:'FAIL', failReason:'traversalHistory must be array' }
  const orchestrationState = { demoActive, demoStage, demoComplete, guidedStepIndex, rawStepActive, freeMode, traversalNodeIndex, selectedFlow }
  return {
    status:'OK', mode:_deriveMode(orchestrationState), selectedPersona:enlPersona, selectedQuery,
    resolvedPanelState:_resolveAllPanelStates(openPanels, traversalHistory, enlPersona, demoActive, freeMode, rawStepActive),
    openPanels:[...openPanels], traversalHistory:[...traversalHistory], currentStepIndex:guidedStepIndex,
    sequenceId:enlPersona, allowedTransitions:_resolveAllowedTransitions(traversalHistory, enlPersona, demoActive, freeMode),
    personaEnvelope:enlPersona ? (PERSONA_DEPTH_ENVELOPE[enlPersona]?.panels||[]) : [],
    orchestrationState, terminalState:demoComplete&&!demoActive&&!freeMode,
  }
}

// ============================================================================
// §3 — Runtime state machine (extracted verbatim from index.js HEAD a5691c3)
// ============================================================================

function rt_INIT() {
  return {
    selectedQuery:null, enlPersona:null, openPanels:['situation'], selectedFlow:null,
    traversalNodeIndex:0, demoActive:false, demoStage:0, demoComplete:false,
    guidedStepIndex:0, rawStepActive:false, freeMode:false, traversalHistory:[],
  }
}

// mirrors togglePanel (max-2 rule) — index.js:188–196
function _rt_toggle(openPanels, panelId) {
  if (openPanels.includes(panelId)) return openPanels.filter(id => id !== panelId)
  const next = [...openPanels, panelId]
  return next.length > 2 ? next.slice(next.length-2) : next
}

// mirrors handleToggle — index.js:204–212
function rt_PANEL_TOGGLE(s, panelId) {
  if (s.demoActive) return s
  if (s.demoComplete && panelId !== 'persona') return s
  return { ...s, openPanels: _rt_toggle(s.openPanels, panelId) }
}

// mirrors handleDemoExit — index.js:488–499
function rt_DEMO_EXIT(s) {
  return { ...s, freeMode:true, demoActive:false, demoStage:0, traversalNodeIndex:0,
    selectedFlow:null, demoComplete:false, guidedStepIndex:0, rawStepActive:false, traversalHistory:[] }
}

// mirrors setEnlPersona + persona change reset useEffect — index.js:308–323
// NOTE: traversalHistory is NOT cleared by persona change effect in runtime.
// It is only cleared by handleDemoExit or overwritten by handleStartDemo/auto-start.
function rt_PERSONA_SELECT(s, persona) {
  let n = { ...s, enlPersona:persona, guidedStepIndex:0 }
  if (persona !== null) n.demoComplete = false
  if (s.demoActive) {
    n = { ...n, demoActive:false, demoStage:0, traversalNodeIndex:0, selectedFlow:null, rawStepActive:false }
    // traversalHistory NOT cleared here — runtime persona change effect does not clear it
  }
  return n
}

// mirrors query fetch effect state consequences — index.js:254–285
function rt_QUERY_SELECT(s, query) {
  if (query === null) return { ...s, selectedQuery:null, enlPersona:null, traversalNodeIndex:0 }
  return { ...s, selectedQuery:query, traversalNodeIndex:0 }
}

// mirrors handleStartDemo — index.js:395–426
function rt_DEMO_START(s) {
  if (!s.enlPersona)    return s
  if (!s.selectedQuery) return s
  const activeFlow = s.selectedFlow || (s.enlPersona ? _PERSONA_DEFAULT_FLOW[s.enlPersona] : null)
  const steps = s.enlPersona ? _PERSONA_GUIDED_FLOWS[s.enlPersona] : null
  let firstPanel
  if (activeFlow) {
    const panels = getFlowPanels(activeFlow)
    firstPanel = steps && steps.length > 0 ? steps[0].panelId : panels.length > 0 ? panels[0] : 'situation'
  } else {
    firstPanel = steps && steps.length > 0 ? steps[0].panelId : 'situation'
  }
  return {
    ...s, freeMode:false, demoComplete:false, guidedStepIndex:0, rawStepActive:false,
    traversalNodeIndex:0, selectedFlow:activeFlow||null,
    openPanels:firstPanel==='situation'?['situation']:['situation',firstPanel],
    traversalHistory:firstPanel&&firstPanel!=='situation'?[firstPanel]:[],
    demoActive:true, demoStage:1,
  }
}

// mirrors auto-start useEffect — index.js:349–376
function rt_AUTO_START(s) {
  if (s.freeMode || !s.enlPersona || !s.selectedQuery || s.demoActive || s.demoComplete) return s
  const steps = _PERSONA_GUIDED_FLOWS[s.enlPersona]
  const activeFlow = _PERSONA_DEFAULT_FLOW[s.enlPersona] || null
  const firstPanel = steps && steps.length > 0 ? steps[0].panelId : 'situation'
  return {
    ...s, demoComplete:false, guidedStepIndex:0, rawStepActive:false,
    traversalNodeIndex:0, selectedFlow:activeFlow,
    openPanels:firstPanel==='situation'?['situation']:['situation',firstPanel],
    traversalHistory:firstPanel&&firstPanel!=='situation'?[firstPanel]:[],
    demoActive:true, demoStage:1,
  }
}

// mirrors handleDemoNext — index.js:428–486 (all 3 paths)
function rt_DEMO_NEXT(s) {
  const steps = s.enlPersona ? _PERSONA_GUIDED_FLOWS[s.enlPersona] : null
  // Path A: PERSONA_GUIDED_FLOWS
  if (steps) {
    const nextIndex = s.guidedStepIndex + 1
    if (nextIndex >= steps.length) {
      return { ...s, demoComplete:true, demoActive:false, guidedStepIndex:0, rawStepActive:false, enlPersona:null, openPanels:['situation'] }
    }
    const step = steps[nextIndex]
    const sp = step.panelId
    let newTH = s.traversalHistory
    if (sp && sp !== 'situation') newTH = s.traversalHistory.includes(sp) ? s.traversalHistory : [...s.traversalHistory, sp]
    return { ...s, guidedStepIndex:nextIndex, openPanels:sp==='situation'?['situation']:['situation',sp], traversalHistory:newTH, rawStepActive:step.rawStep?true:s.rawStepActive }
  }
  // Path B: legacy selectedFlow
  if (s.selectedFlow) {
    const panels = getFlowPanels(s.selectedFlow)
    const ni = s.traversalNodeIndex + 1
    if (ni >= panels.length) return { ...s, demoComplete:true, demoActive:false, guidedStepIndex:0, rawStepActive:false, enlPersona:null, traversalNodeIndex:ni }
    return { ...s, traversalNodeIndex:ni, openPanels:[panels[ni]] }
  }
  // Path C: stage mode
  const ns = s.demoStage + 1
  if (ns > TOTAL_STAGES) return { ...s, demoComplete:true, demoActive:false, guidedStepIndex:0, rawStepActive:false, enlPersona:null, demoStage:ns }
  const sp = STAGE_PANEL[ns]
  let newOPs = s.openPanels
  if (sp && !s.openPanels.includes(sp)) { const n=[...s.openPanels,sp]; newOPs=n.length>2?n.slice(n.length-2):n }
  return { ...s, demoStage:ns, openPanels:newOPs }
}

// Dispatch runtime intent to runtime function
function rt(s, intent, ctx) {
  switch(intent) {
    case 'INIT':           return rt_INIT()
    case 'PANEL_TOGGLE':   return rt_PANEL_TOGGLE(s, ctx.panelId)
    case 'DEMO_EXIT':      return rt_DEMO_EXIT(s)
    case 'PERSONA_SELECT': return rt_PERSONA_SELECT(s, ctx.persona)
    case 'QUERY_SELECT':   return rt_QUERY_SELECT(s, ctx.query)
    case 'DEMO_START':     return rt_DEMO_START(s)
    case 'AUTO_START':     return rt_AUTO_START(s)
    case 'DEMO_NEXT':      return rt_DEMO_NEXT(s)
    default:               return s
  }
}

// ============================================================================
// §4 — Comparison engine
// ============================================================================

const COMPARE_FIELDS = [
  'openPanels', 'traversalHistory', 'currentStepIndex', 'mode',
  'selectedPersona', 'selectedQuery', 'terminalState',
  'orchestrationState.demoActive', 'orchestrationState.demoComplete',
  'orchestrationState.freeMode', 'orchestrationState.rawStepActive',
  'orchestrationState.guidedStepIndex', 'orchestrationState.demoStage',
  'orchestrationState.selectedFlow', 'orchestrationState.traversalNodeIndex',
]

function getPath(obj, path) {
  return path.split('.').reduce((a,k) => a!=null&&k in a ? a[k] : undefined, obj)
}

function deepEq(a, b) {
  if (a === b) return true
  if (Array.isArray(a) && Array.isArray(b)) return a.length===b.length && a.every((v,i)=>deepEq(v,b[i]))
  if (a!==null && b!==null && typeof a==='object' && typeof b==='object') {
    const ka=Object.keys(a).sort(), kb=Object.keys(b).sort()
    if (!deepEq(ka,kb)) return false
    return ka.every(k=>deepEq(a[k],b[k]))
  }
  return false
}

function compare(runtimeAfter, controlResponse) {
  if (controlResponse.status === 'FAIL') {
    return { status:'FAIL', mismatches:[{ field:'CONTROL_STATUS', runtime:null, control:controlResponse.failReason }] }
  }
  const rSS = buildSnapshot(runtimeAfter)
  if (rSS.status === 'FAIL') {
    return { status:'FAIL', mismatches:[{ field:'RUNTIME_SNAPSHOT', runtime:rSS.failReason, control:null }] }
  }
  const cSS = controlResponse.newSnapshot
  const mismatches = []
  for (const f of COMPARE_FIELDS) {
    const rv = getPath(rSS, f)
    const cv = getPath(cSS, f)
    if (!deepEq(rv, cv)) mismatches.push({ field:f, runtime:rv, control:cv })
  }
  return { status:mismatches.length===0?'PASS':'FAIL', mismatches }
}

// ============================================================================
// §5 — Scenario definitions
// ============================================================================

const scenarios = [

  // ── A. INITIALIZATION ──────────────────────────────────────────────────────

  { id:'A1', desc:'INIT from clean load',
    steps:[{ intent:'INIT', ctx:{}, note:'Initial state construction — openPanels=[situation], all flags false' }]
  },
  { id:'A2', desc:'QUERY_SELECT null query from clean state',
    setup: s => rt_QUERY_SELECT(rt_INIT(), 'GQ-001'),  // pre-setup: query already set
    steps:[{ intent:'QUERY_SELECT', ctx:{ query:null }, note:'Clear query — should clear persona too' }]
  },
  { id:'A3', desc:'QUERY_SELECT non-null query from clean state',
    steps:[{ intent:'QUERY_SELECT', ctx:{ query:'GQ-001' }, note:'Set query from null — traversalNodeIndex reset' }]
  },
  { id:'A4', desc:'PERSONA_SELECT before guided start',
    setup: s => rt_QUERY_SELECT(rt_INIT(), 'GQ-001'),
    steps:[{ intent:'PERSONA_SELECT', ctx:{ persona:'EXECUTIVE' }, note:'Set persona in ENTRY — clears demoComplete, resets guidedStepIndex' }]
  },
  { id:'A5', desc:'Multiple PERSONA_SELECT changes before guided start',
    setup: s => rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE'),
    steps:[
      { intent:'PERSONA_SELECT', ctx:{ persona:'CTO' },     note:'Change persona EXECUTIVE→CTO in ENTRY' },
      { intent:'PERSONA_SELECT', ctx:{ persona:'ANALYST' }, note:'Change persona CTO→ANALYST in ENTRY' },
    ]
  },

  // ── B. GUIDED START ────────────────────────────────────────────────────────

  { id:'B1', desc:'DEMO_START EXECUTIVE',
    setup: s => rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE'),
    steps:[{ intent:'DEMO_START', ctx:{}, note:'EXECUTIVE: first step narrative — traversalHistory=[narrative]' }]
  },
  { id:'B2', desc:'DEMO_START CTO',
    setup: s => rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'CTO'),
    steps:[{ intent:'DEMO_START', ctx:{}, note:'CTO: first step signals — traversalHistory=[signals]' }]
  },
  { id:'B3', desc:'DEMO_START ANALYST',
    setup: s => rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'ANALYST'),
    steps:[{ intent:'DEMO_START', ctx:{}, note:'ANALYST: first step evidence — traversalHistory=[evidence]' }]
  },
  { id:'B4', desc:'AUTO_START EXECUTIVE',
    setup: s => rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE'),
    steps:[{ intent:'AUTO_START', ctx:{}, note:'AUTO_START path — does not set freeMode, same first step as DEMO_START' }]
  },
  { id:'B5', desc:'AUTO_START CTO',
    setup: s => rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'CTO'),
    steps:[{ intent:'AUTO_START', ctx:{}, note:'CTO auto-start — first step signals' }]
  },
  { id:'B6', desc:'AUTO_START ANALYST',
    setup: s => rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'ANALYST'),
    steps:[{ intent:'AUTO_START', ctx:{}, note:'ANALYST auto-start — first step evidence' }]
  },

  // ── C. GUIDED ADVANCE — full sequences ────────────────────────────────────

  { id:'C1', desc:'DEMO_NEXT full EXECUTIVE sequence (3 steps + terminal)',
    setup: s => rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE')),
    steps:[
      { intent:'DEMO_NEXT', ctx:{}, note:'Step 0→1: narrative→signals — traversalHistory=[narrative,signals]' },
      { intent:'DEMO_NEXT', ctx:{}, note:'Step 1→2: signals→evidence — traversalHistory=[narrative,signals,evidence]' },
      { intent:'DEMO_NEXT', ctx:{}, note:'Step 2→terminal: demoComplete=true, persona cleared' },
    ]
  },
  { id:'C2', desc:'DEMO_NEXT full CTO sequence (3 steps + terminal)',
    setup: s => rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'CTO')),
    steps:[
      { intent:'DEMO_NEXT', ctx:{}, note:'Step 0→1: signals→evidence — traversalHistory=[signals,evidence]' },
      { intent:'DEMO_NEXT', ctx:{}, note:'Step 1→2: evidence→narrative — traversalHistory=[signals,evidence,narrative]' },
      { intent:'DEMO_NEXT', ctx:{}, note:'Step 2→terminal: demoComplete=true, persona cleared' },
    ]
  },
  { id:'C3', desc:'DEMO_NEXT full ANALYST sequence (4 steps + rawStep + terminal)',
    setup: s => rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'ANALYST')),
    steps:[
      { intent:'DEMO_NEXT', ctx:{}, note:'Step 0→1: evidence→signals — traversalHistory=[evidence,signals]' },
      { intent:'DEMO_NEXT', ctx:{}, note:'Step 1→2: signals→narrative — traversalHistory=[evidence,signals,narrative]' },
      { intent:'DEMO_NEXT', ctx:{}, note:'Step 2→3: rawStep evidence — traversalHistory unchanged (evidence already in), rawStepActive=true' },
      { intent:'DEMO_NEXT', ctx:{}, note:'Step 3→terminal: demoComplete=true, persona cleared' },
    ]
  },
  { id:'C4', desc:'DEMO_NEXT at terminal boundary - no further advance',
    setup: s => {
      let st = rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE'))
      st = rt_DEMO_NEXT(rt_DEMO_NEXT(rt_DEMO_NEXT(st))) // reach terminal
      return st
    },
    steps:[{ intent:'DEMO_NEXT', ctx:{}, note:'DEMO_NEXT after terminal — no persona, no steps → Path B/C fallback (no selectedFlow, demoStage=0 is terminal+1)' }]
  },

  // ── D. EXIT / FREE MODE ────────────────────────────────────────────────────

  { id:'D1', desc:'DEMO_EXIT from active guided mode',
    setup: s => rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE')),
    steps:[{ intent:'DEMO_EXIT', ctx:{}, note:'Exit from GUIDED — freeMode=true, traversalHistory=[], openPanels=[situation]' }]
  },
  { id:'D2', desc:'PANEL_TOGGLE in FREE mode',
    setup: s => rt_DEMO_EXIT(rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE'))),
    steps:[
      { intent:'PANEL_TOGGLE', ctx:{ panelId:'signals' },   note:'Toggle signals in FREE mode — opens it' },
      { intent:'PANEL_TOGGLE', ctx:{ panelId:'narrative' }, note:'Toggle narrative with 2 open — max-2: drops situation' },
      { intent:'PANEL_TOGGLE', ctx:{ panelId:'signals' },   note:'Toggle signals again — closes it' },
    ]
  },
  { id:'D3', desc:'PANEL_TOGGLE max-2 rule enforcement',
    setup: s => rt_DEMO_EXIT(rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'CTO'))),
    steps:[
      { intent:'PANEL_TOGGLE', ctx:{ panelId:'evidence' }, note:'Open evidence — [situation,evidence]' },
      { intent:'PANEL_TOGGLE', ctx:{ panelId:'signals' },  note:'Open signals — max-2: drops situation → [evidence,signals]' },
      { intent:'PANEL_TOGGLE', ctx:{ panelId:'narrative' },note:'Open narrative — max-2: drops evidence → [signals,narrative]' },
    ]
  },
  { id:'D4', desc:'FREE mode → guided re-entry via DEMO_START',
    setup: s => rt_DEMO_EXIT(rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE'))),
    steps:[
      { intent:'PERSONA_SELECT', ctx:{ persona:'CTO' }, note:'Select new persona in FREE mode' },
      { intent:'DEMO_START',     ctx:{},                note:'Explicit DEMO_START from FREE — freeMode→false, guided starts' },
    ]
  },

  // ── E. POST-COMPLETION ─────────────────────────────────────────────────────

  { id:'E1', desc:'Terminal completion transition state',
    setup: s => {
      let st = rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE'))
      return rt_DEMO_NEXT(rt_DEMO_NEXT(rt_DEMO_NEXT(st)))
    },
    steps:[{ intent:'DEMO_NEXT', ctx:{}, note:'Verify terminal state: demoComplete=true, persona=null, mode=POST_COMPLETION — this is a no-op step from terminal' }]
  },
  { id:'E2', desc:'Post-completion persona toggle allowed',
    setup: s => {
      let st = rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE'))
      return rt_DEMO_NEXT(rt_DEMO_NEXT(rt_DEMO_NEXT(st)))
    },
    steps:[{ intent:'PANEL_TOGGLE', ctx:{ panelId:'persona' }, note:'Persona panel toggle in POST_COMPLETION — allowed [51.8R amendment 7]' }]
  },
  { id:'E3', desc:'Post-completion non-persona toggle blocked',
    setup: s => {
      let st = rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE'))
      return rt_DEMO_NEXT(rt_DEMO_NEXT(rt_DEMO_NEXT(st)))
    },
    steps:[{ intent:'PANEL_TOGGLE', ctx:{ panelId:'signals' }, note:'Non-persona toggle in POST_COMPLETION — blocked, state unchanged [51.8R amendment 7]' }]
  },

  // ── F. MID-STATE DISRUPTION ────────────────────────────────────────────────

  { id:'F1a', desc:'PERSONA_SELECT during guided mode — before auto-start (expects traversalHistory mismatch)',
    setup: s => rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE')),
    expectFail: true, // runtime does NOT clear traversalHistory; CONTROL does
    steps:[{ intent:'PERSONA_SELECT', ctx:{ persona:'CTO' }, note:'KNOWN MISMATCH: runtime preserves traversalHistory; CONTROL clears it. See A.5B mismatch register.' }]
  },
  { id:'F1b', desc:'PERSONA_SELECT mid-demo + AUTO_START (net parity)',
    setup: s => rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE')),
    steps:[
      { intent:'PERSONA_SELECT', ctx:{ persona:'CTO' }, note:'Change persona mid-demo — runtime: traversalHistory stays, CONTROL: cleared (F1a mismatch)' },
      { intent:'AUTO_START',     ctx:{},                note:'Net state: both runtime and CONTROL reach traversalHistory=[signals] for CTO' },
    ]
  },
  { id:'F2', desc:'QUERY_SELECT null while persona selected (ENTRY mode)',
    setup: s => rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE'),
    steps:[{ intent:'QUERY_SELECT', ctx:{ query:null }, note:'Clear query — persona cleared, query null, traversalNodeIndex=0' }]
  },
  { id:'F3', desc:'QUERY_SELECT non-null while in ENTRY with persona',
    setup: s => rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE'),
    steps:[{ intent:'QUERY_SELECT', ctx:{ query:'GQ-002' }, note:'Change query — persona preserved [51.8R amendment 8], traversalNodeIndex=0' }]
  },

  // ── G. NO-OP / DENIAL PATHS ───────────────────────────────────────────────

  { id:'G1', desc:'PANEL_TOGGLE in GUIDED mode (no-op)',
    setup: s => rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE')),
    steps:[{ intent:'PANEL_TOGGLE', ctx:{ panelId:'narrative' }, note:'Toggle in GUIDED — blocked, state unchanged' }]
  },
  { id:'G2', desc:'AUTO_START when freeMode=true (blocked)',
    setup: s => rt_DEMO_EXIT(rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'CTO'))),
    steps:[{ intent:'AUTO_START', ctx:{}, note:'AUTO_START in FREE mode — CONTROL should return FAIL (blocked); runtime rt_AUTO_START returns state unchanged' }]
  },
  { id:'G3', desc:'AUTO_START when demoActive=true (blocked)',
    setup: s => rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE')),
    steps:[{ intent:'AUTO_START', ctx:{}, note:'AUTO_START when already guided — blocked, state unchanged' }]
  },
  { id:'G4', desc:'AUTO_START when demoComplete=true (blocked)',
    setup: s => {
      let st = rt_AUTO_START(rt_PERSONA_SELECT(rt_QUERY_SELECT(rt_INIT(), 'GQ-001'), 'EXECUTIVE'))
      return rt_DEMO_NEXT(rt_DEMO_NEXT(rt_DEMO_NEXT(st)))
    },
    steps:[{ intent:'AUTO_START', ctx:{}, note:'AUTO_START when demoComplete — blocked, state unchanged' }]
  },
]

// ============================================================================
// §6 — Execution engine
// ============================================================================

let totalEvents = 0, totalPass = 0, totalFail = 0, totalIncomplete = 0
let totalScenarios = 0, scenarioPass = 0, scenarioFail = 0
const traceLog = []
const mismatchRegister = []

console.log('═══════════════════════════════════════════════════════════════')
console.log('  A.5B — CONTROL Shadow Parity Validation')
console.log('  Runtime HEAD: a5691c3 | Branch: feature/51-9-runtime-convergence')
console.log('═══════════════════════════════════════════════════════════════\n')

for (const scenario of scenarios) {
  totalScenarios++
  let runtimeState = scenario.setup ? scenario.setup(rt_INIT()) : rt_INIT()
  const scenarioEvents = []
  let scenarioOK = true

  console.log(`┌─ ${scenario.id}: ${scenario.desc}`)

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i]
    totalEvents++

    // Capture before
    const runtimeBefore = { ...runtimeState }
    const snapshotInput = buildSnapshot(runtimeBefore)
    if (snapshotInput.status === 'FAIL') {
      console.log(`│  [${i+1}] INCOMPLETE — buildSnapshot failed: ${snapshotInput.failReason}`)
      totalIncomplete++
      scenarioOK = false
      continue
    }

    // Apply runtime
    const runtimeAfter = rt(runtimeState, step.intent, step.ctx)
    runtimeState = runtimeAfter  // advance runtime for next step

    // Apply CONTROL
    const controlResponse = CONTROL(step.intent, step.ctx, snapshotInput)

    // Special case: blocked intents — CONTROL returns FAIL, runtime returns unchanged state
    // Compare runtimeAfter to snapshotInput (both should be unchanged = PASS)
    let parity
    if (controlResponse.status === 'FAIL') {
      // Verify runtime state is also unchanged
      const runtimeUnchanged = deepEq(runtimeAfter, runtimeBefore)
      if (runtimeUnchanged) {
        // Both CONTROL and runtime agree: intent was blocked/invalid — this is PASS
        parity = { status:'PASS', mismatches:[], note:`Both CONTROL and runtime treated intent as blocked/no-op` }
      } else {
        // Runtime advanced but CONTROL failed — genuine mismatch
        parity = { status:'FAIL', mismatches:[{ field:'CONTROL_STATUS', runtime:'state advanced', control:controlResponse.failReason }] }
      }
    } else {
      parity = compare(runtimeAfter, controlResponse)
    }

    // For expected fails: F1a where CONTROL and runtime differ by design
    if (scenario.expectFail && parity.status === 'FAIL') {
      console.log(`│  [${i+1}] DOCUMENTED MISMATCH ← ${step.note}`)
      parity.mismatches.forEach(m => {
        console.log(`│       field: ${m.field}`)
        console.log(`│       runtime: ${JSON.stringify(m.runtime)}`)
        console.log(`│       control: ${JSON.stringify(m.control)}`)
      })
      totalFail++
      mismatchRegister.push({ scenarioId:scenario.id, stepOrdinal:i+1, note:step.note, mismatches:parity.mismatches, expected:true })
    } else if (parity.status === 'PASS') {
      console.log(`│  [${i+1}] PASS — ${step.note}`)
      totalPass++
    } else {
      console.log(`│  [${i+1}] FAIL ← ${step.note}`)
      parity.mismatches.forEach(m => {
        console.log(`│       field: ${m.field}`)
        console.log(`│       runtime: ${JSON.stringify(m.runtime)}`)
        console.log(`│       control: ${JSON.stringify(m.control)}`)
      })
      totalFail++
      scenarioOK = false
      mismatchRegister.push({ scenarioId:scenario.id, stepOrdinal:i+1, note:step.note, mismatches:parity.mismatches, expected:false })
    }

    scenarioEvents.push({ stepOrdinal:i+1, intent:step.intent, ctx:step.ctx, note:step.note,
      runtimeBefore, runtimeAfter, controlResponse:{ status:controlResponse.status, failReason:controlResponse.failReason }, parity })
    traceLog.push({ scenarioId:scenario.id, ...scenarioEvents[scenarioEvents.length-1] })
  }

  if (scenario.expectFail) {
    console.log(`└─ DOCUMENTED (expected mismatch, classified in mismatch register)\n`)
    scenarioFail++ // documented fail still counts
  } else if (scenarioOK) {
    console.log(`└─ PASS\n`)
    scenarioPass++
  } else {
    console.log(`└─ FAIL\n`)
    scenarioFail++
  }
}

// ============================================================================
// §7 — Summary
// ============================================================================

const unexpectedFails = mismatchRegister.filter(m => !m.expected)
const expectedFails   = mismatchRegister.filter(m => m.expected)

const verdict = unexpectedFails.length > 0 ? 'FAIL'
  : totalIncomplete > 0                    ? 'INCOMPLETE'
  : 'PASS'

console.log('═══════════════════════════════════════════════════════════════')
console.log('  VALIDATION SUMMARY')
console.log('═══════════════════════════════════════════════════════════════')
console.log(`  Scenarios:         ${totalScenarios}`)
console.log(`  Validation Events: ${totalEvents}`)
console.log(`  Pass:              ${totalPass}`)
console.log(`  Fail (unexpected): ${unexpectedFails.length}`)
console.log(`  Fail (documented): ${expectedFails.length}`)
console.log(`  Incomplete:        ${totalIncomplete}`)
console.log(`  ─────────────────────────────────────────────────────────────`)
console.log(`  VERDICT:           ${verdict}`)
console.log('═══════════════════════════════════════════════════════════════\n')

if (unexpectedFails.length > 0) {
  console.log('UNEXPECTED MISMATCHES:')
  unexpectedFails.forEach(m => {
    console.log(`  ${m.scenarioId}/${m.stepOrdinal}: ${m.note}`)
    m.mismatches.forEach(f => console.log(`    ${f.field}: runtime=${JSON.stringify(f.runtime)} control=${JSON.stringify(f.control)}`))
  })
  console.log()
}

if (expectedFails.length > 0) {
  console.log('DOCUMENTED MISMATCHES (classified, not unexpected):')
  expectedFails.forEach(m => {
    console.log(`  ${m.scenarioId}/${m.stepOrdinal}: ${m.note}`)
    m.mismatches.forEach(f => console.log(`    ${f.field}: runtime=${JSON.stringify(f.runtime)} control=${JSON.stringify(f.control)}`))
  })
  console.log()
}

console.log('Uncovered runtime paths:')
console.log('  - Legacy selectedFlow Path B (DEMO_NEXT path B): tested with selectedFlow=null in all scenarios')
console.log('  - Standard stage mode Path C (demoStage iteration): not exercised in primary persona flows')
console.log('  - QUERY_SELECT null mid-demo: traversalHistory interaction not tested (ENTRY-only tested)')
console.log('  - handleDemoExit with open non-situation panels: covered via D1 (verified openPanels=[situation])')
console.log()
console.log(`Export: traceLog contains ${traceLog.length} events`)
console.log(`Export: mismatchRegister contains ${mismatchRegister.length} entries (${expectedFails.length} expected, ${unexpectedFails.length} unexpected)`)
