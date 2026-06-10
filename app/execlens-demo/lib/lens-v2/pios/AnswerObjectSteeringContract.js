// AnswerObjectSteeringContract.js
// PiOS Core — Answer Object Steering Contract
//
// Maps any Answer Object instance to a 6-field steering contract.
// LENS consumes the contract. LENS never knows which AO is active.

const DIMMING_STRATEGIES = {
  CONTRAST: 'CONTRAST',
  FOCUS: 'FOCUS',
  CHAIN: 'CHAIN',
  NONE: 'NONE',
}

function emptyContract() {
  return {
    topology: { primary_nodes: [], primary_roles: {}, primary_color_key: {}, secondary_nodes: [], dim_all_others: false },
    dimming: { strategy: 'NONE' },
    zones: { always_expanded: ['semanticTopology', 'topologySurface'], investigation_relevant: [], collapse_others: false },
    evidence: { signal_filter: null, signal_focus_domain: null, condition_filter: null, partition_mode: null },
    guide: { headline: '', proof_steps: [], inline_content: null, primary_metric: null },
    continuations: { next_ao_types: [], next_questions: [], persona_hints: {} },
  }
}

function deriveSteeringContract(investigation, crossDomainCognition) {
  if (!investigation || !investigation.proofSteps) return null

  const ao = resolveAnswerObject(investigation, crossDomainCognition)
  if (!ao) return null

  const contract = emptyContract()
  contract.guide.headline = investigation.question || ''
  contract.guide.proof_steps = investigation.proofSteps || []

  fillTopology(contract, ao, crossDomainCognition)
  fillDimming(contract, ao)
  fillZones(contract, ao)
  fillEvidence(contract, ao)
  fillGuide(contract, ao, investigation)
  fillContinuations(contract, ao)

  return contract
}

function resolveAnswerObject(investigation, cdc) {
  const finding = investigation.finding || ''
  const surface = investigation.surface || ''
  const domConc = (cdc && cdc.domain_concentration) || []
  const execCenter = cdc && cdc.execution_center
  const structCenter = domConc.length > 0 ? domConc[0].domain : null

  if (structCenter && execCenter && structCenter.toLowerCase() !== execCenter.toLowerCase()) {
    return {
      ao_type: 'DIVERGENCE_PAIR',
      domain_a: { domain: structCenter, gravity_type: 'STRUCTURAL' },
      domain_b: { domain: execCenter, gravity_type: 'OPERATIONAL' },
    }
  }

  if (surface === 'EXECUTION_BLINDNESS' || finding.includes('blindness')) {
    return { ao_type: 'FAILURE_IMPACT_MAP', focus_domain: execCenter || structCenter }
  }

  if (structCenter) {
    return { ao_type: 'CONVERGENCE_FOCUS', focus_domain: structCenter }
  }

  return null
}

function fillTopology(contract, ao, cdc) {
  const domConc = (cdc && cdc.domain_concentration) || []
  const allDomains = domConc.map(d => d.domain)

  if (ao.ao_type === 'DIVERGENCE_PAIR') {
    const a = ao.domain_a.domain
    const b = ao.domain_b.domain
    contract.topology.primary_nodes = [a, b]
    contract.topology.primary_roles = { [a]: 'structural-center', [b]: 'execution-center' }
    contract.topology.primary_color_key = { [a]: 'structural', [b]: 'operational' }
    contract.topology.dim_all_others = true
    return
  }

  if (ao.ao_type === 'FAILURE_IMPACT_MAP' && ao.focus_domain) {
    contract.topology.primary_nodes = [ao.focus_domain]
    contract.topology.primary_roles = { [ao.focus_domain]: 'spof' }
    contract.topology.primary_color_key = { [ao.focus_domain]: 'critical' }
    contract.topology.dim_all_others = true
    return
  }

  if (ao.ao_type === 'CONVERGENCE_FOCUS' && ao.focus_domain) {
    contract.topology.primary_nodes = [ao.focus_domain]
    contract.topology.primary_roles = { [ao.focus_domain]: 'convergence-target' }
    contract.topology.primary_color_key = { [ao.focus_domain]: 'warning' }
    contract.topology.dim_all_others = true
    return
  }
}

function fillDimming(contract, ao) {
  if (ao.ao_type === 'DIVERGENCE_PAIR') {
    contract.dimming.strategy = DIMMING_STRATEGIES.CONTRAST
  } else if (ao.ao_type === 'FAILURE_IMPACT_MAP') {
    contract.dimming.strategy = DIMMING_STRATEGIES.CHAIN
  } else if (ao.ao_type === 'CONVERGENCE_FOCUS') {
    contract.dimming.strategy = DIMMING_STRATEGIES.FOCUS
  } else {
    contract.dimming.strategy = DIMMING_STRATEGIES.NONE
  }
}

