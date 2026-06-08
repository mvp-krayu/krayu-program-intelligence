import { useState, useCallback, useEffect, useRef, useMemo, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { PRESSURE_META, ROLE_META, DEFAULT_BINDING_CLIENT, DEFAULT_BINDING_RUN } from './constants'
import OperatorReadingGuide, { TermHint } from './OperatorReadingGuide'
import { TopologyGraph, StructuralSpinesPanel } from './StructuralTopologyZone'
import { buildTrailHTML } from '../../../lib/lens-v2/InterrogationTrailBuilder'
import { buildAssessmentPackage } from '../../../lib/lens-v2/AssessmentPackageBuilder'
import { SoftwareIntelligenceDenseView, SoftwareIntelligenceOperatorView } from './SoftwareIntelligenceField'
import OrchestrationGuidanceRuntime from './OrchestrationGuidanceRuntime'
import { deriveTopologyCognitionState, derivePressureZoneCognitionState, deriveConditionCognitionState, translateSignal, SURFACE_CONDITION_MAP } from '../../../lib/lens-v2/SoftwareIntelligenceProjectionAdapter'
import { ExecutionBlindnessModal, GravityDivergenceModal } from './ExecutionBlindnessModal'
import { resolveCognitionContract as resolveContract, deriveAffectedDomainsFromPaths, formatLensMetric } from '../../../lib/lens-v2/CognitionContractModel'
import { authorizeConditions as authorizeConditionsByAuthority } from '../../../lib/lens-v2/ProjectionAuthorityKernel'
import { synthesize, synthesizeTeaser, SEVERITY_RANK, translateCentralityNode, STRUCTURAL_ROLE_LABELS, CONDITION_VOCABULARY, CONDITION_INTERVENTIONS, qualifyDomainBacking } from '../../../lib/lens-v2/SignalSynthesisEngine'
import { compile as compileConsequences, compileTeaser as compileConsequenceTeaser, forBoardroom as consequencesForBoardroom, forBalanced as consequencesForBalanced, forInvestigation as consequencesForInvestigation, COGNITION_SLICE_VOCABULARY, MAP_CONDITION_KEYS } from '../../../lib/lens-v2/software-intelligence/ConsequenceCompiler'
import { investigate, verifyProjectionDisposition, SECTION_4_RULES, SECTION_5_2_PATTERNS } from '../../../lib/lens-v2/software-intelligence/InvestigationVerifier'
import { resolveNode, resolveConnections, CONDITION_NODES } from '../../../lib/lens-v2/software-intelligence/CognitionOntology'
import { composeBriefing as composeBalancedBriefing } from '../../../lib/lens-v2/balanced'

let _verificationCache = { result: null, timestamp: null, proofData: null }

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
  OPERATOR_DENSE:['evidenceTrace', 'signalStack', 'inferenceProhibition', 'confidenceBoundary', 'resolutionBoundary'],
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

const SEVERITY_GLYPH_COLOR = { CRITICAL: '#ff6b6b', HIGH: '#ff9e4a', ELEVATED: '#ffd700', MODERATE: '#7a8aaa', NOMINAL: '#2a2f40', LOW: '#4a5570' }

function StructuralGlyph({ type, severity, size = 28 }) {
  const c = SEVERITY_GLYPH_COLOR[severity] || '#4a9eff'
  const s = size
  const h = s / 2
  if (type === 'convergence') {
    return (
      <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} className="structural-glyph">
        <circle cx={h} cy={h} r={s*0.11} fill={c} opacity="0.9"/>
        <circle cx={h} cy={h} r={s*0.29} fill="none" stroke={c} strokeWidth="1.5" opacity="0.45"/>
        <circle cx={h} cy={h} r={s*0.43} fill="none" stroke={c} strokeWidth="1" opacity="0.2"/>
        <line x1={s*0.1} y1={s*0.1} x2={s*0.35} y2={s*0.35} stroke={c} strokeWidth="1" opacity="0.5"/>
        <line x1={s*0.9} y1={s*0.1} x2={s*0.65} y2={s*0.35} stroke={c} strokeWidth="1" opacity="0.5"/>
        <line x1={s*0.1} y1={s*0.9} x2={s*0.35} y2={s*0.65} stroke={c} strokeWidth="1" opacity="0.5"/>
        <line x1={s*0.9} y1={s*0.9} x2={s*0.65} y2={s*0.65} stroke={c} strokeWidth="1" opacity="0.5"/>
      </svg>
    )
  }
  if (type === 'spread') {
    return (
      <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} className="structural-glyph">
        <circle cx={s*0.2} cy={h} r={s*0.09} fill={c}/>
        <line x1={s*0.32} y1={h} x2={s*0.88} y2={s*0.18} stroke={c} strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
        <line x1={s*0.32} y1={h} x2={s*0.92} y2={h} stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1={s*0.32} y1={h} x2={s*0.88} y2={s*0.82} stroke={c} strokeWidth="1.5" opacity="0.35" strokeLinecap="round"/>
      </svg>
    )
  }
  if (type === 'hub') {
    return (
      <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} className="structural-glyph">
        <circle cx={h} cy={h} r={s*0.13} fill={c} opacity="0.9"/>
        <line x1={s*0.1} y1={s*0.22} x2={s*0.37} y2={s*0.42} stroke={c} strokeWidth="1.5" opacity="0.55" strokeLinecap="round"/>
        <line x1={s*0.1} y1={h} x2={s*0.37} y2={h} stroke={c} strokeWidth="1.5" opacity="0.7" strokeLinecap="round"/>
        <line x1={s*0.1} y1={s*0.78} x2={s*0.37} y2={s*0.58} stroke={c} strokeWidth="1.5" opacity="0.55" strokeLinecap="round"/>
        <line x1={s*0.9} y1={s*0.36} x2={s*0.63} y2={s*0.46} stroke={c} strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
        <line x1={s*0.9} y1={s*0.64} x2={s*0.63} y2={s*0.54} stroke={c} strokeWidth="1" opacity="0.3" strokeLinecap="round"/>
      </svg>
    )
  }
  if (type === 'fragmented-ring') {
    const r = s * 0.4
    return (
      <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} className="structural-glyph">
        <path d={`M ${h} ${h-r} A ${r} ${r} 0 0 1 ${h+r} ${h}`} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"/>
        <path d={`M ${h+r} ${h} A ${r} ${r} 0 0 1 ${h} ${h+r}`} fill="none" stroke="#1e2330" strokeWidth="2"/>
        <path d={`M ${h} ${h+r} A ${r} ${r} 0 0 1 ${h-r} ${h}`} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <path d={`M ${h-r} ${h} A ${r} ${r} 0 0 1 ${h} ${h-r}`} fill="none" stroke="#1e2330" strokeWidth="2"/>
      </svg>
    )
  }
  if (type === 'gravity') {
    return (
      <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} className="structural-glyph">
        <circle cx={h} cy={h} r={s*0.18} fill={c} opacity="0.8"/>
        <circle cx={s*0.22} cy={s*0.25} r={s*0.06} fill={c} opacity="0.3"/>
        <circle cx={s*0.75} cy={s*0.28} r={s*0.05} fill={c} opacity="0.2"/>
        <circle cx={s*0.25} cy={s*0.72} r={s*0.04} fill={c} opacity="0.2"/>
        <circle cx={s*0.78} cy={s*0.7} r={s*0.05} fill={c} opacity="0.25"/>
      </svg>
    )
  }
  if (type === 'coupling') {
    return (
      <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} className="structural-glyph">
        <circle cx={s*0.28} cy={h} r={s*0.1} fill={c} opacity="0.7"/>
        <circle cx={s*0.72} cy={h} r={s*0.1} fill={c} opacity="0.7"/>
        <line x1={s*0.38} y1={h} x2={s*0.62} y2={h} stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1={h} y1={s*0.2} x2={h} y2={s*0.38} stroke={c} strokeWidth="1" opacity="0.35" strokeLinecap="round"/>
        <line x1={h} y1={s*0.62} x2={h} y2={s*0.8} stroke={c} strokeWidth="1" opacity="0.35" strokeLinecap="round"/>
      </svg>
    )
  }
  return null
}

const PRESSURE_GLYPH_TYPE = { DPSIG: 'convergence', PSIG: 'spread', ISIG: 'hub', RESILIENCE: 'fragmented-ring' }
const DYNAMICS_GLYPH_TYPE = {
  DELIVERY_PRESSURE_CONCENTRATION: 'convergence',
  DEPENDENCY_CHOKE_POINT: 'hub',
  PROPAGATION_ASYMMETRY: 'spread',
  STRUCTURAL_MASS_CONCENTRATION: 'gravity',
  CROSS_DOMAIN_COUPLING_PRESSURE: 'coupling',
  EXECUTION_FRAGILITY: 'fragmented-ring',
  EXECUTION_CONSTRICTION: 'hub',
  STRUCTURAL_BOUNDARY_DIVERGENCE: 'spread',
  COUPLING_INERTIA: 'coupling',
}

function ConvergenceWeb({ slices, postureLabel, postureSeverity, primaryLocus }) {
  if (!slices || slices.length < 2) return null

  const w = 480, h = 148
  const cx = w / 2, cy = 56
  const radius = 33
  const coreColor = SEVERITY_GLYPH_COLOR[postureSeverity] || '#4a9eff'
  const n = slices.length

  const nodes = slices.map((s, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i / n)
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      color: SEVERITY_GLYPH_COLOR[s.severity] || '#4a9eff',
      name: s.executive_name,
      angle,
    }
  })

  const labelNodes = nodes.map(nd => {
    const dx = nd.x - cx
    const dy = nd.y - cy
    const dist = Math.sqrt(dx * dx + dy * dy) || 1
    const lx = nd.x + (dx / dist) * 16
    const ly = nd.y + (dy / dist) * 11
    const anchor = dx < -3 ? 'end' : dx > 3 ? 'start' : 'middle'
    return { lx, ly, anchor, name: nd.name, color: nd.color }
  })

  return (
    <div className="cockpit-convergence-web">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="convergence-core-glow">
            <stop offset="0%" stopColor={coreColor} stopOpacity="0.2" />
            <stop offset="40%" stopColor={coreColor} stopOpacity="0.08" />
            <stop offset="100%" stopColor={coreColor} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="convergence-field-bg">
            <stop offset="0%" stopColor={coreColor} stopOpacity="0.04" />
            <stop offset="60%" stopColor={coreColor} stopOpacity="0.015" />
            <stop offset="100%" stopColor={coreColor} stopOpacity="0" />
          </radialGradient>
        </defs>

        {primaryLocus && (
          <text x={cx} y={cy + 1} fill={coreColor} fontSize="4.5" fontFamily="'Courier New', monospace" textAnchor="middle" dominantBaseline="middle" opacity="0.08" letterSpacing="0.15em">
            {primaryLocus.toUpperCase()}
          </text>
        )}

        <circle cx={cx} cy={cy} r={radius + 14} fill="url(#convergence-field-bg)" />
        <circle cx={cx} cy={cy} r={radius + 7} fill="url(#convergence-core-glow)" />

        {nodes.map((nd, i) => {
          const next = nodes[(i + 1) % n]
          return <line key={`web-${i}`} x1={nd.x} y1={nd.y} x2={next.x} y2={next.y} stroke="#2a2f40" strokeWidth="0.7" opacity="0.45" />
        })}

        {nodes.map((nd, i) => (
          <line key={`vec-${i}`} x1={nd.x} y1={nd.y} x2={cx} y2={cy} stroke={nd.color} strokeWidth="1" opacity="0.3" strokeDasharray="2.5 1.5" />
        ))}

        <circle cx={cx} cy={cy} r={14} fill={coreColor} opacity="0.04" />
        <circle cx={cx} cy={cy} r={10} fill={coreColor} opacity="0.08" />
        <circle cx={cx} cy={cy} r={6.5} fill={coreColor} opacity="0.18" />
        <circle cx={cx} cy={cy} r={3.5} fill={coreColor} opacity="0.7" />
        <circle cx={cx} cy={cy} r={16} fill="none" stroke={coreColor} strokeWidth="0.4" opacity="0.12" />

        {nodes.map((nd, i) => (
          <g key={`node-${i}`}>
            <circle cx={nd.x} cy={nd.y} r={3.2} fill={nd.color} opacity="0.75" />
            <circle cx={nd.x} cy={nd.y} r={5.5} fill="none" stroke={nd.color} strokeWidth="0.5" opacity="0.22" />
          </g>
        ))}

        {labelNodes.map((ln, i) => (
          <text key={`lbl-${i}`} x={ln.lx} y={ln.ly} fill={ln.color} fontSize="7.5" fontFamily="'Courier New', monospace" fontWeight="600" textAnchor={ln.anchor} dominantBaseline="middle" opacity="0.8">
            {ln.name}
          </text>
        ))}

        <text x={cx} y={h - 22} fill={coreColor} fontSize="8" fontWeight="600" fontFamily="'Courier New', monospace" textAnchor="middle" opacity="0.85" letterSpacing="0.02em">
          {postureLabel}
        </text>
        {primaryLocus && (
          <text x={cx} y={h - 10} fill="#7a8aaa" fontSize="7" fontFamily="'Courier New', monospace" textAnchor="middle" opacity="0.6">
            {primaryLocus}
          </text>
        )}
      </svg>
    </div>
  )
}

const INTERP_MODE_FRAMING = {
  EXECUTIVE_BALANCED:  { label: 'EXECUTIVE INTERPRETATION', tone: 'posture',    assessmentLabel: 'Assessment',          whyLabel: 'Why this matters',         structuralLabel: 'Structural context' },
  EXECUTIVE_DENSE:     { label: 'STRUCTURAL INTERPRETATION', tone: 'structural', assessmentLabel: 'Structural reading',  whyLabel: 'Cause and propagation',    structuralLabel: 'Structural context' },
  OPERATOR_DENSE: { label: 'FORENSIC INTERPRETATION',   tone: 'forensic',   assessmentLabel: 'Evidence reading',    whyLabel: 'What the evidence shows',  structuralLabel: 'Structural lineage' },
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
      <div className="rep-evstate-label"><TermHint term="EVIDENCE STATE">EVIDENCE STATE</TermHint></div>
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
  operator: (fullReport) => {
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
      boundary: 'Requires OPERATOR mode — full forensic depth.' },
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
      boundary: 'Requires OPERATOR mode — full forensic depth.' },
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

