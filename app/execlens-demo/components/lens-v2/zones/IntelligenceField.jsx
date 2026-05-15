import { useState, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { PRESSURE_META, ROLE_META, DEFAULT_BINDING_CLIENT, DEFAULT_BINDING_RUN } from './constants'
import InvestigationReadingGuide, { TermHint } from './InvestigationReadingGuide'
import { TopologyGraph } from './StructuralTopologyZone'

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
  signalAssessment:    { key: 'signalAssessment',      code: 'SA', label: 'Signal Assessment' },
  propagationFlow:     { key: 'propagationFlow',       code: 'PF', label: 'Propagation Flow' },
  pressureZoneFocus:   { key: 'pressureZoneFocus',     code: 'PZ', label: 'Pressure Zone Focus' },
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
          {' · '}{(scope && scope.domain_count) || 3} domains · {(scope && scope.cluster_count) || 47} clusters
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

const DENSE_ZONE_PATHS = {
  semanticTopology: [
    { label: 'Open topology explorer', icon: '◇',
      narrative: 'Shows how semantic domains map to structural backing across the full topology.',
      answers: 'Which domains have structural reality versus semantic assertion?',
      boundary: 'Derived from reconciliation correspondence — no inference applied.' },
    { label: 'Descend into forensic lineage', icon: '↓',
      narrative: 'Opens the full evidence chain for each domain, including source traceability and reconciliation status.',
      answers: 'What evidence exists for each structural claim?',
      boundary: 'Requires INVESTIGATION mode — full forensic depth.' },
  ],
  clusterConcentration: [
    { label: 'Inspect cluster distribution', icon: '◇',
      narrative: 'Reveals how structural mass is distributed across domain clusters and where concentration creates dependency.',
      answers: 'Where is structural mass concentrated and what does that imply?',
      boundary: 'Cluster topology derived from evidence blocks — deterministic.' },
    { label: 'View structural mass breakdown', icon: '→',
      narrative: 'Decomposes cluster-level structural weight to show which groups carry disproportionate organizational load.',
      answers: 'Which clusters carry the most structural weight?',
      boundary: 'Mass calculation based on evidence block count per cluster.' },
  ],
  absorptionLoad: [
    { label: 'Trace absorption source', icon: '◇',
      narrative: 'Maps the upstream propagation path to show where absorbed load originates and how it reaches the conducting layer.',
      answers: 'Where does the absorbed pressure come from?',
      boundary: 'Propagation roles derived from evidence block classification.' },
    { label: 'Open propagation map', icon: '→',
      narrative: 'Displays the full origin → pass-through → receiver chain with structural backing status at each node.',
      answers: 'How does pressure propagate through the organizational structure?',
      boundary: 'Chain structure from propagation summary — no synthetic links.' },
  ],
  signalAssessment: [
    { label: 'Open signal trace', icon: '◇',
      narrative: 'Exposes individual signal activation, severity, and the structural conditions that triggered elevation.',
      answers: 'What specifically triggered each elevated signal?',
      boundary: 'Signals derived from structural assessment — deterministic thresholds.' },
    { label: 'Inspect signal concentration', icon: '→',
      narrative: 'Shows how activated signals cluster across domains and whether concentration indicates systemic versus localized conditions.',
      answers: 'Are elevated signals localized or systemically distributed?',
      boundary: 'Concentration analysis from signal domain attribution.' },
  ],
  propagationFlow: [
    { label: 'Open full topology', icon: '◇',
      narrative: 'Displays the complete structural topology with propagation roles, grounding status, and inter-domain dependency.',
      answers: 'What is the full structural dependency picture?',
      boundary: 'Topology from evidence blocks and reconciliation — no inference.' },
    { label: 'Descend to forensic traversal', icon: '↓',
      narrative: 'Opens forensic-depth analysis of propagation chain nodes with per-domain evidence lineage and temporal continuity.',
      answers: 'What evidence supports each link in the propagation chain?',
      boundary: 'Requires INVESTIGATION mode — full forensic depth.' },
  ],
  pressureZoneFocus: [
    { label: 'Open pressure zone topology', icon: '◇',
      narrative: 'Shows how the active pressure zone is structurally connected across origin, pass-through, and receiver domains.',
      answers: 'Is this pressure localized or systemic?',
      boundary: 'Pressure zone from propagation summary — deterministic classification.' },
    { label: 'View qualification posture', icon: '→',
      narrative: 'Exposes unresolved semantic domains and debt items affecting qualification progression toward the next S-state.',
      answers: 'What is preventing qualification advancement?',
      boundary: 'Qualification state from SQO binding — no advisory interpretation.' },
  ],
}

function SupportRail({ adapted, scope, boardroomMode, reportPackArtifacts, fullReport, qualifierClass, activeZoneKey, densityClass }) {
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

      {isDense && zonePaths && zoneReg && (
        <div className="support-block support-block--zone-paths" data-zone={activeZoneKey}>
          <div className="support-zone-header">
            <span className="support-zone-badge">{zoneReg.code}</span>
            <span className="support-label">TRAVERSAL</span>
          </div>
          <div className="support-paths-list">
            {zonePaths.map((p, i) => (
              <div key={`${activeZoneKey}-${i}`} className="support-path-item support-path-item--zone">
                <span className="support-path-icon">{p.icon}</span>
                <span className="support-path-text">{p.label}</span>
                {p.narrative && (
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
            ))}
          </div>
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
}

function ExecutiveInterpretation({ narrative, densityClass, boardroomMode, adapted, fullReport, activeZoneKey }) {
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

  if (boardroomMode) {
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

function BalancedConsequenceField({ adapted, blocks, scope, renderState, fullReport, qualifierClass }) {
  const origin = findByRole(blocks, 'ORIGIN')
  const badge = (adapted && adapted.readinessBadge) || {}
  const chip = (adapted && adapted.qualifierChip) || {}
  const grounded = (scope && scope.grounded_domain_count) || 0
  const total = (scope && scope.domain_count) || 1
  const groundedPct = Math.round((grounded / Math.max(1, total)) * 100)
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

      <QualifierNarrativeLine qualifierClass={qualifierClass} />

      <EvidenceBoundarySection scope={scope} fullReport={fullReport} />

      <SignalNarrativeBlock fullReport={fullReport} />

      <PressureZoneFocusBlock fullReport={fullReport} />

      <StructuralConclusionBlock fullReport={fullReport} />

      <TierHandoffStatement />
    </div>
  )
}

function DenseSignalSection({ fullReport }) {
  const sigs = (fullReport && fullReport.signal_interpretations) || []
  if (!sigs.length) return null

  const activated = sigs.filter(s => s.severity !== 'NOMINAL')

  return (
    <div className="actor actor--signal-assessment" data-zone-key="signalAssessment">
      <div className="actor-tag">
        <span className="actor-code">SA</span>
        <span className="actor-name">Signal Assessment</span>
      </div>
      {sigs.map(sig => (
        <div key={sig.signal_id} className="dense-signal-entry" data-severity={sig.severity}>
          <div className="dense-signal-header">
            <span className="dense-signal-name">{sig.signal_name}</span>
            <span className="dense-signal-badge" data-severity={sig.severity}>{sig.severity}</span>
            <span className="dense-signal-val">{sig.signal_value != null ? sig.signal_value.toFixed(4) : '—'}</span>
          </div>
          <div className="dense-signal-prose">{sig.interpretation}</div>
          {sig.concentration && (
            <div className="dense-signal-where">{sig.concentration}</div>
          )}
        </div>
      ))}
      {sigs[0].compound_narrative && (
        <div className="dense-signal-compound">{sigs[0].compound_narrative}</div>
      )}
      {sigs[0].confidence_note && (
        <div className="dense-signal-confidence">{sigs[0].confidence_note}</div>
      )}
    </div>
  )
}

function DenseTopologyField({ adapted, blocks, scope, fullReport, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, onZoneChange }) {
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
        sub="CTO · structural cause and propagation"
        zones={[
          { id: 'Z3', name: 'Semantic Topology' },
          { id: 'Z4', name: 'Pressure Anchor' },
          { id: 'Z6', name: 'Cluster Concentration' },
        ]}
      />

      <div className="actor actor--semantic-topology" data-zone-key="semanticTopology">
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
      </div>

      {scope && scope.cluster_count != null && (
        <div className="actor actor--cluster-concentration" data-zone-key="clusterConcentration">
          <div className="actor-tag">
            <span className="actor-code">CC</span>
            <span className="actor-name">Cluster Concentration</span>
          </div>
          <div className="actor-cluster-headline">
            <span className="actor-cluster-value">{scope.cluster_count}</span>
            <span className="actor-cluster-label">clusters monitored</span>
          </div>
          <div className="actor-cluster-bar">
            <div
              className="actor-cluster-bar-fill"
              style={{ width: `${Math.min(100, Math.round((grounded / Math.max(1, total)) * 100))}%` }}
            />
          </div>
          <div className="actor-cluster-meta">
            structural mass concentrated upstream — Primary Delivery holds 23 of 31 active clusters; coordination layer absorbs propagation
          </div>
        </div>
      )}

      {passthrough && (
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

      <DenseSignalSection fullReport={fullReport} />

      {(origin || passthrough || receiver) && (
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

      <PressureZoneFocusBlock fullReport={fullReport} />

      {fullReport && fullReport.semantic_domain_registry && fullReport.semantic_domain_registry.length > 0 && (
        <div className="dense-topology-preview" onClick={openTopoModal} role="button" tabIndex={0} aria-label="Open topology explorer" onKeyDown={e => e.key === 'Enter' && openTopoModal()}>
          <TopologyGraph
            domains={fullReport.semantic_domain_registry}
            clusters={fullReport.semantic_cluster_registry || []}
            edges={fullReport.semantic_topology_edges || []}
            pressureZoneLabel={pressureZone}
          />
          <div className="dense-topology-hint">Open structural topology</div>
        </div>
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

      {fullReport && fullReport.semantic_domain_registry && fullReport.semantic_domain_registry.length > 0 && (
        <div className="investigation-topology-preview" onClick={openTopoModal} role="button" tabIndex={0} aria-label="Open topology explorer" onKeyDown={e => e.key === 'Enter' && openTopoModal()}>
          <TopologyGraph
            domains={fullReport.semantic_domain_registry}
            clusters={fullReport.semantic_cluster_registry || []}
            edges={fullReport.semantic_topology_edges || []}
            pressureZoneLabel={pressureZone}
          />
          <div className="investigation-topology-hint">Open forensic topology</div>
        </div>
      )}

      {topoModalOpen && createPortal(<TopologyModal fullReport={fullReport} onClose={closeTopoModal} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} temporalAnalyticsData={temporalAnalyticsData} temporalLifecycleData={temporalLifecycleData} mode="investigation" />, document.body)}

      <TierHandoffStatement />
    </div>
  )
}

function CockpitRadialGauge({ score, groundingPct }) {
  const s = typeof score === 'number' ? score : 0
  const g = typeof groundingPct === 'number' ? groundingPct : 0
  const r = 58
  const cx = 75
  const cy = 68

  function arcEnd(radius, pct) {
    const angle = Math.PI * (1 - pct / 100)
    return {
      x: cx + radius * Math.cos(angle),
      y: cy - radius * Math.sin(angle),
    }
  }

  const se = arcEnd(r, s)
  const scorePath = s > 0 ? `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${se.x.toFixed(1)} ${se.y.toFixed(1)}` : ''

  const gr = 49
  const ge = arcEnd(gr, g)
  const groundPath = g > 0 ? `M ${cx - gr} ${cy} A ${gr} ${gr} 0 0 1 ${ge.x.toFixed(1)} ${ge.y.toFixed(1)}` : ''

  const scoreColor = s >= 80 ? '#64ffda' : s >= 60 ? '#ffd700' : s >= 40 ? '#ff9e4a' : '#ff6b6b'

  return (
    <svg viewBox="0 0 150 84" className="cockpit-gauge-svg" role="img" aria-label={`Readiness: ${s}, Grounding: ${g}%`}>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#1e2330" strokeWidth="8" strokeLinecap="round" />
      {scorePath && <path d={scorePath} fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round" />}
      <path d={`M ${cx - gr} ${cy} A ${gr} ${gr} 0 0 1 ${cx + gr} ${cy}`} fill="none" stroke="#1e2330" strokeWidth="5" strokeLinecap="round" />
      {groundPath && <path d={groundPath} fill="none" stroke="#4a9eff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />}
      <text x={cx} y={cy - 16} textAnchor="middle" fontSize="28" fontWeight="600" fill={scoreColor} fontFamily="'Courier New', monospace">{s}</text>
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="8" fill="#5a6580" letterSpacing="0.15em" fontFamily="-apple-system, sans-serif">READINESS</text>
      <text x={cx - r + 2} y={cy + 12} textAnchor="start" fontSize="7" fill="#4a9eff" fontFamily="-apple-system, sans-serif">{g}% grounded</text>
      <text x={cx + r - 2} y={cy + 12} textAnchor="end" fontSize="7" fill="#4a5570" fontFamily="-apple-system, sans-serif">of 100</text>
    </svg>
  )
}

function CockpitSignalBar({ signal }) {
  const sevColor = { CRITICAL: '#ff6b6b', HIGH: '#ff6b6b', ELEVATED: '#ff9e4a', MODERATE: '#ffd700', NOMINAL: '#64ffda' }
  const color = sevColor[signal.severity] || '#4a5570'
  const isActive = signal.severity !== 'NOMINAL'
  return (
    <div className={`cockpit-signal${isActive ? ' cockpit-signal--active' : ''}`} data-severity={signal.severity}>
      <div className="cockpit-signal-bar" style={{ background: color }} />
      <div className="cockpit-signal-body">
        <div className="cockpit-signal-name">{signal.signal_name}</div>
        <div className="cockpit-signal-reading">{signal.interpretation}</div>
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
  const exposureColors = { HIGH: '#ff6b6b', MEDIUM: '#ff9e4a', LOW: '#ffd700', NONE: '#4a5570' }
  const reducibilityColors = {
    IRREDUCIBLE_STRUCTURAL_ABSENCE: '#ff6b6b',
    REDUCED_BY_ENRICHMENT: '#ffd700',
    REDUCIBLE_BY_EVIDENCE: '#4a9eff',
    NOT_APPLICABLE: '#4a5570',
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
            <span className="dsp-badge dsp-exposure" style={{ color: exposureColors[posture.operational_exposure] || '#4a5570' }}>
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
            <span className="dsp-badge dsp-reducibility" style={{ color: reducibilityColors[posture.reducibility] || '#4a5570' }}>
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
            const color = MATURITY_DIM_COLORS[dim.classification] || '#4a5570'
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
  let movementColor = '#4a5570'
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

  const confColor0 = CONFIDENCE_COLORS[d0.confidence_level] || '#4a5570'
  const confColor1 = CONFIDENCE_COLORS[d1.confidence_level] || '#4a5570'

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

  const confColor = CONFIDENCE_COLORS[corr.confidence_level] || '#4a5570'
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
          const classColor = SOURCE_CLASS_COLORS[item.source_class] || '#4a5570'
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
  const confColor = CONFIDENCE_COLORS[confLevel] || '#4a5570'
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
          <div className="topo-modal-title">SEMANTIC DOMAIN TOPOLOGY</div>
          <div className="topo-modal-meta">
            {domainRegistry.length} domains · {clusterRegistry.length} clusters
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
              focusedDomain={focusedDomain}
              onNodeSelect={setFocusedDomain}
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
            <div className="topo-modal-domains-heading">DOMAIN REGISTRY</div>
            <div className="topo-modal-domains-grid">
              {domainRegistry.map(d => {
                const backed = d.structurally_backed
                const partial = d.lineage_status === 'PARTIAL'
                const isPZ = d.zone_anchor
                const isFocused = focusedDomain === d.domain_id
                const lineageColor = backed ? (d.lineage_status === 'EXACT' ? '#64ffda' : d.lineage_status === 'STRONG' ? '#64ffda' : '#ffd700') : '#4a5570'
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
                      {d.lineage_status === 'NONE' || !d.lineage_status ? 'SEMANTIC-ONLY' : d.lineage_status}{d.confidence > 0 ? ` ${d.confidence.toFixed(2)}` : ''}
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

function BoardroomDecisionSurface({ adapted, renderState, scope, fullReport, narrative, evidenceBlocks, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, onModeTransition }) {
  const [topoModalOpen, setTopoModalOpen] = useState(false)
  const [signalTraceId, setSignalTraceId] = useState(null)
  const openTopoModal = useCallback(() => setTopoModalOpen(true), [])
  const closeTopoModal = useCallback(() => { setTopoModalOpen(false); setSignalTraceId(null) }, [])

  const rs = (fullReport && fullReport.readiness_summary) || {}
  const ts = (fullReport && fullReport.topology_summary) || {}
  const qs = (fullReport && fullReport.qualifier_summary) || {}
  const ps = (fullReport && fullReport.propagation_summary) || {}
  const sigs = (fullReport && fullReport.signal_interpretations) || []

  const score = rs.score != null ? rs.score : 0
  const band = rs.band || '—'
  const posture = rs.posture || '—'

  const backedCount = ts.structurally_backed_count || 0
  const totalDomains = ts.semantic_domain_count || 0
  const semanticOnlyCount = ts.semantic_only_count || Math.max(0, totalDomains - backedCount)
  const groundingPct = Math.round((backedCount / Math.max(1, totalDomains)) * 100)

  const activatedSignals = sigs.filter(s => s.severity !== 'NOMINAL')
  const nominalSignals = sigs.filter(s => s.severity === 'NOMINAL')
  const somethingFound = activatedSignals.length > 0
  const pressureZone = ps.primary_zone_business_label || null

  const origin = evidenceBlocks && evidenceBlocks.find(b => b && b.propagation_role === 'ORIGIN')
  const passthrough = evidenceBlocks && evidenceBlocks.find(b => b && b.propagation_role === 'PASS_THROUGH')
  const receiver = evidenceBlocks && evidenceBlocks.find(b => b && b.propagation_role === 'RECEIVER')

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
        zones={[{ id: 'Z1', name: 'Executive Posture' }, { id: 'Z2', name: 'Signal Assessment' }]}
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
              <text x="40" y="49" textAnchor="middle" fontSize="7" fill="#5a6580" fontFamily="-apple-system, sans-serif">of {totalDomains}</text>
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

      <div className="cockpit-footer">
        All outputs structurally derived — no inference, no AI-generated assessment.
      </div>
    </div>
  )
}

function RepresentationField({ boardroomMode, densityClass, adapted, renderState, blocks, scope, fullReport, qualifierClass, narrative, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, onModeTransition, onZoneChange }) {
  if (boardroomMode) {
    return <BoardroomDecisionSurface adapted={adapted} renderState={renderState} scope={scope} fullReport={fullReport} narrative={narrative} evidenceBlocks={blocks} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} temporalAnalyticsData={temporalAnalyticsData} temporalLifecycleData={temporalLifecycleData} onModeTransition={onModeTransition} />
  }
  if (densityClass === 'INVESTIGATION_DENSE') {
    return <InvestigationTraceField adapted={adapted} blocks={blocks} scope={scope} fullReport={fullReport} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} temporalAnalyticsData={temporalAnalyticsData} temporalLifecycleData={temporalLifecycleData} />
  }
  if (densityClass === 'EXECUTIVE_BALANCED') {
    return <BalancedConsequenceField adapted={adapted} blocks={blocks} scope={scope} renderState={renderState} fullReport={fullReport} qualifierClass={qualifierClass} />
  }
  return <DenseTopologyField adapted={adapted} blocks={blocks} scope={scope} fullReport={fullReport} correspondenceData={correspondenceData} evidenceIntakeData={evidenceIntakeData} debtIndexData={debtIndexData} progressionData={progressionData} maturityData={maturityData} temporalAnalyticsData={temporalAnalyticsData} temporalLifecycleData={temporalLifecycleData} onZoneChange={onZoneChange} />
}

export default function IntelligenceField({ narrative, adapted, densityClass, boardroomMode, renderState, evidenceBlocks, fullReport, reportPackArtifacts, qualifierClass, qualifierLabel, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, onModeTransition, pendingTransitionZone, onTransitionZoneConsumed }) {
  const scope = (fullReport && fullReport.topology_scope) || {}
  const [activeZoneKey, setActiveZoneKey] = useState(null)
  const isDense = !boardroomMode && densityClass === 'EXECUTIVE_DENSE'
  const canvasRef = useRef(null)
  const handleZoneChange = useCallback((zoneKey) => {
    setActiveZoneKey(zoneKey)
  }, [])

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

  return (
    <div
      className={`intelligence-field intelligence-field--three-col${boardroomMode ? ' intelligence-field--boardroom' : ''}`}
      data-mode={boardroomMode ? 'BOARDROOM' : densityClass}
      data-active-zone={isDense ? activeZoneKey : undefined}
    >
      <ExecutiveInterpretation
        narrative={narrative}
        densityClass={densityClass}
        boardroomMode={boardroomMode}
        adapted={adapted}
        fullReport={fullReport}
        activeZoneKey={isDense ? activeZoneKey : null}
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
      />
    </div>
  )
}