function fillZones(contract, ao) {
  contract.zones.collapse_others = true

  if (ao.ao_type === 'DIVERGENCE_PAIR') {
    contract.zones.investigation_relevant = ['propagationFlow']
  } else if (ao.ao_type === 'FAILURE_IMPACT_MAP') {
    contract.zones.investigation_relevant = ['runtimeConnectivity', 'signalAssessment', 'propagationFlow']
  } else if (ao.ao_type === 'CONVERGENCE_FOCUS') {
    contract.zones.investigation_relevant = ['clusterConcentration', 'structuralCentrality']
  }
}

function fillEvidence(contract, ao) {
  if (ao.ao_type === 'DIVERGENCE_PAIR') {
    contract.evidence.signal_filter = 'RSIG'
    contract.evidence.signal_focus_domain = ao.domain_b.domain
    contract.evidence.partition_mode = 'EVIDENCE_FAMILY'
  } else if (ao.ao_type === 'FAILURE_IMPACT_MAP') {
    contract.evidence.signal_filter = 'RSIG'
    contract.evidence.signal_focus_domain = ao.focus_domain
    contract.evidence.partition_mode = 'DOMAIN'
  }
}

function fillGuide(contract, ao, investigation) {
  if (ao.ao_type === 'DIVERGENCE_PAIR') {
    contract.guide.primary_metric = `${ao.domain_a.domain} (structural) vs ${ao.domain_b.domain} (operational)`
  } else if (ao.ao_type === 'FAILURE_IMPACT_MAP') {
    contract.guide.primary_metric = `${ao.focus_domain} — concentrated dependency`
  }
}

function fillContinuations(contract, ao) {
  if (ao.ao_type === 'DIVERGENCE_PAIR') {
    contract.continuations.next_ao_types = ['COMPOUNDING_VERDICT', 'FALSIFICATION_STATEMENT']
    contract.continuations.next_questions = [
      'Does this compound with Execution Blindness?',
      'What evidence would show convergence?',
      'Which decisions target the wrong region?',
    ]
    contract.continuations.persona_hints = {
      'Does this compound with Execution Blindness?': 'EXECUTIVE_DENSE',
      'What evidence would show convergence?': 'OPERATOR_DENSE',
      'Which decisions target the wrong region?': 'EXECUTIVE_BALANCED',
    }
  } else if (ao.ao_type === 'FAILURE_IMPACT_MAP') {
    contract.continuations.next_ao_types = ['BLAST_RADIUS', 'FALSIFICATION_STATEMENT']
    contract.continuations.next_questions = [
      'What is the blast radius?',
      'Is there redundancy?',
    ]
  }
}

// ─── Contract → Topology Overlay Adapter ────────────────────────
// Translates steering contract into cognitionOverlay shape that TopologyGraph already consumes.

const COLOR_MAP = {
  structural: '#4a9eff',
  operational: '#ff9e4a',
  critical: '#ff6b6b',
  warning: '#ffd700',
}

const OVERLAY_MODES = {
  CONTRAST: 'DIVERGENCE_CONTRAST',
  FOCUS: 'CONVERGENCE_FOCUS',
  CHAIN: 'FAILURE_CHAIN',
  NONE: null,
}

function contractToTopologyOverlay(contract, allDomainIds) {
  if (!contract || contract.dimming.strategy === 'NONE') return null

  const primarySet = new Set(contract.topology.primary_nodes)
  const secondarySet = new Set(contract.topology.secondary_nodes || [])

  const emphasis = []
  const dim = []

  for (const id of (allDomainIds || [])) {
    if (primarySet.has(id)) emphasis.push(id)
    else if (secondarySet.has(id)) { /* normal opacity */ }
    else if (contract.topology.dim_all_others) dim.push(id)
  }

  return {
    overlay_mode: OVERLAY_MODES[contract.dimming.strategy] || 'DIVERGENCE_CONTRAST',
    emphasis_domains: emphasis,
    dim_domains: dim,
    signal_overlays: [],
    pressure_zone_emphasis: null,
    corridor_paths: [],
    advisory_zones: [],
    grounding_gradient: null,
    evidence_gaps: [],
    topology_label: contract.guide.primary_metric || 'Investigation active',
    legend_entries: contract.topology.primary_nodes.map(d => ({
      domain: d,
      role: contract.topology.primary_roles[d] || 'primary',
      color: COLOR_MAP[contract.topology.primary_color_key[d]] || '#4a9eff',
    })),
    _steering_contract: true,
    _primary_roles: contract.topology.primary_roles,
    _primary_colors: Object.fromEntries(
      contract.topology.primary_nodes.map(d => [d, COLOR_MAP[contract.topology.primary_color_key[d]] || '#4a9eff'])
    ),
    _zone_collapse: contract.zones.collapse_others ? {
      always_expanded: new Set(contract.zones.always_expanded),
      investigation_relevant: new Set(contract.zones.investigation_relevant),
    } : null,
  }
}

module.exports = {
  deriveSteeringContract,
  contractToTopologyOverlay,
  emptyContract,
  DIMMING_STRATEGIES,
}
