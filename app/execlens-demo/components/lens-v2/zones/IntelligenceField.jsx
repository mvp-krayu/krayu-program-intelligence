import { PRESSURE_META, ROLE_META, DEFAULT_BINDING_CLIENT, DEFAULT_BINDING_RUN } from './constants'
import InvestigationReadingGuide, { TermHint } from './InvestigationReadingGuide'

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

function SupportRail({ adapted, scope, boardroomMode, reportPackArtifacts }) {
  const badge = (adapted && adapted.readinessBadge) || {}
  const chip = (adapted && adapted.qualifierChip) || {}
  const artifacts = (reportPackArtifacts && reportPackArtifacts.length > 0)
    ? reportPackArtifacts
    : buildReportPackRegistry(DEFAULT_BINDING_CLIENT, DEFAULT_BINDING_RUN)
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

function ExecutiveInterpretation({ narrative, densityClass, boardroomMode, adapted }) {
  const badge = (adapted && adapted.readinessBadge) || {}
  const framing = boardroomMode
    ? INTERP_MODE_FRAMING.BOARDROOM
    : (INTERP_MODE_FRAMING[densityClass] || INTERP_MODE_FRAMING.EXECUTIVE_DENSE)
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
      {narrative.structural_summary && (densityClass === 'INVESTIGATION_DENSE' || densityClass === 'EXECUTIVE_BALANCED') && !boardroomMode && framing.structuralLabel && (
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
    <div className="pressure-zone-focus" data-tier={severityTier} aria-label="Pressure zone focus">
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
    <div className="actor actor--signal-assessment">
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

function DenseTopologyField({ adapted, blocks, scope, fullReport }) {
  const origin = findByRole(blocks, 'ORIGIN')
  const passthrough = findByRole(blocks, 'PASS_THROUGH')
  const receiver = findByRole(blocks, 'RECEIVER')
  const grounded = (scope && scope.grounded_domain_count) || 0
  const total = (scope && scope.domain_count) || 1
  const semanticOnly = Math.max(0, total - grounded)
  return (
    <div className="rep-field rep-field--dense">
      <RepModeTag
        label="Structural lens"
        sub="CTO · structural cause and propagation"
        zones={[
          { id: 'Z3', name: 'Semantic Topology' },
          { id: 'Z4', name: 'Pressure Anchor' },
          { id: 'Z6', name: 'Cluster Concentration' },
        ]}
      />

      <div className="actor actor--semantic-topology">
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
        <div className="actor actor--cluster-concentration">
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
        <div className="actor actor--absorption-load">
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
        <div className="actor actor--propagation-flow">
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
    </div>
  )
}

function InvestigationTraceField({ adapted, blocks, scope, fullReport }) {
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

function BoardroomDecisionSurface({ adapted, renderState, scope, fullReport, narrative, evidenceBlocks }) {
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

  const nextSteps = []
  if (qs.qualifier_class === 'Q-02') nextSteps.push('Advisory confirmation required before executive commitment')
  if (qs.qualifier_class === 'Q-03') nextSteps.push('Semantic continuity only — structural backing absent, executive caution mandatory')
  if (somethingFound && pressureZone) nextSteps.push(`Review pressure concentration in "${pressureZone}"`)
  if (semanticOnlyCount > 0) nextSteps.push(`${semanticOnlyCount} domain${semanticOnlyCount > 1 ? 's' : ''} lack structural backing — evidence gaps remain`)
  if (!somethingFound && qs.qualifier_class === 'Q-01') nextSteps.push('No action required — structural evidence is complete and stable')
  if (nextSteps.length === 0) nextSteps.push('Continue monitoring — no escalation required')

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

      <div className="cockpit-action">
        <div className="cockpit-action-label">NEXT STEPS</div>
        <div className="cockpit-action-items">
          {nextSteps.map((step, i) => (
            <div key={i} className="cockpit-action-item">
              <span className="cockpit-action-marker" />
              <span className="cockpit-action-text">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cockpit-footer">
        All outputs structurally derived — no inference, no AI-generated assessment.
      </div>
    </div>
  )
}

function RepresentationField({ boardroomMode, densityClass, adapted, renderState, blocks, scope, fullReport, qualifierClass, narrative }) {
  if (boardroomMode) {
    return <BoardroomDecisionSurface adapted={adapted} renderState={renderState} scope={scope} fullReport={fullReport} narrative={narrative} evidenceBlocks={blocks} />
  }
  if (densityClass === 'INVESTIGATION_DENSE') {
    return <InvestigationTraceField adapted={adapted} blocks={blocks} scope={scope} fullReport={fullReport} />
  }
  if (densityClass === 'EXECUTIVE_BALANCED') {
    return <BalancedConsequenceField adapted={adapted} blocks={blocks} scope={scope} renderState={renderState} fullReport={fullReport} qualifierClass={qualifierClass} />
  }
  return <DenseTopologyField adapted={adapted} blocks={blocks} scope={scope} fullReport={fullReport} />
}

export default function IntelligenceField({ narrative, adapted, densityClass, boardroomMode, renderState, evidenceBlocks, fullReport, reportPackArtifacts, qualifierClass, qualifierLabel }) {
  const scope = (fullReport && fullReport.topology_scope) || {}

  return (
    <div
      className={`intelligence-field intelligence-field--three-col${boardroomMode ? ' intelligence-field--boardroom' : ''}`}
      data-mode={boardroomMode ? 'BOARDROOM' : densityClass}
    >
      <ExecutiveInterpretation
        narrative={narrative}
        densityClass={densityClass}
        boardroomMode={boardroomMode}
        adapted={adapted}
      />

      <main className="intel-canvas" role="region" aria-label="Semantic operational canvas">
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
        />
      </main>

      <SupportRail
        adapted={adapted}
        scope={scope}
        boardroomMode={boardroomMode}
        reportPackArtifacts={reportPackArtifacts}
      />
    </div>
  )
}
