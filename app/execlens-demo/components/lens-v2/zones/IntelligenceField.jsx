import { useState, useCallback, useEffect, useRef, useMemo, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { PRESSURE_META, ROLE_META, DEFAULT_BINDING_CLIENT, DEFAULT_BINDING_RUN } from './constants'
import InvestigationReadingGuide, { TermHint } from './InvestigationReadingGuide'
import { TopologyGraph, StructuralSpinesPanel } from './StructuralTopologyZone'
import { buildTrailHTML } from '../../../lib/lens-v2/InterrogationTrailBuilder'
import { SoftwareIntelligenceDenseView, SoftwareIntelligenceInvestigationView, SoftwareIntelligenceBoardroomSummary, SoftwareIntelligenceBalancedNarrative } from './SoftwareIntelligenceField'
import OrchestrationGuidanceRuntime from './OrchestrationGuidanceRuntime'
import { deriveTopologyCognitionState, derivePressureZoneCognitionState, deriveConditionCognitionState, translateSignal, SURFACE_CONDITION_MAP } from '../../../lib/lens-v2/SoftwareIntelligenceProjectionAdapter'
import { synthesize, synthesizeTeaser, SEVERITY_RANK, translateCentralityNode, STRUCTURAL_ROLE_LABELS } from '../../../lib/lens-v2/SignalSynthesisEngine'

const SEMANTIC_ACTORS = {
  decisionPosture:       { id: 'A', code: 'DP', name: 'Decision Posture' },
  confidenceBoundary:    { id: 'B', code: 'CB', name: 'Confidence Boundary' },
  pressureAnchor:        { id: 'C', code: 'PA', name: 'Pressure Anchor' },
  propagationPath:       { id: 'D', code: 'PP', name: 'Propagation Path' },
  absorptionLoad:        { id: 'E', code: 'AL', name: 'Absorption Load' },
  receiverExposure:      { id: 'F', code: 'RE', name: 'Receiver Exposure' },
  semanticTopology:      { id: 'G', code: 'ST', name: 'Semantic Topology' },
  structuralBacking:     { id: 'H', code: 'SB', name: 'Structural Backing' },
  semanticOnlyExposure:  { id: 'I', code: 'SO', name: 'Semantic-Only Exposure' },
  clusterConcentration:  { id: 'J', code: 'CC', name: 'Cluster Concentration' },
  signalStack:           { id: 'K', code: 'SS', name: 'Signal Stack' },
  evidenceTrace:         { id: 'L', code: 'ET', name: 'Evidence Trace' },
  resolutionBoundary:    { id: 'M', code: 'RB', name: 'Resolution Boundary' },
  inferenceProhibition:  { id: 'N', code: 'IP', name: 'Inference Prohibition' },
  reportArtifactAccess:  { id: 'O', code: 'RA', name: 'Report Artifact Access' },
}

const LENS_MODE_SEMANTICS = {
  EXECUTIVE_BALANCED: ['decisionPosture', 'confidenceBoundary', 'resolutionBoundary', 'pressureAnchor', 'reportArtifactAccess'],
  EXECUTIVE_DENSE:    ['semanticTopology', 'structuralBacking', 'semanticOnlyExposure', 'clusterConcentration', 'absorptionLoad', 'pressureAnchor'],
  INVESTIGATION_DENSE:['evidenceTrace', 'signalStack', 'inferenceProhibition', 'confidenceBoundary', 'resolutionBoundary'],
  BOARDROOM:          ['decisionPosture', 'confidenceBoundary', 'pressureAnchor', 'reportArtifactAccess'],
}

const DENSE_ZONE_REGISTRY = {
  semanticTopology:    { key: 'semanticTopology',    code: 'ST', label: 'Semantic Topology' },
  clusterConcentration:{ key: 'clusterConcentration', code: 'CC', label: 'Cluster Concentration' },
  absorptionLoad:      { key: 'absorptionLoad',       code: 'AL', label: 'Absorption Load' },
  signalAssessment:    { key: 'signalAssessment',      code: 'SC', label: 'Structural Signal Cognition' },
  propagationFlow:     { key: 'propagationFlow',       code: 'PF', label: 'Propagation Flow' },
  pressureZoneFocus:   { key: 'pressureZoneFocus',     code: 'PZ', label: 'Pressure Zone Focus' },
  governanceLifecycle: { key: 'governanceLifecycle',   code: 'GL', label: 'Governance Lifecycle' },
}

const REP_TIER_COLOR = {
  HIGH:     '#ff6b6b',
  ELEVATED: '#ff9e4a',
  MODERATE: '#ffd700',
  LOW:      '#64ffda',
}

const INTERP_MODE_FRAMING = {
  EXECUTIVE_BALANCED:  { label: 'EXECUTIVE INTERPRETATION', tone: 'posture',    assessmentLabel: 'Assessment',          whyLabel: 'Why this matters',         structuralLabel: 'Structural context' },
  EXECUTIVE_DENSE:     { label: 'STRUCTURAL INTERPRETATION', tone: 'structural', assessmentLabel: 'Structural reading',  whyLabel: 'Cause and propagation',    structuralLabel: 'Structural context' },
  INVESTIGATION_DENSE: { label: 'FORENSIC INTERPRETATION',   tone: 'forensic',   assessmentLabel: 'Evidence reading',    whyLabel: 'What the evidence shows',  structuralLabel: 'Structural lineage' },
  BOARDROOM:           { label: 'EXECUTIVE BRIEFING',         tone: 'projection', assessmentLabel: 'Assessment',          whyLabel: 'Why this matters',         structuralLabel: '' },
}

function findByRole(blocks, role) {
  if (!blocks) return null
  return blocks.find(b => b && b.propagation_role === role) || null
}

function buildReportPackRegistry(client, run) {
  return [
    {
      id: 'decision-surface',
      name: 'Decision Surface',
      tier: 'DECISION',
      file: 'lens_decision_surface.html',
      binding_path: `/api/report-pack?artifact=decision-surface&client=${client}&run=${run}`,
    },
    {
      id: 'tier1-narrative',
      name: 'Tier-1 Narrative Brief',
      tier: 'TIER-1',
      file: 'lens_tier1_narrative_brief.html',
      binding_path: `/api/report-pack?artifact=tier1-narrative&client=${client}&run=${run}`,
    },
    {
      id: 'tier1-evidence',
      name: 'Tier-1 Evidence Brief',
      tier: 'TIER-1',
      file: 'lens_tier1_evidence_brief.html',
      binding_path: `/api/report-pack?artifact=tier1-evidence&client=${client}&run=${run}`,
    },
    {
      id: 'tier2-diagnostic',
      name: 'Tier-2 Diagnostic Narrative',
      tier: 'TIER-2',
      file: 'lens_tier2_diagnostic_narrative.html',
      binding_path: `/api/report-pack?artifact=tier2-diagnostic&client=${client}&run=${run}`,
    },
  ]
}

function ReportPackBand() {
  return null
}

function RepEvidenceState({ adapted, scope, compact }) {
  const badge = (adapted && adapted.readinessBadge) || {}
  const chip = (adapted && adapted.qualifierChip) || {}
  return (
    <div className={`rep-evstate${compact ? ' rep-evstate--compact' : ''}`}>
      <div className="rep-evstate-label">EVIDENCE STATE</div>
      <div className="rep-evstate-readiness">{badge.state_label || '—'}</div>
      <div className="rep-evstate-coverage">
        {(scope && scope.grounding_label) || 'Partial Coverage'}
        <span className="rep-evstate-coverage-meta">
          {' · '}{(scope && scope.domain_label) || `${(scope && scope.domain_count) || 3} domains`} · {(scope && scope.cluster_count) || 47} clusters
        </span>
      </div>
      {chip.renders && (
        <div className="rep-evstate-qualifier">
          <span className="rep-evstate-qualifier-class">{chip.class_label || chip.qualifier_class || '—'}</span>
          <span className="rep-evstate-qualifier-note">qualifier in effect</span>
        </div>
      )}
    </div>
  )
}

function RepModeTag({ label, sub, zones }) {
  return (
    <div className="rep-mode-tag" role="presentation">
      <span className="rep-mode-tag-label">{label}</span>
      <span className="rep-mode-tag-sub">{sub}</span>
      {zones && zones.length > 0 && (
        <div className="rep-mode-tag-zones" aria-label="Active semantic zones">
          {zones.map(z => (
            <span key={z.id} className="rep-zone-chip" title={`Semantic zone: ${z.name}`}>
              <span className="rep-zone-chip-id">{z.id}</span>
              <span className="rep-zone-chip-name">{z.name}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

const TONE_PALETTE = {
  operational:   { glyph: '◇' },
  forensic:      { glyph: '↓' },
  executive:     { glyph: '■' },
  architectural: { glyph: '△' },
  quiet:         { glyph: '○' },
  alarming:      { glyph: '◆' },
  reflective:    { glyph: '◎' },
  containment:   { glyph: '◈' },
}

const STRUCTURAL_ESCALATION_CONDITIONS = {
  boardroom: (fullReport) => {
    const rs = (fullReport && fullReport.readiness_summary) || {}
    const sigs = (fullReport && fullReport.signal_interpretations) || []
    const critical = sigs.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
    return rs.posture === 'INVESTIGATE' || rs.posture === 'ESCALATE' || critical.length >= 2
  },
  balanced: (fullReport) => {
    const ts = (fullReport && fullReport.topology_summary) || {}
    const backed = ts.structurally_backed_count || 0
    const total = ts.semantic_domain_count || 0
    const advisoryRatio = total > 0 ? (total - backed) / total : 0
    const sigs = (fullReport && fullReport.signal_interpretations) || []
    const activated = sigs.filter(s => s.severity !== 'NOMINAL')
    return advisoryRatio > 0.3 && activated.length >= 2
  },
  dense: (fullReport, activeZoneKey) => {
    if (!activeZoneKey) return false
    const ts = (fullReport && fullReport.topology_summary) || {}
    return (ts.structurally_backed_count || 0) < (ts.semantic_domain_count || 0)
  },
  investigation: (fullReport) => {
    const blocks = (fullReport && fullReport.evidence_blocks) || []
    return blocks.some(b => b && (!b.structural_backing || b.structural_backing === 'SEMANTIC_ONLY'))
  },
}

const EXPANSION_TYPE_LABELS = {
  structural_expansion: 'STRUCTURAL EXPANSION',
  continuity_probe: 'CONTINUITY PROBE',
  traversal: 'TRAVERSAL',
  resolution: 'RESOLUTION',
  escalation: 'ESCALATION',
}

const DENSE_ZONE_PATHS = {
  semanticTopology: [
    { label: 'Open topology explorer', icon: '◇', tone: 'operational', archetype: 'SCAN', depth: 'standard',
      narrative: 'Shows how semantic domains map to structural backing across the full topology.',
      answers: 'Which domains have structural reality versus semantic assertion?',
      boundary: 'Derived from reconciliation correspondence — no inference applied.' },
    { label: 'Descend into forensic lineage', icon: '↓', tone: 'forensic', archetype: 'TRACE', depth: 'standard',
      narrative: 'Opens the full evidence chain for each domain, including source traceability and reconciliation status.',
      answers: 'What evidence exists for each structural claim?',
      boundary: 'Requires INVESTIGATION mode — full forensic depth.' },
    { label: 'Semantic continuity domains', icon: '○', tone: 'quiet', archetype: 'SCAN', depth: 'micro',
      narrative: 'Identifies domains that operate on semantic assertion alone without structural correspondence.',
      answers: 'Which domains operate primarily on semantic continuity?',
      boundary: 'Domain classification from semantic_domain_registry — deterministic.' },
    { label: 'Structural asymmetry map', icon: '△', tone: 'architectural', archetype: 'INTERPRET', depth: 'standard',
      narrative: 'Reveals how structural reality distributes unevenly across the topology — where evidence concentrates and where it thins.',
      answers: 'Where is structural reality most asymmetrically distributed?',
      boundary: 'Distribution from cluster and domain registries — no inference.' },
    { label: 'Executive confidence anchors', icon: '■', tone: 'executive', archetype: 'INTERPRET', depth: 'standard',
      narrative: 'Surfaces the grounded domains that provide the structural foundation for executive decision certainty.',
      answers: 'Which grounded domains anchor executive confidence?',
      boundary: 'Grounding from reconciliation correspondence — deterministic.' },
    { label: 'Ungrounded semantic claims', icon: '◆', tone: 'alarming', archetype: 'BOUNDARY', depth: 'deep',
      narrative: 'Exposes semantic claims with no structural correspondence — assertions that carry advisory weight without evidence confirmation.',
      answers: 'Which semantic claims have no structural correspondence?',
      boundary: 'Reconciliation status from per-domain reconciliation — deterministic.' },
  ],
  clusterConcentration: [
    { label: 'Inspect cluster distribution', icon: '◇', tone: 'operational', archetype: 'SCAN', depth: 'standard',
      narrative: 'Reveals how structural mass is distributed across domain clusters and where concentration creates dependency.',
      answers: 'Where is structural mass concentrated and what does that imply?',
      boundary: 'Cluster topology derived from evidence blocks — deterministic.' },
    { label: 'View structural mass breakdown', icon: '↓', tone: 'forensic', archetype: 'TRACE', depth: 'standard',
      narrative: 'Decomposes cluster-level structural weight to show which groups carry disproportionate organizational load.',
      answers: 'Which clusters carry the most structural weight?',
      boundary: 'Mass calculation based on evidence block count per cluster.' },
    { label: 'Concentration dependency', icon: '△', tone: 'architectural', archetype: 'INTERPRET', depth: 'standard',
      narrative: 'Explains what structural dependency is created when mass concentrates in few clusters.',
      answers: 'What structural dependency does concentration create?',
      boundary: 'Concentration from cluster domain counts — deterministic.' },
    { label: 'Thin clusters', icon: '○', tone: 'quiet', archetype: 'SCAN', depth: 'micro',
      narrative: 'Identifies clusters with minimal structural mass — areas of low evidence density.',
      answers: 'Which clusters remain structurally thin?',
      boundary: 'Cluster sizing from semantic_cluster_registry — deterministic.' },
    { label: 'Fragility assessment', icon: '■', tone: 'executive', archetype: 'ESCALATION', depth: 'deep',
      narrative: 'Assesses whether the current cluster distribution indicates structural fragility or resilience.',
      answers: 'Does cluster distribution indicate organizational fragility?',
      boundary: 'Fragility derived from concentration ratios — deterministic.' },
    { label: 'Topology shape analysis', icon: '◎', tone: 'reflective', archetype: 'INTERPRET', depth: 'standard',
      narrative: 'Characterizes the overall topology shape — star, mesh, or chain — based on edge distribution and hub connectivity.',
      answers: 'What topology shape sustains the current mass distribution?',
      boundary: 'Shape from topology edges and domain connectivity — deterministic.' },
  ],
  absorptionLoad: [
    { label: 'Trace absorption source', icon: '◇', tone: 'operational', archetype: 'TRACE', depth: 'standard',
      narrative: 'Maps the upstream propagation path to show where absorbed load originates and how it reaches the conducting layer.',
      answers: 'Where does the absorbed pressure come from?',
      boundary: 'Propagation roles derived from evidence block classification.' },
    { label: 'Open propagation map', icon: '↓', tone: 'forensic', archetype: 'TRACE', depth: 'standard',
      narrative: 'Displays the full origin → pass-through → receiver chain with structural backing status at each node.',
      answers: 'How does pressure propagate through the organizational structure?',
      boundary: 'Chain structure from propagation summary — no synthetic links.' },
    { label: 'Dissipation resistance', icon: '△', tone: 'architectural', archetype: 'INTERPRET', depth: 'deep',
      narrative: 'Explains why pressure cannot dissipate — what structural conditions make the conducting path non-bypassable.',
      answers: 'What structural condition prevents pressure dissipation?',
      boundary: 'Grounding status of chain nodes — deterministic.' },
    { label: 'Absorption scope', icon: '■', tone: 'executive', archetype: 'INTERPRET', depth: 'standard',
      narrative: 'Determines whether absorbed pressure is contained to specific domains or distributed across the structural topology.',
      answers: 'Is the absorption localized or systemic?',
      boundary: 'Scope from role count and signal distribution — deterministic.' },
    { label: 'Amplification chain', icon: '↓', tone: 'forensic', archetype: 'TRACE', depth: 'standard',
      narrative: 'Traces which dependency chain amplifies the absorption pattern through pressure tier escalation and signal co-presence.',
      answers: 'Which dependency chain amplifies the absorption pattern?',
      boundary: 'Amplification from signal co-presence and pressure tiers — deterministic.' },
    { label: 'Evidence continuity gaps', icon: '◈', tone: 'containment', archetype: 'BOUNDARY', depth: 'standard',
      narrative: 'Identifies where evidence continuity weakens across the propagation corridor — grounding drops that limit confidence.',
      answers: 'Where does evidence continuity weaken across the propagation corridor?',
      boundary: 'Grounding status per chain node from evidence blocks — deterministic.' },
  ],
  signalAssessment: [
    { label: 'Open signal trace', icon: '◇', tone: 'operational', archetype: 'SCAN', depth: 'standard',
      narrative: 'Exposes individual signal activation, severity, and the structural conditions that triggered elevation.',
      answers: 'What specifically triggered each elevated signal?',
      boundary: 'Signals derived from structural assessment — deterministic thresholds.' },
    { label: 'Inspect signal concentration', icon: '↓', tone: 'forensic', archetype: 'TRACE', depth: 'standard',
      narrative: 'Shows how activated signals cluster across domains and whether concentration indicates systemic versus localized conditions.',
      answers: 'Are elevated signals localized or systemically distributed?',
      boundary: 'Concentration analysis from signal domain attribution.' },
    { label: 'Confidence compression', icon: '■', tone: 'executive', archetype: 'INTERPRET', depth: 'deep',
      narrative: 'Explains how the combination of elevated signals compresses executive confidence beyond what any individual signal would produce.',
      answers: 'Which signal combination most compresses confidence?',
      boundary: 'Compression from signal count × readiness band — deterministic.' },
    { label: 'Isolated signals', icon: '○', tone: 'quiet', archetype: 'SCAN', depth: 'micro',
      narrative: 'Identifies signals that remain structurally isolated at nominal severity — conditions not yet coupled to the active pressure field.',
      answers: 'Which signals remain structurally isolated?',
      boundary: 'Isolation from signal severity classification — deterministic.' },
    { label: 'Signal field asymmetry', icon: '△', tone: 'architectural', archetype: 'INTERPRET', depth: 'standard',
      narrative: 'Reveals the dominant asymmetry in the signal field — whether pressure concentrates at one severity tier or distributes evenly.',
      answers: 'What structural asymmetry dominates the signal field?',
      boundary: 'Asymmetry from severity distribution — deterministic.' },
    { label: 'Advisory vs verified signals', icon: '◈', tone: 'containment', archetype: 'BOUNDARY', depth: 'standard',
      narrative: 'Distinguishes which elevated signals have full structural verification versus those operating under advisory-bound confidence.',
      answers: 'Which elevated signals are advisory-bound versus structurally verified?',
      boundary: 'Verification from signal confidence classification — deterministic.' },
  ],
  propagationFlow: [
    { label: 'Open full topology', icon: '◇', tone: 'operational', archetype: 'TRACE', depth: 'standard',
      narrative: 'Displays the complete structural topology with propagation roles, grounding status, and inter-domain dependency.',
      answers: 'What is the full structural dependency picture?',
      boundary: 'Topology from evidence blocks and reconciliation — no inference.' },
    { label: 'Descend to forensic traversal', icon: '↓', tone: 'forensic', archetype: 'TRACE', depth: 'standard',
      narrative: 'Opens forensic-depth analysis of propagation chain nodes with per-domain evidence lineage and temporal continuity.',
      answers: 'What evidence supports each link in the propagation chain?',
      boundary: 'Requires INVESTIGATION mode — full forensic depth.' },
    { label: 'Containment failure', icon: '◆', tone: 'alarming', archetype: 'ESCALATION', depth: 'deep',
      narrative: 'Identifies where propagation containment fails — pressure traverses the full chain into receiving domains.',
      answers: 'Where does propagation containment fail?',
      boundary: 'Containment from chain completeness and receiver grounding — deterministic.' },
    { label: 'Non-bypassable dependency', icon: '△', tone: 'architectural', archetype: 'INTERPRET', depth: 'standard',
      narrative: 'Identifies the structural dependency in the propagation chain that cannot be bypassed or rerouted.',
      answers: 'What structural dependency cannot be bypassed?',
      boundary: 'Dependency from pass-through grounding status — deterministic.' },
    { label: 'Ungrounded receivers', icon: '◈', tone: 'containment', archetype: 'BOUNDARY', depth: 'standard',
      narrative: 'Surfaces receiver domains that inherit propagated pressure without full structural grounding.',
      answers: 'Which receiver domains inherit pressure without structural grounding?',
      boundary: 'Receiver grounding from evidence blocks — deterministic.' },
    { label: 'Evidence uncertainty ranking', icon: '◎', tone: 'reflective', archetype: 'BOUNDARY', depth: 'micro',
      narrative: 'Ranks each role in the propagation chain by evidence uncertainty — which link has the weakest structural backing.',
      answers: 'Which role in the chain carries the highest evidence uncertainty?',
      boundary: 'Uncertainty from grounding status classification — deterministic.' },
  ],
  pressureZoneFocus: [
    { label: 'Open pressure zone topology', icon: '◇', tone: 'operational', archetype: 'SCAN', depth: 'standard',
      narrative: 'Shows how the active pressure zone is structurally connected across origin, pass-through, and receiver domains.',
      answers: 'Is this pressure localized or systemic?',
      boundary: 'Pressure zone from propagation summary — deterministic classification.' },
    { label: 'View qualification blockers', icon: '↓', tone: 'forensic', archetype: 'TRACE', depth: 'standard',
      narrative: 'Exposes unresolved semantic domains and debt items affecting qualification progression toward the next S-state.',
      answers: 'What is preventing qualification advancement?',
      boundary: 'Qualification state from SQO binding — no advisory interpretation.' },
    { label: 'Instability conditions', icon: '◆', tone: 'alarming', archetype: 'ESCALATION', depth: 'deep',
      narrative: 'Assesses proximity to systemic instability based on signal saturation and structural posture.',
      answers: 'What conditions would produce systemic instability?',
      boundary: 'Instability from signal activation ratio and posture — deterministic.' },
    { label: 'Pressure boundary', icon: '◈', tone: 'containment', archetype: 'BOUNDARY', depth: 'standard',
      narrative: 'Maps the structural boundary that currently contains the pressure zone and what domains lie outside it.',
      answers: 'What structural boundary contains the pressure zone?',
      boundary: 'Boundary from propagation chain vs full domain registry — deterministic.' },
    { label: 'Qualification posture', icon: '■', tone: 'executive', archetype: 'INTERPRET', depth: 'standard',
      narrative: 'Surfaces the full qualification posture including qualifier class, readiness band, and executive posture.',
      answers: 'What qualification posture applies to the pressure zone?',
      boundary: 'Posture from qualifier_summary and readiness_summary — deterministic.' },
    { label: 'Domains outside propagation', icon: '○', tone: 'quiet', archetype: 'SCAN', depth: 'micro',
      narrative: 'Lists organizational domains not part of the active propagation path — areas outside current pressure exposure.',
      answers: 'Which organizational domains remain outside the propagation path?',
      boundary: 'Domain subtraction from semantic_domain_registry — deterministic.' },
  ],
  governanceLifecycle: [
    { label: 'Governance lifecycle traversal', icon: '◇', tone: 'operational', archetype: 'SCAN', depth: 'standard',
      narrative: 'Shows the full governance lifecycle: S-level transitions, qualification provenance, and authority ceiling.',
      answers: 'What governance lifecycle did this specimen traverse?',
      boundary: 'Derived from promotion_state.json — deterministic.' },
    { label: 'Governance friction analysis', icon: '△', tone: 'architectural', archetype: 'INTERPRET', depth: 'standard',
      narrative: 'Reveals what was challenged and what survived during operator review — acceptance, rejection, and arbitration.',
      answers: 'What was challenged and what survived?',
      boundary: 'Derived from proposition_review_state and review_obligations — deterministic.' },
    { label: 'Constitutional anchor assessment', icon: '■', tone: 'executive', archetype: 'INTERPRET', depth: 'deep',
      narrative: 'Compares this specimen against the constitutional reference across 8 semantic adequacy dimensions.',
      answers: 'How does this specimen compare to the reference?',
      boundary: 'Derived from constitutional_replay_anchor.json — deterministic.' },
    { label: 'Evidence enrichment impact', icon: '↓', tone: 'forensic', archetype: 'TRACE', depth: 'standard',
      narrative: 'Shows how evidence corrections strengthened the substrate — domain corrections, confidence changes, and debt evolution.',
      answers: 'What evidence corrections strengthened the substrate?',
      boundary: 'Derived from enrichment_summary and debt_reassessment — deterministic.' },
    { label: 'Convergence pattern', icon: '◎', tone: 'containment', archetype: 'BOUNDARY', depth: 'standard',
      narrative: 'Cross-specimen governance patterns: what converges across independent specimens and what diverges.',
      answers: 'What governance patterns generalize across specimens?',
      boundary: 'Derived from convergence_observations — observational, not prescriptive.' },
    { label: 'Certification status', icon: '◆', tone: 'quiet', archetype: 'SCAN', depth: 'micro',
      narrative: 'Full chronicle certification status: phase-by-phase pass/fail across the governed lifecycle.',
      answers: 'What does REPLAY-CERTIFIED prove?',
      boundary: 'Derived from chronicle_certification.json — deterministic.' },
  ],
}

const BALANCED_INTERPRETIVE_NARRATIVES = {
  deriveExecutiveSynthesis: {
    key: 'executiveSynthesis',
    emergenceClass: 'PRIMARY',
    label: 'EXECUTIVE SYNTHESIS',
    emergenceLabel: 'Executive synthesis active',
    nominalLabel: 'Executive synthesis nominal',
    derive: (fullReport) => {
      const rs = (fullReport && fullReport.readiness_summary) || {}
      const ts = (fullReport && fullReport.topology_summary) || {}
      const sigs = (fullReport && fullReport.signal_interpretations) || []
      if (!rs.score && !rs.posture) return { narrative: null, evidenceChain: [], structuralBasis: '', authority: 'INTERPRETIVE', emergenceClass: 'PRIMARY' }
      const backed = ts.structurally_backed_count || 0
      const total = ts.semantic_domain_count || 0
      const semantic = Math.max(0, total - backed)
      const activated = sigs.filter(s => s.severity !== 'NOMINAL')
      const groundingPct = total > 0 ? Math.round(backed / total * 100) : 0
      const posture = (rs.posture || 'INVESTIGATE').toUpperCase()
      let narrative = posture === 'INVESTIGATE'
        ? `Structural evidence is incomplete — the system recommends investigation before executive commitment.`
        : posture === 'PROCEED'
        ? `Structural evidence supports forward movement across grounded domains.`
        : posture === 'ESCALATE'
        ? `Pressure signals exceed operational thresholds — immediate executive attention is structurally warranted.`
        : `Evidence state is indeterminate — structural grounding has not converged to actionable confidence.`
      if (semantic > 0 && activated.length > 0) {
        narrative += ` ${semantic} ungrounded domain${semantic !== 1 ? 's' : ''} and ${activated.length} elevated signal${activated.length !== 1 ? 's' : ''} compress decision certainty.`
      } else if (semantic > 0) {
        narrative += ` ${semantic} of ${total} domains lack structural backing, limiting confidence scope.`
      }
      const evidenceChain = [
        { source: 'readiness_summary', claim: `Score: ${rs.score || '—'} · Band: ${rs.band || '—'} · Posture: ${posture}`, severity: rs.band === 'STRONG' ? 'NOMINAL' : 'ELEVATED' },
        { source: 'topology_summary', claim: `Grounding: ${backed}/${total} (${groundingPct}%) structurally backed`, severity: groundingPct >= 70 ? 'NOMINAL' : 'ELEVATED' },
      ]
      if (activated.length > 0) {
        evidenceChain.push({ source: 'signal_interpretations', claim: `${activated.length} activated signal${activated.length !== 1 ? 's' : ''}`, severity: activated.some(s => s.severity === 'CRITICAL') ? 'CRITICAL' : 'ELEVATED' })
      }
      return { narrative, evidenceChain, structuralBasis: `${posture} posture · ${backed}/${total} grounded · ${activated.length} signal${activated.length !== 1 ? 's' : ''} elevated`, authority: 'INTERPRETIVE', emergenceClass: 'PRIMARY' }
    },
  },
  deriveGroundingIntelligence: {
    key: 'groundingIntelligence',
    emergenceClass: 'SECONDARY',
    label: 'GROUNDING INTELLIGENCE',
    subordinateLabel: 'Grounding posture',
    emergenceLabel: 'Grounding asymmetry detected',
    nominalLabel: 'Grounding distribution nominal',
    derive: (fullReport) => {
      const ts = (fullReport && fullReport.topology_summary) || {}
      const backed = ts.structurally_backed_count || 0
      const total = ts.semantic_domain_count || 0
      const semantic = Math.max(0, total - backed)
      const clusters = ts.cluster_count || 0
      const ratio = total > 0 ? semantic / total : 0
      if (ratio <= 0.3 && backed >= clusters) return { narrative: null, evidenceChain: [], structuralBasis: '', authority: 'INTERPRETIVE', emergenceClass: 'SECONDARY' }
      const narrative = ratio > 0.3
        ? `Most operational domains remain advisory-bound rather than structurally grounded, compressing executive confidence across the topology.`
        : `Structural backing does not uniformly cover all organizational segments — evidence concentration is uneven across ${clusters} clusters.`
      return {
        narrative,
        evidenceChain: [
          { source: 'topology_summary', claim: `${backed}/${total} structurally backed · ${semantic} semantic-only`, severity: ratio > 0.5 ? 'CRITICAL' : 'ELEVATED' },
          { source: 'topology_summary', claim: `${clusters} clusters mapped`, severity: backed < clusters ? 'ELEVATED' : 'NOMINAL' },
        ],
        structuralBasis: `${backed}/${total} grounded · ${semantic} advisory-bound · ${clusters} clusters`,
        authority: 'INTERPRETIVE',
        emergenceClass: 'SECONDARY',
      }
    },
  },
  derivePressureIntelligence: {
    key: 'pressureIntelligence',
    emergenceClass: 'SECONDARY',
    label: 'PRESSURE INTELLIGENCE',
    subordinateLabel: 'Pressure concentration',
    emergenceLabel: 'Pressure concentration detected',
    nominalLabel: 'Pressure field nominal',
    derive: (fullReport) => {
      const sigs = (fullReport && fullReport.signal_interpretations) || []
      const ps = (fullReport && fullReport.propagation_summary) || {}
      const activated = sigs.filter(s => s.severity !== 'NOMINAL')
      const critical = activated.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
      const zoneClass = ps.zone_classification || 'NOMINAL'
      if (activated.length < 2 && critical.length === 0 && zoneClass === 'NOMINAL') return { narrative: null, evidenceChain: [], structuralBasis: '', authority: 'INTERPRETIVE', emergenceClass: 'SECONDARY' }
      const zoneName = ps.primary_zone_business_label || 'the primary zone'
      const narrative = critical.length > 0
        ? `Structural pressure around ${zoneName} exceeds operational thresholds — ${critical.length} signal${critical.length !== 1 ? 's' : ''} at critical severity indicate conditions requiring executive attention.`
        : `Compound signal activation around ${zoneName} indicates systemic structural stress rather than isolated conditions.`
      const evidenceChain = [
        { source: 'signal_interpretations', claim: `${activated.length} activated · ${critical.length} critical/high`, severity: critical.length > 0 ? 'CRITICAL' : 'ELEVATED' },
        { source: 'propagation_summary', claim: `Primary zone: ${zoneName} · Classification: ${zoneClass}`, severity: zoneClass !== 'NOMINAL' ? 'ELEVATED' : 'NOMINAL' },
      ]
      activated.forEach(s => {
        evidenceChain.push({ source: s.signal_name, claim: `${s.severity}`, severity: s.severity })
      })
      return { narrative, evidenceChain, structuralBasis: `${activated.length} elevated signal${activated.length !== 1 ? 's' : ''} · zone: ${zoneName} · ${zoneClass}`, authority: 'INTERPRETIVE', emergenceClass: 'SECONDARY' }
    },
  },
  derivePropagationIntelligence: {
    key: 'propagationIntelligence',
    emergenceClass: 'TERTIARY',
    label: 'PROPAGATION INTELLIGENCE',
    subordinateLabel: 'Propagation pattern',
    emergenceLabel: 'Propagation instability observed',
    nominalLabel: 'Propagation chain nominal',
    derive: (fullReport) => {
      const blocks = (fullReport && fullReport.evidence_blocks) || []
      const roles = {}
      blocks.forEach(b => { if (b && b.propagation_role) roles[b.propagation_role] = (roles[b.propagation_role] || []).concat(b) })
      const roleCount = Object.keys(roles).length
      const hasOrigin = !!roles['ORIGIN']
      const hasPassThrough = !!roles['PASS_THROUGH']
      const hasReceiver = !!roles['RECEIVER']
      if (roleCount < 2 || (!hasOrigin && !hasPassThrough && !hasReceiver)) return { narrative: null, evidenceChain: [], structuralBasis: '', authority: 'INTERPRETIVE', emergenceClass: 'TERTIARY' }
      const originDomains = (roles['ORIGIN'] || []).map(b => b.domain_alias)
      const ptDomains = (roles['PASS_THROUGH'] || []).map(b => b.domain_alias)
      const recvDomains = (roles['RECEIVER'] || []).map(b => b.domain_alias)
      const chainStr = [originDomains, ptDomains, recvDomains].filter(a => a.length).map(a => a.join(', ')).join(' → ')
      const narrative = roleCount >= 3
        ? `Structural conditions propagate across organizational boundaries — the full ${chainStr} chain is active rather than contained.`
        : `Propagation chain partially active across ${roleCount} structural roles, indicating cross-domain dependency.`
      const evidenceChain = blocks.filter(b => b && b.propagation_role).map(b => ({
        source: b.domain_alias,
        claim: `${b.propagation_role} · ${b.structural_backing || 'unknown'} backing`,
        severity: b.propagation_role === 'ORIGIN' ? 'ELEVATED' : 'NOMINAL',
      }))
      return { narrative, evidenceChain, structuralBasis: `${roleCount} roles active · chain: ${chainStr}`, authority: 'INTERPRETIVE', emergenceClass: 'TERTIARY' }
    },
  },
  deriveQualificationIntelligence: {
    key: 'qualificationIntelligence',
    emergenceClass: 'TERTIARY',
    label: 'QUALIFICATION INTELLIGENCE',
    subordinateLabel: 'Qualification compression',
    emergenceLabel: 'Qualification posture degraded',
    nominalLabel: 'Qualification posture stable',
    derive: (fullReport) => {
      const rs = (fullReport && fullReport.readiness_summary) || {}
      const ts = (fullReport && fullReport.topology_summary) || {}
      const backed = ts.structurally_backed_count || 0
      const total = ts.semantic_domain_count || 0
      const semantic = Math.max(0, total - backed)
      const advisoryRatio = total > 0 ? semantic / total : 0
      const band = rs.band || ''
      if (band === 'STRONG' && advisoryRatio <= 0.4) return { narrative: null, evidenceChain: [], structuralBasis: '', authority: 'INTERPRETIVE', emergenceClass: 'TERTIARY' }
      const narrative = advisoryRatio > 0.4
        ? `Confidence compression is active — ${Math.round(advisoryRatio * 100)}% of domains are advisory-bound, limiting decision certainty to structurally grounded areas only.`
        : `Qualification has not reached STRONG band — structural evidence supports operational awareness but not unconditional executive commitment.`
      return {
        narrative,
        evidenceChain: [
          { source: 'readiness_summary', claim: `Band: ${band || '—'}`, severity: band === 'STRONG' ? 'NOMINAL' : 'ELEVATED' },
          { source: 'topology_summary', claim: `Advisory-bound: ${semantic}/${total} (${Math.round(advisoryRatio * 100)}%)`, severity: advisoryRatio > 0.4 ? 'CRITICAL' : 'ELEVATED' },
        ],
        structuralBasis: `${band || '—'} band · ${semantic}/${total} advisory-bound`,
        authority: 'INTERPRETIVE',
        emergenceClass: 'TERTIARY',
      }
    },
  },
  deriveGovernancePosture: {
    key: 'governancePosture',
    emergenceClass: 'SECONDARY',
    label: 'GOVERNANCE POSTURE',
    subordinateLabel: 'Governance lifecycle',
    emergenceLabel: 'Governed lifecycle active',
    nominalLabel: 'Governance posture nominal',
    derive: (fullReport) => {
      const gl = fullReport && fullReport.governance_lifecycle
      const pc = fullReport && fullReport.proposition_corpus
      if (!gl || !gl.available) return { narrative: null, evidenceChain: [], structuralBasis: '', authority: 'INTERPRETIVE', emergenceClass: 'SECONDARY' }
      const provLabel = (gl.qualification_provenance || '').replace(/_/g, ' ')
      const frictionPct = pc && pc.available && pc.governance_friction_rate > 0
        ? `${(pc.governance_friction_rate * 100).toFixed(1)}%`
        : null
      let narrative = `${gl.s_level} qualification achieved via ${provLabel}.`
      if (pc && pc.available && pc.total > 0) {
        narrative += ` ${pc.disposition_counts.accepted} propositions accepted, ${pc.disposition_counts.rejected} rejected, ${pc.disposition_counts.arbitrated} arbitrated`
        if (frictionPct) narrative += ` — ${frictionPct} governance friction rate`
        narrative += '.'
      }
      if (gl.transition_count > 0) {
        narrative += ` ${gl.transition_count} state transitions in the governed lifecycle.`
      }
      const evidenceChain = [
        { source: 'governance_lifecycle', claim: `${gl.s_level} via ${provLabel} · ceiling ${gl.authority_ceiling}`, severity: 'NOMINAL' },
      ]
      if (pc && pc.available) {
        evidenceChain.push({ source: 'proposition_corpus', claim: `${pc.total} propositions · friction: ${frictionPct || '0%'}`, severity: pc.governance_friction_rate > 0.1 ? 'ELEVATED' : 'NOMINAL' })
      }
      return { narrative, evidenceChain, structuralBasis: `${gl.s_level} · ${provLabel} · ${pc ? pc.total : 0} propositions`, authority: 'INTERPRETIVE', emergenceClass: 'SECONDARY' }
    },
  },
  deriveEnrichmentPosture: {
    key: 'enrichmentPosture',
    emergenceClass: 'TERTIARY',
    label: 'ENRICHMENT POSTURE',
    subordinateLabel: 'Substrate correction',
    emergenceLabel: 'Substrate self-correction detected',
    nominalLabel: 'Enrichment posture nominal',
    derive: (fullReport) => {
      const ei = fullReport && fullReport.enrichment_intelligence
      if (!ei || !ei.available || !ei.enrichment_events) return { narrative: null, evidenceChain: [], structuralBasis: '', authority: 'INTERPRETIVE', emergenceClass: 'TERTIARY' }
      let narrative = `The substrate self-corrected through ${ei.enrichment_events} evidence corrections across ${ei.domains_corrected} domains.`
      if (ei.debt && ei.debt.available && ei.debt.total_items > 0) {
        narrative += ` Of ${ei.debt.total_items} debt items: ${ei.debt.improved} improved, ${ei.debt.worsened} worsened, ${ei.debt.unchanged} unchanged.`
      }
      const evidenceChain = [
        { source: 'enrichment_intelligence', claim: `${ei.enrichment_events} corrections · ${ei.domains_corrected} domains`, severity: ei.domains_corrected > 5 ? 'ELEVATED' : 'NOMINAL' },
      ]
      if (ei.debt && ei.debt.available) {
        evidenceChain.push({ source: 'debt_reassessment', claim: `${ei.debt.improved} improved · ${ei.debt.worsened} worsened · ${ei.debt.blockers_resolved} resolved`, severity: ei.debt.worsened > ei.debt.improved ? 'ELEVATED' : 'NOMINAL' })
      }
      return { narrative, evidenceChain, structuralBasis: `${ei.enrichment_events} events · ${ei.domains_corrected} domains · debt: ${ei.debt ? ei.debt.improved : 0} improved`, authority: 'INTERPRETIVE', emergenceClass: 'TERTIARY' }
    },
  },
  deriveConvergencePosture: {
    key: 'convergencePosture',
    emergenceClass: 'TERTIARY',
    label: 'CONVERGENCE POSTURE',
    subordinateLabel: 'Cross-specimen pattern',
    emergenceLabel: 'Cross-specimen convergence observed',
    nominalLabel: 'Convergence data unavailable',
    derive: (fullReport) => {
      const ci = fullReport && fullReport.convergence_intelligence
      if (!ci || !ci.available || !ci.total_observations) return { narrative: null, evidenceChain: [], structuralBasis: '', authority: 'INTERPRETIVE', emergenceClass: 'TERTIARY' }
      let narrative = `${ci.total_observations} cross-specimen observations: ${ci.convergences.length} governance patterns converge, ${ci.divergences.length} diverge.`
      if (ci.convergences.length > ci.divergences.length) {
        narrative += ' Governance patterns generalize across independent specimens.'
      } else if (ci.divergences.length > ci.convergences.length) {
        narrative += ' Specimen-specific divergence exceeds shared pattern — governance generalisation is incomplete.'
      }
      return {
        narrative,
        evidenceChain: [
          { source: 'convergence_intelligence', claim: `${ci.convergences.length} convergences · ${ci.divergences.length} divergences · ${ci.total_observations} total`, severity: ci.divergences.length > ci.convergences.length ? 'ELEVATED' : 'NOMINAL' },
        ],
        structuralBasis: `${ci.total_observations} observations · maturity: ${ci.observation_maturity || 'unknown'}`,
        authority: 'INTERPRETIVE',
        emergenceClass: 'TERTIARY',
      }
    },
  },
}

function SupportRail({ adapted, scope, boardroomMode, reportPackArtifacts, fullReport, qualifierClass, activeZoneKey, densityClass, activeQueryKey, onQuerySelect, exploredQueries, emergenceState, escalationAvailable, piRuntimeActive, onEscalate, onDeescalate, expansions, activeExpansionIndex, onExpansionSelect, interrogationTrail, onTrailExport, selectedNarrativeArc, resolvedCognitionContract, cognitionQueryIndex, onCognitionQuerySelect, activeConditions, resolvedCondition, swIntelActive }) {
  const badge = (adapted && adapted.readinessBadge) || {}
  const chip = (adapted && adapted.qualifierChip) || {}
  const artifacts = (reportPackArtifacts && reportPackArtifacts.length > 0)
    ? reportPackArtifacts
    : buildReportPackRegistry(DEFAULT_BINDING_CLIENT, DEFAULT_BINDING_RUN)

  const ps = (fullReport && fullReport.propagation_summary) || {}
  const ts = (fullReport && fullReport.topology_summary) || {}
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  const pressureZone = ps.primary_zone_business_label || null
  const activatedSignals = sigs.filter(s => s.severity !== 'NOMINAL')
  const semanticOnlyCount = ts.semantic_only_count || Math.max(0, (ts.semantic_domain_count || 0) - (ts.structurally_backed_count || 0))

  const paths = []
  if (boardroomMode) {
    if (pressureZone && activatedSignals.length > 0) {
      paths.push({ label: 'Review pressure concentration', condition: true })
    }
    paths.push({ label: 'Open structural exposure map', condition: true })
    if (semanticOnlyCount > 0) {
      paths.push({ label: `Investigate ${semanticOnlyCount} unresolved domain${semanticOnlyCount !== 1 ? 's' : ''}`, condition: true })
    }
    if (qualifierClass && qualifierClass !== 'Q-01' && qualifierClass !== 'Q-00' && qualifierClass !== 'Q-04') {
      paths.push({ label: 'Inspect evidence boundaries', condition: true })
    }
  }

  const isDense = !boardroomMode && densityClass === 'EXECUTIVE_DENSE'
  const zoneReg = activeZoneKey && DENSE_ZONE_REGISTRY[activeZoneKey]
  const zonePaths = activeZoneKey && DENSE_ZONE_PATHS[activeZoneKey]

  return (
    <aside className="intel-support" aria-label="Support rail — evidence, confidence, report pack">
      <div className="support-block">
        <div className="support-label">EVIDENCE STATE</div>
        <div className="support-readiness">{badge.state_label || '—'}</div>
        <div className="support-coverage">
          {(scope && scope.grounding_label) || 'Partial Coverage'}
        </div>
        <div className="support-coverage-meta">
          {(scope && scope.domain_count) || 3} domains · {(scope && scope.cluster_count) || 47} clusters
        </div>
      </div>

      {chip.renders && (
        <div className="support-block support-block--qualifier">
          <div className="support-label">QUALIFIER</div>
          <div className="support-qualifier-class">{chip.class_label || chip.qualifier_class || '—'}</div>
          <div className="support-qualifier-note">advisory bound</div>
        </div>
      )}

      {swIntelActive && resolvedCondition ? (
        <div className="support-block support-block--conditions support-block--condition-focus">
          <div className="support-label">FOCUSED CONDITION</div>
          <div className="support-condition-focus-title" data-severity={resolvedCondition.severity}>
            {resolvedCondition.operator_cognition_title}
          </div>
          {resolvedCondition.guided_interventions && resolvedCondition.guided_interventions.length > 0 && (
            <>
              <div className="support-label" style={{ marginTop: 10 }}>INTERVENTIONS</div>
              {resolvedCondition.guided_interventions.map(gi => (
                <div key={gi.intervention_id} className="support-condition-intervention" data-type={gi.action_type}>
                  <span className="support-condition-intervention-label">{gi.operator_label}</span>
                  <span className="support-condition-intervention-effect">{gi.panel_mutation}</span>
                </div>
              ))}
            </>
          )}
          {(CONDITION_TO_SURFACES[resolvedCondition.condition_type] || []).length > 0 && (
            <>
              <div className="support-label" style={{ marginTop: 10 }}>LINKED CAPABILITIES</div>
              {(CONDITION_TO_SURFACES[resolvedCondition.condition_type] || []).map(sid => (
                <div key={sid} className="support-condition-surface">{SURFACE_DISPLAY_NAME[sid] || sid}</div>
              ))}
            </>
          )}
        </div>
      ) : swIntelActive && activeConditions && activeConditions.length > 0 ? (
        <div className="support-block support-block--conditions">
          <div className="support-label">ACTIVE CONDITIONS</div>
          {activeConditions.slice(0, 4).map(c => (
            <div key={c.condition_id} className="support-condition-item" data-severity={c.severity}>
              <span className="support-condition-title">{c.operator_cognition_title}</span>
              <span className="support-condition-severity">{c.severity}</span>
              {c.domain_targets && c.domain_targets[0] && (
                <span className="support-condition-domain">{c.domain_targets[0].display_name}</span>
              )}
            </div>
          ))}
          {activeConditions.length > 4 && (
            <div className="support-condition-overflow">+{activeConditions.length - 4} more</div>
          )}
        </div>
      ) : null}

      {densityClass === 'EXECUTIVE_BALANCED' && emergenceState && (
        <div className="support-block support-block--emergence">
          <div className="support-label">INTELLIGENCE STATE</div>
          <div className="emergence-index">
            {Object.values(BALANCED_INTERPRETIVE_NARRATIVES).map(fn => {
              const state = emergenceState[fn.key]
              const active = state && state.narrative !== null
              return (
                <div key={fn.key} className="emergence-indicator" data-active={active} data-tier={fn.emergenceClass}>
                  <span className="emergence-indicator-dot">{active ? '●' : '○'}</span>
                  <span className="emergence-indicator-label">{active ? fn.emergenceLabel : fn.nominalLabel}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {boardroomMode && paths.length > 0 && (
        <div className="support-block support-block--paths">
          <div className="support-label">AVAILABLE PATHS</div>
          <div className="support-paths-list">
            {paths.map((p, i) => (
              <div key={i} className="support-path-item">
                <span className="support-path-marker" />
                <span className="support-path-text">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEGACY-ONLY: S1 support section — governed S2+ runs never match qualification_level === 'S1' */}
      {boardroomMode && fullReport && fullReport.qualification_level === 'S1' && (() => {
        const gn = fullReport.governed_narrative
        const gnAvail = gn && gn.available
        const qc = gnAvail ? (gn.qualification_context || {}) : {}
        const ss = gnAvail ? (gn.structural_summary || {}) : {}
        const tm = fullReport.topology_maturity || {}
        return (
          <>
            <div className="support-block support-block--qualification">
              <div className="support-label">QUALIFICATION</div>
              <div className="support-qualification-state">
                <span className="support-qualification-s">{fullReport.qualification_level}</span>
                <span className="support-qualification-gate">{qc.gate_status === 'OPEN' ? 'Gate Open' : 'Gate Pending'}</span>
              </div>
              <div className="support-qualification-detail">
                Structural topology complete. Semantic qualification not yet established.
              </div>
            </div>

            <div className="support-block support-block--structural-summary">
              <div className="support-label">STRUCTURAL SUBSTRATE</div>
              <div className="support-kv-list">
                <div className="support-kv"><span className="support-kv-key">Clusters</span><span className="support-kv-val">{ss.cluster_count || (fullReport.topology_summary || {}).cluster_count || '—'}</span></div>
                <div className="support-kv"><span className="support-kv-key">Files</span><span className="support-kv-val">{(ss.file_count || 0).toLocaleString()}</span></div>
                <div className="support-kv"><span className="support-kv-key">Import edges</span><span className="support-kv-val">{(ss.import_edges || 0).toLocaleString()}</span></div>
                <div className="support-kv"><span className="support-kv-key">Inheritance</span><span className="support-kv-val">{(ss.inheritance_edges || 0).toLocaleString()}</span></div>
              </div>
              <div className="support-kv-maturity">{tm.label || 'Registry'}</div>
            </div>

            {gnAvail && (
              <div className="support-block support-block--provenance">
                <div className="support-label">COMPOSITION</div>
                <div className="support-kv-list">
                  <div className="support-kv"><span className="support-kv-key">Method</span><span className="support-kv-val">Deterministic</span></div>
                  <div className="support-kv"><span className="support-kv-key">Contract</span><span className="support-kv-val">{(gn.composition_provenance || {}).governance_contract || '75.x'}</span></div>
                  <div className="support-kv"><span className="support-kv-key">Replay</span><span className="support-kv-val">{(gn.composition_provenance || {}).replay_tier || 'EXACT'}</span></div>
                </div>
              </div>
            )}

            {selectedNarrativeArc && (
              <div className="support-block support-block--arc-context">
                <div className="support-label">SELECTED SECTION</div>
                <div className="support-arc-name">{ARC_LABELS[selectedNarrativeArc] || selectedNarrativeArc}</div>
                <div className="support-arc-hint">Evidence context shown in left panel</div>
              </div>
            )}
          </>
        )
      })()}

      {resolvedCognitionContract && resolvedCognitionContract.guidedCognition && resolvedCognitionContract.guidedCognition.length > 0 && (
        <div className="support-block support-block--cognition-queries" data-surface={resolvedCognitionContract.surface.surface_id}>
          <div className="support-zone-header">
            <span className="support-zone-badge">{resolvedCognitionContract.meta.code}</span>
            <span className="support-label">DOMAIN COGNITION</span>
          </div>
          <div className="support-paths-list">
            {resolvedCognitionContract.guidedCognition.map((q, i) => {
              const isActive = cognitionQueryIndex === i
              const tonePalette = q.tone && TONE_PALETTE[q.tone]
              const glyph = tonePalette ? tonePalette.glyph : resolvedCognitionContract.meta.icon
              return (
                <div
                  key={i}
                  className="support-path-item support-path-item--zone"
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  data-tone={q.tone || undefined}
                  data-depth={q.depth || undefined}
                  onClick={() => onCognitionQuerySelect && onCognitionQuerySelect(i)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCognitionQuerySelect && onCognitionQuerySelect(i) } }}
                >
                  <span className="support-path-icon">{glyph}</span>
                  <span className="support-path-text">{q.question}</span>
                </div>
              )
            })}
          </div>

          {resolvedCognitionContract.actions && resolvedCognitionContract.actions.length > 0 && (
            <div className="cognition-actions-summary">
              <div className="support-label" style={{ marginTop: '12px' }}>AVAILABLE ACTIONS</div>
              {resolvedCognitionContract.actions.map((a, i) => (
                <div key={i} className="cognition-action-item" data-priority={a.priority}>
                  <span className="cognition-action-priority">{a.priority}</span>
                  <span className="cognition-action-text">{a.action}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isDense && zonePaths && zoneReg && (
        <div className="support-block support-block--zone-paths" data-zone={activeZoneKey}>
          <div className="support-zone-header">
            <span className="support-zone-badge">{zoneReg.code}</span>
            <span className="support-label">GUIDED QUERIES</span>
          </div>
          <div className="support-paths-list">
            {zonePaths.map((p, i) => {
              const queryKey = `${activeZoneKey}:${i}`
              const isActive = activeQueryKey === queryKey
              const isExplored = exploredQueries && exploredQueries.has(queryKey)
              const tonePalette = p.tone && TONE_PALETTE[p.tone]
              const glyph = tonePalette ? tonePalette.glyph : p.icon
              return (
                <Fragment key={queryKey}>
                  {i === 2 && <div className="zone-paths-separator" />}
                  <div
                    className="support-path-item support-path-item--zone"
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    data-explored={isExplored || undefined}
                    data-tone={p.tone || undefined}
                    data-depth={p.depth || undefined}
                    onClick={() => onQuerySelect && onQuerySelect(activeZoneKey, i)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onQuerySelect && onQuerySelect(activeZoneKey, i) } }}
                  >
                    <span className="support-path-icon">{glyph}</span>
                    <span className="support-path-text">{p.answers || p.label}</span>
                    {p.narrative && !isActive && (
                      <div className="path-narrative-overlay">
                        <div className="path-narrative-text">{p.narrative}</div>
                        <div className="path-narrative-question">
                          <span className="path-narrative-question-label">ANSWERS</span>
                          <span className="path-narrative-question-text">{p.answers}</span>
                        </div>
                        <div className="path-narrative-boundary">{p.boundary}</div>
                      </div>
                    )}
                  </div>
                </Fragment>
              )
            })}
          </div>
        </div>
      )}

      {escalationAvailable && (
        <div className={`support-block support-block--structural-depth${piRuntimeActive ? ' support-block--depth-active' : ''}`}>
          <div className="support-label">STRUCTURAL DEPTH</div>
          {!piRuntimeActive ? (
            <button
              className="structural-depth-indicator"
              onClick={onEscalate}
              type="button"
              aria-label="Engage structural depth escalation"
            >
              <span className="structural-depth-glyph">◉</span>
              <span className="structural-depth-label">STRUCTURAL DEPTH AVAILABLE</span>
            </button>
          ) : (
            <div className="structural-depth-active-state">
              <div className="structural-depth-active-header">
                <span className="structural-depth-glyph structural-depth-glyph--active">◉</span>
                <span className="structural-depth-label">STRUCTURAL EXPANSION ACTIVE</span>
                <button className="structural-depth-dismiss" onClick={onDeescalate} type="button" aria-label="Contract structural depth">✕</button>
              </div>
              {expansions && expansions.length > 0 && (
                <div className="expansion-chips-list">
                  {expansions.map((exp, i) => {
                    const isActive = activeExpansionIndex === i
                    const isExplored = interrogationTrail && interrogationTrail.has(i)
                    const tonePalette = exp.tone && TONE_PALETTE[exp.tone]
                    const glyph = tonePalette ? tonePalette.glyph : '◇'
                    return (
                      <div
                        key={i}
                        className="expansion-chip"
                        role="button"
                        tabIndex={0}
                        aria-pressed={isActive}
                        data-explored={isExplored || undefined}
                        data-tone={exp.tone || undefined}
                        data-depth={exp.depth || undefined}
                        data-expansion-type={exp.expansionType || undefined}
                        onClick={() => onExpansionSelect && onExpansionSelect(i)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onExpansionSelect && onExpansionSelect(i) } }}
                      >
                        <span className="expansion-chip-icon">{glyph}</span>
                        <span className="expansion-chip-text">{exp.question}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {fullReport && (
        <div className="support-block support-block--trail">
          <div className="support-label">EVIDENCE RECORD</div>
          {(exploredQueries.size > 0 || interrogationTrail.size > 0) && (
            <div className="trail-export-summary">
              {exploredQueries.size > 0 && <span className="trail-count">{exploredQueries.size} structural queries reviewed</span>}
              {interrogationTrail.size > 0 && <span className="trail-count">{interrogationTrail.size} depth expansions reviewed</span>}
            </div>
          )}
          <button
            className="trail-export-trigger"
            onClick={onTrailExport}
            type="button"
          >
            GENERATE EVIDENCE RECORD
          </button>
        </div>
      )}

      <div className="support-block support-block--reports">
        <div className="support-label">REPORT PACK</div>
        <div className="support-reports-sub">Official Tier-1 / Tier-2 deliverables</div>
        <div className="support-reports-list">
          {artifacts.map(a => (
            <div
              key={a.id}
              className="support-report-item"
              aria-disabled="true"
              title={`Future binding: ${a.binding_path} · file ${a.file} · pending real client/run integration`}
              data-binding="pending"
            >
              <span className="support-report-tier">{a.tier}</span>
              <span className="support-report-name">{a.name}</span>
            </div>
          ))}
          <div className="support-reports-state" aria-live="polite">
            <span className="support-reports-state-dot" aria-hidden="true" />
            binding pending — live client/run integration not yet active
          </div>
        </div>
      </div>
    </aside>
  )
}

const DENSE_ZONE_INTERPRETATIONS = {
  semanticTopology: {
    sectionLabel: 'TOPOLOGY INTERPRETATION',
    code: 'ST',
    derive: (fullReport) => {
      const ts = (fullReport && fullReport.topology_summary) || {}
      const scope = (fullReport && fullReport.topology_scope) || {}
      const backed = ts.structurally_backed_count || 0
      const total = ts.semantic_domain_count || 0
      const semantic = total - backed
      return {
        heading: 'What the topology reveals',
        body: backed === total
          ? 'All domains are structurally backed. The topology reflects verified organizational reality.'
          : `${semantic} of ${total} domain${semantic !== 1 ? 's' : ''} lack structural backing. These represent semantic claims without evidence confirmation.`,
        structuralNote: total > 0
          ? `Grounding ratio: ${backed}/${total} (${Math.round(backed / Math.max(1, total) * 100)}%) · ${scope.cluster_count || 0} clusters mapped`
          : null,
      }
    },
  },
  clusterConcentration: {
    sectionLabel: 'CLUSTER INTERPRETATION',
    code: 'CC',
    derive: (fullReport) => {
      const scope = (fullReport && fullReport.topology_scope) || {}
      const ts = (fullReport && fullReport.topology_summary) || {}
      const clusters = ts.cluster_count || scope.cluster_count || 0
      const domains = scope.domain_count || ts.semantic_domain_count || 0
      return {
        heading: 'What the cluster distribution reveals',
        body: clusters > 0
          ? `${clusters} clusters distributed across ${domains} domain${domains !== 1 ? 's' : ''}. Structural mass concentration determines organizational dependency exposure.`
          : 'No cluster data available for structural mass analysis.',
        structuralNote: domains > 0
          ? `Average density: ${(clusters / Math.max(1, domains)).toFixed(1)} clusters per domain`
          : null,
      }
    },
  },
  absorptionLoad: {
    sectionLabel: 'ABSORPTION INTERPRETATION',
    code: 'AL',
    derive: (fullReport) => {
      const blocks = (fullReport && fullReport.evidence_blocks) || []
      const passthrough = blocks.find(b => b && b.propagation_role === 'PASS_THROUGH')
      return {
        heading: 'What the absorption pattern reveals',
        body: passthrough
          ? `${passthrough.domain_alias} operates as a conducting layer — absorbing upstream propagated load without generating independent structural evidence.`
          : 'No pass-through node detected in the current propagation chain.',
        structuralNote: passthrough
          ? `Role: ${passthrough.propagation_role} · Pattern: organizational stress migration`
          : null,
      }
    },
  },
  signalAssessment: {
    sectionLabel: 'SIGNAL INTERPRETATION',
    code: 'SA',
    derive: (fullReport) => {
      const sigs = (fullReport && fullReport.signal_interpretations) || []
      const activated = sigs.filter(s => s.severity !== 'NOMINAL')
      const critical = activated.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
      const elevated = activated.filter(s => s.severity === 'ELEVATED')
      return {
        heading: 'What the signal landscape reveals',
        body: activated.length > 0
          ? `${activated.length} signal${activated.length !== 1 ? 's' : ''} elevated above nominal threshold${critical.length > 0 ? ` — ${critical.length} at critical/high severity` : ''}. ${elevated.length > 0 ? `${elevated.length} at elevated tier.` : ''}`
          : `All ${sigs.length} structural indicators are within nominal parameters.`,
        structuralNote: sigs.length > 0
          ? `Total signals: ${sigs.length} · Activated: ${activated.length} · Nominal: ${sigs.length - activated.length}`
          : null,
        signalDetail: activated.map(s => ({
          id: s.signal_id,
          severity: s.severity,
          interpretation: s.interpretation,
          concentration: s.concentration,
        })),
      }
    },
  },
  propagationFlow: {
    sectionLabel: 'PROPAGATION INTERPRETATION',
    code: 'PF',
    derive: (fullReport) => {
      const blocks = (fullReport && fullReport.evidence_blocks) || []
      const ps = (fullReport && fullReport.propagation_summary) || {}
      const sigs = (fullReport && fullReport.signal_interpretations) || []
      const origin = blocks.find(b => b && b.propagation_role === 'ORIGIN')
      const passthrough = blocks.find(b => b && b.propagation_role === 'PASS_THROUGH')
      const receiver = blocks.find(b => b && b.propagation_role === 'RECEIVER')
      const chainRoles = [origin, passthrough, receiver].filter(Boolean)
      const activated = sigs.filter(s => s.severity !== 'NOMINAL')
      const byRole = {}
      for (const node of chainRoles) {
        const roleSigs = activated.filter(s => s.concentration && s.concentration.toLowerCase().includes(node.domain_alias.toLowerCase()))
        if (roleSigs.length > 0) byRole[node.propagation_role] = roleSigs.length
      }
      return {
        heading: 'What the propagation structure reveals',
        body: chainRoles.length >= 2
          ? `Structural dependency flows ${chainRoles.map(n => n.domain_alias).join(' → ')}. This propagation is organizational — pressure transfers through structural coupling, not incidental correlation.`
          : 'Propagation chain not fully resolved in available evidence.',
        structuralNote: ps.primary_zone_business_label
          ? `Primary zone: ${ps.primary_zone_business_label}`
          : null,
        signalByRole: Object.keys(byRole).length > 0 ? byRole : null,
      }
    },
  },
  pressureZoneFocus: {
    sectionLabel: 'PRESSURE ZONE INTERPRETATION',
    code: 'PZ',
    derive: (fullReport) => {
      const ps = (fullReport && fullReport.propagation_summary) || {}
      const sigs = (fullReport && fullReport.signal_interpretations) || []
      const zoneName = ps.primary_zone_business_label
      const activated = sigs.filter(s => s.severity !== 'NOMINAL')
      const compound = sigs[0] && sigs[0].compound_narrative
      const critical = activated.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
      return {
        heading: 'What the pressure concentration reveals',
        body: zoneName
          ? `Pressure concentrates around "${zoneName}" with ${activated.length} elevated signal${activated.length !== 1 ? 's' : ''}. ${compound || 'Structural assessment indicates localized organizational stress.'}`
          : 'No primary pressure zone identified in the current structural assessment.',
        structuralNote: zoneName && activated.length > 0
          ? `Zone: ${zoneName} · Classification: ${ps.zone_classification || 'UNCLASSIFIED'} · Activated: ${activated.length}`
          : null,
        signalSummary: activated.length > 0
          ? { total: activated.length, critical: critical.length, compound: compound || null }
          : null,
      }
    },
  },
  governanceLifecycle: {
    sectionLabel: 'GOVERNANCE INTERPRETATION',
    code: 'GL',
    derive: (fullReport) => {
      const gl = fullReport && fullReport.governance_lifecycle
      const pc = fullReport && fullReport.proposition_corpus
      const rv = fullReport && fullReport.revalidation_intelligence
      const cc = fullReport && fullReport.chronicle_certification
      if (!gl || !gl.available) {
        return {
          heading: 'Governance lifecycle not available',
          body: 'This run does not have governance lifecycle data. Governance intelligence requires a governed lifecycle run.',
          structuralNote: null,
        }
      }
      const frictionRate = pc && pc.available && pc.governance_friction_rate > 0
        ? `${(pc.governance_friction_rate * 100).toFixed(1)}%`
        : '0%'
      return {
        heading: 'What the governed lifecycle reveals',
        body: `${gl.s_level} achieved via ${(gl.qualification_provenance || '').replace(/_/g, ' ')}. `
          + (pc && pc.available ? `${pc.total} propositions evaluated — ${pc.disposition_counts.accepted} accepted, ${pc.disposition_counts.rejected} rejected, ${pc.disposition_counts.arbitrated} arbitrated (${frictionRate} friction). ` : '')
          + (rv && rv.available ? `Deterministic revalidation: ${rv.passed}/${rv.total_checks} PASS. ` : '')
          + (cc && cc.available ? `Chronicle certification: ${cc.passed}/${cc.total_checks} checks across ${cc.phase_count} phases.` : ''),
        structuralNote: `Provenance: ${gl.qualification_provenance || 'unknown'} · Ceiling: ${gl.authority_ceiling || 'unknown'} · Transitions: ${gl.transition_count || 0}`,
      }
    },
  },
}

// ─── SW-INTEL DOMAIN REASONING CONTRACTS ──────────────────────────
// Each cognition surface is a DOMAIN COGNITION STATE, not a content panel.
// When activated, the contract orchestrates: LEFT interpretation, RIGHT queries,
// topology focus, action reprioritization, unrelated cognition suppression.
// All answers are DATA-DERIVED from fullReport, not static strings.

const SW_INTEL_SURFACE_REGISTRY = {
  DELIVERY_FRAGILITY:      { code: 'DF', label: 'Delivery Fragility',          icon: '⧖' },
  COORDINATION_SATURATION: { code: 'CS', label: 'Coordination Saturation',     icon: '⬡' },
  INTEGRATION_EXPOSURE:    { code: 'IE', label: 'Integration Exposure',        icon: '⇌' },
  OPERATIONAL_TOPOLOGY:    { code: 'OT', label: 'Operational Topology Posture', icon: '◉' },
  QUALIFICATION_EXPOSURE:  { code: 'QE', label: 'Qualification Exposure',      icon: '⊘' },
  PROPAGATION_RISK:        { code: 'PR', label: 'Propagation Risk',            icon: '⟿' },
}

function findDomainGrounding(domainName, registry) {
  const reg = (registry || []).find(r => r.domain_name === domainName || r.domain_alias === domainName)
  return reg ? reg.grounding_status || 'unknown' : 'unknown'
}

const SW_INTEL_DOMAIN_REASONING_CONTRACTS = {

  // ── DELIVERY FRAGILITY ─────────────────────────────────────────────
  DELIVERY_FRAGILITY: {
    meta: { code: 'DF', label: 'Delivery Fragility', icon: '⧖' },
    resolve: (fullReport, surface) => {
      const blocks = fullReport.evidence_blocks || []
      const sigs = (fullReport.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
      const origins = blocks.filter(b => b.propagation_role === 'ORIGIN')
      const passThroughs = blocks.filter(b => b.propagation_role === 'PASS_THROUGH')
      const receivers = blocks.filter(b => b.propagation_role === 'RECEIVER')
      const highSigs = sigs.filter(s => s.severity === 'HIGH' || s.severity === 'ELEVATED')
      const pz = fullReport.pressure_zone_state
      const registry = fullReport.semantic_domain_registry || []
      const originNames = surface.affected_domains || []

      return {
        interpretation: {
          heading: 'Delivery Fragility — Active Cognition State',
          operationalMeaning: originNames.length > 0
            ? passThroughs.length > 0
              ? `${originNames.length} domain${originNames.length !== 1 ? 's' : ''} generate structural pressure that flows through ${passThroughs.length} corridor${passThroughs.length !== 1 ? 's' : ''} to ${receivers.length} downstream receiver${receivers.length !== 1 ? 's' : ''}. Changes touching ${originNames.join(', ')} propagate risk — deployment decisions require structural awareness.`
              : `${originNames.length} domain${originNames.length !== 1 ? 's' : ''} originate structural pressure that reaches ${receivers.length} downstream receiver${receivers.length !== 1 ? 's' : ''} directly. Changes touching ${originNames.join(', ')} propagate risk — deployment decisions require structural awareness.`
            : `${highSigs.length} elevated signal${highSigs.length !== 1 ? 's' : ''} indicate structural stress on delivery infrastructure.`,
          structuralEvidence: [
            ...origins.map(b => ({ label: b.domain_alias, value: `ORIGIN · ${b.grounding_status}`, severity: 'critical' })),
            ...highSigs.slice(0, 4).map(s => ({ label: s.signal_name || s.signal_id, value: `${s.severity}${s.concentration ? ' · ' + s.concentration : ''}`, severity: s.severity === 'HIGH' ? 'critical' : 'elevated' })),
          ],
          suppressionMask: ['OPERATIONAL_TOPOLOGY', 'QUALIFICATION_EXPOSURE'],
        },

        implications: {
          orchestration: [
            { action: 'Review origin domain changes before merge', priority: 'HIGH' },
            { action: 'Assess propagation chain before deployment', priority: 'HIGH' },
            ...(surface.severity === 'HIGH' ? [{ action: 'Structural awareness mandatory for delivery decisions', priority: 'CRITICAL' }] : []),
          ],
          qualification: {
            effect: originNames.some(d => findDomainGrounding(d, registry) === 'semantic_only')
              ? 'Pressure origins include ungrounded domains — qualification confidence reduced'
              : 'Pressure origins are structurally grounded — assessment stable',
          },
        },

        guidedCognition: [
          ...originNames.slice(0, 2).map(domain => ({
            question: `Why does "${domain}" originate delivery pressure?`,
            tone: 'forensic', archetype: 'TRACE', depth: 'standard',
            boundary: 'From evidence_blocks + signal cross-reference — deterministic.',
            answer_derive: (fr) => {
              const dBlocks = (fr.evidence_blocks || []).filter(b => b.domain_alias === domain)
              const dSigs = (fr.signal_interpretations || []).filter(s => s.concentration && s.concentration.toLowerCase().includes(domain.toLowerCase()))
              return {
                summary: dBlocks.length > 0
                  ? `"${domain}" carries ${dBlocks[0].propagation_role} role with ${dBlocks[0].grounding_status} grounding. ${dSigs.length} co-located signal${dSigs.length !== 1 ? 's' : ''} amplify structural pressure at this origin.`
                  : `"${domain}" identified as pressure origin with ${dSigs.length} associated signal${dSigs.length !== 1 ? 's' : ''}.`,
                evidence: [...dBlocks.map(b => ({ label: b.domain_alias, value: `${b.propagation_role} · ${b.grounding_status}`, severity: 'critical' })), ...dSigs.map(s => ({ label: s.signal_name || s.signal_id, value: s.severity, severity: s.severity === 'HIGH' ? 'critical' : 'elevated' }))],
                structuralContext: `Evidence from ${(surface.trace_sources || []).join(', ')}`,
              }
            },
          })),
          {
            question: 'How does pressure propagate from delivery origins?',
            tone: 'architectural', archetype: 'TRACE', depth: 'standard',
            boundary: 'From evidence_blocks propagation roles — deterministic.',
            answer_derive: (fr) => {
              const b = fr.evidence_blocks || []
              const chain = [...b.filter(x => x.propagation_role === 'ORIGIN').map(x => `${x.domain_alias} (ORIGIN)`), ...b.filter(x => x.propagation_role === 'PASS_THROUGH').map(x => `${x.domain_alias} (CORRIDOR)`), ...b.filter(x => x.propagation_role === 'RECEIVER').map(x => `${x.domain_alias} (RECEIVER)`)]
              return {
                summary: chain.length > 0 ? (() => { const ptCount = b.filter(x => x.propagation_role === 'PASS_THROUGH').length; return `Pressure flows: ${chain.join(' → ')}.${ptCount > 0 ? ` ${ptCount} corridor${ptCount !== 1 ? 's' : ''} conduct pressure from origins to receivers.` : ' Direct propagation — no intermediate corridors.'}`; })() : 'No complete propagation chain in current evidence.',
                evidence: b.map(x => ({ label: x.domain_alias, value: x.propagation_role, severity: x.propagation_role === 'ORIGIN' ? 'critical' : x.propagation_role === 'PASS_THROUGH' ? 'elevated' : 'nominal' })),
                structuralContext: 'Propagation roles derive from evidence block analysis — origin, pass-through, and receiver classifications.',
              }
            },
          },
          {
            question: 'What is the deployment blast radius of changes here?',
            tone: 'alarming', archetype: 'ESCALATION', depth: 'deep',
            boundary: 'From domain connectivity + signal concentration — deterministic.',
            answer_derive: (fr) => {
              const b = fr.evidence_blocks || []
              const rcvrs = b.filter(x => x.propagation_role === 'RECEIVER')
              const allDomains = new Set(b.map(x => x.domain_alias))
              return {
                summary: `Changes at delivery origins can affect ${allDomains.size} domain${allDomains.size !== 1 ? 's' : ''} in the propagation chain. ${rcvrs.length} receiver domain${rcvrs.length !== 1 ? 's' : ''} absorb downstream pressure — the blast radius boundary.`,
                evidence: rcvrs.map(r => ({ label: r.domain_alias, value: `RECEIVER · ${r.grounding_status}`, severity: 'elevated' })),
                structuralContext: 'Blast radius bounded by propagation chain. Domains outside the chain are structurally isolated from these pressure origins.',
              }
            },
          },
        ],

        topologyFocus: (() => {
          const allAffected = new Set([...originNames, ...passThroughs.map(p => p.domain_alias), ...receivers.map(r => r.domain_alias)])
          return {
            highlightDomains: originNames,
            accentDomains: passThroughs.map(p => p.domain_alias),
            dimDomains: registry.filter(d => !allAffected.has(d.domain_name) && !allAffected.has(d.domain_alias)).map(d => d.domain_id),
          }
        })(),

        actions: [
          { action: 'Review structural pressure at origin domains', priority: 'HIGH', type: 'investigation' },
          { action: 'Trace propagation chain before deployment', priority: 'HIGH', type: 'assessment' },
          { action: 'Assess receiver exposure to downstream pressure', priority: 'MEDIUM', type: 'investigation' },
        ],

        gapsAndProgression: {
          evidenceGaps: [
            ...(!pz ? [{ gap: 'Pressure zone state not loaded', impact: 'Zone boundaries unavailable on topology' }] : []),
            ...(!(fullReport.propagation_summary || {}).primary_zone_business_label ? [{ gap: 'No propagation summary label', impact: 'Propagation narrative incomplete' }] : []),
            ...originNames.filter(d => findDomainGrounding(d, registry) === 'semantic_only').map(d => ({ gap: `"${d}" ungrounded`, impact: 'Pressure assessment rests on semantic assertion' })),
          ],
          progressionPath: [
            { step: 'Reduce pressure concentration at origin domains', effect: 'Lower PSIG-001/PSIG-002 severity' },
            { step: 'Ground ungrounded origin domains', effect: 'Improve Q-class toward Q-01' },
            { step: 'Stabilize delivery corridors', effect: 'Reduce propagation amplification' },
          ],
        },
      }
    },
  },

  // ── COORDINATION SATURATION ────────────────────────────────────────
  COORDINATION_SATURATION: {
    meta: { code: 'CS', label: 'Coordination Saturation', icon: '⬡' },
    resolve: (fullReport, surface) => {
      const se = fullReport.structural_enrichment || {}
      const sigs = (fullReport.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
      const spines = (se.available && se.centrality) ? (se.centrality.top_structural_spines || []) : []
      const hubs = spines.filter(s => s.structural_role === 'hub' || s.structural_role === 'authority')
      const hubPaths = hubs.slice(0, 5).map(h => h.path)
      const registry = fullReport.semantic_domain_registry || []
      const concentrationSigs = sigs.filter(s => (s.signal_name && (s.signal_name.includes('Absorption') || s.signal_name.includes('Cluster Pressure'))) || s.severity === 'HIGH')
      const roleSummary = (se.available && se.centrality) ? (se.centrality.role_summary || {}) : {}

      return {
        interpretation: {
          heading: 'Coordination Saturation — Active Cognition State',
          operationalMeaning: hubs.length > 0
            ? `${hubs.length} coordination hub${hubs.length !== 1 ? 's' : ''} absorb disproportionate structural load. Peak inbound dependency: ${Math.max(...hubs.map(h => h.in_degree || 0))}. Changes to these files amplify across the dependency graph — every downstream consumer is affected.${concentrationSigs.length > 0 ? ` ${concentrationSigs.length} concentration signal${concentrationSigs.length !== 1 ? 's' : ''} confirm structural bottleneck.` : ''}`
            : 'Coordination saturation detected but no hub nodes identified in structural enrichment.',
          structuralEvidence: [
            ...hubs.slice(0, 4).map(h => { const t = translateCentralityNode(h); return { label: t.operational_name, value: `${t.structural_role_label} · ${t.consumer_label}`, severity: t.in_degree > 10 ? 'critical' : 'elevated' } }),
            ...concentrationSigs.slice(0, 2).map(s => ({ label: s.signal_name || s.signal_id, value: s.severity, severity: s.severity === 'HIGH' ? 'critical' : 'elevated' })),
          ],
          suppressionMask: ['QUALIFICATION_EXPOSURE'],
        },

        implications: {
          orchestration: [
            { action: 'Review hub file changes with expanded scope', priority: 'HIGH' },
            { action: 'Assess coordination distribution before refactoring', priority: 'MEDIUM' },
            ...(surface.hub_ratio > 20 ? [{ action: 'Hub concentration exceeds 20% — architectural review recommended', priority: 'HIGH' }] : []),
          ],
          qualification: { effect: 'High coordination concentration may indicate architectural fragility — structural centrality assessment informs qualification posture' },
        },

        guidedCognition: [
          ...hubs.slice(0, 2).map(hub => { const th = translateCentralityNode(hub); return {
            question: `What depends on ${th.operational_name}? (${th.consumer_label})`,
            tone: 'forensic', archetype: 'TRACE', depth: 'standard',
            boundary: 'From structural_centrality in-degree — deterministic.',
            answer_derive: (fr) => {
              const allSpines = ((fr.structural_enrichment || {}).centrality || {}).top_structural_spines || []
              const node = allSpines.find(s => s.path === hub.path) || hub
              const t = translateCentralityNode(node)
              return {
                summary: `${t.operational_name} (${t.short_path}) is a ${t.structural_role_label} with ${t.consumer_label} and ${t.out_degree} outbound dependencies. ${t.operational_role}. Centrality rank: ${t.centrality_rank || '?'}. Any change propagates to all consumers.`,
                evidence: [
                  { label: 'Operational role', value: t.operational_role, severity: 'nominal' },
                  { label: 'Consumers', value: String(t.in_degree), severity: t.in_degree > 10 ? 'critical' : 'elevated' },
                  { label: 'Dependencies', value: String(t.out_degree), severity: 'nominal' },
                  { label: 'Structural role', value: t.structural_role_label, severity: 'nominal' },
                  { label: 'Centrality rank', value: String(t.centrality_rank || '—'), severity: 'nominal' },
                ],
                structuralContext: 'Centrality derives from 40.3c structural centrality artifact — normalized degree centrality with role classification.',
              }
            },
          } }),
          {
            question: 'Is coordination load distributed or concentrated?',
            tone: 'architectural', archetype: 'INTERPRET', depth: 'standard',
            boundary: 'From structural_enrichment role classification — deterministic.',
            answer_derive: (fr) => {
              const rs = ((fr.structural_enrichment || {}).centrality || {}).role_summary || {}
              const total = Object.values(rs).reduce((a, b) => a + b, 0)
              const hubCount = (rs.hub || 0) + (rs.authority || 0)
              const hubPct = total > 0 ? Math.round(hubCount / total * 100) : 0
              return {
                summary: `Role distribution: ${Object.entries(rs).map(([r, c]) => `${STRUCTURAL_ROLE_LABELS[r] || r}: ${c}`).join(', ')}. Hub+authority concentration: ${hubPct}% (${hubCount}/${total} files).${hubPct > 20 ? ' Concentration above 20% — coordination bottleneck risk.' : hubPct > 10 ? ' Moderate concentration.' : ' Well distributed.'}`,
                evidence: Object.entries(rs).map(([role, count]) => ({ label: STRUCTURAL_ROLE_LABELS[role] || role, value: `${count} (${total > 0 ? Math.round(count / total * 100) : 0}%)`, severity: (role === 'hub' || role === 'authority') && count / Math.max(1, total) > 0.15 ? 'elevated' : 'nominal' })),
                structuralContext: '7 structural roles classified by first-match-wins from import graph metrics.',
              }
            },
          },
          {
            question: 'Do coordination hubs create execution bottlenecks?',
            tone: 'alarming', archetype: 'ESCALATION', depth: 'deep',
            boundary: 'From centrality ranking + signal co-presence — deterministic.',
            answer_derive: (fr) => {
              const allSpines = ((fr.structural_enrichment || {}).centrality || {}).top_structural_spines || []
              const topHubs = allSpines.filter(s => s.structural_role === 'hub' || s.structural_role === 'authority').slice(0, 5)
              const activeSigs = (fr.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL')
              return {
                summary: topHubs.length > 0
                  ? `Top ${topHubs.length} coordination nodes handle ${topHubs.reduce((s, h) => s + (h.in_degree || 0), 0)} total inbound dependencies.${activeSigs.length > 0 ? ` ${activeSigs.length} active signal${activeSigs.length !== 1 ? 's' : ''} indicate structural stress at or near these coordination points.` : ' No active signals co-located with coordination hubs.'}`
                  : 'No hub/authority nodes found in structural enrichment.',
                evidence: topHubs.map(h => { const t = translateCentralityNode(h); return { label: t.operational_name, value: t.consumer_label, severity: t.in_degree > 10 ? 'critical' : 'elevated' } }),
                structuralContext: 'Bottleneck assessment combines centrality metrics with active signal co-presence.',
              }
            },
          },
        ],

        topologyFocus: {
          highlightDomains: hubPaths.map(p => p.split('/').slice(-2).join('/')),
          accentDomains: [],
          dimDomains: [],
        },

        actions: [
          { action: 'Assess hub change impact before merging', priority: 'HIGH', type: 'assessment' },
          { action: 'Review coordination distribution', priority: 'MEDIUM', type: 'investigation' },
          { action: 'Evaluate interface extraction from concentrated hubs', priority: 'LOW', type: 'architectural' },
        ],

        gapsAndProgression: {
          evidenceGaps: [
            ...(!se.available ? [{ gap: 'No structural enrichment available', impact: 'Centrality analysis impossible — coordination hubs undetectable' }] : []),
            ...(!se.centrality ? [{ gap: 'No centrality data (40.3c)', impact: 'Role classification and hub detection unavailable' }] : []),
          ],
          progressionPath: [
            { step: 'Distribute coordination load across more modules', effect: 'Reduce hub concentration ratio' },
            { step: 'Extract interfaces from high-centrality hubs', effect: 'Lower individual hub in-degree' },
            { step: 'Reduce coupling between hub consumers', effect: 'Lower blast radius of hub changes' },
          ],
        },
      }
    },
  },

  // ── INTEGRATION EXPOSURE ───────────────────────────────────────────
  INTEGRATION_EXPOSURE: {
    meta: { code: 'IE', label: 'Integration Exposure', icon: '⇌' },
    resolve: (fullReport, surface) => {
      const se = fullReport.structural_enrichment || {}
      const sigs = (fullReport.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
      const blocks = fullReport.evidence_blocks || []
      const isigSigs = sigs.filter(s => s.signal_family === 'ISIG')
      const passThroughs = blocks.filter(b => b.propagation_role === 'PASS_THROUGH')
      const spines = (se.available && se.centrality) ? (se.centrality.top_structural_spines || []) : []
      const bridges = spines.filter(s => s.structural_role === 'bridge' || s.structural_role === 'connector')
      const c = surface.constituents || {}
      const affectedDomains = surface.affected_domains || []
      const mode = surface.evidence_mode || 'EVIDENCE_GAP'
      const topologyCount = (c.bridges || 0) + (c.connectors || 0)

      const operationalMeaning = mode === 'IMPORT_SIGNAL_DRIVEN'
        ? `${isigSigs.length} file-level import dependency signal${isigSigs.length !== 1 ? 's' : ''} (ISIG) detect elevated structural stress at import boundaries. Cross-domain integration corridor topology is not resolved — exposure assessment is advisory-bound to file-level evidence.`
        : mode === 'TOPOLOGY_DRIVEN'
          ? `${topologyCount} cross-domain integration point${topologyCount !== 1 ? 's' : ''} absorb boundary-crossing structural pressure.${passThroughs.length > 0 ? ` ${passThroughs.length} domain${passThroughs.length !== 1 ? 's' : ''} conduct pressure between subsystems.` : ''}`
          : mode === 'MIXED'
            ? `${topologyCount} cross-domain integration point${topologyCount !== 1 ? 's' : ''} absorb boundary-crossing structural pressure. ${isigSigs.length} ISIG signal${isigSigs.length !== 1 ? 's' : ''} confirm stress at file-level import boundaries.${passThroughs.length > 0 ? ` ${passThroughs.length} domain${passThroughs.length !== 1 ? 's' : ''} conduct pressure between subsystems.` : ''}`
            : 'Integration exposure evidence is insufficient for operational assessment.'

      return {
        interpretation: {
          heading: mode === 'IMPORT_SIGNAL_DRIVEN'
            ? 'Integration Exposure — Import Dependency Pressure (Advisory-Bound)'
            : 'Integration Exposure — Active Cognition State',
          operationalMeaning,
          structuralEvidence: [
            ...bridges.slice(0, 3).map(b => { const t = translateCentralityNode(b); return { label: t.operational_name, value: `${t.structural_role_label} · ${t.consumer_label}`, severity: 'elevated' } }),
            ...isigSigs.map(s => ({ label: s.signal_name || 'ISIG', value: `${s.severity}${s.concentration ? ' · ' + s.concentration : ''}`, severity: s.severity === 'HIGH' ? 'critical' : 'elevated' })),
            ...passThroughs.slice(0, 2).map(p => ({ label: p.domain_alias, value: `PASS_THROUGH · ${p.grounding_status}`, severity: 'elevated' })),
            ...(mode === 'IMPORT_SIGNAL_DRIVEN' ? [{ label: 'Integration Topology', value: 'NOT RESOLVED — no bridge/connector roles detected', severity: 'nominal' }] : []),
          ],
          suppressionMask: ['OPERATIONAL_TOPOLOGY'],
        },

        implications: {
          orchestration: mode === 'IMPORT_SIGNAL_DRIVEN'
            ? [
                { action: 'Import dependency concentration creates change amplification risk at file level', priority: 'HIGH' },
                { action: 'Cross-domain corridor assessment deferred until integration topology resolves', priority: 'MEDIUM' },
              ]
            : [
                { action: 'Cross-domain integration changes require expanded test scope', priority: 'HIGH' },
                { action: 'Review bridge node stability before boundary modifications', priority: 'MEDIUM' },
              ],
          qualification: { effect: mode === 'IMPORT_SIGNAL_DRIVEN'
            ? 'Import dependency pressure is advisory-bound — structural corridor evidence required for confirmed integration exposure'
            : 'Integration quality affects structural coherence — high exposure may widen grounding gaps'
          },
        },

        guidedCognition: [
          ...(isigSigs.length > 0 ? [{
            question: `What do the ${isigSigs.length} ISIG import signal${isigSigs.length !== 1 ? 's' : ''} reveal?`,
            tone: 'forensic', archetype: 'TRACE', depth: 'standard',
            boundary: 'From ISIG Level 1 signal family — deterministic.',
            answer_derive: (fr) => {
              const isigs = (fr.signal_interpretations || []).filter(s => s.signal_family === 'ISIG')
              return {
                summary: isigs.length > 0
                  ? `ISIG signals measure file-level import dependency pressure (Level 1). ${isigs.map(s => `${s.signal_name || s.signal_id}: ${s.severity}`).join('. ')}. These are invisible at architectural binding level (Level 2) — Level 1 reveals software execution intelligence.`
                  : 'No ISIG signals in current specimen.',
                evidence: isigs.map(s => ({ label: s.signal_name || s.signal_id, value: `${s.severity}${s.value !== undefined ? ' · ' + s.value : ''}`, severity: s.severity === 'HIGH' ? 'critical' : 'elevated' })),
                structuralContext: 'ISIG derives from 40.3s code graph + 40.3c centrality. Level 1 signals predict change propagation risk and PR review complexity.',
              }
            },
          }] : []),
          {
            question: topologyCount > 0 ? `Which ${topologyCount} bridge${topologyCount !== 1 ? 's' : ''} carry cross-domain load?` : 'Are there structural bridges carrying cross-domain load?',
            tone: 'operational', archetype: 'SCAN', depth: 'standard',
            boundary: 'From structural_enrichment centrality — deterministic.',
            answer_derive: (fr) => {
              const allBridges = ((fr.structural_enrichment || {}).centrality || {}).top_structural_spines || []
              const bNodes = allBridges.filter(s => s.structural_role === 'bridge' || s.structural_role === 'connector')
              return {
                summary: bNodes.length > 0
                  ? `${bNodes.length} integration node${bNodes.length !== 1 ? 's' : ''}: ${bNodes.slice(0, 3).map(n => translateCentralityNode(n).operational_name).join(', ')}${bNodes.length > 3 ? ` +${bNodes.length - 3} more` : ''}. These structural surfaces bridge dependency boundaries between domains.`
                  : 'No bridge/connector nodes identified in structural enrichment. Integration corridor topology is not yet resolved for this specimen.',
                evidence: bNodes.slice(0, 5).map(n => { const t = translateCentralityNode(n); return { label: t.operational_name, value: `${t.structural_role_label} · rank ${t.centrality_rank || '?'}`, severity: 'elevated' } }),
                structuralContext: 'Bridge nodes connect otherwise separate graph components. Connector nodes link clusters with moderate edge weight.',
              }
            },
          },
          {
            question: affectedDomains.length > 0 ? `Which domains face integration pressure? (${affectedDomains.length} identified)` : 'Where does integration pressure concentrate?',
            tone: 'architectural', archetype: 'INTERPRET', depth: 'standard',
            boundary: 'From evidence_blocks + bridge nodes — deterministic.',
            answer_derive: (fr) => {
              const pts = (fr.evidence_blocks || []).filter(b => b.propagation_role === 'PASS_THROUGH')
              return {
                summary: pts.length > 0
                  ? `${pts.length} domain${pts.length !== 1 ? 's' : ''} conduct integration pressure: ${pts.map(p => p.domain_alias).join(', ')}. These are pass-through corridors — they neither originate nor terminate pressure, but amplify it through cross-boundary conduction.`
                  : 'No pass-through domains identified — integration pressure may be direct rather than conducted.',
                evidence: pts.map(p => ({ label: p.domain_alias, value: `PASS_THROUGH · ${p.grounding_status}`, severity: 'elevated' })),
                structuralContext: 'Pass-through classification from evidence block analysis.',
              }
            },
          },
        ],

        topologyFocus: {
          highlightDomains: affectedDomains,
          accentDomains: bridges.slice(0, 5).map(b => b.path.split('/').slice(-2).join('/')),
          dimDomains: [],
        },

        actions: mode === 'IMPORT_SIGNAL_DRIVEN'
          ? [
              { action: 'Trace import hub concentration to identify amplification risk', priority: 'HIGH', type: 'investigation' },
              { action: 'Assess whether import pressure correlates with domain boundaries', priority: 'MEDIUM', type: 'assessment' },
            ]
          : [
              { action: 'Review integration boundary changes with cross-domain scope', priority: 'HIGH', type: 'assessment' },
              { action: 'Trace import chains from bridge nodes', priority: 'MEDIUM', type: 'investigation' },
              { action: 'Evaluate connector resilience', priority: 'LOW', type: 'architectural' },
            ],

        gapsAndProgression: {
          evidenceGaps: [
            ...(!se.available ? [{ gap: 'No structural enrichment', impact: 'Bridge/connector detection unavailable' }] : []),
            ...(isigSigs.length === 0 && se.available ? [{ gap: 'No ISIG signals', impact: 'File-level import pressure invisible (requires 40.3s code graph)' }] : []),
            ...(mode === 'IMPORT_SIGNAL_DRIVEN' ? [{ gap: 'No bridge/connector topology roles', impact: 'Cross-domain integration corridor assessment deferred — exposure is advisory-bound to file-level ISIG evidence' }] : []),
          ],
          progressionPath: mode === 'IMPORT_SIGNAL_DRIVEN'
            ? [
                { step: 'Resolve integration corridor topology', effect: 'Promote advisory-bound import pressure to confirmed corridor exposure' },
                { step: 'Stabilize import hub concentration', effect: 'Reduce file-level dependency amplification risk' },
              ]
            : [
                { step: 'Stabilize integration boundaries', effect: 'Reduce cross-domain coupling pressure' },
                { step: 'Improve interface definitions at bridge points', effect: 'Lower blast radius of boundary changes' },
                { step: 'Reduce pass-through domain count', effect: 'Shorten pressure conduction chains' },
              ],
        },
      }
    },
  },

  // ── OPERATIONAL TOPOLOGY POSTURE ────────────────────────────────────
  OPERATIONAL_TOPOLOGY: {
    meta: { code: 'OT', label: 'Operational Topology Posture', icon: '◉' },
    resolve: (fullReport, surface) => {
      const ts = fullReport.topology_summary || {}
      const rs = fullReport.reconciliation_summary || {}
      const se = fullReport.structural_enrichment || {}
      const registry = fullReport.semantic_domain_registry || []
      const c = surface.constituents || {}
      const groundingPct = c.grounding_pct || 0
      const roleDistribution = c.role_distribution || 'unknown'
      const backed = c.backed || 0
      const semanticOnly = c.semantic_only || 0
      const domainCount = c.domain_count || registry.length

      return {
        interpretation: {
          heading: 'Operational Topology — Active Cognition State',
          operationalMeaning: `System topology: ${domainCount} domains, ${backed} structurally grounded (${groundingPct}%), ${semanticOnly} semantic-only. Role distribution: ${roleDistribution}.${groundingPct < 50 ? ' Low grounding means operational assessments rest on semantic inference — structural confirmation needed before deployment decisions.' : groundingPct < 70 ? ' Partial grounding — assessments advisory-qualified for ungrounded domains.' : ' Strong grounding — assessments carry structural authority.'}${rs.available ? ` Reconciliation: ${c.reconciliation_pct || 0}% reconciled.` : ' No reconciliation data available.'}`,
          structuralEvidence: [
            { label: 'Grounding', value: `${backed}/${domainCount} (${groundingPct}%)`, severity: groundingPct < 50 ? 'critical' : groundingPct < 70 ? 'elevated' : 'nominal' },
            { label: 'Role distribution', value: roleDistribution, severity: roleDistribution === 'hub-concentrated' ? 'elevated' : 'nominal' },
            ...(c.role_breakdown ? Object.entries(c.role_breakdown).slice(0, 3).map(([role, { count, pct }]) => ({ label: role, value: `${count} (${pct}%)`, severity: (role === 'hub' || role === 'authority') && pct > 20 ? 'elevated' : 'nominal' })) : []),
          ],
          suppressionMask: [],
        },

        implications: {
          orchestration: [
            ...(semanticOnly > 0 ? [{ action: `${semanticOnly} ungrounded domain${semanticOnly !== 1 ? 's' : ''} require advisory-qualified deployment decisions`, priority: 'MEDIUM' }] : []),
            ...(roleDistribution === 'hub-concentrated' ? [{ action: 'Hub concentration may constrain deployment flexibility', priority: 'MEDIUM' }] : []),
          ],
          qualification: { effect: `Grounding ratio ${groundingPct}% directly affects Q-class. ${groundingPct >= 80 ? 'Q-01 achievable.' : groundingPct >= 50 ? 'Q-02 likely — partial disclosure required.' : 'Q-03 or lower — full disclosure required.'}` },
        },

        guidedCognition: [
          ...(semanticOnly > 0 ? [{
            question: `Which ${semanticOnly} domain${semanticOnly !== 1 ? 's' : ''} lack structural backing?`,
            tone: 'operational', archetype: 'SCAN', depth: 'standard',
            boundary: 'From reconciliation correspondence — deterministic.',
            answer_derive: (fr) => {
              const reg = fr.semantic_domain_registry || []
              const ungrounded = reg.filter(d => d.grounding_status === 'semantic_only' || !d.zone_anchor)
              return {
                summary: `${ungrounded.length} domain${ungrounded.length !== 1 ? 's' : ''} operate on semantic assertion without structural evidence: ${ungrounded.slice(0, 5).map(d => d.domain_name || d.domain_id).join(', ')}${ungrounded.length > 5 ? ` +${ungrounded.length - 5} more` : ''}.`,
                evidence: ungrounded.slice(0, 6).map(d => ({ label: d.domain_name || d.domain_id, value: d.grounding_status || 'ungrounded', severity: 'elevated' })),
                structuralContext: 'Grounding determined by reconciliation correspondence — each domain checked against structural evidence from evidence rebase corridor.',
              }
            },
          }] : []),
          {
            question: `Is the structural role distribution balanced? (${roleDistribution})`,
            tone: 'architectural', archetype: 'INTERPRET', depth: 'standard',
            boundary: 'From structural_enrichment role classification — deterministic.',
            answer_derive: (fr) => {
              const rs2 = ((fr.structural_enrichment || {}).centrality || {}).role_summary || {}
              const total = Object.values(rs2).reduce((a, b) => a + b, 0)
              return {
                summary: total > 0 ? `${total} files classified across ${Object.keys(rs2).length} structural roles. ${Object.entries(rs2).map(([r, ct]) => `${STRUCTURAL_ROLE_LABELS[r] || r}: ${ct} (${Math.round(ct / total * 100)}%)`).join(', ')}.` : 'No structural role data available.',
                evidence: Object.entries(rs2).map(([role, ct]) => ({ label: STRUCTURAL_ROLE_LABELS[role] || role, value: `${ct} (${total > 0 ? Math.round(ct / total * 100) : 0}%)`, severity: 'nominal' })),
                structuralContext: '7-role taxonomy from 40.3c structural centrality. First-match-wins classification from import graph metrics.',
              }
            },
          },
          {
            question: 'What dependencies radiate from zone anchor domains?',
            tone: 'forensic', archetype: 'TRACE', depth: 'standard',
            boundary: 'From topology edges + zone_anchor classification — deterministic.',
            answer_derive: (fr) => {
              const reg = fr.semantic_domain_registry || []
              const anchors = reg.filter(d => d.zone_anchor)
              return {
                summary: anchors.length > 0 ? `${anchors.length} zone anchor domain${anchors.length !== 1 ? 's' : ''}: ${anchors.map(a => a.domain_name || a.domain_id).join(', ')}. Zone anchors are structural gravity centers — they concentrate evidence mass and propagation density.` : 'No zone anchors identified in domain registry.',
                evidence: anchors.map(a => ({ label: a.domain_name || a.domain_id, value: `anchor · ${a.grounding_status || 'unknown'}`, severity: a.zone_anchor ? 'elevated' : 'nominal' })),
                structuralContext: 'Zone anchors selected by evidence density and propagation role in the topology graph.',
              }
            },
          },
        ],

        topologyFocus: {
          highlightDomains: registry.filter(d => d.zone_anchor).map(d => d.domain_name || d.domain_id),
          accentDomains: [],
          dimDomains: [],
        },

        actions: [
          ...(semanticOnly > 0 ? [{ action: `Provide structural backing for ${semanticOnly} ungrounded domain${semanticOnly !== 1 ? 's' : ''}`, priority: 'MEDIUM', type: 'remediation' }] : []),
          { action: 'Assess domain grounding ratio', priority: 'LOW', type: 'investigation' },
          { action: 'Review structural role distribution', priority: 'LOW', type: 'investigation' },
        ],

        gapsAndProgression: {
          evidenceGaps: [
            ...(!rs.available ? [{ gap: 'Reconciliation data unavailable', impact: 'Cannot verify structural backing of semantic domains' }] : []),
            ...(!se.available ? [{ gap: 'No structural enrichment', impact: 'Role distribution and centrality analysis unavailable' }] : []),
          ],
          progressionPath: [
            ...(groundingPct < 80 ? [{ step: 'Improve grounding ratio above 80%', effect: 'Achieve Q-01 qualification' }] : []),
            ...(roleDistribution === 'hub-concentrated' ? [{ step: 'Reduce hub concentration', effect: 'Balance coordination load' }] : []),
            { step: 'Reconcile remaining unreconciled domains', effect: 'Increase reconciliation authority' },
          ],
        },
      }
    },
  },

  // ── QUALIFICATION EXPOSURE ─────────────────────────────────────────
  QUALIFICATION_EXPOSURE: {
    meta: { code: 'QE', label: 'Qualification Exposure', icon: '⊘' },
    resolve: (fullReport, surface) => {
      const gl = fullReport.governance_lifecycle || {}
      const pc = fullReport.proposition_corpus || {}
      const ri = fullReport.revalidation_intelligence || {}
      const c = surface.constituents || {}
      const blockers = c.blockers || []
      const gaps = c.gaps || []
      const sLevel = c.s_level || null

      return {
        interpretation: {
          heading: 'Qualification Exposure — Active Cognition State',
          operationalMeaning: sLevel
            ? `Qualification at ${sLevel}. ${c.artifacts_present || 0} of ${c.artifacts_total || 7} governance artifacts present.${blockers.length > 0 ? ` ${blockers.length} blocker${blockers.length !== 1 ? 's' : ''} prevent advancement: ${blockers.join('; ')}.` : ' No blockers — qualification progression unblocked.'}${c.promotion_eligible ? ' Promotion eligible.' : c.authority_ceiling ? ` Authority ceiling: ${c.authority_ceiling}.` : ''}`
            : `${c.artifacts_present || 0} of ${c.artifacts_total || 7} governance artifacts present. No governance lifecycle established — SQO not exercised for this specimen.`,
          structuralEvidence: [
            ...(sLevel ? [{ label: 'S-Level', value: sLevel, severity: 'nominal' }] : []),
            { label: 'Artifacts', value: `${c.artifacts_present || 0}/${c.artifacts_total || 7}`, severity: (c.artifacts_present || 0) < 3 ? 'critical' : (c.artifacts_present || 0) < 5 ? 'elevated' : 'nominal' },
            ...blockers.map((b, i) => ({ label: `Blocker ${i + 1}`, value: b, severity: 'critical' })),
          ],
          suppressionMask: [],
        },

        implications: {
          orchestration: [
            ...blockers.map(b => ({ action: `Resolve blocker: ${b}`, priority: 'HIGH' })),
            ...(gaps.length > 0 ? [{ action: `Produce missing governance artifacts: ${gaps.slice(0, 3).join(', ')}`, priority: 'MEDIUM' }] : []),
          ],
          qualification: { effect: blockers.length > 0 ? `${blockers.length} blocker${blockers.length !== 1 ? 's' : ''} prevent S-level advancement` : 'No blockers — qualification progression available' },
        },

        guidedCognition: [
          ...(blockers.length > 0 ? [{
            question: `What ${blockers.length} condition${blockers.length !== 1 ? 's' : ''} block qualification advancement?`,
            tone: 'alarming', archetype: 'BOUNDARY', depth: 'standard',
            boundary: 'From governance_lifecycle + proposition_review_state — deterministic.',
            answer_derive: (fr) => {
              const glLocal = fr.governance_lifecycle || {}
              const pcLocal = fr.proposition_corpus || {}
              const riLocal = fr.revalidation_intelligence || {}
              const bList = []
              if (glLocal.available && !glLocal.promotion_eligible && glLocal.hold_reason) bList.push({ label: 'Advancement hold', value: glLocal.hold_reason, severity: 'critical' })
              if (pcLocal.available && pcLocal.flagged_count > 0) bList.push({ label: 'Flagged propositions', value: String(pcLocal.flagged_count), severity: 'critical' })
              if (riLocal.available && riLocal.failed > 0) bList.push({ label: 'Revalidation failures', value: String(riLocal.failed), severity: 'critical' })
              return {
                summary: bList.length > 0 ? `${bList.length} blocker${bList.length !== 1 ? 's' : ''}: ${bList.map(b2 => b2.label).join(', ')}. Each must be resolved before qualification can advance.` : 'No active blockers identified.',
                evidence: bList.length > 0 ? bList : [{ label: 'Status', value: 'No blockers', severity: 'nominal' }],
                structuralContext: 'Blockers derive from governance lifecycle, proposition corpus, and revalidation intelligence.',
              }
            },
          }] : []),
          {
            question: `Which governance artifacts are ${gaps.length > 0 ? 'missing' : 'present'}?`,
            tone: 'operational', archetype: 'SCAN', depth: 'standard',
            boundary: 'From governance_lifecycle artifact inventory — deterministic.',
            answer_derive: (fr) => {
              const artifacts = [
                { name: 'Governance Lifecycle', present: !!(fr.governance_lifecycle || {}).available },
                { name: 'Proposition Corpus', present: !!(fr.proposition_corpus || {}).available },
                { name: 'Revalidation', present: !!(fr.revalidation_intelligence || {}).available },
                { name: 'Constitutional Anchor', present: !!(fr.constitutional_anchor || {}).available },
                { name: 'Convergence Intelligence', present: !!(fr.convergence_intelligence || {}).available },
                { name: 'Chronicle Certification', present: !!(fr.chronicle_certification || {}).available },
                { name: 'Enrichment Intelligence', present: !!(fr.enrichment_intelligence || {}).available },
              ]
              const present = artifacts.filter(a => a.present)
              const missing = artifacts.filter(a => !a.present)
              return {
                summary: `${present.length}/7 governance artifacts present. ${missing.length > 0 ? `Missing: ${missing.map(a => a.name).join(', ')}.` : 'Full governance artifact coverage achieved.'}`,
                evidence: artifacts.map(a => ({ label: a.name, value: a.present ? 'PRESENT' : 'MISSING', severity: a.present ? 'nominal' : 'elevated' })),
                structuralContext: 'Governance artifacts are assessed individually — each contributes to qualification depth independently.',
              }
            },
          },
          {
            question: 'Is the system ready for qualification advancement?',
            tone: 'executive', archetype: 'INTERPRET', depth: 'standard',
            boundary: 'From SQO promotion_state + revalidation — deterministic.',
            answer_derive: (fr) => {
              const glLocal = fr.governance_lifecycle || {}
              return {
                summary: glLocal.available
                  ? `Qualification at ${glLocal.s_level || '?'}. ${glLocal.promotion_eligible ? 'Promotion eligible — advancement can be requested.' : `Not eligible — ${glLocal.hold_reason || 'unresolved conditions'}.`}${glLocal.authority_ceiling ? ` Authority ceiling: ${glLocal.authority_ceiling}.` : ''}`
                  : 'No governance lifecycle — SQO not exercised for this specimen.',
                evidence: [
                  { label: 'S-Level', value: glLocal.s_level || '—', severity: 'nominal' },
                  { label: 'Promotion', value: glLocal.promotion_eligible ? 'ELIGIBLE' : 'BLOCKED', severity: glLocal.promotion_eligible ? 'nominal' : 'critical' },
                ],
                structuralContext: 'Promotion readiness computed from promotion state, qualification blockers, and revalidation status.',
              }
            },
          },
        ],

        topologyFocus: {
          highlightDomains: [],
          accentDomains: [],
          dimDomains: [],
        },

        actions: [
          ...blockers.map(b => ({ action: `Resolve: ${b}`, priority: 'HIGH', type: 'governance' })),
          ...gaps.slice(0, 2).map(g => ({ action: `Produce artifact: ${g}`, priority: 'MEDIUM', type: 'governance' })),
          ...(c.promotion_eligible ? [{ action: 'Request qualification advancement', priority: 'HIGH', type: 'governance' }] : []),
        ],

        gapsAndProgression: {
          evidenceGaps: gaps.map(g => ({ gap: `Missing: ${g}`, impact: 'Qualification depth limited without this governance artifact' })),
          progressionPath: [
            ...(blockers.length > 0 ? [{ step: `Resolve ${blockers.length} blocker${blockers.length !== 1 ? 's' : ''}`, effect: 'Unblock qualification advancement' }] : []),
            ...(gaps.length > 0 ? [{ step: `Produce ${gaps.length} missing governance artifact${gaps.length !== 1 ? 's' : ''}`, effect: 'Increase qualification depth' }] : []),
            ...(c.promotion_eligible ? [{ step: 'Request S-level advancement', effect: `Progress from ${sLevel} to next level` }] : []),
          ],
        },
      }
    },
  },

  // ── PROPAGATION RISK ───────────────────────────────────────────────
  PROPAGATION_RISK: {
    meta: { code: 'PR', label: 'Propagation Risk', icon: '⟿' },
    resolve: (fullReport, surface) => {
      const blocks = fullReport.evidence_blocks || []
      const sigs = (fullReport.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
      const c = surface.constituents || {}
      const chain = c.chain || []
      const origins = blocks.filter(b => b.propagation_role === 'ORIGIN')
      const passThroughs = blocks.filter(b => b.propagation_role === 'PASS_THROUGH')
      const receivers = blocks.filter(b => b.propagation_role === 'RECEIVER')
      const coPresenceSigs = sigs.filter(s => s.co_presence && s.co_presence.length > 0)
      const concentratedSigs = sigs.filter(s => s.concentration)
      const concentrationPattern = c.concentration_pattern || 'unknown'
      const registry = fullReport.semantic_domain_registry || []
      const allChainDomains = chain.map(n => n.domain)

      return {
        interpretation: {
          heading: 'Propagation Risk — Active Cognition State',
          operationalMeaning: `Pressure propagates from ${origins.length} origin${origins.length !== 1 ? 's' : ''} through ${passThroughs.length} corridor${passThroughs.length !== 1 ? 's' : ''} to ${receivers.length} receiver${receivers.length !== 1 ? 's' : ''}. Signal concentration: ${concentrationPattern}.${coPresenceSigs.length > 0 ? ` ${coPresenceSigs.length} co-presence signal${coPresenceSigs.length !== 1 ? 's' : ''} indicate overlapping pressure at chain nodes.` : ''} Changes at any origin amplify through the chain — deployment sequence matters.`,
          structuralEvidence: chain.slice(0, 6).map(n => ({
            label: n.domain,
            value: `${n.role} · ${n.grounding}`,
            severity: n.role === 'ORIGIN' ? 'critical' : n.role === 'PASS_THROUGH' ? 'elevated' : 'nominal',
          })),
          suppressionMask: ['OPERATIONAL_TOPOLOGY', 'QUALIFICATION_EXPOSURE'],
        },

        implications: {
          orchestration: [
            { action: 'Changes at origins amplify through corridors — deploy origins last', priority: 'HIGH' },
            { action: 'Assess receiver exposure before propagation-chain modifications', priority: 'MEDIUM' },
            ...(concentrationPattern === 'concentrated' ? [{ action: 'Concentrated signal pattern — pressure amplification risk', priority: 'HIGH' }] : []),
          ],
          qualification: {
            effect: chain.some(n => findDomainGrounding(n.domain, registry) === 'semantic_only')
              ? 'Propagation chain includes ungrounded domains — chain assessment advisory-qualified'
              : 'Propagation chain fully grounded — assessment carries structural authority',
          },
        },

        guidedCognition: [
          {
            question: `How does pressure flow through the ${chain.length}-node chain?`,
            tone: 'forensic', archetype: 'TRACE', depth: 'standard',
            boundary: 'From evidence_blocks propagation roles — deterministic.',
            answer_derive: (fr) => {
              const b = fr.evidence_blocks || []
              const chainStr = [...b.filter(x => x.propagation_role === 'ORIGIN').map(x => `${x.domain_alias} (ORIGIN)`), ...b.filter(x => x.propagation_role === 'PASS_THROUGH').map(x => `${x.domain_alias} (CORRIDOR)`), ...b.filter(x => x.propagation_role === 'RECEIVER').map(x => `${x.domain_alias} (RECEIVER)`)].join(' → ')
              return {
                summary: chainStr ? `Propagation chain: ${chainStr}. Each corridor node conducts pressure — the chain length determines amplification risk.` : 'No propagation chain identified.',
                evidence: b.map(x => ({ label: x.domain_alias, value: x.propagation_role, severity: x.propagation_role === 'ORIGIN' ? 'critical' : x.propagation_role === 'PASS_THROUGH' ? 'elevated' : 'nominal' })),
                structuralContext: 'Chain topology from evidence block analysis. Origin/pass-through/receiver roles are deterministic from structural position.',
              }
            },
          },
          {
            question: `Is signal pressure ${concentrationPattern} along the chain?`,
            tone: 'architectural', archetype: 'INTERPRET', depth: 'standard',
            boundary: 'From signal co-presence and concentration — deterministic.',
            answer_derive: (fr) => {
              const allSigs = (fr.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL')
              const cSigs = allSigs.filter(s => s.concentration)
              const cpSigs = allSigs.filter(s => s.co_presence && s.co_presence.length > 0)
              return {
                summary: `${cSigs.length} signal${cSigs.length !== 1 ? 's' : ''} show concentration patterns. ${cpSigs.length} show co-presence (multiple signals at same node). ${cSigs.length > allSigs.length * 0.5 ? 'Pressure is concentrated — specific nodes bear disproportionate load.' : 'Pressure is distributed across the chain.'}`,
                evidence: [...cSigs.slice(0, 3).map(s => ({ label: s.signal_name || s.signal_id, value: `concentrated: ${s.concentration}`, severity: 'elevated' })), ...cpSigs.slice(0, 2).map(s => ({ label: s.signal_name || s.signal_id, value: `co-present with ${(s.co_presence || []).length} other${(s.co_presence || []).length !== 1 ? 's' : ''}`, severity: 'elevated' }))],
                structuralContext: 'Concentration analysis from signal interpretation metadata.',
              }
            },
          },
          {
            question: 'Does the chain amplify or attenuate pressure?',
            tone: 'alarming', archetype: 'ESCALATION', depth: 'deep',
            boundary: 'From chain node severity escalation — deterministic.',
            answer_derive: (fr) => {
              const b = fr.evidence_blocks || []
              const originSeverity = b.filter(x => x.propagation_role === 'ORIGIN').length
              const receiverCount = b.filter(x => x.propagation_role === 'RECEIVER').length
              const amplifies = receiverCount > originSeverity
              return {
                summary: `${originSeverity} origin${originSeverity !== 1 ? 's' : ''} → ${b.filter(x => x.propagation_role === 'PASS_THROUGH').length} corridor${b.filter(x => x.propagation_role === 'PASS_THROUGH').length !== 1 ? 's' : ''} → ${receiverCount} receiver${receiverCount !== 1 ? 's' : ''}. ${amplifies ? 'Chain AMPLIFIES — more domains receive pressure than originate it.' : 'Chain ATTENUATES — pressure does not multiply through the chain.'}`,
                evidence: [
                  { label: 'Origins', value: String(originSeverity), severity: 'critical' },
                  { label: 'Corridors', value: String(b.filter(x => x.propagation_role === 'PASS_THROUGH').length), severity: 'elevated' },
                  { label: 'Receivers', value: String(receiverCount), severity: receiverCount > originSeverity ? 'critical' : 'nominal' },
                  { label: 'Amplification', value: amplifies ? 'YES' : 'NO', severity: amplifies ? 'critical' : 'nominal' },
                ],
                structuralContext: 'Amplification determined by comparing origin count to receiver count through the propagation chain.',
              }
            },
          },
        ],

        topologyFocus: (() => {
          const allAffected = new Set(allChainDomains)
          return {
            highlightDomains: origins.map(o => o.domain_alias),
            accentDomains: [...passThroughs.map(p => p.domain_alias), ...receivers.map(r => r.domain_alias)],
            dimDomains: registry.filter(d => !allAffected.has(d.domain_name) && !allAffected.has(d.domain_alias)).map(d => d.domain_id),
          }
        })(),

        actions: [
          { action: 'Review propagation chain before origin domain changes', priority: 'HIGH', type: 'assessment' },
          { action: 'Assess receiver domains for downstream pressure absorption', priority: 'MEDIUM', type: 'investigation' },
          { action: 'Evaluate chain length — shorter chains reduce amplification', priority: 'LOW', type: 'architectural' },
        ],

        gapsAndProgression: {
          evidenceGaps: [
            ...(!(fullReport.propagation_summary || {}).primary_zone_business_label ? [{ gap: 'No propagation summary', impact: 'Propagation narrative incomplete' }] : []),
            ...allChainDomains.filter(d => findDomainGrounding(d, registry) === 'semantic_only').map(d => ({ gap: `"${d}" ungrounded in chain`, impact: 'Chain assessment rests on semantic assertion at this node' })),
          ],
          progressionPath: [
            { step: 'Reduce origin concentration', effect: 'Fewer pressure sources in delivery chain' },
            { step: 'Stabilize corridors', effect: 'Lower conduction amplification' },
            { step: 'Limit receiver exposure', effect: 'Reduce downstream blast radius' },
          ],
        },
      }
    },
  },
}

const GUIDED_QUERY_ANSWERS = {
  semanticTopology: [
    {
      derive: (fullReport) => {
        const ts = (fullReport && fullReport.topology_summary) || {}
        const backed = ts.structurally_backed_count || 0
        const total = ts.semantic_domain_count || 0
        const semantic = total - backed
        const ratio = Math.round(backed / Math.max(1, total) * 100)
        return {
          summary: backed === total
            ? `All ${total} domains are structurally backed. Every semantic claim has evidence confirmation.`
            : `${backed} of ${total} domains have structural backing. ${semantic} remain semantic assertions without evidence confirmation.`,
          evidence: [
            { label: 'Structurally backed', value: String(backed), severity: 'nominal' },
            { label: 'Semantic only', value: String(semantic), severity: semantic > 0 ? 'elevated' : 'nominal' },
            { label: 'Grounding ratio', value: `${ratio}%`, severity: ratio < 50 ? 'critical' : ratio < 80 ? 'elevated' : 'nominal' },
          ],
          structuralContext: 'Grounding is determined by reconciliation correspondence — each domain is checked against structural evidence from the evidence rebase corridor.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const ts = (fullReport && fullReport.topology_summary) || {}
        return {
          summary: blocks.length > 0
            ? `${blocks.length} evidence blocks available across the propagation chain. Each block corresponds to a structural domain with traceable evidence lineage.`
            : 'No evidence blocks available in the current payload.',
          evidence: blocks.map(b => ({
            label: b.domain_alias || b.propagation_role,
            value: b.propagation_role,
            severity: b.propagation_role === 'ORIGIN' ? 'critical' : b.propagation_role === 'PASS_THROUGH' ? 'elevated' : 'nominal',
          })),
          structuralContext: ts.structurally_backed_count > 0
            ? `${ts.structurally_backed_count} domains have direct structural backing via canonical topology anchoring. Evidence lineage traces from source files through reconciliation correspondence.`
            : null,
        }
      },
    },
    {
      derive: (fullReport) => {
        const domains = (fullReport && fullReport.semantic_domain_registry) || []
        const semanticOnly = domains.filter(d => d.semantic_only || !d.structurally_backed)
        return {
          summary: semanticOnly.length > 0
            ? `${semanticOnly.length} of ${domains.length} domains operate on semantic continuity alone.`
            : 'All domains have structural correspondence.',
          evidence: semanticOnly.slice(0, 3).map(d => ({
            label: d.domain_name || d.domain_id,
            value: d.lineage_status || 'semantic-only',
            severity: 'elevated',
          })),
          structuralContext: null,
        }
      },
    },
    {
      derive: (fullReport) => {
        const clusters = (fullReport && fullReport.semantic_cluster_registry) || []
        const ts = (fullReport && fullReport.topology_summary) || {}
        const sorted = [...clusters].sort((a, b) => (b.domain_count || 0) - (a.domain_count || 0))
        const largest = sorted[0]
        const smallest = sorted[sorted.length - 1]
        const totalDomains = ts.semantic_domain_count || 0
        const ratio = largest && smallest && smallest.domain_count > 0
          ? (largest.domain_count / smallest.domain_count).toFixed(1) : '—'
        return {
          summary: largest
            ? `Structural reality concentrates in "${largest.cluster_label || 'primary cluster'}" (${largest.domain_count} domains). ${smallest && smallest !== largest ? `Thinnest cluster: "${smallest.cluster_label}" (${smallest.domain_count}).` : ''} Asymmetry ratio: ${ratio}:1.`
            : 'No cluster data available for asymmetry analysis.',
          evidence: sorted.slice(0, 3).map(c => ({
            label: c.cluster_label || c.cluster_id,
            value: `${c.domain_count || 0} domains`,
            severity: c === largest ? 'critical' : c === smallest ? 'elevated' : 'nominal',
          })),
          structuralContext: `${clusters.length} clusters across ${totalDomains} domains. Asymmetric distribution indicates uneven evidence accumulation across organizational segments.`,
        }
      },
    },
    {
      derive: (fullReport) => {
        const domains = (fullReport && fullReport.semantic_domain_registry) || []
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const grounded = domains.filter(d => d.structurally_backed)
        const chainDomains = new Set(blocks.map(b => b.domain_alias))
        const anchors = grounded.filter(d => chainDomains.has(d.domain_name || d.domain_id) || d.confidence > 0)
        return {
          summary: anchors.length > 0
            ? `${anchors.length} structurally grounded domains provide the verified foundation for executive confidence. These represent the structural surface where evidence has been confirmed.`
            : grounded.length > 0
              ? `${grounded.length} domains are structurally backed but none appear in the active propagation chain.`
              : 'No grounded domains available to anchor confidence.',
          evidence: anchors.slice(0, 5).map(d => ({
            label: d.domain_name || d.domain_id,
            value: `confidence: ${d.confidence || '—'}`,
            severity: 'nominal',
          })),
          structuralContext: `${grounded.length} of ${domains.length} total domains are structurally backed. Executive confidence is bounded by this grounded surface.`,
        }
      },
    },
    {
      derive: (fullReport) => {
        const recon = (fullReport && fullReport.reconciliation_summary) || {}
        const perDomain = recon.per_domain || []
        const unreconciled = perDomain.filter(d => d.reconciliation_status !== 'RECONCILED')
        const domains = (fullReport && fullReport.semantic_domain_registry) || []
        const semanticOnly = domains.filter(d => d.semantic_only || !d.structurally_backed)
        return {
          summary: unreconciled.length > 0
            ? `${unreconciled.length} semantic claims lack structural correspondence — these represent assertions without evidence confirmation. ${semanticOnly.length} domains are classified as semantic-only in the registry.`
            : perDomain.length > 0
              ? 'All semantic claims have structural correspondence through reconciliation.'
              : 'No reconciliation data available for correspondence analysis.',
          evidence: unreconciled.slice(0, 5).map(d => ({
            label: d.domain_name || d.domain_id || 'Unknown',
            value: d.reconciliation_status || 'unreconciled',
            severity: 'critical',
          })),
          structuralContext: recon.weighted_confidence_score != null
            ? `Weighted confidence across the topology: ${recon.weighted_confidence_score}. Unreconciled domains compress this score and limit executive commitment scope.`
            : 'Correspondence determined by reconciliation — each domain checked against structural evidence from the evidence rebase corridor.',
        }
      },
    },
  ],
  clusterConcentration: [
    {
      derive: (fullReport) => {
        const scope = (fullReport && fullReport.topology_scope) || {}
        const ts = (fullReport && fullReport.topology_summary) || {}
        const clusters = ts.cluster_count || scope.cluster_count || 0
        const domains = scope.domain_count || ts.semantic_domain_count || 0
        const density = domains > 0 ? (clusters / domains).toFixed(1) : '0'
        return {
          summary: clusters > 0
            ? `${clusters} structural clusters span ${domains} semantic domains. Average density is ${density} clusters per domain.`
            : 'No cluster data available for concentration analysis.',
          evidence: [
            { label: 'Clusters', value: String(clusters), severity: null },
            { label: 'Domains', value: String(domains), severity: null },
            { label: 'Avg density', value: density, severity: parseFloat(density) > 3 ? 'elevated' : 'nominal' },
          ],
          structuralContext: 'Cluster concentration indicates how structural mass is distributed. High concentration in few clusters creates dependency exposure.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const scope = (fullReport && fullReport.topology_scope) || {}
        const nodes = (scope.nodes || [])
        return {
          summary: blocks.length > 0
            ? `${blocks.length} evidence blocks carry structural weight across the propagation chain. ${nodes.length > 0 ? `${nodes.length} topology nodes mapped.` : ''}`
            : 'No structural weight data available.',
          evidence: blocks.map(b => ({
            label: b.domain_alias || 'Unknown',
            value: `${b.propagation_role} · ${b.structural_backing ? 'backed' : 'semantic'}`,
            severity: b.structural_backing ? 'nominal' : 'elevated',
          })),
          structuralContext: 'Structural weight is determined by evidence block classification. Clusters with more pass-through load carry disproportionate organizational influence.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const clusters = (fullReport && fullReport.semantic_cluster_registry) || []
        const ts = (fullReport && fullReport.topology_summary) || {}
        const totalDomains = ts.semantic_domain_count || 0
        const sorted = [...clusters].sort((a, b) => (b.domain_count || 0) - (a.domain_count || 0))
        const topCluster = sorted[0]
        const topPct = topCluster && totalDomains > 0 ? Math.round((topCluster.domain_count || 0) / totalDomains * 100) : 0
        return {
          summary: topCluster
            ? `The largest cluster ("${topCluster.cluster_label || topCluster.cluster_id}") accounts for ${topPct}% of all domains. ${topPct > 50 ? 'This creates single-point structural dependency — removal of this cluster would collapse majority coverage.' : 'Concentration is distributed across multiple clusters.'}`
            : 'No cluster data available for dependency analysis.',
          evidence: sorted.slice(0, 3).map(c => ({
            label: c.cluster_label || c.cluster_id,
            value: `${c.domain_count || 0} domains (${totalDomains > 0 ? Math.round((c.domain_count || 0) / totalDomains * 100) : 0}%)`,
            severity: (c.domain_count || 0) / Math.max(1, totalDomains) > 0.5 ? 'critical' : 'nominal',
          })),
          structuralContext: `${clusters.length} clusters span ${totalDomains} domains. Dependency emerges when structural mass concentrates beyond 50% in a single cluster.`,
        }
      },
    },
    {
      derive: (fullReport) => {
        const clusters = (fullReport && fullReport.semantic_cluster_registry) || []
        const thin = clusters.filter(c => (c.domain_count || 0) <= 1)
        return {
          summary: thin.length > 0
            ? `${thin.length} of ${clusters.length} clusters carry minimal structural mass.`
            : clusters.length > 0
              ? `All ${clusters.length} clusters carry substantive structural mass.`
              : 'No cluster data available.',
          evidence: thin.slice(0, 3).map(c => ({
            label: c.cluster_label || c.cluster_id,
            value: `${c.domain_count || 0} domain${(c.domain_count || 0) !== 1 ? 's' : ''}`,
            severity: 'elevated',
          })),
          structuralContext: null,
        }
      },
    },
    {
      derive: (fullReport) => {
        const clusters = (fullReport && fullReport.semantic_cluster_registry) || []
        const ts = (fullReport && fullReport.topology_summary) || {}
        const totalDomains = ts.semantic_domain_count || 0
        const sorted = [...clusters].sort((a, b) => (b.domain_count || 0) - (a.domain_count || 0))
        const topCluster = sorted[0]
        const topPct = topCluster && totalDomains > 0 ? Math.round((topCluster.domain_count || 0) / totalDomains * 100) : 0
        const bottomHalf = sorted.slice(Math.ceil(sorted.length / 2))
        const bottomDomains = bottomHalf.reduce((sum, c) => sum + (c.domain_count || 0), 0)
        const bottomPct = totalDomains > 0 ? Math.round(bottomDomains / totalDomains * 100) : 0
        const fragile = topPct > 50 || bottomPct < 20
        return {
          summary: fragile
            ? `Cluster distribution indicates structural fragility. ${topPct > 50 ? `Top cluster holds ${topPct}% of domains — single-point failure exposure.` : `Bottom half of clusters account for only ${bottomPct}% of domains — evidence is thinly distributed across organizational periphery.`}`
            : `Cluster distribution appears structurally resilient. Top cluster holds ${topPct}% of domains; bottom half accounts for ${bottomPct}%.`,
          evidence: [
            { label: 'Top cluster share', value: `${topPct}%`, severity: topPct > 50 ? 'critical' : 'nominal' },
            { label: 'Bottom half share', value: `${bottomPct}%`, severity: bottomPct < 20 ? 'elevated' : 'nominal' },
            { label: 'Total clusters', value: String(clusters.length), severity: null },
          ],
          structuralContext: `Fragility is structural when removal of a single cluster would collapse majority domain coverage. Current topology has ${clusters.length} clusters across ${totalDomains} domains.`,
        }
      },
    },
    {
      derive: (fullReport) => {
        const edges = (fullReport && fullReport.semantic_topology_edges) || []
        const domains = (fullReport && fullReport.semantic_domain_registry) || []
        const hubCount = {}
        edges.forEach(e => {
          hubCount[e.source_domain] = (hubCount[e.source_domain] || 0) + 1
          hubCount[e.target_domain] = (hubCount[e.target_domain] || 0) + 1
        })
        const hubs = Object.entries(hubCount).sort((a, b) => b[1] - a[1])
        const topHub = hubs[0]
        const avgConnections = hubs.length > 0 ? (edges.length * 2 / hubs.length).toFixed(1) : '0'
        const shape = topHub && topHub[1] > edges.length * 0.5 ? 'star' : hubs.length > 0 && parseFloat(avgConnections) > 2 ? 'mesh' : 'chain'
        return {
          summary: edges.length > 0
            ? `The topology contains ${edges.length} edges across ${domains.length} domains. ${topHub ? `Hub domain "${topHub[0]}" connects to ${topHub[1]} other domains.` : ''} Shape classification: ${shape}.`
            : 'No topology edges available for shape analysis.',
          evidence: hubs.slice(0, 3).map(([domain, count]) => ({
            label: domain,
            value: `${count} connections`,
            severity: count > 3 ? 'elevated' : 'nominal',
          })),
          structuralContext: `Topology shape: ${shape}. Star = single hub concentrates connections. Mesh = distributed connectivity. Chain = linear dependency.`,
        }
      },
    },
  ],
  absorptionLoad: [
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const passthrough = blocks.find(b => b && b.propagation_role === 'PASS_THROUGH')
        const total = blocks.length
        return {
          summary: passthrough
            ? `${passthrough.domain_alias} absorbs propagated load as a conducting layer. It transmits upstream pressure without generating independent structural evidence.`
            : 'No pass-through absorption node detected in the current chain.',
          evidence: passthrough ? [
            { label: 'Absorber', value: passthrough.domain_alias, severity: 'elevated' },
            { label: 'Role', value: 'PASS_THROUGH', severity: null },
            { label: 'Chain nodes', value: String(total), severity: null },
          ] : [
            { label: 'Chain nodes', value: String(total), severity: null },
          ],
          structuralContext: passthrough
            ? 'Absorption identifies nodes that conduct organizational stress without originating it. This pattern indicates structural coupling rather than independent pressure.'
            : null,
        }
      },
    },
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const ps = (fullReport && fullReport.propagation_summary) || {}
        const origin = blocks.find(b => b && b.propagation_role === 'ORIGIN')
        const passthrough = blocks.find(b => b && b.propagation_role === 'PASS_THROUGH')
        const receiver = blocks.find(b => b && b.propagation_role === 'RECEIVER')
        const chain = [origin, passthrough, receiver].filter(Boolean)
        return {
          summary: chain.length >= 2
            ? `Pressure propagates ${chain.map(n => n.domain_alias).join(' → ')}. This structural chain shows how organizational load transfers through dependency coupling.`
            : 'Propagation chain not fully resolved.',
          evidence: chain.map(n => ({
            label: n.domain_alias,
            value: n.propagation_role,
            severity: n.propagation_role === 'ORIGIN' ? 'critical' : n.propagation_role === 'PASS_THROUGH' ? 'elevated' : 'nominal',
          })),
          structuralContext: ps.primary_zone_business_label
            ? `Primary pressure zone: ${ps.primary_zone_business_label}. Chain structure derived from evidence block propagation roles.`
            : 'Chain structure derived from evidence block propagation roles.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const ps = (fullReport && fullReport.propagation_summary) || {}
        const origin = blocks.find(b => b && b.propagation_role === 'ORIGIN')
        const passthrough = blocks.filter(b => b && b.propagation_role === 'PASS_THROUGH')
        const structuralBarriers = blocks.filter(b => b && b.structural_backing && b.propagation_role !== 'RECEIVER')
        const unbacked = blocks.filter(b => b && !b.structural_backing)
        return {
          summary: passthrough.length > 0
            ? `${passthrough.length} pass-through node${passthrough.length !== 1 ? 's' : ''} conduct pressure without dissipation. ${unbacked.length > 0 ? `${unbacked.length} node${unbacked.length !== 1 ? 's' : ''} lack structural backing — pressure flows through semantic assertion rather than evidenced structure.` : 'All conducting nodes are structurally backed.'}`
            : origin
              ? 'Pressure originates but no pass-through conduction detected — dissipation pathway unclear.'
              : 'No propagation chain available for dissipation analysis.',
          evidence: [
            ...passthrough.map(n => ({
              label: n.domain_alias || 'Pass-through',
              value: n.structural_backing ? 'conducting · backed' : 'conducting · unbacked',
              severity: n.structural_backing ? 'elevated' : 'critical',
            })),
            ...unbacked.slice(0, 2).map(n => ({
              label: n.domain_alias || 'Node',
              value: 'no structural backing',
              severity: 'critical',
            })),
          ].slice(0, 5),
          structuralContext: `Dissipation requires structural boundaries that absorb rather than transmit pressure. ${structuralBarriers.length} node${structuralBarriers.length !== 1 ? 's' : ''} have structural backing in the chain. Unbacked nodes transmit without attenuation — this is the mechanism of systemic pressure amplification.`,
        }
      },
    },
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const sigs = (fullReport && fullReport.signal_interpretations) || []
        const ps = (fullReport && fullReport.propagation_summary) || {}
        const activated = sigs.filter(s => s.severity !== 'NOMINAL')
        const concentrated = {}
        for (const s of activated) {
          const zone = s.concentration || 'unattributed'
          if (!concentrated[zone]) concentrated[zone] = 0
          concentrated[zone]++
        }
        const zones = Object.keys(concentrated)
        const chainLength = blocks.length
        return {
          summary: zones.length > 1
            ? `Absorption spans ${zones.length} concentration zones across ${chainLength} chain nodes — systemic pattern. Pressure is not containable within a single domain boundary.`
            : zones.length === 1
              ? `Absorption is localized to "${zones[0]}" with ${activated.length} activated signal${activated.length !== 1 ? 's' : ''}. Containment is structurally possible within this boundary.`
              : 'No activated signals — absorption pattern is quiescent.',
          evidence: zones.map(z => ({
            label: z,
            value: `${concentrated[z]} signal${concentrated[z] !== 1 ? 's' : ''}`,
            severity: concentrated[z] >= 3 ? 'critical' : concentrated[z] >= 2 ? 'elevated' : 'nominal',
          })),
          structuralContext: ps.primary_zone_business_label
            ? `Primary pressure zone: ${ps.primary_zone_business_label}. Systemic absorption means pressure crosses domain boundaries; localized absorption means it can be addressed within a single structural perimeter.`
            : 'Localized vs systemic classification derived from signal concentration distribution across chain nodes.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const chain = blocks.filter(b => b && (b.propagation_role === 'ORIGIN' || b.propagation_role === 'PASS_THROUGH'))
        const amplifiers = chain.filter(b => !b.structural_backing)
        return {
          summary: amplifiers.length > 0
            ? `${amplifiers.length} unbacked node${amplifiers.length !== 1 ? 's' : ''} in the dependency chain amplify absorption — pressure passes through without structural attenuation.`
            : chain.length > 0
              ? `All ${chain.length} dependency chain nodes are structurally backed. No amplification detected.`
              : 'Dependency chain not resolved — amplification analysis unavailable.',
          evidence: chain.map(n => ({
            label: n.domain_alias || n.domain_id || 'Node',
            value: `${n.propagation_role}${n.structural_backing ? '' : ' · unbacked'}`,
            severity: n.structural_backing ? 'nominal' : 'critical',
          })),
          structuralContext: 'Amplification occurs when pressure traverses unbacked nodes — these transmit load without the structural capacity to absorb it. Each unbacked link compounds downstream exposure.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const withConfidence = blocks.filter(b => b && b.evidence_confidence != null)
        const lowConfidence = withConfidence.filter(b => b.evidence_confidence < 0.5)
        const corridor = blocks.map(b => ({
          alias: b.domain_alias || b.domain_id || 'Unknown',
          confidence: b.evidence_confidence,
          role: b.propagation_role,
        }))
        return {
          summary: lowConfidence.length > 0
            ? `Evidence continuity weakens at ${lowConfidence.length} node${lowConfidence.length !== 1 ? 's' : ''} in the propagation corridor. ${lowConfidence.map(b => b.domain_alias || b.domain_id).join(', ')} ${lowConfidence.length === 1 ? 'has' : 'have'} confidence below 0.5.`
            : withConfidence.length > 0
              ? `Evidence continuity holds across all ${withConfidence.length} corridor nodes. No confidence degradation detected.`
              : 'No evidence confidence data available across the propagation corridor.',
          evidence: corridor.filter(n => n.confidence != null).slice(0, 5).map(n => ({
            label: n.alias,
            value: `${n.confidence.toFixed(2)} · ${n.role}`,
            severity: n.confidence < 0.5 ? 'critical' : n.confidence < 0.7 ? 'elevated' : 'nominal',
          })),
          structuralContext: null,
        }
      },
    },
  ],
  signalAssessment: [
    {
      derive: (fullReport) => {
        const sigs = (fullReport && fullReport.signal_interpretations) || []
        const activated = sigs.filter(s => s.severity !== 'NOMINAL')
        const critical = activated.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
        const elevated = activated.filter(s => s.severity === 'ELEVATED')
        return {
          summary: activated.length > 0
            ? `${activated.length} of ${sigs.length} signals are elevated. ${critical.length > 0 ? `${critical.length} at critical/high severity require structural attention.` : 'No critical-tier signals detected.'}`
            : `All ${sigs.length} signals are within nominal parameters. No structural elevation detected.`,
          evidence: activated.length > 0
            ? activated.map(s => ({
              label: s.signal_id || 'Signal',
              value: s.severity,
              severity: (s.severity === 'CRITICAL' || s.severity === 'HIGH') ? 'critical' : 'elevated',
            }))
            : [{ label: 'All signals', value: 'NOMINAL', severity: 'nominal' }],
          structuralContext: `Signal assessment: ${sigs.length} total · ${activated.length} activated · ${sigs.length - activated.length} nominal. Thresholds are deterministic from structural evidence.`,
        }
      },
    },
    {
      derive: (fullReport) => {
        const sigs = (fullReport && fullReport.signal_interpretations) || []
        const activated = sigs.filter(s => s.severity !== 'NOMINAL')
        const concentrated = {}
        for (const s of activated) {
          const zone = s.concentration || 'unattributed'
          if (!concentrated[zone]) concentrated[zone] = 0
          concentrated[zone]++
        }
        const zones = Object.entries(concentrated)
        return {
          summary: zones.length > 1
            ? `Elevated signals are distributed across ${zones.length} concentration zones. This indicates systemic rather than localized structural conditions.`
            : zones.length === 1
              ? `All ${activated.length} elevated signals concentrate on "${zones[0][0]}". This indicates localized structural pressure.`
              : 'No elevated signals to analyze for concentration.',
          evidence: zones.map(([zone, count]) => ({
            label: zone,
            value: `${count} signal${count !== 1 ? 's' : ''}`,
            severity: count >= 3 ? 'critical' : count >= 2 ? 'elevated' : 'nominal',
          })),
          structuralContext: 'Concentration analysis maps signal activation to domain attribution. Systemic distribution suggests structural coupling; localized distribution suggests isolated pressure.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const sigs = (fullReport && fullReport.signal_interpretations) || []
        const rs = (fullReport && fullReport.readiness_summary) || {}
        const activated = sigs.filter(s => s.severity !== 'NOMINAL')
        const critical = activated.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
        const elevated = activated.filter(s => s.severity === 'ELEVATED')
        const confidenceScore = rs.weighted_confidence_score
        return {
          summary: critical.length > 1
            ? `${critical.length} critical/high signals compound to compress executive confidence${confidenceScore != null ? ` — weighted score: ${confidenceScore}` : ''}. This combination creates structural conditions that exceed individual signal severity.`
            : critical.length === 1
              ? `Single critical signal (${critical[0].signal_id || 'unidentified'}) compresses confidence${confidenceScore != null ? ` to ${confidenceScore}` : ''}. ${elevated.length > 0 ? `${elevated.length} elevated signal${elevated.length !== 1 ? 's' : ''} provide compounding context.` : 'No elevated signals compound the condition.'}`
              : elevated.length > 0
                ? `${elevated.length} elevated signal${elevated.length !== 1 ? 's' : ''} present but no critical-tier compression detected.`
                : 'No signal compression — all signals within nominal parameters.',
          evidence: [
            ...critical.map(s => ({
              label: s.signal_id || 'Critical signal',
              value: s.severity,
              severity: 'critical',
            })),
            ...elevated.slice(0, 3).map(s => ({
              label: s.signal_id || 'Elevated signal',
              value: s.severity,
              severity: 'elevated',
            })),
          ].slice(0, 5),
          structuralContext: confidenceScore != null
            ? `Weighted confidence: ${confidenceScore}. Signal combination effects are multiplicative — two elevated signals in dependent domains compress confidence more than their individual severities suggest. Confidence score integrates all signal interactions.`
            : 'Signal compression is assessed by counting co-occurring critical and elevated signals across dependent domains. No weighted confidence score available for quantitative assessment.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const sigs = (fullReport && fullReport.signal_interpretations) || []
        const activated = sigs.filter(s => s.severity !== 'NOMINAL')
        const isolated = sigs.filter(s => s.severity === 'NOMINAL')
        return {
          summary: isolated.length > 0
            ? `${isolated.length} of ${sigs.length} signals remain structurally isolated at nominal.`
            : 'No isolated signals — all signals are activated.',
          evidence: isolated.slice(0, 3).map(s => ({
            label: s.signal_id || 'Signal',
            value: 'NOMINAL',
            severity: 'nominal',
          })),
          structuralContext: null,
        }
      },
    },
    {
      derive: (fullReport) => {
        const sigs = (fullReport && fullReport.signal_interpretations) || []
        const activated = sigs.filter(s => s.severity !== 'NOMINAL')
        const bySeverity = {}
        for (const s of activated) {
          const sev = s.severity || 'UNKNOWN'
          if (!bySeverity[sev]) bySeverity[sev] = []
          bySeverity[sev].push(s)
        }
        const tiers = Object.entries(bySeverity).sort((a, b) => {
          const order = { CRITICAL: 0, HIGH: 1, ELEVATED: 2 }
          return (order[a[0]] ?? 3) - (order[b[0]] ?? 3)
        })
        const dominant = tiers[0]
        return {
          summary: dominant
            ? `${dominant[0]} tier dominates with ${dominant[1].length} signal${dominant[1].length !== 1 ? 's' : ''} — this is the structural asymmetry shaping the signal field. ${tiers.length > 1 ? `${tiers.length - 1} other tier${tiers.length - 1 !== 1 ? 's' : ''} provide secondary context.` : 'No other severity tiers are active.'}`
            : 'No structural asymmetry — all signals are nominal.',
          evidence: tiers.map(([sev, items]) => ({
            label: sev,
            value: `${items.length} signal${items.length !== 1 ? 's' : ''}`,
            severity: sev === 'CRITICAL' || sev === 'HIGH' ? 'critical' : 'elevated',
          })),
          structuralContext: 'Structural asymmetry identifies which severity tier carries the most signals. When one tier dominates, it shapes executive attention and qualification posture more than the aggregate count suggests.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const sigs = (fullReport && fullReport.signal_interpretations) || []
        const qs = (fullReport && fullReport.qualifier_summary) || {}
        const activated = sigs.filter(s => s.severity !== 'NOMINAL')
        const advisoryBound = activated.filter(s => s.advisory_only || s.qualification_status === 'ADVISORY')
        const verified = activated.filter(s => !s.advisory_only && s.qualification_status !== 'ADVISORY')
        return {
          summary: advisoryBound.length > 0 && verified.length > 0
            ? `${verified.length} signal${verified.length !== 1 ? 's' : ''} structurally verified, ${advisoryBound.length} advisory-bound. Advisory signals carry weight in narrative but not in qualification progression.`
            : advisoryBound.length > 0
              ? `All ${advisoryBound.length} elevated signals are advisory-bound — they inform executive awareness but do not block qualification advancement.`
              : verified.length > 0
                ? `All ${verified.length} elevated signals are structurally verified — each contributes to qualification posture.`
                : 'No elevated signals to classify.',
          evidence: [
            ...verified.slice(0, 3).map(s => ({
              label: s.signal_id || 'Signal',
              value: 'structurally verified',
              severity: 'elevated',
            })),
            ...advisoryBound.slice(0, 2).map(s => ({
              label: s.signal_id || 'Signal',
              value: 'advisory-bound',
              severity: 'nominal',
            })),
          ].slice(0, 5),
          structuralContext: qs.active_qualifiers != null
            ? `${qs.active_qualifiers} active qualifiers in the current posture. Advisory-bound signals are excluded from qualifier gates under Q-02 governance but remain visible in the signal field.`
            : 'Advisory vs verified classification determines whether a signal affects qualification gates. Advisory-bound signals are governed by Q-02 disclosure but excluded from progression criteria.',
        }
      },
    },
  ],
  propagationFlow: [
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const ts = (fullReport && fullReport.topology_summary) || {}
        const origin = blocks.find(b => b && b.propagation_role === 'ORIGIN')
        const passthrough = blocks.find(b => b && b.propagation_role === 'PASS_THROUGH')
        const receiver = blocks.find(b => b && b.propagation_role === 'RECEIVER')
        const chain = [origin, passthrough, receiver].filter(Boolean)
        return {
          summary: chain.length >= 2
            ? `Full structural dependency: ${chain.map(n => `${n.domain_alias} (${n.propagation_role})`).join(' → ')}. ${ts.structurally_backed_count || 0} of ${ts.semantic_domain_count || 0} domains are structurally grounded.`
            : 'Propagation chain not fully available.',
          evidence: chain.map(n => ({
            label: n.domain_alias,
            value: `${n.propagation_role}${n.structural_backing ? ' · backed' : ' · semantic'}`,
            severity: n.structural_backing ? 'nominal' : 'elevated',
          })),
          structuralContext: 'Propagation flow maps how structural dependency connects domains. Each link in the chain represents organizational coupling verified by evidence block classification.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const ts = (fullReport && fullReport.topology_summary) || {}
        const backed = ts.structurally_backed_count || 0
        const total = ts.semantic_domain_count || 0
        return {
          summary: blocks.length > 0
            ? `${blocks.length} propagation chain links have evidence backing. ${backed} of ${total} total domains are structurally grounded through reconciliation correspondence.`
            : 'No evidence available for propagation chain verification.',
          evidence: blocks.map(b => ({
            label: `${b.domain_alias} → ${b.propagation_role}`,
            value: b.structural_backing ? 'Evidence confirmed' : 'Semantic only',
            severity: b.structural_backing ? 'nominal' : 'elevated',
          })),
          structuralContext: 'Each propagation link is verified against the evidence rebase corridor. Links without structural backing carry advisory weight only under Q-02 governance.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const ps = (fullReport && fullReport.propagation_summary) || {}
        const unbacked = blocks.filter(b => b && !b.structural_backing)
        const receivers = blocks.filter(b => b && b.propagation_role === 'RECEIVER')
        const unbackedReceivers = receivers.filter(b => !b.structural_backing)
        return {
          summary: unbackedReceivers.length > 0
            ? `Propagation containment fails at ${unbackedReceivers.length} receiver node${unbackedReceivers.length !== 1 ? 's' : ''} — pressure reaches endpoints without structural verification. ${unbacked.length > unbackedReceivers.length ? `${unbacked.length - unbackedReceivers.length} additional unbacked node${unbacked.length - unbackedReceivers.length !== 1 ? 's' : ''} in the chain compound the failure.` : ''}`
            : unbacked.length > 0
              ? `${unbacked.length} unbacked node${unbacked.length !== 1 ? 's' : ''} in the chain but receiver endpoints are structurally verified — containment holds at boundaries.`
              : blocks.length > 0
                ? 'Propagation containment intact — all chain nodes are structurally backed.'
                : 'No propagation chain available for containment analysis.',
          evidence: [
            ...unbackedReceivers.map(b => ({
              label: b.domain_alias || 'Receiver',
              value: 'unbacked receiver — containment breach',
              severity: 'critical',
            })),
            ...unbacked.filter(b => b.propagation_role !== 'RECEIVER').slice(0, 3).map(b => ({
              label: b.domain_alias || 'Node',
              value: `unbacked ${b.propagation_role || 'node'}`,
              severity: 'elevated',
            })),
          ].slice(0, 5),
          structuralContext: `Containment failure means pressure propagates to organizational endpoints without evidence-backed structural boundaries. This is the most critical propagation condition — it indicates that downstream domains absorb load they cannot structurally verify.${ps.primary_zone_business_label ? ` Primary zone: ${ps.primary_zone_business_label}.` : ''}`,
        }
      },
    },
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const backed = blocks.filter(b => b && b.structural_backing)
        const critical = backed.filter(b => b.propagation_role === 'ORIGIN' || b.propagation_role === 'PASS_THROUGH')
        const unbypassed = critical.filter(b => {
          const dependents = blocks.filter(d => d && d.dependency_source === b.domain_id)
          return dependents.length > 0
        })
        return {
          summary: critical.length > 0
            ? `${critical.length} structural node${critical.length !== 1 ? 's' : ''} in the dependency chain cannot be bypassed — ${critical.map(b => b.domain_alias || b.domain_id).join(', ')}. These are load-bearing structural links.`
            : blocks.length > 0
              ? 'No irreducible structural dependencies detected in the current chain.'
              : 'Propagation chain not available for dependency analysis.',
          evidence: critical.map(b => ({
            label: b.domain_alias || b.domain_id || 'Node',
            value: `${b.propagation_role} · structural`,
            severity: 'elevated',
          })),
          structuralContext: 'Irreducible dependencies are chain nodes that cannot be removed without breaking the propagation path. They represent structural commitments — organizational architecture that is load-bearing by design, not by accident.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const receivers = blocks.filter(b => b && b.propagation_role === 'RECEIVER')
        const ungroundedReceivers = receivers.filter(b => !b.structural_backing)
        return {
          summary: ungroundedReceivers.length > 0
            ? `${ungroundedReceivers.length} receiver domain${ungroundedReceivers.length !== 1 ? 's' : ''} inherit pressure without structural grounding: ${ungroundedReceivers.map(b => b.domain_alias || b.domain_id).join(', ')}.`
            : receivers.length > 0
              ? `All ${receivers.length} receiver domains are structurally grounded.`
              : 'No receiver domains identified in the propagation chain.',
          evidence: ungroundedReceivers.length > 0
            ? ungroundedReceivers.map(b => ({
                label: b.domain_alias || b.domain_id || 'Receiver',
                value: 'semantic only — inheriting pressure',
                severity: 'critical',
              }))
            : receivers.map(b => ({
                label: b.domain_alias || b.domain_id || 'Receiver',
                value: 'structurally grounded',
                severity: 'nominal',
              })),
          structuralContext: 'Ungrounded receivers absorb propagated pressure without evidence-backed structural capacity. Under Q-02 governance, their absorbed load carries advisory weight only — but the organizational exposure is real regardless of qualification status.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const withConfidence = blocks.filter(b => b && b.evidence_confidence != null)
        const sorted = [...withConfidence].sort((a, b) => (a.evidence_confidence || 0) - (b.evidence_confidence || 0))
        const weakest = sorted[0]
        return {
          summary: weakest
            ? `Highest evidence uncertainty at ${weakest.domain_alias || weakest.domain_id} (${weakest.propagation_role}) — confidence ${weakest.evidence_confidence.toFixed(2)}.`
            : 'No evidence confidence data available for uncertainty ranking.',
          evidence: sorted.slice(0, 3).map(b => ({
            label: b.domain_alias || b.domain_id || 'Node',
            value: `${b.evidence_confidence.toFixed(2)} · ${b.propagation_role}`,
            severity: b.evidence_confidence < 0.5 ? 'critical' : b.evidence_confidence < 0.7 ? 'elevated' : 'nominal',
          })),
          structuralContext: null,
        }
      },
    },
  ],
  pressureZoneFocus: [
    {
      derive: (fullReport) => {
        const ps = (fullReport && fullReport.propagation_summary) || {}
        const sigs = (fullReport && fullReport.signal_interpretations) || []
        const zoneName = ps.primary_zone_business_label
        const activated = sigs.filter(s => s.severity !== 'NOMINAL')
        const critical = activated.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
        return {
          summary: zoneName
            ? `Pressure concentrates on "${zoneName}" with ${activated.length} elevated signal${activated.length !== 1 ? 's' : ''}${critical.length > 0 ? ` (${critical.length} critical/high)` : ''}. ${activated.length > 2 ? 'Multi-signal activation indicates compound structural conditions.' : 'Signal activation is structurally bounded.'}`
            : 'No primary pressure zone identified.',
          evidence: zoneName ? [
            { label: 'Primary zone', value: zoneName, severity: critical.length > 0 ? 'critical' : 'elevated' },
            { label: 'Elevated signals', value: String(activated.length), severity: activated.length > 2 ? 'critical' : activated.length > 0 ? 'elevated' : 'nominal' },
            { label: 'Critical/high', value: String(critical.length), severity: critical.length > 0 ? 'critical' : 'nominal' },
          ] : [],
          structuralContext: zoneName
            ? `Zone classification: ${ps.zone_classification || 'UNCLASSIFIED'}. Pressure zone derived from propagation summary — structural, not inferred.`
            : null,
        }
      },
    },
    {
      derive: (fullReport) => {
        const ts = (fullReport && fullReport.topology_summary) || {}
        const backed = ts.structurally_backed_count || 0
        const total = ts.semantic_domain_count || 0
        const semantic = total - backed
        return {
          summary: semantic > 0
            ? `${semantic} semantic-only domain${semantic !== 1 ? 's' : ''} represent unresolved qualification gaps. These domains carry advisory weight only and affect progression toward the next S-state.`
            : 'All domains are structurally backed. No qualification gaps from unresolved semantic claims.',
          evidence: [
            { label: 'Unresolved domains', value: String(semantic), severity: semantic > 0 ? 'elevated' : 'nominal' },
            { label: 'Total domains', value: String(total), severity: null },
            { label: 'Backed domains', value: String(backed), severity: 'nominal' },
          ],
          structuralContext: 'Qualification progression requires structural backing for semantic claims. Each unresolved domain represents a gap between what is claimed and what is evidenced.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const ps = (fullReport && fullReport.propagation_summary) || {}
        const sigs = (fullReport && fullReport.signal_interpretations) || []
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const critical = sigs.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
        const unbacked = blocks.filter(b => b && !b.structural_backing)
        const multiZone = new Set(sigs.filter(s => s.severity !== 'NOMINAL').map(s => s.concentration)).size > 1
        return {
          summary: critical.length > 1 && unbacked.length > 0 && multiZone
            ? `Systemic instability conditions present: ${critical.length} critical signals, ${unbacked.length} unbacked node${unbacked.length !== 1 ? 's' : ''}, multi-zone distribution. This combination creates compound structural exposure that exceeds individual risk factors.`
            : critical.length > 1
              ? `${critical.length} critical signals create potential instability but structural backing limits propagation.`
              : critical.length === 1
                ? `Single critical signal — instability risk is bounded. ${unbacked.length > 0 ? 'Unbacked nodes could amplify if a second critical signal emerges.' : 'Chain is structurally contained.'}`
                : 'No conditions for systemic instability detected. Signal field is within containment parameters.',
          evidence: [
            { label: 'Critical signals', value: String(critical.length), severity: critical.length > 1 ? 'critical' : critical.length > 0 ? 'elevated' : 'nominal' },
            { label: 'Unbacked nodes', value: String(unbacked.length), severity: unbacked.length > 0 ? 'critical' : 'nominal' },
            { label: 'Multi-zone', value: multiZone ? 'YES — systemic' : 'NO — localized', severity: multiZone ? 'elevated' : 'nominal' },
          ],
          structuralContext: `Systemic instability emerges from the combination of: (1) multiple critical signals, (2) unbacked propagation nodes, and (3) multi-zone signal distribution. Any two of three indicates elevated risk. All three indicates compound structural exposure.${ps.primary_zone_business_label ? ` Primary zone: ${ps.primary_zone_business_label}.` : ''}`,
        }
      },
    },
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const ps = (fullReport && fullReport.propagation_summary) || {}
        const backed = blocks.filter(b => b && b.structural_backing)
        const receivers = blocks.filter(b => b && b.propagation_role === 'RECEIVER')
        const containingNodes = backed.filter(b => b.propagation_role !== 'RECEIVER')
        return {
          summary: containingNodes.length > 0
            ? `Pressure zone bounded by ${containingNodes.length} structurally backed node${containingNodes.length !== 1 ? 's' : ''}: ${containingNodes.map(b => b.domain_alias || b.domain_id).join(', ')}. These form the structural perimeter preventing uncontrolled propagation.`
            : backed.length > 0
              ? `${backed.length} backed node${backed.length !== 1 ? 's' : ''} in the chain but none form a clear containment boundary — pressure may propagate beyond the identified zone.`
              : 'No structural containment boundary identified. Pressure zone is unbounded.',
          evidence: containingNodes.map(b => ({
            label: b.domain_alias || b.domain_id || 'Node',
            value: `${b.propagation_role} · structural boundary`,
            severity: 'nominal',
          })).concat(
            receivers.filter(b => !b.structural_backing).map(b => ({
              label: b.domain_alias || b.domain_id || 'Receiver',
              value: 'outside containment',
              severity: 'elevated',
            }))
          ).slice(0, 5),
          structuralContext: `Structural boundaries contain pressure by absorbing load at backed nodes. ${ps.primary_zone_business_label ? `Zone "${ps.primary_zone_business_label}" ` : 'The zone '}is contained when all paths from origin to receiver pass through at least one structurally backed intermediary.`,
        }
      },
    },
    {
      derive: (fullReport) => {
        const rs = (fullReport && fullReport.readiness_summary) || {}
        const qs = (fullReport && fullReport.qualifier_summary) || {}
        const ps = (fullReport && fullReport.propagation_summary) || {}
        const currentState = rs.current_s_state || rs.s_state || 'UNKNOWN'
        const qualifiers = qs.active_qualifiers
        const posture = qs.qualification_posture || rs.qualification_posture || 'UNRESOLVED'
        return {
          summary: posture !== 'UNRESOLVED'
            ? `Qualification posture: ${posture} at ${currentState}. ${qualifiers != null ? `${qualifiers} active qualifier${qualifiers !== 1 ? 's' : ''} govern the pressure zone.` : 'Qualifier count not available.'} Pressure zone conditions must resolve before posture advancement.`
            : `Qualification posture unresolved at ${currentState}. Pressure zone prevents definitive qualification assessment.`,
          evidence: [
            { label: 'S-state', value: currentState, severity: null },
            { label: 'Posture', value: posture, severity: posture === 'UNRESOLVED' ? 'elevated' : 'nominal' },
            ...(qualifiers != null ? [{ label: 'Active qualifiers', value: String(qualifiers), severity: qualifiers > 0 ? 'elevated' : 'nominal' }] : []),
            ...(ps.primary_zone_business_label ? [{ label: 'Pressure zone', value: ps.primary_zone_business_label, severity: 'elevated' }] : []),
          ],
          structuralContext: 'Qualification posture reflects the combined assessment of structural evidence, signal conditions, and qualifier gates. The pressure zone modifies posture by introducing conditions that must resolve before the next qualification threshold can be crossed.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const blocks = (fullReport && fullReport.evidence_blocks) || []
        const sigs = (fullReport && fullReport.signal_interpretations) || []
        const ps = (fullReport && fullReport.propagation_summary) || {}
        const domains = (fullReport && fullReport.semantic_domain_registry) || []
        const propagationAliases = new Set(blocks.map(b => b.domain_alias || b.domain_id).filter(Boolean))
        const outside = domains.filter(d => !propagationAliases.has(d.domain_name) && !propagationAliases.has(d.domain_id))
        return {
          summary: outside.length > 0
            ? `${outside.length} domain${outside.length !== 1 ? 's' : ''} outside the propagation path.`
            : domains.length > 0
              ? 'All registered domains are within the propagation path.'
              : 'No domain registry available for propagation path analysis.',
          evidence: outside.slice(0, 3).map(d => ({
            label: d.domain_name || d.domain_id || 'Domain',
            value: 'outside propagation',
            severity: 'nominal',
          })),
          structuralContext: null,
        }
      },
    },
  ],
  governanceLifecycle: [
    {
      derive: (fullReport) => {
        const gl = fullReport && fullReport.governance_lifecycle
        if (!gl || !gl.available) return { summary: 'Governance lifecycle data not available for this run.', evidence: [], structuralContext: null }
        return {
          summary: `${gl.s_level} qualification via ${(gl.qualification_provenance || '').replace(/_/g, ' ')}. Authority ceiling: ${gl.authority_ceiling || 'unknown'}. ${gl.transition_count || 0} state transition${gl.transition_count !== 1 ? 's' : ''} in the governed lifecycle.`,
          evidence: (gl.transitions || []).map(t => ({
            label: `${t.from} → ${t.to}`,
            value: t.action || 'transition',
            severity: t.to === 'S2' ? 'nominal' : 'elevated',
          })).concat([
            { label: 'Provenance', value: (gl.qualification_provenance || '').replace(/_/g, ' '), severity: 'nominal' },
            { label: 'Authority ceiling', value: gl.authority_ceiling || '—', severity: 'nominal' },
          ]),
          structuralContext: gl.hold_reason
            ? `Note: ${gl.hold_reason}`
            : 'Governance lifecycle completed without holds or blocks.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const pc = fullReport && fullReport.proposition_corpus
        if (!pc || !pc.available) return { summary: 'Proposition review data not available.', evidence: [], structuralContext: null }
        const dc = pc.disposition_counts || {}
        const friction = dc.rejected + dc.arbitrated + dc.contested
        return {
          summary: `${pc.total} propositions reviewed. ${dc.accepted} accepted, ${dc.rejected} rejected, ${dc.arbitrated} arbitrated. ${pc.flagged_count} flagged for operator attention. Governance friction rate: ${(pc.governance_friction_rate * 100).toFixed(1)}%.`,
          evidence: [
            { label: 'Accepted', value: String(dc.accepted), severity: 'nominal' },
            { label: 'Rejected', value: String(dc.rejected), severity: dc.rejected > 0 ? 'elevated' : 'nominal' },
            { label: 'Arbitrated', value: String(dc.arbitrated), severity: dc.arbitrated > 0 ? 'elevated' : 'nominal' },
            { label: 'Flagged', value: String(pc.flagged_count), severity: pc.flagged_count > 0 ? 'elevated' : 'nominal' },
            { label: 'Friction rate', value: `${(pc.governance_friction_rate * 100).toFixed(1)}%`, severity: pc.governance_friction_rate > 0.1 ? 'critical' : pc.governance_friction_rate > 0 ? 'elevated' : 'nominal' },
          ],
          structuralContext: friction > 0
            ? `Governance friction is evidence that review was substantive — ${friction} proposition${friction !== 1 ? 's were' : ' was'} challenged. Friction rate above 0% demonstrates non-rubber-stamp governance.`
            : 'All propositions accepted without friction. Review was substantive but found no grounds for challenge.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const ca = fullReport && fullReport.constitutional_anchor
        if (!ca || !ca.available) return { summary: 'Constitutional anchor data not available.', evidence: [], structuralContext: null }
        return {
          summary: `Constitutional distance: ${ca.overall_verdict ? ca.overall_verdict.replace(/_/g, ' ') : 'unknown'}. ${ca.summary.passed || 0}/${ca.summary.total || 0} dimensions PASS. Target: ${ca.target_level || '—'}. Reference specimen: ${ca.reference_specimen || '—'}.`,
          evidence: (ca.dimensions || []).map(dim => ({
            label: dim.dimension,
            value: dim.ratio != null ? `${dim.ratio.toFixed(2)} (threshold: ${dim.threshold})` : `${dim.candidate}`,
            severity: dim.verdict === 'PASS' ? 'nominal' : dim.severity === 'CRITICAL' ? 'critical' : 'elevated',
          })),
          structuralContext: ca.advancement_blocked
            ? 'Constitutional distance blocks advancement — specimen does not meet minimum adequacy threshold on one or more critical dimensions.'
            : 'All constitutional dimensions within acceptable distance. Advancement is not blocked by semantic adequacy.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const ei = fullReport && fullReport.enrichment_intelligence
        if (!ei || !ei.available) return { summary: 'Enrichment data not available.', evidence: [], structuralContext: null }
        const evidence = [
          { label: 'Enrichment events', value: String(ei.enrichment_events), severity: ei.enrichment_events > 10 ? 'elevated' : 'nominal' },
          { label: 'Domains corrected', value: String(ei.domains_corrected), severity: ei.domains_corrected > 5 ? 'elevated' : 'nominal' },
          { label: 'Domains confirmed', value: String(ei.domains_confirmed), severity: 'nominal' },
          { label: 'No SDC match', value: String(ei.domains_no_sdc_match), severity: ei.domains_no_sdc_match > 0 ? 'elevated' : 'nominal' },
        ]
        if (ei.debt && ei.debt.available) {
          evidence.push(
            { label: 'Debt improved', value: String(ei.debt.improved), severity: 'nominal' },
            { label: 'Debt worsened', value: String(ei.debt.worsened), severity: ei.debt.worsened > 0 ? 'elevated' : 'nominal' },
          )
        }
        return {
          summary: `${ei.enrichment_events} evidence corrections across ${ei.domains_corrected} domains. ${ei.capabilities_domain_corrected} capabilities had domain references corrected.`
            + (ei.debt && ei.debt.available ? ` Debt evolution: ${ei.debt.improved} improved, ${ei.debt.worsened} worsened, ${ei.debt.unchanged} unchanged of ${ei.debt.total_items} items.` : ''),
          evidence,
          structuralContext: 'Enrichment is deterministic re-extraction from source evidence. Corrections reflect alignment between structural artifacts and semantic claims, not inference.',
        }
      },
    },
    {
      derive: (fullReport) => {
        const ci = fullReport && fullReport.convergence_intelligence
        if (!ci || !ci.available) return { summary: 'Convergence data not available.', evidence: [], structuralContext: null }
        return {
          summary: `${ci.total_observations} cross-specimen observations at ${ci.observation_maturity || 'unknown'} maturity. ${ci.convergences.length} convergences, ${ci.divergences.length} divergences, ${ci.mixed.length} mixed. ${ci.verdict || ''}`,
          evidence: (ci.observations || []).slice(0, 5).map(o => ({
            label: o.title || o.observation_id,
            value: o.divergence ? 'convergence + divergence' : 'convergence',
            severity: o.divergence ? 'elevated' : 'nominal',
          })),
          structuralContext: ci.observation_maturity === 'DESCRIPTIVE'
            ? 'Two specimens = comparison, not pattern. All observations are DESCRIPTIVE — convergence claims require additional specimens for law-level assertions.'
            : `Observation maturity: ${ci.observation_maturity}. Convergence strength proportional to specimen count.`,
        }
      },
    },
    {
      derive: (fullReport) => {
        const cc = fullReport && fullReport.chronicle_certification
        if (!cc || !cc.available) return { summary: 'Chronicle certification data not available.', evidence: [], structuralContext: null }
        const pb = cc.phase_breakdown || {}
        return {
          summary: `${cc.certification_status}: ${cc.passed}/${cc.total_checks} checks PASS across ${cc.phase_count} phases. ${cc.failed > 0 ? `${cc.failed} checks FAILED.` : 'No failures.'}`,
          evidence: Object.entries(pb).map(([phase, data]) => ({
            label: phase.replace(/_/g, ' '),
            value: `${data.passed}/${data.total} PASS`,
            severity: data.failed > 0 ? 'critical' : 'nominal',
          })),
          structuralContext: cc.governed_lifecycle_summary
            ? `Governed lifecycle: ${cc.governed_lifecycle_summary.s_level} via ${cc.governed_lifecycle_summary.provenance || 'unknown'}. ${cc.governed_lifecycle_summary.propositions || 0} propositions. Revalidation: ${cc.governed_lifecycle_summary.revalidation || 'unknown'}.`
            : 'Chronicle certification verifies end-to-end governed lifecycle integrity.',
        }
      },
    },
  ],
}

const INTERROGATION_EXPANSION_REGISTRY = {
  boardroom: (fullReport) => {
    const rs = (fullReport && fullReport.readiness_summary) || {}
    const ts = (fullReport && fullReport.topology_summary) || {}
    const sigs = (fullReport && fullReport.signal_interpretations) || []
    const backed = ts.structurally_backed_count || 0
    const total = ts.semantic_domain_count || 0
    const posture = (rs.posture || 'INVESTIGATE').toUpperCase()
    const activated = sigs.filter(s => s.severity !== 'NOMINAL')
    const critical = activated.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
    return [
      {
        question: `What structural conditions produce the ${posture} posture?`,
        expansionType: 'structural_expansion',
        tone: 'executive', depth: 'standard',
        boundary: 'Posture derived from readiness scoring thresholds — deterministic.',
        derive: (fr) => {
          const r = (fr && fr.readiness_summary) || {}
          const score = r.score || 0
          const band = r.band || '—'
          return {
            summary: `${posture} posture is produced by readiness score ${score} (band: ${band}). ${critical.length > 0 ? `${critical.length} critical/high signal${critical.length !== 1 ? 's' : ''} contribute to posture compression.` : 'No critical signals contribute to current posture.'}`,
            evidence: [
              { label: 'Readiness score', value: String(score), severity: score < 50 ? 'critical' : score < 70 ? 'elevated' : 'nominal' },
              { label: 'Band', value: band, severity: band === 'STRONG' ? 'nominal' : 'elevated' },
              { label: 'Critical signals', value: String(critical.length), severity: critical.length > 0 ? 'critical' : 'nominal' },
            ],
            structuralContext: 'Posture is a deterministic output of the readiness scoring engine. Band thresholds and signal severity combine to produce posture classification.',
          }
        },
      },
      {
        question: 'What structural evidence boundary constrains executive confidence?',
        expansionType: 'resolution',
        tone: 'containment', depth: 'deep',
        boundary: 'Evidence boundary from topology grounding ratio — deterministic.',
        derive: (fr) => {
          const t = (fr && fr.topology_summary) || {}
          const b = t.structurally_backed_count || 0
          const tot = t.semantic_domain_count || 0
          const sem = Math.max(0, tot - b)
          const ratio = tot > 0 ? Math.round(b / tot * 100) : 0
          const blocks = (fr && fr.evidence_blocks) || []
          const semOnly = blocks.filter(bl => bl && bl.structural_backing === 'SEMANTIC_ONLY')
          return {
            summary: `Executive confidence is bounded by ${ratio}% structural grounding. ${sem} domain${sem !== 1 ? 's' : ''} operate on semantic assertion without structural proof. ${semOnly.length > 0 ? `${semOnly.length} evidence block${semOnly.length !== 1 ? 's' : ''} carry SEMANTIC_ONLY backing.` : 'All evidence blocks have structural backing.'}`,
            evidence: [
              { label: 'Grounding ratio', value: `${ratio}%`, severity: ratio < 50 ? 'critical' : ratio < 80 ? 'elevated' : 'nominal' },
              { label: 'Ungrounded domains', value: String(sem), severity: sem > 0 ? 'elevated' : 'nominal' },
              { label: 'Semantic-only blocks', value: String(semOnly.length), severity: semOnly.length > 0 ? 'elevated' : 'nominal' },
            ],
            structuralContext: `${b} of ${tot} domains have structural backing from reconciliation correspondence. The remaining ${sem} are advisory-bound — their claims are operationally useful but structurally unverified. This defines the boundary of deterministic confidence.`,
          }
        },
      },
      {
        question: 'Where does structural pressure concentrate and what does it propagate?',
        expansionType: 'traversal',
        tone: 'forensic', depth: 'standard',
        boundary: 'Pressure from signal interpretations and propagation summary — deterministic.',
        derive: (fr) => {
          const p = (fr && fr.propagation_summary) || {}
          const s = (fr && fr.signal_interpretations) || []
          const zone = p.primary_zone_business_label || 'unknown'
          const act = s.filter(sig => sig.severity !== 'NOMINAL')
          return {
            summary: act.length > 0
              ? `Pressure concentrates around "${zone}" with ${act.length} elevated signal${act.length !== 1 ? 's' : ''}. ${p.zone_classification ? `Zone classification: ${p.zone_classification}.` : ''}`
              : `No significant pressure concentration detected. Zone: "${zone}".`,
            evidence: [
              { label: 'Primary zone', value: zone, severity: act.length > 0 ? 'elevated' : 'nominal' },
              { label: 'Elevated signals', value: String(act.length), severity: act.length >= 3 ? 'critical' : act.length > 0 ? 'elevated' : 'nominal' },
              ...(p.zone_classification ? [{ label: 'Zone class', value: p.zone_classification, severity: p.zone_classification === 'NOMINAL' ? 'nominal' : 'elevated' }] : []),
            ],
            structuralContext: 'Pressure concentration is derived from signal severity distribution and propagation zone classification. Not an interpretation — a structural measurement.',
          }
        },
      },
      {
        question: 'What would change the current posture band?',
        expansionType: 'continuity_probe',
        tone: 'reflective', depth: 'standard',
        boundary: 'Band thresholds from readiness summary — deterministic.',
        derive: (fr) => {
          const r = (fr && fr.readiness_summary) || {}
          const score = r.score || 0
          const band = r.band || '—'
          const nextBand = band === 'INVESTIGATE' ? 'CAUTIOUS' : band === 'CAUTIOUS' ? 'MODERATE' : band === 'MODERATE' ? 'STRONG' : 'beyond current scale'
          return {
            summary: `Current band: ${band} (score: ${score}). To advance to ${nextBand}, the system requires additional structural grounding or signal resolution. Posture changes when the readiness score crosses the next band threshold.`,
            evidence: [
              { label: 'Current score', value: String(score), severity: 'nominal' },
              { label: 'Current band', value: band, severity: 'nominal' },
              { label: 'Next band', value: nextBand, severity: 'nominal' },
            ],
            structuralContext: 'Band advancement is deterministic from readiness score. Score improves when ungrounded domains gain structural backing or when elevated signals resolve to NOMINAL.',
          }
        },
      },
    ]
  },

  EXECUTIVE_BALANCED: (fullReport) => {
    const ts = (fullReport && fullReport.topology_summary) || {}
    const rs = (fullReport && fullReport.readiness_summary) || {}
    const sigs = (fullReport && fullReport.signal_interpretations) || []
    const backed = ts.structurally_backed_count || 0
    const total = ts.semantic_domain_count || 0
    const semantic = Math.max(0, total - backed)
    const activated = sigs.filter(s => s.severity !== 'NOMINAL')
    return [
      {
        question: 'What structural evidence supports the emerged narrative patterns?',
        expansionType: 'resolution',
        tone: 'forensic', depth: 'deep',
        boundary: 'Evidence traced from emerged narratives to structural sources — deterministic.',
        derive: (fr) => {
          const blocks = (fr && fr.evidence_blocks) || []
          const grounded = blocks.filter(b => b && b.structural_backing && b.structural_backing !== 'SEMANTIC_ONLY')
          const semOnly = blocks.filter(b => b && (!b.structural_backing || b.structural_backing === 'SEMANTIC_ONLY'))
          return {
            summary: `${grounded.length} evidence block${grounded.length !== 1 ? 's' : ''} have structural backing. ${semOnly.length} operate on semantic continuity only. Narrative patterns emerge from this structural distribution — they reflect evidence state, not interpretation.`,
            evidence: [
              { label: 'Structurally backed blocks', value: String(grounded.length), severity: 'nominal' },
              { label: 'Semantic-only blocks', value: String(semOnly.length), severity: semOnly.length > 0 ? 'elevated' : 'nominal' },
              ...grounded.slice(0, 3).map(b => ({ label: b.domain_alias || 'Domain', value: b.structural_backing || 'backed', severity: 'nominal' })),
            ],
            structuralContext: `Emerged narratives are bounded by evidence state. ${grounded.length} blocks provide deterministic structural support. ${semOnly.length} blocks contribute semantic continuity without structural proof.`,
          }
        },
      },
      {
        question: 'Where does the grounding asymmetry create interpretive risk?',
        expansionType: 'structural_expansion',
        tone: 'architectural', depth: 'standard',
        boundary: 'Grounding asymmetry from topology summary — deterministic.',
        derive: (fr) => {
          const t = (fr && fr.topology_summary) || {}
          const b = t.structurally_backed_count || 0
          const tot = t.semantic_domain_count || 0
          const sem = Math.max(0, tot - b)
          const ratio = tot > 0 ? Math.round(sem / tot * 100) : 0
          return {
            summary: `${ratio}% of domains are advisory-bound. ${sem > 0 ? `Interpretive narratives touching these ${sem} domain${sem !== 1 ? 's' : ''} carry inherently lower structural authority.` : 'All domains are grounded — narrative authority is structurally supported.'}`,
            evidence: [
              { label: 'Advisory-bound ratio', value: `${ratio}%`, severity: ratio > 50 ? 'critical' : ratio > 30 ? 'elevated' : 'nominal' },
              { label: 'Ungrounded domains', value: String(sem), severity: sem > 0 ? 'elevated' : 'nominal' },
              { label: 'Grounded domains', value: String(b), severity: 'nominal' },
            ],
            structuralContext: 'Grounding asymmetry measures the gap between semantic claims and structural proof. Higher asymmetry means interpretive outputs carry more governance risk.',
          }
        },
      },
      {
        question: 'What conditions would change the current narrative emergence pattern?',
        expansionType: 'continuity_probe',
        tone: 'reflective', depth: 'standard',
        boundary: 'Emergence thresholds from narrative derive functions — deterministic.',
        derive: (fr) => {
          const s = (fr && fr.signal_interpretations) || []
          const t = (fr && fr.topology_summary) || {}
          const act = s.filter(sig => sig.severity !== 'NOMINAL')
          const b = t.structurally_backed_count || 0
          const tot = t.semantic_domain_count || 0
          return {
            summary: `Narrative emergence is conditioned on: signal activation count (currently ${act.length}), grounding ratio (${b}/${tot}), and readiness band. Changes to any threshold condition would alter which narratives surface.`,
            evidence: [
              { label: 'Activated signals', value: String(act.length), severity: act.length >= 2 ? 'elevated' : 'nominal' },
              { label: 'Grounding coverage', value: `${b}/${tot}`, severity: b < tot ? 'elevated' : 'nominal' },
            ],
            structuralContext: 'Emergence patterns are deterministic responses to structural conditions. The system does not choose to surface narratives — they emerge when evidence state crosses threshold conditions.',
          }
        },
      },
      {
        question: 'Which signal combinations most compress decision confidence?',
        expansionType: 'escalation',
        tone: 'alarming', depth: 'deep',
        boundary: 'Signal severity from signal_interpretations — deterministic.',
        derive: (fr) => {
          const s = (fr && fr.signal_interpretations) || []
          const act = s.filter(sig => sig.severity !== 'NOMINAL')
          const crit = act.filter(sig => sig.severity === 'CRITICAL' || sig.severity === 'HIGH')
          const r = (fr && fr.readiness_summary) || {}
          return {
            summary: crit.length > 0
              ? `${crit.length} critical/high signal${crit.length !== 1 ? 's' : ''} compress decision confidence. Combined with readiness band ${r.band || '—'}, the structural environment constrains executive commitment.`
              : `${act.length} elevated signal${act.length !== 1 ? 's' : ''} present but none at critical severity. Decision confidence is structurally bounded but not compressed.`,
            evidence: [
              ...crit.slice(0, 4).map(sig => ({ label: sig.signal_name || 'Signal', value: sig.severity, severity: sig.severity === 'CRITICAL' ? 'critical' : 'elevated' })),
              { label: 'Readiness band', value: r.band || '—', severity: r.band === 'STRONG' ? 'nominal' : 'elevated' },
            ],
            structuralContext: `Signal severity is measured, not interpreted. ${crit.length} critical/high signals indicate structural conditions that exceed operational thresholds — not a judgment, a measurement.`,
          }
        },
      },
    ]
  },

  EXECUTIVE_DENSE: (fullReport, activeZoneKey) => {
    const rs = (fullReport && fullReport.readiness_summary) || {}
    const ts = (fullReport && fullReport.topology_summary) || {}
    const blocks = (fullReport && fullReport.evidence_blocks) || []
    const sigs = (fullReport && fullReport.signal_interpretations) || []
    const ps = (fullReport && fullReport.propagation_summary) || {}
    const domains = (fullReport && fullReport.semantic_domain_registry) || []
    const zoneReg = activeZoneKey && DENSE_ZONE_REGISTRY[activeZoneKey]
    const zoneName = (zoneReg && zoneReg.name) || activeZoneKey || 'current zone'
    return [
      {
        question: `What structural dependencies anchor ${zoneName}?`,
        expansionType: 'structural_expansion',
        tone: 'architectural', depth: 'deep',
        boundary: 'Dependency from topology edges and propagation chain — deterministic.',
        derive: (fr) => {
          const blks = (fr && fr.evidence_blocks) || []
          const edges = (fr && fr.semantic_topology_edges) || []
          const roleMap = {}
          blks.forEach(b => { if (b && b.propagation_role) roleMap[b.propagation_role] = (roleMap[b.propagation_role] || []).concat(b) })
          const origins = roleMap['ORIGIN'] || []
          const passThrough = roleMap['PASS_THROUGH'] || []
          const receivers = roleMap['RECEIVER'] || []
          return {
            summary: `${origins.length} origin${origins.length !== 1 ? 's' : ''}, ${passThrough.length} pass-through${passThrough.length !== 1 ? 's' : ''}, ${receivers.length} receiver${receivers.length !== 1 ? 's' : ''} in the structural chain. ${edges.length} topology edge${edges.length !== 1 ? 's' : ''} connect the domain graph.`,
            evidence: [
              { label: 'Origins', value: origins.map(b => b.domain_alias).join(', ') || '—', severity: 'nominal' },
              { label: 'Pass-throughs', value: passThrough.map(b => b.domain_alias).join(', ') || '—', severity: 'nominal' },
              { label: 'Receivers', value: receivers.map(b => b.domain_alias).join(', ') || '—', severity: receivers.some(b => !b.structural_backing || b.structural_backing === 'SEMANTIC_ONLY') ? 'elevated' : 'nominal' },
              { label: 'Topology edges', value: String(edges.length), severity: 'nominal' },
            ],
            structuralContext: `Structural dependencies are topology-derived. The propagation chain traces from origin through pass-through to receiver domains. Each link represents measurable structural dependency, not inferred relationship.`,
          }
        },
      },
      {
        question: `What evidence chain completeness exists within ${zoneName}?`,
        expansionType: 'continuity_probe',
        tone: 'forensic', depth: 'standard',
        boundary: 'Evidence completeness from evidence_blocks backing status — deterministic.',
        derive: (fr) => {
          const blks = (fr && fr.evidence_blocks) || []
          const grounded = blks.filter(b => b && b.structural_backing && b.structural_backing !== 'SEMANTIC_ONLY')
          const semOnly = blks.filter(b => b && (!b.structural_backing || b.structural_backing === 'SEMANTIC_ONLY'))
          return {
            summary: `${grounded.length} of ${blks.length} evidence blocks have structural backing. ${semOnly.length > 0 ? `${semOnly.length} block${semOnly.length !== 1 ? 's' : ''} operate on semantic continuity only — structural proof is absent.` : 'All blocks are structurally backed.'}`,
            evidence: [
              { label: 'Backed blocks', value: String(grounded.length), severity: 'nominal' },
              { label: 'Semantic-only', value: String(semOnly.length), severity: semOnly.length > 0 ? 'elevated' : 'nominal' },
              ...semOnly.slice(0, 2).map(b => ({ label: b.domain_alias || 'Domain', value: 'SEMANTIC_ONLY', severity: 'elevated' })),
            ],
            structuralContext: 'Evidence completeness is measured by backing status. SEMANTIC_ONLY blocks have operational utility but lack structural proof.',
          }
        },
      },
      {
        question: 'How does pressure propagate across the structural chain?',
        expansionType: 'traversal',
        tone: 'operational', depth: 'standard',
        boundary: 'Propagation path from propagation_summary and evidence_blocks — deterministic.',
        derive: (fr) => {
          const p = (fr && fr.propagation_summary) || {}
          const blks = (fr && fr.evidence_blocks) || []
          const chain = blks.filter(b => b && b.propagation_role).sort((a, b) => {
            const order = { ORIGIN: 0, PASS_THROUGH: 1, RECEIVER: 2 }
            return (order[a.propagation_role] || 3) - (order[b.propagation_role] || 3)
          })
          const chainStr = chain.map(b => b.domain_alias).join(' → ')
          return {
            summary: chain.length > 0
              ? `Propagation chain: ${chainStr}. Zone classification: ${p.zone_classification || 'NOMINAL'}. Pressure flows from origin through intermediate domains to receivers.`
              : 'No propagation chain detected in current evidence blocks.',
            evidence: chain.slice(0, 5).map(b => ({
              label: b.domain_alias || 'Domain',
              value: b.propagation_role,
              severity: b.propagation_role === 'ORIGIN' ? 'elevated' : 'nominal',
            })),
            structuralContext: 'Propagation is topology-derived. Each link in the chain represents a measurable structural dependency confirmed by evidence blocks.',
          }
        },
      },
      {
        question: 'Which structural claims lack evidence continuity in this zone?',
        expansionType: 'resolution',
        tone: 'containment', depth: 'deep',
        boundary: 'Evidence gaps from domain registry and evidence blocks — deterministic.',
        derive: (fr) => {
          const doms = (fr && fr.semantic_domain_registry) || []
          const blks = (fr && fr.evidence_blocks) || []
          const blockDomains = new Set(blks.map(b => b.domain_alias).filter(Boolean))
          const uncovered = doms.filter(d => !blockDomains.has(d.domain_name) && !blockDomains.has(d.domain_id))
          const semOnly = doms.filter(d => d.semantic_only || !d.structurally_backed)
          return {
            summary: `${uncovered.length} domain${uncovered.length !== 1 ? 's' : ''} have no evidence block representation. ${semOnly.length} domain${semOnly.length !== 1 ? 's' : ''} are semantic-only. These represent claims without structural continuity.`,
            evidence: [
              { label: 'Uncovered domains', value: String(uncovered.length), severity: uncovered.length > 0 ? 'elevated' : 'nominal' },
              { label: 'Semantic-only domains', value: String(semOnly.length), severity: semOnly.length > 0 ? 'elevated' : 'nominal' },
              ...uncovered.slice(0, 3).map(d => ({ label: d.domain_name || d.domain_id || 'Domain', value: 'no evidence block', severity: 'elevated' })),
            ],
            structuralContext: `Evidence continuity requires both domain registration and evidence block representation. Domains without evidence blocks are semantically present but structurally unverifiable.`,
          }
        },
      },
    ]
  },

  INVESTIGATION_DENSE: (fullReport) => {
    const blocks = (fullReport && fullReport.evidence_blocks) || []
    const domains = (fullReport && fullReport.semantic_domain_registry) || []
    const ts = (fullReport && fullReport.topology_summary) || {}
    return [
      {
        question: 'Which evidence chains have structural gaps?',
        expansionType: 'resolution',
        tone: 'forensic', depth: 'deep',
        boundary: 'Evidence gaps from structural_backing field — deterministic.',
        derive: (fr) => {
          const blks = (fr && fr.evidence_blocks) || []
          const semOnly = blks.filter(b => b && (!b.structural_backing || b.structural_backing === 'SEMANTIC_ONLY'))
          const grounded = blks.filter(b => b && b.structural_backing && b.structural_backing !== 'SEMANTIC_ONLY')
          return {
            summary: semOnly.length > 0
              ? `${semOnly.length} of ${blks.length} evidence block${blks.length !== 1 ? 's' : ''} lack structural backing. These chains cannot be verified to structural source.`
              : `All ${blks.length} evidence blocks have structural backing. No structural gaps detected.`,
            evidence: [
              { label: 'Total blocks', value: String(blks.length), severity: 'nominal' },
              { label: 'Structural gaps', value: String(semOnly.length), severity: semOnly.length > 0 ? 'critical' : 'nominal' },
              ...semOnly.slice(0, 4).map(b => ({ label: b.domain_alias || 'Domain', value: b.structural_backing || 'SEMANTIC_ONLY', severity: 'elevated' })),
            ],
            structuralContext: `Structural gaps represent evidence chains where the link between semantic claim and structural proof is absent. ${grounded.length} block${grounded.length !== 1 ? 's' : ''} have confirmed structural backing. ${semOnly.length} do not.`,
          }
        },
      },
      {
        question: 'What is the complete evidence provenance for each propagation role?',
        expansionType: 'traversal',
        tone: 'operational', depth: 'standard',
        boundary: 'Role provenance from evidence_blocks propagation_role — deterministic.',
        derive: (fr) => {
          const blks = (fr && fr.evidence_blocks) || []
          const roles = {}
          blks.forEach(b => { if (b && b.propagation_role) roles[b.propagation_role] = (roles[b.propagation_role] || []).concat(b) })
          const roleEntries = Object.entries(roles)
          return {
            summary: roleEntries.length > 0
              ? `${roleEntries.length} propagation role${roleEntries.length !== 1 ? 's' : ''} present: ${roleEntries.map(([r, bs]) => `${r} (${bs.length})`).join(', ')}.`
              : 'No propagation roles detected in evidence blocks.',
            evidence: roleEntries.map(([role, bs]) => ({
              label: role,
              value: bs.map(b => b.domain_alias).join(', '),
              severity: role === 'ORIGIN' ? 'elevated' : 'nominal',
            })),
            structuralContext: 'Propagation roles are assigned by evidence block classification. ORIGIN → PASS_THROUGH → RECEIVER traces the full structural dependency chain.',
          }
        },
      },
      {
        question: 'Where do qualification boundaries constrain evidence acceptance?',
        expansionType: 'structural_expansion',
        tone: 'containment', depth: 'standard',
        boundary: 'Qualification from qualifier_summary — deterministic.',
        derive: (fr) => {
          const qs = (fr && fr.qualifier_summary) || {}
          const rs = (fr && fr.readiness_summary) || {}
          const posture = qs.qualification_posture || rs.qualification_posture || 'UNRESOLVED'
          const qualifiers = qs.active_qualifiers
          const sState = rs.current_s_state || rs.s_state || 'UNKNOWN'
          return {
            summary: `Qualification posture: ${posture} at ${sState}. ${qualifiers != null ? `${qualifiers} active qualifier${qualifiers !== 1 ? 's' : ''} constrain evidence acceptance.` : 'Qualifier count unavailable.'} Evidence acceptance is bounded by current qualification state.`,
            evidence: [
              { label: 'S-state', value: sState, severity: 'nominal' },
              { label: 'Posture', value: posture, severity: posture === 'UNRESOLVED' ? 'elevated' : 'nominal' },
              ...(qualifiers != null ? [{ label: 'Active qualifiers', value: String(qualifiers), severity: qualifiers > 0 ? 'elevated' : 'nominal' }] : []),
            ],
            structuralContext: 'Qualification boundaries are deterministic from S-state and qualifier gates. Evidence acceptance is constrained by the system qualification posture, not by judgment.',
          }
        },
      },
      {
        question: 'What ungrounded claims exist across the domain registry?',
        expansionType: 'escalation',
        tone: 'alarming', depth: 'deep',
        boundary: 'Ungrounded claims from semantic_domain_registry — deterministic.',
        derive: (fr) => {
          const doms = (fr && fr.semantic_domain_registry) || []
          const semOnly = doms.filter(d => d.semantic_only || !d.structurally_backed)
          const grounded = doms.filter(d => d.structurally_backed)
          const ratio = doms.length > 0 ? Math.round(semOnly.length / doms.length * 100) : 0
          return {
            summary: semOnly.length > 0
              ? `${semOnly.length} of ${doms.length} domains (${ratio}%) are ungrounded — semantic claims without structural correspondence. ${semOnly.length > 3 ? 'This represents a significant evidence gap.' : 'Gap is localized.'}`
              : `All ${doms.length} domains are structurally grounded. No ungrounded claims detected.`,
            evidence: [
              { label: 'Total domains', value: String(doms.length), severity: 'nominal' },
              { label: 'Ungrounded', value: String(semOnly.length), severity: semOnly.length > 0 ? 'critical' : 'nominal' },
              { label: 'Grounded', value: String(grounded.length), severity: 'nominal' },
              ...semOnly.slice(0, 3).map(d => ({ label: d.domain_name || d.domain_id || 'Domain', value: 'ungrounded', severity: 'elevated' })),
            ],
            structuralContext: `Ungrounded claims are domains registered in the semantic model without structural correspondence in the evidence rebase corridor. These are operationally present but forensically unverifiable.`,
          }
        },
      },
    ]
  },
}

function ExecutiveInterpretation({ narrative, densityClass, boardroomMode, adapted, fullReport, boardroomProjection, activeZoneKey, activeQueryKey, onQueryDismiss, emergenceState, piRuntimeActive, activeExpansionIndex, expansions, onExpansionDismiss, selectedNarrativeArc, resolvedCognitionContract, cognitionQueryIndex, onCognitionQueryDismiss, activeConditions, resolvedCondition, onConditionDismiss, swIntelActive, swIntelTeaser }) {
  const badge = (adapted && adapted.readinessBadge) || {}
  const framing = boardroomMode
    ? INTERP_MODE_FRAMING.BOARDROOM
    : (INTERP_MODE_FRAMING[densityClass] || INTERP_MODE_FRAMING.EXECUTIVE_DENSE)

  const rs = (fullReport && fullReport.readiness_summary) || {}
  const ts = (fullReport && fullReport.topology_summary) || {}
  const ps = (fullReport && fullReport.propagation_summary) || {}
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  const chains = (fullReport && fullReport.evidence_blocks) || []

  const backedCount = ts.structurally_backed_count || 0
  const totalDomains = ts.semantic_domain_count || 0
  const groundingRatio = totalDomains > 0 ? `${backedCount} of ${totalDomains} structurally backed` : null

  const pressureZone = ps.primary_zone_business_label || null
  const activatedSignals = sigs.filter(s => s.severity !== 'NOMINAL')

  const origin = chains.find(b => b && b.propagation_role === 'ORIGIN')
  const passthrough = chains.find(b => b && b.propagation_role === 'PASS_THROUGH')
  const receiver = chains.find(b => b && b.propagation_role === 'RECEIVER')
  const chainRoles = [origin, passthrough, receiver].filter(Boolean)

  const compoundNarrative = sigs[0] && sigs[0].compound_narrative
  const confidenceNote = sigs[0] && sigs[0].confidence_note

  // ─── SW-INTEL COGNITION STATE RENDERING ──────────────────────────
  if (swIntelActive && resolvedCognitionContract) {
    const cc = resolvedCognitionContract
    const interp = cc.interpretation
    const activeQuery = cognitionQueryIndex !== null && cc.guidedCognition && cc.guidedCognition[cognitionQueryIndex]

    if (activeQuery && activeQuery.answer_derive) {
      const derived = activeQuery.answer_derive(fullReport)
      return (
        <aside className="intel-interp intel-interp--cognition-query" data-tone={activeQuery.tone} data-depth={activeQuery.depth} aria-label="Cognition state guided query answer">
          <div className="query-answer-panel query-answer-panel--standard">
            <div className="query-answer-header">
              <span className="query-answer-badge">{cc.meta.code}</span>
              <span className="query-answer-header-label">DOMAIN COGNITION · {cc.meta.label.toUpperCase()}</span>
              <button className="query-answer-dismiss" onClick={onCognitionQueryDismiss} type="button" aria-label="Dismiss">✕</button>
            </div>
            <div className="query-answer-question">{activeQuery.question}</div>
            <div className="query-answer-summary">{derived.summary}</div>
            {derived.evidence && derived.evidence.length > 0 && (
              <div className="query-answer-evidence">
                {derived.evidence.map((e, ei) => (
                  <div key={ei} className="query-answer-evidence-row" data-severity={e.severity}>
                    <span className="query-answer-evidence-label">{e.label}</span>
                    <span className="query-answer-evidence-value">{e.value}</span>
                  </div>
                ))}
              </div>
            )}
            {derived.structuralContext && <div className="query-answer-context">{derived.structuralContext}</div>}
            <div className="query-answer-boundary">{activeQuery.boundary}</div>
          </div>
        </aside>
      )
    }

    return (
      <aside className="intel-interp intel-interp--cognition-state" data-surface={cc.surface.surface_id} data-severity={cc.surface.severity} aria-label={`${cc.meta.label} domain cognition state`}>
        <div className="interp-tag">
          <span className="interp-tag-label">{cc.meta.icon} DOMAIN COGNITION</span>
          <span className="interp-tag-state">{cc.surface.severity}</span>
        </div>

        <div className="interp-zone-focus">
          <div className="interp-zone-badge">
            <span className="interp-zone-badge-code">{cc.meta.code}</span>
            <span className="interp-zone-badge-label">{interp.heading}</span>
          </div>
          <div className="interp-zone-body cognition-operational-meaning">{interp.operationalMeaning}</div>

          {interp.structuralEvidence && interp.structuralEvidence.length > 0 && (
            <div className="interp-zone-signals">
              <div className="interp-zone-signals-label">STRUCTURAL EVIDENCE</div>
              {interp.structuralEvidence.map((e, i) => (
                <div key={i} className="interp-zone-signal" data-severity={e.severity}>
                  <span className="interp-zone-signal-severity">{e.label}</span>
                  <span className="interp-zone-signal-text">{e.value}</span>
                </div>
              ))}
            </div>
          )}

          {cc.implications && cc.implications.orchestration && cc.implications.orchestration.length > 0 && (
            <div className="cognition-implications">
              <div className="interp-zone-signals-label">ORCHESTRATION IMPLICATIONS</div>
              {cc.implications.orchestration.map((imp, i) => (
                <div key={i} className="cognition-implication-item" data-priority={imp.priority}>
                  <span className="cognition-implication-priority">{imp.priority}</span>
                  <span className="cognition-implication-text">{imp.action}</span>
                </div>
              ))}
            </div>
          )}

          {cc.implications && cc.implications.qualification && (
            <div className="cognition-qualification">
              <div className="interp-zone-signals-label">QUALIFICATION EFFECT</div>
              <div className="cognition-qualification-text">{cc.implications.qualification.effect}</div>
            </div>
          )}

          {cc.gapsAndProgression && cc.gapsAndProgression.evidenceGaps && cc.gapsAndProgression.evidenceGaps.length > 0 && (
            <div className="cognition-gaps">
              <div className="interp-zone-signals-label">EVIDENCE GAPS</div>
              {cc.gapsAndProgression.evidenceGaps.map((g, i) => (
                <div key={i} className="cognition-gap-item">
                  <span className="cognition-gap-label">{g.gap}</span>
                  <span className="cognition-gap-impact">{g.impact}</span>
                </div>
              ))}
            </div>
          )}

          {cc.gapsAndProgression && cc.gapsAndProgression.progressionPath && cc.gapsAndProgression.progressionPath.length > 0 && (
            <div className="cognition-progression">
              <div className="interp-zone-signals-label">PROGRESSION PATH</div>
              {cc.gapsAndProgression.progressionPath.map((p, i) => (
                <div key={i} className="cognition-progression-item">
                  <span className="cognition-progression-step">{p.step}</span>
                  <span className="cognition-progression-effect">{p.effect}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    )
  }

  // ─── CONDITION DETAIL RENDERING ──────────────────────────────────
  if (swIntelActive && resolvedCondition) {
    const c = resolvedCondition
    const targets = c.domain_targets || []
    const linkedSurfaces = CONDITION_TO_SURFACES[c.condition_type] || []
    return (
      <aside className="intel-interp intel-interp--condition-active" data-tone="structural" data-severity={c.severity} aria-label="Active condition detail">
        <div className="interp-tag">
          <span className="interp-tag-label">CONDITION DETAIL</span>
          <button className="interp-condition-dismiss" onClick={onConditionDismiss} type="button" aria-label="Dismiss condition detail">✕</button>
        </div>

        <div className="interp-condition-detail">
          <div className="interp-condition-title" data-severity={c.severity}>
            {c.operator_cognition_title}
            <span className="interp-condition-sev">{c.severity}</span>
          </div>

          <div className="interp-condition-consequence">{c.operational_consequence}</div>

          {targets.length > 0 && (
            <div className="interp-condition-targets">
              <div className="interp-section-label">AFFECTED DOMAINS</div>
              {targets.map(t => (
                <div key={t.id} className="interp-condition-target">
                  <span className="interp-condition-target-name">{t.display_name}</span>
                  <span className="interp-condition-target-id">{t.id}</span>
                  <span className="interp-condition-target-role">{t.condition_role}</span>
                </div>
              ))}
            </div>
          )}

          <div className="interp-condition-field">
            <div className="interp-section-label">TOPOLOGY EFFECT</div>
            <div className="interp-condition-field-value">{c.topology_effect}</div>
          </div>

          {c.topology_overlay && c.topology_overlay.corridor_paths && c.topology_overlay.corridor_paths.length > 0 && (() => {
            const paths = c.topology_overlay.corridor_paths
            const evidencePaths = paths.filter(p => p.evidence === 'semantic_topology_edge')
            if (evidencePaths.length === 0) return null
            const reg = (fullReport && fullReport.semantic_domain_registry) || []
            const resolveName = (id) => { const d = reg.find(r => r.domain_id === id); return d ? (d.business_label || d.domain_name || id) : id }
            const hubDomain = targets.length > 0 ? targets[0].display_name : 'hub domain'
            const inbound = evidencePaths.filter(p => p.type === 'import_consumer')
            const outbound = evidencePaths.filter(p => p.type === 'import_hub_outbound')
            return (
              <div className="interp-condition-field">
                <div className="interp-section-label">TOPOLOGY CORRIDORS</div>
                <div className="interp-condition-field-value" style={{ marginBottom: 6 }}>
                  {hubDomain} acts as a dependency hub{inbound.length > 0 ? ': ' + inbound.length + ' upstream domain' + (inbound.length !== 1 ? 's' : '') + ' feed into it' : ''}{outbound.length > 0 ? (inbound.length > 0 ? ' and ' : ': ') + outbound.length + ' downstream domain' + (outbound.length !== 1 ? 's are' : ' is') + ' called from it' : ''}.
                </div>
                {inbound.length > 0 && (
                  <div className="interp-condition-corridor-group">
                    <span className="interp-condition-corridor-label" style={{ color: '#ff9e4a' }}>UPSTREAM</span>
                    {inbound.map((p, i) => <span key={i} className="interp-condition-corridor-domain">{resolveName(p.from)}</span>)}
                  </div>
                )}
                {outbound.length > 0 && (
                  <div className="interp-condition-corridor-group">
                    <span className="interp-condition-corridor-label" style={{ color: '#4a9eff' }}>DOWNSTREAM</span>
                    {outbound.map((p, i) => <span key={i} className="interp-condition-corridor-domain">{resolveName(p.to)}</span>)}
                  </div>
                )}
                <div className="interp-condition-corridor-evidence">
                  {evidencePaths.length} corridor{evidencePaths.length !== 1 ? 's' : ''} from semantic topology edges · domain-level
                </div>
              </div>
            )
          })()}

          <div className="interp-condition-field">
            <div className="interp-section-label">GOVERNANCE</div>
            <div className="interp-condition-field-value">
              {c.governance_boundary === 'GOVERNED' ? 'Governed — structurally confirmed' : c.governance_boundary === 'ADVISORY_BOUND' ? 'Advisory — structural confirmation needed' : c.governance_boundary === 'STRUCTURAL_ONLY' ? 'Structural only — advisory-bound' : c.governance_boundary}
            </div>
          </div>

          {linkedSurfaces.length > 0 && (
            <div className="interp-condition-field">
              <div className="interp-section-label">DRIVES CAPABILITIES</div>
              <div className="interp-condition-surfaces">
                {linkedSurfaces.map(sid => (
                  <span key={sid} className="condition-surface-tag">{SURFACE_DISPLAY_NAME[sid] || sid}</span>
                ))}
              </div>
            </div>
          )}

          <div className="interp-condition-field">
            <div className="interp-section-label">DERIVATION</div>
            <div className="interp-condition-trace-text">{c.technical_semantic_label}</div>
            <div className="interp-condition-trace-text">{c.supporting_signal_ids.join(', ')}</div>
          </div>
        </div>
      </aside>
    )
  }

  if (boardroomMode) {
    const isS1 = fullReport && fullReport.qualification_level === 'S1'
    const gn = fullReport && fullReport.governed_narrative
    const narrativeAvailable = gn && gn.available

    if (isS1 && narrativeAvailable) {
      const selectedParagraph = selectedNarrativeArc
        ? (gn.paragraphs || []).find(p => p.arc_position === selectedNarrativeArc)
        : null
      const proofGraph = gn.proof_graph || {}
      const selectedAnchors = selectedParagraph ? (selectedParagraph.anchors || []) : []
      const allEvidenceObjects = proofGraph.evidence_objects || []
      const referencedEoIds = new Set(selectedAnchors.flatMap(a => a.evidence_object_ids || []))
      const referencedEos = allEvidenceObjects.filter(eo => referencedEoIds.has(eo.id))

      return (
        <aside className="intel-interp intel-interp--narrative-evidence" data-tone={framing.tone} aria-label="Executive environmental synthesis">
          <div className="interp-tag">
            <span className="interp-tag-label">Evidence Context</span>
            <span className="interp-tag-state">{badge.state_label || 'S1'}</span>
          </div>

          {!selectedNarrativeArc ? (
            <div className="interp-block interp-block--lead">
              <div className="interp-section-label">SELECT A SECTION</div>
              <div className="interp-synthesis interp-synthesis--prompt">
                Click a narrative section to inspect its evidence anchors, source artifacts, and structural basis.
              </div>
              <div className="interp-synthesis-meta">
                {(gn.paragraphs || []).length} sections · {(gn.composition_provenance || {}).anchors_consumed || 0} anchors · {(gn.composition_provenance || {}).evidence_objects_referenced || 0} evidence objects
              </div>
            </div>
          ) : (
            <>
              <div className="interp-block interp-block--lead">
                <div className="interp-section-label">{ARC_LABELS[selectedNarrativeArc] || selectedNarrativeArc}</div>
                <div className="interp-synthesis-meta">
                  {selectedAnchors.length} anchor{selectedAnchors.length !== 1 ? 's' : ''} · {referencedEos.length} evidence object{referencedEos.length !== 1 ? 's' : ''}
                </div>
              </div>

              {selectedAnchors.map((anchor, i) => (
                <div key={anchor.anchor_id || i} className="interp-block interp-block--evidence-anchor">
                  <div className="interp-section-label">
                    <span className="narrative-proof-anchor-id">{anchor.anchor_id}</span>
                    <span className="narrative-proof-anchor-class">{anchor.source && anchor.source.surprise_class}</span>
                  </div>
                  {anchor.structural_basis && (
                    <div className="interp-synthesis interp-synthesis--basis">{anchor.structural_basis}</div>
                  )}
                  {anchor.evidence_object_ids && anchor.evidence_object_ids.length > 0 && (
                    <div className="narrative-proof-anchor-refs">
                      {anchor.evidence_object_ids.map(eid => (
                        <span key={eid} className="narrative-proof-anchor-ref">{eid.slice(0, 12)}…</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {referencedEos.length > 0 && (
                <div className="interp-block">
                  <div className="interp-section-label">SOURCE ARTIFACTS</div>
                  {referencedEos.map(eo => (
                    <div key={eo.id} className="interp-evidence-object">
                      <div className="interp-evidence-object-phase">{eo.phase}</div>
                      <div className="interp-evidence-object-path">{eo.artifact_path}</div>
                      {eo.evidence_class && <div className="interp-evidence-object-class">{eo.evidence_class}</div>}
                    </div>
                  ))}
                </div>
              )}

              {selectedParagraph && selectedParagraph.governance && (
                <div className="interp-block">
                  <div className="interp-section-label">AUTHORITY</div>
                  <div className="interp-synthesis-meta">
                    {selectedParagraph.governance.authority} · {selectedParagraph.governance.contract}
                  </div>
                </div>
              )}
            </>
          )}
        </aside>
      )
    }

    if (boardroomProjection && boardroomProjection.qualification_posture.governed) {
      const qp = boardroomProjection.qualification_posture
      const bpTs = boardroomProjection.tension_summary
      const bpGl = boardroomProjection.governance_legitimacy
      return (
        <aside className="intel-interp" data-tone={framing.tone} aria-label="Executive intelligence briefing">
          <div className="interp-tag">
            <span className="interp-tag-label">EXECUTIVE BRIEFING</span>
            <span className="interp-tag-state">{qp.s_level}</span>
          </div>

          <div className="interp-block interp-block--lead">
            <div className="interp-section-label">INTELLIGENCE POSTURE</div>
            <div className="interp-synthesis">{bpTs.posture_narrative}</div>
            <div className="interp-synthesis-meta">
              {(qp.provenance_summary || '').replace(/\.$/, '')} · {qp.authority_ceiling || 'L3'} ceiling
            </div>
          </div>

          {bpTs.structural_tension_narrative && (
            <div className="interp-block">
              <div className="interp-section-label">STRUCTURAL TENSION</div>
              <div className="interp-synthesis">{bpTs.structural_tension_narrative}</div>
            </div>
          )}

          <div className="interp-block">
            <div className="interp-section-label">GOVERNANCE CONFIDENCE</div>
            <div className="interp-synthesis">{bpGl.confidence_narrative}</div>
          </div>

          <div className="interp-block">
            <div className="interp-section-label interp-section-label--descent">DEPTH</div>
            <div className="interp-synthesis interp-synthesis--descent">
              Descend into BALANCED for the governed qualification journey.
            </div>
          </div>
        </aside>
      )
    }

    const gl = fullReport && fullReport.governance_lifecycle
    const isGovernedS1Plus = gl && gl.available && gl.s_level && ['S1', 'S2', 'S3'].includes(gl.s_level)
    if (isGovernedS1Plus) {
      const pc = fullReport.proposition_corpus
      const rv = fullReport.revalidation_intelligence
      const cc = fullReport.chronicle_certification
      const govFamilyKeys = [...new Set(activatedSignals.map(s => s.signal_family).filter(Boolean))]
      return (
        <aside className="intel-interp" data-tone={framing.tone} aria-label="Executive intelligence briefing">
          <div className="interp-tag">
            <span className="interp-tag-label">EXECUTIVE BRIEFING</span>
            <span className="interp-tag-state">{gl.s_level}</span>
          </div>

          <div className="interp-block interp-block--lead">
            <div className="interp-section-label">INTELLIGENCE POSTURE</div>
            <div className="interp-synthesis">
              {gl.s_level} governed intelligence across {totalDomains} semantic domains.
              {govFamilyKeys.length > 0
                ? ` Structural pressure concentrated${pressureZone ? ` in "${pressureZone}"` : ''}.`
                : ' No elevated structural pressure.'}
            </div>
            <div className="interp-synthesis-meta">
              {(gl.qualification_provenance || '').replace(/_/g, ' ')} · {gl.authority_ceiling || 'L3'} ceiling
            </div>
          </div>

          {govFamilyKeys.length > 0 && (
            <div className="interp-block">
              <div className="interp-section-label">STRUCTURAL TENSION</div>
              <div className="interp-synthesis">
                {govFamilyKeys.length} pressure dimension{govFamilyKeys.length !== 1 ? 's' : ''} active{pressureZone ? ` — gravity concentrated in "${pressureZone}"` : ''}.
              </div>
            </div>
          )}

          <div className="interp-block">
            <div className="interp-section-label">GOVERNANCE CONFIDENCE</div>
            <div className="interp-synthesis">
              {pc && pc.available && pc.governance_friction_rate > 0
                ? 'Governed review exercised. Governance friction surfaced and resolved.'
                : pc && pc.available
                  ? 'Governed review completed. All claims accepted.'
                  : 'Governance lifecycle complete.'}
              {rv && rv.available && rv.status === 'PASS' ? ' Deterministic replay confirmed.' : ''}
              {cc && cc.available && cc.certification_status === 'CERTIFIED' ? ' Replay-certified.' : ''}
            </div>
          </div>

          <div className="interp-block">
            <div className="interp-section-label interp-section-label--descent">DEPTH</div>
            <div className="interp-synthesis interp-synthesis--descent">
              Descend into BALANCED for the governed qualification journey.
            </div>
          </div>
        </aside>
      )
    }

    return (
      <aside className="intel-interp" data-tone={framing.tone} aria-label="Executive environmental synthesis">
        <div className="interp-tag">
          <span className="interp-tag-label">{framing.label}</span>
          <span className="interp-tag-state">{badge.state_label || '—'}</span>
        </div>

        <div className="interp-block interp-block--lead">
          <div className="interp-section-label">STRUCTURAL ENVIRONMENT</div>
          <div className="interp-synthesis">
            {rs.conclusion || narrative.executive_summary || '—'}
          </div>
          {groundingRatio && (
            <div className="interp-synthesis-meta">{groundingRatio}</div>
          )}
        </div>

        {pressureZone && activatedSignals.length > 0 && (
          <div className="interp-block">
            <div className="interp-section-label">PRESSURE CONCENTRATION</div>
            <div className="interp-synthesis">
              Pressure concentrated around &ldquo;{pressureZone}&rdquo; — {activatedSignals.length} elevated signal{activatedSignals.length !== 1 ? 's' : ''} active.
            </div>
          </div>
        )}

        {chainRoles.length >= 2 && (
          <div className="interp-block">
            <div className="interp-section-label">DEPENDENCY PATTERN</div>
            <div className="interp-synthesis">
              {chainRoles.map(n => n.domain_alias).join(' → ')} — structural propagation is organizational, not incidental.
            </div>
          </div>
        )}

        {compoundNarrative && (
          <div className="interp-block">
            <div className="interp-section-label">SYSTEMIC CONDITION</div>
            <div className="interp-synthesis">{compoundNarrative}</div>
            {confidenceNote && (
              <div className="interp-synthesis-meta">{confidenceNote}</div>
            )}
          </div>
        )}
      </aside>
    )
  }

  if (densityClass === 'EXECUTIVE_BALANCED' && emergenceState) {
    const emerged = Object.values(emergenceState).filter(n => n && n.narrative !== null)
    const authorityActive = emerged.length > 0
    return (
      <aside className="intel-interp intel-interp--balanced-interpretive" data-tone={framing.tone} aria-label="Executive interpretation — governed narrative">
        <div className="interp-tag">
          <span className="interp-tag-label">{framing.label}</span>
          <span className="interp-tag-state">{badge.state_label || '—'}</span>
          {authorityActive && <span className="interp-75x-marker">75.x</span>}
        </div>

        {narrative.executive_summary && (
          <div className={`interp-block interp-block--lead${authorityActive ? ' interp-block--interpretive' : ''}`}>
            <div className="interp-section-label">{framing.assessmentLabel}</div>
            <div className="interp-summary">{narrative.executive_summary}</div>
          </div>
        )}

        {emerged.filter(n => n.emergenceClass === 'SECONDARY' || n.emergenceClass === 'TERTIARY').map(n => {
          const registryEntry = Object.values(BALANCED_INTERPRETIVE_NARRATIVES).find(fn => emergenceState[fn.key] === n)
          return (
            <div key={(registryEntry && registryEntry.key) || n.structuralBasis} className={`interp-block interp-block--interpretive${n.emergenceClass === 'TERTIARY' ? ' interp-block--tertiary' : ''}`}>
              <div className="interp-section-label interp-section-label--emerged">
                {(registryEntry && registryEntry.subordinateLabel) || 'Structural observation'}
              </div>
              <div className="interp-synthesis interp-synthesis--emerged">
                {n.evidenceChain[0] && n.evidenceChain[0].claim}
              </div>
            </div>
          )
        })}

        {narrative.structural_summary && framing.structuralLabel && (
          <div className="interp-block">
            <div className="interp-section-label">{framing.structuralLabel}</div>
            <div className="interp-structural">{narrative.structural_summary}</div>
          </div>
        )}
      </aside>
    )
  }

  if (piRuntimeActive && activeExpansionIndex !== null && expansions && expansions[activeExpansionIndex]) {
    const expansion = expansions[activeExpansionIndex]
    const derived = expansion.derive(fullReport)
    const depth = expansion.depth || 'standard'
    const typeLabel = EXPANSION_TYPE_LABELS[expansion.expansionType] || 'STRUCTURAL EXPANSION'
    const zoneReg = activeZoneKey && DENSE_ZONE_REGISTRY[activeZoneKey]
    const zoneBadge = zoneReg ? zoneReg.code : '◉'
    return (
      <aside className="intel-interp intel-interp--expansion-active" data-tone={framing.tone} data-depth={depth} aria-label="Structural expansion — bounded interpretation">
        <div className={`query-answer-panel query-answer-panel--expansion query-answer-panel--${depth}`}>
          <div className="query-answer-header">
            <span className="query-answer-badge">{zoneBadge}</span>
            <span className="query-answer-header-label">{typeLabel}</span>
            <span className="expansion-authority-marker">75.x</span>
            <button className="query-answer-dismiss" onClick={onExpansionDismiss} type="button" aria-label="Dismiss expansion">✕</button>
          </div>
          <div className="query-answer-question">{expansion.question}</div>
          <div className="query-answer-summary">{derived.summary}</div>
          {derived.evidence && derived.evidence.length > 0 && (
            <div className="query-answer-evidence">
              {derived.evidence.map((e, ei) => (
                <div key={ei} className="query-answer-evidence-row" data-severity={e.severity}>
                  <span className="query-answer-evidence-label">{e.label}</span>
                  <span className="query-answer-evidence-value">{e.value}</span>
                </div>
              ))}
            </div>
          )}
          {derived.structuralContext && (
            <div className="query-answer-context">{derived.structuralContext}</div>
          )}
          <div className="query-answer-boundary">{expansion.boundary}</div>
          <div className="expansion-governance-footer">BOUNDED INTERPRETATION · evidence-bound · 13 prohibitions enforced</div>
        </div>
      </aside>
    )
  }

  if (activeQueryKey && densityClass === 'EXECUTIVE_DENSE') {
    const parts = activeQueryKey.split(':')
    const qZone = parts[0]
    const qIndex = parseInt(parts[1], 10)
    const qPaths = DENSE_ZONE_PATHS[qZone]
    const qAnswers = GUIDED_QUERY_ANSWERS[qZone]
    const qPath = qPaths && qPaths[qIndex]
    const qAnswer = qAnswers && qAnswers[qIndex]
    const qReg = DENSE_ZONE_REGISTRY[qZone]
    if (qPath && qAnswer && qReg) {
      const derived = qAnswer.derive(fullReport)
      const depth = qPath.depth || 'standard'
      const isMicro = depth === 'micro'
      const isDeep = depth === 'deep'
      return (
        <aside className="intel-interp intel-interp--query-active" data-tone={framing.tone} data-zone={qZone} data-depth={depth} aria-label="Guided query answer">
          <div className={`query-answer-panel query-answer-panel--${depth}`}>
            <div className="query-answer-header">
              <span className="query-answer-badge">{qReg.code}</span>
              <span className="query-answer-header-label">{isDeep ? 'GUIDED QUERY · DEEP' : 'GUIDED QUERY'}</span>
              <button className="query-answer-dismiss" onClick={onQueryDismiss} type="button" aria-label="Dismiss answer">✕</button>
            </div>
            <div className="query-answer-question">{qPath.answers}</div>
            <div className="query-answer-summary">{derived.summary}</div>
            {derived.evidence && derived.evidence.length > 0 && (
              isMicro ? (
                <div className="query-answer-evidence-inline">
                  {derived.evidence.map((e, ei) => (
                    <span key={ei} className="query-answer-evidence-chip" data-severity={e.severity}>
                      {e.label}: {e.value}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="query-answer-evidence">
                  {derived.evidence.map((e, ei) => (
                    <div key={ei} className="query-answer-evidence-row" data-severity={e.severity}>
                      <span className="query-answer-evidence-label">{e.label}</span>
                      <span className="query-answer-evidence-value">{e.value}</span>
                    </div>
                  ))}
                </div>
              )
            )}
            {!isMicro && derived.structuralContext && (
              <div className="query-answer-context">{derived.structuralContext}</div>
            )}
            {!isMicro && (
              <div className="query-answer-boundary">{qPath.boundary}</div>
            )}
          </div>
        </aside>
      )
    }
  }

  const zoneInterp = activeZoneKey && densityClass === 'EXECUTIVE_DENSE' && DENSE_ZONE_INTERPRETATIONS[activeZoneKey]
  const zoneDerived = zoneInterp ? zoneInterp.derive(fullReport) : null

  if (zoneDerived) {
    return (
      <aside className="intel-interp intel-interp--zone-active" data-tone={framing.tone} data-zone={activeZoneKey} aria-label="Zone-focused interpretation">
        <div className="interp-tag">
          <span className="interp-tag-label">{framing.label}</span>
          <span className="interp-tag-state">{badge.state_label || '—'}</span>
        </div>

        <div className="interp-zone-focus">
          <div className="interp-zone-badge">
            <span className="interp-zone-badge-code">{zoneInterp.code}</span>
            <span className="interp-zone-badge-label">{zoneInterp.sectionLabel}</span>
          </div>
          <div className="interp-zone-heading">{zoneDerived.heading}</div>
          <div className="interp-zone-body">{zoneDerived.body}</div>
          {zoneDerived.structuralNote && (
            <div className="interp-zone-structural">{zoneDerived.structuralNote}</div>
          )}

          {zoneDerived.signalDetail && zoneDerived.signalDetail.length > 0 && (
            <div className="interp-zone-signals">
              <div className="interp-zone-signals-label">SIGNAL DECOMPOSITION</div>
              {zoneDerived.signalDetail.map(s => (
                <div key={s.id} className="interp-zone-signal" data-severity={s.severity}>
                  <span className="interp-zone-signal-severity">{s.severity}</span>
                  <span className="interp-zone-signal-text">{s.interpretation}</span>
                </div>
              ))}
            </div>
          )}

          {zoneDerived.signalByRole && (
            <div className="interp-zone-signals">
              <div className="interp-zone-signals-label">SIGNAL CONCENTRATION BY ROLE</div>
              {Object.entries(zoneDerived.signalByRole).map(([role, count]) => (
                <div key={role} className="interp-zone-signal">
                  <span className="interp-zone-signal-severity">{role}</span>
                  <span className="interp-zone-signal-text">{count} elevated signal{count !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          )}

          {zoneDerived.signalSummary && (
            <div className="interp-zone-signals">
              <div className="interp-zone-signals-label">SIGNAL PRESSURE</div>
              <div className="interp-zone-signal">
                <span className="interp-zone-signal-text">
                  {zoneDerived.signalSummary.total} elevated{zoneDerived.signalSummary.critical > 0 ? ` · ${zoneDerived.signalSummary.critical} critical/high` : ''}
                </span>
              </div>
              {zoneDerived.signalSummary.compound && (
                <div className="interp-zone-signal interp-zone-signal--compound">
                  <span className="interp-zone-signal-text">{zoneDerived.signalSummary.compound}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <details className="interp-context-secondary">
          <summary className="interp-context-secondary-toggle">STRUCTURAL CONTEXT</summary>
          {narrative.executive_summary && (
            <div className="interp-block interp-block--lead">
              <div className="interp-section-label">{framing.assessmentLabel}</div>
              <div className="interp-summary">{narrative.executive_summary}</div>
            </div>
          )}
          {narrative.why_primary_statement && framing.whyLabel && (
            <div className="interp-block">
              <div className="interp-section-label">{framing.whyLabel}</div>
              <div className="interp-why">{narrative.why_primary_statement}</div>
            </div>
          )}
        </details>
        {activeConditions && activeConditions.length > 0 && swIntelActive && (
          <div className="interp-block interp-block--conditions">
            <div className="interp-section-label">OPERATIONAL CONDITIONS</div>
            <div className="interp-conditions-strip">
              {activeConditions.filter(c => c.severity !== 'NOMINAL').slice(0, 3).map(c => (
                <div key={c.condition_id} className="interp-condition-row" data-severity={c.severity}>
                  <span className="interp-condition-name">{c.operator_cognition_title}</span>
                  {c.domain_targets && c.domain_targets[0] && (
                    <span className="interp-condition-domain">{c.domain_targets[0].display_name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    )
  }

  return (
    <aside className="intel-interp" data-tone={framing.tone} aria-label="Executive interpretation layer">
      <div className="interp-tag">
        <span className="interp-tag-label">{framing.label}</span>
        <span className="interp-tag-state">{badge.state_label || '—'}</span>
      </div>
      {narrative.executive_summary && (
        <div className="interp-block interp-block--lead">
          <div className="interp-section-label">{framing.assessmentLabel}</div>
          <div className="interp-summary">{narrative.executive_summary}</div>
        </div>
      )}
      {narrative.why_primary_statement && framing.whyLabel && (
        <div className="interp-block">
          <div className="interp-section-label">{framing.whyLabel}</div>
          <div className="interp-why">{narrative.why_primary_statement}</div>
        </div>
      )}
      {narrative.structural_summary && (densityClass === 'INVESTIGATION_DENSE' || densityClass === 'EXECUTIVE_BALANCED') && framing.structuralLabel && (
        <div className="interp-block">
          <div className="interp-section-label">{framing.structuralLabel}</div>
          <div className="interp-structural">{narrative.structural_summary}</div>
        </div>
      )}
      {densityClass === 'EXECUTIVE_DENSE' && (
        swIntelActive && activeConditions && activeConditions.length > 0 ? (
          <div className="interp-block interp-block--conditions">
            <div className="interp-section-label">OPERATIONAL CONDITIONS</div>
            <div className="interp-conditions-strip">
              {activeConditions.filter(c => c.severity !== 'NOMINAL').slice(0, 3).map(c => (
                <div key={c.condition_id} className="interp-condition-row" data-severity={c.severity}>
                  <span className="interp-condition-name">{c.operator_cognition_title}</span>
                  {c.domain_targets && c.domain_targets[0] && (
                    <span className="interp-condition-domain">{c.domain_targets[0].display_name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : !swIntelActive && swIntelTeaser && swIntelTeaser.active_count > 0 ? (
          <div className="interp-block interp-block--module-teaser">
            <div className="interp-section-label">SOFTWARE INTELLIGENCE</div>
            <div className="interp-module-teaser-text">{swIntelTeaser.active_count} operational condition{swIntelTeaser.active_count !== 1 ? 's' : ''} detected</div>
            <div className="interp-module-teaser-cta">Activate Software Intelligence to inspect</div>
          </div>
        ) : null
      )}
    </aside>
  )
}

function SignalNarrativeBlock({ fullReport }) {
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  if (!sigs.length) return null

  const activated = sigs.filter(s => s.severity !== 'NOMINAL')
  const nominal = sigs.filter(s => s.severity === 'NOMINAL')

  const leadIn = activated.length > 0
    ? `Structural assessment identified ${activated.length} elevated signal${activated.length > 1 ? 's' : ''} across the semantic topology.`
    : `Structural assessment found no elevated signals — all ${sigs.length} structural indicators are within normal parameters.`

  return (
    <div className="signal-narrative" aria-label="Structural signal narrative">
      <div className="signal-narrative-label">STRUCTURAL SIGNALS</div>
      <div className="signal-narrative-lead">{leadIn}</div>
      <div className="signal-narrative-findings">
        {activated.map(sig => (
          <div key={sig.signal_id} className="signal-narrative-finding">
            <div className="signal-narrative-finding-text">{sig.interpretation}</div>
            {sig.concentration && (
              <div className="signal-narrative-finding-where">{sig.concentration}</div>
            )}
          </div>
        ))}
        {nominal.map(sig => (
          <div key={sig.signal_id} className="signal-narrative-finding signal-narrative-finding--nominal">
            <div className="signal-narrative-finding-text">{sig.interpretation}</div>
          </div>
        ))}
      </div>
      {sigs[0].compound_narrative && (
        <div className="signal-narrative-compound">{sigs[0].compound_narrative}</div>
      )}
      {sigs[0].confidence_note && (
        <div className="signal-narrative-confidence">{sigs[0].confidence_note}</div>
      )}
    </div>
  )
}

function BalancedIndicatorStrip({ adapted, blocks, scope }) {
  const origin = findByRole(blocks, 'ORIGIN')
  const badge = (adapted && adapted.readinessBadge) || {}
  const chip = (adapted && adapted.qualifierChip) || {}
  return (
    <div className="balanced-indicators">
      <div className="balanced-indicator balanced-indicator--dp">
        <div className="balanced-indicator-tag">
          <span className="actor-code">DP</span>
          <span className="actor-name">Decision Posture</span>
        </div>
        <div className="balanced-indicator-state">{badge.state_label || '—'}</div>
        {chip.renders && (
          <div className="balanced-indicator-qualifier">
            <span className="balanced-indicator-qualifier-class">{chip.class_label || chip.qualifier_class}</span>
            <span className="balanced-indicator-qualifier-note">advisory bound</span>
          </div>
        )}
      </div>
      {origin && (
        <div className="balanced-indicator balanced-indicator--pa">
          <div className="balanced-indicator-tag">
            <span className="actor-code">PA</span>
            <span className="actor-name">Pressure Anchor</span>
          </div>
          <div className="balanced-indicator-anchor" data-tier={origin.signal_cards[0].pressure_tier}>
            <span className="actor-anchor-dot" />
            <span className="actor-anchor-domain">{origin.domain_alias}</span>
            <span className="actor-anchor-tier">{origin.signal_cards[0].pressure_label}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function EvidenceBoundarySection({ scope, fullReport }) {
  const ts = (fullReport && fullReport.topology_summary) || {}
  const grounded = (scope && scope.grounded_domain_count) || ts.structurally_backed_count || 0
  const total = (scope && scope.domain_count) || ts.semantic_domain_count || 1
  const semanticOnly = Math.max(0, total - grounded)
  const clusterCount = ts.cluster_count || (scope && scope.cluster_count) || 0
  return (
    <div className="evidence-boundary" aria-label="Evidence boundary — confirmed vs unknown">
      <div className="evidence-boundary-label">EVIDENCE BOUNDARY</div>
      <div className="evidence-boundary-grid">
        <div className="evidence-boundary-col evidence-boundary-col--confirmed">
          <div className="evidence-boundary-heading">Confirmed</div>
          <div className="evidence-boundary-count">{grounded}</div>
          <div className="evidence-boundary-detail">structurally backed domains</div>
          <div className="evidence-boundary-meta">{clusterCount} clusters · grounded evidence</div>
        </div>
        <div className="evidence-boundary-divider" />
        <div className="evidence-boundary-col evidence-boundary-col--unknown">
          <div className="evidence-boundary-heading">Outside Evidence Scope</div>
          <div className="evidence-boundary-count">{semanticOnly}</div>
          <div className="evidence-boundary-detail">semantic-only domains</div>
          <div className="evidence-boundary-meta">no structural backing · advisory bound</div>
        </div>
      </div>
      <div className="evidence-boundary-note">
        These are confirmed unknowns — not assumed healthy states
      </div>
    </div>
  )
}

function StructuralConclusionBlock({ fullReport }) {
  const rs = (fullReport && fullReport.readiness_summary) || {}
  const conclusion = rs.conclusion || 'The system is structurally stable. INVESTIGATE is driven by evidence incompleteness, not structural instability.'
  return (
    <div className="structural-conclusion" aria-label="Structural conclusion">
      <div className="structural-conclusion-rule" />
      <div className="structural-conclusion-text">{conclusion}</div>
    </div>
  )
}

function PressureZoneFocusBlock({ fullReport }) {
  const ps = (fullReport && fullReport.propagation_summary) || {}
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  const zoneName = ps.primary_zone_business_label
  if (!zoneName) return null

  const activated = sigs.filter(s => s.severity !== 'NOMINAL')
  const severityTier = activated.length > 0
    ? (activated.some(s => s.severity === 'CRITICAL' || s.severity === 'HIGH') ? 'HIGH' : 'ELEVATED')
    : 'NOMINAL'
  const compound = sigs[0] && sigs[0].compound_narrative
  const zoneClassification = ps.zone_classification || (activated.length > 1 ? 'COMPOUND' : 'SINGLE')

  return (
    <div className="pressure-zone-focus" data-tier={severityTier} data-zone-key="pressureZoneFocus" aria-label="Pressure zone focus">
      <div className="pressure-zone-focus-label">PRESSURE ZONE FOCUS</div>
      <div className="pressure-zone-focus-name">{zoneName}</div>
      <div className="pressure-zone-focus-classification">
        <span className="pressure-zone-focus-class-tag">{zoneClassification}</span>
        <span className="pressure-zone-focus-class-sep">·</span>
        <span className="pressure-zone-focus-class-count">{activated.length} activated signal{activated.length !== 1 ? 's' : ''}</span>
      </div>
      {compound && (
        <div className="pressure-zone-focus-narrative">{compound}</div>
      )}
    </div>
  )
}

function TierHandoffStatement() {
  return (
    <div className="tier-handoff" aria-label="Governance handoff">
      <div className="tier-handoff-rule" />
      <div className="tier-handoff-text">
        This surface presents structurally derived evidence only. All outputs are deterministic, traceable, and bound by the governance framework. No inference, ranking, or AI-generated assessment has been applied.
      </div>
    </div>
  )
}

function QualifierNarrativeLine({ qualifierClass }) {
  if (!qualifierClass) return null
  if (qualifierClass === 'Q-01' || qualifierClass === 'Q-04' || qualifierClass === 'Q-00') return null
  const prose = qualifierClass === 'Q-02'
    ? 'This assessment includes partially grounded claims — advisory confirmation required before executive commitment.'
    : qualifierClass === 'Q-03'
    ? 'This assessment relies on semantic continuity only — structural backing is absent. Executive caution mandatory.'
    : 'Signal grounding is partial — advisory review required.'
  return (
    <div className="qualifier-narrative" role="note" aria-label="Qualifier advisory">
      <span className="qualifier-narrative-dot" />
      <span className="qualifier-narrative-text">{prose}</span>
    </div>
  )
}

function BalancedNarrativeSection({ derived, subordinateLabel }) {
  if (!derived || !derived.narrative) return null
  const tier = derived.emergenceClass
  const isTertiary = tier === 'TERTIARY'
  return (
    <div className="balanced-narrative" data-authority="INTERPRETIVE" data-emergence={tier}>
      {tier === 'PRIMARY' ? (
        <div className="balanced-narrative-marker">EXECUTIVE SYNTHESIS · 75.x</div>
      ) : (
        <div className="balanced-narrative-subordinate-marker">{subordinateLabel || 'Structural observation'}</div>
      )}
      <div className="balanced-narrative-layer1">{derived.narrative}</div>
      {!isTertiary && (
        <div className="balanced-narrative-layer2">{derived.structuralBasis}</div>
      )}
      {derived.evidenceChain && derived.evidenceChain.length > 0 && (
        <details className="balanced-narrative-layer3">
          <summary className="balanced-narrative-trace-toggle">
            {isTertiary ? `${derived.evidenceChain.length} anchor${derived.evidenceChain.length !== 1 ? 's' : ''}` : `Evidence lineage · ${derived.evidenceChain.length} anchor${derived.evidenceChain.length !== 1 ? 's' : ''}`}
          </summary>
          <div className="balanced-narrative-trace-body">
            {derived.evidenceChain.map((e, i) => (
              <div key={i} className="balanced-narrative-anchor" data-severity={e.severity}>
                <span className="balanced-narrative-anchor-source">{e.source}</span>
                <span className="balanced-narrative-anchor-claim">{e.claim}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}

function BalancedConsequenceField({ adapted, blocks, scope, renderState, fullReport, qualifierClass, onAuthorityChange, onEmergenceState }) {
  const origin = findByRole(blocks, 'ORIGIN')
  const badge = (adapted && adapted.readinessBadge) || {}
  const chip = (adapted && adapted.qualifierChip) || {}
  const grounded = (scope && scope.grounded_domain_count) || 0
  const total = (scope && scope.domain_count) || 1
  const groundedPct = Math.round((grounded / Math.max(1, total)) * 100)

  const narratives = useMemo(() => {
    const results = {}
    Object.entries(BALANCED_INTERPRETIVE_NARRATIVES).forEach(([name, fn]) => {
      results[fn.key] = fn.derive(fullReport)
    })
    return results
  }, [fullReport])

  const emergedCount = useMemo(() => {
    return Object.values(narratives).filter(n => n && n.narrative !== null).length
  }, [narratives])

  useEffect(() => {
    if (onAuthorityChange) {
      onAuthorityChange(emergedCount > 0 ? 'INTERPRETIVE' : null)
    }
  }, [emergedCount, onAuthorityChange])

  useEffect(() => {
    if (onEmergenceState) onEmergenceState(narratives)
  }, [narratives, onEmergenceState])

  const authorityActive = emergedCount > 0

  return (
    <div className="rep-field rep-field--balanced">
      <RepModeTag
        label="Executive lens"
        sub="CEO · consequence-first read"
        zones={[
          { id: 'Z1', name: 'Executive Posture' },
          { id: 'Z4', name: 'Pressure Anchor' },
        ]}
      />

      <div className="actor actor--decision-posture">
        <div className="actor-tag">
          <span className="actor-code">DP</span>
          <span className="actor-name">Decision Posture</span>
        </div>
        <div className="actor-decision-state">{badge.state_label || '—'}</div>
        <div className="actor-decision-grounding">
          <div className="actor-confidence-bar">
            <div className="actor-confidence-bar-fill" style={{ width: `${groundedPct}%` }} />
            <div className="actor-confidence-bar-advisory" style={{ width: `${100 - groundedPct}%` }} />
          </div>
          <div className="actor-confidence-meta">
            <span><span className="actor-confidence-dot actor-confidence-dot--grounded" /> {grounded} of {total} grounded</span>
            <span><span className="actor-confidence-dot actor-confidence-dot--advisory" /> {total - grounded} advisory bound</span>
          </div>
        </div>
      </div>

      {origin && (
        <div className="actor actor--pressure-anchor">
          <div className="actor-tag">
            <span className="actor-code">PA</span>
            <span className="actor-name">Pressure Anchor · origin</span>
          </div>
          <div className="actor-anchor-line" data-tier={origin.signal_cards[0].pressure_tier}>
            <span className="actor-anchor-dot" />
            <span className="actor-anchor-domain">{origin.domain_alias}</span>
            <span className="actor-anchor-tier">{origin.signal_cards[0].pressure_label}</span>
          </div>
        </div>
      )}

      <BalancedNarrativeSection derived={narratives.executiveSynthesis} />

      <QualifierNarrativeLine qualifierClass={qualifierClass} />

      <EvidenceBoundarySection scope={scope} fullReport={fullReport} />
      <BalancedNarrativeSection derived={narratives.groundingIntelligence} subordinateLabel="Grounding posture" />

      <SignalNarrativeBlock fullReport={fullReport} />
      <BalancedNarrativeSection derived={narratives.pressureIntelligence} subordinateLabel="Pressure concentration" />

      <PressureZoneFocusBlock fullReport={fullReport} />
      <BalancedNarrativeSection derived={narratives.propagationIntelligence} subordinateLabel="Propagation pattern" />

      <StructuralConclusionBlock fullReport={fullReport} />
      <BalancedNarrativeSection derived={narratives.qualificationIntelligence} subordinateLabel="Qualification compression" />

      <BalancedNarrativeSection derived={narratives.governancePosture} subordinateLabel="Governance lifecycle" />
      <BalancedNarrativeSection derived={narratives.enrichmentPosture} subordinateLabel="Substrate correction" />
      <BalancedNarrativeSection derived={narratives.convergencePosture} subordinateLabel="Cross-specimen pattern" />

      <div className="tier-handoff" aria-label="Governance handoff">
        <div className="tier-handoff-rule" />
        <div className="tier-handoff-text">
          {authorityActive
            ? 'Structural derivation primary — bounded interpretive synthesis · evidence-bound · 75.x'
            : 'This surface presents structurally derived evidence only. All outputs are deterministic, traceable, and bound by the governance framework. No inference, ranking, or AI-generated assessment has been applied.'}
        </div>
      </div>
    </div>
  )
}

function DenseSignalEntry({ sig }) {
  const [showDerivation, setShowDerivation] = useState(false)
  const family = sig.signal_family || 'DPSIG'
  const level = sig.derivation_level || (family === 'ISIG' ? 'Level_1' : family === 'PSIG' ? 'Level_2' : 'Topology')
  const translation = translateSignal(sig.signal_id)

  if (translation) {
    const isNominal = sig.severity === 'NOMINAL' || sig.activation_state === 'NOMINAL'
    const consequence = (!isNominal && translation.l3_consequence_gap)
      ? translation.l3_consequence_gap
      : translation.l3_consequence
    return (
      <div className="dense-signal-entry dense-signal-entry--translated" data-severity={sig.severity} data-family={family}>
        <div className="dense-signal-header">
          <span className="dense-signal-name">{translation.l3_title}</span>
          <span className="dense-signal-badge" data-severity={sig.severity}>{sig.severity}</span>
        </div>
        <div className="dense-signal-consequence">{consequence}</div>
        <div className="dense-signal-topology-effect">
          <span className="dense-signal-effect-label">Topology effect</span>
          <span className="dense-signal-effect-value">{translation.topology_effect}</span>
        </div>
        <div className="dense-signal-governance">
          <span className="dense-signal-governance-label">Governance</span>
          <span className="dense-signal-governance-value">{translation.governance}</span>
        </div>
        <div className="dense-signal-l2">
          <span className="dense-signal-l2-label">{translation.l2}</span>
        </div>
        <button
          className="dense-signal-derivation-toggle"
          onClick={(e) => { e.stopPropagation(); setShowDerivation(p => !p) }}
          aria-expanded={showDerivation}
        >
          {showDerivation ? '▾' : '▸'} {sig.signal_id}
        </button>
        {showDerivation && (
          <div className="dense-signal-derivation">
            <div className="dense-signal-derivation-row">
              <span className="dense-signal-derivation-key">Raw signal</span>
              <span className="dense-signal-derivation-val">{sig.signal_name}</span>
            </div>
            <div className="dense-signal-derivation-row">
              <span className="dense-signal-derivation-key">Value</span>
              <span className="dense-signal-derivation-val">{sig.signal_value != null ? sig.signal_value.toFixed(4) : '—'}</span>
            </div>
            <div className="dense-signal-derivation-row">
              <span className="dense-signal-derivation-key">Family</span>
              <span className="dense-signal-derivation-val">{family} · {level}</span>
            </div>
            {sig.concentration && (
              <div className="dense-signal-derivation-row">
                <span className="dense-signal-derivation-key">Concentration</span>
                <span className="dense-signal-derivation-val">{sig.concentration}</span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="dense-signal-entry" data-severity={sig.severity} data-family={family} data-level={level}>
      <div className="dense-signal-header">
        <span className="dense-signal-family-tag" data-family={family}>{family}</span>
        <span className="dense-signal-name">{sig.signal_name}</span>
        <span className="dense-signal-badge" data-severity={sig.severity}>{sig.severity}</span>
        <span className="dense-signal-val">{sig.signal_value != null ? sig.signal_value.toFixed(4) : '—'}</span>
      </div>
      <div className="dense-signal-prose">{sig.interpretation}</div>
      {sig.concentration && (
        <div className="dense-signal-where">{sig.concentration}</div>
      )}
      {sig.confidence_note && (
        <div className="dense-signal-level-note">{sig.confidence_note}</div>
      )}
    </div>
  )
}

function DenseSignalSection({ fullReport }) {
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  if (!sigs.length) return null

  const isigSigs = sigs.filter(s => s.signal_family === 'ISIG')
  const dpsigSigs = sigs.filter(s => !s.signal_family || s.signal_family === 'DPSIG')
  const psigSigs = sigs.filter(s => s.signal_family === 'PSIG')
  const hasMultipleFamilies = (isigSigs.length > 0) + (dpsigSigs.length > 0) + (psigSigs.length > 0) > 1

  return (
    <div className="actor actor--signal-assessment" data-zone-key="signalAssessment">
      <div className="actor-tag">
        <span className="actor-code">SA</span>
        <span className="actor-name">Structural Signal Cognition · {sigs.length} signals</span>
      </div>
      {hasMultipleFamilies ? (
        <>
          {isigSigs.length > 0 && (
            <div className="dense-signal-group" data-family="ISIG">
              <div className="dense-signal-group-head">
                <span className="dense-signal-group-label">Dependency Structure</span>
                <span className="dense-signal-group-count">{isigSigs.length}</span>
              </div>
              {isigSigs.map(sig => <DenseSignalEntry key={sig.signal_id} sig={sig} />)}
            </div>
          )}
          {dpsigSigs.length > 0 && (
            <div className="dense-signal-group" data-family="DPSIG">
              <div className="dense-signal-group-head">
                <span className="dense-signal-group-label">Topology Pressure</span>
                <span className="dense-signal-group-count">{dpsigSigs.length}</span>
              </div>
              {dpsigSigs.map(sig => <DenseSignalEntry key={sig.signal_id} sig={sig} />)}
            </div>
          )}
          {psigSigs.length > 0 && (
            <div className="dense-signal-group" data-family="PSIG">
              <div className="dense-signal-group-head">
                <span className="dense-signal-group-label">Architectural Binding</span>
                <span className="dense-signal-group-count">{psigSigs.length}</span>
              </div>
              {psigSigs.map(sig => <DenseSignalEntry key={sig.signal_id} sig={sig} />)}
            </div>
          )}
        </>
      ) : (
        sigs.map(sig => <DenseSignalEntry key={sig.signal_id} sig={sig} />)
      )}
      {sigs[0].compound_narrative && (
        <div className="dense-signal-compound">{sigs[0].compound_narrative}</div>
      )}
    </div>
  )
}

const CONDITION_TO_SURFACES = (() => {
  const map = {}
  for (const [surfaceId, condTypes] of Object.entries(SURFACE_CONDITION_MAP)) {
    for (const ct of condTypes) {
      if (!map[ct]) map[ct] = []
      map[ct].push(surfaceId)
    }
  }
  return map
})()

const SURFACE_DISPLAY_NAME = {
  DELIVERY_FRAGILITY: 'Delivery Fragility',
  COORDINATION_SATURATION: 'Coordination Saturation',
  INTEGRATION_EXPOSURE: 'Integration Exposure',
  OPERATIONAL_TOPOLOGY: 'Operational Topology',
  QUALIFICATION_EXPOSURE: 'Qualification Exposure',
  PROPAGATION_RISK: 'Propagation Risk',
}

function SynthesizedConditionEntry({ condition, isComposite, isActive, isCollapsed, onSelect, onIntervention }) {
  const [showTrace, setShowTrace] = useState(false)
  const targets = condition.domain_targets || []
  const linkedSurfaces = CONDITION_TO_SURFACES[condition.condition_type] || []

  return (
    <div
      className={`condition-entry${isComposite ? ' condition-entry--composite' : ''}${isActive ? ' condition-entry--active' : ''}${isCollapsed ? ' condition-entry--collapsed' : ''}`}
      data-severity={condition.severity}
      data-condition-type={condition.condition_type}
      onClick={onSelect ? () => onSelect(condition.condition_id) : undefined}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(condition.condition_id) } } : undefined}
    >
      <div className="condition-header">
        <span className="condition-title">{condition.operator_cognition_title}</span>
        <span className="condition-severity" data-severity={condition.severity}>{condition.severity}</span>
        {isCollapsed && targets.length > 0 && <span className="condition-collapsed-domain">{targets[0].display_name}</span>}
      </div>

      {!isCollapsed && (
        <>
          <div className="condition-consequence">{condition.operational_consequence}</div>

          {targets.length > 0 && (
            <div className="condition-targets">
              {targets.map(t => (
                <div key={t.id} className="condition-target-item">
                  <span className="condition-target-name">{t.display_name}</span>
                  <span className="condition-target-id">{t.id}</span>
                  <span className="condition-target-role">{t.condition_role}</span>
                </div>
              ))}
            </div>
          )}

          <div className="condition-topology-effect">
            <span className="condition-field-label">Topology effect</span>
            <span className="condition-field-value">{condition.topology_effect}</span>
          </div>
          <div className="condition-governance">
            <span className="condition-field-label">Governance</span>
            <span className="condition-field-value">{condition.governance_boundary === 'GOVERNED' ? 'Governed — structurally confirmed' : condition.governance_boundary === 'ADVISORY_BOUND' ? 'Advisory — structural confirmation needed' : condition.governance_boundary === 'STRUCTURAL_ONLY' ? 'Structural only — advisory-bound' : condition.governance_boundary}</span>
          </div>

          {linkedSurfaces.length > 0 && (
            <div className="condition-surface-link">
              <span className="condition-field-label">Drives</span>
              {linkedSurfaces.map(sid => (
                <span key={sid} className="condition-surface-tag">{SURFACE_DISPLAY_NAME[sid] || sid}</span>
              ))}
            </div>
          )}

          {condition.guided_interventions && condition.guided_interventions.length > 0 && (
            <div className="condition-interventions-inline">
              {condition.guided_interventions.map(gi => (
                <button key={gi.intervention_id} className="condition-intervention-btn" data-type={gi.action_type} onClick={(e) => { e.stopPropagation(); if (onIntervention) onIntervention(gi, condition) }}>
                  {gi.operator_label}
                </button>
              ))}
            </div>
          )}

          <button
            className="condition-trace-toggle"
            onClick={(e) => { e.stopPropagation(); setShowTrace(p => !p) }}
            aria-expanded={showTrace}
          >
            {showTrace ? '▾' : '▸'} {condition.supporting_signal_ids.length} contributing signal{condition.supporting_signal_ids.length !== 1 ? 's' : ''}
          </button>
          {showTrace && (
            <div className="condition-trace">
              <div className="condition-trace-row">
                <span className="condition-trace-key">L1 internal</span>
                <span className="condition-trace-val">{condition.internal_condition_id}</span>
              </div>
              <div className="condition-trace-row">
                <span className="condition-trace-key">Signals</span>
                <span className="condition-trace-val">{condition.supporting_signal_ids.join(', ')}</span>
              </div>
              <div className="condition-trace-row">
                <span className="condition-trace-key">Derivation</span>
                <span className="condition-trace-val">{condition.derivation_trace}</span>
              </div>
              {isComposite && condition.contributing_condition_ids && (
                <div className="condition-trace-row">
                  <span className="condition-trace-key">Contributing</span>
                  <span className="condition-trace-val">{condition.contributing_condition_ids.join(' · ')}</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SynthesizedConditionSection({ fullReport, activeConditionId, onConditionSelect, onConditionIntervention, swIntelActive, swIntelTeaser }) {
  const result = useMemo(() => swIntelActive ? synthesize(fullReport) : null, [fullReport, swIntelActive])

  if (!swIntelActive) {
    if (!swIntelTeaser || swIntelTeaser.active_count === 0) return null
    return (
      <div className="actor actor--synthesized-conditions actor--module-teaser" data-zone-key="signalAssessment">
        <div className="actor-tag">
          <span className="actor-code">SW</span>
          <span className="actor-name">Software Intelligence available · {swIntelTeaser.active_count} operational condition{swIntelTeaser.active_count !== 1 ? 's' : ''} detected</span>
        </div>
        <div className="module-teaser-body">
          <div className="module-teaser-headline">Software Intelligence available</div>
          <div className="module-teaser-count">{swIntelTeaser.active_count} operational software condition{swIntelTeaser.active_count !== 1 ? 's' : ''} detected.</div>
          <div className="module-teaser-prompt">Activate Software Intelligence to inspect:</div>
          <div className="module-teaser-list">
            {swIntelTeaser.top_conditions.map(c => (
              <div key={c.condition_id} className="module-teaser-item" data-severity={c.severity}>
                <span className="module-teaser-item-severity">{c.severity}</span>
                <span className="module-teaser-item-title">{c.title}</span>
              </div>
            ))}
            {swIntelTeaser.overflow > 0 && (
              <div className="module-teaser-overflow">+{swIntelTeaser.overflow} more condition{swIntelTeaser.overflow !== 1 ? 's' : ''}</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!result || !result.conditions.length) return null
  const { active, suppressed, composites, summary } = result
  const sortedActive = [...active].sort((a, b) => (SEVERITY_RANK[a.severity] ?? 5) - (SEVERITY_RANK[b.severity] ?? 5))
  const compositeIds = new Set(composites.map(c => c.condition_id))
  const activeComposites = sortedActive.filter(c => compositeIds.has(c.condition_id))
  const activePrimitives = sortedActive.filter(c => !compositeIds.has(c.condition_id))

  const hasActiveSelection = !!activeConditionId
  const effectiveActiveId = activeConditionId || (result.primary && result.primary.condition_id)

  return (
    <div className="actor actor--synthesized-conditions" data-zone-key="signalAssessment">
      <div className="actor-tag">
        <span className="actor-code">SC</span>
        <span className="actor-name">Structural Signal Cognition · {summary.active_count} condition{summary.active_count !== 1 ? 's' : ''} active{summary.suppressed_count > 0 ? ` · ${summary.suppressed_count} suppressed` : ''}</span>
      </div>

      {activeComposites.length > 0 && (
        <div className="condition-group" data-group="composite">
          {!hasActiveSelection && <div className="condition-group-head">
            <span className="condition-group-label">Convergence Conditions</span>
            <span className="condition-group-count">{activeComposites.length}</span>
          </div>}
          {activeComposites.map(c => <SynthesizedConditionEntry key={c.condition_id} condition={c} isComposite={true} isActive={effectiveActiveId === c.condition_id} isCollapsed={hasActiveSelection && effectiveActiveId !== c.condition_id} onSelect={onConditionSelect} onIntervention={onConditionIntervention} />)}
        </div>
      )}

      {activePrimitives.length > 0 && (
        <div className="condition-group" data-group="primitive">
          {!hasActiveSelection && <div className="condition-group-head">
            <span className="condition-group-label">Structural Conditions</span>
            <span className="condition-group-count">{activePrimitives.length}</span>
          </div>}
          {activePrimitives.map(c => <SynthesizedConditionEntry key={c.condition_id} condition={c} isComposite={false} isActive={effectiveActiveId === c.condition_id} isCollapsed={hasActiveSelection && effectiveActiveId !== c.condition_id} onSelect={onConditionSelect} onIntervention={onConditionIntervention} />)}
        </div>
      )}

      {suppressed.length > 0 && (
        <div className="condition-group condition-group--suppressed" data-group="suppressed">
          <div className="condition-group-head">
            <span className="condition-group-label">Nominal</span>
            <span className="condition-group-count">{suppressed.length}</span>
          </div>
          {suppressed.map(c => <SynthesizedConditionEntry key={c.condition_id} condition={c} isComposite={false} isActive={false} isCollapsed={hasActiveSelection} onSelect={onConditionSelect} onIntervention={onConditionIntervention} />)}
        </div>
      )}
    </div>
  )
}

function DenseGovernanceZone({ fullReport }) {
  const gl = fullReport && fullReport.governance_lifecycle
  const pc = fullReport && fullReport.proposition_corpus
  const rv = fullReport && fullReport.revalidation_intelligence
  const ca = fullReport && fullReport.constitutional_anchor
  const cc = fullReport && fullReport.chronicle_certification

  if (!gl || !gl.available) return null

  return (
    <div className="actor actor--governance-lifecycle" data-zone-key="governanceLifecycle">
      <div className="actor-tag">
        <span className="actor-code">GL</span>
        <span className="actor-name">Governance Lifecycle</span>
      </div>

      <div className="dense-governance-header">
        <span className="dense-governance-s-level" data-level={gl.s_level}>{gl.s_level}</span>
        <span className="dense-governance-provenance">{(gl.qualification_provenance || '').replace(/_/g, ' ')}</span>
        <span className="dense-governance-ceiling">Ceiling: {gl.authority_ceiling}</span>
        {cc && cc.available && (
          <span className="dense-governance-cert" data-status={cc.certification_status}>
            {cc.certification_status === 'CERTIFIED' ? 'REPLAY-CERTIFIED' : cc.certification_status}
          </span>
        )}
      </div>

      {pc && pc.available && (
        <div className="dense-governance-propositions">
          <div className="dense-governance-prop-row">
            <span className="dense-governance-prop-total">{pc.total} propositions</span>
            <span className="dense-governance-prop-detail">
              {pc.disposition_counts.accepted} accepted · {pc.disposition_counts.rejected} rejected · {pc.disposition_counts.arbitrated} arbitrated
            </span>
          </div>
          <div className="dense-governance-class-row">
            {Object.entries(pc.by_class || {}).map(([cls, count]) => (
              <span key={cls} className="dense-governance-class-chip">
                <span className="dense-governance-class-count">{count}</span>
                <span className="dense-governance-class-name">{cls.replace(/_/g, ' ')}</span>
              </span>
            ))}
          </div>
          <div className="dense-governance-confidence">
            Mean confidence: {pc.mean_confidence.toFixed(3)} · Friction: {(pc.governance_friction_rate * 100).toFixed(1)}%
          </div>
        </div>
      )}

      <div className="dense-governance-checks">
        {rv && rv.available && (
          <span className="dense-governance-check-item" data-status={rv.status}>
            Revalidation {rv.passed}/{rv.total_checks} · {rv.phase_count} phases
          </span>
        )}
        {ca && ca.available && (
          <span className="dense-governance-check-item" data-status={ca.advancement_blocked ? 'BLOCKED' : 'PASS'}>
            Anchor {ca.summary.passed}/{ca.summary.total} dimensions
          </span>
        )}
        {cc && cc.available && (
          <span className="dense-governance-check-item" data-status={cc.failed > 0 ? 'FAIL' : 'PASS'}>
            Certification {cc.passed}/{cc.total_checks} checks
          </span>
        )}
      </div>

      {gl.transitions && gl.transitions.length > 0 && (
        <div className="dense-governance-transitions">
          {gl.transitions.map((t, i) => (
            <div key={i} className="dense-governance-transition">
              <span className="dense-governance-transition-path">{t.from} → {t.to}</span>
              <span className="dense-governance-transition-actor">{t.actor || '—'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DenseTopologyField({ adapted, blocks, scope, fullReport, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, onZoneChange, cognitionOverlay, onPressureZoneClick, activePressureZone, activeConditionId, onConditionSelect, onConditionIntervention, swIntelActive, swIntelTeaser }) {
  const [topoModalOpen, setTopoModalOpen] = useState(false)
  const openTopoModal = useCallback(() => setTopoModalOpen(true), [])
  const closeTopoModal = useCallback(() => setTopoModalOpen(false), [])
  const fieldRef = useRef(null)
  const pinnedZoneRef = useRef(null)

  useEffect(() => {
    if (!fieldRef.current || !onZoneChange) return
    let rafId = null

    function updateActiveZone() {
      if (pinnedZoneRef.current) return
      const actors = fieldRef.current ? fieldRef.current.querySelectorAll('[data-zone-key]') : []
      if (!actors.length) return
      const vpCenter = window.innerHeight / 2
      let best = null
      let bestDist = Infinity
      actors.forEach(actor => {
        const rect = actor.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > window.innerHeight) return
        const dist = Math.abs((rect.top + rect.bottom) / 2 - vpCenter)
        if (dist < bestDist) { best = actor.getAttribute('data-zone-key'); bestDist = dist }
      })
      if (best) onZoneChange(best)
    }

    function onScroll() {
      if (rafId) return
      rafId = requestAnimationFrame(() => { rafId = null; updateActiveZone() })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateActiveZone()
    return () => { window.removeEventListener('scroll', onScroll); if (rafId) cancelAnimationFrame(rafId) }
  }, [onZoneChange])
  const isS1 = fullReport && fullReport.qualification_level === 'S1'
  const origin = findByRole(blocks, 'ORIGIN')
  const passthrough = findByRole(blocks, 'PASS_THROUGH')
  const receiver = findByRole(blocks, 'RECEIVER')
  const grounded = (scope && scope.grounded_domain_count) || 0
  const total = (scope && scope.domain_count) || 1
  const semanticOnly = Math.max(0, total - grounded)
  const ps = (fullReport && fullReport.propagation_summary) || {}
  const pressureZone = ps.primary_zone_business_label || ''
  return (
    <div className="rep-field rep-field--dense" ref={fieldRef}>
      <RepModeTag
        label="Structural lens"
        sub={isS1 ? 'CTO · structural topology and authority' : 'CTO · structural cause and propagation'}
        zones={isS1 ? [
          { id: 'Z6', name: 'Cluster Concentration' },
        ] : [
          { id: 'Z3', name: 'Semantic Topology' },
          { id: 'Z4', name: 'Pressure Anchor' },
          { id: 'Z6', name: 'Cluster Concentration' },
        ]}
      />

      {!isS1 && <div className="actor actor--semantic-topology" data-zone-key="semanticTopology">
        <div className="actor-tag">
          <span className="actor-code">ST · SB · SO</span>
          <span className="actor-name">Semantic Topology · structural backing · semantic-only exposure</span>
        </div>
        <div className="actor-topo-matrix">
          {[origin, passthrough, receiver].filter(Boolean).map(node => {
            const grounded = node.grounding_status === 'Q-00'
            const tier = node.signal_cards[0].pressure_tier
            return (
              <div
                key={node.domain_alias}
                className={`actor-topo-cell actor-topo-cell--${grounded ? 'grounded' : 'semantic-only'}`}
                data-tier={tier}
              >
                <div className="actor-topo-cell-role">{node.propagation_role.replace(/_/g, '-')}</div>
                <div className="actor-topo-cell-name">{node.domain_alias}</div>
                <div className="actor-topo-cell-state">
                  <span className="actor-topo-cell-tier">{node.signal_cards[0].pressure_label}</span>
                </div>
                <div className="actor-topo-cell-backing">
                  {grounded ? (
                    <><span className="actor-topo-cell-backing-dot actor-topo-cell-backing-dot--grounded" /> structurally backed · {node.grounding_status}</>
                  ) : (
                    <><span className="actor-topo-cell-backing-dot actor-topo-cell-backing-dot--semantic" /> semantic-only · {node.grounding_status} advisory</>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="actor-topo-summary">
          <span><strong>{grounded}</strong> of {total} structurally backed</span>
          <span className="actor-topo-summary-sep">·</span>
          <span><strong>{semanticOnly}</strong> semantic-only exposure</span>
        </div>
      </div>}

      {scope && scope.cluster_count != null && (() => {
        const ts = (fullReport && fullReport.topology_summary) || {}
        const enriched = ts.enrichment_source
        return (
        <div className="actor actor--cluster-concentration" data-zone-key="clusterConcentration">
          <div className="actor-tag">
            <span className="actor-code">CC</span>
            <span className="actor-name">Cluster Concentration{enriched ? ' · Code Graph Enriched' : ''}</span>
          </div>
          <div className="actor-cluster-headline">
            <span className="actor-cluster-value">{scope.cluster_count}</span>
            <span className="actor-cluster-label">clusters monitored</span>
          </div>
          {enriched && (
            <div className="actor-cluster-enrichment">
              <span className="actor-cluster-enrichment-stat"><strong>{(ts.total_import_edges || 0).toLocaleString()}</strong> import edges</span>
              <span className="actor-cluster-enrichment-sep">·</span>
              <span className="actor-cluster-enrichment-stat"><strong>{(ts.total_inheritance_edges || 0).toLocaleString()}</strong> inheritance edges</span>
              <span className="actor-cluster-enrichment-sep">·</span>
              <span className="actor-cluster-enrichment-stat"><strong>{(ts.total_classes || 0).toLocaleString()}</strong> classes</span>
              <span className="actor-cluster-enrichment-sep">·</span>
              <span className="actor-cluster-enrichment-stat"><strong>{(ts.code_graph_file_count || 0).toLocaleString()}</strong> code graph files</span>
            </div>
          )}
          <div className="actor-cluster-bar">
            <div
              className="actor-cluster-bar-fill"
              style={{ width: `${Math.min(100, Math.round((grounded / Math.max(1, total)) * 100))}%` }}
            />
          </div>
          <div className="actor-cluster-meta">
            {enriched
              ? `${(ts.total_structural_edges || 0).toLocaleString()} structural edges across ${ts.code_graph_file_count || '?'} files — import + inheritance authority resolved`
              : 'structural mass concentrated upstream — Primary Delivery holds 23 of 31 active clusters; coordination layer absorbs propagation'}
          </div>
        </div>
        )
      })()}

      {!isS1 && passthrough && (
        <div className="actor actor--absorption-load" data-zone-key="absorptionLoad">
          <div className="actor-tag">
            <span className="actor-code">AL</span>
            <span className="actor-name">Absorption Load</span>
          </div>
          <div className="actor-absorption-panel">
            <div className="actor-absorption-domain">{passthrough.domain_alias}</div>
            <div className="actor-absorption-state">conducting · not generating</div>
            <div className="actor-absorption-bar">
              <div className="actor-absorption-bar-fill" style={{ width: '68%' }} />
            </div>
            <div className="actor-absorption-meta">
              <span className="actor-absorption-meta-value">68%</span>
              <span className="actor-absorption-meta-label">of upstream propagated load absorbed</span>
            </div>
            <div className="actor-absorption-note">
              Pattern consistent with organizational stress migration, not isolated incident.
            </div>
          </div>
        </div>
      )}

      <SynthesizedConditionSection fullReport={fullReport} activeConditionId={activeConditionId} onConditionSelect={onConditionSelect} onConditionIntervention={onConditionIntervention} swIntelActive={swIntelActive} swIntelTeaser={swIntelTeaser} />

      {!isS1 && (origin || passthrough || receiver) && (
        <div className="actor actor--propagation-flow" data-zone-key="propagationFlow">
          <div className="actor-tag">
            <span className="actor-code">PF</span>
            <span className="actor-name">Pressure Propagation Flow</span>
          </div>
          <div className="propagation-flow-strip">
            {[origin, passthrough, receiver].filter(Boolean).map((node, i, arr) => {
              const tier = node.signal_cards[0].pressure_tier
              const grounded = node.grounding_status === 'Q-00'
              return (
                <div key={node.domain_alias} className="propagation-flow-node" data-tier={tier}>
                  {i > 0 && <div className="propagation-flow-arrow">→</div>}
                  <div className="propagation-flow-card">
                    <div className="propagation-flow-role">{node.propagation_role.replace(/_/g, '-')}</div>
                    <div className="propagation-flow-domain">{node.domain_alias}</div>
                    <div className="propagation-flow-pressure">{node.signal_cards[0].pressure_label}</div>
                    <div className={`propagation-flow-backing${grounded ? ' propagation-flow-backing--grounded' : ''}`}>
                      {grounded ? 'structurally backed' : 'semantic-only'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="propagation-flow-narrative">
            Pressure originates upstream and propagates through the coordination layer — structural, not incidental.
          </div>
        </div>
      )}

      {!isS1 && <PressureZoneFocusBlock fullReport={fullReport} />}

      <DenseGovernanceZone fullReport={fullReport} />

      {fullReport && fullReport.semantic_domain_registry && fullReport.semantic_domain_registry.length > 0 && (() => {
        const tm = (fullReport && fullReport.topology_maturity) || {}
        const svgPolicy = tm.svg_policy || 'REGISTRY'
        const showFullSvg = svgPolicy === 'FULL' || svgPolicy === 'ENRICHED'
        const clusters = fullReport.semantic_cluster_registry || []
        return (
          <div className="actor actor--topology-surface" data-zone-key="topologySurface">
            <div className="actor-tag">
              <span className="actor-code">TS</span>
              <span className="actor-name">Topology Surface</span>
              <span className={`topo-maturity-badge topo-maturity-badge--${(tm.level || 'STRUCTURAL_REGISTRY').toLowerCase().replace(/_/g, '-')}`}>
                {tm.label || 'Structural Registry'}
              </span>
            </div>
            <div className="topo-maturity-description">{tm.description || ''}</div>
            {showFullSvg ? (
              <div className={`dense-topology-preview${cognitionOverlay ? '' : ''}`} onClick={cognitionOverlay ? undefined : openTopoModal} role="button" tabIndex={0} aria-label={cognitionOverlay ? cognitionOverlay.topology_label : 'Open topology explorer'} onKeyDown={e => e.key === 'Enter' && !cognitionOverlay && openTopoModal()}>
                <TopologyGraph
                  domains={fullReport.semantic_domain_registry}
                  clusters={clusters}
                  edges={fullReport.semantic_topology_edges || []}
                  pressureZoneLabel={pressureZone}
                  pressureZoneState={fullReport.pressure_zone_state}
                  cognitionOverlay={cognitionOverlay}
                  onPressureZoneClick={onPressureZoneClick}
                  activePressureZone={activePressureZone}
                />
                <div className="dense-topology-hint">{cognitionOverlay ? cognitionOverlay.topology_label : 'Open structural topology'}</div>
              </div>
            ) : (
              <div className="topo-registry-compact">
                <div className="topo-registry-heading">
                  {isS1
                    ? `${clusters.length} STRUCTURAL CLUSTERS — DIRECTORY TOPOLOGY`
                    : `${clusters.length} STRUCTURAL CLUSTERS — REGISTRY VIEW`}
                </div>
                <div className="topo-registry-grid">
                  {clusters.map(c => (
                    <div key={c.cluster_id} className={`topo-registry-item${c.color_accent === '#ffd700' ? ' topo-registry-item--anchor' : ''}`}>
                      <span className="topo-registry-item-id">{c.cluster_id}</span>
                      <span className="topo-registry-item-name">{c.cluster_label || c.cluster_id}</span>
                      <span className="topo-registry-item-count">{c.node_count || 0}</span>
                    </div>
                  ))}
                </div>
                {svgPolicy === 'COMPACT' && (
                  <div className="topo-registry-expand" onClick={openTopoModal} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && openTopoModal()}>
                    Expand full cluster topology
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })()}

      {fullReport && fullReport.structural_enrichment && fullReport.structural_enrichment.available && (
        <StructuralSpinesPanel structuralEnrichment={fullReport.structural_enrichment} />
      )}

      {topoModalOpen && createPortal(<TopologyModal fullReport={fullReport} onClose={closeTopoModal} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} temporalAnalyticsData={temporalAnalyticsData} temporalLifecycleData={temporalLifecycleData} mode="dense" />, document.body)}
    </div>
  )
}

function InvestigationTraceField({ adapted, blocks, scope, fullReport, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData }) {
  const [topoModalOpen, setTopoModalOpen] = useState(false)
  const openTopoModal = useCallback(() => setTopoModalOpen(true), [])
  const closeTopoModal = useCallback(() => setTopoModalOpen(false), [])
  const ps = (fullReport && fullReport.propagation_summary) || {}
  const pressureZone = ps.primary_zone_business_label || ''
  const signalRows = []
  ;(blocks || []).forEach(block => {
    ;(block.signal_cards || []).forEach((card, idx) => {
      signalRows.push({
        signal_label: card.signal_label,
        pressure_label: card.pressure_label,
        pressure_tier: card.pressure_tier,
        evidence_text: card.evidence_text,
        domain: block.domain_alias,
        role: block.propagation_role,
        grounding_status: block.grounding_status,
        grounding_label: block.grounding_label,
        is_first_in_block: idx === 0,
      })
    })
  })

  const traceLinkage = (fullReport && fullReport.trace_linkage) || {}
  const renderingMeta = (fullReport && fullReport.rendering_metadata) || {}
  const aliRules = renderingMeta.ali_rules_applied || []
  const qRules = renderingMeta.qualifier_rules_applied || []

  return (
    <div className="rep-field rep-field--investigation">
      <RepModeTag
        label="Evidence lens"
        sub="Analyst · evidence trace and confidence"
        zones={[
          { id: 'Z7', name: 'Evidence Trace' },
          { id: 'Z5', name: 'Signal Stack' },
          { id: 'Z2', name: 'Resolution Boundary' },
          { id: 'GA', name: 'Governance Audit' },
        ]}
      />

      <InvestigationReadingGuide />

      <div className="actor actor--evidence-trace">
        <div className="actor-tag">
          <span className="actor-code">ET</span>
          <span className="actor-name">Evidence Trace · lineage</span>
        </div>
        <div className="actor-trace-lineage">
          {[
            { label: 'Evidence object hash', value: traceLinkage.evidence_object_hash },
            { label: 'Derivation hash', value: traceLinkage.derivation_hash },
            { label: 'Baseline anchor', value: traceLinkage.baseline_anchor },
            { label: 'Run id', value: traceLinkage.run_id },
          ].filter(r => r.value).map((row, i, arr) => (
            <div key={row.label} className="actor-trace-step">
              <div className="actor-trace-step-marker">
                <span className="actor-trace-step-dot" />
                {i < arr.length - 1 && <span className="actor-trace-step-edge" />}
              </div>
              <div className="actor-trace-step-meta">
                <div className="actor-trace-step-label">{row.label}</div>
                <div className="actor-trace-step-value" title={row.value}>{row.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {signalRows.length > 0 && (
        <div className="actor actor--signal-stack">
          <div className="actor-tag">
            <span className="actor-code">SS</span>
            <span className="actor-name">Signal Stack · {signalRows.length} active</span>
          </div>
          <div className="actor-signal-list">
            {signalRows.map((s, i) => (
              <div key={i} className="actor-signal-row" data-tier={s.pressure_tier} data-grounding={s.grounding_status}>
                <div className="actor-signal-row-mark">
                  <span className="actor-signal-row-dot" />
                  <span className="actor-signal-row-tier"><TermHint term={s.pressure_tier}>{s.pressure_tier}</TermHint></span>
                </div>
                <div className="actor-signal-row-body">
                  <div className="actor-signal-row-head">
                    <span className="actor-signal-row-name">{s.signal_label}</span>
                    <span className="actor-signal-row-domain">{s.domain}</span>
                  </div>
                  <div className="actor-signal-row-pressure">{s.pressure_label}</div>
                  <div className="actor-signal-row-evidence">{s.evidence_text}</div>
                  <div className="actor-signal-row-conf">
                    <span className="actor-signal-row-conf-label"><TermHint term="Confidence">Confidence</TermHint></span>
                    <span className="actor-signal-row-conf-value">{s.grounding_label}</span>
                    {s.grounding_status !== 'Q-00' && <span className="actor-signal-row-conf-flag"><TermHint term="advisory bound">advisory bound</TermHint></span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <InvestigationSignalAudit fullReport={fullReport} signalRowCount={signalRows.length} />

      <div className="actor actor--inference-prohibition">
        <div className="actor-tag">
          <span className="actor-code">IP</span>
          <span className="actor-name">Inference Prohibition</span>
        </div>
        <div className="actor-inference-statement">
          Executive action on partially-grounded signals requires advisory confirmation. The system MUST NOT infer beyond evidence, MUST NOT recommend without grounding, and MUST NOT overstate readiness when a qualifier applies.
        </div>
        <div className="actor-inference-rules">
          <div className="actor-inference-rules-block">
            <span className="actor-inference-rules-label">Qualifier rules applied</span>
            <div className="actor-inference-rules-list">
              {qRules.length > 0 ? qRules.map(r => <span key={r} className="actor-inference-rule">{r}</span>) : <span className="actor-inference-rule">—</span>}
            </div>
          </div>
          <div className="actor-inference-rules-block">
            <span className="actor-inference-rules-label">ALI rules applied</span>
            <div className="actor-inference-rules-list">
              {aliRules.length > 0 ? aliRules.map(r => <span key={r} className="actor-inference-rule">{r}</span>) : <span className="actor-inference-rule">—</span>}
            </div>
          </div>
        </div>
      </div>

      <InvestigationGovernanceAudit fullReport={fullReport} />

      {fullReport && fullReport.semantic_domain_registry && fullReport.semantic_domain_registry.length > 0 && (
        <div className="investigation-topology-preview" onClick={openTopoModal} role="button" tabIndex={0} aria-label="Open topology explorer" onKeyDown={e => e.key === 'Enter' && openTopoModal()}>
          <TopologyGraph
            domains={fullReport.semantic_domain_registry}
            clusters={fullReport.semantic_cluster_registry || []}
            edges={fullReport.semantic_topology_edges || []}
            pressureZoneLabel={pressureZone}
            pressureZoneState={fullReport.pressure_zone_state}
          />
          <div className="investigation-topology-hint">Open forensic topology</div>
        </div>
      )}

      {topoModalOpen && createPortal(<TopologyModal fullReport={fullReport} onClose={closeTopoModal} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} temporalAnalyticsData={temporalAnalyticsData} temporalLifecycleData={temporalLifecycleData} mode="investigation" />, document.body)}

      <TierHandoffStatement />
    </div>
  )
}

function InvestigationSignalAudit({ fullReport, signalRowCount }) {
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  if (!sigs.length || sigs.length <= signalRowCount) return null

  const isigSigs = sigs.filter(s => s.signal_family === 'ISIG')
  const dpsigSigs = sigs.filter(s => !s.signal_family || s.signal_family === 'DPSIG')
  const psigSigs = sigs.filter(s => s.signal_family === 'PSIG')

  const renderEntry = (sig) => {
    const family = sig.signal_family || 'DPSIG'
    return (
      <tr key={sig.signal_id} data-severity={sig.severity} data-family={family}>
        <td className="inv-gov-id">{sig.signal_id}</td>
        <td><span className="dense-signal-family-tag" data-family={family}>{family}</span></td>
        <td>{sig.signal_name}</td>
        <td className="inv-gov-num">{sig.signal_value != null ? sig.signal_value.toFixed(4) : '—'}</td>
        <td data-severity={sig.severity}>{sig.severity}</td>
        <td className="inv-gov-detail">{sig.interpretation}</td>
      </tr>
    )
  }

  return (
    <div className="actor actor--signal-audit">
      <div className="actor-tag">
        <span className="actor-code">SA</span>
        <span className="actor-name">Signal Audit · {sigs.length} signals across {(isigSigs.length > 0) + (dpsigSigs.length > 0) + (psigSigs.length > 0)} families</span>
      </div>
      <div className="inv-signal-summary">
        {isigSigs.length > 0 && <span className="inv-signal-family-chip" data-family="ISIG">ISIG Level 1 · {isigSigs.length}</span>}
        {dpsigSigs.length > 0 && <span className="inv-signal-family-chip" data-family="DPSIG">DPSIG Topology · {dpsigSigs.length}</span>}
        {psigSigs.length > 0 && <span className="inv-signal-family-chip" data-family="PSIG">PSIG Level 2 · {psigSigs.length}</span>}
      </div>
      <table className="inv-gov-table">
        <thead><tr><th>ID</th><th>Family</th><th>Signal</th><th>Value</th><th>Severity</th><th>Interpretation</th></tr></thead>
        <tbody>
          {isigSigs.map(renderEntry)}
          {dpsigSigs.map(renderEntry)}
          {psigSigs.map(renderEntry)}
        </tbody>
      </table>
      {isigSigs.length > 0 && (
        <div className="inv-signal-isig-detail">
          <div className="inv-gov-sub-head">Level 1 — File Structure Signals</div>
          {isigSigs.map(sig => (
            <div key={sig.signal_id} className="inv-signal-isig-entry">
              <div className="inv-signal-isig-header">
                <span className="inv-signal-isig-name">{sig.signal_name}</span>
                <span className="inv-signal-isig-value">{sig.signal_value != null ? sig.signal_value.toFixed(4) : '—'}</span>
              </div>
              {sig.concentration && <div className="inv-signal-isig-entity">{sig.concentration}</div>}
              <div className="inv-signal-isig-note">{sig.confidence_note}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function InvestigationGovernanceAudit({ fullReport }) {
  const gl = fullReport && fullReport.governance_lifecycle
  const pc = fullReport && fullReport.proposition_corpus
  const ei = fullReport && fullReport.enrichment_intelligence
  const rv = fullReport && fullReport.revalidation_intelligence
  const ca = fullReport && fullReport.constitutional_anchor
  const ci = fullReport && fullReport.convergence_intelligence
  const cc = fullReport && fullReport.chronicle_certification

  if (!gl || !gl.available) return null

  return (
    <div className="actor actor--investigation-governance">
      <div className="actor-tag">
        <span className="actor-code">GA</span>
        <span className="actor-name">Governance Audit · full traversal</span>
      </div>

      <div className="inv-gov-section">
        <div className="inv-gov-section-head">Governance Lifecycle</div>
        <table className="inv-gov-table">
          <tbody>
            <tr><td className="inv-gov-key">S-Level</td><td className="inv-gov-val">{gl.s_level}</td></tr>
            <tr><td className="inv-gov-key">Provenance</td><td className="inv-gov-val">{(gl.qualification_provenance || '—').replace(/_/g, ' ')}</td></tr>
            <tr><td className="inv-gov-key">Authority ceiling</td><td className="inv-gov-val">{gl.authority_ceiling || '—'}</td></tr>
            <tr><td className="inv-gov-key">Promotion eligible</td><td className="inv-gov-val">{gl.promotion_eligible != null ? String(gl.promotion_eligible) : '—'}</td></tr>
            {gl.hold_reason && <tr><td className="inv-gov-key">Hold reason</td><td className="inv-gov-val inv-gov-val--warn">{gl.hold_reason}</td></tr>}
            <tr><td className="inv-gov-key">Last updated</td><td className="inv-gov-val">{gl.last_updated || '—'}</td></tr>
          </tbody>
        </table>
        {gl.transitions && gl.transitions.length > 0 && (
          <div className="inv-gov-transitions">
            <div className="inv-gov-sub-head">State Transitions ({gl.transition_count})</div>
            <table className="inv-gov-table">
              <thead><tr><th>From</th><th>To</th><th>Actor</th><th>Action</th><th>Timestamp</th></tr></thead>
              <tbody>
                {gl.transitions.map((t, i) => (
                  <tr key={i}>
                    <td>{t.from}</td><td>{t.to}</td>
                    <td>{t.actor || '—'}</td><td>{t.action || '—'}</td>
                    <td className="inv-gov-ts">{t.timestamp || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pc && pc.available && (
        <div className="inv-gov-section">
          <div className="inv-gov-section-head">Proposition Corpus ({pc.total})</div>
          <div className="inv-gov-grid">
            <div className="inv-gov-stat"><span className="inv-gov-stat-val">{pc.disposition_counts.accepted}</span><span className="inv-gov-stat-label">Accepted</span></div>
            <div className="inv-gov-stat"><span className="inv-gov-stat-val inv-gov-stat-val--reject">{pc.disposition_counts.rejected}</span><span className="inv-gov-stat-label">Rejected</span></div>
            <div className="inv-gov-stat"><span className="inv-gov-stat-val inv-gov-stat-val--arb">{pc.disposition_counts.arbitrated}</span><span className="inv-gov-stat-label">Arbitrated</span></div>
            <div className="inv-gov-stat"><span className="inv-gov-stat-val">{pc.disposition_counts.contested}</span><span className="inv-gov-stat-label">Contested</span></div>
          </div>
          <table className="inv-gov-table">
            <tbody>
              <tr><td className="inv-gov-key">Mean confidence</td><td className="inv-gov-val">{pc.mean_confidence.toFixed(4)}</td></tr>
              <tr><td className="inv-gov-key">Friction rate</td><td className="inv-gov-val">{(pc.governance_friction_rate * 100).toFixed(2)}%</td></tr>
              <tr><td className="inv-gov-key">Derivation path</td><td className="inv-gov-val">{pc.derivation_path || '—'}</td></tr>
              <tr><td className="inv-gov-key">Review status</td><td className="inv-gov-val">{pc.review_status || '—'}</td></tr>
              <tr><td className="inv-gov-key">Review completed by</td><td className="inv-gov-val">{pc.review_completed_by || '—'}</td></tr>
              <tr><td className="inv-gov-key">Obligations</td><td className="inv-gov-val">{pc.obligations_met}/{pc.obligations_total} met</td></tr>
            </tbody>
          </table>
          <div className="inv-gov-sub-head">By Class</div>
          <div className="inv-gov-class-grid">
            {Object.entries(pc.by_class || {}).map(([cls, count]) => (
              <div key={cls} className="inv-gov-class-item">
                <span className="inv-gov-class-count">{count}</span>
                <span className="inv-gov-class-name">{cls.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
          <div className="inv-gov-sub-head">By Tier</div>
          <div className="inv-gov-class-grid">
            {Object.entries(pc.by_tier || {}).map(([tier, count]) => (
              <div key={tier} className="inv-gov-class-item">
                <span className="inv-gov-class-count">{count}</span>
                <span className="inv-gov-class-name">{tier}</span>
              </div>
            ))}
          </div>
          {pc.flagged_items && pc.flagged_items.length > 0 && (
            <>
              <div className="inv-gov-sub-head">Flagged Items ({pc.flagged_items.length})</div>
              <table className="inv-gov-table inv-gov-table--compact">
                <thead><tr><th>Proposition</th><th>Disposition</th><th>Rationale</th></tr></thead>
                <tbody>
                  {pc.flagged_items.map((fi, i) => (
                    <tr key={i}>
                      <td className="inv-gov-id">{fi.proposition_id}</td>
                      <td data-disposition={fi.disposition}>{fi.disposition}</td>
                      <td>{fi.rationale || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {ca && ca.available && (
        <div className="inv-gov-section">
          <div className="inv-gov-section-head">Constitutional Anchor ({ca.dimensions.length} dimensions)</div>
          <table className="inv-gov-table">
            <tbody>
              <tr><td className="inv-gov-key">Overall verdict</td><td className="inv-gov-val" data-verdict={ca.overall_verdict}>{ca.overall_verdict}</td></tr>
              <tr><td className="inv-gov-key">Target level</td><td className="inv-gov-val">{ca.target_level || '—'}</td></tr>
              <tr><td className="inv-gov-key">Advancement blocked</td><td className="inv-gov-val">{String(ca.advancement_blocked)}</td></tr>
              <tr><td className="inv-gov-key">Reference specimen</td><td className="inv-gov-val">{ca.reference_specimen || '—'}</td></tr>
              <tr><td className="inv-gov-key">Candidate specimen</td><td className="inv-gov-val">{ca.candidate_specimen || '—'}</td></tr>
            </tbody>
          </table>
          <div className="inv-gov-sub-head">Dimension Assessment</div>
          <table className="inv-gov-table inv-gov-table--dim">
            <thead><tr><th>Dimension</th><th>Reference</th><th>Candidate</th><th>Ratio</th><th>Threshold</th><th>Verdict</th></tr></thead>
            <tbody>
              {ca.dimensions.map((dim, i) => (
                <tr key={i} data-verdict={dim.verdict} data-severity={dim.severity}>
                  <td className="inv-gov-dim-name">{dim.dimension.replace(/_/g, ' ')}</td>
                  <td className="inv-gov-num">{dim.reference}</td>
                  <td className="inv-gov-num">{dim.candidate}</td>
                  <td className="inv-gov-num">{dim.ratio != null ? dim.ratio.toFixed(3) : '—'}</td>
                  <td className="inv-gov-num">{dim.threshold}</td>
                  <td data-verdict={dim.verdict}>{dim.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rv && rv.available && (
        <div className="inv-gov-section">
          <div className="inv-gov-section-head">Revalidation ({rv.passed}/{rv.total_checks} · {rv.phase_count} phases)</div>
          <table className="inv-gov-table">
            <tbody>
              <tr><td className="inv-gov-key">Status</td><td className="inv-gov-val" data-status={rv.status}>{rv.status}</td></tr>
              <tr><td className="inv-gov-key">Total checks</td><td className="inv-gov-val">{rv.total_checks}</td></tr>
              <tr><td className="inv-gov-key">Passed</td><td className="inv-gov-val">{rv.passed}</td></tr>
              <tr><td className="inv-gov-key">Failed</td><td className="inv-gov-val inv-gov-val--reject">{rv.failed}</td></tr>
            </tbody>
          </table>
          {rv.phases.map((phase, pi) => (
            <div key={pi} className="inv-gov-phase-block">
              <div className="inv-gov-sub-head">Phase {phase.phase} — {phase.passed}/{phase.total} PASS</div>
              <table className="inv-gov-table inv-gov-table--compact">
                <thead><tr><th>#</th><th>Check</th><th>Result</th><th>Detail</th></tr></thead>
                <tbody>
                  {phase.checks.map((c, ci) => (
                    <tr key={ci} data-result={c.result}>
                      <td className="inv-gov-num">{c.check_number}</td>
                      <td>{c.check}</td>
                      <td data-result={c.result}>{c.result}</td>
                      <td className="inv-gov-detail">{c.detail || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {ei && ei.available && (
        <div className="inv-gov-section">
          <div className="inv-gov-section-head">Evidence Enrichment</div>
          <table className="inv-gov-table">
            <tbody>
              <tr><td className="inv-gov-key">Enrichment events</td><td className="inv-gov-val">{ei.enrichment_events}</td></tr>
              <tr><td className="inv-gov-key">Domains corrected</td><td className="inv-gov-val">{ei.domains_corrected}</td></tr>
              <tr><td className="inv-gov-key">Domains confirmed</td><td className="inv-gov-val">{ei.domains_confirmed}</td></tr>
              <tr><td className="inv-gov-key">Domains no SDC match</td><td className="inv-gov-val">{ei.domains_no_sdc_match}</td></tr>
              <tr><td className="inv-gov-key">Capabilities corrected</td><td className="inv-gov-val">{ei.capabilities_domain_corrected}</td></tr>
              <tr><td className="inv-gov-key">Mean confidence post</td><td className="inv-gov-val">{ei.mean_confidence_post != null ? ei.mean_confidence_post.toFixed(4) : '—'}</td></tr>
              <tr><td className="inv-gov-key">Domains with change</td><td className="inv-gov-val">{ei.domains_with_change}</td></tr>
            </tbody>
          </table>
          {ei.debt && ei.debt.available && (
            <>
              <div className="inv-gov-sub-head">Debt Reassessment ({ei.debt.total_items} items)</div>
              <div className="inv-gov-grid">
                <div className="inv-gov-stat"><span className="inv-gov-stat-val">{ei.debt.improved}</span><span className="inv-gov-stat-label">Improved</span></div>
                <div className="inv-gov-stat"><span className="inv-gov-stat-val">{ei.debt.unchanged}</span><span className="inv-gov-stat-label">Unchanged</span></div>
                <div className="inv-gov-stat"><span className="inv-gov-stat-val inv-gov-stat-val--reject">{ei.debt.worsened}</span><span className="inv-gov-stat-label">Worsened</span></div>
                <div className="inv-gov-stat"><span className="inv-gov-stat-val">{ei.debt.blockers_resolved}</span><span className="inv-gov-stat-label">Blockers resolved</span></div>
              </div>
              {ei.debt.trajectory && (
                <div className="inv-gov-trajectory">Trajectory: <strong>{typeof ei.debt.trajectory === 'string' ? ei.debt.trajectory : JSON.stringify(ei.debt.trajectory)}</strong></div>
              )}
              {ei.debt.items && ei.debt.items.length > 0 && (
                <table className="inv-gov-table inv-gov-table--compact">
                  <thead><tr><th>Blocker</th><th>Domain</th><th>Severity</th><th>Blocks</th><th>Before</th><th>After</th><th>Impact</th></tr></thead>
                  <tbody>
                    {ei.debt.items.map((it, i) => (
                      <tr key={i}>
                        <td className="inv-gov-id">{it.blocker_id}</td>
                        <td>{it.domain_id || '—'}</td>
                        <td data-severity={it.severity}>{it.severity || '—'}</td>
                        <td>{it.blocks_s_state || '—'}</td>
                        <td>{it.original_reducibility || '—'}</td>
                        <td>{it.post_enrichment_reducibility || '—'}</td>
                        <td>{it.enrichment_impact || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      )}

      {ci && ci.available && (
        <div className="inv-gov-section">
          <div className="inv-gov-section-head">Convergence Observations ({ci.total_observations})</div>
          <table className="inv-gov-table">
            <tbody>
              <tr><td className="inv-gov-key">Maturity</td><td className="inv-gov-val">{ci.observation_maturity || '—'}</td></tr>
              <tr><td className="inv-gov-key">Verdict</td><td className="inv-gov-val">{ci.verdict || '—'}</td></tr>
              <tr><td className="inv-gov-key">Convergences</td><td className="inv-gov-val">{ci.convergences.length}</td></tr>
              <tr><td className="inv-gov-key">Divergences</td><td className="inv-gov-val">{ci.divergences.length}</td></tr>
              <tr><td className="inv-gov-key">Mixed</td><td className="inv-gov-val">{ci.mixed.length}</td></tr>
            </tbody>
          </table>
          {ci.observations.map((obs, i) => (
            <div key={i} className="inv-gov-observation" data-status={obs.pattern_status}>
              <div className="inv-gov-obs-header">
                <span className="inv-gov-obs-id">{obs.observation_id}</span>
                <span className="inv-gov-obs-status">{obs.pattern_status}</span>
              </div>
              <div className="inv-gov-obs-title">{obs.title}</div>
              <div className="inv-gov-obs-body">{obs.observation}</div>
              {obs.divergence && <div className="inv-gov-obs-divergence">Divergence: {obs.divergence}</div>}
            </div>
          ))}
        </div>
      )}

      {cc && cc.available && (
        <div className="inv-gov-section">
          <div className="inv-gov-section-head">Chronicle Certification ({cc.passed}/{cc.total_checks})</div>
          <table className="inv-gov-table">
            <tbody>
              <tr><td className="inv-gov-key">Status</td><td className="inv-gov-val" data-status={cc.certification_status}>{cc.certification_status}</td></tr>
              <tr><td className="inv-gov-key">Phases</td><td className="inv-gov-val">{cc.phase_count}</td></tr>
              <tr><td className="inv-gov-key">Passed</td><td className="inv-gov-val">{cc.passed}</td></tr>
              <tr><td className="inv-gov-key">Failed</td><td className="inv-gov-val inv-gov-val--reject">{cc.failed}</td></tr>
            </tbody>
          </table>
          <div className="inv-gov-sub-head">Phase Breakdown</div>
          <table className="inv-gov-table inv-gov-table--compact">
            <thead><tr><th>Phase</th><th>Passed</th><th>Failed</th><th>Total</th></tr></thead>
            <tbody>
              {Object.entries(cc.phase_breakdown || {}).map(([phase, data]) => (
                <tr key={phase} data-result={data.failed > 0 ? 'FAIL' : 'PASS'}>
                  <td>{phase.replace(/_/g, ' ')}</td>
                  <td className="inv-gov-num">{data.passed}</td>
                  <td className="inv-gov-num">{data.failed}</td>
                  <td className="inv-gov-num">{data.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="inv-gov-footer">
        All governance data derived from governed artifacts. No interpretation applied. Evidence lineage preserved.
      </div>
    </div>
  )
}

function CockpitRadialGauge({ score, groundingPct, governedLevel, tensionPct }) {
  const isGoverned = !!governedLevel
  const cx = 75
  const cy = 68

  function arcEnd(radius, pct) {
    const angle = Math.PI * (1 - pct / 100)
    return {
      x: cx + radius * Math.cos(angle),
      y: cy - radius * Math.sin(angle),
    }
  }

  if (isGoverned) {
    const levelPct = { S0: 0, S1: 33, S2: 66, S3: 100 }[governedLevel] || 0
    const tPct = typeof tensionPct === 'number' ? tensionPct : 0
    const r = 58
    const gr = 49
    const le = arcEnd(r, levelPct)
    const levelPath = levelPct >= 95
      ? `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`
      : levelPct > 0 ? `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${le.x.toFixed(1)} ${le.y.toFixed(1)}` : ''
    const te = arcEnd(gr, tPct)
    const tensionPath = tPct >= 95
      ? `M ${cx - gr} ${cy} A ${gr} ${gr} 0 0 1 ${cx + gr} ${cy}`
      : tPct > 0 ? `M ${cx - gr} ${cy} A ${gr} ${gr} 0 0 1 ${te.x.toFixed(1)} ${te.y.toFixed(1)}` : ''
    const levelColor = levelPct >= 66 ? '#64ffda' : levelPct >= 33 ? '#4a9eff' : '#6a7a9a'
    const tensionColor = tPct >= 60 ? '#ff9e4a' : tPct >= 30 ? '#ffd700' : '#4a9eff'

    return (
      <svg viewBox="0 0 150 84" className="cockpit-gauge-svg" role="img" aria-label={`Qualification: ${governedLevel}, Tension: ${tPct}%`}>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#1e2330" strokeWidth="8" strokeLinecap="round" />
        {levelPath && <path d={levelPath} fill="none" stroke={levelColor} strokeWidth="8" strokeLinecap="round" />}
        <path d={`M ${cx - gr} ${cy} A ${gr} ${gr} 0 0 1 ${cx + gr} ${cy}`} fill="none" stroke="#1e2330" strokeWidth="5" strokeLinecap="round" />
        {tensionPath && <path d={tensionPath} fill="none" stroke={tensionColor} strokeWidth="5" strokeLinecap="round" opacity="0.7" />}
        <text x={cx} y={cy - 16} textAnchor="middle" fontSize="24" fontWeight="600" fill={levelColor} fontFamily="'Courier New', monospace">{governedLevel}</text>
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="8" fill="#6a7a9a" letterSpacing="0.15em" fontFamily="-apple-system, sans-serif">GOVERNED</text>
        <text x={cx - r + 2} y={cy + 12} textAnchor="start" fontSize="7" fill={levelColor} fontFamily="-apple-system, sans-serif">qualified</text>
        <text x={cx + r - 2} y={cy + 12} textAnchor="end" fontSize="7" fill={tensionColor} fontFamily="-apple-system, sans-serif">{tPct > 0 ? `${tPct}% tension` : 'nominal'}</text>
      </svg>
    )
  }

  const s = typeof score === 'number' ? score : 0
  const g = typeof groundingPct === 'number' ? groundingPct : 0
  const r = 58
  const gr = 49

  const se = arcEnd(r, s)
  const scorePath = s >= 95
    ? `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`
    : s > 0 ? `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${se.x.toFixed(1)} ${se.y.toFixed(1)}` : ''
  const ge = arcEnd(gr, g)
  const groundPath = g >= 95
    ? `M ${cx - gr} ${cy} A ${gr} ${gr} 0 0 1 ${cx + gr} ${cy}`
    : g > 0 ? `M ${cx - gr} ${cy} A ${gr} ${gr} 0 0 1 ${ge.x.toFixed(1)} ${ge.y.toFixed(1)}` : ''
  const scoreColor = s >= 80 ? '#64ffda' : s >= 60 ? '#ffd700' : s >= 40 ? '#ff9e4a' : '#ff6b6b'

  return (
    <svg viewBox="0 0 150 84" className="cockpit-gauge-svg" role="img" aria-label={`Readiness: ${s}, Grounding: ${g}%`}>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#1e2330" strokeWidth="8" strokeLinecap="round" />
      {scorePath && <path d={scorePath} fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round" />}
      <path d={`M ${cx - gr} ${cy} A ${gr} ${gr} 0 0 1 ${cx + gr} ${cy}`} fill="none" stroke="#1e2330" strokeWidth="5" strokeLinecap="round" />
      {groundPath && <path d={groundPath} fill="none" stroke="#4a9eff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />}
      <text x={cx} y={cy - 16} textAnchor="middle" fontSize="28" fontWeight="600" fill={scoreColor} fontFamily="'Courier New', monospace">{s}</text>
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="8" fill="#6a7a9a" letterSpacing="0.15em" fontFamily="-apple-system, sans-serif">READINESS</text>
      <text x={cx - r + 2} y={cy + 12} textAnchor="start" fontSize="7" fill="#4a9eff" fontFamily="-apple-system, sans-serif">{g}% grounded</text>
      <text x={cx + r - 2} y={cy + 12} textAnchor="end" fontSize="7" fill="#5e6d8a" fontFamily="-apple-system, sans-serif">of 100</text>
    </svg>
  )
}

function CockpitSignalBar({ signal, governed }) {
  const sevColor = { CRITICAL: '#ff6b6b', HIGH: '#ff6b6b', ELEVATED: '#ff9e4a', MODERATE: '#ffd700', NOMINAL: '#64ffda' }
  const color = sevColor[signal.severity] || '#5e6d8a'
  const isActive = signal.severity !== 'NOMINAL'
  const reading = (governed && signal.boardroom_interpretation) || signal.interpretation
  return (
    <div className={`cockpit-signal${isActive ? ' cockpit-signal--active' : ''}`} data-severity={signal.severity}>
      <div className="cockpit-signal-bar" style={{ background: color }} />
      <div className="cockpit-signal-body">
        <div className="cockpit-signal-name">{signal.signal_name}</div>
        <div className="cockpit-signal-reading">{reading}</div>
      </div>
    </div>
  )
}

const CONFIDENCE_COLORS = {
  5: '#64ffda',
  4: '#4a9eff',
  3: '#ffd700',
  2: '#ff9e4a',
  1: '#ff6b6b',
}

function DomainDebtSection({ domainId, debtIndexData, progressionData, onDomainSelect }) {
  if (!debtIndexData) {
    return (
      <div className="dsp-section">
        <div className="dsp-section-label">STRUCTURAL DEBT</div>
        <div className="dsp-grid">
          <div className="dsp-row"><span className="dsp-val dsp-dim" style={{ fontStyle: 'italic' }}>Structural debt data unavailable</span></div>
        </div>
      </div>
    )
  }
  const postures = debtIndexData.domain_postures || []
  const posture = postures.find(d => d.domain_id === domainId)
  if (!posture) {
    return (
      <div className="dsp-section">
        <div className="dsp-section-label">STRUCTURAL DEBT</div>
        <div className="dsp-grid">
          <div className="dsp-row"><span className="dsp-val dsp-dim">No debt posture registered for {domainId}</span></div>
        </div>
      </div>
    )
  }
  if (posture.debt_status === 'CLEAR') {
    return (
      <div className="dsp-section">
        <div className="dsp-section-label">STRUCTURAL DEBT</div>
        <div className="dsp-grid">
          <div className="dsp-row"><span className="dsp-val" style={{ color: '#64ffda' }}>No structural debt — domain is clear</span></div>
        </div>
      </div>
    )
  }

  const blockingIds = progressionData && progressionData.blocking_debts
    ? progressionData.blocking_debts.map(d => d.id)
    : []
  const domainBlocksS3 = posture.debt_item_ids.some(id => blockingIds.includes(id))

  const blockingPeers = (debtIndexData.domain_postures || [])
    .filter(p => p.debt_status !== 'CLEAR' && p.debt_item_ids.some(id => blockingIds.includes(id)))
    .map(p => p.domain_id)
  const peerIndex = blockingPeers.indexOf(domainId)

  const statusClass = posture.debt_status === 'ACTIVE' ? 'active' : 'partial'
  const exposureColors = { HIGH: '#ff6b6b', MEDIUM: '#ff9e4a', LOW: '#ffd700', NONE: '#5e6d8a' }
  const reducibilityColors = {
    IRREDUCIBLE_STRUCTURAL_ABSENCE: '#ff6b6b',
    REDUCED_BY_ENRICHMENT: '#ffd700',
    REDUCIBLE_BY_EVIDENCE: '#4a9eff',
    NOT_APPLICABLE: '#5e6d8a',
  }

  const blockingDebtsLookup = progressionData && progressionData.blocking_debts
    ? Object.fromEntries(progressionData.blocking_debts.map(d => [d.id, d]))
    : {}

  return (
    <div className="dsp-section">
      <div className="dsp-section-label">STRUCTURAL DEBT</div>
      <div className="dsp-grid">
        <div className="dsp-row">
          <span className="dsp-key">Debt status</span>
          <span className="dsp-val">
            <span className={`dsp-badge dsp-debt-status dsp-debt-status--${statusClass}`}>{posture.debt_status}</span>
          </span>
        </div>
        <div className="dsp-row">
          <span className="dsp-key">Operational exposure</span>
          <span className="dsp-val">
            <span className="dsp-badge dsp-exposure" style={{ color: exposureColors[posture.operational_exposure] || '#5e6d8a' }}>
              {posture.operational_exposure}
            </span>
          </span>
        </div>
        <div className="dsp-row">
          <span className="dsp-key">Blocks S3</span>
          <span className="dsp-val">
            <span className="dsp-badge" style={{ color: domainBlocksS3 ? '#ff6b6b' : '#64ffda' }}>
              {domainBlocksS3 ? 'YES' : 'NO'}
            </span>
          </span>
        </div>
        <div className="dsp-row">
          <span className="dsp-key">Reducibility</span>
          <span className="dsp-val">
            <span className="dsp-badge dsp-reducibility" style={{ color: reducibilityColors[posture.reducibility] || '#5e6d8a' }}>
              {posture.reducibility}
            </span>
          </span>
        </div>
        <div className="dsp-row">
          <span className="dsp-key">Origin type</span>
          <span className="dsp-val dsp-mono dsp-dim">{posture.origin_type}</span>
        </div>
      </div>
      {posture.debt_item_ids.length > 0 && (
        <div className="dsp-debt-items">
          {posture.debt_item_ids.map(id => {
            const detail = blockingDebtsLookup[id]
            return (
              <div key={id} className="dsp-debt-item">
                <span className="dsp-debt-item-id">{id}</span>
                {detail && (
                  <>
                    <span className="dsp-debt-item-severity" style={{ color: detail.severity === 'CRITICAL' ? '#ff6b6b' : detail.severity === 'HIGH' ? '#ff9e4a' : '#ffd700' }}>
                      {detail.severity}
                    </span>
                    <span className="dsp-debt-item-cat">{detail.category}</span>
                  </>
                )}
                {detail && detail.blocks_s_state && (
                  <span className="dsp-debt-item-blocks">blocks {detail.blocks_s_state}</span>
                )}
              </div>
            )
          })}
        </div>
      )}
      {blockingPeers.length > 1 && onDomainSelect && peerIndex >= 0 && (
        <div className="dsp-peer-nav">
          <button
            className="dsp-peer-nav-arrow"
            type="button"
            disabled={peerIndex === 0}
            onClick={() => onDomainSelect(blockingPeers[peerIndex - 1])}
            aria-label="Previous blocking domain"
          >◂</button>
          <span className="dsp-peer-nav-label">
            {peerIndex + 1} of {blockingPeers.length} blocking S3
          </span>
          <button
            className="dsp-peer-nav-arrow"
            type="button"
            disabled={peerIndex === blockingPeers.length - 1}
            onClick={() => onDomainSelect(blockingPeers[peerIndex + 1])}
            aria-label="Next blocking domain"
          >▸</button>
        </div>
      )}
    </div>
  )
}

const MATURITY_DIM_COLORS = {
  STRONG: '#64ffda',
  STABLE: '#4a9eff',
  PARTIAL: '#ffd700',
  LOW: '#ff6b6b',
}

function BlockagePostureSummary({ debtIndexData, progressionData, maturityData, onDomainSelect }) {
  if (!debtIndexData && !progressionData && !maturityData) return null

  const agg = debtIndexData && debtIndexData.aggregate_posture
  const dims = maturityData && maturityData.dimension_breakdown
  const contDebt = debtIndexData && debtIndexData.continuity_debt
  const debtDomains = (debtIndexData && debtIndexData.domain_postures || [])
    .filter(p => p.debt_status !== 'CLEAR')
    .map(p => p.domain_id)

  return (
    <div className="blockage-posture">
      <div className="blockage-posture-label">STRUCTURAL BLOCKAGE</div>
      <div className="blockage-posture-row">
        {progressionData && (
          <div className="blockage-posture-metric">
            <div className="blockage-posture-metric-value">{progressionData.current_s_state} → {progressionData.next_s_state_target}</div>
            <div className="blockage-posture-metric-label">S-state position</div>
          </div>
        )}
        {progressionData && (
          <div className="blockage-posture-metric">
            <div className="blockage-posture-metric-value">{progressionData.blocking_debt_count} of {progressionData.total_debt_items}</div>
            <div className="blockage-posture-metric-label">blocking</div>
          </div>
        )}
        {agg && (
          <div className="blockage-posture-metric">
            <div className="blockage-posture-metric-value">{agg.domains_with_debt} / {agg.domains_clear}</div>
            <div className="blockage-posture-metric-label">unresolved / clear</div>
          </div>
        )}
      </div>
      {dims && (
        <div className="blockage-posture-dims">
          {Object.entries(dims).map(([key, dim]) => {
            const color = MATURITY_DIM_COLORS[dim.classification] || '#5e6d8a'
            const pct = Math.round(dim.score * 100)
            return (
              <div key={key} className="blockage-posture-dim">
                <span className="blockage-posture-dim-id">{key}</span>
                <span className="blockage-posture-dim-bar-track">
                  <span className="blockage-posture-dim-bar-fill" style={{ width: `${pct}%`, background: color }} />
                </span>
                <span className="blockage-posture-dim-score" style={{ color }}>{dim.score.toFixed(2)}</span>
              </div>
            )
          })}
        </div>
      )}
      {contDebt && contDebt.length > 0 && (
        <div className="blockage-posture-continuity">
          {contDebt.map(d => d.description).join(' · ')}
        </div>
      )}
      {debtDomains.length > 0 && onDomainSelect && (
        <div className="blockage-posture-nav">
          <span
            className="blockage-posture-nav-link"
            onClick={() => onDomainSelect(debtDomains[0])}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onDomainSelect(debtDomains[0])}
          >
            {debtDomains.length} domain{debtDomains.length !== 1 ? 's' : ''} with active debt — explore →
          </span>
        </div>
      )}
    </div>
  )
}

function TemporalStructuralSummary({ temporalAnalyticsData, onDomainSelect }) {
  if (!temporalAnalyticsData) return null
  const timeline = temporalAnalyticsData.epoch_timeline || []
  const enrich = temporalAnalyticsData.enrichment_effectiveness || {}
  const persist = temporalAnalyticsData.unresolved_persistence || {}
  const diverg = temporalAnalyticsData.structural_semantic_divergence || {}
  const degrad = temporalAnalyticsData.degradation || {}

  const firstEpoch = timeline[0]
  const lastEpoch = timeline[timeline.length - 1]

  return (
    <div className="temporal-summary">
      <div className="temporal-summary-label">TEMPORAL STRUCTURE</div>
      {firstEpoch && lastEpoch && (
        <div className="temporal-summary-row">
          <div className="temporal-summary-metric">
            <div className="temporal-summary-metric-value">{firstEpoch.epoch_label} → {lastEpoch.epoch_label}</div>
            <div className="temporal-summary-metric-label">{timeline.length} epoch{timeline.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="temporal-summary-metric">
            <div className="temporal-summary-metric-value">{firstEpoch.weighted_confidence} → {lastEpoch.weighted_confidence}</div>
            <div className="temporal-summary-metric-label">weighted confidence</div>
          </div>
          <div className="temporal-summary-metric">
            <div className="temporal-summary-metric-value">{firstEpoch.unresolved_count} → {lastEpoch.unresolved_count}</div>
            <div className="temporal-summary-metric-label">unmapped</div>
          </div>
        </div>
      )}
      {enrich.available && enrich.level_transitions && (
        <div className="temporal-summary-transitions">
          {Object.entries(enrich.level_transitions).map(([key, count]) => (
            <span key={key} className="temporal-summary-transition">
              {key.replace(/_to_/g, ' → ')}: {count} domain{count !== 1 ? 's' : ''}
            </span>
          ))}
        </div>
      )}
      {persist.available && persist.persistent_domains && persist.persistent_domains.length > 0 && (
        <div className="temporal-summary-persistent">
          <div className="temporal-summary-persistent-label">PERSISTENT UNMAPPED ({persist.persistent_count})</div>
          <div className="temporal-summary-persistent-domains">
            {persist.persistent_domains.map(d => (
              <span
                key={d.domain_id}
                className={`temporal-summary-persistent-domain${onDomainSelect ? ' temporal-summary-persistent-domain--link' : ''}`}
                onClick={() => onDomainSelect && onDomainSelect(d.domain_id)}
                role={onDomainSelect ? 'button' : undefined}
                tabIndex={onDomainSelect ? 0 : undefined}
                onKeyDown={onDomainSelect ? (e => e.key === 'Enter' && onDomainSelect(d.domain_id)) : undefined}
              >
                {d.domain_id}
              </span>
            ))}
          </div>
          <div className="temporal-summary-persistent-note">
            {persist.persistent_domains[0].reducibility} · {persist.persistent_domains[0].epochs_unmapped} epoch{persist.persistent_domains[0].epochs_unmapped !== 1 ? 's' : ''} each
          </div>
        </div>
      )}
      {diverg.available && diverg.indicator_count > 0 && (
        <div className="temporal-summary-divergence">
          {diverg.indicator_count} domain{diverg.indicator_count !== 1 ? 's' : ''} with weak structural fit · divergence score: {diverg.divergence_score}
        </div>
      )}
      <div className="temporal-summary-degradation">
        degradation: {degrad.detected ? `${degrad.signal_count} signal${degrad.signal_count !== 1 ? 's' : ''} detected` : 'none detected'}
      </div>
    </div>
  )
}

function DomainTemporalSection({ domainId, temporalLifecycleData, temporalAnalyticsData, onDomainSelect }) {
  if (!temporalLifecycleData) {
    return (
      <div className="dsp-section">
        <div className="dsp-section-label">TEMPORAL MOVEMENT</div>
        <div className="dsp-grid">
          <div className="dsp-row"><span className="dsp-val dsp-dim" style={{ fontStyle: 'italic' }}>Temporal data unavailable</span></div>
        </div>
      </div>
    )
  }

  const epochs = temporalLifecycleData.epochs || []
  if (epochs.length < 2) {
    return (
      <div className="dsp-section">
        <div className="dsp-section-label">TEMPORAL MOVEMENT</div>
        <div className="dsp-grid">
          <div className="dsp-row"><span className="dsp-val dsp-dim">Insufficient epochs for temporal comparison</span></div>
        </div>
      </div>
    )
  }

  const epoch0 = epochs[0]
  const epoch1 = epochs[epochs.length - 1]
  const d0 = (epoch0.per_domain || []).find(d => d.domain_id === domainId)
  const d1 = (epoch1.per_domain || []).find(d => d.domain_id === domainId)

  if (!d0 || !d1) {
    return (
      <div className="dsp-section">
        <div className="dsp-section-label">TEMPORAL MOVEMENT</div>
        <div className="dsp-grid">
          <div className="dsp-row"><span className="dsp-val dsp-dim">No temporal record for {domainId}</span></div>
        </div>
      </div>
    )
  }

  const deltas = temporalLifecycleData.deltas || []
  const delta = deltas.length > 0 ? deltas[0] : null
  const domainDelta = delta ? (delta.domain_deltas || []).find(dd => dd.domain_id === domainId) : null

  const persist = temporalAnalyticsData && temporalAnalyticsData.unresolved_persistence
  const persistentDomain = persist && persist.persistent_domains
    ? persist.persistent_domains.find(p => p.domain_id === domainId)
    : null

  let movementStatus = 'UNCHANGED'
  let movementColor = '#5e6d8a'
  if (domainDelta) {
    movementStatus = 'MOVED'
    movementColor = '#4a9eff'
  } else if (persistentDomain) {
    movementStatus = 'PERSISTENT_UNMAPPED'
    movementColor = '#ff6b6b'
  }

  const persistentPeers = (persist && persist.persistent_domains || []).map(p => p.domain_id)
  const persistIdx = persistentPeers.indexOf(domainId)
  const movedPeers = delta ? (delta.domain_deltas || []).map(dd => dd.domain_id) : []
  const movedIdx = movedPeers.indexOf(domainId)

  const confColor0 = CONFIDENCE_COLORS[d0.confidence_level] || '#5e6d8a'
  const confColor1 = CONFIDENCE_COLORS[d1.confidence_level] || '#5e6d8a'

  return (
    <div className="dsp-section">
      <div className="dsp-section-label">TEMPORAL MOVEMENT</div>
      <div className="dsp-grid">
        <div className="dsp-row">
          <span className="dsp-key">Status</span>
          <span className="dsp-val">
            <span className="dsp-badge" style={{ color: movementColor }}>{movementStatus}</span>
          </span>
        </div>
        <div className="dsp-row">
          <span className="dsp-key">Level transition</span>
          <span className="dsp-val">
            <span className="dsp-temporal-level" style={{ color: confColor0 }}>L{d0.confidence_level}</span>
            <span className="dsp-temporal-arrow">→</span>
            <span className="dsp-temporal-level" style={{ color: confColor1 }}>L{d1.confidence_level}</span>
          </span>
        </div>
        <div className="dsp-row">
          <span className="dsp-key">Epoch</span>
          <span className="dsp-val dsp-mono dsp-dim">{epoch0.epoch_label} → {epoch1.epoch_label}</span>
        </div>
        {domainDelta && (
          <div className="dsp-row">
            <span className="dsp-key">Basis transition</span>
            <span className="dsp-val dsp-temporal-basis">{domainDelta.from_basis} → {domainDelta.to_basis}</span>
          </div>
        )}
        {domainDelta && domainDelta.to_dom && (
          <div className="dsp-row">
            <span className="dsp-key">Structural mapping</span>
            <span className="dsp-val dsp-mono dsp-dim">{domainDelta.from_dom || 'none'} → {domainDelta.to_dom}</span>
          </div>
        )}
        {persistentDomain && (
          <div className="dsp-row">
            <span className="dsp-key">Persistence</span>
            <span className="dsp-val">
              <span className="dsp-temporal-persistence">unmapped across {persistentDomain.epochs_unmapped} epochs · {persistentDomain.reducibility}</span>
            </span>
          </div>
        )}
        {!domainDelta && !persistentDomain && (
          <div className="dsp-row">
            <span className="dsp-key">Basis</span>
            <span className="dsp-val dsp-mono dsp-dim">{d1.correspondence_basis}</span>
          </div>
        )}
      </div>
      {persistentDomain && persistentPeers.length > 1 && onDomainSelect && persistIdx >= 0 && (
        <div className="dsp-peer-nav">
          <button className="dsp-peer-nav-arrow" type="button" disabled={persistIdx === 0}
            onClick={() => onDomainSelect(persistentPeers[persistIdx - 1])} aria-label="Previous persistent unmapped domain">◂</button>
          <span className="dsp-peer-nav-label">{persistIdx + 1} of {persistentPeers.length} persistent unmapped</span>
          <button className="dsp-peer-nav-arrow" type="button" disabled={persistIdx === persistentPeers.length - 1}
            onClick={() => onDomainSelect(persistentPeers[persistIdx + 1])} aria-label="Next persistent unmapped domain">▸</button>
        </div>
      )}
      {domainDelta && movedPeers.length > 1 && onDomainSelect && movedIdx >= 0 && (
        <div className="dsp-peer-nav">
          <button className="dsp-peer-nav-arrow" type="button" disabled={movedIdx === 0}
            onClick={() => onDomainSelect(movedPeers[movedIdx - 1])} aria-label="Previous moved domain">◂</button>
          <span className="dsp-peer-nav-label">{movedIdx + 1} of {movedPeers.length} moved</span>
          <button className="dsp-peer-nav-arrow" type="button" disabled={movedIdx === movedPeers.length - 1}
            onClick={() => onDomainSelect(movedPeers[movedIdx + 1])} aria-label="Next moved domain">▸</button>
        </div>
      )}
    </div>
  )
}

function DomainStructuralPanel({ domainId, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, temporalLifecycleData, temporalAnalyticsData, onDomainSelect }) {
  if (!correspondenceData || !domainId) return null
  const correspondences = correspondenceData.correspondences || []
  const corr = correspondences.find(c => c.semantic_domain_id === domainId)
  if (!corr) {
    return (
      <div className="dsp-panel">
        <div className="dsp-unavailable">Correspondence data unavailable for {domainId}</div>
        <DomainDebtSection domainId={domainId} debtIndexData={debtIndexData} progressionData={progressionData} onDomainSelect={onDomainSelect} />
        <DomainTemporalSection domainId={domainId} temporalLifecycleData={temporalLifecycleData} temporalAnalyticsData={temporalAnalyticsData} onDomainSelect={onDomainSelect} />
        <EvidenceSourcesSection domainId={domainId} evidenceIntakeData={evidenceIntakeData} />
      </div>
    )
  }

  const confColor = CONFIDENCE_COLORS[corr.confidence_level] || '#5e6d8a'
  const hasStructural = corr.structural_dom_id != null
  const enrichment = correspondenceData.enrichment_metadata || {}

  return (
    <div className="dsp-panel" style={{ borderLeftColor: confColor }}>
      <div className="dsp-section">
        <div className="dsp-section-label">DOMAIN IDENTITY</div>
        <div className="dsp-grid">
          <div className="dsp-row">
            <span className="dsp-key">Name</span>
            <span className="dsp-val">{corr.semantic_domain_name}</span>
          </div>
          <div className="dsp-row">
            <span className="dsp-key">ID</span>
            <span className="dsp-val dsp-mono">{corr.semantic_domain_id}</span>
          </div>
          <div className="dsp-row">
            <span className="dsp-key">Type</span>
            <span className="dsp-val">{corr.semantic_domain_type}</span>
          </div>
          <div className="dsp-row">
            <span className="dsp-key">Cluster</span>
            <span className="dsp-val dsp-mono">{corr.cluster_id}</span>
          </div>
          <div className="dsp-row">
            <span className="dsp-key">Structural mapping</span>
            <span className="dsp-val dsp-mono">
              {hasStructural
                ? <>{corr.structural_dom_id} <span className="dsp-dim">→</span> {corr.structural_domain_name}</>
                : <span className="dsp-dim">UNMAPPED</span>
              }
            </span>
          </div>
          <div className="dsp-row">
            <span className="dsp-key">Reconciliation</span>
            <span className={`dsp-val dsp-badge dsp-badge--${corr.reconciliation_status === 'RECONCILED' ? 'ok' : 'gap'}`}>
              {corr.reconciliation_status}
            </span>
          </div>
        </div>
      </div>

      <div className="dsp-section">
        <div className="dsp-section-label">EVIDENCE CHAIN</div>
        <div className="dsp-grid">
          <div className="dsp-row">
            <span className="dsp-key">Confidence</span>
            <span className="dsp-val">
              <span className="dsp-confidence-dot" style={{ background: confColor }} />
              <span className="dsp-mono">L{corr.confidence_level}</span>
              <span className="dsp-dim"> — {corr.confidence_label}</span>
            </span>
          </div>
          <div className="dsp-row">
            <span className="dsp-key">Basis</span>
            <span className="dsp-val dsp-mono">{corr.correspondence_basis}</span>
          </div>
          {corr.evidence_factors.length > 0 && (
            <div className="dsp-row dsp-row--stack">
              <span className="dsp-key">Evidence factors</span>
              <div className="dsp-factors">
                {corr.evidence_factors.map((f, i) => (
                  <span key={i} className="dsp-factor">{f}</span>
                ))}
              </div>
            </div>
          )}
          {corr.evidence_factors.length === 0 && (
            <div className="dsp-row">
              <span className="dsp-key">Evidence factors</span>
              <span className="dsp-val dsp-dim">none</span>
            </div>
          )}
          <div className="dsp-row">
            <span className="dsp-key">Crosswalk confidence</span>
            <span className="dsp-val dsp-mono">{corr.crosswalk_confidence}</span>
          </div>
          <div className="dsp-row">
            <span className="dsp-key">Lineage status</span>
            <span className="dsp-val dsp-mono">{corr.crosswalk_lineage_status}</span>
          </div>
          {corr.crosswalk_business_label && corr.crosswalk_business_label !== corr.semantic_domain_name && (
            <div className="dsp-row">
              <span className="dsp-key">Business label</span>
              <span className="dsp-val">{corr.crosswalk_business_label}</span>
            </div>
          )}
        </div>
      </div>

      <div className="dsp-section">
        <div className="dsp-section-label">GROUNDING STATE</div>
        <div className="dsp-grid">
          <div className="dsp-row">
            <span className="dsp-key">Structural grounding</span>
            <span className={`dsp-val dsp-badge dsp-badge--${corr.structural_grounding === 'GROUNDED' ? 'ok' : 'gap'}`}>
              {corr.structural_grounding || 'UNGROUNDED'}
            </span>
          </div>
          <div className="dsp-row">
            <span className="dsp-key">Component count</span>
            <span className="dsp-val dsp-mono">{corr.structural_component_count}</span>
          </div>
          <div className="dsp-row">
            <span className="dsp-key">Q-impact</span>
            <span className="dsp-val dsp-mono">{corr.confidence_q_impact}</span>
          </div>
          {corr.structural_evidence_refs.length > 0 && (
            <div className="dsp-row dsp-row--stack">
              <span className="dsp-key">Evidence refs</span>
              <div className="dsp-refs">
                {corr.structural_evidence_refs.map((ref, i) => (
                  <div key={i} className="dsp-ref">{ref}</div>
                ))}
              </div>
            </div>
          )}
          {corr.structural_evidence_refs.length === 0 && (
            <div className="dsp-row">
              <span className="dsp-key">Evidence refs</span>
              <span className="dsp-val dsp-dim">none</span>
            </div>
          )}
          {enrichment.enrichment_type && (
            <div className="dsp-row">
              <span className="dsp-key">Enrichment</span>
              <span className="dsp-val dsp-dim">{enrichment.enrichment_type} — {enrichment.enrichment_source || 'unknown'}</span>
            </div>
          )}
        </div>
      </div>

      <DomainDebtSection domainId={domainId} debtIndexData={debtIndexData} progressionData={progressionData} onDomainSelect={onDomainSelect} />

      <DomainTemporalSection domainId={domainId} temporalLifecycleData={temporalLifecycleData} temporalAnalyticsData={temporalAnalyticsData} onDomainSelect={onDomainSelect} />

      <EvidenceSourcesSection domainId={domainId} evidenceIntakeData={evidenceIntakeData} />
    </div>
  )
}

function resolveOriginDomain(fullReport, domainRegistry) {
  const blocks = (fullReport && fullReport.evidence_blocks) || []
  const origin = blocks.find(b => b && b.propagation_role === 'ORIGIN')
  if (origin) {
    const match = domainRegistry.find(d =>
      (d.business_label || d.domain_name) === origin.domain_alias
    )
    if (match) return match.domain_id
  }
  const pzAnchor = domainRegistry.find(d => d.zone_anchor)
  if (pzAnchor) return pzAnchor.domain_id
  return null
}

const SOURCE_CLASS_COLORS = {
  STRUCTURAL_EVIDENCE: '#64ffda',
  GAUGE_ARTIFACT: '#4a9eff',
  DIAGNOSTIC_NARRATIVE: '#ffd700',
  EXPLICIT_REBASE: '#ff9e4a',
}

function EvidenceSourcesSection({ domainId, evidenceIntakeData }) {
  if (!evidenceIntakeData) {
    return (
      <div className="dsp-section">
        <div className="dsp-section-label">EVIDENCE SOURCES</div>
        <div className="dsp-grid">
          <div className="dsp-row"><span className="dsp-val dsp-dim" style={{ fontStyle: 'italic' }}>Evidence intake data unavailable</span></div>
        </div>
      </div>
    )
  }
  const items = (evidenceIntakeData.items || []).filter(
    item => item.candidate_domains && item.candidate_domains.includes(domainId)
  )
  if (items.length === 0) {
    return (
      <div className="dsp-section">
        <div className="dsp-section-label">EVIDENCE SOURCES</div>
        <div className="dsp-grid">
          <div className="dsp-row"><span className="dsp-val dsp-dim">No registered evidence sources for {domainId}</span></div>
        </div>
      </div>
    )
  }
  return (
    <div className="dsp-section">
      <div className="dsp-section-label">EVIDENCE SOURCES</div>
      <div className="dsp-sources">
        {items.map(item => {
          const classColor = SOURCE_CLASS_COLORS[item.source_class] || '#5e6d8a'
          return (
            <div key={item.evidence_id} className="dsp-source">
              <div className="dsp-source-header">
                <span className="dsp-source-class" style={{ color: classColor }}>{item.source_class}</span>
                <span className="dsp-source-id dsp-dim">{item.evidence_id}</span>
                <span className={`dsp-source-hash ${item.hash_verified ? 'dsp-source-hash--ok' : 'dsp-source-hash--fail'}`}>
                  {item.hash_verified ? '✓ hash verified' : '✗ hash unverified'}
                </span>
              </div>
              <div className="dsp-source-path">{item.source_path}</div>
              {item.description && <div className="dsp-source-desc">{item.description}</div>}
              {item.eligible_operations && item.eligible_operations.length > 0 && (
                <div className="dsp-source-ops">
                  {item.eligible_operations.map((op, i) => (
                    <span key={i} className="dsp-source-op">{op}</span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const CONFIDENCE_EXECUTIVE_LABELS = {
  5: 'High structural confidence',
  4: 'Confirmed structural confidence',
  3: 'Moderate — partial structural evidence',
  2: 'Low — advisory only',
  1: 'Unmapped — no structural backing',
}

const EXPOSURE_EXECUTIVE_LABELS = {
  HIGH: 'High exposure — blocks advancement',
  MEDIUM: 'Elevated structural exposure',
  LOW: 'Low-level structural exposure',
  NONE: 'No active exposure',
}

function DomainPostureCard({ domainId, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, temporalLifecycleData, temporalAnalyticsData, onModeTransition }) {
  if (!domainId) return null

  const correspondences = (correspondenceData && correspondenceData.correspondences) || []
  const corr = correspondences.find(c => c.semantic_domain_id === domainId)

  const confLevel = corr ? corr.confidence_level : null
  const confLabel = CONFIDENCE_EXECUTIVE_LABELS[confLevel] || 'Unknown'
  const reconciled = corr ? corr.reconciliation_status === 'RECONCILED' : false
  const grounded = corr ? corr.structural_grounding === 'GROUNDED' : false

  const postures = (debtIndexData && debtIndexData.domain_postures) || []
  const posture = postures.find(p => p.domain_id === domainId)
  const debtClear = posture ? posture.debt_status === 'CLEAR' : true
  const exposureLabel = posture
    ? (EXPOSURE_EXECUTIVE_LABELS[posture.operational_exposure] || 'No active exposure')
    : 'No active exposure'

  const blockingIds = (progressionData && progressionData.blocking_debts)
    ? progressionData.blocking_debts.map(d => d.id)
    : []
  const domainBlocksS3 = posture ? posture.debt_item_ids.some(id => blockingIds.includes(id)) : false
  const effectiveExposure = domainBlocksS3
    ? 'High exposure — blocks advancement'
    : (debtClear ? 'No active exposure' : exposureLabel)

  let temporalLabel = 'No temporal data'
  if (temporalLifecycleData) {
    const epochs = temporalLifecycleData.epochs || []
    if (epochs.length >= 2) {
      const epoch0 = epochs[0]
      const epoch1 = epochs[epochs.length - 1]
      const d0 = (epoch0.per_domain || []).find(d => d.domain_id === domainId)
      const d1 = (epoch1.per_domain || []).find(d => d.domain_id === domainId)
      if (d0 && d1) {
        const deltas = temporalLifecycleData.deltas || []
        const delta = deltas.length > 0 ? deltas[0] : null
        const domainDelta = delta ? (delta.domain_deltas || []).find(dd => dd.domain_id === domainId) : null
        const persist = temporalAnalyticsData && temporalAnalyticsData.unresolved_persistence
        const persistentDomain = persist && persist.persistent_domains
          ? persist.persistent_domains.find(p => p.domain_id === domainId) : null
        if (persistentDomain) {
          temporalLabel = 'Persistent gap — unresolved across epochs'
        } else if (domainDelta) {
          temporalLabel = 'Structural movement detected'
        } else {
          temporalLabel = 'Stable across epochs'
        }
      }
    }
  }

  const intakeItems = (evidenceIntakeData && evidenceIntakeData.items) || []
  const domainSources = intakeItems.filter(
    item => item.candidate_domains && item.candidate_domains.includes(domainId)
  )
  const sourceCount = domainSources.length
  const evidenceLabel = sourceCount > 0
    ? `${sourceCount} registered source${sourceCount !== 1 ? 's' : ''}`
    : 'No registered sources'

  const rows = [
    { label: 'Structural confidence', value: confLabel, tone: confLevel >= 4 ? 'ok' : confLevel >= 3 ? 'partial' : 'gap', target: 'EXECUTIVE_DENSE', zoneKey: 'semanticTopology' },
    { label: 'Reconciliation posture', value: reconciled ? 'Reconciled' : 'Unreconciled', tone: reconciled ? 'ok' : 'gap', target: 'EXECUTIVE_DENSE', zoneKey: 'semanticTopology' },
    { label: 'Grounding state', value: grounded ? 'Structurally grounded' : 'Ungrounded — no structural backing', tone: grounded ? 'ok' : 'gap', target: 'EXECUTIVE_DENSE', zoneKey: 'clusterConcentration' },
    { label: 'Exposure posture', value: effectiveExposure, tone: debtClear ? 'ok' : domainBlocksS3 ? 'gap' : 'partial', target: 'EXECUTIVE_DENSE', zoneKey: 'pressureZoneFocus' },
    { label: 'Temporal continuity', value: temporalLabel, tone: temporalLabel === 'Stable across epochs' ? 'ok' : temporalLabel.includes('Persistent') ? 'gap' : 'partial', target: 'EXECUTIVE_DENSE', zoneKey: 'propagationFlow' },
    { label: 'Evidence availability', value: evidenceLabel, tone: sourceCount > 0 ? 'ok' : 'gap', target: 'INVESTIGATION_DENSE' },
  ]

  const domainName = corr ? corr.semantic_domain_name : domainId
  const canNavigate = !!onModeTransition

  return (
    <div className="posture-card">
      <div className="posture-card-header">
        <div className="posture-card-name">{domainName}</div>
        <div className="posture-card-id">{domainId}</div>
      </div>
      <div className="posture-card-rows">
        {rows.map(row => (
          <div
            key={row.label}
            className={`posture-card-row${canNavigate ? ' posture-card-row--navigable' : ''}`}
            data-tone={row.tone}
            onClick={canNavigate ? () => onModeTransition(row.target, domainId, row.zoneKey) : undefined}
            role={canNavigate ? 'button' : undefined}
            tabIndex={canNavigate ? 0 : undefined}
            onKeyDown={canNavigate ? (e => e.key === 'Enter' && onModeTransition(row.target, domainId, row.zoneKey)) : undefined}
          >
            <span className="posture-card-row-label">{row.label}</span>
            <span className="posture-card-row-value">
              {row.value}
              {canNavigate && <span className="posture-card-row-arrow">→</span>}
            </span>
          </div>
        ))}
      </div>
      {onModeTransition && (
        <div className="posture-card-transitions">
          <div className="posture-card-transitions-rule" />
          <button className="posture-card-transition" type="button" onClick={() => onModeTransition('INVESTIGATION_DENSE', domainId)}>
            Open investigation workspace <span className="posture-card-transition-arrow">→</span>
          </button>
        </div>
      )}
    </div>
  )
}

function DomainStructuralDecomposition({ domainId, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, temporalLifecycleData, temporalAnalyticsData, onDomainSelect }) {
  if (!domainId) return null

  const correspondences = (correspondenceData && correspondenceData.correspondences) || []
  const corr = correspondences.find(c => c.semantic_domain_id === domainId)

  const confLevel = corr ? corr.confidence_level : null
  const confColor = CONFIDENCE_COLORS[confLevel] || '#5e6d8a'
  const confLabel = CONFIDENCE_EXECUTIVE_LABELS[confLevel] || 'Unknown'
  const reconciled = corr ? corr.reconciliation_status === 'RECONCILED' : false
  const grounded = corr ? corr.structural_grounding === 'GROUNDED' : false
  const reconciliationMethod = corr ? corr.correspondence_basis : null

  const postures = (debtIndexData && debtIndexData.domain_postures) || []
  const posture = postures.find(p => p.domain_id === domainId)
  const debtClear = posture ? posture.debt_status === 'CLEAR' : true
  const exposureLabel = posture ? (EXPOSURE_EXECUTIVE_LABELS[posture.operational_exposure] || 'No active exposure') : 'No active exposure'

  const blockingIds = (progressionData && progressionData.blocking_debts)
    ? progressionData.blocking_debts.map(d => d.id)
    : []
  const blockingDebtCount = posture
    ? posture.debt_item_ids.filter(id => blockingIds.includes(id)).length
    : 0

  let temporalLabel = 'No temporal data'
  let levelTransition = null
  if (temporalLifecycleData) {
    const epochs = temporalLifecycleData.epochs || []
    if (epochs.length >= 2) {
      const epoch0 = epochs[0]
      const epoch1 = epochs[epochs.length - 1]
      const d0 = (epoch0.per_domain || []).find(d => d.domain_id === domainId)
      const d1 = (epoch1.per_domain || []).find(d => d.domain_id === domainId)
      if (d0 && d1) {
        if (d0.confidence_level !== d1.confidence_level) {
          levelTransition = `L${d0.confidence_level} → L${d1.confidence_level}`
        }
        const deltas = temporalLifecycleData.deltas || []
        const delta = deltas.length > 0 ? deltas[0] : null
        const domainDelta = delta ? (delta.domain_deltas || []).find(dd => dd.domain_id === domainId) : null
        const persist = temporalAnalyticsData && temporalAnalyticsData.unresolved_persistence
        const persistentDomain = persist && persist.persistent_domains
          ? persist.persistent_domains.find(p => p.domain_id === domainId) : null
        if (persistentDomain) {
          temporalLabel = 'Persistent gap — unresolved across epochs'
        } else if (domainDelta) {
          temporalLabel = 'Structural movement detected'
        } else {
          temporalLabel = 'Stable across epochs'
        }
      }
    }
  }

  const intakeItems = (evidenceIntakeData && evidenceIntakeData.items) || []
  const sourceCount = intakeItems.filter(
    item => item.candidate_domains && item.candidate_domains.includes(domainId)
  ).length

  const domainName = corr ? corr.semantic_domain_name : domainId
  const domainType = corr ? corr.semantic_domain_type : null
  const domainRole = corr ? (corr.cluster_id || null) : null
  const factorCount = corr ? (corr.evidence_factors || []).length : 0
  const componentCount = corr ? corr.structural_component_count : 0

  return (
    <div className="dsd-panel" style={{ borderLeftColor: confColor }}>
      <div className="dsp-section">
        <div className="dsp-section-label">DOMAIN IDENTITY</div>
        <div className="dsp-grid">
          <div className="dsp-row">
            <span className="dsp-key">Name</span>
            <span className="dsp-val">{domainName}</span>
          </div>
          <div className="dsp-row">
            <span className="dsp-key">ID</span>
            <span className="dsp-val dsp-mono">{domainId}</span>
          </div>
          {domainType && (
            <div className="dsp-row">
              <span className="dsp-key">Type</span>
              <span className="dsp-val">{domainType}</span>
            </div>
          )}
          {domainRole && (
            <div className="dsp-row">
              <span className="dsp-key">Cluster</span>
              <span className="dsp-val dsp-mono">{domainRole}</span>
            </div>
          )}
        </div>
      </div>

      <div className="dsp-section">
        <div className="dsp-section-label">STRUCTURAL CONFIDENCE</div>
        <div className="dsp-grid">
          <div className="dsp-row">
            <span className="dsp-key">Level</span>
            <span className="dsp-val">
              <span className="dsp-confidence-dot" style={{ background: confColor }} />
              {confLabel}
            </span>
          </div>
          <div className="dsp-row">
            <span className="dsp-key">Evidence backing</span>
            <span className="dsp-val dsp-dim">backed by {factorCount} factor{factorCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      <div className="dsp-section">
        <div className="dsp-section-label">RECONCILIATION</div>
        <div className="dsp-grid">
          <div className="dsp-row">
            <span className="dsp-key">Status</span>
            <span className={`dsp-val dsp-badge dsp-badge--${reconciled ? 'ok' : 'gap'}`}>
              {reconciled ? 'Reconciled' : 'Unreconciled'}
            </span>
          </div>
          {reconciliationMethod && (
            <div className="dsp-row">
              <span className="dsp-key">Method</span>
              <span className="dsp-val dsp-dim">{reconciliationMethod.replace(/_/g, ' ').toLowerCase()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="dsp-section">
        <div className="dsp-section-label">GROUNDING POSTURE</div>
        <div className="dsp-grid">
          <div className="dsp-row">
            <span className="dsp-key">State</span>
            <span className={`dsp-val dsp-badge dsp-badge--${grounded ? 'ok' : 'gap'}`}>
              {grounded ? 'Structurally grounded' : 'Ungrounded'}
            </span>
          </div>
          <div className="dsp-row">
            <span className="dsp-key">Components</span>
            <span className="dsp-val dsp-dim">{componentCount} structural component{componentCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      <div className="dsp-section">
        <div className="dsp-section-label">DEBT POSTURE</div>
        <div className="dsp-grid">
          {debtClear ? (
            <div className="dsp-row"><span className="dsp-val" style={{ color: '#64ffda' }}>No structural debt</span></div>
          ) : (
            <>
              <div className="dsp-row">
                <span className="dsp-key">Status</span>
                <span className="dsp-val">
                  <span className={`dsp-badge dsp-debt-status dsp-debt-status--${posture.debt_status === 'ACTIVE' ? 'active' : 'partial'}`}>{posture.debt_status}</span>
                </span>
              </div>
              <div className="dsp-row">
                <span className="dsp-key">Exposure</span>
                <span className="dsp-val dsp-dim">{exposureLabel}</span>
              </div>
              {blockingDebtCount > 0 && (
                <div className="dsp-row">
                  <span className="dsp-key">Blocking items</span>
                  <span className="dsp-val" style={{ color: '#ff6b6b' }}>{blockingDebtCount} blocking S3</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="dsp-section">
        <div className="dsp-section-label">TEMPORAL MOVEMENT</div>
        <div className="dsp-grid">
          <div className="dsp-row">
            <span className="dsp-key">Status</span>
            <span className="dsp-val dsp-dim">{temporalLabel}</span>
          </div>
          {levelTransition && (
            <div className="dsp-row">
              <span className="dsp-key">Level transition</span>
              <span className="dsp-val dsp-mono">{levelTransition}</span>
            </div>
          )}
        </div>
      </div>

      <div className="dsp-section">
        <div className="dsp-section-label">EVIDENCE SOURCES</div>
        <div className="dsp-grid">
          <div className="dsp-row">
            <span className="dsp-val dsp-dim">
              {sourceCount > 0
                ? `${sourceCount} registered source${sourceCount !== 1 ? 's' : ''}`
                : 'No registered sources'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TopologyModal({ fullReport, onClose, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, initialSignalTrace, onSignalTraceConsumed, mode, onModeTransition }) {
  const [focusedDomain, setFocusedDomain] = useState(null)
  const [traceResolution, setTraceResolution] = useState(null)
  const panelRef = useRef(null)
  const handleDomainSelect = useCallback((id) => { setFocusedDomain(id); setTraceResolution(null) }, [])
  const domainRegistry = (fullReport && fullReport.semantic_domain_registry) || []
  const clusterRegistry = (fullReport && fullReport.semantic_cluster_registry) || []
  const topologyEdges = (fullReport && fullReport.semantic_topology_edges) || []
  const ps = (fullReport && fullReport.propagation_summary) || {}
  const zoneName = ps.primary_zone_business_label || ''

  useEffect(() => {
    if (initialSignalTrace) {
      const originId = resolveOriginDomain(fullReport, domainRegistry)
      if (originId) {
        setFocusedDomain(originId)
        setTraceResolution(null)
      } else {
        setTraceResolution('ORIGIN_UNRESOLVED')
      }
      if (onSignalTraceConsumed) onSignalTraceConsumed()
    }
  }, [initialSignalTrace])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') { setFocusedDomain(null); setTraceResolution(null); onClose() } }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => {
    if (focusedDomain && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [focusedDomain])

  return (
    <div className="topo-modal-overlay" onClick={onClose}>
      <div className="topo-modal" onClick={e => e.stopPropagation()}>
        <div className="topo-modal-header">
          <div className="topo-modal-title">{(fullReport && fullReport.qualification_level) === 'S1' ? 'STRUCTURAL EXECUTION TOPOLOGY' : 'SEMANTIC DOMAIN TOPOLOGY'}</div>
          <div className="topo-modal-meta">
            {(fullReport && fullReport.qualification_level) === 'S1' ? `${clusterRegistry.length} clusters` : `${domainRegistry.length} domains · ${clusterRegistry.length} clusters`}
            <button
              className="topo-modal-trace-origin"
              onClick={() => {
                const originId = resolveOriginDomain(fullReport, domainRegistry)
                if (originId) { setFocusedDomain(originId); setTraceResolution(null) }
                else setTraceResolution('ORIGIN_UNRESOLVED')
              }}
              type="button"
            >
              trace origin
            </button>
          </div>
          <button className="topo-modal-close" onClick={onClose} aria-label="Close topology">✕</button>
        </div>
        <div className="topo-modal-body">
          <div className="topo-modal-graph">
            <TopologyGraph
              domains={domainRegistry}
              clusters={clusterRegistry}
              edges={topologyEdges}
              pressureZoneLabel={zoneName}
              pressureZoneState={fullReport && fullReport.pressure_zone_state}
              focusedDomain={focusedDomain}
              onNodeSelect={setFocusedDomain}
              isS1={(fullReport && fullReport.qualification_level) === 'S1'}
            />
          </div>
          {traceResolution === 'ORIGIN_UNRESOLVED' && (
            <div className="dsp-panel">
              <div className="dsp-unavailable">Origin domain unresolved — select a domain manually to view evidence lineage</div>
            </div>
          )}
          {focusedDomain && (
            <div ref={panelRef}>
              {mode === 'boardroom' ? (
                <DomainPostureCard domainId={focusedDomain} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} temporalLifecycleData={temporalLifecycleData} temporalAnalyticsData={temporalAnalyticsData} onModeTransition={onModeTransition} />
              ) : mode === 'dense' ? (
                <DomainStructuralDecomposition domainId={focusedDomain} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} temporalLifecycleData={temporalLifecycleData} temporalAnalyticsData={temporalAnalyticsData} onDomainSelect={handleDomainSelect} />
              ) : (
                <DomainStructuralPanel domainId={focusedDomain} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} temporalLifecycleData={temporalLifecycleData} temporalAnalyticsData={temporalAnalyticsData} onDomainSelect={handleDomainSelect} />
              )}
            </div>
          )}
          <div className="topo-modal-domains">
            <div className="topo-modal-domains-heading">{(fullReport && fullReport.qualification_level) === 'S1' ? 'STRUCTURAL CLUSTER REGISTRY' : 'DOMAIN REGISTRY'}</div>
            <div className="topo-modal-domains-grid">
              {domainRegistry.map(d => {
                const backed = d.structurally_backed
                const partial = d.lineage_status === 'PARTIAL'
                const isPZ = d.zone_anchor
                const isFocused = focusedDomain === d.domain_id
                const lineageColor = backed ? (d.lineage_status === 'EXACT' ? '#64ffda' : d.lineage_status === 'STRONG' ? '#64ffda' : '#ffd700') : '#5e6d8a'
                return (
                  <div
                    key={d.domain_id}
                    className={`topo-modal-domain-card${isFocused ? ' topo-modal-domain-card--focused' : ''}${isPZ ? ' topo-modal-domain-card--pz' : ''}`}
                    onClick={() => { setFocusedDomain(isFocused ? null : d.domain_id); setTraceResolution(null) }}
                  >
                    {(backed || partial) && <span className="topo-modal-domain-dot" style={{ background: lineageColor }} />}
                    <span className="topo-modal-domain-name">{d.business_label || d.domain_name}</span>
                    <span className="topo-modal-domain-meta">{d.cluster_id}</span>
                    <span className="topo-modal-domain-lineage" style={{ color: lineageColor }}>
                      {d.lineage_status === 'NONE' || !d.lineage_status ? ((fullReport && fullReport.qualification_level) === 'S1' ? 'STRUCTURAL' : 'SEMANTIC-ONLY') : d.lineage_status}{d.confidence > 0 ? ` ${d.confidence.toFixed(2)}` : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          <BlockagePostureSummary debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} onDomainSelect={handleDomainSelect} />
          <TemporalStructuralSummary temporalAnalyticsData={temporalAnalyticsData} onDomainSelect={handleDomainSelect} />
        </div>
      </div>
    </div>
  )
}

const ARC_LABELS = {
  OPENING: 'System Profile',
  REVELATION: 'Structural Discovery',
  DEPTH: 'Coupling Analysis',
  AUTHORITY: 'Authority Concentration',
  QUALIFICATION: 'Qualification State',
  POSTURE: 'Structural Posture',
}

const ARC_CHIPS = {
  OPENING: { label: 'PROFILE', color: '#4a9eff' },
  REVELATION: { label: 'DISCOVERY', color: '#64ffda' },
  DEPTH: { label: 'COUPLING', color: '#ffd700' },
  AUTHORITY: { label: 'AUTHORITY', color: '#ff9e4a' },
  QUALIFICATION: { label: 'GATE', color: '#7a8aaa' },
}

function NarrativeEnvelope({ governedNarrative, qualificationLevel, selectedArc, onArcSelect }) {
  const paragraphs = (governedNarrative && governedNarrative.paragraphs) || []
  const provenance = (governedNarrative && governedNarrative.composition_provenance) || {}
  const qc = (governedNarrative && governedNarrative.qualification_context) || {}

  return (
    <div className="narrative-envelope">
      <div className="narrative-header">
        <div className="narrative-header-state">
          <span className="narrative-header-s-state">{qualificationLevel || 'S1'}</span>
          <span className="narrative-header-label">Structural Qualification</span>
        </div>
        {qc.specimen_display && (
          <div className="narrative-header-specimen">{qc.specimen_display}</div>
        )}
      </div>

      <div className="narrative-body">
        {paragraphs.map((p, i) => {
          const arc = p.arc_position
          const chip = ARC_CHIPS[arc]
          const isSelected = selectedArc === arc
          const anchorCount = (p.anchors || []).length
          return (
            <div
              key={arc || i}
              className={`narrative-paragraph${isSelected ? ' narrative-paragraph--selected' : ''}`}
              data-arc={arc}
              role="button"
              tabIndex={0}
              onClick={() => onArcSelect && onArcSelect(isSelected ? null : arc)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onArcSelect && onArcSelect(isSelected ? null : arc) } }}
              aria-pressed={isSelected}
              aria-label={`${ARC_LABELS[arc] || arc} — click to inspect evidence`}
            >
              <div className="narrative-paragraph-header">
                {chip && (
                  <span className="narrative-arc-chip" style={{ borderColor: chip.color, color: chip.color }}>{chip.label}</span>
                )}
                {anchorCount > 0 && (
                  <span className="narrative-anchor-count">{anchorCount} anchor{anchorCount !== 1 ? 's' : ''}</span>
                )}
              </div>
              <p className="narrative-paragraph-text">{p.text}</p>
            </div>
          )
        })}
      </div>

      <div className="narrative-provenance">
        <span className="narrative-provenance-method">{provenance.method === 'DETERMINISTIC_BOUNDED' ? 'Deterministic bounded composition' : provenance.method}</span>
        <span className="narrative-provenance-sep">·</span>
        <span className="narrative-provenance-contract">{provenance.governance_contract}</span>
        <span className="narrative-provenance-sep">·</span>
        <span className="narrative-provenance-anchors">{provenance.anchors_consumed} anchors</span>
        <span className="narrative-provenance-sep">·</span>
        <span className="narrative-provenance-evidence">{provenance.evidence_objects_referenced} evidence objects</span>
      </div>
    </div>
  )
}

function BoardroomStructuralPosture({ fullReport }) {
  const ts = (fullReport && fullReport.topology_summary) || {}
  const ql = (fullReport && fullReport.qualification_level) || 'S1'
  const clusterCount = ts.cluster_count || 0
  const nodeCount = ts.semantic_domain_count || 0

  return (
    <div className="narrative-envelope narrative-envelope--posture">
      <div className="narrative-header">
        <div className="narrative-header-state">
          <span className="narrative-header-s-state">{ql}</span>
          <span className="narrative-header-label">Structural Qualification</span>
        </div>
      </div>
      <div className="narrative-body">
        <div className="narrative-paragraph" data-arc="POSTURE">
          <p className="narrative-paragraph-text">
            Structural substrate active. {clusterCount} structural clusters spanning {nodeCount} components.
            Structural topology and authority analysis complete. Semantic qualification has not yet been established —
            all intelligence is structurally derived.
          </p>
        </div>
      </div>
      <div className="narrative-provenance">
        <span className="narrative-provenance-method">Structural posture only</span>
        <span className="narrative-provenance-sep">·</span>
        <span className="narrative-provenance-contract">No narrative anchors available</span>
      </div>
    </div>
  )
}

function BoardroomDecisionSurface({ adapted, renderState, scope, fullReport, boardroomProjection, narrative, evidenceBlocks, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, onModeTransition, selectedNarrativeArc, onNarrativeSelect }) {
  const [topoModalOpen, setTopoModalOpen] = useState(false)
  const [signalTraceId, setSignalTraceId] = useState(null)
  const openTopoModal = useCallback(() => setTopoModalOpen(true), [])
  const closeTopoModal = useCallback(() => { setTopoModalOpen(false); setSignalTraceId(null) }, [])

  // LEGACY PRE-PROJECTION PATH: S1 narrative rendering — governed S2+ runs (genesis_e2e_03) never enter this branch
  const isS1 = fullReport && fullReport.qualification_level === 'S1'
  const governedNarrative = fullReport && fullReport.governed_narrative

  if (isS1) {
    const narrativeAvailable = governedNarrative && governedNarrative.available
    return (
      <div className="rep-field rep-field--boardroom rep-field--narrative">
        <RepModeTag
          label="Boardroom lens"
          sub="Board · governed executive narrative"
          zones={[{ id: 'Z1', name: 'Executive Narrative' }, { id: 'Z2', name: 'Structural Authority' }]}
        />

        {narrativeAvailable
          ? <NarrativeEnvelope governedNarrative={governedNarrative} qualificationLevel="S1" selectedArc={selectedNarrativeArc} onArcSelect={onNarrativeSelect} />
          : <BoardroomStructuralPosture fullReport={fullReport} />
        }

        <div className="cockpit-footer">
          All outputs structurally derived — governed narrative composition under 75.x bounded authority. No inference, no AI-generated assessment beyond structural evidence.
        </div>
      </div>
    )
  }

  const rs = (fullReport && fullReport.readiness_summary) || {}
  const ts = (fullReport && fullReport.topology_summary) || {}
  const qs = (fullReport && fullReport.qualifier_summary) || {}
  const ps = (fullReport && fullReport.propagation_summary) || {}
  const sigs = (fullReport && fullReport.signal_interpretations) || []

  const backedCount = ts.structurally_backed_count || 0
  const totalDomains = ts.semantic_domain_count || 0
  const semanticOnlyCount = ts.semantic_only_count || Math.max(0, totalDomains - backedCount)

  const activatedSignals = sigs.filter(s => s.severity !== 'NOMINAL')
  const nominalSignals = sigs.filter(s => s.severity === 'NOMINAL')
  const somethingFound = activatedSignals.length > 0
  const pressureZone = ps.primary_zone_business_label || null

  const origin = evidenceBlocks && evidenceBlocks.find(b => b && b.propagation_role === 'ORIGIN')
  const passthrough = evidenceBlocks && evidenceBlocks.find(b => b && b.propagation_role === 'PASS_THROUGH')
  const receiver = evidenceBlocks && evidenceBlocks.find(b => b && b.propagation_role === 'RECEIVER')

  const SIGNAL_FAMILY_CAPTIONS = {
    ISIG: 'Import dependency tension',
    DPSIG: 'Structural concentration pressure',
    PSIG: 'Architectural binding stress',
  }

  const signalFamilies = sigs.reduce((acc, s) => {
    const fam = s.signal_family || (s.signal_id && s.signal_id.startsWith('ISIG') ? 'ISIG' : s.signal_id && s.signal_id.startsWith('PSIG') ? 'PSIG' : 'DPSIG')
    if (!acc[fam]) acc[fam] = []
    acc[fam].push(s)
    return acc
  }, {})
  const familyKeys = Object.keys(signalFamilies)

  if (boardroomProjection && boardroomProjection.qualification_posture.governed) {
    const bp = boardroomProjection
    const qp = bp.qualification_posture
    const bpTs = bp.tension_summary
    const bpSi = bp.signal_intelligence
    const bpDc = bp.domain_coverage
    const bpGl = bp.governance_legitimacy
    const sec = bpGl.sections

    const tensionPct = bpTs.total_signals > 0 ? Math.round((bpTs.activated_count / bpTs.total_signals) * 100) : 0

    return (
      <div className="rep-field rep-field--boardroom rep-field--cockpit rep-field--governed">
        <RepModeTag
          label="Boardroom lens"
          sub="Board · governed intelligence posture"
          zones={[{ id: 'Z1', name: 'Governed Intelligence' }, { id: 'Z2', name: 'Structural Tension' }]}
        />

        <div className="cockpit-finding" data-found={String(bpTs.activated_count > 0)} data-governed="true">
          <div className="cockpit-finding-verdict">{bpTs.finding_headline}</div>
          <div className="cockpit-finding-summary">{bpTs.tension_narrative}</div>
        </div>

        {bpSi.families.length > 0 && (
          <div className="signal-field" data-pressure={bpTs.activated_count > 0 ? 'active' : 'nominal'}>
            <div className="signal-field-families">
              {bpSi.families.map(fam => (
                <span key={fam.family} className="signal-field-family-chip" data-family={fam.family} data-active={String(fam.activated_count > 0)}>
                  <span className="signal-field-family-name">{fam.family}</span>
                  <span className="signal-field-family-caption">{fam.family_label}</span>
                  {fam.activated_count > 0 && <span className="signal-field-family-count">{fam.activated_count} elevated</span>}
                </span>
              ))}
            </div>
            <div className="signal-field-strip">
              {bpSi.families.flatMap(fam => fam.signals).filter(s => s.severity !== 'NOMINAL' && s.severity !== 'CLUSTER_BALANCED').map(sig => (
                <span key={sig.signal_id} className="signal-field-pip" data-severity={sig.severity} title={sig.signal_name} />
              ))}
              {bpTs.activated_count > 0 && (
                <span className="signal-field-count">{bpTs.activated_count} activated</span>
              )}
              {(bpTs.total_signals - bpTs.activated_count) > 0 && (
                <span className="signal-field-nominal">{bpTs.total_signals - bpTs.activated_count} nominal</span>
              )}
            </div>
          </div>
        )}

        <div className="cockpit-synthesis">
          <div className="cockpit-synthesis-conclusion">{bpGl.governance_narrative}</div>
          {sec.cross_specimen && sec.cross_specimen.available && sec.cross_specimen.detail.total_observations > 0 && (
            <div className="cockpit-synthesis-convergence">
              Governance patterns confirmed across independent specimens — {sec.cross_specimen.detail.convergences} convergences observed.
            </div>
          )}
        </div>

        <div className="cockpit-instruments">
          <div className="cockpit-gauge-panel">
            <CockpitRadialGauge governedLevel={qp.s_level} tensionPct={tensionPct} />
            <div className="cockpit-gauge-meta">
              <span className="cockpit-gauge-band">{qp.s_level}</span>
              <span className="cockpit-gauge-sep">·</span>
              <span className="cockpit-gauge-posture">{(qp.provenance_summary || '').replace(/\.$/, '')}</span>
            </div>
          </div>

          <div className="cockpit-signal-panel">
            <div className="cockpit-signal-label">SIGNAL ASSESSMENT</div>
            {/* INTERIM_COMPONENT_COMPATIBILITY_MAPPING: executive_reading → boardroom_interpretation adapter until CockpitSignalBar accepts projection-native fields */}
            {bpSi.families.flatMap(fam => fam.signals).map(sig => (
              <CockpitSignalBar key={sig.signal_id} signal={{ ...sig, interpretation: sig.executive_reading, boardroom_interpretation: sig.executive_reading }} governed />
            ))}
            {bpTs.total_signals > 0 && (
              <div className="cockpit-signal-tally">
                {bpTs.activated_count > 0
                  ? `${bpTs.activated_count} of ${bpTs.total_signals} activated`
                  : `${bpTs.total_signals} nominal`
                }
              </div>
            )}
            <div className="cockpit-governance-chips">
              {sec.deterministic_replay && sec.deterministic_replay.available && (
                <span className="cockpit-gov-chip" data-status={sec.deterministic_replay.detail.status}>{sec.deterministic_replay.detail.status === 'PASS' ? 'REPLAY PASS' : 'REPLAY ' + sec.deterministic_replay.detail.status}</span>
              )}
              {sec.constitutional_anchor && sec.constitutional_anchor.available && (
                <span className="cockpit-gov-chip" data-status={sec.constitutional_anchor.detail.advancement_blocked ? 'BLOCKED' : 'PASS'}>{sec.constitutional_anchor.detail.advancement_blocked ? 'ANCHOR BLOCKED' : 'ANCHOR PASS'}</span>
              )}
              {sec.replay_certification && sec.replay_certification.available && (
                <span className="cockpit-gov-chip" data-status={sec.replay_certification.detail.certification_status === 'CERTIFIED' ? 'PASS' : 'PENDING'}>{sec.replay_certification.detail.certification_status === 'CERTIFIED' ? 'CERTIFIED' : sec.replay_certification.detail.certification_status}</span>
              )}
            </div>
          </div>

          <div className="cockpit-coverage-panel">
            <div className="cockpit-coverage-label">GOVERNED DOMAINS</div>
            <div className="cockpit-coverage-ring">
              <svg viewBox="0 0 80 80" className="cockpit-coverage-svg" aria-label={`${bpDc.structurally_backed} of ${bpDc.total_domains} governed`}>
                <circle cx="40" cy="40" r="32" fill="none" stroke="#1e2330" strokeWidth="6" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="#64ffda" strokeWidth="6"
                  strokeDasharray={`${(bpDc.structurally_backed / Math.max(1, bpDc.total_domains)) * 201} 201`}
                  strokeLinecap="round" transform="rotate(-90 40 40)" />
                <text x="40" y="37" textAnchor="middle" fontSize="16" fontWeight="600" fill="#ccd6f6" fontFamily="'Courier New', monospace">{bpDc.total_domains}</text>
                <text x="40" y="49" textAnchor="middle" fontSize="7" fill="#6a7a9a" fontFamily="-apple-system, sans-serif">domains</text>
              </svg>
            </div>
            <div className="cockpit-coverage-meta">
              {sec.proposition_review && sec.proposition_review.available && (
                <div className="cockpit-coverage-row"><span className="cockpit-coverage-dot cockpit-coverage-dot--backed" />{sec.proposition_review.detail.accepted} propositions accepted</div>
              )}
              {sec.evidence_enrichment && sec.evidence_enrichment.available && sec.evidence_enrichment.detail.enrichment_events > 0 && (
                <div className="cockpit-coverage-row"><span className="cockpit-coverage-dot cockpit-coverage-dot--advisory" />{sec.evidence_enrichment.detail.enrichment_events} evidence corrections</div>
              )}
            </div>
          </div>
        </div>

        {fullReport && fullReport.semantic_domain_registry && fullReport.semantic_domain_registry.length > 0 && (
          <div className="cockpit-topology-preview" onClick={openTopoModal} role="button" tabIndex={0} aria-label="Open topology explorer" onKeyDown={e => e.key === 'Enter' && openTopoModal()}>
            <TopologyGraph
              domains={fullReport.semantic_domain_registry}
              clusters={fullReport.semantic_cluster_registry || []}
              edges={fullReport.semantic_topology_edges || []}
              pressureZoneLabel={bpTs.pressure_zone || ''}
              pressureZoneState={fullReport.pressure_zone_state}
            />
            <div className="cockpit-topology-hint">Click to explore governed topology</div>
          </div>
        )}

        {topoModalOpen && createPortal(<TopologyModal fullReport={fullReport} onClose={closeTopoModal} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} temporalAnalyticsData={temporalAnalyticsData} temporalLifecycleData={temporalLifecycleData} initialSignalTrace={signalTraceId} onSignalTraceConsumed={() => setSignalTraceId(null)} mode="boardroom" onModeTransition={(targetMode, domainId, targetZoneKey) => { closeTopoModal(); if (onModeTransition) onModeTransition(targetMode, domainId, targetZoneKey) }} />, document.body)}

        <BoardroomGovernanceIntelligence fullReport={fullReport} boardroomProjection={boardroomProjection} />

        <div className="cockpit-footer">
          Governed intelligence under 75.x bounded authority. Structural derivation primary. All claims trace to evidence.
        </div>
      </div>
    )
  }

  const score = rs.score != null ? rs.score : 0
  const band = rs.band || '—'
  const posture = rs.posture || '—'
  const groundingPct = Math.round((backedCount / Math.max(1, totalDomains)) * 100)

  const findingVerdict = somethingFound
    ? `Structural analysis detected ${activatedSignals.length} elevated signal${activatedSignals.length > 1 ? 's' : ''}. Pressure is concentrated${pressureZone ? ` around "${pressureZone}"` : ''}.`
    : `No elevated structural pressure detected. All ${sigs.length} indicators are within normal parameters.`

  const impactStatement = somethingFound
    ? (activatedSignals.some(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
      ? 'Structural pressure at elevated levels — organizational exposure is active, not theoretical.'
      : 'Moderate structural pressure detected — monitor for escalation, no immediate organizational risk.')
    : 'Structural posture is stable. No active exposure requiring executive attention.'

  return (
    <div className="rep-field rep-field--boardroom rep-field--cockpit">
      <RepModeTag
        label="Boardroom lens"
        sub="Board · decision-ready posture"
        zones={[{ id: 'Z1', name: 'Executive Posture' }, { id: 'Z2', name: 'Structural Signal Cognition' }]}
      />

      <div className="cockpit-finding" data-found={String(somethingFound)}>
        <div className="cockpit-finding-verdict">
          {somethingFound ? 'STRUCTURAL PRESSURE DETECTED' : 'NO ELEVATED PRESSURE'}
        </div>
        <div className="cockpit-finding-summary">{findingVerdict}</div>
      </div>

      {sigs.length > 0 && (
        <div className="signal-field" data-pressure={somethingFound ? 'active' : 'nominal'}>
          {[origin, passthrough, receiver].filter(Boolean).length >= 2 && (
            <div className="signal-field-vector">
              {[origin, passthrough, receiver].filter(Boolean).map((node, i, arr) => {
                const roleGlyph = node.propagation_role === 'ORIGIN' ? '◉' : node.propagation_role === 'PASS_THROUGH' ? '◎' : '◯'
                const tier = node.signal_cards && node.signal_cards[0] ? node.signal_cards[0].pressure_tier : 'LOW'
                return (
                  <span key={node.domain_alias} className="signal-field-node" data-tier={tier}>
                    <span className="signal-field-glyph">{roleGlyph}</span>
                    <span className="signal-field-domain">{node.domain_alias}</span>
                    {i < arr.length - 1 && <span className="signal-field-arrow">→</span>}
                  </span>
                )
              })}
            </div>
          )}
          <div className="signal-field-strip">
            {activatedSignals.map(sig => (
              <span key={sig.signal_id} className="signal-field-pip" data-severity={sig.severity} title={sig.signal_name} />
            ))}
            {activatedSignals.length > 0 && (
              <span className="signal-field-count">{activatedSignals.length} activated</span>
            )}
            {nominalSignals.length > 0 && (
              <span className="signal-field-nominal">{nominalSignals.length} nominal</span>
            )}
          </div>
        </div>
      )}

      <div className="cockpit-synthesis">
        {rs.conclusion && (
          <div className="cockpit-synthesis-conclusion">{rs.conclusion}</div>
        )}
        {somethingFound && sigs[0] && sigs[0].compound_narrative && (
          <div className="cockpit-synthesis-compound">{sigs[0].compound_narrative}</div>
        )}
        {sigs[0] && sigs[0].confidence_note && (
          <div className="cockpit-synthesis-confidence">{sigs[0].confidence_note}</div>
        )}
        {somethingFound && pressureZone && (
          <div className="cockpit-synthesis-pressure">
            Pressure concentrated around &ldquo;{pressureZone}&rdquo;
            {[origin, passthrough, receiver].filter(Boolean).length >= 2 && (
              <span> — propagation: {[origin, passthrough, receiver].filter(Boolean).map(n => n.domain_alias).join(' → ')}</span>
            )}
          </div>
        )}
      </div>

      <div className="cockpit-instruments">
        <div className="cockpit-gauge-panel">
          <CockpitRadialGauge score={score} groundingPct={groundingPct} />
          <div className="cockpit-gauge-meta">
            <span className="cockpit-gauge-band">{band}</span>
            <span className="cockpit-gauge-sep">·</span>
            <span className="cockpit-gauge-posture">{posture}</span>
          </div>
        </div>

        <div className="cockpit-signal-panel">
          <div className="cockpit-signal-label">SIGNAL ASSESSMENT</div>
          {sigs.map(sig => (
            <CockpitSignalBar key={sig.signal_id} signal={sig} />
          ))}
          {sigs.length > 0 && (
            <div className="cockpit-signal-tally">
              {activatedSignals.length > 0
                ? `${activatedSignals.length} of ${sigs.length} activated`
                : `${sigs.length} nominal`
              }
            </div>
          )}
        </div>

        <div className="cockpit-coverage-panel">
          <div className="cockpit-coverage-label">EVIDENCE COVERAGE</div>
          <div className="cockpit-coverage-ring">
            <svg viewBox="0 0 80 80" className="cockpit-coverage-svg" aria-label={`${backedCount} of ${totalDomains} backed`}>
              <circle cx="40" cy="40" r="32" fill="none" stroke="#1e2330" strokeWidth="6" />
              <circle cx="40" cy="40" r="32" fill="none" stroke="#64ffda" strokeWidth="6"
                strokeDasharray={`${(backedCount / Math.max(1, totalDomains)) * 201} 201`}
                strokeLinecap="round" transform="rotate(-90 40 40)" />
              <text x="40" y="37" textAnchor="middle" fontSize="16" fontWeight="600" fill="#ccd6f6" fontFamily="'Courier New', monospace">{backedCount}</text>
              <text x="40" y="49" textAnchor="middle" fontSize="7" fill="#6a7a9a" fontFamily="-apple-system, sans-serif">of {totalDomains}</text>
            </svg>
          </div>
          <div className="cockpit-coverage-meta">
            <div className="cockpit-coverage-row"><span className="cockpit-coverage-dot cockpit-coverage-dot--backed" />{backedCount} structurally backed</div>
            <div className="cockpit-coverage-row"><span className="cockpit-coverage-dot cockpit-coverage-dot--advisory" />{semanticOnlyCount} advisory bound</div>
          </div>
        </div>
      </div>

      {fullReport && fullReport.semantic_domain_registry && fullReport.semantic_domain_registry.length > 0 && (
        <div className="cockpit-topology-preview" onClick={openTopoModal} role="button" tabIndex={0} aria-label="Open topology explorer" onKeyDown={e => e.key === 'Enter' && openTopoModal()}>
          <TopologyGraph
            domains={fullReport.semantic_domain_registry}
            clusters={fullReport.semantic_cluster_registry || []}
            edges={fullReport.semantic_topology_edges || []}
            pressureZoneLabel={pressureZone || ''}
            pressureZoneState={fullReport.pressure_zone_state}
          />
          <div className="cockpit-topology-hint">Click to explore topology</div>
        </div>
      )}

      {topoModalOpen && createPortal(<TopologyModal fullReport={fullReport} onClose={closeTopoModal} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} temporalAnalyticsData={temporalAnalyticsData} temporalLifecycleData={temporalLifecycleData} initialSignalTrace={signalTraceId} onSignalTraceConsumed={() => setSignalTraceId(null)} mode="boardroom" onModeTransition={(targetMode, domainId, targetZoneKey) => { closeTopoModal(); if (onModeTransition) onModeTransition(targetMode, domainId, targetZoneKey) }} />, document.body)}

      <div className="cockpit-impact">
        <div className="cockpit-impact-label">ORGANIZATIONAL IMPACT</div>
        <div className="cockpit-impact-assessment">{impactStatement}</div>
        {somethingFound && (origin || passthrough || receiver) && (
          <div className="cockpit-impact-flow">
            {[origin, passthrough, receiver].filter(Boolean).map((node, i) => (
              <div key={node.domain_alias} className="cockpit-impact-node">
                {i > 0 && <span className="cockpit-impact-arrow">→</span>}
                <span className="cockpit-impact-domain">{node.domain_alias}</span>
                <span className="cockpit-impact-role">{node.propagation_role.replace(/_/g, '-')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="cockpit-evidence-boundary">
        <div className="cockpit-evidence-boundary-label">EVIDENCE BOUNDARY</div>
        <div className="cockpit-evidence-boundary-row">
          <span className="cockpit-evidence-boundary-stat cockpit-evidence-boundary-stat--backed">
            <span className="cockpit-evidence-boundary-dot cockpit-evidence-boundary-dot--backed" />
            {backedCount} structurally backed
          </span>
          <span className="cockpit-evidence-boundary-sep">·</span>
          <span className="cockpit-evidence-boundary-stat cockpit-evidence-boundary-stat--advisory">
            <span className="cockpit-evidence-boundary-dot cockpit-evidence-boundary-dot--advisory" />
            {semanticOnlyCount} advisory bound
          </span>
        </div>
        {semanticOnlyCount > 0 && (
          <div className="cockpit-evidence-boundary-note">Advisory-bound domains are confirmed unknowns — not assumed healthy states</div>
        )}
      </div>

      <BoardroomGovernanceIntelligence fullReport={fullReport} />

      <div className="cockpit-footer">
        All outputs structurally derived — no inference, no AI-generated assessment.
      </div>
    </div>
  )
}

function BoardroomGovernanceIntelligence({ fullReport, boardroomProjection }) {
  if (!fullReport) return null

  const bp = boardroomProjection
  const gleg = bp && bp.governance_legitimacy

  if (gleg && gleg.available) {
    const qp = bp.qualification_posture
    return (
      <div className="cockpit-governance-intelligence cockpit-governance-intelligence--governed">
        <div className="cockpit-governance-intelligence-label">GOVERNANCE LEGITIMACY</div>
        <div className="cockpit-governance-envelope">
          {gleg.legitimacy_sentences.map((s, i) => (
            <div key={i} className="cockpit-governance-sentence">{s}</div>
          ))}
        </div>
        <div className="cockpit-governance-authority">
          75.x bounded authority · {qp.authority_ceiling || 'L3'} ceiling · evidence-traced
        </div>
      </div>
    )
  }

  const gl = fullReport.governance_lifecycle
  const pc = fullReport.proposition_corpus
  const ei = fullReport.enrichment_intelligence
  const rv = fullReport.revalidation_intelligence
  const ca = fullReport.constitutional_anchor
  const ci = fullReport.convergence_intelligence
  const cc = fullReport.chronicle_certification

  const hasAny = (gl && gl.available) || (cc && cc.available) || (ca && ca.available)
  if (!hasAny) return null

  return (
    <div className="cockpit-governance-intelligence">
      <div className="cockpit-governance-intelligence-label">GOVERNANCE INTELLIGENCE</div>

      {gl && gl.available && (
        <div className="cockpit-governance-row">
          <span className="cockpit-governance-badge cockpit-governance-badge--s-level" data-level={gl.s_level}>
            {gl.s_level}
          </span>
          {gl.qualification_provenance && (
            <span className="cockpit-governance-provenance">
              via {gl.qualification_provenance.replace(/_/g, ' ')}
            </span>
          )}
          {gl.authority_ceiling && (
            <span className="cockpit-governance-ceiling">
              Ceiling: {gl.authority_ceiling}
            </span>
          )}
        </div>
      )}

      {cc && cc.available && (
        <div className="cockpit-governance-row">
          <span className="cockpit-governance-badge cockpit-governance-badge--certified" data-status={cc.certification_status}>
            {cc.certification_status === 'CERTIFIED' ? 'REPLAY-CERTIFIED' : cc.certification_status}
          </span>
          <span className="cockpit-governance-detail">
            {cc.passed}/{cc.total_checks} checks · {cc.phase_count} phases
          </span>
        </div>
      )}

      {ca && ca.available && (
        <div className="cockpit-governance-row">
          <span className="cockpit-governance-anchor-verdict" data-verdict={ca.advancement_blocked ? 'BLOCKED' : 'PASS'}>
            {ca.summary && ca.summary.passed != null
              ? `${ca.summary.passed}/${ca.summary.total} constitutional dimensions PASS`
              : ca.overall_verdict && ca.overall_verdict.replace(/_/g, ' ')}
          </span>
        </div>
      )}

      {pc && pc.available && pc.total > 0 && (
        <div className="cockpit-governance-row">
          <span className="cockpit-governance-statement">
            {pc.disposition_counts.accepted} accepted, {pc.disposition_counts.rejected} rejected, {pc.disposition_counts.arbitrated} arbitrated
            {pc.governance_friction_rate > 0 && (
              <span> — governance was exercised, not rubber-stamped</span>
            )}
          </span>
        </div>
      )}

      {ei && ei.available && ei.enrichment_events > 0 && (
        <div className="cockpit-governance-row">
          <span className="cockpit-governance-statement">
            {ei.enrichment_events} evidence corrections across {ei.domains_corrected} domains — the substrate self-corrected
          </span>
        </div>
      )}

      {rv && rv.available && (
        <div className="cockpit-governance-row">
          <span className="cockpit-governance-statement" data-status={rv.status}>
            Deterministic revalidation: {rv.passed}/{rv.total_checks} PASS across {rv.phase_count} phases
          </span>
        </div>
      )}

      {ci && ci.available && ci.total_observations > 0 && (
        <div className="cockpit-governance-row">
          <span className="cockpit-governance-statement">
            {ci.total_observations} cross-specimen observations — {ci.convergences.length} convergences, {ci.divergences.length} divergences
          </span>
        </div>
      )}
    </div>
  )
}

function RepresentationField({ boardroomMode, densityClass, adapted, renderState, blocks, scope, fullReport, boardroomProjection, qualifierClass, narrative, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, onModeTransition, onZoneChange, onAuthorityChange, onEmergenceState, selectedNarrativeArc, onNarrativeSelect, swIntelActive, swIntelProjection, onSwIntelDeactivate, cognitionState, onSurfaceSelect, onDomainFocus, onPressureZoneFocus, topologyCognitionOverlay, activeConditions, activeConditionId, onConditionSelect, onConditionIntervention, swIntelTeaser }) {
  if (boardroomMode) {
    return (
      <>
        <BoardroomDecisionSurface adapted={adapted} renderState={renderState} scope={scope} fullReport={fullReport} boardroomProjection={boardroomProjection} narrative={narrative} evidenceBlocks={blocks} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} temporalAnalyticsData={temporalAnalyticsData} temporalLifecycleData={temporalLifecycleData} onModeTransition={onModeTransition} selectedNarrativeArc={selectedNarrativeArc} onNarrativeSelect={onNarrativeSelect} />
        {swIntelActive && swIntelProjection && swIntelProjection.module_state !== 'ABSENT' && (
          <SoftwareIntelligenceBoardroomSummary projection={swIntelProjection} />
        )}
      </>
    )
  }
  if (densityClass === 'INVESTIGATION_DENSE') {
    return (
      <>
        <InvestigationTraceField adapted={adapted} blocks={blocks} scope={scope} fullReport={fullReport} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} temporalAnalyticsData={temporalAnalyticsData} temporalLifecycleData={temporalLifecycleData} />
        {swIntelActive && swIntelProjection && swIntelProjection.module_state !== 'ABSENT' && (
          <SoftwareIntelligenceInvestigationView projection={swIntelProjection} onDeactivate={onSwIntelDeactivate} activeSurface={cognitionState && cognitionState.activeSurface} onSurfaceSelect={onSurfaceSelect} />
        )}
      </>
    )
  }
  if (densityClass === 'EXECUTIVE_BALANCED') {
    return (
      <>
        <BalancedConsequenceField adapted={adapted} blocks={blocks} scope={scope} renderState={renderState} fullReport={fullReport} qualifierClass={qualifierClass} onAuthorityChange={onAuthorityChange} onEmergenceState={onEmergenceState} />
        {swIntelActive && swIntelProjection && swIntelProjection.module_state !== 'ABSENT' && (
          <SoftwareIntelligenceBalancedNarrative projection={swIntelProjection} />
        )}
      </>
    )
  }
  return (
    <>
      <DenseTopologyField adapted={adapted} blocks={blocks} scope={scope} fullReport={fullReport} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} temporalAnalyticsData={temporalAnalyticsData} temporalLifecycleData={temporalLifecycleData} onZoneChange={onZoneChange} cognitionOverlay={topologyCognitionOverlay} onPressureZoneClick={onPressureZoneFocus} activePressureZone={cognitionState && cognitionState.activePressureZone} activeConditionId={activeConditionId} onConditionSelect={onConditionSelect} onConditionIntervention={onConditionIntervention} swIntelActive={swIntelActive} swIntelTeaser={swIntelTeaser} />
      {swIntelActive && swIntelProjection && swIntelProjection.module_state !== 'ABSENT' && (
        <SoftwareIntelligenceDenseView projection={swIntelProjection} onDeactivate={onSwIntelDeactivate} activeSurface={cognitionState && cognitionState.activeSurface} onSurfaceSelect={onSurfaceSelect} activeConditions={activeConditions} />
      )}
    </>
  )
}

export default function IntelligenceField({ narrative, adapted, densityClass, boardroomMode, renderState, evidenceBlocks, fullReport, boardroomProjection, reportPackArtifacts, qualifierClass, qualifierLabel, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, onModeTransition, pendingTransitionZone, onTransitionZoneConsumed, onAuthorityChange, swIntelActive, swIntelProjection, onSwIntelDeactivate, sqoAuthorityWorkspace, sqoBinding }) {
  const scope = (fullReport && fullReport.topology_scope) || {}
  const [activeZoneKey, setActiveZoneKey] = useState(null)
  const [activeQueryKey, setActiveQueryKey] = useState(null)
  const [exploredQueries, setExploredQueries] = useState(() => new Set())
  const [emergenceState, setEmergenceState] = useState(null)
  const [piRuntimeActive, setPiRuntimeActive] = useState(false)
  const [activeExpansionIndex, setActiveExpansionIndex] = useState(null)

  const [cognitionState, setCognitionState] = useState({
    activeSurface: null,
    focusedDomain: null,
    activePressureZone: null,
    activeSignals: [],
    activeQueryIndex: null,
    activeConditionId: null,
  })
  const handleSurfaceSelect = useCallback((surfaceId) => {
    setCognitionState(prev => ({
      ...prev,
      activeSurface: prev.activeSurface === surfaceId ? null : surfaceId,
      activePressureZone: null,
      activeQueryIndex: null,
      activeConditionId: null,
    }))
  }, [])
  const handleDomainFocus = useCallback((domainId) => {
    setCognitionState(prev => ({
      ...prev,
      focusedDomain: prev.focusedDomain === domainId ? null : domainId,
    }))
  }, [])
  const handlePressureZoneFocus = useCallback((zoneId) => {
    setCognitionState(prev => {
      const nextZone = prev.activePressureZone === zoneId ? null : zoneId
      return {
        ...prev,
        activePressureZone: nextZone,
        activeSurface: nextZone ? null : prev.activeSurface,
        activeQueryIndex: null,
        activeConditionId: null,
      }
    })
  }, [])
  const handleCognitionQuerySelect = useCallback((index) => {
    setCognitionState(prev => ({
      ...prev,
      activeQueryIndex: prev.activeQueryIndex === index ? null : index,
    }))
  }, [])
  const handleCognitionQueryDismiss = useCallback(() => {
    setCognitionState(prev => ({ ...prev, activeQueryIndex: null }))
  }, [])
  const handleConditionSelect = useCallback((conditionId) => {
    if (!swIntelActive) return
    setCognitionState(prev => ({
      ...prev,
      activeConditionId: prev.activeConditionId === conditionId ? null : conditionId,
      activeSurface: null,
      activePressureZone: null,
      activeQueryIndex: null,
    }))
  }, [swIntelActive])
  const handleConditionDismiss = useCallback(() => {
    setCognitionState(prev => ({ ...prev, activeConditionId: null }))
  }, [])
  const handleConditionIntervention = useCallback((intervention, condition) => {
    if (intervention.action_type === 'DECOMPOSE' && condition.contributing_condition_ids) {
      return
    }
    const linkedSurfaces = CONDITION_TO_SURFACES[condition.condition_type] || []
    if (linkedSurfaces.length > 0) {
      if (!swIntelActive) return
      setCognitionState(prev => ({
        ...prev,
        activeSurface: linkedSurfaces[0],
        activeConditionId: null,
        activePressureZone: null,
        activeQueryIndex: null,
      }))
    }
  }, [swIntelActive])

  const synthesisResult = useMemo(() => swIntelActive ? synthesize(fullReport) : null, [fullReport, swIntelActive])
  const swIntelTeaser = useMemo(() => !swIntelActive ? synthesizeTeaser(fullReport) : null, [fullReport, swIntelActive])
  const activeConditions = synthesisResult ? synthesisResult.active : []

  const resolvedCondition = useMemo(() => {
    if (!cognitionState.activeConditionId || !synthesisResult) return null
    return synthesisResult.conditions.find(c => c.condition_id === cognitionState.activeConditionId) || null
  }, [cognitionState.activeConditionId, synthesisResult])

  const resolvedCognitionContract = useMemo(() => {
    if (!cognitionState.activeSurface || !fullReport || !swIntelProjection) return null
    const contract = SW_INTEL_DOMAIN_REASONING_CONTRACTS[cognitionState.activeSurface]
    if (!contract) return null
    const surface = (swIntelProjection.surfaces || []).find(s => s.surface_id === cognitionState.activeSurface)
    if (!surface) return null
    return { meta: contract.meta, surface, ...contract.resolve(fullReport, surface) }
  }, [cognitionState.activeSurface, fullReport, swIntelProjection])

  const topologyCognitionOverlay = useMemo(() => {
    if (swIntelActive && resolvedCondition && fullReport) {
      return deriveConditionCognitionState(resolvedCondition, fullReport)
    }
    if (cognitionState.activePressureZone && fullReport) {
      return derivePressureZoneCognitionState(cognitionState.activePressureZone, fullReport)
    }
    if (!swIntelActive || !cognitionState.activeSurface || !fullReport || !swIntelProjection) return null
    const surface = (swIntelProjection.surfaces || []).find(s => s.surface_id === cognitionState.activeSurface)
    if (!surface) return null
    return deriveTopologyCognitionState(cognitionState.activeSurface, fullReport, surface)
  }, [resolvedCondition, cognitionState.activeSurface, cognitionState.activePressureZone, fullReport, swIntelProjection, swIntelActive])

  const [interrogationTrail, setInterrogationTrail] = useState(() => new Set())
  const [selectedNarrativeArc, setSelectedNarrativeArc] = useState(null)
  const isBalanced = !boardroomMode && densityClass === 'EXECUTIVE_BALANCED'
  const handleEmergenceState = useCallback((state) => { setEmergenceState(state) }, [])
  const isDense = !boardroomMode && densityClass === 'EXECUTIVE_DENSE'
  const isInvestigation = !boardroomMode && densityClass === 'INVESTIGATION_DENSE'
  const canvasRef = useRef(null)

  const escalationAvailable = useMemo(() => {
    if (!fullReport) return false
    if (boardroomMode) return STRUCTURAL_ESCALATION_CONDITIONS.boardroom(fullReport)
    if (isBalanced) return STRUCTURAL_ESCALATION_CONDITIONS.balanced(fullReport)
    if (isDense) return STRUCTURAL_ESCALATION_CONDITIONS.dense(fullReport, activeZoneKey)
    if (isInvestigation) return STRUCTURAL_ESCALATION_CONDITIONS.investigation(fullReport)
    return false
  }, [fullReport, boardroomMode, isBalanced, isDense, isInvestigation, activeZoneKey])

  const escalationContext = useMemo(() => {
    if (!escalationAvailable || !fullReport) return null
    const mode = boardroomMode ? 'boardroom' : densityClass
    return { mode, zone: activeZoneKey }
  }, [escalationAvailable, fullReport, boardroomMode, densityClass, activeZoneKey])

  const expansions = useMemo(() => {
    if (!piRuntimeActive || !escalationContext || !fullReport) return []
    const modeKey = boardroomMode ? 'boardroom' : densityClass
    const generator = INTERROGATION_EXPANSION_REGISTRY[modeKey]
    return generator ? generator(fullReport, activeZoneKey) : []
  }, [piRuntimeActive, escalationContext, fullReport, boardroomMode, densityClass, activeZoneKey])

  const handleZoneChange = useCallback((zoneKey) => {
    setActiveZoneKey(zoneKey)
    setActiveQueryKey(null)
    setActiveExpansionIndex(null)
  }, [])
  const handleQuerySelect = useCallback((zoneKey, pathIndex) => {
    const key = `${zoneKey}:${pathIndex}`
    setActiveQueryKey(key)
    setExploredQueries(prev => { const next = new Set(prev); next.add(key); return next })
    setActiveExpansionIndex(null)
  }, [])
  const handleQueryDismiss = useCallback(() => {
    setActiveQueryKey(null)
  }, [])
  const handleEscalate = useCallback(() => {
    setPiRuntimeActive(true)
    setActiveQueryKey(null)
    if (onAuthorityChange) onAuthorityChange('PI_INTERPRETIVE')
  }, [onAuthorityChange])
  const handleDeescalate = useCallback(() => {
    setPiRuntimeActive(false)
    setActiveExpansionIndex(null)
    if (onAuthorityChange) onAuthorityChange(isBalanced ? null : null)
  }, [isBalanced, onAuthorityChange])
  const handleExpansionSelect = useCallback((index) => {
    setActiveExpansionIndex(index)
    setInterrogationTrail(prev => { const next = new Set(prev); next.add(index); return next })
    setActiveQueryKey(null)
  }, [])
  const handleExpansionDismiss = useCallback(() => {
    setActiveExpansionIndex(null)
  }, [])
  const handleTrailExport = useCallback(() => {
    let capturedTopologySvg = null
    const svgEl = document.querySelector('.topo-graph-svg')
    if (svgEl) {
      const clone = svgEl.cloneNode(true)
      clone.querySelectorAll('.topo-tooltip').forEach(el => el.remove())
      clone.removeAttribute('ref')
      capturedTopologySvg = clone.outerHTML
    }
    const html = buildTrailHTML({
      exploredQueries,
      interrogationTrail,
      fullReport,
      denseZonePaths: DENSE_ZONE_PATHS,
      guidedQueryAnswers: GUIDED_QUERY_ANSWERS,
      interrogationExpansionRegistry: INTERROGATION_EXPANSION_REGISTRY,
      expansionTypeLabels: EXPANSION_TYPE_LABELS,
      denseZoneRegistry: DENSE_ZONE_REGISTRY,
      tonePalette: TONE_PALETTE,
      client: DEFAULT_BINDING_CLIENT,
      run: DEFAULT_BINDING_RUN,
      qualifierClass,
      authorityTier: piRuntimeActive ? 'PI_INTERPRETIVE' : (emergenceState ? 'INTERPRETIVE' : 'INVESTIGATIVE'),
      densityClass,
      boardroomMode,
      capturedTopologySvg,
    })
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `evidence-record-${DEFAULT_BINDING_CLIENT}-${DEFAULT_BINDING_RUN}-${new Date().toISOString().slice(0, 10)}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [exploredQueries, interrogationTrail, fullReport, qualifierClass, piRuntimeActive, emergenceState, densityClass, boardroomMode])

  useEffect(() => {
    setCognitionState(prev => ({ ...prev, activeConditionId: null }))
  }, [swIntelActive])

  useEffect(() => {
    if (!isBalanced && onAuthorityChange) onAuthorityChange(null)
    if (!isBalanced) setEmergenceState(null)
    setPiRuntimeActive(false)
    setActiveExpansionIndex(null)
  }, [isBalanced, onAuthorityChange])

  useEffect(() => {
    if (!pendingTransitionZone || !isDense) return
    setActiveZoneKey(pendingTransitionZone)
    const zoneKey = pendingTransitionZone
    if (onTransitionZoneConsumed) onTransitionZoneConsumed()
    let attempts = 0
    function tryScroll() {
      const container = canvasRef.current
      const target = container && container.querySelector(`[data-zone-key="${zoneKey}"]`)
      if (target) {
        const rect = target.getBoundingClientRect()
        window.scrollTo(0, window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2)
        return
      }
      if (++attempts < 10) requestAnimationFrame(tryScroll)
    }
    requestAnimationFrame(tryScroll)
  }, [pendingTransitionZone, isDense, onTransitionZoneConsumed])

  useEffect(() => {
    if (!activeQueryKey && activeExpansionIndex === null) return
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        if (activeExpansionIndex !== null) setActiveExpansionIndex(null)
        else if (activeQueryKey) setActiveQueryKey(null)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeQueryKey, activeExpansionIndex])

  useEffect(() => {
    if (piRuntimeActive && !escalationAvailable) {
      setPiRuntimeActive(false)
      setActiveExpansionIndex(null)
    }
  }, [piRuntimeActive, escalationAvailable])

  return (
    <div
      className={`intelligence-field intelligence-field--three-col${boardroomMode ? ' intelligence-field--boardroom' : ''}`}
      data-mode={boardroomMode ? 'BOARDROOM' : densityClass}
      data-active-zone={isDense ? activeZoneKey : undefined}
      data-query-active={isDense && activeQueryKey ? activeQueryKey : undefined}
      data-depth-escalated={piRuntimeActive || undefined}
    >
      <ExecutiveInterpretation
        narrative={narrative}
        densityClass={densityClass}
        boardroomMode={boardroomMode}
        adapted={adapted}
        fullReport={fullReport}
        boardroomProjection={boardroomProjection}
        activeZoneKey={isDense ? activeZoneKey : null}
        activeQueryKey={isDense ? activeQueryKey : null}
        onQueryDismiss={handleQueryDismiss}
        emergenceState={isBalanced ? emergenceState : null}
        piRuntimeActive={piRuntimeActive}
        activeExpansionIndex={activeExpansionIndex}
        expansions={expansions}
        onExpansionDismiss={handleExpansionDismiss}
        selectedNarrativeArc={selectedNarrativeArc}
        resolvedCognitionContract={resolvedCognitionContract}
        cognitionQueryIndex={cognitionState.activeQueryIndex}
        onCognitionQueryDismiss={handleCognitionQueryDismiss}
        activeConditions={activeConditions}
        resolvedCondition={resolvedCondition}
        onConditionDismiss={handleConditionDismiss}
        swIntelActive={swIntelActive}
        swIntelTeaser={swIntelTeaser}
      />

      <main ref={canvasRef} className="intel-canvas" role="region" aria-label="Semantic operational canvas">
        <RepresentationField
          boardroomMode={boardroomMode}
          densityClass={densityClass}
          adapted={adapted}
          renderState={renderState}
          blocks={evidenceBlocks}
          scope={scope}
          fullReport={fullReport}
          boardroomProjection={boardroomProjection}
          qualifierClass={qualifierClass}
          narrative={narrative}
          correspondenceData={correspondenceData}
          evidenceIntakeData={evidenceIntakeData}
          debtIndexData={debtIndexData}
          progressionData={progressionData}
          maturityData={maturityData}
          temporalAnalyticsData={temporalAnalyticsData}
          temporalLifecycleData={temporalLifecycleData}
          onModeTransition={onModeTransition}
          onZoneChange={isDense ? handleZoneChange : undefined}
          onAuthorityChange={isBalanced ? onAuthorityChange : undefined}
          onEmergenceState={isBalanced ? handleEmergenceState : undefined}
          selectedNarrativeArc={selectedNarrativeArc}
          onNarrativeSelect={setSelectedNarrativeArc}
          swIntelActive={swIntelActive}
          swIntelProjection={swIntelProjection}
          onSwIntelDeactivate={onSwIntelDeactivate}
          cognitionState={cognitionState}
          onSurfaceSelect={handleSurfaceSelect}
          onDomainFocus={handleDomainFocus}
          onPressureZoneFocus={handlePressureZoneFocus}
          topologyCognitionOverlay={topologyCognitionOverlay}
          activeConditions={activeConditions}
          activeConditionId={cognitionState.activeConditionId}
          onConditionSelect={handleConditionSelect}
          onConditionIntervention={handleConditionIntervention}
          swIntelTeaser={swIntelTeaser}
        />

        <OrchestrationGuidanceRuntime
          projection={swIntelActive && swIntelProjection && swIntelProjection.module_state !== 'ABSENT' ? swIntelProjection : null}
          fullReport={fullReport}
          sqoAuthorityWorkspace={sqoAuthorityWorkspace}
          sqoBinding={sqoBinding}
        />
      </main>

      <SupportRail
        adapted={adapted}
        scope={scope}
        boardroomMode={boardroomMode}
        reportPackArtifacts={reportPackArtifacts}
        fullReport={fullReport}
        qualifierClass={qualifierClass}
        activeZoneKey={isDense ? activeZoneKey : null}
        densityClass={densityClass}
        activeQueryKey={isDense ? activeQueryKey : null}
        onQuerySelect={handleQuerySelect}
        exploredQueries={exploredQueries}
        emergenceState={isBalanced ? emergenceState : null}
        escalationAvailable={escalationAvailable}
        piRuntimeActive={piRuntimeActive}
        onEscalate={handleEscalate}
        onDeescalate={handleDeescalate}
        expansions={expansions}
        activeExpansionIndex={activeExpansionIndex}
        onExpansionSelect={handleExpansionSelect}
        interrogationTrail={interrogationTrail}
        onTrailExport={handleTrailExport}
        selectedNarrativeArc={selectedNarrativeArc}
        resolvedCognitionContract={resolvedCognitionContract}
        cognitionQueryIndex={cognitionState.activeQueryIndex}
        onCognitionQuerySelect={handleCognitionQuerySelect}
        activeConditions={activeConditions}
        resolvedCondition={resolvedCondition}
        swIntelActive={swIntelActive}
      />
    </div>
  )
}