function SupportRail({ adapted, scope, boardroomMode, reportPackArtifacts, fullReport, qualifierClass, activeZoneKey, densityClass, activeQueryKey, onQuerySelect, exploredQueries, emergenceState, escalationAvailable, piRuntimeActive, onEscalate, onDeescalate, expansions, activeExpansionIndex, onExpansionSelect, interrogationTrail, onTrailExport, onAssessmentExport, selectedNarrativeArc, resolvedCognitionContract, cognitionQueryIndex, onCognitionQuerySelect, activeConditions, resolvedCondition, swIntelActive, visibilityLayerCompleteness }) {
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
        <div className="support-label"><TermHint term="EVIDENCE STATE">EVIDENCE STATE</TermHint></div>
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

      {visibilityLayerCompleteness && (
        <div className="support-block support-block--visibility">
          <div className="support-label">VISIBILITY COMPLETENESS</div>
          <div className="support-visibility-scope" data-scope={visibilityLayerCompleteness.verdict_scope}>
            {visibilityLayerCompleteness.verdict_scope.replace(/_/g, ' ')}
          </div>
          <div className="support-visibility-profile">{visibilityLayerCompleteness.architecture_profile}</div>
          <div className="support-visibility-bar">
            <div className="support-visibility-bar-fill" style={{ width: `${visibilityLayerCompleteness.completeness}%` }} data-complete={visibilityLayerCompleteness.completeness === 100} />
          </div>
          <div className="support-visibility-ratio">{visibilityLayerCompleteness.measured_count}/{visibilityLayerCompleteness.required_count} layers measured</div>
          {visibilityLayerCompleteness.layers_missing.length > 0 && (
            <div className="support-visibility-missing">
              {visibilityLayerCompleteness.layers_missing.map(l => (
                <span key={l.id} className="support-visibility-missing-layer">{l.name}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {!boardroomMode && swIntelActive && resolvedCondition ? (
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
      ) : !boardroomMode && swIntelActive && activeConditions && activeConditions.length > 0 ? (
        <div className="support-block support-block--conditions">
          <div className="support-label">ACTIVE CONDITIONS</div>
          {activeConditions.slice(0, 4).map(c => (
            <div key={c.condition_id} className="support-condition-item" data-severity={c.severity}>
              <span className="support-condition-title">{c.operator_cognition_title}</span>
              <span className="support-condition-severity">{c.severity}</span>
              {c.shared_topology_targets?.domains_display?.[0] && (
                <span className="domain-chip" data-severity={c.severity} title={c.shared_topology_targets.domains?.[0]}>
                  {c.shared_topology_targets.domains_display[0]}
                </span>
              )}
            </div>
          ))}
          {activeConditions.length > 4 && (
            <div className="support-condition-overflow">+{activeConditions.length - 4} more</div>
          )}
        </div>
      ) : null}

      {densityClass === 'EXECUTIVE_BALANCED' && emergenceState && (() => {
        const emerged = Object.values(emergenceState).filter(n => n && n.narrative !== null)
        return emerged.length > 0 ? (
          <div className="support-block support-block--emergence support-block--balanced-compressed">
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
        ) : null
      })()}

      {boardroomMode && swIntelActive ? (
        <div className="support-block support-block--executive-posture">
          <div className="support-label">EXECUTIVE POSTURE</div>
          <div className="support-posture-kv">
            <div className="support-posture-row">
              <span className="support-posture-key">Operational concentration</span>
              <span className="support-posture-val">{activeConditions && activeConditions.length > 0 && activeConditions[0].shared_topology_targets ? activeConditions[0].shared_topology_targets.domains_display?.[0] || 'System-wide' : 'System-wide'}</span>
            </div>
            <div className="support-posture-row">
              <span className="support-posture-key">Primary software dynamic</span>
              <span className="support-posture-val">{activeConditions && activeConditions.length > 0 ? (activeConditions.find(c => c.severity === 'CRITICAL' || c.severity === 'HIGH') || activeConditions[0]).condition_type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : '—'}</span>
            </div>
            <div className="support-posture-row">
              <span className="support-posture-key">Propagation risk</span>
              <span className="support-posture-val">{activeConditions && activeConditions.some(c => c.condition_type === 'PROPAGATION_ASYMMETRY') ? 'Asymmetric downstream spread' : 'Within normal parameters'}</span>
            </div>
            <div className="support-posture-row">
              <span className="support-posture-key">Confidence</span>
              <span className="support-posture-val" data-confidence={resolvedCondition ? resolvedCondition.governance_boundary : 'ADVISORY_BOUND'}>{resolvedCondition && resolvedCondition.governance_boundary === 'GOVERNED' ? 'Governed' : 'Advisory-bound'}</span>
            </div>
            <div className="support-posture-row support-posture-row--implication">
              <span className="support-posture-key">Operational implication</span>
              <span className="support-posture-val">{activeConditions && activeConditions.some(c => c.condition_type === 'DELIVERY_PRESSURE_CONCENTRATION') ? 'Delivery coordination structurally constrained' : 'No immediate structural constraint'}</span>
            </div>
          </div>
          <div className="support-label" style={{ marginTop: 12 }}>DESCENT PATHS</div>
          <div className="support-sw-intel-descent">
            <div className="support-sw-intel-descent-item"><span className="support-sw-intel-descent-target">DENSE</span><span className="support-sw-intel-descent-purpose">Topology cognition</span></div>
            <div className="support-sw-intel-descent-item"><span className="support-sw-intel-descent-target">OPERATOR</span><span className="support-sw-intel-descent-purpose">Evidence inspection</span></div>
          </div>
        </div>
      ) : boardroomMode && paths.length > 0 ? (
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
      ) : null}

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
        <div className="support-block support-block--assessment">
          <div className="support-label">STRUCTURAL ASSESSMENT</div>
          <div className="support-assessment-sub">Governed deliverable package — verdict, topology, evidence record</div>
          <button
            className="assessment-export-trigger"
            onClick={onAssessmentExport}
            type="button"
          >
            EXPORT STRUCTURAL ASSESSMENT
          </button>
        </div>
      )}

      {fullReport && (
        <div className="support-block support-block--trail">
          <div className="support-label"><TermHint term="EVIDENCE RECORD">EVIDENCE RECORD</TermHint></div>
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

      {densityClass !== 'OPERATOR_DENSE' && (
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
      )}
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
      const isDerived = activated.length > 0 && activated[0].derived_from
      const isCanonical = activated.length > 0 && !activated[0].derived_from

      let signalDetail
      if (isDerived) {
        const SEV = { CRITICAL: 0, HIGH: 1, ELEVATED: 2, MODERATE: 3 }
        const groups = new Map()
        for (const s of activated) {
          const key = s.source_condition_type || s.signal_name || s.signal_id
          if (!groups.has(key)) groups.set(key, { key, title: s.signal_name || key, severity: s.severity, count: 0, domains: [], family: s.signal_family })
          const g = groups.get(key)
          g.count++
          if ((SEV[s.severity] ?? 4) < (SEV[g.severity] ?? 4)) g.severity = s.severity
          for (const d of (s.affected_domains || [])) { if (!g.domains.includes(d)) g.domains.push(d) }
        }
        const sorted = [...groups.values()].sort((a, b) => (SEV[a.severity] ?? 4) - (SEV[b.severity] ?? 4))
        const MAX_VISIBLE = 5
        const visible = sorted.slice(0, MAX_VISIBLE)
        const overflow = sorted.length - MAX_VISIBLE
        signalDetail = visible.map(g => ({
          id: g.key,
          severity: g.severity,
          interpretation: g.domains.length > 0
            ? `${g.count > 1 ? g.count + ' derived signals · ' : ''}${g.domains.slice(0, 3).join(', ')}${g.domains.length > 3 ? ' +' + (g.domains.length - 3) : ''}`
            : g.count > 1 ? `${g.count} derived signals` : (g.title || ''),
          concentration: g.domains[0] || null,
        }))
        if (overflow > 0) signalDetail.push({ id: '_overflow', severity: 'NOMINAL', interpretation: `+${overflow} additional derived signal group${overflow !== 1 ? 's' : ''}`, concentration: null })
      } else {
        signalDetail = activated.map(s => ({ id: s.signal_id, severity: s.severity, interpretation: s.interpretation, concentration: s.concentration }))
      }

      return {
        heading: isDerived ? 'What structural and runtime intelligence reveals' : 'What the signal landscape reveals',
        body: activated.length > 0
          ? isDerived
            ? `${critical.length} critical/high structural condition${critical.length !== 1 ? 's' : ''} and ${elevated.length} runtime-derived finding${elevated.length !== 1 ? 's' : ''} across the structural topology. Intelligence derived from structural enrichment and runtime connectivity evidence.`
            : `${activated.length} signal${activated.length !== 1 ? 's' : ''} elevated above nominal threshold${critical.length > 0 ? ` — ${critical.length} at critical/high severity` : ''}. ${elevated.length > 0 ? `${elevated.length} at elevated tier.` : ''}`
          : sigs.length > 0 ? `All ${sigs.length} structural indicators are within nominal parameters.` : 'No structural intelligence available for this specimen.',
        structuralNote: sigs.length > 0
          ? isDerived
            ? `Structural conditions: ${critical.length + elevated.length} · Runtime signals: ${sigs.filter(s => s.signal_family === 'RSIG').length} · Total derived: ${activated.length}`
            : `Total signals: ${sigs.length} · Activated: ${activated.length} · Nominal: ${sigs.length - activated.length}`
          : null,
        signalDetail,
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
  topologySurface: {
    sectionLabel: 'TOPOLOGY INTERPRETATION',
    code: 'TS',
    derive: (fullReport) => {
      const ts = (fullReport && fullReport.topology_summary) || {}
      const se = (fullReport && fullReport.structural_enrichment) || {}
      const centrality = se.centrality || {}
      const spines = centrality.top_structural_spines || []
      const roles = centrality.role_summary || {}
      const clusterCount = ts.structural_cluster_count || 0
      const nodeCount = ts.structural_node_count || 0
      const edgeCount = ts.structural_edge_count || 0
      return {
        heading: 'What the structural topology reveals',
        body: nodeCount > 0
          ? `${clusterCount} structural clusters across ${nodeCount} files with ${edgeCount} edges. ${spines.length > 0 ? `${spines.length} structural spines carry authority — files with highest import or inheritance centrality.` : ''} ${Object.keys(roles).length > 0 ? `Structural role classification identifies ${Object.values(roles).reduce((a, v) => a + (v || 0), 0)} classified nodes.` : ''}`
          : 'Topology surface requires structural evidence.',
        structuralNote: spines.length > 0
          ? `Top spine: ${spines[0].file || spines[0].path || '?'} (centrality ${spines[0].centrality || spines[0].score || '?'})`
          : null,
        signalDetail: spines.slice(0, 4).map(s => ({
          id: s.file || s.path || 'spine',
          severity: 'ELEVATED',
          interpretation: `${(s.file || s.path || '').split('/').slice(-2).join('/')} — centrality ${s.centrality || s.score || '?'}${s.role ? ' · ' + s.role : ''}`,
          concentration: null,
        })),
      }
    },
  },
  behavioralClassView: {
    sectionLabel: 'BEHAVIORAL CLASS INTERPRETATION',
    code: 'BC',
    derive: (fullReport) => {
      const synResult = fullReport && fullReport._synthesisResult
      if (!synResult) return { heading: 'Behavioral class view', body: 'Conditions not yet synthesized.', structuralNote: null, signalDetail: [] }
      const conditions = (synResult.conditions || []).filter(c => c.severity !== 'NOMINAL')
      const classes = { 'Flow & Propagation': 0, 'Concentration & Saturation': 0, 'Fragility & Resilience': 0, 'Drift & Instability': 0 }
      const CLASS_MAP = {
        DELIVERY_PRESSURE_CONCENTRATION: 'Concentration & Saturation', DEPENDENCY_CHOKE_POINT: 'Flow & Propagation',
        PROPAGATION_ASYMMETRY: 'Flow & Propagation', STRUCTURAL_MASS_CONCENTRATION: 'Concentration & Saturation',
        CROSS_DOMAIN_COUPLING_PRESSURE: 'Flow & Propagation', EXECUTION_FRAGILITY: 'Fragility & Resilience',
        EXECUTION_CONSTRICTION: 'Concentration & Saturation', STRUCTURAL_BOUNDARY_DIVERGENCE: 'Drift & Instability',
        COUPLING_INERTIA: 'Drift & Instability', COMPOUND_CONVERGENCE: 'Concentration & Saturation',
        GOVERNANCE_COVERAGE_STATUS: 'Drift & Instability',
        EVENT_CONCENTRATION: 'Concentration & Saturation', RUNTIME_DEPENDENCY_CHOKE_POINT: 'Flow & Propagation',
        BROKER_DEPENDENCY: 'Flow & Propagation', TOPIC_FANOUT_PRESSURE: 'Concentration & Saturation',
        ASYNC_PROPAGATION_ASYMMETRY: 'Flow & Propagation', EDGE_CLOUD_PROPAGATION_RISK: 'Flow & Propagation',
        RUNTIME_OBSERVABILITY_GAP: 'Drift & Instability',
      }
      for (const c of conditions) { const cls = CLASS_MAP[c.condition_type]; if (cls) classes[cls]++ }
      const sorted = Object.entries(classes).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
      return {
        heading: 'What the behavioral pattern distribution reveals',
        body: sorted.length > 0
          ? `${conditions.length} conditions organize into ${sorted.length} behavioral class${sorted.length !== 1 ? 'es' : ''}. Dominant pattern: ${sorted[0][0]} (${sorted[0][1]} condition${sorted[0][1] !== 1 ? 's' : ''}). ${sorted.length > 1 ? `Secondary: ${sorted[1][0]} (${sorted[1][1]}).` : ''}`
          : 'No active conditions to classify.',
        structuralNote: `${sorted.length} of 4 behavioral classes active`,
        signalDetail: sorted.map(([cls, count]) => ({
          id: cls,
          severity: count >= 5 ? 'HIGH' : count >= 3 ? 'ELEVATED' : 'MODERATE',
          interpretation: `${cls} — ${count} condition${count !== 1 ? 's' : ''}`,
          concentration: null,
        })),
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
  STRUCTURAL_FRAGILITY:    { code: 'SF', label: 'Structural Fragility',       icon: '⚡' },
  BOUNDARY_ALIGNMENT:      { code: 'BA', label: 'Boundary Alignment',         icon: '⊿' },
  STRUCTURAL_COUPLING:     { code: 'SC', label: 'Structural Coupling',        icon: '⊛' },
  REINFORCEMENT_FLOWS:     { code: 'RF', label: 'Reinforcement Flows',       icon: '⇄' },
  CONVERGENCE_PATTERNS:    { code: 'CP', label: 'Convergence Patterns',      icon: '⊕' },
  ABSENCE_PROFILE:         { code: 'AP', label: 'Absence Profile',           icon: '◇' },
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

  // ── STRUCTURAL FRAGILITY ──────────────────────────────────────────
  STRUCTURAL_FRAGILITY: {
    meta: { code: 'SF', label: 'Structural Fragility', icon: '⚡' },
    resolve: (fullReport, surface) => {
      const se = fullReport.structural_enrichment || {}
      const fs = se.fragility_surface || {}
      const hotspots = fs.fragility_hotspots || []
      const cohesion = fs.module_cohesion || []
      const absorptive = fs.absorptive_modules || []
      const registry = fullReport.semantic_domain_registry || []
      const c = surface.constituents || {}
      const lowCohesion = cohesion.filter(m => (m.cohesion || m.cohesion_score || 1) < 0.4)

      return {
        interpretation: {
          heading: 'Structural Fragility — Active Cognition State',
          operationalMeaning: hotspots.length > 0
            ? `${hotspots.length} fragility hotspot${hotspots.length !== 1 ? 's' : ''} detected — files with high coupling and low cohesion that concentrate change risk. Peak fragility: ${c.peak_fragility || 0}%. ${lowCohesion.length > 0 ? `${lowCohesion.length} module${lowCohesion.length !== 1 ? 's' : ''} have low internal cohesion — changes inside these modules propagate unpredictably.` : ''}${absorptive.length > 0 ? ` ${absorptive.length} absorptive module${absorptive.length !== 1 ? 's' : ''} absorb structural load from surrounding components.` : ''}`
            : 'Fragility surface available but no hotspots detected at current threshold.',
          structuralEvidence: [
            ...(c.top_hotspots || []).slice(0, 4).map(h => ({
              label: h.file,
              value: `${h.score}% fragility${h.coupling ? ` · coupling ${h.coupling}` : ''}${h.cohesion ? ` · cohesion ${h.cohesion}` : ''}`,
              severity: h.score > 70 ? 'critical' : h.score > 50 ? 'elevated' : 'nominal',
            })),
          ],
          suppressionMask: ['OPERATIONAL_TOPOLOGY'],
        },

        implications: {
          orchestration: [
            { action: 'Review hotspot file changes with extended scope', priority: 'HIGH' },
            ...(lowCohesion.length > 0 ? [{ action: `${lowCohesion.length} low-cohesion module${lowCohesion.length !== 1 ? 's' : ''} — changes propagate beyond apparent scope`, priority: 'HIGH' }] : []),
            ...(surface.severity === 'HIGH' ? [{ action: 'Structural fragility at HIGH — deployment risk elevated for hotspot regions', priority: 'CRITICAL' }] : []),
          ],
          qualification: {
            effect: hotspots.length >= 5
              ? 'High hotspot count compounds structural risk — qualification posture affected'
              : 'Fragility present but within manageable bounds for qualification',
          },
        },

        guidedCognition: [
          {
            question: `Which files are structurally brittle? (${hotspots.length} hotspot${hotspots.length !== 1 ? 's' : ''})`,
            tone: 'forensic', archetype: 'TRACE', depth: 'standard',
            boundary: 'From structural_enrichment.fragility_surface — deterministic.',
            answer_derive: (fr) => {
              const frag = ((fr.structural_enrichment || {}).fragility_surface || {}).fragility_hotspots || []
              return {
                summary: frag.length > 0
                  ? `${frag.length} file${frag.length !== 1 ? 's' : ''} exceed fragility threshold. These files combine high coupling with low cohesion — the structural signature of change amplification.`
                  : 'No fragility hotspots at current threshold.',
                evidence: frag.slice(0, 6).map(h => {
                  const score = h.fragility_score || h.score || 0
                  return {
                    label: (h.path || h.file || '').split('/').slice(-2).join('/'),
                    value: `fragility ${formatLensMetric(score, 'score')}${h.coupling ? ' · coupling ' + formatLensMetric(h.coupling, 'score') : ''}`,
                    severity: score > 70 ? 'critical' : score > 40 ? 'elevated' : 'nominal',
                  }
                }),
                structuralContext: 'Fragility = f(coupling, cohesion). High coupling + low cohesion = structural joint that amplifies change impact.',
              }
            },
          },
          {
            question: 'Does fragility compound with other structural pressures?',
            tone: 'architectural', archetype: 'INTERPRET', depth: 'standard',
            boundary: 'From ontology class intersection — deterministic.',
            answer_derive: (fr) => {
              const sigs = (fr.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
              const fragSigs = sigs.filter(s => s.signal_name && (s.signal_name.includes('Fragility') || s.signal_name.includes('Cohesion')))
              const otherHighSigs = sigs.filter(s => s.severity === 'HIGH' && !fragSigs.includes(s))
              return {
                summary: otherHighSigs.length > 0
                  ? `Fragility compounds with ${otherHighSigs.length} other elevated signal${otherHighSigs.length !== 1 ? 's' : ''} — structural risk is compounded, not isolated.`
                  : 'Fragility is the dominant structural dynamic — not currently compounding with other elevated pressures.',
                evidence: otherHighSigs.slice(0, 3).map(s => ({
                  label: s.signal_name || s.signal_id,
                  value: s.severity,
                  severity: 'elevated',
                })),
                structuralContext: 'Compound risk assessed through ontology class intersection (Class C: Fragility & Resilience).',
              }
            },
          },
          {
            question: 'What is the blast radius of changes to fragile files?',
            tone: 'alarming', archetype: 'ESCALATION', depth: 'deep',
            boundary: 'From fragility hotspot domain mapping + coupling — deterministic.',
            answer_derive: (fr) => {
              const frag = ((fr.structural_enrichment || {}).fragility_surface || {}).fragility_hotspots || []
              const reg = fr.semantic_domain_registry || []
              const affectedDomains = deriveAffectedDomainsFromPaths(frag.map(h => h.path || h.file || ''), reg)
              return {
                summary: affectedDomains.size > 0
                  ? `Fragility hotspots span ${affectedDomains.size} domain${affectedDomains.size !== 1 ? 's' : ''}. Changes to these ${frag.length} file${frag.length !== 1 ? 's' : ''} propagate unpredictably due to high coupling — blast radius extends beyond the file's apparent scope.`
                  : `${frag.length} fragility hotspot${frag.length !== 1 ? 's' : ''} detected but domain mapping is unavailable at current resolution.`,
                evidence: [...affectedDomains.entries()].sort((a, b) => b[1] - a[1]).map(([d, count]) => ({
                  label: d,
                  value: `${count} fragile file${count !== 1 ? 's' : ''}`,
                  severity: count > 10 ? 'critical' : 'elevated',
                })),
                structuralContext: 'Blast radius bounded by coupling edges from fragile files. High coupling means more downstream consumers of changes.',
              }
            },
          },
        ],

        topologyFocus: (() => {
          const affected = new Set(surface.affected_domains || [])
          return {
            highlightDomains: [...affected],
            accentDomains: [],
            dimDomains: registry.filter(d => !affected.has(d.business_label || d.domain_name) && !affected.has(d.domain_name)).map(d => d.domain_id),
          }
        })(),

        actions: [
          { action: 'Review fragility hotspot files before merge', priority: 'HIGH', type: 'investigation' },
          { action: 'Assess low-cohesion modules for refactoring opportunity', priority: 'MEDIUM', type: 'architectural' },
          { action: 'Monitor fragility trend across runs', priority: 'LOW', type: 'assessment' },
        ],

        gapsAndProgression: {
          evidenceGaps: [
            ...(fs.analysis_mode === 'HEURISTIC' ? [{ gap: 'Fragility analysis in heuristic mode', impact: 'Scores approximate — full AST analysis would refine' }] : []),
            ...(lowCohesion.length === 0 && hotspots.length > 0 ? [{ gap: 'Cohesion data unavailable for some modules', impact: 'Fragility assessment based on coupling only' }] : []),
          ],
          progressionPath: [
            { step: 'Improve cohesion of low-cohesion modules', effect: 'Reduce fragility scores at structural joints' },
            { step: 'Reduce coupling of high-coupling hotspots', effect: 'Lower blast radius of changes' },
            { step: 'Stabilize absorptive modules', effect: 'Reduce structural load concentration' },
          ],
        },
      }
    },
  },

  // ── BOUNDARY ALIGNMENT ────────────────────────────────────────────
  BOUNDARY_ALIGNMENT: {
    meta: { code: 'BA', label: 'Boundary Alignment', icon: '⊿' },
    resolve: (fullReport, surface) => {
      const se = fullReport.structural_enrichment || {}
      const bd = se.boundary_divergence || {}
      const divergent = bd.divergent_modules || []
      const orphaned = bd.orphaned_modules || []
      const systemIndex = bd.system_divergence_index || 0
      const registry = fullReport.semantic_domain_registry || []
      const c = surface.constituents || {}

      return {
        interpretation: {
          heading: 'Boundary Alignment — Active Cognition State',
          operationalMeaning: divergent.length > 0
            ? `${divergent.length} module${divergent.length !== 1 ? 's' : ''} show boundary divergence — their declared organizational boundaries do not match actual dependency patterns. System divergence index: ${c.system_divergence_index || 0}%.${orphaned.length > 0 ? ` ${orphaned.length} orphaned module${orphaned.length !== 1 ? 's' : ''} have no parent boundary claiming them.` : ''} This creates governance blind spots — changes in divergent modules affect domains they are not organizationally assigned to.`
            : 'Boundary divergence surface available but no divergent modules at current threshold.',
          structuralEvidence: [
            ...(c.top_divergent || []).slice(0, 4).map(d => ({
              label: d.module,
              value: `${d.cross_boundary_ratio}% cross-boundary${d.edge_count > 0 ? ` · ${d.edge_count} edge${d.edge_count !== 1 ? 's' : ''}` : ''}`,
              severity: d.cross_boundary_ratio > 60 ? 'critical' : d.cross_boundary_ratio > 30 ? 'elevated' : 'nominal',
            })),
            ...(orphaned.length > 0 ? [{ label: 'Orphaned modules', value: `${orphaned.length} without boundary`, severity: 'elevated' }] : []),
          ],
          suppressionMask: ['OPERATIONAL_TOPOLOGY'],
        },

        implications: {
          orchestration: [
            { action: 'Changes to divergent modules may affect unexpected domains', priority: 'HIGH' },
            ...(orphaned.length > 0 ? [{ action: `${orphaned.length} orphaned module${orphaned.length !== 1 ? 's' : ''} — governance assignment needed`, priority: 'MEDIUM' }] : []),
            ...(systemIndex > 0.4 ? [{ action: 'System divergence index exceeds 40% — organizational boundaries need structural review', priority: 'HIGH' }] : []),
          ],
          qualification: {
            effect: systemIndex > 0.3
              ? 'High boundary divergence indicates governance structure does not reflect structural reality — qualification confidence affected'
              : 'Boundary divergence within manageable range for qualification',
          },
        },

        guidedCognition: [
          {
            question: `Which modules cross their declared boundaries? (${divergent.length})`,
            tone: 'forensic', archetype: 'TRACE', depth: 'standard',
            boundary: 'From structural_enrichment.boundary_divergence — deterministic.',
            answer_derive: (fr) => {
              const div = ((fr.structural_enrichment || {}).boundary_divergence || {}).divergent_modules || []
              return {
                summary: div.length > 0
                  ? `${div.length} module${div.length !== 1 ? 's' : ''} have dependencies crossing their declared boundaries. The cross-boundary ratio measures how much of a module's dependency traffic leaves its organizational boundary.`
                  : 'No boundary divergence detected.',
                evidence: div.slice(0, 6).map(d => ({
                  label: (d.module || d.name || '').split('/').slice(-2).join('/'),
                  value: `${Math.round((d.cross_boundary_ratio || d.ratio || 0) * 100)}% cross-boundary`,
                  severity: (d.cross_boundary_ratio || d.ratio || 0) > 0.5 ? 'critical' : 'elevated',
                })),
                structuralContext: 'Boundary divergence = declared module boundary vs actual import/dependency graph. High cross-boundary ratio = organizational fiction.',
              }
            },
          },
          {
            question: 'Where does boundary divergence create governance gaps?',
            tone: 'architectural', archetype: 'INTERPRET', depth: 'standard',
            boundary: 'From divergence → GOV_GAP consequence chain — deterministic.',
            answer_derive: (fr) => {
              const div = ((fr.structural_enrichment || {}).boundary_divergence || {}).divergent_modules || []
              const reg = fr.semantic_domain_registry || []
              const affectedDomains = new Set()
              for (const dm of div) {
                const match = reg.find(d => (dm.module || '').includes(d.domain_name || ''))
                if (match) affectedDomains.add(match.business_label || match.domain_name)
              }
              return {
                summary: `Boundary divergence affects ${affectedDomains.size} domain${affectedDomains.size !== 1 ? 's' : ''}. When module boundaries don't match dependency structure, change reviews miss cross-domain impact — the governance gap.`,
                evidence: [...affectedDomains].map(d => ({
                  label: d,
                  value: 'contains divergent modules',
                  severity: 'elevated',
                })),
                structuralContext: 'STRUCTURAL_BOUNDARY_DIVERGENCE → GOV_GAP consequence in ontology. Governance gaps are structural, not procedural.',
              }
            },
          },
          {
            question: 'Are orphaned modules creating structural blind spots?',
            tone: 'alarming', archetype: 'ESCALATION', depth: 'deep',
            boundary: 'From boundary_divergence.orphaned_modules — deterministic.',
            answer_derive: (fr) => {
              const orph = ((fr.structural_enrichment || {}).boundary_divergence || {}).orphaned_modules || []
              return {
                summary: orph.length > 0
                  ? `${orph.length} module${orph.length !== 1 ? 's' : ''} have no organizational boundary claiming them. These are structural blind spots — no team owns their governance, no review process covers their changes.`
                  : 'No orphaned modules — all modules have organizational boundary assignment.',
                evidence: orph.slice(0, 4).map(m => ({
                  label: typeof m === 'string' ? m.split('/').slice(-2).join('/') : String(m),
                  value: 'orphaned — no boundary',
                  severity: 'critical',
                })),
                structuralContext: 'Orphaned modules are governance-invisible. Changes to them affect the system but no organizational process catches the impact.',
              }
            },
          },
        ],

        topologyFocus: (() => {
          const affected = new Set(surface.affected_domains || [])
          return {
            highlightDomains: [...affected],
            accentDomains: [],
            dimDomains: registry.filter(d => !affected.has(d.business_label || d.domain_name) && !affected.has(d.domain_name)).map(d => d.domain_id),
          }
        })(),

        actions: [
          { action: 'Review divergent module boundaries against dependency graph', priority: 'HIGH', type: 'architectural' },
          { action: 'Assign orphaned modules to organizational boundaries', priority: 'MEDIUM', type: 'assessment' },
          { action: 'Reduce cross-boundary dependency ratio in top divergent modules', priority: 'LOW', type: 'architectural' },
        ],

        gapsAndProgression: {
          evidenceGaps: [
            ...(orphaned.length > 0 ? [{ gap: `${orphaned.length} orphaned module${orphaned.length !== 1 ? 's' : ''}`, impact: 'Governance blind spots — boundary assignment needed' }] : []),
          ],
          progressionPath: [
            { step: 'Realign module boundaries to match dependency patterns', effect: 'Reduce system divergence index' },
            { step: 'Assign orphaned modules', effect: 'Eliminate governance blind spots' },
            { step: 'Reduce cross-boundary coupling', effect: 'Make organizational boundaries structurally meaningful' },
          ],
        },
      }
    },
  },

  // ── STRUCTURAL COUPLING ───────────────────────────────────────────
  STRUCTURAL_COUPLING: {
    meta: { code: 'SC', label: 'Structural Coupling', icon: '⊛' },
    resolve: (fullReport, surface) => {
      const se = fullReport.structural_enrichment || {}
      const ci = se.coupling_inertia || {}
      const clusters = ci.inertia_clusters || []
      const biPairs = ci.bidirectional_pair_count || 0
      const systemIndex = ci.system_coupling_index || 0
      const registry = fullReport.semantic_domain_registry || []
      const c = surface.constituents || {}

      return {
        interpretation: {
          heading: 'Structural Coupling — Active Cognition State',
          operationalMeaning: clusters.length > 0
            ? `${clusters.length} coupling cluster${clusters.length !== 1 ? 's' : ''} binding ${c.total_modules_in_clusters || 0} module${(c.total_modules_in_clusters || 0) !== 1 ? 's' : ''} into fused change units. ${biPairs} bidirectional dependency pair${biPairs !== 1 ? 's' : ''} — modules that import each other cannot evolve independently. System coupling index: ${c.system_coupling_index || 0}%. Changes to any module in a cluster force coordinated release of all cluster members.`
            : 'Coupling inertia surface available but no clusters at current threshold.',
          structuralEvidence: [
            ...(c.clusters || []).slice(0, 3).map((cl, i) => ({
              label: `Cluster ${i + 1} (${cl.size} modules)`,
              value: cl.modules.join(', '),
              severity: cl.size >= 4 ? 'critical' : 'elevated',
            })),
            ...(biPairs > 0 ? [{ label: 'Bidirectional pairs', value: `${biPairs} mutual dependencies`, severity: biPairs >= 3 ? 'critical' : 'elevated' }] : []),
          ],
          suppressionMask: ['OPERATIONAL_TOPOLOGY'],
        },

        implications: {
          orchestration: [
            { action: 'Changes to cluster members require coordinated release', priority: 'HIGH' },
            ...(biPairs > 0 ? [{ action: `${biPairs} bidirectional pair${biPairs !== 1 ? 's' : ''} — breaking circular dependencies reduces cluster size`, priority: 'MEDIUM' }] : []),
            ...(systemIndex > 0.3 ? [{ action: 'System coupling index exceeds 30% — architectural rigidity limits independent evolution', priority: 'HIGH' }] : []),
          ],
          qualification: {
            effect: clusters.length >= 3
              ? 'Multiple coupling clusters indicate systemic rigidity — qualification posture reflects constrained evolvability'
              : 'Coupling present but manageable for qualification',
          },
        },

        guidedCognition: [
          {
            question: `What modules are fused into change units? (${clusters.length} cluster${clusters.length !== 1 ? 's' : ''})`,
            tone: 'forensic', archetype: 'TRACE', depth: 'standard',
            boundary: 'From structural_enrichment.coupling_inertia — deterministic.',
            answer_derive: (fr) => {
              const cls = ((fr.structural_enrichment || {}).coupling_inertia || {}).inertia_clusters || []
              const totalModules = cls.reduce((sum, cl) => sum + (cl.modules || cl.members || []).length, 0)
              return {
                summary: cls.length > 0
                  ? `${cls.length} cluster${cls.length !== 1 ? 's' : ''} fuse ${totalModules} module${totalModules !== 1 ? 's' : ''} into coordinated change units. Modules within a cluster share bidirectional dependencies — changing one requires testing all.`
                  : 'No coupling clusters at current threshold.',
                evidence: cls.slice(0, 4).map((cl, i) => ({
                  label: `Cluster ${i + 1}`,
                  value: `${(cl.modules || cl.members || []).length} modules: ${(cl.modules || cl.members || []).slice(0, 3).map(m => typeof m === 'string' ? m.split('/').slice(-1)[0] : '').join(', ')}${(cl.modules || cl.members || []).length > 3 ? '...' : ''}`,
                  severity: (cl.modules || cl.members || []).length >= 4 ? 'critical' : 'elevated',
                })),
                structuralContext: 'Clusters detected through bidirectional dependency analysis — mutual import relationships that prevent independent module evolution.',
              }
            },
          },
          {
            question: `Where are the ${biPairs} bidirectional dependencies?`,
            tone: 'architectural', archetype: 'TRACE', depth: 'standard',
            boundary: 'From coupling_inertia.bidirectional_pair_count — deterministic.',
            answer_derive: (fr) => {
              const cplg = (fr.structural_enrichment || {}).coupling_inertia || {}
              const pairs = cplg.bidirectional_pairs || []
              const pairCount = cplg.bidirectional_pair_count || 0
              return {
                summary: pairCount > 0
                  ? `${pairCount} bidirectional dependency pair${pairCount !== 1 ? 's' : ''} create mutual import relationships. These are the structural anchors of coupling clusters — breaking them reduces cluster size and enables independent evolution.`
                  : 'No bidirectional dependencies detected — coupling is unidirectional.',
                evidence: pairs.slice(0, 4).map(p => ({
                  label: typeof p === 'object' ? `${(p.a || '').split('/').slice(-1)[0]} ↔ ${(p.b || '').split('/').slice(-1)[0]}` : String(p),
                  value: 'bidirectional',
                  severity: 'elevated',
                })),
                structuralContext: 'Bidirectional dependency = A imports B AND B imports A. The strongest form of coupling — a single change unit.',
              }
            },
          },
          {
            question: 'Does coupling rigidity block independent module evolution?',
            tone: 'alarming', archetype: 'ESCALATION', depth: 'deep',
            boundary: 'From cluster size + system coupling index — deterministic.',
            answer_derive: (fr) => {
              const cplg = (fr.structural_enrichment || {}).coupling_inertia || {}
              const cls = cplg.inertia_clusters || []
              const sysIdx = cplg.system_coupling_index || 0
              const totalModules = cls.reduce((sum, cl) => sum + (cl.modules || cl.members || []).length, 0)
              return {
                summary: sysIdx > 0.25
                  ? `System coupling index at ${Math.round(sysIdx * 100)}% — more than a quarter of module relationships are mutually dependent. ${totalModules} module${totalModules !== 1 ? 's' : ''} across ${cls.length} cluster${cls.length !== 1 ? 's' : ''} cannot be released independently. This is structural rigidity — the system resists decomposition.`
                  : `System coupling index at ${Math.round(sysIdx * 100)}% — coupling is present but does not dominate the dependency structure. ${totalModules} module${totalModules !== 1 ? 's' : ''} are cluster-bound, the rest evolve independently.`,
                evidence: [
                  { label: 'System coupling index', value: `${Math.round(sysIdx * 100)}%`, severity: sysIdx > 0.3 ? 'critical' : sysIdx > 0.15 ? 'elevated' : 'nominal' },
                  { label: 'Cluster-bound modules', value: String(totalModules), severity: totalModules > 8 ? 'critical' : 'elevated' },
                  { label: 'Independent clusters', value: String(cls.length), severity: cls.length >= 3 ? 'critical' : 'nominal' },
                ],
                structuralContext: 'System coupling index = proportion of module relationships that are bidirectional. Higher = more structural rigidity.',
              }
            },
          },
        ],

        topologyFocus: (() => {
          const affected = new Set(surface.affected_domains || [])
          return {
            highlightDomains: [...affected],
            accentDomains: [],
            dimDomains: registry.filter(d => !affected.has(d.business_label || d.domain_name) && !affected.has(d.domain_name)).map(d => d.domain_id),
          }
        })(),

        actions: [
          { action: 'Identify bidirectional dependencies that can be broken', priority: 'HIGH', type: 'architectural' },
          { action: 'Plan coordinated release strategy for cluster members', priority: 'MEDIUM', type: 'assessment' },
          { action: 'Monitor coupling index trend across runs', priority: 'LOW', type: 'assessment' },
        ],

        gapsAndProgression: {
          evidenceGaps: [
            ...(clusters.length > 0 && biPairs === 0 ? [{ gap: 'Clusters detected but bidirectional pairs not enumerated', impact: 'Cannot identify specific circular dependencies' }] : []),
          ],
          progressionPath: [
            { step: 'Break bidirectional dependencies in largest cluster', effect: 'Decompose coupling cluster into independent modules' },
            { step: 'Reduce system coupling index below 20%', effect: 'Enable independent module evolution' },
            { step: 'Eliminate smallest clusters first', effect: 'Quick wins — reduce total cluster-bound module count' },
          ],
        },
      }
    },
  },

  // ── REINFORCEMENT FLOWS ────────────────────────────────────────────
  REINFORCEMENT_FLOWS: {
    meta: { code: 'RF', label: 'Reinforcement Flows', icon: '⇄' },
    resolve: (fullReport, surface) => {
      const sigs = (fullReport.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
      const registry = fullReport.semantic_domain_registry || []
      const c = surface.constituents || {}
      const coPresencePairs = c.co_presence_pairs || 0
      const ampDomains = c.amplification_domains || []
      const topFlows = c.top_flows || []

      return {
        interpretation: {
          heading: 'Reinforcement Flows — Active Cognition State',
          operationalMeaning: c.reinforcement_count > 0
            ? `${c.reinforcement_count} reinforcement relationship${c.reinforcement_count !== 1 ? 's' : ''} detected. ${coPresencePairs} co-presence pair${coPresencePairs !== 1 ? 's' : ''} indicate signals that activate together — these are not independent risks but mutually reinforcing dynamics.${ampDomains.length > 0 ? ` ${ampDomains.length} amplification domain${ampDomains.length !== 1 ? 's' : ''} concentrate multiple signal types, creating compound pressure.` : ''}`
            : 'Reinforcement flow surface available but no co-presence or amplification relationships detected at current threshold.',
          structuralEvidence: [
            ...(coPresencePairs > 0 ? [{ label: 'Co-presence pairs', value: `${coPresencePairs} signal pair${coPresencePairs !== 1 ? 's' : ''} activate together`, severity: coPresencePairs >= 3 ? 'critical' : 'elevated' }] : []),
            ...ampDomains.slice(0, 3).map(d => ({
              label: `Amplification: ${d.domain}`,
              value: `${d.type_count} signal type${d.type_count !== 1 ? 's' : ''} concentrate`,
              severity: d.type_count >= 3 ? 'critical' : 'elevated',
            })),
            ...topFlows.slice(0, 2).map(f => ({
              label: `${f.from_type_label || f.from_type}`,
              value: `${f.verb} ${f.to_type_label || f.to_type}${f.domain ? ` in ${f.domain}` : ''}`,
              severity: 'elevated',
            })),
          ],
          suppressionMask: [],
        },

        implications: {
          orchestration: [
            { action: 'Treat reinforcing risks as a system — isolated mitigation is insufficient', priority: 'HIGH' },
            ...(ampDomains.length > 0 ? [{ action: `${ampDomains.length} amplification domain${ampDomains.length !== 1 ? 's' : ''} require compound risk assessment`, priority: 'HIGH' }] : []),
            ...(coPresencePairs > 0 ? [{ action: `${coPresencePairs} co-present signal pair${coPresencePairs !== 1 ? 's' : ''} — addressing one may not reduce the other`, priority: 'MEDIUM' }] : []),
          ],
          qualification: {
            effect: c.reinforcement_count >= 3
              ? 'Multiple reinforcement relationships indicate systemic risk compounding — qualification posture reflects interconnected rather than isolated pressure'
              : 'Limited reinforcement present — risks are partially independent',
          },
        },

        guidedCognition: [
          {
            question: 'Which risks reinforce each other?',
            tone: 'forensic', archetype: 'TRACE', depth: 'standard',
            boundary: 'From signal_interpretations co_presence — deterministic.',
            answer_derive: (fr) => {
              const activeSigs = (fr.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
              const coPresence = activeSigs.filter(s => s.co_presence && s.co_presence.length > 0)
              const pairs = []
              for (const sig of coPresence) {
                for (const coId of sig.co_presence) {
                  const coSig = activeSigs.find(s => s.signal_id === coId)
                  if (coSig) pairs.push({ a: sig.signal_name || sig.signal_id, b: coSig.signal_name || coSig.signal_id })
                }
              }
              return {
                summary: pairs.length > 0
                  ? `${pairs.length} reinforcement pair${pairs.length !== 1 ? 's' : ''} detected. These signals co-activate — when one fires, the other is also present, indicating structural coupling between risk types.`
                  : 'No direct co-presence relationships detected between active signals.',
                evidence: pairs.slice(0, 4).map((p, i) => ({
                  label: p.a,
                  value: `reinforces ${p.b}`,
                  severity: 'elevated',
                })),
                structuralContext: 'Co-presence = two signals that activate in the same evidence window. This is structural reinforcement, not coincidence.',
              }
            },
          },
          {
            question: 'Is this a system of risks or independent risks?',
            tone: 'architectural', archetype: 'ESCALATION', depth: 'deep',
            boundary: 'From co-presence count + amplification domain count — deterministic.',
            answer_derive: (fr) => {
              const activeSigs = (fr.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
              const coPresence = activeSigs.filter(s => s.co_presence && s.co_presence.length > 0)
              const domSigTypes = {}
              for (const sig of activeSigs) {
                const domain = sig.concentration || null
                if (!domain) continue
                if (!domSigTypes[domain]) domSigTypes[domain] = new Set()
                domSigTypes[domain].add(sig.signal_family || sig.condition_type || sig.signal_id)
              }
              const ampCount = Object.values(domSigTypes).filter(s => s.size >= 2).length
              const totalReinforcement = coPresence.length + ampCount
              return {
                summary: totalReinforcement >= 3
                  ? `This is a system of risks. ${coPresence.length} co-presence relationship${coPresence.length !== 1 ? 's' : ''} and ${ampCount} amplification domain${ampCount !== 1 ? 's' : ''} indicate that risks are structurally coupled — they compound rather than exist independently.`
                  : totalReinforcement > 0
                    ? `Partial reinforcement detected. ${totalReinforcement} relationship${totalReinforcement !== 1 ? 's' : ''} link some risks together, but the majority remain independent.`
                    : 'Risks appear independent — no significant reinforcement relationships detected.',
                evidence: [
                  { label: 'Co-presence relationships', value: String(coPresence.length), severity: coPresence.length >= 2 ? 'elevated' : 'nominal' },
                  { label: 'Amplification domains', value: String(ampCount), severity: ampCount >= 2 ? 'elevated' : 'nominal' },
                ],
                structuralContext: 'A system of risks requires systemic response. Independent risks can be addressed in isolation.',
              }
            },
          },
          {
            question: 'Which domains have converging pressures?',
            tone: 'forensic', archetype: 'TRACE', depth: 'standard',
            boundary: 'From signal concentration grouping — deterministic.',
            answer_derive: (fr) => {
              const activeSigs = (fr.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
              const reg = fr.semantic_domain_registry || []
              const domSigTypes = {}
              for (const sig of activeSigs) {
                const domain = sig.concentration || null
                if (!domain) continue
                if (!domSigTypes[domain]) domSigTypes[domain] = new Set()
                domSigTypes[domain].add(sig.signal_family || sig.condition_type || sig.signal_id)
              }
              const converging = Object.entries(domSigTypes)
                .filter(([, types]) => types.size >= 2)
                .map(([domain, types]) => {
                  const regEntry = reg.find(d => d.domain_id === domain || d.domain_name === domain)
                  return { domain: regEntry ? (regEntry.business_label || regEntry.domain_name || domain) : domain, count: types.size }
                })
                .sort((a, b) => b.count - a.count)
              return {
                summary: converging.length > 0
                  ? `${converging.length} domain${converging.length !== 1 ? 's' : ''} face converging pressures from multiple signal types. These domains are under compound structural stress.`
                  : 'No domains face converging pressures — signal types are distributed across different domains.',
                evidence: converging.slice(0, 4).map(d => ({
                  label: d.domain,
                  value: `${d.count} signal type${d.count !== 1 ? 's' : ''} converge`,
                  severity: d.count >= 3 ? 'critical' : 'elevated',
                })),
                structuralContext: 'Converging pressures = multiple independent signal types concentrating on the same domain.',
              }
            },
          },
        ],

        topologyFocus: (() => {
          const affected = new Set(surface.affected_domains || [])
          return {
            highlightDomains: [...affected],
            accentDomains: [],
            dimDomains: registry.filter(d => !affected.has(d.business_label || d.domain_name) && !affected.has(d.domain_name)).map(d => d.domain_id),
          }
        })(),

        actions: [
          { action: 'Assess reinforcing risks as compound system, not isolated events', priority: 'HIGH', type: 'assessment' },
          { action: 'Prioritize amplification domains for coordinated mitigation', priority: 'HIGH', type: 'architectural' },
          { action: 'Track co-presence stability across runs', priority: 'LOW', type: 'assessment' },
        ],

        gapsAndProgression: {
          evidenceGaps: [
            ...(coPresencePairs === 0 && ampDomains.length > 0 ? [{ gap: 'Amplification detected but no co-presence relationships', impact: 'Cannot confirm whether signal types are causally linked or coincidentally co-located' }] : []),
          ],
          progressionPath: [
            { step: 'Decompose amplification domains to isolate signal sources', effect: 'Break compound pressure into addressable components' },
            { step: 'Reduce co-presence count below 2', effect: 'Transition from systemic to isolated risk profile' },
            { step: 'Monitor reinforcement trend across successive runs', effect: 'Detect whether compounding is growing or stabilizing' },
          ],
        },
      }
    },
  },

  // ── CONVERGENCE PATTERNS ───────────────────────────────────────────
  CONVERGENCE_PATTERNS: {
    meta: { code: 'CP', label: 'Convergence Patterns', icon: '⊕' },
    resolve: (fullReport, surface) => {
      const sigs = (fullReport.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
      const registry = fullReport.semantic_domain_registry || []
      const c = surface.constituents || {}
      const convergenceDomains = c.convergence_domains || []
      const peakCount = c.peak_condition_count || 0

      return {
        interpretation: {
          heading: 'Convergence Patterns — Active Cognition State',
          operationalMeaning: convergenceDomains.length > 0
            ? `${convergenceDomains.length} domain${convergenceDomains.length !== 1 ? 's' : ''} have multiple condition types stacking. Peak convergence: ${peakCount} distinct condition types on a single domain.${convergenceDomains.length > 1 ? ` Convergence is not isolated — ${convergenceDomains.length} domains face multi-condition pressure simultaneously.` : ''} Risk at converging domains is compound, not additive — each condition type brings independent structural consequences.`
            : 'Convergence surface available but no domains exhibit multi-condition convergence at current threshold.',
          structuralEvidence: convergenceDomains.slice(0, 4).map(d => ({
            label: d.domain,
            value: `${d.condition_count} condition${d.condition_count !== 1 ? 's' : ''}: ${d.condition_types.join(', ')}`,
            severity: d.condition_count >= 4 ? 'critical' : d.condition_count >= 3 ? 'elevated' : 'moderate',
          })),
          suppressionMask: [],
        },

        implications: {
          orchestration: [
            { action: 'Assess convergence domains for compound risk before change deployment', priority: 'HIGH' },
            ...(peakCount >= 4 ? [{ action: `Peak convergence of ${peakCount} conditions — this domain requires holistic structural review`, priority: 'HIGH' }] : []),
            ...(convergenceDomains.length > 2 ? [{ action: `${convergenceDomains.length} domains under convergence — systemic pattern, not isolated hotspot`, priority: 'MEDIUM' }] : []),
          ],
          qualification: {
            effect: peakCount >= 4
              ? 'High convergence indicates systemic structural pressure concentration — qualification posture reflects compound domain risk'
              : 'Convergence present but manageable for qualification',
          },
        },

        guidedCognition: [
          {
            question: 'Where are conditions stacking up?',
            tone: 'forensic', archetype: 'TRACE', depth: 'standard',
            boundary: 'From signal_interpretations grouped by concentration — deterministic.',
            answer_derive: (fr) => {
              const activeSigs = (fr.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
              const reg = fr.semantic_domain_registry || []
              const domConds = {}
              for (const sig of activeSigs) {
                const domain = sig.concentration || null
                if (!domain) continue
                if (!domConds[domain]) domConds[domain] = new Set()
                domConds[domain].add(sig.condition_type || sig.signal_family || sig.signal_id)
              }
              const stacking = Object.entries(domConds)
                .filter(([, types]) => types.size >= 2)
                .map(([domain, types]) => {
                  const regEntry = reg.find(d => d.domain_id === domain || d.domain_name === domain)
                  return { domain: regEntry ? (regEntry.business_label || regEntry.domain_name || domain) : domain, count: types.size, types: [...types] }
                })
                .sort((a, b) => b.count - a.count)
              return {
                summary: stacking.length > 0
                  ? `${stacking.length} domain${stacking.length !== 1 ? 's' : ''} have condition stacking. The highest concentration is ${stacking[0].count} condition types on ${stacking[0].domain}.`
                  : 'No condition stacking detected — each domain faces at most one condition type.',
                evidence: stacking.slice(0, 4).map(d => ({
                  label: d.domain,
                  value: `${d.count} condition${d.count !== 1 ? 's' : ''}: ${d.types.slice(0, 3).join(', ')}`,
                  severity: d.count >= 4 ? 'critical' : d.count >= 3 ? 'elevated' : 'moderate',
                })),
                structuralContext: 'Condition stacking = multiple independent structural pressure types affecting the same domain simultaneously.',
              }
            },
          },
          {
            question: 'Is this domain\'s risk compound or simple?',
            tone: 'alarming', archetype: 'ESCALATION', depth: 'deep',
            boundary: 'From convergence domain condition count — deterministic.',
            answer_derive: (fr) => {
              const activeSigs = (fr.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
              const domConds = {}
              for (const sig of activeSigs) {
                const domain = sig.concentration || null
                if (!domain) continue
                if (!domConds[domain]) domConds[domain] = new Set()
                domConds[domain].add(sig.condition_type || sig.signal_family || sig.signal_id)
              }
              const compoundDomains = Object.entries(domConds).filter(([, types]) => types.size >= 2).length
              const simpleDomains = Object.entries(domConds).filter(([, types]) => types.size === 1).length
              return {
                summary: compoundDomains > 0
                  ? `${compoundDomains} domain${compoundDomains !== 1 ? 's' : ''} face compound risk (multiple condition types). ${simpleDomains} domain${simpleDomains !== 1 ? 's' : ''} face simple risk (single condition type). Compound domains require holistic assessment — addressing one condition may not reduce overall domain pressure.`
                  : `All ${simpleDomains} affected domain${simpleDomains !== 1 ? 's' : ''} face simple risk — single condition types that can be addressed independently.`,
                evidence: [
                  { label: 'Compound risk domains', value: String(compoundDomains), severity: compoundDomains >= 2 ? 'critical' : compoundDomains > 0 ? 'elevated' : 'nominal' },
                  { label: 'Simple risk domains', value: String(simpleDomains), severity: 'nominal' },
                ],
                structuralContext: 'Compound risk = multiple independent structural pressures on a single domain. Simple risk = one pressure type per domain.',
              }
            },
          },
          {
            question: 'Which condition types converge most frequently?',
            tone: 'forensic', archetype: 'TRACE', depth: 'standard',
            boundary: 'From signal condition_type occurrence across converging domains — deterministic.',
            answer_derive: (fr) => {
              const activeSigs = (fr.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
              const condDomainCount = {}
              for (const sig of activeSigs) {
                const condType = sig.condition_type || sig.signal_family || sig.signal_id
                const domain = sig.concentration || null
                if (!domain) continue
                if (!condDomainCount[condType]) condDomainCount[condType] = new Set()
                condDomainCount[condType].add(domain)
              }
              const ranked = Object.entries(condDomainCount)
                .map(([type, domains]) => ({ type, domain_count: domains.size }))
                .sort((a, b) => b.domain_count - a.domain_count)
              return {
                summary: ranked.length > 0
                  ? `${ranked[0].type.replace(/_/g, ' ')} appears in the most domains (${ranked[0].domain_count}). ${ranked.filter(r => r.domain_count >= 2).length} condition type${ranked.filter(r => r.domain_count >= 2).length !== 1 ? 's' : ''} appear in multiple domains.`
                  : 'No condition types detected across multiple domains.',
                evidence: ranked.slice(0, 4).map(r => ({
                  label: r.type.replace(/_/g, ' '),
                  value: `present in ${r.domain_count} domain${r.domain_count !== 1 ? 's' : ''}`,
                  severity: r.domain_count >= 3 ? 'critical' : r.domain_count >= 2 ? 'elevated' : 'nominal',
                })),
                structuralContext: 'Frequently converging condition types indicate systemic structural patterns rather than isolated domain-specific issues.',
              }
            },
          },
        ],

        topologyFocus: (() => {
          const affected = new Set(surface.affected_domains || [])
          return {
            highlightDomains: [...affected],
            accentDomains: [],
            dimDomains: registry.filter(d => !affected.has(d.business_label || d.domain_name) && !affected.has(d.domain_name)).map(d => d.domain_id),
          }
        })(),

        actions: [
          { action: 'Conduct compound risk assessment for peak convergence domains', priority: 'HIGH', type: 'assessment' },
          { action: 'Determine which converging conditions share structural root causes', priority: 'MEDIUM', type: 'architectural' },
          { action: 'Monitor convergence count trend across runs', priority: 'LOW', type: 'assessment' },
        ],

        gapsAndProgression: {
          evidenceGaps: [
            ...(convergenceDomains.length > 0 && sigs.length < 4 ? [{ gap: 'Limited signal coverage — convergence may be understated', impact: 'Additional signal families could reveal deeper convergence' }] : []),
          ],
          progressionPath: [
            { step: 'Decompose highest-convergence domain to isolate condition sources', effect: 'Identify whether conditions share root cause or are independent' },
            { step: 'Reduce peak convergence below 3 condition types', effect: 'Simplify domain risk profile from compound to manageable' },
            { step: 'Eliminate cross-cutting conditions that appear in multiple domains', effect: 'Reduce overall convergence count systemically' },
          ],
        },
      }
    },
  },

  // ── ABSENCE PROFILE ────────────────────────────────────────────────
  ABSENCE_PROFILE: {
    meta: { code: 'AP', label: 'Absence Profile', icon: '◇' },
    resolve: (fullReport, surface) => {
      const sigs = (fullReport.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
      const registry = fullReport.semantic_domain_registry || []
      const c = surface.constituents || {}
      const absentTypes = c.absent_types || []
      const activeTypes = c.active_types || []
      const healthRatio = c.health_ratio || 0

      return {
        interpretation: {
          heading: 'Absence Profile — Structural Health Assessment',
          operationalMeaning: `${c.absent_count || 0} of ${c.total_types || 0} structural condition types are nominal — a health ratio of ${healthRatio}%.${healthRatio >= 70 ? ' The majority of structural condition types are NOT firing — pressure is concentrated rather than systemic.' : healthRatio >= 40 ? ' A mixed health profile — some condition types are absent while a significant number remain active.' : ' Most condition types are active — the system is under broad structural pressure.'}${absentTypes.filter(t => t.reason !== 'Unobservable — enrichment not available').length > 0 ? ` ${absentTypes.filter(t => t.reason !== 'Unobservable — enrichment not available').length} type${absentTypes.filter(t => t.reason !== 'Unobservable — enrichment not available').length !== 1 ? 's' : ''} confirmed healthy through structural evidence.` : ''}`,
          structuralEvidence: [
            { label: 'Health ratio', value: `${healthRatio}% of condition types nominal`, severity: 'nominal' },
            ...absentTypes.slice(0, 3).map(t => ({
              label: t.label,
              value: t.reason,
              severity: 'nominal',
            })),
            ...activeTypes.slice(0, 2).map(t => ({
              label: t.label,
              value: 'Active — firing',
              severity: 'elevated',
            })),
          ],
          suppressionMask: [],
        },

        implications: {
          orchestration: [
            { action: 'Absent condition types represent defensive capabilities — protect them during changes', priority: 'MEDIUM' },
            ...(healthRatio >= 70 ? [{ action: 'System health is strong — focus attention on the concentrated active conditions', priority: 'LOW' }] : []),
            ...(healthRatio < 40 ? [{ action: 'Broad structural pressure — prioritize systemic remediation over isolated fixes', priority: 'HIGH' }] : []),
          ],
          qualification: {
            effect: healthRatio >= 70
              ? 'Strong health profile supports qualification progression — pressure is concentrated and addressable'
              : healthRatio >= 40
                ? 'Mixed health profile — qualification progression depends on resolving active conditions'
                : 'Broad activation limits qualification confidence — systemic remediation needed',
          },
        },

        guidedCognition: [
          {
            question: 'What\'s healthy about this system?',
            tone: 'forensic', archetype: 'TRACE', depth: 'standard',
            boundary: 'From absent condition type enumeration — deterministic.',
            answer_derive: (fr) => {
              const activeSigs = (fr.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
              const se = fr.structural_enrichment || {}
              const allTypes = ['DELIVERY_PRESSURE_CONCENTRATION', 'DEPENDENCY_CHOKE_POINT', 'PROPAGATION_ASYMMETRY', 'STRUCTURAL_MASS_CONCENTRATION', 'CROSS_DOMAIN_COUPLING_PRESSURE', 'EXECUTION_FRAGILITY', 'EXECUTION_CONSTRICTION', 'STRUCTURAL_BOUNDARY_DIVERGENCE', 'COUPLING_INERTIA', 'GOVERNANCE_COVERAGE_GAP']
              const activeSet = new Set()
              for (const sig of activeSigs) { if (sig.condition_type) activeSet.add(sig.condition_type) }
              if (se.available && se.fragility_surface && (se.fragility_surface.fragility_hotspots || []).length > 0) activeSet.add('EXECUTION_FRAGILITY')
              if (se.available && se.boundary_divergence && (se.boundary_divergence.divergent_modules || []).length > 0) activeSet.add('STRUCTURAL_BOUNDARY_DIVERGENCE')
              if (se.available && se.coupling_inertia && (se.coupling_inertia.inertia_clusters || []).length > 0) activeSet.add('COUPLING_INERTIA')
              const absent = allTypes.filter(t => !activeSet.has(t))
              return {
                summary: absent.length > 0
                  ? `${absent.length} of ${allTypes.length} condition types are nominal. These represent areas of structural health: ${absent.slice(0, 3).map(t => t.replace(/_/g, ' ')).join(', ')}${absent.length > 3 ? ` and ${absent.length - 3} more` : ''}.`
                  : 'All condition types are active — no areas of confirmed structural health.',
                evidence: absent.slice(0, 5).map(t => ({
                  label: t.replace(/_/g, ' '),
                  value: 'Nominal — not firing',
                  severity: 'nominal',
                })),
                structuralContext: 'Absence of a condition type is evidence of structural health in that dimension — the system does not exhibit that pressure pattern.',
              }
            },
          },
          {
            question: 'Is pressure concentrated or systemic?',
            tone: 'alarming', archetype: 'ESCALATION', depth: 'deep',
            boundary: 'From active vs absent condition type ratio — deterministic.',
            answer_derive: (fr) => {
              const activeSigs = (fr.signal_interpretations || []).filter(s => s.severity !== 'NOMINAL' && s.activation_state !== 'NOMINAL')
              const allTypes = ['DELIVERY_PRESSURE_CONCENTRATION', 'DEPENDENCY_CHOKE_POINT', 'PROPAGATION_ASYMMETRY', 'STRUCTURAL_MASS_CONCENTRATION', 'CROSS_DOMAIN_COUPLING_PRESSURE', 'EXECUTION_FRAGILITY', 'EXECUTION_CONSTRICTION', 'STRUCTURAL_BOUNDARY_DIVERGENCE', 'COUPLING_INERTIA', 'GOVERNANCE_COVERAGE_GAP']
              const activeSet = new Set()
              for (const sig of activeSigs) { if (sig.condition_type) activeSet.add(sig.condition_type) }
              const ratio = Math.round((allTypes.length - activeSet.size) / allTypes.length * 100)
              return {
                summary: ratio >= 70
                  ? `Pressure is concentrated — ${ratio}% of condition types are nominal. Only ${activeSet.size} condition type${activeSet.size !== 1 ? 's' : ''} are active. The system's structural issues are localized and addressable.`
                  : ratio >= 40
                    ? `Pressure is mixed — ${ratio}% of condition types are nominal, ${activeSet.size} are active. The system faces broad but not universal structural pressure.`
                    : `Pressure is systemic — only ${ratio}% of condition types are nominal. ${activeSet.size} of ${allTypes.length} condition types are active. The system is under broad structural stress across multiple dimensions.`,
                evidence: [
                  { label: 'Health ratio', value: `${ratio}%`, severity: ratio >= 70 ? 'nominal' : ratio >= 40 ? 'elevated' : 'critical' },
                  { label: 'Active condition types', value: String(activeSet.size), severity: activeSet.size >= 6 ? 'critical' : activeSet.size >= 3 ? 'elevated' : 'nominal' },
                ],
                structuralContext: 'Concentrated pressure = few condition types active, addressable. Systemic pressure = many condition types active, requires broad remediation.',
              }
            },
          },
          {
            question: 'Which defensive capabilities are intact?',
            tone: 'forensic', archetype: 'TRACE', depth: 'standard',
            boundary: 'From absent condition types with enrichment confirmation — deterministic.',
            answer_derive: (fr) => {
              const se = fr.structural_enrichment || {}
              const confirmed = []
              if (se.available) {
                if (se.fragility_surface && (se.fragility_surface.fragility_hotspots || []).length === 0) confirmed.push({ type: 'EXECUTION_FRAGILITY', label: 'EXECUTION FRAGILITY', reason: 'Fragility surface nominal — no hotspots' })
                if (se.boundary_divergence && (se.boundary_divergence.divergent_modules || []).length === 0) confirmed.push({ type: 'STRUCTURAL_BOUNDARY_DIVERGENCE', label: 'BOUNDARY DIVERGENCE', reason: 'Boundary alignment intact' })
                if (se.coupling_inertia && (se.coupling_inertia.inertia_clusters || []).length === 0) confirmed.push({ type: 'COUPLING_INERTIA', label: 'COUPLING INERTIA', reason: 'Coupling within threshold' })
                if (se.constriction_surface && (se.constriction_surface.constricted_paths || []).length === 0) confirmed.push({ type: 'EXECUTION_CONSTRICTION', label: 'EXECUTION CONSTRICTION', reason: 'No constricted paths' })
              }
              return {
                summary: confirmed.length > 0
                  ? `${confirmed.length} defensive capabilit${confirmed.length !== 1 ? 'ies' : 'y'} confirmed intact through structural evidence: ${confirmed.map(c => c.label).join(', ')}. These are areas where the architecture is healthy and changes are unlikely to introduce structural risk.`
                  : 'No structural enrichment available to confirm defensive capabilities — absence is observed but not structurally verified.',
                evidence: confirmed.map(c => ({
                  label: c.label,
                  value: c.reason,
                  severity: 'nominal',
                })),
                structuralContext: 'Defensive capabilities are condition types that are confirmed nominal through structural evidence — not just absent from signals.',
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
          { action: 'Protect absent condition types during architectural changes', priority: 'MEDIUM', type: 'assessment' },
          { action: 'Focus remediation on the concentrated active conditions', priority: 'HIGH', type: 'architectural' },
          { action: 'Track health ratio trend across runs', priority: 'LOW', type: 'assessment' },
        ],

        gapsAndProgression: {
          evidenceGaps: [
            ...(absentTypes.filter(t => t.reason === 'Unobservable — enrichment not available').length > 0 ? [{ gap: `${absentTypes.filter(t => t.reason === 'Unobservable — enrichment not available').length} condition type${absentTypes.filter(t => t.reason === 'Unobservable — enrichment not available').length !== 1 ? 's' : ''} unobservable — enrichment data not available`, impact: 'Health assessment incomplete for unobservable condition types' }] : []),
          ],
          progressionPath: [
            { step: 'Enable enrichment for unobservable condition types', effect: 'Complete health assessment coverage' },
            { step: 'Resolve active conditions to increase health ratio', effect: 'Move from mixed to concentrated health profile' },
            { step: 'Maintain health ratio above 70% across runs', effect: 'Confirm structural health stability' },
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
            : sigs.length > 0 ? `All ${sigs.length} signals are within nominal parameters. No structural elevation detected.` : 'Signal layer not yet populated for this specimen.',
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

  OPERATOR_DENSE: (fullReport) => {
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

function ExecutiveInterpretation({ narrative, densityClass, boardroomMode, adapted, fullReport, boardroomProjection, activeZoneKey, activeQueryKey, onQueryDismiss, emergenceState, piRuntimeActive, activeExpansionIndex, expansions, onExpansionDismiss, selectedNarrativeArc, resolvedCognitionContract, cognitionQueryIndex, onCognitionQueryDismiss, activeConditions, resolvedCondition, onConditionDismiss, swIntelActive, swIntelTeaser, consequenceTeaser, balancedBriefing, projectionAuthority, suppressedConditions }) {
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
              <div className="interp-condition-target-chips">
              {targets.map(t => (
                <span key={t.id} className="domain-chip" data-severity={c.severity} title={t.id}>
                  {t.display_name || t.id}
                </span>
              ))}
              </div>
            </div>
          )}

          <div className="interp-condition-field">
            <div className="interp-section-label">TOPOLOGY EFFECT</div>
            <div className="interp-condition-field-value">{c.topology_effect}</div>
          </div>

          {c.topology_overlay && c.topology_overlay.corridor_paths && c.topology_overlay.corridor_paths.length > 0 && (() => {
            const paths = c.topology_overlay.corridor_paths
            const reg = (fullReport && fullReport.semantic_domain_registry) || []
            const resolveName = (id) => { const d = reg.find(r => r.domain_id === id); return d ? (d.business_label || d.domain_name || id) : id }
            const isPropagation = c.topology_overlay.overlay_mode === 'PROPAGATION_CORRIDOR'

            if (isPropagation) {
              const metrics = c.topology_overlay.propagation_metrics || {}
              const topologyDerived = paths.filter(p => p.evidence === 'semantic_topology_edge')
              const centralityDerived = paths.filter(p => p.evidence === 'structural_centrality' || p.evidence === 'signal_metric')
              const sourceDomain = targets.length > 0 ? targets[0].display_name : (metrics.source_domain || 'source domain')

              return (
                <div className="interp-condition-field">
                  <div className="interp-section-label">PROPAGATION CORRIDORS</div>
                  <div className="interp-condition-field-value" style={{ marginBottom: 6 }}>
                    Changes originating from {sourceDomain} propagate across {metrics.import_out_degree || '?'} downstream entities — fan-out ratio {metrics.fan_out_ratio > 0 ? metrics.fan_out_ratio.toFixed(1) + ':1' : 'asymmetric'}.
                  </div>
                  {metrics.source_entity && (
                    <div className="interp-condition-corridor-group propagation-corridor-group">
                      <span className="interp-condition-corridor-label" style={{ color: '#64ffda' }}>SOURCE</span>
                      <span className="interp-condition-corridor-domain">{metrics.source_entity}</span>
                      {metrics.source_role && <span className="interp-condition-corridor-role">{STRUCTURAL_ROLE_LABELS[metrics.source_role] || metrics.source_role}</span>}
                    </div>
                  )}
                  {metrics.import_out_degree > 0 && (
                    <div className="interp-condition-corridor-group propagation-corridor-group">
                      <span className="interp-condition-corridor-label" style={{ color: '#64ffda' }}>BLAST RADIUS</span>
                      <span className="interp-condition-corridor-domain">{metrics.import_out_degree} outbound dependencies · {metrics.import_in_degree || 0} inbound</span>
                    </div>
                  )}
                  {topologyDerived.length > 0 && (
                    <div className="interp-condition-corridor-group propagation-corridor-group">
                      <span className="interp-condition-corridor-label" style={{ color: '#64ffda' }}>DOWNSTREAM DOMAINS</span>
                      {topologyDerived.map((p, i) => <span key={i} className="interp-condition-corridor-domain">{resolveName(p.to)}</span>)}
                    </div>
                  )}
                  <div className="interp-condition-corridor-evidence">
                    {topologyDerived.length > 0
                      ? topologyDerived.length + ' corridor' + (topologyDerived.length !== 1 ? 's' : '') + ' from semantic topology edges'
                      : centralityDerived.length > 0
                        ? 'structural centrality · code graph derived'
                        : 'signal metric derived'
                    } · {c.topology_overlay.corridor_evidence || 'unclassified'}
                  </div>
                </div>
              )
            }

            const evidencePaths = paths.filter(p => p.evidence === 'semantic_topology_edge')
            if (evidencePaths.length === 0) return null
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

          {c.topology_overlay && c.topology_overlay.overlay_mode === 'PRESSURE_ZONE' && (() => {
            const reg = (fullReport && fullReport.semantic_domain_registry) || []
            const resolveName = (id) => { const d = reg.find(r => r.domain_id === id) || reg.find(r => r.dominant_dom_id === id); return d ? (d.business_label || d.domain_name || id) : id }
            const pzState = (fullReport && fullReport.pressure_zone_state) || {}
            const zone = (pzState.zones || []).find(z => (c.pressure_zone_ids || []).includes(z.zone_id))
            const signalOverlays = c.topology_overlay.signal_overlays || []
            const advisoryZones = (c.topology_overlay.advisory_zones || []).map(id => ({ id, display_name: resolveName(id) }))

            return (
              <div className="interp-condition-field interp-condition-zone-section">
                <div className="interp-section-label">PRESSURE ZONE</div>
                {zone && (
                  <div className="interp-condition-zone-header">
                    <span className="interp-condition-zone-classification">{zone.zone_class}</span>
                    <span className="interp-condition-zone-id">{zone.zone_id}</span>
                  </div>
                )}
                {targets.length > 0 && (
                  <div className="interp-condition-corridor-group">
                    <span className="interp-condition-corridor-label" style={{ color: '#ff6b6b' }}>ANCHOR</span>
                    <span className="interp-condition-corridor-domain">{targets[0].display_name}</span>
                  </div>
                )}
                {signalOverlays.length > 0 && (
                  <div className="interp-condition-zone-signals">
                    <span className="interp-condition-corridor-label" style={{ color: '#ff9e4a' }}>CONTRIBUTING SIGNALS</span>
                    {signalOverlays.map((s, i) => {
                      const trans = translateSignal(s.signal_id)
                      return (
                        <div key={i} className="interp-condition-zone-signal">
                          <span className="interp-condition-zone-signal-id">{s.signal_id}</span>
                          <span className="interp-condition-zone-signal-name">{trans ? trans.l3_title : (s.signal_name || s.signal_id)}</span>
                          <span className={'interp-condition-sev interp-condition-sev--' + (s.severity || '').toLowerCase()}>{s.severity}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
                {advisoryZones.length > 0 && (
                  <div className="interp-condition-zone-advisories">
                    <span className="interp-condition-corridor-label" style={{ color: '#5e6d8a' }}>STRUCTURAL BLIND SPOTS</span>
                    {advisoryZones.map((az, i) => (
                      <div key={i} className="interp-condition-zone-advisory">
                        <span className="interp-condition-zone-advisory-name">{az.display_name}</span>
                        <span className="interp-condition-zone-advisory-id">{az.id}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="interp-condition-corridor-evidence">
                  PRESSURE_ZONE_DERIVED · from pressure_zone_state artifact{zone ? ' · ' + (zone.condition_count || 0) + ' conditions active' : ''}
                </div>
              </div>
            )
          })()}

          {c.topology_overlay && c.topology_overlay.overlay_mode === 'COMPOUND_CONVERGENCE' && (() => {
            const reg = (fullReport && fullReport.semantic_domain_registry) || []
            const resolveName = (id) => { const d = reg.find(r => r.domain_id === id) || reg.find(r => r.dominant_dom_id === id); return d ? (d.business_label || d.domain_name || id) : id }
            const contributingIds = c.contributing_condition_ids || []
            const contributingConditions = contributingIds.map(cid => (activeConditions || []).find(ac => ac.condition_id === cid)).filter(Boolean)
            const corridors = c.topology_overlay.corridor_paths || []
            const advisoryZones = (c.topology_overlay.advisory_zones || []).map(id => ({ id, display_name: resolveName(id) }))

            return (
              <div className="interp-condition-field interp-condition-convergence-section">
                <div className="interp-section-label">COMPOUND CONVERGENCE</div>
                <div className="interp-condition-convergence-header">
                  <span className="interp-condition-convergence-factor">{contributingIds.length} conditions</span>
                  <span className="interp-condition-field-value"> converge on {targets.length > 0 ? targets[0].display_name : 'target domain'}</span>
                </div>
                <div className="interp-condition-escalation">
                  Escalated to {c.severity} — {contributingIds.length} conditions from different operational dimensions converge on the same structural region.
                </div>
                {contributingConditions.length > 0 && (
                  <div className="interp-condition-contributing-list">
                    <span className="interp-condition-corridor-label" style={{ color: '#ff9e4a' }}>CONTRIBUTING CONDITIONS</span>
                    {contributingConditions.map((cc, i) => (
                      <div key={i} className="interp-condition-contributing-entry" data-overlay={cc.topology_overlay ? cc.topology_overlay.overlay_mode : ''}>
                        <span className="interp-condition-contributing-title">{cc.operator_cognition_title}</span>
                        <span className={'interp-condition-sev interp-condition-sev--' + (cc.severity || '').toLowerCase()}>{cc.severity}</span>
                        <span className="interp-condition-contributing-type">{cc.condition_type}</span>
                      </div>
                    ))}
                  </div>
                )}
                {corridors.length > 0 && (
                  <div className="interp-condition-zone-signals">
                    <span className="interp-condition-corridor-label" style={{ color: '#64ffda' }}>MERGED CORRIDORS</span>
                    <span className="interp-condition-field-value">{corridors.length} corridor{corridors.length !== 1 ? 's' : ''} inherited from contributing conditions</span>
                  </div>
                )}
                {advisoryZones.length > 0 && (
                  <div className="interp-condition-zone-advisories">
                    <span className="interp-condition-corridor-label" style={{ color: '#5e6d8a' }}>ADVISORY ZONES</span>
                    {advisoryZones.map((az, i) => (
                      <div key={i} className="interp-condition-zone-advisory">
                        <span className="interp-condition-zone-advisory-name">{az.display_name}</span>
                        <span className="interp-condition-zone-advisory-id">{az.id}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="interp-condition-corridor-evidence">
                  MIXED · {contributingConditions.map(cc => cc.evidence_mode || 'unknown').filter((v, i, a) => a.indexOf(v) === i).join(' + ')} · composite convergence
                </div>
              </div>
            )
          })()}

          {c.topology_overlay && c.topology_overlay.overlay_mode === 'CLUSTER_PRESSURE' && (() => {
            const reg = (fullReport && fullReport.semantic_domain_registry) || []
            const resolveName = (id) => { const d = reg.find(r => r.domain_id === id) || reg.find(r => r.dominant_dom_id === id); return d ? (d.business_label || d.domain_name || id) : id }
            const signalOverlays = c.topology_overlay.signal_overlays || []
            const clusterIds = (c.shared_topology_targets && c.shared_topology_targets.clusters) || []
            const emphasisDomains = (c.topology_overlay.emphasis_domains || []).map(id => ({ id, display_name: resolveName(id) }))
            const dpsigSummary = (fullReport && fullReport.dpsig_signal_summary) || {}
            const nb = dpsigSummary.normalization_basis || {}
            const clusterName = nb.max_cluster_name || (clusterIds[0] || 'dominant cluster')
            const clusterNodeCount = nb.max_cluster_node_count || 0
            const totalNodes = (dpsigSummary.derivation_context && dpsigSummary.derivation_context.total_structural_nodes) || 0

            return (
              <div className="interp-condition-field interp-condition-cluster-section">
                <div className="interp-section-label">CLUSTER GRAVITY</div>
                <div className="interp-condition-cluster-header">
                  <span className="interp-condition-cluster-identity">{clusterName}</span>
                  {clusterIds[0] && <span className="interp-condition-zone-id">{clusterIds[0]}</span>}
                </div>
                {signalOverlays.length > 0 && (
                  <div className="interp-condition-cluster-metrics">
                    <span className="interp-condition-corridor-label" style={{ color: '#ffd700' }}>STRUCTURAL MASS</span>
                    {signalOverlays.map((s, i) => {
                      const trans = translateSignal(s.signal_id)
                      return (
                        <div key={i} className="interp-condition-cluster-metric">
                          <span className="interp-condition-zone-signal-id">{s.signal_id}</span>
                          <span className="interp-condition-zone-signal-name">{trans ? trans.l3_title : (s.signal_name || s.signal_id)}</span>
                          <span className={'interp-condition-sev interp-condition-sev--' + (s.severity || '').toLowerCase()}>{s.severity}</span>
                        </div>
                      )
                    })}
                    {clusterNodeCount > 0 && totalNodes > 0 && (
                      <div className="interp-condition-cluster-metric">
                        <span className="interp-condition-zone-signal-name">{clusterNodeCount} of {totalNodes} structural nodes ({(clusterNodeCount / totalNodes * 100).toFixed(1)}%)</span>
                      </div>
                    )}
                  </div>
                )}
                {emphasisDomains.length > 0 && (
                  <div className="interp-condition-cluster-composition">
                    <span className="interp-condition-corridor-label" style={{ color: '#ffd700' }}>CLUSTER COMPOSITION</span>
                    {emphasisDomains.map((d, i) => (
                      <div key={i} className="interp-condition-corridor-group">
                        <span className="interp-condition-corridor-domain">{d.display_name}</span>
                        <span className="interp-condition-zone-advisory-id">{d.id}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="interp-condition-corridor-evidence">
                  TOPOLOGY_METRIC_DERIVED · from DPSIG topology distribution metrics · spatial
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

    if (boardroomMode && boardroomProjection && !boardroomProjection.qualification_posture.governed) {
      const bp = boardroomProjection
      const pLabel = projectionAuthority ? projectionAuthority.projectionLabel : 'P0'
      const eLabels = projectionAuthority ? projectionAuthority.evidenceCapabilities.join(' + ') : ''
      const sState = projectionAuthority ? projectionAuthority.qualificationState : 'S0'
      const suppressedN = (suppressedConditions || []).length
      const tension = bp.tension_summary || {}
      const domCov = bp.domain_coverage || {}
      const pLevel = projectionAuthority ? projectionAuthority.projectionLevel : 0

      return (
        <aside className="intel-interp intel-interp--executive-posture" data-tone={framing.tone} aria-label="Executive intelligence briefing">
          <div className="interp-tag">
            <span className="interp-tag-label">EXECUTIVE BRIEFING</span>
            <span className="interp-tag-state">{sState}</span>
          </div>

          <div className="interp-block interp-block--lead">
            <div className="interp-section-label">INTELLIGENCE POSTURE</div>
            <div className="interp-synthesis">
              {pLevel >= 2
                ? `${pLabel}. Structural and runtime intelligence across ${domCov.total_domains || 0} domains. ${tension.tension_count || 0} structural tension${(tension.tension_count || 0) !== 1 ? 's' : ''} active.`
                : `${pLabel}. Structural intelligence across ${domCov.total_domains || 0} domains.`
              }
            </div>
            <div className="interp-synthesis-meta">{eLabels}</div>
          </div>

          {tension.tension_count > 0 && (
            <div className="interp-block">
              <div className="interp-section-label">STRUCTURAL TENSION</div>
              <div className="interp-synthesis">{tension.tension_label || `${tension.tension_count} tensions active`}</div>
            </div>
          )}

          {suppressedN > 0 && (
            <div className="interp-block">
              <div className="interp-section-label">SUPPRESSED INTELLIGENCE</div>
              <div className="interp-synthesis" style={{ color: '#ff9e4a' }}>{suppressedN} condition{suppressedN !== 1 ? 's' : ''} exceed evidence authority. Governed narrative requires P3+ semantic qualification.</div>
            </div>
          )}

          {!swIntelActive && swIntelTeaser && swIntelTeaser.active_count > 0 && (
            <div className="interp-block interp-block--module-teaser">
              <div className="interp-section-label">SOFTWARE INTELLIGENCE</div>
              <div className="interp-module-teaser-text">{swIntelTeaser.active_count} {swIntelTeaser._structural_only ? 'structural' : 'operational'} condition{swIntelTeaser.active_count !== 1 ? 's' : ''} detected</div>
              <div className="interp-module-teaser-cta">Activate Software Intelligence for posture</div>
            </div>
          )}

          <div className="interp-block">
            <div className="interp-section-label">DEPTH</div>
            <div className="interp-synthesis">Descend into DENSE for structural topology cognition. Descend into OPERATOR for evidence inspection.</div>
          </div>
        </aside>
      )
    }

    if (boardroomMode && swIntelActive && boardroomProjection && boardroomProjection.qualification_posture.governed) {
      const qp = boardroomProjection.qualification_posture
      const primaryDynamic = activeConditions && activeConditions.length > 0
        ? (activeConditions.find(c => c.severity === 'CRITICAL' || c.severity === 'HIGH') || activeConditions[0])
        : null
      const primaryDynamicName = primaryDynamic
        ? primaryDynamic.condition_type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
        : '—'
      const hasPropagation = activeConditions && activeConditions.some(c => c.condition_type === 'PROPAGATION_ASYMMETRY')
      const hasPressure = activeConditions && activeConditions.some(c => c.condition_type === 'DELIVERY_PRESSURE_CONCENTRATION')
      return (
        <aside className="intel-interp intel-interp--executive-posture" data-tone={framing.tone} aria-label="Executive posture — SW-Intel active">
          <div className="interp-tag">
            <span className="interp-tag-label">EXECUTIVE POSTURE</span>
            <span className="interp-tag-state">{qp.s_level}</span>
          </div>

          <div className="interp-block interp-block--lead">
            <div className="interp-section-label">OPERATIONAL CONCENTRATION</div>
            <div className="interp-synthesis">{pressureZone || 'System-wide'}</div>
          </div>

          <div className="interp-block">
            <div className="interp-section-label">PRIMARY SOFTWARE DYNAMIC</div>
            <div className="interp-synthesis">{primaryDynamicName}</div>
          </div>

          <div className="interp-block">
            <div className="interp-section-label">PROPAGATION RISK</div>
            <div className="interp-synthesis">{hasPropagation ? 'Asymmetric downstream spread' : 'Within normal parameters'}</div>
          </div>

          <div className="interp-block">
            <div className="interp-section-label">CONFIDENCE</div>
            <div className="interp-synthesis" data-confidence={primaryDynamic ? primaryDynamic.governance_boundary : 'ADVISORY_BOUND'}>
              {primaryDynamic && primaryDynamic.governance_boundary === 'GOVERNED' ? 'Governed' : 'Advisory-bound'}
            </div>
          </div>

          <div className="interp-block interp-block--implication">
            <div className="interp-section-label">OPERATIONAL IMPLICATION</div>
            <div className="interp-synthesis interp-synthesis--implication">
              {hasPressure ? 'Delivery coordination structurally constrained' : 'No immediate structural constraint'}
            </div>
          </div>

          <div className="interp-block">
            <div className="interp-section-label interp-section-label--descent">DESCENT</div>
            <div className="interp-synthesis interp-synthesis--descent">
              DENSE → topology cognition · OPERATOR → evidence inspection
            </div>
          </div>
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

          {!swIntelActive && swIntelTeaser && swIntelTeaser.active_count > 0 && (
            <div className="interp-block interp-block--module-teaser">
              <div className="interp-section-label">SOFTWARE INTELLIGENCE</div>
              <div className="interp-module-teaser-text">{swIntelTeaser.active_count} {swIntelTeaser._structural_only ? 'structural' : 'operational'} condition{swIntelTeaser.active_count !== 1 ? 's' : ''} detected</div>
              {consequenceTeaser && consequenceTeaser.consequence_teaser && (
                <div className="interp-module-teaser-consequence">{consequenceTeaser.consequence_teaser.active_consequence_count} structural dynamic{consequenceTeaser.consequence_teaser.active_consequence_count !== 1 ? 's' : ''} identified — {consequenceTeaser.consequence_teaser.top_consequence_severity} severity</div>
              )}
              <div className="interp-module-teaser-cta">Activate Software Intelligence for operational posture</div>
            </div>
          )}

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

  if (densityClass === 'EXECUTIVE_BALANCED' && piRuntimeActive && activeExpansionIndex !== null && expansions && expansions[activeExpansionIndex]) {
    const expansion = expansions[activeExpansionIndex]
    const derived = expansion.derive(fullReport)
    const depth = expansion.depth || 'standard'
    const typeLabel = EXPANSION_TYPE_LABELS[expansion.expansionType] || 'STRUCTURAL EXPANSION'
    return (
      <aside className="intel-interp intel-interp--expansion-active" data-tone={framing.tone} data-depth={depth} aria-label="Structural expansion — bounded interpretation">
        <div className={`query-answer-panel query-answer-panel--expansion query-answer-panel--${depth}`}>
          <div className="query-answer-header">
            <span className="query-answer-badge">◉</span>
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

  if (densityClass === 'EXECUTIVE_BALANCED' && emergenceState) {
    const swEnhancedPanel = swIntelActive && balancedBriefing && balancedBriefing.valid
    const ps = (fullReport && fullReport.propagation_summary) || {}
    const balSigs = (fullReport && fullReport.signal_interpretations) || []
    const balActivated = balSigs.filter(s => s.severity !== 'NOMINAL')
    const balCritical = balActivated.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
    const balZone = ps.primary_zone_business_label || null
    const qs = (fullReport && fullReport.qualifier_summary) || {}
    const ts = (fullReport && fullReport.topology_summary) || {}
    const backed = ts.structurally_backed_count || 0
    const totalDomains = ts.semantic_domain_count || 0
    const confLabel = qs.qualifier_class === 'Q-01' ? 'Full' : qs.qualifier_class === 'Q-02' ? 'Partial' : 'Advisory-bound'

    const synthesisText = balCritical.length > 0 && balZone
      ? `Structural pressure converges on ${balZone}. ${balCritical.length > 1 ? 'Multiple independent conditions reinforce this concentration — ' : ''}this is not a localised deficiency but a compound convergence pattern that constrains delivery coordination across the program.`
      : balActivated.length > 0 && balZone
        ? `Operational load concentrates around ${balZone}. Pressure is present but has not reached the convergence threshold that would constrain delivery coordination.`
        : 'Operational dependencies are distributed without disproportionate concentration. No structural convergence pattern detected.'

    const whyText = balCritical.length > 0 && balZone
      ? `When multiple structural pressures converge on the same operational corridor, delivery coordination becomes dependent on that single area. Program intelligence surfaces this because the pattern is structural — it persists regardless of team composition or sprint planning. Addressing it requires architectural intervention, not process adjustment.`
      : balActivated.length > 0
        ? `Structural pressure concentration creates operational risk that is invisible to conventional project tracking. Program intelligence detects it because the evidence is embedded in the codebase topology, not in delivery metrics.`
        : 'No structural concentration detected. Delivery coordination is not constrained by the current codebase topology.'

    const bz1 = swEnhancedPanel ? balancedBriefing.zones.z1 : null
    const bz3 = swEnhancedPanel ? balancedBriefing.zones.z3 : null

    return (
      <aside className="intel-interp intel-interp--balanced" data-tone={framing.tone} data-sw-intel={swEnhancedPanel || undefined} aria-label="Executive interpretation — operational orientation">
        <div className="interp-tag">
          <span className="interp-tag-label">{framing.label}</span>
          <span className="interp-tag-state">{badge.state_label || '—'}</span>
        </div>

        <div className="interp-block interp-block--lead">
          <div className="interp-section-label">{framing.assessmentLabel}</div>
          <div className="interp-summary">{synthesisText}</div>
        </div>

        <div className="interp-block interp-block--orientation">
          <div className="interp-section-label">Operational orientation</div>
          <div className="interp-orientation-grid">
            <div className="interp-orient-row">
              <span className="interp-orient-key">Posture</span>
              <span className="interp-orient-val" data-tone={balCritical.length > 0 ? 'critical' : balActivated.length > 0 ? 'elevated' : 'nominal'}>
                {balCritical.length > 0 ? 'Pressure concentrated' : balActivated.length > 0 ? 'Load imbalanced' : 'Distributed'}
              </span>
            </div>
            {balZone && balActivated.length > 0 && (
              <div className="interp-orient-row">
                <span className="interp-orient-key">Primary pressure</span>
                <span className="interp-orient-val">{balZone}</span>
              </div>
            )}
            <div className="interp-orient-row">
              <span className="interp-orient-key">Propagation</span>
              <span className="interp-orient-val">{balCritical.length > 1 ? 'Compound — multi-corridor' : balCritical.length > 0 ? 'Concentrated corridor' : 'Within parameters'}</span>
            </div>
            {swEnhancedPanel && bz3 && (
              <div className="interp-orient-row">
                <span className="interp-orient-key">Primary consequence</span>
                <span className="interp-orient-val">{bz3.title}</span>
              </div>
            )}
            {swEnhancedPanel && bz1 && (
              <div className="interp-orient-row">
                <span className="interp-orient-key">Consequences</span>
                <span className="interp-orient-val">{bz1.consequence_count} active</span>
              </div>
            )}
            <div className="interp-orient-row">
              <span className="interp-orient-key">Confidence</span>
              <span className="interp-orient-val">{confLabel}</span>
            </div>
            <div className="interp-orient-row">
              <span className="interp-orient-key">Grounding</span>
              <span className="interp-orient-val">{backed} of {totalDomains} domains confirmed</span>
            </div>
            <div className="interp-orient-row">
              <span className="interp-orient-key">Implication</span>
              <span className="interp-orient-val">{balCritical.length > 0 ? 'Delivery coordination constrained' : balActivated.length > 0 ? 'Structural attention required' : 'No immediate constraint'}</span>
            </div>
          </div>
        </div>

        <div className="interp-block">
          <div className="interp-section-label">{framing.whyLabel}</div>
          <div className="interp-why">{whyText}</div>
        </div>
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

  const structuralContext = useMemo(() => {
    if (!fullReport || !activeZoneKey) return null
    const sigs = fullReport.signal_interpretations || []
    const isDerived = sigs.length > 0 && sigs[0] && sigs[0].derived_from
    const hasRecon = fullReport.reconciliation_summary && fullReport.reconciliation_summary.available
    const se = fullReport.structural_enrichment || {}
    const hasCodeGraph = !!(se.code_graph || se.centrality)
    const hasFrag = !!(se.fragility_surface)
    const runtimeSigCount = sigs.filter(s => s.signal_family === 'RSIG').length
    const qualifier = fullReport.qualifier_class || 'unknown'
    const isS1 = isDerived || qualifier === 'Q-04' || qualifier === 'Q-03'
    const substrate = isS1 ? 'structural substrate' : 'governed semantic topology'
    const signalSource = isDerived ? 'derived from structural enrichment and runtime connectivity' : 'canonical PSIG/DPSIG/ISIG signal registry'
    const reconNote = hasRecon ? 'Semantic reconciliation available.' : 'Semantic reconciliation not yet established.'

    const ZONE_CONTEXT = {
      clusterConcentration: {
        whyThisView: isS1
          ? 'This view shows structural cluster distribution because this specimen is S1 / structurally qualified. Domain cognition is calibrated from the code graph, but governed semantic narrative binding is not yet established.'
          : 'This view shows cluster distribution across governed semantic domains. Structural mass concentration is visible at full semantic resolution.',
        limitation: isS1 ? 'Cluster labels reflect calibrated directory topology, not S2 business-domain narrative.' : null,
        nextStep: isS1 ? 'S2 qualification would add governed semantic domain binding and narrative signal decomposition.' : null,
      },
      signalAssessment: {
        whyThisView: isDerived
          ? `This view shows derived structural and runtime signals because the S2 signal registry is not populated for this specimen. ${runtimeSigCount > 0 ? `${runtimeSigCount} runtime signal${runtimeSigCount !== 1 ? 's' : ''} from connectivity evidence are included.` : ''} Conditions are synthesized from structural enrichment.`
          : `This view shows canonical signal assessment from the governed signal registry. ${sigs.length} signals across PSIG, DPSIG, and ISIG families.`,
        limitation: isDerived ? 'Signal grouping reflects condition types, not governed signal families. Full decomposition requires S2 signal registry.' : null,
        nextStep: isDerived ? 'S2 qualification would populate PSIG/DPSIG/ISIG signal families with governed per-signal interpretation.' : null,
      },
      topologySurface: {
        whyThisView: `This view shows ${substrate} evidence from ${hasCodeGraph ? 'code graph and centrality decomposition' : 'directory topology'}. Structural authority (import hubs, inheritance spines) is ${hasCodeGraph ? 'visible' : 'not yet resolved'}.`,
        limitation: isS1 ? 'Topology reflects structural code relationships. Semantic domain narrative requires S2 binding.' : null,
        nextStep: !hasCodeGraph ? 'Code graph enrichment (40.3s) would add resolved import authority and centrality metrics.' : null,
      },
      behavioralClassView: {
        whyThisView: `Conditions are organized into behavioral classes from the ${substrate}. ${isDerived ? 'All classes are derived from structural enrichment and runtime evidence — not from governed signal patterns.' : 'Classes reflect governed condition patterns from canonical signals.'}`,
        limitation: null,
        nextStep: null,
      },
      semanticTopology: {
        whyThisView: isS1
          ? 'This view shows structural topology because semantic domain binding is not yet established. Cluster-to-domain mapping uses calibrated directory structure.'
          : `This view shows governed semantic topology. ${reconNote}`,
        limitation: isS1 ? 'Domain names reflect directory structure, not governed business semantics.' : null,
        nextStep: isS1 ? 'Semantic topology model (41.x) would establish governed domain-to-cluster binding.' : null,
      },
      propagationFlow: {
        whyThisView: `Propagation structure shows structural dependency flow through the ${substrate}. ${isS1 ? 'Flow is derived from import topology, not semantic narrative.' : 'Flow reflects governed semantic propagation chains.'}`,
        limitation: isS1 ? 'Propagation roles (origin/pass-through/receiver) are structurally inferred.' : null,
        nextStep: null,
      },
      pressureZoneFocus: {
        whyThisView: `Pressure concentration is derived from the ${substrate}. ${hasFrag ? 'Fragility and constriction surfaces are active.' : 'Fragility surface is not available.'} ${runtimeSigCount > 0 ? 'Runtime connectivity evidence contributes to pressure assessment.' : ''}`,
        limitation: null,
        nextStep: null,
      },
      governanceLifecycle: {
        whyThisView: `Governance lifecycle reflects the current qualification state (${qualifier}). ${hasRecon ? 'Semantic reconciliation is available but may not be fully exercised.' : 'No governance lifecycle artifacts are present.'} ${isS1 ? 'This specimen has not entered governed semantic qualification.' : 'Qualification progression is active.'}`,
        limitation: null,
        nextStep: null,
      },
      absorptionLoad: {
        whyThisView: `Absorption load shows modules that absorb structural stress from surrounding components. This is derived from ${hasCodeGraph ? 'code graph cohesion and coupling analysis' : 'structural topology'}.`,
        limitation: null,
        nextStep: null,
      },
    }
    const ctx = ZONE_CONTEXT[activeZoneKey]
    if (!ctx) return null
    return {
      stateLabel: isS1 ? `${qualifier} · Structural substrate` : `${qualifier} · ${hasRecon ? 'Semantic topology' : 'Structural topology'}`,
      signalLabel: isDerived ? 'Derived signals' : sigs.length > 0 ? 'Canonical signals' : 'No signals',
      ...ctx,
    }
  }, [fullReport, activeZoneKey])

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

        <details className="interp-context-secondary" open={!!structuralContext}>
          <summary className="interp-context-secondary-toggle">STRUCTURAL CONTEXT</summary>
          {structuralContext && (
            <>
              <div className="interp-block interp-block--signal-context">
                <div className="interp-signal-context-row">
                  <span className="interp-signal-context-qualifier">{structuralContext.stateLabel}</span>
                  <span className="interp-signal-context-state">{structuralContext.signalLabel}</span>
                </div>
                <div className="interp-structural-context-body">{structuralContext.whyThisView}</div>
                {structuralContext.limitation && (
                  <div className="interp-signal-context-note">{structuralContext.limitation}</div>
                )}
                {structuralContext.nextStep && (
                  <div className="interp-signal-context-note">{structuralContext.nextStep}</div>
                )}
              </div>
            </>
          )}
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

  if (densityClass === 'OPERATOR_DENSE') {
    const ts = (fullReport && fullReport.topology_summary) || {}
    const gl = (fullReport && fullReport.governance_lifecycle) || {}
    const backed = ts.structurally_backed_count || 0
    const total = ts.semantic_domain_count || 0
    return (
      <aside className="intel-interp intel-interp--operator-orientation" data-tone={framing.tone} aria-label="Operator orientation">
        <div className="interp-tag">
          <span className="interp-tag-label">{framing.label}</span>
          <span className="interp-tag-state"><TermHint term="Executive Ready">{badge.state_label || '—'}</TermHint></span>
        </div>

        <div className="interp-block interp-block--lead">
          <div className="interp-section-label">SPECIMEN OVERVIEW</div>
          <div className="interp-synthesis">
            {total > 0 ? <>{total} domains · {ts.cluster_count || 0} clusters · {backed}/{total} <TermHint term="structurally backed">structurally backed</TermHint></> : 'Structural data loading'}
          </div>
        </div>

        {gl.available && (
          <div className="interp-block">
            <div className="interp-section-label">GOVERNANCE STATE</div>
            <div className="interp-synthesis"><TermHint term={gl.s_level}>{gl.s_level || '—'}</TermHint> · {(gl.qualification_provenance || '—').replace(/_/g, ' ')}</div>
          </div>
        )}

        {activatedSignals.length > 0 && (
          <div className="interp-block">
            <div className="interp-section-label">SIGNAL POSTURE</div>
            <div className="interp-synthesis">{activatedSignals.length} elevated signal{activatedSignals.length !== 1 ? 's' : ''} across the structural topology</div>
          </div>
        )}

        {swIntelActive && activeConditions && activeConditions.length > 0 ? (
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
            <div className="interp-module-teaser-text">{swIntelTeaser.active_count} {swIntelTeaser._structural_only ? 'structural' : 'operational'} condition{swIntelTeaser.active_count !== 1 ? 's' : ''} detected</div>
            <div className="interp-module-teaser-cta">Activate Software Intelligence for operational posture</div>
          </div>
        ) : null}
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
      {narrative.structural_summary && densityClass === 'EXECUTIVE_BALANCED' && framing.structuralLabel && (
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
            <div className="interp-module-teaser-text">{swIntelTeaser.active_count} {swIntelTeaser._structural_only ? 'structural' : 'operational'} condition{swIntelTeaser.active_count !== 1 ? 's' : ''} detected</div>
            {consequenceTeaser && consequenceTeaser.consequence_teaser && (
              <div className="interp-module-teaser-consequence">{consequenceTeaser.consequence_teaser.active_consequence_count} structural dynamic{consequenceTeaser.consequence_teaser.active_consequence_count !== 1 ? 's' : ''} identified — {consequenceTeaser.consequence_teaser.top_consequence_severity} severity</div>
            )}
            <div className="interp-module-teaser-cta">Activate Software Intelligence for operational posture</div>
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
    : sigs.length > 0 ? `Structural assessment found no elevated signals — all ${sigs.length} structural indicators are within normal parameters.` : 'Signal layer not yet populated for this specimen.'

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

const BALANCED_SIGNAL_LABELS = {
  'PSIG-001': 'Dependency Hub Concentration',
  'PSIG-002': 'Cross-Domain Coordination Load',
  'PSIG-004': 'Resilience Exposure',
  'PSIG-006': 'Structural Coverage Gaps',
  'ISIG-001': 'Dependency Choke Point',
  'ISIG-002': 'Asymmetric Change Propagation',
  'DPSIG-031': 'Load Concentration',
  'DPSIG-032': 'Coordination Responsibility Imbalance',
}

function balancedSignalLabel(s) {
  return BALANCED_SIGNAL_LABELS[s.signal_id] || s.signal_name || s.signal_id
}

function BalancedConsequenceBriefing({ briefing }) {
  const { z1, z2, z3, z4, z5 } = briefing.zones

  return (
    <div className="balanced-briefing-corridor">
      <section className="balanced-briefing-posture">
        <h2 className="balanced-briefing-headline">{z1.headline}</h2>
        <p className="balanced-briefing-dynamics">{z1.dynamics}</p>
        {z1.chips.length > 0 && (
          <div className="balanced-briefing-chips">
            {z1.chips.map((c, i) => (
              <span key={i} className="balanced-briefing-chip" data-tone={c.tone}>{c.label}</span>
            ))}
          </div>
        )}
      </section>

      <section className="balanced-briefing-primary-story">
        <div className="balanced-briefing-story-anchor">
          <span className="balanced-briefing-story-label">{z3.anchorName}</span>
          <span className="balanced-briefing-story-subtitle">{z3.subtitle}</span>
        </div>
        {z3.title && <div className="balanced-briefing-story-title">{z3.title}</div>}
        {z3.text && <div className="balanced-briefing-story-text">{z3.text}</div>}
        {z3.is_combination && z3.contributing_condition_types && z3.contributing_condition_types.length > 0 && (
          <div className="balanced-briefing-combination-chain">
            <div className="balanced-briefing-combination-flow">
              {z3.contributing_condition_types.map((ct, i) => (
                <span key={ct.condition_type}>
                  {i > 0 && <span className="balanced-briefing-combination-op"> + </span>}
                  <span className="balanced-briefing-combination-primitive">{ct.executive_name}</span>
                </span>
              ))}
              <span className="balanced-briefing-combination-op"> → </span>
              <span className="balanced-briefing-combination-result" data-pattern={z3.combination_pattern}>{z3.title}</span>
            </div>
            {z3.combination_explanation && (
              <div className="balanced-briefing-combination-explanation">{z3.combination_explanation}</div>
            )}
            {z3.escalation_applied && z3.escalation_reason && (
              <div className="balanced-briefing-combination-escalation">{z3.escalation_reason}</div>
            )}
          </div>
        )}
        {!z3.is_combination && z3.source_conditions && z3.source_conditions.length > 0 && (
          <div className="balanced-briefing-source-conditions">
            {z3.source_conditions.map((sc, i) => (
              <span key={i} className="balanced-briefing-source-condition">{sc.display_title}</span>
            ))}
          </div>
        )}
        {z3.facts && z3.facts.length > 0 && (
          <div className="balanced-briefing-facts">
            {z3.facts.map((f, i) => (
              <div key={i} className="balanced-briefing-fact" data-tone={f.tone}>
                <span className="balanced-briefing-fact-key">{f.key}</span>
                <span className="balanced-briefing-fact-value">{f.value}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {z2.entries.length > 0 && (
        <section className="balanced-briefing-reinforcement">
          <div className="balanced-briefing-reinforcement-header">
            <span className="balanced-briefing-reinforcement-label">REINFORCEMENT FLOW</span>
            <span className="balanced-briefing-reinforcement-count">{z2.condition_count_label}</span>
          </div>
          {z2.convergence && (
            <div className="balanced-briefing-convergence">{z2.convergence}</div>
          )}
          <div className="balanced-briefing-flow">
            {z2.entries.map((entry, i) => (
              <div key={i} className="balanced-briefing-flow-entry" data-verb={entry.relationship_verb}>
                <span className="balanced-briefing-flow-verb">{entry.relationship_verb}</span>
                <div className="balanced-briefing-flow-content">
                  <span className="balanced-briefing-flow-title">{entry.title}</span>
                  <span className="balanced-briefing-flow-sentence">{entry.relationship_sentence}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="balanced-briefing-confidence">
        <div className="balanced-briefing-confidence-text">{z4.statement}</div>
        <div className="balanced-briefing-confidence-bar">
          <div className="balanced-briefing-bar-track">
            <div className="balanced-briefing-bar-fill" style={{ width: `${z4.bar.confirmedPercent}%` }} />
          </div>
          <div className="balanced-briefing-bar-labels">
            <span className="balanced-briefing-bar-confirmed">{z4.bar.confirmedLabel}</span>
            {z4.semanticOnly > 0 && (
              <span className="balanced-briefing-bar-advisory">{z4.bar.advisoryLabel}</span>
            )}
          </div>
        </div>
      </section>

      <section className="balanced-briefing-descent">
        {z5.paths.map((p, i) => (
          <div key={i} className="balanced-briefing-descent-path">
            <span className="balanced-briefing-descent-target">{p.label}</span>
            <span className="balanced-briefing-descent-desc">{p.description}</span>
          </div>
        ))}
      </section>
    </div>
  )
}

function BalancedPressureAnchor({ fullReport }) {
  const ps = (fullReport && fullReport.propagation_summary) || {}
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  const ts = (fullReport && fullReport.topology_summary) || {}
  const dpsig = (fullReport && fullReport.dpsig_signal_summary) || {}
  const nb = (dpsig && dpsig.normalization_basis) || {}
  const zoneName = ps.primary_zone_business_label
  if (!zoneName) return null

  const activated = sigs.filter(s => s.severity !== 'NOMINAL')
  const critHigh = activated.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
  const severityTier = critHigh.length > 0 ? 'HIGH' : activated.length > 0 ? 'ELEVATED' : 'NOMINAL'
  const origin = nb.max_cluster_name || 'unknown'
  const massNodes = nb.max_cluster_node_count || '—'
  const totalNodes = nb.total_structural_node_count || '—'
  const backed = ts.structurally_backed_count || 0
  const totalDomains = ts.semantic_domain_count || 0
  const semanticOnly = ts.semantic_only_count || Math.max(0, totalDomains - backed)

  return (
    <div className="balanced-zone balanced-zone--anchor" data-tier={severityTier}>
      <div className="balanced-anchor-label">Operational Epicenter</div>
      <div className="balanced-anchor-zone-name">{zoneName}</div>
      <div className="balanced-anchor-subtitle">Pressure anchor · {origin} origin</div>
      <p className="balanced-anchor-statement">
        The pressure themes above resolve into one operational anchor. {zoneName} concentrates structural mass, dependency load, and propagation exposure around the {origin} execution corridor.
      </p>

      <div className="balanced-anchor-visual">
        <span className="balanced-anchor-visual-origin">{origin}</span>
        <span className="balanced-anchor-visual-arrow">──▸</span>
        <span className="balanced-anchor-visual-target">{zoneName}</span>
      </div>
      <div className="balanced-anchor-visual-role">PRIMARY PRESSURE ANCHOR</div>

      <div className="balanced-anchor-chips">
        <span className="balanced-anchor-chip">Mass concentration</span>
        <span className="balanced-anchor-chip">Dependency load</span>
        <span className="balanced-anchor-chip">Architectural binding</span>
        <span className="balanced-anchor-chip">Pressure convergence</span>
      </div>

      <div className="balanced-anchor-facts">
        <div className="balanced-anchor-fact"><span className="balanced-anchor-fact-key">Structural origin</span><span className="balanced-anchor-fact-val">{origin}</span></div>
        <div className="balanced-anchor-fact"><span className="balanced-anchor-fact-key">Structural mass</span><span className="balanced-anchor-fact-val">{massNodes} / {totalNodes} nodes</span></div>
        <div className="balanced-anchor-fact"><span className="balanced-anchor-fact-key">Activation</span><span className="balanced-anchor-fact-val">{activated.length} signals</span></div>
        <div className="balanced-anchor-fact"><span className="balanced-anchor-fact-key">Severity</span><span className="balanced-anchor-fact-val" data-tone={critHigh.length > 0 ? 'critical' : 'elevated'}>{critHigh.length} critical/high</span></div>
        <div className="balanced-anchor-fact"><span className="balanced-anchor-fact-key">Grounding</span><span className="balanced-anchor-fact-val">{backed} / {totalDomains} domains backed</span></div>
        <div className="balanced-anchor-fact"><span className="balanced-anchor-fact-key">Advisory scope</span><span className="balanced-anchor-fact-val">{semanticOnly} semantic-only domains</span></div>
      </div>

      <p className="balanced-anchor-meaning">
        This is not a single failing component. It is a compound pressure anchor: multiple structural pressures concentrate around the same execution region, making delivery coordination dependent on this area.
      </p>
    </div>
  )
}

function BalancedPressureSynthesis({ signals, pressureZone }) {
  const activated = (signals || []).filter(s => s.severity !== 'NOMINAL')
  if (activated.length === 0) return null

  const depSignals = activated.filter(s => {
    const id = s.signal_id || ''
    return id.startsWith('PSIG') || id.startsWith('ISIG')
  })
  const loadSignals = activated.filter(s => {
    const id = s.signal_id || ''
    return id.startsWith('DPSIG')
  })

  const zone = pressureZone || 'the primary zone'

  return (
    <div className="balanced-zone balanced-zone--synthesis">
      <div className="balanced-zone-label">Pressure Synthesis</div>
      {depSignals.length > 0 && (
        <div className="balanced-synthesis-theme">
          <div className="balanced-synthesis-theme-label">Dependency concentration</div>
          <p className="balanced-synthesis-theme-text">
            {depSignals.length >= 3
              ? `Dependencies, propagation paths, and structural coupling all converge on ${zone}. Changes in this area carry disproportionate downstream impact across multiple operational domains.`
              : depSignals.length >= 2
                ? `Dependencies and propagation paths converge on ${zone}. Changes here propagate beyond the immediate area.`
                : `A structural dependency corridor runs through ${zone}, creating concentrated downstream exposure.`}
          </p>
        </div>
      )}
      {loadSignals.length > 0 && (
        <div className="balanced-synthesis-theme">
          <div className="balanced-synthesis-theme-label">Load imbalance</div>
          <p className="balanced-synthesis-theme-text">
            {loadSignals.length >= 2
              ? `${zone} carries the dominant share of both structural mass and coordination responsibility. Operational resilience concentrates rather than distributes.`
              : `Structural load concentrates in ${zone} — this area carries disproportionate architectural weight.`}
          </p>
        </div>
      )}
      <div className="balanced-synthesis-count">
        {activated.length} structural signal{activated.length !== 1 ? 's' : ''} compressed into {[depSignals.length > 0, loadSignals.length > 0].filter(Boolean).length} operational pressure theme{[depSignals.length > 0, loadSignals.length > 0].filter(Boolean).length !== 1 ? 's' : ''}
      </div>
      <details className="balanced-synthesis-disclosure">
        <summary className="balanced-synthesis-disclosure-toggle">Show supporting signals</summary>
        <div className="balanced-synthesis-disclosure-body">
          {depSignals.length > 0 && (
            <div className="balanced-synthesis-signal-group">
              <div className="balanced-synthesis-signal-group-label">Dependency concentration</div>
              {depSignals.map(s => {
                const t = translateSignal(s.signal_id)
                const isGap = s.severity !== 'NOMINAL' && t && t.l3_consequence_gap
                return (
                  <div key={s.signal_id} className="balanced-synthesis-signal" data-severity={s.severity}>
                    <span className="balanced-synthesis-signal-name">{balancedSignalLabel(s)}</span>
                    <span className="balanced-synthesis-signal-severity">{s.severity}</span>
                    <div className="balanced-synthesis-signal-tooltip">
                      <div className="balanced-synthesis-signal-tooltip-consequence">{isGap ? t.l3_consequence_gap : (t && t.l3_consequence) || s.interpretation || ''}</div>
                      {t && t.topology_effect && <div className="balanced-synthesis-signal-tooltip-row"><span className="balanced-synthesis-signal-tooltip-label">Topology effect</span>{t.topology_effect}</div>}
                      {s.concentration && <div className="balanced-synthesis-signal-tooltip-row"><span className="balanced-synthesis-signal-tooltip-label">Concentration</span>{s.concentration}</div>}
                      {t && t.governance && <div className="balanced-synthesis-signal-tooltip-row"><span className="balanced-synthesis-signal-tooltip-label">Governance</span>{t.governance}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {loadSignals.length > 0 && (
            <div className="balanced-synthesis-signal-group">
              <div className="balanced-synthesis-signal-group-label">Load imbalance</div>
              {loadSignals.map(s => {
                const t = translateSignal(s.signal_id)
                return (
                  <div key={s.signal_id} className="balanced-synthesis-signal" data-severity={s.severity}>
                    <span className="balanced-synthesis-signal-name">{balancedSignalLabel(s)}</span>
                    <span className="balanced-synthesis-signal-severity">{s.severity}</span>
                    <div className="balanced-synthesis-signal-tooltip">
                      <div className="balanced-synthesis-signal-tooltip-consequence">{(t && t.l3_consequence) || s.interpretation || ''}</div>
                      {t && t.topology_effect && <div className="balanced-synthesis-signal-tooltip-row"><span className="balanced-synthesis-signal-tooltip-label">Topology effect</span>{t.topology_effect}</div>}
                      {s.concentration && <div className="balanced-synthesis-signal-tooltip-row"><span className="balanced-synthesis-signal-tooltip-label">Concentration</span>{s.concentration}</div>}
                      {t && t.governance && <div className="balanced-synthesis-signal-tooltip-row"><span className="balanced-synthesis-signal-tooltip-label">Governance</span>{t.governance}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </details>
    </div>
  )
}

function BalancedConsequenceField({ adapted, blocks, scope, renderState, fullReport, qualifierClass, onAuthorityChange, onEmergenceState, swIntelActive, balancedBriefing }) {
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

  const ps = (fullReport && fullReport.propagation_summary) || {}
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  const pressureZone = ps.primary_zone_business_label || null
  const activated = sigs.filter(s => s.severity !== 'NOMINAL')
  const critical = activated.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH')
  const semantic = Math.max(0, total - grounded)
  const qualLabel = (fullReport && fullReport.qualifier_summary && fullReport.qualifier_summary.label) || qualifierClass || 'Semantic Continuity Only'

  const swEnhanced = swIntelActive && balancedBriefing && balancedBriefing.valid
  const bz = swEnhanced ? balancedBriefing.zones : null

  return (
    <div className="rep-field rep-field--balanced" data-sw-intel={swEnhanced || undefined}>
      <RepModeTag
        label="Executive lens"
        sub={swEnhanced ? 'CTO · operational dynamics and consequence · SW-INTEL active' : 'CTO · operational dynamics and consequence'}
        zones={[
          { id: 'Z1', name: 'Operational Posture' },
          { id: 'Z2', name: 'Pressure Synthesis' },
          { id: 'Z3', name: 'Pressure Anchor' },
        ]}
      />

      {/* Z1 — Operational Posture */}
      <div className="balanced-zone balanced-zone--posture">
        <p className="balanced-posture-statement">
          {critical.length > 0 && pressureZone
            ? `Delivery coordination depends disproportionately on ${pressureZone}. Multiple independent conditions create pressure on this area simultaneously — this is a convergence pattern, not a single root cause.`
            : activated.length > 0 && pressureZone
              ? `Operational load is unevenly distributed, concentrating around ${pressureZone}. Pressure is present but has not reached levels that would constrain delivery coordination.`
              : `Operational dependencies are distributed without disproportionate concentration. No single area dominates delivery coordination.`}
        </p>
        {swEnhanced && bz.z1 && (
          <div className="balanced-sw-enhancement">
            <span className="balanced-sw-enhancement-tag">SW-INTEL</span>
            <p className="balanced-sw-enhancement-text">{bz.z1.dynamics}</p>
          </div>
        )}
        <div className="balanced-posture-chips">
          <span className="balanced-posture-chip" data-tone={critical.length > 0 ? 'critical' : activated.length > 0 ? 'elevated' : 'nominal'}>
            {(badge.readiness_label || '').toLowerCase().includes('qualified') ? 'Qualified' : (badge.readiness_label || '').toLowerCase().includes('ready') ? 'Ready' : (badge.readiness_label || '').toLowerCase().includes('blocked') ? 'Blocked' : 'Diagnostic'}
          </span>
          {pressureZone && activated.length > 0 && (
            <span className="balanced-posture-chip" data-tone="elevated">Pressure-concentrated</span>
          )}
          {semantic > 0 && (
            <span className="balanced-posture-chip" data-tone="muted">Advisory-bound</span>
          )}
        </div>
      </div>

      {/* Z2 — Pressure Synthesis + SW-INTEL Reinforcement Flow */}
      <BalancedPressureSynthesis signals={sigs} pressureZone={pressureZone} />
      {swEnhanced && bz.z2 && bz.z2.entries.length > 0 && (
        <div className="balanced-zone balanced-zone--reinforcement">
          <div className="balanced-sw-enhancement-tag-inline">SW-INTEL · REINFORCEMENT FLOW</div>
          {bz.z2.convergence && (
            <p className="balanced-sw-enhancement-convergence">{bz.z2.convergence}</p>
          )}
          <div className="balanced-sw-reinforcement-flow">
            {bz.z2.entries.map((entry, i) => (
              <div key={i} className="balanced-sw-reinforcement-entry" data-verb={entry.relationship_verb}>
                <span className="balanced-sw-reinforcement-verb">{entry.relationship_verb}</span>
                <div className="balanced-sw-reinforcement-content">
                  <span className="balanced-sw-reinforcement-title">{entry.title}</span>
                  <span className="balanced-sw-reinforcement-sentence">{entry.relationship_sentence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Z3 — Pressure Anchor + SW-INTEL Consequence Story */}
      <BalancedPressureAnchor fullReport={fullReport} />
      {swEnhanced && bz.z3 && (
        <div className="balanced-zone balanced-zone--consequence-story">
          <div className="balanced-sw-enhancement-tag-inline">SW-INTEL · CONSEQUENCE ASSESSMENT</div>
          {bz.z3.title && <div className="balanced-sw-consequence-title">{bz.z3.title}</div>}
          {bz.z3.text && <p className="balanced-sw-consequence-text">{bz.z3.text}</p>}
          {bz.z3.is_combination && bz.z3.contributing_condition_types && bz.z3.contributing_condition_types.length > 0 && (
            <div className="balanced-sw-consequence-combination-chain">
              <div className="balanced-sw-consequence-combination-flow">
                {bz.z3.contributing_condition_types.map((ct, i) => (
                  <span key={ct.condition_type}>
                    {i > 0 && <span className="balanced-sw-consequence-combination-op"> + </span>}
                    <span className="balanced-sw-consequence-combination-primitive">{ct.executive_name}</span>
                  </span>
                ))}
                <span className="balanced-sw-consequence-combination-op"> → </span>
                <span className="balanced-sw-consequence-combination-result" data-pattern={bz.z3.combination_pattern}>{bz.z3.title}</span>
              </div>
              {bz.z3.combination_explanation && (
                <p className="balanced-sw-consequence-combination-explanation">{bz.z3.combination_explanation}</p>
              )}
              {bz.z3.escalation_applied && bz.z3.escalation_reason && (
                <p className="balanced-sw-consequence-escalation">{bz.z3.escalation_reason}</p>
              )}
            </div>
          )}
          {!bz.z3.is_combination && bz.z3.source_conditions && bz.z3.source_conditions.length > 0 && (
            <div className="balanced-sw-consequence-conditions">
              {bz.z3.source_conditions.map((sc, i) => (
                <span key={i} className="balanced-sw-consequence-condition">{sc.display_title}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Z3b — SW-INTEL Behavioral Class Awareness (compact strip — detail lives in DENSE) */}
      {swEnhanced && balancedBriefing.ontology_groups && balancedBriefing.ontology_groups.length > 0 && (
        <div className="balanced-zone balanced-zone--class-awareness">
          <div className="balanced-sw-enhancement-tag-inline">SW-INTEL · BEHAVIORAL DYNAMICS</div>
          <div className="balanced-class-strip">
            {balancedBriefing.ontology_groups.map(grp => (
              <div key={grp.class_id} className="balanced-class-chip">
                <div className="balanced-class-chip-header">
                  <span className="balanced-class-chip-id">{grp.class_id}</span>
                  <span className="balanced-class-chip-name">{grp.class_name}</span>
                  <span className="balanced-class-chip-count">{grp.conditions.length}</span>
                </div>
                <div className="balanced-class-chip-question">{grp.class_question}</div>
              </div>
            ))}
          </div>
          <div className="balanced-class-descent">
            <span className="balanced-class-descent-count">{balancedBriefing.ontology_groups.reduce((s, g) => s + g.conditions.length, 0)} conditions across {balancedBriefing.ontology_groups.length} behavioral classes</span>
            <span className="balanced-class-descent-hint">Inspect individual dynamics in DENSE</span>
          </div>
        </div>
      )}

      {/* Z4 — Confidence Boundary (enhanced when SW-INTEL active) */}
      <div className="balanced-zone balanced-zone--confidence">
        <div className="balanced-confidence-label">Confidence Boundary</div>
        <p className="balanced-confidence-statement">
          {swEnhanced && bz.z4 ? bz.z4.statement : 'Interpretation is advisory-bound outside structurally grounded regions.'}
        </p>
        <div className="balanced-confidence-facts">
          <div className="balanced-confidence-fact"><span className="balanced-confidence-fact-key">Confirmed</span><span className="balanced-confidence-fact-val">{grounded} structurally backed domain{grounded !== 1 ? 's' : ''}</span></div>
          <div className="balanced-confidence-fact"><span className="balanced-confidence-fact-key">Advisory-bound</span><span className="balanced-confidence-fact-val">{semantic} semantic-only domain{semantic !== 1 ? 's' : ''}</span></div>
          <div className="balanced-confidence-fact"><span className="balanced-confidence-fact-key">Qualifier</span><span className="balanced-confidence-fact-val">{qualifierClass || 'Q-03'} / {qualLabel}</span></div>
        </div>
        <div className="balanced-confidence-bar">
          <div className="balanced-confidence-bar-confirmed" style={{ width: `${groundedPct}%` }} />
          <div className="balanced-confidence-bar-advisory" style={{ width: `${100 - groundedPct}%` }} />
        </div>
        <div className="balanced-confidence-bar-labels">
          <span className="balanced-confidence-bar-label">Confirmed {grounded}</span>
          <span className="balanced-confidence-bar-label">Advisory {semantic}</span>
        </div>
      </div>

      {/* Z5 — Descent */}
      <div className="balanced-zone balanced-zone--descent">
        <div className="balanced-descent-label">Descent Paths</div>
        <div className="balanced-descent-cards">
          <div className="balanced-descent-card">
            <div className="balanced-descent-card-title">DENSE</div>
            <div className="balanced-descent-card-desc">Inspect topology cognition and structural signal behavior.</div>
          </div>
          <div className="balanced-descent-card">
            <div className="balanced-descent-card-title">OPERATOR</div>
            <div className="balanced-descent-card-desc">Inspect evidence chain and operational proof.</div>
          </div>
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
            {showTrace ? '▾' : '▸'} {isComposite && condition.contributing_condition_ids && condition.contributing_condition_ids.length > 0
              ? `${condition.contributing_condition_ids.length} contributing condition${condition.contributing_condition_ids.length !== 1 ? 's' : ''}`
              : `${condition.supporting_signal_ids.length} contributing signal${condition.supporting_signal_ids.length !== 1 ? 's' : ''}`}
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

function SynthesizedConditionSection({ fullReport, activeConditionId, onConditionSelect, onConditionIntervention, swIntelActive, swIntelTeaser, consequenceTeaser }) {
  const result = useMemo(() => swIntelActive ? synthesize(fullReport) : null, [fullReport, swIntelActive])

  if (!swIntelActive) {
    if (!swIntelTeaser || swIntelTeaser.active_count === 0) return null
    return (
      <div className="actor actor--synthesized-conditions actor--module-teaser" data-zone-key="signalAssessment">
        <div className="actor-tag">
          <span className="actor-code">SW</span>
          <span className="actor-name">Software Intelligence available · {swIntelTeaser.active_count} {swIntelTeaser._structural_only ? 'structural' : 'operational'} condition{swIntelTeaser.active_count !== 1 ? 's' : ''} detected</span>
        </div>
        <div className="module-teaser-body">
          <div className="module-teaser-headline">Software Intelligence available</div>
          <div className="module-teaser-count">{swIntelTeaser.active_count} {swIntelTeaser._structural_only ? 'structural' : 'operational software'} condition{swIntelTeaser.active_count !== 1 ? 's' : ''} detected.{swIntelTeaser._suppressed_count > 0 ? ` ${swIntelTeaser._suppressed_count} suppressed — evidence authority insufficient.` : ''}</div>
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
          {consequenceTeaser && consequenceTeaser.consequence_teaser && (
            <div className="module-teaser-consequence">{consequenceTeaser.consequence_teaser.active_consequence_count} structural dynamic{consequenceTeaser.consequence_teaser.active_consequence_count !== 1 ? 's' : ''} identified — activate for operational posture</div>
          )}
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

      {activePrimitives.length > 0 && (() => {
        const registry = (fullReport && fullReport.semantic_domain_registry) || []
        const domainRoleMap = {}
        registry.forEach(d => {
          const ROLE_SHORT = { FOUNDATION: 'Foundation', SHARED_LIBRARY: 'Shared Library', EXECUTION_ENGINE: 'Execution Engine', API_BOUNDARY: 'API Boundary', AUTH_BOUNDARY: 'Auth Boundary', TEST_INFRASTRUCTURE: 'Test Infra', CLIENT_INTERFACE: 'Client Interface', STREAMING_INTERFACE: 'Streaming', BUILD_INFRASTRUCTURE: 'Build Infra', APPLICATION_DOMAIN: 'Application', UTILITY: 'Utility' }
          domainRoleMap[d.domain_id] = { name: d.business_label || d.domain_name || d.domain_id, role: d.role_classification ? (ROLE_SHORT[d.role_classification] || d.role_classification.replace(/_/g, ' ')) : null }
        })

        const grouped = {}
        activePrimitives.forEach(c => {
          const key = c.condition_type
          if (!grouped[key]) grouped[key] = { type: key, title: c.operator_cognition_title, peakSeverity: c.severity, conditions: [] }
          grouped[key].conditions.push(c)
          if ((SEVERITY_RANK[c.severity] ?? 5) < (SEVERITY_RANK[grouped[key].peakSeverity] ?? 5)) grouped[key].peakSeverity = c.severity
        })
        const groups = Object.values(grouped).sort((a, b) => (SEVERITY_RANK[a.peakSeverity] ?? 5) - (SEVERITY_RANK[b.peakSeverity] ?? 5))

        if (hasActiveSelection) {
          const selectedCondition = activePrimitives.find(c => c.condition_id === effectiveActiveId)
          if (selectedCondition) return (
            <div className="condition-group" data-group="primitive">
              <SynthesizedConditionEntry condition={selectedCondition} isComposite={false} isActive={true} isCollapsed={false} onSelect={onConditionSelect} onIntervention={onConditionIntervention} />
            </div>
          )
        }

        return (
          <div className="condition-group" data-group="primitive">
            <div className="condition-group-head">
              <span className="condition-group-label">Structural Conditions</span>
              <span className="condition-group-count">{activePrimitives.length} across {groups.length} types</span>
            </div>
            {groups.slice(0, 5).map(g => (
              <div key={g.type} className="condition-grouped-entry" data-severity={g.peakSeverity}>
                <div className="condition-grouped-header" onClick={onConditionSelect ? () => onConditionSelect(g.conditions[0].condition_id) : undefined} style={{ cursor: onConditionSelect ? 'pointer' : 'default' }}>
                  <span className="condition-title">{g.title}</span>
                  <span className="condition-severity" data-severity={g.peakSeverity}>{g.peakSeverity}</span>
                </div>
                <div className="condition-grouped-domains">
                  {g.conditions.map(c => {
                    const did = c.shared_topology_targets?.domains?.[0]
                    const prof = did && domainRoleMap[did]
                    return (
                      <span key={c.condition_id} className="domain-chip" data-severity={c.severity} title={did}>
                        {prof ? prof.name : (c.domain_targets?.[0]?.display_name || did || '?')}
                        {prof?.role && <span className="domain-chip-role">{prof.role}</span>}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
            {groups.length > 5 && (
              <div className="condition-grouped-overflow">+{groups.length - 5} more condition types</div>
            )}
          </div>
        )
      })()}

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

function DenseBehavioralClassView({ ontologyGroups }) {
  const [expanded, setExpanded] = useState(false)
  const totalConditions = ontologyGroups.reduce((s, g) => s + g.conditions.length, 0)
  const classNames = ontologyGroups.map(g => g.class_name)

  return (
    <div className="actor actor--behavioral-class-view" data-zone-key="behavioralClassView">
      <div className="actor-tag">
        <span className="actor-code">BC</span>
        <span className="actor-name">Behavioral Class View · {ontologyGroups.length} classes · {totalConditions} conditions</span>
      </div>
      <div className="dense-class-summary">
        <div className="dense-class-summary-chips">
          {ontologyGroups.map(g => (
            <span key={g.class_id} className="dense-class-summary-chip">
              <span className="dense-class-summary-chip-id">{g.class_id}</span>
              <span className="dense-class-summary-chip-name">{g.class_name}</span>
              <span className="dense-class-summary-chip-count">{g.conditions.length}</span>
            </span>
          ))}
        </div>
        <div className="dense-class-summary-desc">Conditions above reorganized by behavioral pattern — {classNames.join(', ')}.</div>
      </div>
      <button className="dense-class-toggle" type="button" onClick={() => setExpanded(v => !v)}>
        {expanded ? '▾ Collapse behavioral class grouping' : '▸ Expand class-grouped detail'}
      </button>
      {expanded && (
        <div className="dense-class-inventory">
          {ontologyGroups.map(grp => (
            <div key={grp.class_id} className="dense-class-group">
              <div className="dense-class-group-header">
                <span className="dense-class-group-id">CLASS {grp.class_id}</span>
                <span className="dense-class-group-name">{grp.class_name}</span>
                <span className="dense-class-group-count">{grp.conditions.length}</span>
              </div>
              <div className="dense-class-group-question">{grp.class_question}</div>
              <div className="dense-class-group-conditions">
                {grp.conditions.map(cond => (
                  <div key={`${cond.condition_type}--${cond.domain}`} className="dense-class-condition" data-severity={cond.severity}>
                    <div className="dense-class-condition-head">
                      <span className="dense-class-condition-name">{cond.executive_name}</span>
                      <span className="dense-class-condition-domain">{cond.domain}</span>
                      <span className="dense-class-condition-severity" data-severity={cond.severity}>{cond.severity}</span>
                    </div>
                    <div className="dense-class-condition-meaning">{cond.operational_meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DenseTopologyField({ adapted, blocks, scope, fullReport, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, onZoneChange, cognitionOverlay, onPressureZoneClick, activePressureZone, activeConditionId, onConditionSelect, onConditionIntervention, swIntelActive, swIntelTeaser, consequenceTeaser, balancedBriefing, runtimeConnectivityEdges }) {
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

      <SynthesizedConditionSection fullReport={fullReport} activeConditionId={activeConditionId} onConditionSelect={onConditionSelect} onConditionIntervention={onConditionIntervention} swIntelActive={swIntelActive} swIntelTeaser={swIntelTeaser} consequenceTeaser={consequenceTeaser} />

      {swIntelActive && balancedBriefing && balancedBriefing.ontology_groups && balancedBriefing.ontology_groups.length > 0 && (
        <DenseBehavioralClassView ontologyGroups={balancedBriefing.ontology_groups} />
      )}

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
                  runtimeEdges={runtimeConnectivityEdges}
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

function OperatorTraceField({ adapted, blocks, scope, fullReport, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, swIntelSlot }) {
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
    <div className="rep-field rep-field--operator">
      <RepModeTag
        label="Evidence lens"
        sub="Analyst · structural substrate → signals → conditions → governance → lineage"
        zones={[
          { id: 'Z1', name: 'Structural Substrate' },
          { id: 'Z3', name: 'Signal Intelligence' },
          { id: 'Z4', name: 'Domain Cognition' },
          { id: 'Z5', name: 'Governance State' },
          { id: 'Z6', name: 'Evidence Lineage' },
        ]}
      />

      <OperatorReadingGuide />

      {fullReport && fullReport.semantic_domain_registry && fullReport.semantic_domain_registry.length > 0 && (
        <div className="operator-topology-preview" onClick={openTopoModal} role="button" tabIndex={0} aria-label="Open topology explorer" onKeyDown={e => e.key === 'Enter' && openTopoModal()}>
          <TopologyGraph
            domains={fullReport.semantic_domain_registry}
            clusters={fullReport.semantic_cluster_registry || []}
            edges={fullReport.semantic_topology_edges || []}
            pressureZoneLabel={pressureZone}
            pressureZoneState={fullReport.pressure_zone_state}
          />
          <div className="operator-topology-hint">Open forensic topology</div>
        </div>
      )}

      {fullReport && fullReport.structural_enrichment && fullReport.structural_enrichment.available && (
        <StructuralSpinesPanel structuralEnrichment={fullReport.structural_enrichment} />
      )}

      <OperatorSignalIntelligence signalRows={signalRows} fullReport={fullReport} />

      {blocks && blocks.length > 0 && (
        <div className="actor actor--signal-evidence-inline">
          <div className="actor-tag">
            <span className="actor-code">SE</span>
            <span className="actor-name">Signal Evidence · propagation</span>
          </div>
          <div className="evidence-grid">
            {blocks.map((b, i) => {
              const firstCard = b.signal_cards && b.signal_cards[0]
              const pm = firstCard ? (PRESSURE_META[firstCard.pressure_tier] || PRESSURE_META.MODERATE) : null
              const rm = ROLE_META[b.propagation_role] || null
              const isPartial = b.grounding_status && b.grounding_status !== 'Q-00'
              return (
                <div key={b.domain_alias || i} className={`evidence-block${isPartial ? ' evidence-block--partial' : ''}`}>
                  <div className="eb-header">
                    <div className="eb-domain">{b.domain_alias}</div>
                    <div className="eb-tags">
                      {rm && <span className="eb-tag" style={{ color: rm.color }}>{rm.symbol} {rm.label}</span>}
                      {pm && <span className="eb-tag" style={{ color: pm.color }}>{pm.symbol} {pm.label}</span>}
                      {isPartial && <span className="eb-tag eb-tag--partial">PARTIAL</span>}
                    </div>
                  </div>
                  {b.evidence_description && <div className="eb-description">{b.evidence_description}</div>}
                  {firstCard && firstCard.evidence_text && <div className="eb-signal">{firstCard.evidence_text}</div>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {swIntelSlot}

      <InvestigationGovernanceAudit fullReport={fullReport} aliRules={aliRules} qRules={qRules} />

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

      {topoModalOpen && createPortal(<TopologyModal fullReport={fullReport} onClose={closeTopoModal} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} temporalAnalyticsData={temporalAnalyticsData} temporalLifecycleData={temporalLifecycleData} mode="operator" />, document.body)}
    </div>
  )
}

function OperatorSignalIntelligence({ signalRows, fullReport }) {
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  const isigSigs = sigs.filter(s => s.signal_family === 'ISIG')
  const dpsigSigs = sigs.filter(s => !s.signal_family || s.signal_family === 'DPSIG')
  const psigSigs = sigs.filter(s => s.signal_family === 'PSIG')
  const familyCount = (isigSigs.length > 0) + (dpsigSigs.length > 0) + (psigSigs.length > 0)

  if (!sigs.length) return null

  const domainRowMap = {}
  signalRows.forEach(r => {
    const key = r.signal_label
    if (!domainRowMap[key]) domainRowMap[key] = r
  })

  const renderCard = (sig) => {
    const family = sig.signal_family || 'DPSIG'
    const trans = translateSignal(sig.signal_id)
    const title = trans ? trans.l3_title : sig.signal_name
    const domainRow = domainRowMap[sig.signal_name]
    const isNominal = sig.severity === 'NOMINAL' || sig.activation_state === 'NOMINAL' || sig.activation_state === 'CLUSTER_BALANCED'
    return (
      <div key={sig.signal_id} className="osi-card" data-severity={sig.severity} data-family={family}>
        <div className="osi-card-header">
          <span className="osi-card-id">{sig.signal_id}</span>
          <span className="dense-signal-family-tag" data-family={family}>{family}</span>
          <span className="osi-card-severity" data-severity={sig.severity}><TermHint term={sig.severity}>{sig.severity}</TermHint></span>
        </div>
        <div className="osi-card-title"><TermHint term={sig.signal_name}>{title}</TermHint></div>
        <div className="osi-card-value">{sig.signal_value != null ? sig.signal_value.toFixed(4) : '—'}</div>
        <div className="osi-card-interpretation">{sig.interpretation}</div>
        {sig.concentration && <div className="osi-card-concentration">{sig.concentration}</div>}
        {domainRow && (
          <div className="osi-card-domain-context">
            <span className="osi-card-domain-name">{domainRow.domain}</span>
            <span className="osi-card-domain-conf"><TermHint term="Confidence">{domainRow.grounding_label}</TermHint></span>
            {domainRow.grounding_status !== 'Q-00' && <span className="osi-card-domain-advisory"><TermHint term="advisory bound">advisory bound</TermHint></span>}
          </div>
        )}
        {sig.confidence_note && <div className="osi-card-note">{sig.confidence_note}</div>}
      </div>
    )
  }

  const FAMILY_LABELS = {
    ISIG: { label: 'File Structure', hint: 'L1', desc: 'File-level import dependency analysis' },
    DPSIG: { label: 'Topology Distribution', hint: null, desc: 'Cluster-level structural mass distribution' },
    PSIG: { label: 'Architectural Binding', hint: 'L3', desc: 'Cross-domain coupling at architectural level' },
  }

  const renderGroup = (familySigs, familyKey) => {
    if (!familySigs.length) return null
    const fl = FAMILY_LABELS[familyKey]
    return (
      <div key={familyKey} className="osi-family-group" data-family={familyKey}>
        <div className="osi-family-header">
          <span className="osi-family-tag" data-family={familyKey}>{fl.hint ? <TermHint term={fl.hint}>{familyKey}</TermHint> : familyKey}</span>
          <span className="osi-family-label">{fl.label}</span>
          <span className="osi-family-count">{familySigs.length}</span>
        </div>
        <div className="osi-family-cards">
          {familySigs.map(renderCard)}
        </div>
      </div>
    )
  }

  return (
    <div className="actor actor--signal-intelligence">
      <div className="actor-tag">
        <span className="actor-code">SI</span>
        <span className="actor-name">Signal Intelligence · {sigs.length} signals across {familyCount} {familyCount === 1 ? 'family' : 'families'}</span>
      </div>
      {renderGroup(isigSigs, 'ISIG')}
      {renderGroup(dpsigSigs, 'DPSIG')}
      {renderGroup(psigSigs, 'PSIG')}
    </div>
  )
}

function InvestigationGovernanceAudit({ fullReport, aliRules, qRules }) {
  const [forensicsOpen, setForensicsOpen] = useState(false)
  const gl = fullReport && fullReport.governance_lifecycle
  const pc = fullReport && fullReport.proposition_corpus
  const ei = fullReport && fullReport.enrichment_intelligence
  const rv = fullReport && fullReport.revalidation_intelligence
  const ca = fullReport && fullReport.constitutional_anchor
  const ci = fullReport && fullReport.convergence_intelligence
  const cc = fullReport && fullReport.chronicle_certification

  if (!gl || !gl.available) return null

  const deepForensicsCount = [pc && pc.available, ca && ca.available, rv && rv.available, ei && ei.available, ci && ci.available, cc && cc.available].filter(Boolean).length

  return (
    <div className="actor actor--operator-governance">
      <div className="actor-tag">
        <span className="actor-code">GA</span>
        <span className="actor-name">Governance Audit · {gl.s_level}{deepForensicsCount > 0 ? ` · ${deepForensicsCount} forensic sections` : ''}</span>
      </div>

      <div className="inv-gov-section">
        <div className="inv-gov-section-head">Governance Lifecycle</div>
        <table className="inv-gov-table">
          <tbody>
            <tr><td className="inv-gov-key">S-Level</td><td className="inv-gov-val"><TermHint term={gl.s_level}>{gl.s_level}</TermHint></td></tr>
            <tr><td className="inv-gov-key"><TermHint term="Provenance">Provenance</TermHint></td><td className="inv-gov-val"><TermHint term="Qualified">{(gl.qualification_provenance || '—').replace(/_/g, ' ')}</TermHint></td></tr>
            <tr><td className="inv-gov-key"><TermHint term="Authority ceiling">Authority ceiling</TermHint></td><td className="inv-gov-val">{gl.authority_ceiling || '—'}</td></tr>
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

      {deepForensicsCount > 0 && (
        <button className="inv-gov-forensics-toggle" onClick={() => setForensicsOpen(p => !p)} type="button" aria-expanded={forensicsOpen}>
          <span className="inv-gov-forensics-toggle-icon">{forensicsOpen ? '▾' : '▸'}</span>
          Deep Governance Forensics ({deepForensicsCount} sections)
        </button>
      )}

      {forensicsOpen && pc && pc.available && (
        <div className="inv-gov-section">
          <div className="inv-gov-section-head">Proposition Corpus ({pc.total})</div>
          <div className="inv-gov-grid">
            <div className="inv-gov-stat"><span className="inv-gov-stat-val">{pc.disposition_counts.accepted}</span><span className="inv-gov-stat-label"><TermHint term="Accepted">Accepted</TermHint></span></div>
            <div className="inv-gov-stat"><span className="inv-gov-stat-val inv-gov-stat-val--reject">{pc.disposition_counts.rejected}</span><span className="inv-gov-stat-label"><TermHint term="Rejected">Rejected</TermHint></span></div>
            <div className="inv-gov-stat"><span className="inv-gov-stat-val inv-gov-stat-val--arb">{pc.disposition_counts.arbitrated}</span><span className="inv-gov-stat-label"><TermHint term="Arbitrated">Arbitrated</TermHint></span></div>
            <div className="inv-gov-stat"><span className="inv-gov-stat-val">{pc.disposition_counts.contested}</span><span className="inv-gov-stat-label"><TermHint term="Contested">Contested</TermHint></span></div>
          </div>
          <table className="inv-gov-table">
            <tbody>
              <tr><td className="inv-gov-key">Mean confidence</td><td className="inv-gov-val">{pc.mean_confidence.toFixed(4)}</td></tr>
              <tr><td className="inv-gov-key"><TermHint term="Friction rate">Friction rate</TermHint></td><td className="inv-gov-val">{(pc.governance_friction_rate * 100).toFixed(2)}%</td></tr>
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

      {forensicsOpen && ca && ca.available && (
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

      {forensicsOpen && rv && rv.available && (
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

      {forensicsOpen && ei && ei.available && (
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

      {forensicsOpen && ci && ci.available && (
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

      {forensicsOpen && cc && cc.available && (
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
        <div className="inv-gov-footer-statement">All governance data derived from governed artifacts. No interpretation applied. Evidence lineage preserved.</div>
        <div className="inv-gov-footer-statement">This surface presents structurally derived evidence only. All outputs are deterministic, traceable, and bound by the governance framework. No inference, ranking, or AI-generated assessment has been applied.</div>
        {((aliRules && aliRules.length > 0) || (qRules && qRules.length > 0)) && (
          <div className="inv-gov-footer-rules">
            {qRules && qRules.length > 0 && <span className="inv-gov-footer-rule-set">Qualifier rules: {qRules.join(', ')}</span>}
            {aliRules && aliRules.length > 0 && <span className="inv-gov-footer-rule-set">ALI rules: {aliRules.join(', ')}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

function CockpitRadialGauge({ score, groundingPct, governedLevel, tensionPct, governanceLabel }) {
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
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="8" fill="#6a7a9a" letterSpacing="0.15em" fontFamily="-apple-system, sans-serif">{governanceLabel || 'GOVERNED'}</text>
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
    { label: 'Evidence availability', value: evidenceLabel, tone: sourceCount > 0 ? 'ok' : 'gap', target: 'OPERATOR_DENSE' },
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
          <button className="posture-card-transition" type="button" onClick={() => onModeTransition('OPERATOR_DENSE', domainId)}>
            Open operator workspace <span className="posture-card-transition-arrow">→</span>
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

const VERIFICATION_STEP_NAMES = {
  PROJECTION_DISPOSITION: 'Projection Disposition Contract',
  EVIDENCE_ANCHOR: 'Evidence Anchor Verification',
  DERIVATION_TRACE: 'Derivation Trace Replay',
  CONSEQUENCE_RULES: 'Consequence Rule Verification',
  COMBINATION_PATTERNS: 'Combination Pattern Verification',
  COMPILATION_INTEGRITY: 'Compilation Integrity',
}

const VERDICT_LABELS = {
  VERIFIED: 'Verified',
  PARTIALLY_VERIFIED: 'Partial',
  VERIFICATION_FAILED: 'Failed',
  CANNOT_INVESTIGATE: 'No target',
}

const REPLAY_VERDICT_LABELS = {
  REPLAY_MATCH: 'Deterministic match',
  REPLAY_DIVERGENCE: 'Divergence detected',
  REPLAY_ERROR: 'Replay error',
  INSUFFICIENT: 'Replay unavailable',
}

function summarizeStep(step, proofData) {
  const fc = step.failures.length
  if (step.verdict === 'INSUFFICIENT') return 'Insufficient evidence for verification'
  if (step.verdict === 'FAIL') return `${fc} failure${fc !== 1 ? 's' : ''} detected`
  if (!proofData) return 'Passed'
  switch (step.name) {
    case 'PROJECTION_DISPOSITION': {
      const cc = step.condition_count || 0
      const exempt = (step.results || []).reduce((n, r) => n + (r.exempt || []).length, 0)
      return `${cc} condition types · ${cc - step.failures.length} complete · ${exempt} exempt`
    }
    case 'EVIDENCE_ANCHOR': {
      const allCsqs = [...(proofData.consequences || []), ...(proofData.atomic_consequences || [])]
      let refCount = 0
      let sigCount = 0
      for (const c of allCsqs) {
        refCount += (c.evidence_refs || []).length
        sigCount += (c.source_signal_ids || []).length
      }
      return `${refCount} evidence refs · ${sigCount} signal refs · 0 orphaned`
    }
    case 'DERIVATION_TRACE': {
      const traces = (proofData.consequences || []).filter(c => c.derivation_trace && c.derivation_trace.length > 0)
      const ruleSet = new Set()
      for (const c of traces) for (const t of c.derivation_trace) ruleSet.add(t.rule)
      return `${traces.length} traces complete · rules: ${[...ruleSet].join(', ') || 'none'}`
    }
    case 'CONSEQUENCE_RULES': {
      const atomics = proofData.atomic_consequences || []
      return `${atomics.length} atomics checked against §4 · 0 invalid`
    }
    case 'COMBINATION_PATTERNS': {
      const combos = (proofData.consequences || []).filter(c => c.combination_pattern)
      return `${combos.length} combination${combos.length !== 1 ? 's' : ''} checked against §5.2`
    }
    case 'COMPILATION_INTEGRITY': {
      const trace = proofData.compilation_trace || {}
      return `${trace.input_condition_count || 0} inputs · ${proofData.consequence_count || 0} outputs · ordering valid · primary confirmed`
    }
    default: return 'Passed'
  }
}

function CognitionNodeExplanation({ nodeId, compact }) {
  const resolved = resolveNode(nodeId)
  if (!resolved) return null
  const { ontology } = resolved
  const connections = resolveConnections(nodeId)
  return (
    <div className="vp-explanation">
      <div className="vp-explanation-name">{ontology.human_name}</div>
      <div className="vp-explanation-text">{ontology.what_it_means}</div>
      <div className="vp-operational-implication">{ontology.operational_implication}</div>
      {!compact && connections && (
        <div className="vp-graph-context">
          {connections.upstream.length > 0 && (
            <span className="vp-graph-direction">
              <span className="vp-graph-arrow">{'←'}</span>
              {connections.upstream.map((u, i) => (
                <span key={u.ref}>{i > 0 && ' · '}<span className="vp-graph-ref" data-ref={u.ref}>{u.human_name}</span></span>
              ))}
            </span>
          )}
          {connections.downstream.length > 0 && (
            <span className="vp-graph-direction">
              <span className="vp-graph-arrow">{'→'}</span>
              {connections.downstream.map((d, i) => (
                <span key={d.ref}>{i > 0 && ' · '}<span className="vp-graph-ref" data-ref={d.ref}>{d.human_name}</span></span>
              ))}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function EvidenceAnchorProof({ proofData }) {
  const allCsqs = [...(proofData.consequences || []), ...(proofData.atomic_consequences || [])]
  const seen = new Set()
  const unique = allCsqs.filter(c => { if (seen.has(c.consequence_id)) return false; seen.add(c.consequence_id); return true })
  return (
    <div className="vp-proof-table">
      <div className="vp-proof-row vp-proof-row--header">
        <span className="vp-proof-cell vp-proof-cell--id">CONSEQUENCE</span>
        <span className="vp-proof-cell vp-proof-cell--wide">EVIDENCE REFS</span>
        <span className="vp-proof-cell">SIGNAL REFS</span>
      </div>
      {unique.map(csq => (
        <div key={csq.consequence_id} className="vp-proof-row">
          <span className="vp-proof-cell vp-proof-cell--id">{csq.consequence_id}</span>
          <span className="vp-proof-cell vp-proof-cell--wide">
            {(csq.evidence_refs || []).length > 0
              ? (csq.evidence_refs || []).map((ref, i) => <span key={i} className="vp-proof-tag" data-ref-type={ref.type}>{ref.type}:{ref.id}</span>)
              : <span className="vp-proof-none">—</span>}
          </span>
          <span className="vp-proof-cell">
            {(csq.source_signal_ids || []).length > 0
              ? (csq.source_signal_ids || []).map((sid, i) => <span key={i} className="vp-proof-tag">{sid}</span>)
              : <span className="vp-proof-none">—</span>}
          </span>
        </div>
      ))}
    </div>
  )
}

function DerivationTraceProof({ proofData }) {
  const csqs = (proofData.consequences || []).filter(c => c.derivation_trace && c.derivation_trace.length > 0)
  function nodeHumanName(id) {
    const n = resolveNode(id)
    return n ? n.ontology.human_name : null
  }
  function ruleHumanName(rule) {
    const n = resolveNode(rule)
    return n ? n.ontology.human_name : null
  }
  return (
    <div className="vp-proof-traces">
      {csqs.map(csq => (
        <div key={csq.consequence_id} className="vp-proof-trace-block">
          <div className="vp-proof-trace-label">{csq.consequence_id}</div>
          <div className="vp-proof-trace-chain">
            {csq.derivation_trace.map((t, i) => {
              const sourceHuman = i === 0 ? nodeHumanName(t.source_id) : null
              const targetHuman = nodeHumanName(t.target_id)
              const ruleHuman = ruleHumanName(t.rule)
              return (
                <span key={i} className="vp-proof-trace-step">
                  {i === 0 && (
                    <span className="vp-proof-trace-node" data-node-type={t.source_type}>
                      <span className="vp-graph-ref" data-ref={t.source_id}>{t.source_id}</span>
                      {sourceHuman && <span className="vp-proof-trace-human">{sourceHuman}</span>}
                    </span>
                  )}
                  <span className="vp-proof-trace-arrow">→</span>
                  <span className="vp-proof-trace-rule">
                    {t.rule}
                    {ruleHuman && <span className="vp-proof-trace-human">{ruleHuman}</span>}
                  </span>
                  <span className="vp-proof-trace-arrow">→</span>
                  <span className="vp-proof-trace-node" data-node-type={t.target_type}>
                    <span className="vp-graph-ref" data-ref={t.target_id}>{t.target_id}</span>
                    {targetHuman && <span className="vp-proof-trace-human">{targetHuman}</span>}
                  </span>
                </span>
              )
            })}
          </div>
        </div>
      ))}
      {csqs.length === 0 && <div className="vp-proof-none">No derivation traces present</div>}
    </div>
  )
}

function ConsequenceRulesProof({ proofData }) {
  const atomics = proofData.atomic_consequences || []
  const ruleNode = resolveNode('§4')
  return (
    <div className="vp-proof-table">
      {ruleNode && (
        <div className="vp-explanation vp-explanation--rule">
          <div className="vp-explanation-name">{ruleNode.ontology.human_name}</div>
          <div className="vp-explanation-text">{ruleNode.ontology.what_it_means}</div>
        </div>
      )}
      <div className="vp-proof-row vp-proof-row--header">
        <span className="vp-proof-cell vp-proof-cell--id">ATOMIC</span>
        <span className="vp-proof-cell">TYPE</span>
        <span className="vp-proof-cell vp-proof-cell--wide">SOURCE CONDITIONS</span>
        <span className="vp-proof-cell">§4 RULE</span>
      </div>
      {atomics.map(csq => {
        const condTypes = csq.source_condition_types || []
        return (
          <Fragment key={csq.consequence_id}>
            <div className="vp-proof-row">
              <span className="vp-proof-cell vp-proof-cell--id">{csq.consequence_id}</span>
              <span className="vp-proof-cell"><span className="vp-proof-tag">{csq.consequence_type_id}</span></span>
              <span className="vp-proof-cell vp-proof-cell--wide">
                {condTypes.map((ct, i) => {
                  const rules = SECTION_4_RULES[ct]
                  const match = rules && rules.find(r => r.consequence_type === csq.consequence_type_id)
                  return <span key={i} className="vp-proof-tag" data-rule-status={match ? 'valid' : 'unknown'}>{ct}{match ? ` (${match.defining ? 'defining' : 'conditional'})` : ''}</span>
                })}
              </span>
              <span className="vp-proof-cell"><span className="vp-proof-tag">{csq.activation_rule || '§4'}</span></span>
            </div>
            <CognitionNodeExplanation nodeId={csq.consequence_type_id} />
          </Fragment>
        )
      })}
    </div>
  )
}

function CombinationPatternsProof({ proofData }) {
  const combos = (proofData.consequences || []).filter(c => c.combination_pattern)
  const atomicIndex = {}
  for (const a of (proofData.atomic_consequences || [])) atomicIndex[a.consequence_id] = a
  const ruleNode = resolveNode('§5.2')
  return (
    <div className="vp-proof-combinations">
      {ruleNode && (
        <div className="vp-explanation vp-explanation--rule">
          <div className="vp-explanation-name">{ruleNode.ontology.human_name}</div>
          <div className="vp-explanation-text">{ruleNode.ontology.what_it_means}</div>
        </div>
      )}
      {combos.map(combo => {
        const pattern = SECTION_5_2_PATTERNS[combo.combination_pattern]
        const contributingIds = (combo.decomposition && combo.decomposition.contributing_primitive_consequences) || []
        return (
          <div key={combo.consequence_id} className="vp-proof-combo-block">
            <div className="vp-proof-combo-header">
              <span className="vp-proof-tag">{combo.combination_pattern}</span>
              <span className="vp-proof-combo-meta">{combo.consequence_id} · {combo.severity} · {combo.consequence_scope}</span>
            </div>
            {pattern && (
              <div className="vp-proof-combo-rule">
                §5.2 requires: min {pattern.min_contributors} contributors{pattern.escalation ? ' · escalation' : ' · no escalation'}
                {pattern.min_distinct_condition_types ? ` · ${pattern.min_distinct_condition_types} distinct condition types` : ''}
              </div>
            )}
            <div className="vp-proof-combo-contributors">
              <span className="vp-proof-combo-contrib-label">Contributors ({contributingIds.length}):</span>
              {contributingIds.map((cid, i) => {
                const a = atomicIndex[cid]
                return <span key={i} className="vp-proof-tag">{cid}{a ? ` (${a.consequence_type_id})` : ''}</span>
              })}
            </div>
            {combo.escalation_applied && (
              <div className="vp-proof-combo-escalation">Escalation: {combo.severity}{combo.escalation_reason ? ` — ${combo.escalation_reason}` : ''}</div>
            )}
            <CognitionNodeExplanation nodeId={combo.combination_pattern} />
          </div>
        )
      })}
      {combos.length === 0 && <div className="vp-proof-none">No combination patterns</div>}
    </div>
  )
}

function CompilationIntegrityProof({ proofData }) {
  const trace = proofData.compilation_trace || {}
  const csqs = proofData.consequences || []
  const atomics = proofData.atomic_consequences || []
  const combos = csqs.filter(c => c.combination_pattern)
  const escalated = combos.filter(c => c.escalation_applied)
  const systemic = csqs.filter(c => c.consequence_scope === 'SYSTEMIC')
  const rows = [
    ['input_condition_count', trace.input_condition_count, proofData.synthesis_condition_count],
    ['conditions_producing_consequences', trace.conditions_producing_consequences, '—'],
    ['suppressed_conditions', trace.suppressed_conditions, '—'],
    ['combination_patterns_matched', trace.combination_patterns_matched, combos.length],
    ['escalations_applied', trace.escalations_applied, escalated.length],
    ['consequence_count', proofData.consequence_count, csqs.length],
    ['systemic_count', proofData.systemic_count, systemic.length],
    ['primary_consequence', proofData.primary_consequence, csqs.length > 0 ? csqs[0].consequence_id : '—'],
  ]
  return (
    <div className="vp-proof-table">
      <div className="vp-proof-row vp-proof-row--header">
        <span className="vp-proof-cell vp-proof-cell--wide">FIELD</span>
        <span className="vp-proof-cell">CLAIMED</span>
        <span className="vp-proof-cell">ACTUAL</span>
      </div>
      {rows.map(([field, claimed, actual]) => (
        <div key={field} className="vp-proof-row">
          <span className="vp-proof-cell vp-proof-cell--wide vp-proof-cell--mono">{field}</span>
          <span className="vp-proof-cell">{claimed !== undefined && claimed !== null ? String(claimed) : '—'}</span>
          <span className="vp-proof-cell" data-match={String(claimed) === String(actual) ? 'yes' : actual === '—' ? 'skip' : 'no'}>{String(actual)}</span>
        </div>
      ))}
    </div>
  )
}

function ReplayProof({ replay, proofData }) {
  if (!replay) return null
  const trace = proofData ? proofData.compilation_trace || {} : {}
  return (
    <div className="vp-proof-replay">
      {replay.verdict === 'REPLAY_MATCH' && (
        <div className="vp-proof-replay-detail">
          <div className="vp-proof-replay-line">Re-compilation: identical output</div>
          <div className="vp-proof-replay-line">Divergences: 0</div>
          <div className="vp-proof-replay-line">Fields compared: consequence_count, systemic_count, consequence_ids, consequence_types, severities, compilation_trace ({Object.keys(trace).length} fields)</div>
        </div>
      )}
      {replay.verdict === 'REPLAY_DIVERGENCE' && (
        <div className="vp-proof-replay-detail">
          {replay.divergences.map((d, i) => (
            <div key={i} className="vp-proof-replay-divergence">{d}</div>
          ))}
        </div>
      )}
      {replay.verdict === 'REPLAY_ERROR' && (
        <div className="vp-proof-replay-detail">
          <div className="vp-proof-replay-divergence">{replay.error || 'Replay threw an exception'}</div>
        </div>
      )}
      {replay.verdict === 'INSUFFICIENT' && (
        <div className="vp-proof-replay-detail">
          <div className="vp-proof-replay-line">No compile function available for replay verification</div>
        </div>
      )}
    </div>
  )
}

function DispositionProof({ step }) {
  if (!step.results || step.results.length === 0) return null
  return (
    <div className="verification-proof-table">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2px 12px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
        {step.results.map((r, i) => (
          <Fragment key={i}>
            <span style={{ color: r.verdict === 'PASS' ? '#64ffda' : '#ff6b6b' }}>{r.condition_type}</span>
            <span style={{ color: r.verdict === 'PASS' ? 'var(--text-dim)' : '#ff6b6b' }}>
              {r.verdict === 'PASS' ? 'COMPLETE' : `MISSING: ${r.missing.join(', ')}`}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

function StepProofContent({ step, proofData }) {
  switch (step.name) {
    case 'PROJECTION_DISPOSITION': return <DispositionProof step={step} />
    case 'EVIDENCE_ANCHOR': return proofData ? <EvidenceAnchorProof proofData={proofData} /> : null
    case 'DERIVATION_TRACE': return proofData ? <DerivationTraceProof proofData={proofData} /> : null
    case 'CONSEQUENCE_RULES': return proofData ? <ConsequenceRulesProof proofData={proofData} /> : null
    case 'COMBINATION_PATTERNS': return proofData ? <CombinationPatternsProof proofData={proofData} /> : null
    case 'COMPILATION_INTEGRITY': return proofData ? <CompilationIntegrityProof proofData={proofData} /> : null
    default: return null
  }
}

function VerificationStepProof({ step, proofData, expanded, onToggle }) {
  return (
    <div className="verification-step" data-verdict={step.verdict} data-expanded={expanded ? 'true' : 'false'}>
      <div className="verification-step-header" onClick={onToggle}>
        <span className="verification-step-number">STEP {step.step}</span>
        <span className="verification-step-name">{VERIFICATION_STEP_NAMES[step.name] || step.name}</span>
        <span className="verification-step-verdict">{step.verdict}</span>
        <span className="verification-step-expand">{expanded ? '▾' : '▸'}</span>
      </div>
      <div className="verification-step-summary">{summarizeStep(step, proofData)}</div>
      {step.verdict === 'FAIL' && (
        <div className="verification-step-failures">
          {step.failures.map((f, i) => (
            <div key={i} className="verification-failure">
              <span className="verification-failure-type">{f.failure_type}</span>
              <span className="verification-failure-detail">{f.detail}</span>
              <span className="verification-failure-severity">{f.severity}</span>
            </div>
          ))}
        </div>
      )}
      {step.verdict === 'INSUFFICIENT' && (
        <div className="verification-step-insufficient">Insufficient evidence for verification</div>
      )}
      {expanded && proofData && (
        <div className="verification-proof-detail">
          <StepProofContent step={step} proofData={proofData} />
        </div>
      )}
    </div>
  )
}

function VerificationProtocolSection({ verificationState, onClose }) {
  const { result, timestamp, proofData } = verificationState
  const [expandedSteps, setExpandedSteps] = useState(new Set())

  if (!result) return null

  const toggleStep = (key) => {
    setExpandedSteps(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const passCount = result.steps.filter(s => s.verdict === 'PASS').length
  const totalSteps = result.steps.length
  const replayLabel = result.replay ? REPLAY_VERDICT_LABELS[result.replay.verdict] || result.replay.verdict : null

  return (
    <div className="verification-protocol-section">
      <div className="verification-protocol-header">
        <span className="verification-protocol-title">VERIFICATION PROTOCOL</span>
        <button className="verification-protocol-collapse" onClick={onClose} aria-label="Collapse verification" type="button">✕</button>
      </div>

      <div className="verification-verdict" data-verdict={result.verdict}>
        <div className="verification-verdict-label">{result.verdict.replace(/_/g, ' ')}</div>
        <div className="verification-verdict-meta">
          <span>{passCount}/{totalSteps} steps passed</span>
          {replayLabel && <span> · {replayLabel.toLowerCase()}</span>}
        </div>
        {timestamp && <div className="verification-verdict-ts">{timestamp}</div>}
        {result.failure_count > 0 && (
          <div className="verification-verdict-failures">{result.failure_count} failure{result.failure_count !== 1 ? 's' : ''} across {result.steps.filter(s => s.verdict === 'FAIL').length} step{result.steps.filter(s => s.verdict === 'FAIL').length !== 1 ? 's' : ''}</div>
        )}
      </div>

      <div className="verification-steps">
        {result.steps.map(step => (
          <VerificationStepProof key={step.step} step={step} proofData={proofData} expanded={expandedSteps.has(step.step)} onToggle={() => toggleStep(step.step)} />
        ))}
      </div>

      {result.replay && (
        <div className="verification-replay-section">
          <div className="verification-step" data-verdict={result.replay.verdict === 'REPLAY_MATCH' ? 'PASS' : result.replay.verdict === 'INSUFFICIENT' ? 'INSUFFICIENT' : 'FAIL'} data-expanded={expandedSteps.has('replay') ? 'true' : 'false'}>
            <div className="verification-step-header" onClick={() => toggleStep('replay')}>
              <span className="verification-step-number">REPLAY</span>
              <span className="verification-step-name">Determinism Verification</span>
              <span className="verification-step-verdict">{result.replay.verdict === 'REPLAY_MATCH' ? 'MATCH' : result.replay.verdict}</span>
              <span className="verification-step-expand">{expandedSteps.has('replay') ? '▾' : '▸'}</span>
            </div>
            <div className="verification-step-summary">
              {result.replay.verdict === 'REPLAY_MATCH' && 'Re-compilation produced identical output · 0 divergences'}
              {result.replay.verdict === 'REPLAY_DIVERGENCE' && `${result.replay.divergences.length} divergence${result.replay.divergences.length !== 1 ? 's' : ''} detected`}
              {result.replay.verdict === 'REPLAY_ERROR' && 'Replay threw an exception'}
              {result.replay.verdict === 'INSUFFICIENT' && 'No compile function available'}
            </div>
            {result.replay.verdict === 'REPLAY_DIVERGENCE' && (
              <div className="verification-step-failures">
                {result.replay.divergences.map((d, i) => (
                  <div key={i} className="verification-failure">
                    <span className="verification-failure-type">DIVERGENCE</span>
                    <span className="verification-failure-detail">{d}</span>
                  </div>
                ))}
              </div>
            )}
            {expandedSteps.has('replay') && (
              <div className="verification-proof-detail">
                <ReplayProof replay={result.replay} proofData={proofData} />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="verification-protocol-footer">Protocol complete</div>
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

function BoardroomDecisionSurface({ adapted, renderState, scope, fullReport, boardroomProjection, narrative, evidenceBlocks, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, onModeTransition, selectedNarrativeArc, onNarrativeSelect, swIntelActive, consequencePosture, projectionAuthority, suppressedConditions, runtimeConnectivityEdges, domainCognition, cognitionSubstrate, crossDomainCognition }) {
  const [topoModalOpen, setTopoModalOpen] = useState(false)
  const [signalTraceId, setSignalTraceId] = useState(null)
  const [convergenceWebOpen, setConvergenceWebOpen] = useState(false)
  const openTopoModal = useCallback(() => setTopoModalOpen(true), [])
  const closeTopoModal = useCallback(() => { setTopoModalOpen(false); setSignalTraceId(null) }, [])

  const swIntelTopoOverlay = useMemo(() => {
    if (!swIntelActive || !consequencePosture || !fullReport) return null
    const pzState = fullReport.pressure_zone_state
    const primaryZoneId = pzState && pzState.zones && pzState.zones[0] ? pzState.zones[0].zone_id : null
    if (!primaryZoneId) return null
    return {
      overlay_mode: 'SW_INTEL_POSTURE',
      emphasis_domains: [],
      dim_domains: [],
      advisory_zones: [],
      corridor_paths: [],
      pressure_zone_emphasis: primaryZoneId,
    }
  }, [swIntelActive, consequencePosture, fullReport])

  const isS1 = fullReport && fullReport.qualification_level === 'S1'
  const governedNarrative = fullReport && fullReport.governed_narrative
  const pLevel = projectionAuthority ? projectionAuthority.projectionLevel : 0
  const hasRuntime = projectionAuthority && projectionAuthority.runtimeQualified
  const suppressedCount = (suppressedConditions || []).length

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
    DERIVED_CONDITION_SIGNAL: 'Structural condition signal',
    RSIG: 'Runtime connectivity signal',
  }

  const signalFamilies = sigs.reduce((acc, s) => {
    const fam = s.signal_family || (s.signal_id && s.signal_id.startsWith('ISIG') ? 'ISIG' : s.signal_id && s.signal_id.startsWith('PSIG') ? 'PSIG' : 'DPSIG')
    if (!acc[fam]) acc[fam] = []
    acc[fam].push(s)
    return acc
  }, {})
  const familyKeys = Object.keys(signalFamilies)

  if (boardroomProjection) {
    const bp = boardroomProjection
    const qp = bp.qualification_posture || {}
    const bpTs = bp.tension_summary || {}
    const bpSi = bp.signal_intelligence || { families: [] }
    const bpDc = bp.domain_coverage || {}
    const bpGl = bp.governance_legitimacy || { available: false }
    const sec = (bpGl && bpGl.sections) || {}
    const isGoverned = qp.governed
    const pLabel = projectionAuthority ? projectionAuthority.projectionLabel : 'P0'
    const eLabels = projectionAuthority ? projectionAuthority.evidenceCapabilities.join(' + ') : ''

    const tensionPct = bpTs.total_signals > 0 ? Math.round((bpTs.activated_count / bpTs.total_signals) * 100) : 0

    const SRANK_LOCAL = { CRITICAL: 0, HIGH: 1, ELEVATED: 2, MODERATE: 3, LOW: 4, NOMINAL: 5 }
    const hasCanonicalFamilies = bpSi.families.some(f => f.family === 'DPSIG' || f.family === 'PSIG' || f.family === 'ISIG')

    let pressureDimensions
    if (hasCanonicalFamilies) {
      const PDIM = { DPSIG: 'Concentration', ISIG: 'Dependency', PSIG: 'Propagation' }
      pressureDimensions = bpSi.families
        .filter(fam => PDIM[fam.family])
        .map(fam => {
          const maxSev = fam.signals.reduce((best, s) => (SRANK_LOCAL[s.severity] ?? 5) < (SRANK_LOCAL[best] ?? 5) ? s.severity : best, 'NOMINAL')
          const activated = fam.activated_count || 0
          const total = fam.signals.length
          const pct = total > 0 ? Math.round((activated / total) * 100) : 0
          return { key: fam.family, name: PDIM[fam.family], severity: maxSev, intensity: Math.max(pct, maxSev !== 'NOMINAL' ? 30 : 0), activated, total }
        })
    } else {
      const CLASS_MAP = {
        STRUCTURAL_MASS_CONCENTRATION: 'CONCENTRATION', CROSS_DOMAIN_COUPLING_PRESSURE: 'COUPLING',
        COUPLING_INERTIA: 'COUPLING', STRUCTURAL_BOUNDARY_DIVERGENCE: 'DRIFT',
        GOVERNANCE_COVERAGE_STATUS: 'DRIFT',
        EVENT_CONCENTRATION: 'RUNTIME', RUNTIME_DEPENDENCY_CHOKE_POINT: 'RUNTIME',
        BROKER_DEPENDENCY: 'RUNTIME', TOPIC_FANOUT_PRESSURE: 'RUNTIME',
        ASYNC_PROPAGATION_ASYMMETRY: 'RUNTIME', EDGE_CLOUD_PROPAGATION_RISK: 'RUNTIME',
        RUNTIME_OBSERVABILITY_GAP: 'RUNTIME',
      }
      const CLASS_LABEL = { CONCENTRATION: 'Concentration', COUPLING: 'Coupling & Flow', DRIFT: 'Drift & Boundaries', RUNTIME: 'Runtime Coordination' }
      const groups = {}
      for (const sig of activatedSignals) {
        const ct = sig.source_condition_type || sig.signal_name
        const cls = CLASS_MAP[ct] || 'CONCENTRATION'
        if (!groups[cls]) groups[cls] = { key: cls, name: CLASS_LABEL[cls] || cls, count: 0, maxSev: 'NOMINAL' }
        groups[cls].count++
        if ((SRANK_LOCAL[sig.severity] ?? 5) < (SRANK_LOCAL[groups[cls].maxSev] ?? 5)) groups[cls].maxSev = sig.severity
      }
      pressureDimensions = Object.values(groups).map(g => ({
        key: g.key, name: g.name, severity: g.maxSev,
        intensity: Math.max(30, Math.min(100, g.count * 15)),
        activated: g.count, total: g.count,
      }))
    }

    const covRatio = bpDc.total_domains > 0 ? (bpDc.structurally_backed || 0) / bpDc.total_domains : 1
    pressureDimensions.push({
      key: 'RESILIENCE', name: 'Resilience',
      severity: covRatio >= 1 ? 'NOMINAL' : covRatio >= 0.85 ? 'MODERATE' : 'ELEVATED',
      intensity: Math.max(Math.round((1 - covRatio) * 100), covRatio < 1 ? 20 : 0),
      activated: bpDc.total_domains - (bpDc.structurally_backed || 0), total: bpDc.total_domains || 0,
    })

    const PLOCALE_CANONICAL = {
      DPSIG: bpTs.pressure_zone ? `Convergence around ${bpTs.pressure_zone}` : 'Cluster pressure distributed',
      ISIG: (pressureDimensions.find(d => d.key === 'ISIG') || {}).activated > 0 ? 'Import hub amplifies dependency risk' : 'Dependency distribution balanced',
      PSIG: (pressureDimensions.find(d => d.key === 'PSIG') || {}).activated > 0 ? 'Outbound change propagation asymmetric' : 'Propagation within normal parameters',
    }
    const dcPrimary = domainCognition && domainCognition.attention_zones && domainCognition.attention_zones[0]
    const dcPrimaryLabel = dcPrimary ? dcPrimary.executive_label : pressureZone
    const PLOCALE_BEHAVIORAL = {
      CONCENTRATION: dcPrimaryLabel ? `Structural mass concentrated around "${dcPrimaryLabel}"` : 'Structural mass distributed',
      COUPLING: 'Cross-domain coupling and dependency pressure',
      DRIFT: 'Boundary alignment and governance coverage',
      RUNTIME: hasRuntime ? `Runtime coordination — ${domainCognition ? domainCognition.pressure_summary.domains_with_runtime : 0} domains with runtime evidence` : 'No runtime evidence',
    }
    const PLOCALE = { ...(hasCanonicalFamilies ? PLOCALE_CANONICAL : PLOCALE_BEHAVIORAL), RESILIENCE: covRatio >= 1 ? 'Complete structural grounding' : `${bpDc.total_domains - (bpDc.structurally_backed || 0)} domain${(bpDc.total_domains - (bpDc.structurally_backed || 0)) !== 1 ? 's' : ''} without structural grounding` }
    const activatedDimNames = pressureDimensions.filter(d => d.severity !== 'NOMINAL').map(d => d.name.toLowerCase())
    const pressureSynthesis = activatedDimNames.length > 0
      ? `${activatedDimNames.join(', ')} pressure${activatedDimNames.length > 1 ? 's converge' : ' concentrates'}${bpTs.pressure_zone ? ` around ${bpTs.pressure_zone}` : ''}.`
      : null

    const cdc = crossDomainCognition
    const themes = (cdc && cdc.consequence_themes) || []
    const critHighThemes = themes.filter(t => t.severity === 'CRITICAL' || t.severity === 'HIGH')
    const lowerThemes = themes.filter(t => t.severity !== 'CRITICAL' && t.severity !== 'HIGH')
    const domNarratives = (cdc && cdc.domain_narratives) || []

    return (
      <div className={`rep-field rep-field--boardroom rep-field--cockpit${isGoverned ? ' rep-field--governed' : ''}`}>
        <RepModeTag
          label="Boardroom lens"
          sub="Board · conclusion surface"
          zones={[{ id: 'Z1', name: 'Board Findings' }, { id: 'Z2', name: 'Domain Grounding' }]}
        />

        <div className="cockpit-finding" data-found={String(critHighThemes.length > 0)} data-governed={String(isGoverned)}>
          <div className="cockpit-finding-verdict">
            {cdc && cdc.posture_label ? cdc.posture_label : `${critHighThemes.length} CRITICAL FINDING${critHighThemes.length !== 1 ? 'S' : ''}`}
          </div>
          <div className="cockpit-finding-summary">
            {cdc && cdc.executive_synthesis ? cdc.executive_synthesis : 'Structural intelligence active.'}
          </div>
        </div>

        {critHighThemes.length > 0 && (
          <div className="cockpit-board-findings">
            {critHighThemes.slice(0, 5).map((t, i) => {
              const domNarr = domNarratives.find(n => n.domain && t.description && n.risk_label)
              return (
                <div key={i} className="cockpit-board-finding" data-severity={t.severity}>
                  <div className="cockpit-board-finding-head">
                    <span className="cockpit-board-finding-severity" data-severity={t.severity}>{t.severity}</span>
                    <span className="cockpit-board-finding-label">{t.theme_label}</span>
                  </div>
                  <div className="cockpit-board-finding-desc">{t.description}</div>
                  {swIntelActive && (
                    <div className="cockpit-board-finding-annotation">{t.source_count} evidence source{t.source_count !== 1 ? 's' : ''} · {t.scope ? t.scope.toLowerCase() : 'structural'}{t.is_combination ? ' · compound' : ''}</div>
                  )}
                </div>
              )
            })}
            {lowerThemes.length > 0 && (
              <div className="cockpit-board-finding-overflow">+{lowerThemes.length} additional finding{lowerThemes.length !== 1 ? 's' : ''} at ELEVATED/MODERATE</div>
            )}
          </div>
        )}

        {cdc && cdc.combined_synthesis && (
          <div className="cockpit-convergence-synthesis">{cdc.combined_synthesis}</div>
        )}

        {swIntelActive && consequencePosture && consequencePosture.executive_synthesis && (
          <div className="cockpit-convergence-synthesis" style={{ borderTop: '1px solid #1e2330', paddingTop: 10 }}>
            {consequencePosture.executive_synthesis}
          </div>
        )}

        <div className="cockpit-instruments">
          <div className="cockpit-gauge-panel">
            <CockpitRadialGauge governedLevel={isGoverned ? qp.s_level : (projectionAuthority ? projectionAuthority.qualificationState : 'S1')} tensionPct={tensionPct} governanceLabel={isGoverned ? 'GOVERNED' : (pLevel >= 2 ? 'STRUCTURAL + RUNTIME' : 'STRUCTURAL')} />
            <div className="cockpit-gauge-meta">
              <span className="cockpit-gauge-band">{isGoverned ? qp.s_level : (projectionAuthority ? projectionAuthority.qualificationState : 'S1')}</span>
              <span className="cockpit-gauge-sep">·</span>
              <span className="cockpit-gauge-posture">{isGoverned ? (qp.provenance_summary || '').replace(/\.$/, '') : eLabels}</span>
            </div>
          </div>

          <div className="cockpit-pressure-panel">
            <div className="cockpit-pressure-label">DOMAIN GROUNDING</div>
            {domNarratives.slice(0, 4).map((n, i) => (
              <div key={i} className="cockpit-pressure-dim" data-severity="ELEVATED" data-active="true">
                <div className="cockpit-pressure-dim-content" style={{ paddingLeft: 0 }}>
                  <div className="cockpit-pressure-dim-head">
                    <span className="cockpit-pressure-dim-name">{n.domain}</span>
                  </div>
                  <div className="cockpit-pressure-dim-locale">{n.risk_label}</div>
                </div>
              </div>
            ))}
            {isGoverned && (
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
            )}
            {!isGoverned && suppressedCount > 0 && (
              <div className="cockpit-governance-chips">
                <span className="cockpit-gov-chip" data-status="WARN">{suppressedCount} SUPPRESSED</span>
                <span className="cockpit-gov-chip" data-status="INFO">{pLabel}</span>
              </div>
            )}
          </div>

          <div className="cockpit-coverage-panel">
            <div className="cockpit-coverage-label">{isGoverned ? 'GOVERNED DOMAINS' : 'STRUCTURAL DOMAINS'}</div>
            <div className="cockpit-coverage-ring">
              <svg viewBox="0 0 80 80" className="cockpit-coverage-svg" aria-label={`${bpDc.structurally_backed || 0} of ${bpDc.total_domains || 0}`}>
                <circle cx="40" cy="40" r="32" fill="none" stroke="#1e2330" strokeWidth="6" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="#64ffda" strokeWidth="6"
                  strokeDasharray={`${((bpDc.structurally_backed || 0) / Math.max(1, bpDc.total_domains || 1)) * 201} 201`}
                  strokeLinecap="round" transform="rotate(-90 40 40)" />
                <text x="40" y="37" textAnchor="middle" fontSize="16" fontWeight="600" fill="#ccd6f6" fontFamily="'Courier New', monospace">{bpDc.total_domains || 0}</text>
                <text x="40" y="49" textAnchor="middle" fontSize="7" fill="#6a7a9a" fontFamily="-apple-system, sans-serif">domains</text>
              </svg>
            </div>
            <div className="cockpit-coverage-meta">
              {domainCognition && (
                <div className="cockpit-coverage-row"><span className="cockpit-coverage-dot cockpit-coverage-dot--backed" />{domainCognition.pressure_summary.domains_under_pressure} under pressure</div>
              )}
              {isGoverned && sec.proposition_review && sec.proposition_review.available && (
                <div className="cockpit-coverage-row"><span className="cockpit-coverage-dot cockpit-coverage-dot--backed" />{sec.proposition_review.detail.accepted} propositions accepted</div>
              )}
            </div>
          </div>
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

function DomainFocusPanel({ domainId, profile, conditions, onClose }) {
  if (!domainId || !profile) return null
  const affectingConditions = (conditions || []).filter(c =>
    c.shared_topology_targets?.domains?.includes(domainId)
  )
  const conditionGroups = {}
  affectingConditions.forEach(c => {
    const type = c.condition_type || 'UNKNOWN'
    if (!conditionGroups[type]) conditionGroups[type] = { type, label: c.operator_cognition_title || type.replace(/_/g, ' '), severity: c.severity, count: 0 }
    conditionGroups[type].count++
    if (['CRITICAL','HIGH'].includes(c.severity) && !['CRITICAL','HIGH'].includes(conditionGroups[type].severity)) conditionGroups[type].severity = c.severity
  })
  const groups = Object.values(conditionGroups).sort((a, b) => {
    const sev = { CRITICAL: 0, HIGH: 1, ELEVATED: 2, MODERATE: 3 }
    return (sev[a.severity] ?? 4) - (sev[b.severity] ?? 4)
  })

  return (
    <aside className="intel-interp intel-interp--domain-focus" data-tone="structural" aria-label="Domain focus panel">
      <div className="interp-tag">
        <span className="interp-tag-label">DOMAIN PROFILE</span>
        <button className="interp-condition-dismiss" onClick={onClose} type="button" aria-label="Close domain panel">✕</button>
      </div>
      <div className="domain-focus-header">
        <div className="domain-focus-name">{profile.name}</div>
        {profile.role && <div className="domain-focus-role">{profile.role}</div>}
      </div>
      <div className="domain-focus-stats">
        <span className="domain-focus-stat">{profile.fileCount} files</span>
        <span className="domain-focus-stat">{profile.inbound} inbound</span>
        <span className="domain-focus-stat">{profile.outbound} outbound</span>
      </div>
      {groups.length > 0 && (
        <div className="domain-focus-section">
          <div className="interp-section-label">CONDITIONS ({affectingConditions.length})</div>
          {groups.map(g => (
            <div key={g.type} className="domain-focus-condition" data-severity={g.severity}>
              <span className="domain-focus-condition-name">{g.label}</span>
              <span className="domain-focus-condition-sev">{g.severity}</span>
            </div>
          ))}
        </div>
      )}
      {profile.sourceName && (
        <div className="domain-focus-section">
          <div className="interp-section-label">SOURCE</div>
          <div className="domain-focus-source">{profile.sourceName}/</div>
        </div>
      )}
    </aside>
  )
}

function RepresentationField({ boardroomMode, densityClass, adapted, renderState, blocks, scope, fullReport, boardroomProjection, qualifierClass, narrative, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, onModeTransition, onZoneChange, onAuthorityChange, onEmergenceState, selectedNarrativeArc, onNarrativeSelect, swIntelActive, swIntelProjection, onSwIntelDeactivate, cognitionState, onSurfaceSelect, onDomainFocus, onPressureZoneFocus, topologyCognitionOverlay, activeConditions, activeConditionId, onConditionSelect, onConditionIntervention, swIntelTeaser, consequencePosture, consequenceTeaser, balancedBriefing, verificationState, verificationTargetReady, onVerificationInvoke, onVerificationClose, onVerificationReopen, runtimeConnectivityEdges, domainLabelMap, domainProfileMap, focusedDomainId, onDomainChipClick, activeConditionsForDomain, onOpenDeepDive, suppressedConditions, projectionAuthority, domainCognition, cognitionSubstrate, crossDomainCognition }) {
  if (boardroomMode) {
    return (
      <BoardroomDecisionSurface adapted={adapted} renderState={renderState} scope={scope} fullReport={fullReport} boardroomProjection={boardroomProjection} narrative={narrative} evidenceBlocks={blocks} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} temporalAnalyticsData={temporalAnalyticsData} temporalLifecycleData={temporalLifecycleData} onModeTransition={onModeTransition} selectedNarrativeArc={selectedNarrativeArc} onNarrativeSelect={onNarrativeSelect} swIntelActive={swIntelActive} consequencePosture={consequencePosture} projectionAuthority={projectionAuthority} suppressedConditions={suppressedConditions} runtimeConnectivityEdges={runtimeConnectivityEdges} domainCognition={domainCognition} cognitionSubstrate={cognitionSubstrate} crossDomainCognition={crossDomainCognition} />
    )
  }
  if (densityClass === 'OPERATOR_DENSE') {
    const swIntelSlot = (
      <>
        {swIntelActive && swIntelProjection && swIntelProjection.module_state !== 'ABSENT' && (
          <SoftwareIntelligenceOperatorView projection={swIntelProjection} onDeactivate={onSwIntelDeactivate} activeSurface={cognitionState && cognitionState.activeSurface} onSurfaceSelect={onSurfaceSelect} verificationState={verificationState} verificationTargetReady={verificationTargetReady} onVerificationInvoke={onVerificationInvoke} onVerificationReopen={onVerificationReopen} />
        )}
        {verificationState && verificationState.active && verificationState.result && (
          <VerificationProtocolSection verificationState={verificationState} onClose={onVerificationClose} />
        )}
      </>
    )
    return (
      <OperatorTraceField adapted={adapted} blocks={blocks} scope={scope} fullReport={fullReport} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} temporalAnalyticsData={temporalAnalyticsData} temporalLifecycleData={temporalLifecycleData} swIntelSlot={swIntelSlot} />
    )
  }
  if (densityClass === 'EXECUTIVE_BALANCED') {
    return (
      <BalancedConsequenceField adapted={adapted} blocks={blocks} scope={scope} renderState={renderState} fullReport={fullReport} qualifierClass={qualifierClass} onAuthorityChange={onAuthorityChange} onEmergenceState={onEmergenceState} swIntelActive={swIntelActive} balancedBriefing={balancedBriefing} />
    )
  }
  return (
    <>
      <DenseTopologyField adapted={adapted} blocks={blocks} scope={scope} fullReport={fullReport} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} temporalAnalyticsData={temporalAnalyticsData} temporalLifecycleData={temporalLifecycleData} onZoneChange={onZoneChange} cognitionOverlay={topologyCognitionOverlay} onPressureZoneClick={onPressureZoneFocus} activePressureZone={cognitionState && cognitionState.activePressureZone} activeConditionId={activeConditionId} onConditionSelect={onConditionSelect} onConditionIntervention={onConditionIntervention} swIntelActive={swIntelActive} swIntelTeaser={swIntelTeaser} consequenceTeaser={consequenceTeaser} balancedBriefing={balancedBriefing} runtimeConnectivityEdges={runtimeConnectivityEdges} />
      {swIntelActive && swIntelProjection && swIntelProjection.module_state !== 'ABSENT' && (
        <SoftwareIntelligenceDenseView projection={swIntelProjection} onDeactivate={onSwIntelDeactivate} activeSurface={cognitionState && cognitionState.activeSurface} onSurfaceSelect={onSurfaceSelect} activeConditions={activeConditions} domainLabelMap={domainLabelMap} domainProfileMap={domainProfileMap} fullReport={fullReport} onOpenDeepDive={onOpenDeepDive} suppressedCount={(suppressedConditions || []).length} projectionLabel={projectionAuthority && projectionAuthority.projectionLabel} />
      )}
    </>
  )
}

export default function IntelligenceField({ narrative, adapted, densityClass, boardroomMode, renderState, evidenceBlocks, fullReport, boardroomProjection, reportPackArtifacts, qualifierClass, qualifierLabel, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, onModeTransition, pendingTransitionZone, onTransitionZoneConsumed, onAuthorityChange, swIntelActive, swIntelProjection, onSwIntelDeactivate, sqoAuthorityWorkspace, sqoBinding, runtimeConnectivityEdges, visibilityLayerCompleteness, runtimeGraphs, projectionAuthority, domainCognition, cognitionSubstrate }) {
  const scope = (fullReport && fullReport.topology_scope) || {}
  const [activeZoneKey, setActiveZoneKey] = useState(null)
  const [activeQueryKey, setActiveQueryKey] = useState(null)
  const [exploredQueries, setExploredQueries] = useState(() => new Set())
  const [emergenceState, setEmergenceState] = useState(null)
  const [piRuntimeActive, setPiRuntimeActive] = useState(false)
  const [activeExpansionIndex, setActiveExpansionIndex] = useState(null)

  const [deepDiveModal, setDeepDiveModal] = useState(null)
  const prevSwIntelActive = useRef(swIntelActive)
  const prevDensityClass = useRef(densityClass)
  const prevBoardroomMode = useRef(boardroomMode)
  const clearCognitionState = useCallback(() => {
    setCognitionState({ activeSurface: null, focusedDomain: null, activePressureZone: null, activeSignals: [], activeQueryIndex: null, activeConditionId: null })
    setDeepDiveModal(null)
  }, [])
  useEffect(() => {
    if (prevSwIntelActive.current && !swIntelActive) clearCognitionState()
    prevSwIntelActive.current = swIntelActive
  }, [swIntelActive, clearCognitionState])
  useEffect(() => {
    if (prevDensityClass.current && prevDensityClass.current !== densityClass) clearCognitionState()
    prevDensityClass.current = densityClass
  }, [densityClass, clearCognitionState])
  useEffect(() => {
    if (prevBoardroomMode.current !== boardroomMode) clearCognitionState()
    prevBoardroomMode.current = boardroomMode
  }, [boardroomMode, clearCognitionState])
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



  const qualifiedReport = useMemo(() => {
    if (!fullReport) return fullReport
    return qualifyDomainBacking(fullReport, visibilityLayerCompleteness, runtimeConnectivityEdges, runtimeGraphs)
  }, [fullReport, visibilityLayerCompleteness, runtimeConnectivityEdges, runtimeGraphs])

  const synthesisResult = useMemo(() => swIntelActive ? synthesize(qualifiedReport) : null, [qualifiedReport, swIntelActive])
  const swIntelTeaser = useMemo(() => {
    if (swIntelActive || !qualifiedReport) return null
    const raw = synthesizeTeaser(qualifiedReport)
    if (!raw || !projectionAuthority) return raw
    const pLevel = projectionAuthority.projectionLevel
    const { authorized } = authorizeConditionsByAuthority(
      raw._allConditions || [],
      pLevel
    )
    const authorizedCount = authorized.filter(c => c.severity !== 'NOMINAL').length
    const isStructuralOnly = pLevel <= 1
    return {
      ...raw,
      active_count: authorizedCount,
      top_conditions: raw.top_conditions.filter(tc => {
        const c = (raw._allConditions || []).find(x => x.condition_id === tc.condition_id)
        return !c || authorized.includes(c)
      }),
      overflow: Math.max(0, authorizedCount - 3),
      _suppressed_count: raw.active_count - authorizedCount,
      _structural_only: isStructuralOnly,
    }
  }, [qualifiedReport, swIntelActive, projectionAuthority])

  const domainLabelMap = useMemo(() => {
    const map = {}
    ;(qualifiedReport?.semantic_domain_registry || fullReport?.semantic_domain_registry || []).forEach(d => {
      map[d.domain_id] = d.business_label || d.domain_name || d.domain_id
    })
    return map
  }, [qualifiedReport, fullReport])

  const domainProfileMap = useMemo(() => {
    const map = {}
    const ROLE_DISPLAY = {
      FOUNDATION: 'Foundation', SHARED_LIBRARY: 'Shared Library', EXECUTION_ENGINE: 'Execution Engine',
      API_BOUNDARY: 'API Boundary', AUTH_BOUNDARY: 'Auth Boundary', TEST_INFRASTRUCTURE: 'Test Infrastructure',
      CLIENT_INTERFACE: 'Client Interface', STREAMING_INTERFACE: 'Streaming Interface',
      BUILD_INFRASTRUCTURE: 'Build Infrastructure', APPLICATION_DOMAIN: 'Application Domain',
      UTILITY: 'Utility', GOVERNANCE_ARTIFACT: 'Governance',
    }
    ;(qualifiedReport?.semantic_domain_registry || fullReport?.semantic_domain_registry || []).forEach(d => {
      map[d.domain_id] = {
        id: d.domain_id,
        name: d.business_label || d.domain_name || d.domain_id,
        role: d.role_classification ? (ROLE_DISPLAY[d.role_classification] || d.role_classification.replace(/_/g, ' ')) : null,
        roleRaw: d.role_classification || null,
        fileCount: d.node_count || 0,
        inbound: d.inbound_imports || 0,
        outbound: d.outbound_imports || 0,
        backed: d.structurally_backed,
        sourceName: d.source_name || null,
      }
    })
    return map
  }, [qualifiedReport, fullReport])

  const [focusedDomainId, setFocusedDomainId] = useState(null)

  const resolveDomainLabel = useCallback((id) => domainLabelMap[id] || id, [domainLabelMap])

  const { activeConditions, suppressedConditions } = useMemo(() => {
    if (!synthesisResult) return { activeConditions: [], suppressedConditions: [] }
    const all = (synthesisResult.active || []).map(c => {
      if (!c.shared_topology_targets?.domains) return c
      return {
        ...c,
        shared_topology_targets: {
          ...c.shared_topology_targets,
          domains_display: c.shared_topology_targets.domains.map(id => domainLabelMap[id] || id),
        },
      }
    })
    if (!projectionAuthority || projectionAuthority.projectionLevel >= 4) return { activeConditions: all, suppressedConditions: [] }
    const { authorized, violations } = authorizeConditionsByAuthority(all, projectionAuthority.projectionLevel)
    return { activeConditions: authorized, suppressedConditions: violations }
  }, [synthesisResult, domainLabelMap, projectionAuthority])

  const consequenceResult = useMemo(() => swIntelActive && synthesisResult ? compileConsequences(synthesisResult, qualifiedReport) : null, [synthesisResult, qualifiedReport, swIntelActive])
  const consequenceTeaser = useMemo(() => {
    if (swIntelActive || !fullReport) return null
    const tempSynthesis = synthesize(fullReport)
    return tempSynthesis ? compileConsequenceTeaser(tempSynthesis, qualifiedReport) : null
  }, [fullReport, swIntelActive])
  const consequencePosture = useMemo(() => consequenceResult ? consequencesForBoardroom(consequenceResult, synthesisResult, qualifiedReport) : null, [consequenceResult, synthesisResult, qualifiedReport])
  const boardroomCrossDomainCognition = useMemo(() => {
    if (consequencePosture) return consequencePosture
    if (!fullReport || !qualifiedReport) return null
    try {
      const syn = synthesize(qualifiedReport)
      if (!syn) return null
      const csq = compileConsequences(syn, qualifiedReport)
      return csq ? consequencesForBoardroom(csq, syn, qualifiedReport) : null
    } catch { return null }
  }, [consequencePosture, fullReport, qualifiedReport])
  const balancedProjection = useMemo(() => consequenceResult ? consequencesForBalanced(consequenceResult, synthesisResult, qualifiedReport) : null, [consequenceResult, synthesisResult, qualifiedReport])
  const balancedBriefing = useMemo(() => balancedProjection ? composeBalancedBriefing(balancedProjection, synthesisResult, fullReport) : null, [balancedProjection, synthesisResult, fullReport])

  const resolvedCondition = useMemo(() => {
    if (!cognitionState.activeConditionId || !synthesisResult) return null
    return synthesisResult.conditions.find(c => c.condition_id === cognitionState.activeConditionId) || null
  }, [cognitionState.activeConditionId, synthesisResult])

  const resolvedCognitionContract = useMemo(() => {
    if (!cognitionState.activeSurface || !fullReport || !swIntelProjection) return null
    const surface = (swIntelProjection.surfaces || []).find(s => s.surface_id === cognitionState.activeSurface)
    if (!surface) return null
    return resolveContract(cognitionState.activeSurface, surface, fullReport, SW_INTEL_DOMAIN_REASONING_CONTRACTS)
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

  const [verificationState, setVerificationState] = useState(() => ({ active: false, result: _verificationCache.result, timestamp: _verificationCache.timestamp, proofData: _verificationCache.proofData }))
  const verificationTargetReady = useMemo(() => !!(consequenceResult && consequenceResult.consequences && consequenceResult.consequences.length > 0 && synthesisResult && fullReport), [consequenceResult, synthesisResult, fullReport])

  const handleVerificationInvoke = useCallback(() => {
    if (!verificationTargetReady || !consequenceResult || !synthesisResult || !fullReport) return
    const dispositionResult = verifyProjectionDisposition({
      conditionVocabulary: CONDITION_VOCABULARY,
      conditionInterventions: CONDITION_INTERVENTIONS,
      cognitionSliceVocabulary: COGNITION_SLICE_VOCABULARY,
      mapConditionKeys: MAP_CONDITION_KEYS,
      section4Rules: SECTION_4_RULES,
      conditionNodes: CONDITION_NODES,
      dynamicsGlyphType: DYNAMICS_GLYPH_TYPE,
      surfaceConditionMap: SURFACE_CONDITION_MAP,
    })
    const result = investigate(consequenceResult, synthesisResult, fullReport, {
      compileFn: (syn, rep) => compileConsequences(syn, rep),
    })
    result.disposition = dispositionResult
    result.steps = [dispositionResult, ...result.steps]
    const proofData = consequencesForInvestigation(consequenceResult, synthesisResult)
    const ts = new Date().toISOString()
    _verificationCache = { result, timestamp: ts, proofData }
    setVerificationState({ active: true, result, timestamp: ts, proofData })
  }, [verificationTargetReady, consequenceResult, synthesisResult, fullReport])

  const handleVerificationClose = useCallback(() => {
    setVerificationState(prev => ({ ...prev, active: false }))
  }, [])

  const handleVerificationReopen = useCallback(() => {
    setVerificationState(prev => prev.result ? { ...prev, active: true } : prev)
  }, [])

  const [interrogationTrail, setInterrogationTrail] = useState(() => new Set())
  const [selectedNarrativeArc, setSelectedNarrativeArc] = useState(null)
  const isBalanced = !boardroomMode && densityClass === 'EXECUTIVE_BALANCED'
  const handleEmergenceState = useCallback((state) => { setEmergenceState(state) }, [])
  const isDense = !boardroomMode && densityClass === 'EXECUTIVE_DENSE'
  const isOperator = !boardroomMode && densityClass === 'OPERATOR_DENSE'
  const canvasRef = useRef(null)

  const escalationAvailable = useMemo(() => {
    if (!fullReport) return false
    if (boardroomMode) return STRUCTURAL_ESCALATION_CONDITIONS.boardroom(fullReport)
    if (isBalanced) return STRUCTURAL_ESCALATION_CONDITIONS.balanced(fullReport)
    if (isDense) return STRUCTURAL_ESCALATION_CONDITIONS.dense(fullReport, activeZoneKey)
    if (isOperator) return STRUCTURAL_ESCALATION_CONDITIONS.operator(fullReport)
    return false
  }, [fullReport, boardroomMode, isBalanced, isDense, isOperator, activeZoneKey])

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
  const handleAssessmentExport = useCallback(() => {
    let capturedTopologySvg = null
    const svgEl = document.querySelector('.topo-graph-svg')
    if (svgEl) {
      const clone = svgEl.cloneNode(true)
      clone.querySelectorAll('.topo-tooltip').forEach(el => el.remove())
      clone.removeAttribute('ref')
      capturedTopologySvg = clone.outerHTML
    }
    const useSynth = synthesisResult || synthesize(qualifiedReport || fullReport)
    const useConseq = consequenceResult || (useSynth ? compileConsequences(useSynth, qualifiedReport || fullReport) : null)
    const useBoardroom = consequencePosture || (useConseq ? consequencesForBoardroom(useConseq, useSynth, qualifiedReport || fullReport) : null)
    const useBalanced = balancedProjection || (useConseq ? consequencesForBalanced(useConseq, useSynth, qualifiedReport || fullReport) : null)
    let useAF = []
    try { const { deriveArchitecturalFindings } = require('../../../lib/lens-v2/software-intelligence/ConsequenceCompiler'); useAF = deriveArchitecturalFindings(useConseq, useSynth, qualifiedReport || fullReport) } catch {}
    const result = buildAssessmentPackage({
      fullReport: qualifiedReport || fullReport,
      synthesisResult: useSynth,
      consequenceResult: useConseq,
      boardroom: useBoardroom,
      balanced: useBalanced,
      vlc: visibilityLayerCompleteness,
      architecturalFindings: useAF,
      capturedTopologySvg,
      qualifierClass,
      client: DEFAULT_BINDING_CLIENT,
      run: DEFAULT_BINDING_RUN,
    })
    if (!result.ok) return
    const blob = new Blob([result.html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `structural-assessment-${DEFAULT_BINDING_CLIENT}-${DEFAULT_BINDING_RUN}-${new Date().toISOString().slice(0, 10)}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [fullReport, qualifierClass])

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
        consequenceTeaser={consequenceTeaser}
        balancedBriefing={balancedBriefing}
        projectionAuthority={projectionAuthority}
        suppressedConditions={suppressedConditions}
      />

      {focusedDomainId && domainProfileMap[focusedDomainId] && (
        <DomainFocusPanel
          domainId={focusedDomainId}
          profile={domainProfileMap[focusedDomainId]}
          conditions={activeConditionsForDomain}
          onClose={() => onDomainChipClick(null)}
        />
      )}

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
          consequencePosture={consequencePosture}
          consequenceTeaser={consequenceTeaser}
          balancedBriefing={balancedBriefing}
          verificationState={verificationState}
          verificationTargetReady={verificationTargetReady}
          onVerificationInvoke={handleVerificationInvoke}
          onVerificationClose={handleVerificationClose}
          onVerificationReopen={handleVerificationReopen}
          runtimeConnectivityEdges={runtimeConnectivityEdges}
          domainLabelMap={domainLabelMap}
          domainProfileMap={domainProfileMap}
          focusedDomainId={focusedDomainId}
          onDomainChipClick={setFocusedDomainId}
          activeConditionsForDomain={activeConditions}
          onOpenDeepDive={setDeepDiveModal}
          suppressedConditions={suppressedConditions}
          projectionAuthority={projectionAuthority}
          domainCognition={domainCognition}
          cognitionSubstrate={cognitionSubstrate}
          crossDomainCognition={boardroomCrossDomainCognition}
        />

        {!boardroomMode && !isBalanced && (
          <OrchestrationGuidanceRuntime
            projection={swIntelActive && swIntelProjection && swIntelProjection.module_state !== 'ABSENT' ? swIntelProjection : null}
            fullReport={fullReport}
            sqoAuthorityWorkspace={sqoAuthorityWorkspace}
            sqoBinding={sqoBinding}
          />
        )}
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
        onAssessmentExport={handleAssessmentExport}
        selectedNarrativeArc={selectedNarrativeArc}
        resolvedCognitionContract={resolvedCognitionContract}
        cognitionQueryIndex={cognitionState.activeQueryIndex}
        onCognitionQuerySelect={handleCognitionQuerySelect}
        activeConditions={activeConditions}
        resolvedCondition={resolvedCondition}
        swIntelActive={swIntelActive}
        visibilityLayerCompleteness={visibilityLayerCompleteness}
      />
      {deepDiveModal === 'EXECUTION_BLINDNESS' && fullReport && (
        <ExecutionBlindnessModal fullReport={fullReport} onClose={() => setDeepDiveModal(null)} />
      )}
      {deepDiveModal === 'GRAVITY_DIVERGENCE' && fullReport && (
        <GravityDivergenceModal fullReport={fullReport} onClose={() => setDeepDiveModal(null)} />
      )}
    </div>
  )
}
