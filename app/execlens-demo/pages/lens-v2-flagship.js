/**
 * pages/lens-v2-flagship.js
 * PI.LENS.V2.EXPERIENCE-REFINEMENT.01
 *
 * LENS v2 — Flagship Executive Intelligence Surface
 * Readability and executive cognition refinement.
 *
 * Governance:
 *   - topology always read-only
 *   - qualifier never suppressed
 *   - blocked/diagnostic states non-degradable
 *   - no AI calls, no prompt surfaces, no chatbot UX
 *   - no animated propagation flow (VIS-PROP-02)
 *   - entrance animations are UI choreography only
 */

import Head from 'next/head'
import { useState, useMemo } from 'react'

const {
  orchestrateFlagshipExperience,
  resolveBoardroomConfig,
  resolveGravityToken,
  resolvePresenceToken,
} = require('../flagship-experience/flagshipOrchestration')

const {
  FLAGSHIP_REAL_REPORT,
  FLAGSHIP_PROPAGATION_CHAINS,
} = require('../flagship-experience/fixtures/flagship_real_report.fixture')

// ── Visual constants ──────────────────────────────────────────────────────────

const PRESSURE_META = {
  HIGH:     { color: '#ff6b6b', label: 'HIGH',     symbol: '▲' },
  ELEVATED: { color: '#ff9e4a', label: 'ELEVATED', symbol: '△' },
  MODERATE: { color: '#ffd700', label: 'MODERATE', symbol: '◇' },
  LOW:      { color: '#64ffda', label: 'LOW',      symbol: '○' },
}

const ROLE_META = {
  ORIGIN:       { label: 'ORIGIN',       symbol: '◉', color: '#ff6b6b' },
  PASS_THROUGH: { label: 'PASS-THROUGH', symbol: '→', color: '#ff9e4a' },
  RECEIVER:     { label: 'RECEIVER',     symbol: '◎', color: '#ffd700' },
}

const STATE_LABELS = {
  EXECUTIVE_READY:                'EXECUTIVE READY',
  EXECUTIVE_READY_WITH_QUALIFIER: 'EXECUTIVE READY — QUALIFIED',
  DIAGNOSTIC_ONLY:                'DIAGNOSTIC ONLY',
  BLOCKED:                        'BLOCKED',
}

const ROLE_ORDER = { ORIGIN: 0, PASS_THROUGH: 1, RECEIVER: 2 }

const DENSITY_OPTIONS = [
  {
    value: 'EXECUTIVE_BALANCED',
    label: 'BALANCED',
    persona_label: 'Executive lens',
    persona_sub: 'CEO · consequence-first read',
    aria: 'Balanced — Executive (CEO) consequence lens',
  },
  {
    value: 'EXECUTIVE_DENSE',
    label: 'DENSE',
    persona_label: 'Structural lens',
    persona_sub: 'CTO · structural cause and propagation',
    aria: 'Dense — Structural (CTO) cause and propagation lens',
  },
  {
    value: 'INVESTIGATION_DENSE',
    label: 'INVESTIGATION',
    persona_label: 'Evidence lens',
    persona_sub: 'Analyst · evidence trace and confidence',
    aria: 'Investigation — Analyst evidence trace and confidence lens',
  },
]
const BOARDROOM_PERSONA = {
  persona_label: 'Projection lens',
  persona_sub: 'Boardroom projection — minimal chrome',
  aria: 'Boardroom projection lens — minimal chrome, declaration-supportive',
}

// ── Derived domain nodes ──────────────────────────────────────────────────────

function getDomainNodes(evidenceBlocks) {
  if (!evidenceBlocks || !evidenceBlocks.length) return []
  return [...evidenceBlocks]
    .sort((a, b) => (ROLE_ORDER[a.propagation_role] || 0) - (ROLE_ORDER[b.propagation_role] || 0))
    .map(block => ({
      name: block.domain_alias,
      pressureTier: (block.signal_cards && block.signal_cards[0] && block.signal_cards[0].pressure_tier) || 'MODERATE',
      role: block.propagation_role,
      groundingStatus: block.grounding_status,
    }))
}

// ── Inner components ──────────────────────────────────────────────────────────

function AuthorityBand({ densityClass, boardroomMode, onDensityChange, onBoardroomToggle }) {
  const activeDensity = DENSITY_OPTIONS.find(o => o.value === densityClass) || DENSITY_OPTIONS[0]
  const activePersona = boardroomMode ? BOARDROOM_PERSONA : activeDensity
  return (
    <div className="auth-band">
      <div className="auth-left">
        <span className="auth-wordmark">LENS</span>
        <span className="auth-version">v2</span>
        <span className="auth-sep" />
        <span className="auth-descriptor">Executive Operational Intelligence</span>
      </div>
      <div className="auth-center">
        <span className="auth-program">Program · Delivery Coordination</span>
      </div>
      <div className="auth-right">
        <div className="auth-mode-group">
          <div
            className="auth-density-group"
            role="radiogroup"
            aria-label="Executive lens"
          >
            {DENSITY_OPTIONS.map(opt => {
              const isActive = densityClass === opt.value && !boardroomMode
              return (
                <button
                  key={opt.value}
                  className={`auth-density-btn${isActive ? ' active' : ''}`}
                  onClick={() => onDensityChange(opt.value)}
                  aria-pressed={isActive}
                  aria-label={opt.aria}
                  title={`${opt.persona_label} — ${opt.persona_sub}`}
                  role="radio"
                  aria-checked={isActive}
                  data-persona={opt.persona_label}
                >
                  {opt.label}
                </button>
              )
            })}
            <button
              className={`auth-density-btn auth-density-btn--boardroom${boardroomMode ? ' active' : ''}`}
              onClick={onBoardroomToggle}
              aria-pressed={boardroomMode}
              aria-label={BOARDROOM_PERSONA.aria}
              title={`${BOARDROOM_PERSONA.persona_label} — ${BOARDROOM_PERSONA.persona_sub}`}
              data-persona={BOARDROOM_PERSONA.persona_label}
            >
              BOARDROOM
            </button>
          </div>
          <div className="auth-persona-line" aria-live="polite">
            <span className="auth-persona-label">{activePersona.persona_label}</span>
            <span className="auth-persona-sep"> · </span>
            <span className="auth-persona-sub">{activePersona.persona_sub}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function BlockedDeclaration({ adapted }) {
  const badge = (adapted && adapted.readinessBadge) || {}
  return (
    <div className="blocked-declaration" role="alert" aria-live="assertive">
      <div className="blocked-icon">■</div>
      <div className="blocked-content">
        <div className="blocked-headline">INTELLIGENCE BLOCKED</div>
        <div className="blocked-detail">
          {badge.state_label || 'This report cannot proceed to executive action. Structural escalation is required before any decision commitment.'}
        </div>
      </div>
    </div>
  )
}

function DiagnosticDeclaration() {
  return (
    <div className="diagnostic-declaration" role="status">
      <span className="diagnostic-icon">◈</span>
      <span className="diagnostic-headline">DIAGNOSTIC INTELLIGENCE ONLY</span>
      <span className="diagnostic-detail">Readiness resolution is pending. This output is advisory — executive action is not authorized from this state.</span>
    </div>
  )
}

function DeclarationZone({ renderState, adapted }) {
  const label = STATE_LABELS[renderState] || renderState.replace(/_/g, ' ')
  return (
    <div className="declaration-zone">
      <div className="declaration-pre-label">OPERATIONAL POSTURE</div>
      <div className="declaration-state">{label}</div>
      <div className="declaration-scope">
        <span className="declaration-scope-item">3 Domains</span>
        <span className="declaration-scope-sep">·</span>
        <span className="declaration-scope-item">47 Clusters</span>
        <span className="declaration-scope-sep">·</span>
        <span className="declaration-scope-item">Partial Coverage</span>
      </div>
    </div>
  )
}

function QualifierMandate({ qualifierClass, visible }) {
  if (!visible || !qualifierClass || qualifierClass === 'Q-00') return null
  return (
    <div className="qualifier-mandate" role="alert" aria-atomic="true">
      <div className="qualifier-mandate-left">
        <span className="qualifier-mandate-class">QUALIFIER {qualifierClass}</span>
        <span className="qualifier-mandate-sublabel">Partial Signal Grounding</span>
      </div>
      <div className="qualifier-mandate-text">
        Signal confidence is partial. This assessment reflects available grounding only.
        Advisory review is mandatory before executive commitment on qualified signals.
      </div>
    </div>
  )
}

/* ── Semantic Actor Registry ──────────────────────────────────────────────
 * The 15 canonical semantic actors that LENS V2 representation modes compose from.
 * Each mode draws on a DIFFERENT subset — this is what differentiates modes,
 * not just visual restyling of the same content.
 *
 * Actors are documented authoritatively in
 * docs/psee/PI.LENS.V2.SEMANTIC-REPRESENTATION-SYSTEM.01/SEMANTIC_ACTOR_REGISTRY.md
 */
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

/* Mode → semantic actor composition. Each mode uses a distinct subset.
 * The four modes do NOT share a common renderable; they share a registry of actors.
 */
const LENS_MODE_SEMANTICS = {
  EXECUTIVE_BALANCED: ['decisionPosture', 'confidenceBoundary', 'resolutionBoundary', 'pressureAnchor', 'reportArtifactAccess'],
  EXECUTIVE_DENSE:    ['semanticTopology', 'structuralBacking', 'semanticOnlyExposure', 'clusterConcentration', 'absorptionLoad', 'pressureAnchor'],
  INVESTIGATION_DENSE:['evidenceTrace', 'signalStack', 'inferenceProhibition', 'confidenceBoundary', 'resolutionBoundary'],
  BOARDROOM:          ['decisionPosture', 'confidenceBoundary', 'pressureAnchor', 'reportArtifactAccess'],
}

/* ── Representation Field — semantic actor canvas engine ─────────────────
 * Each mode composes a distinct set of semantic actors from the registry above.
 * Modes no longer share content — they share a visual grammar of actor panels.
 */

const REP_TIER_COLOR = {
  HIGH:     '#ff6b6b',
  ELEVATED: '#ff9e4a',
  MODERATE: '#ffd700',
  LOW:      '#64ffda',
}

function findByRole(blocks, role) {
  if (!blocks) return null
  return blocks.find(b => b && b.propagation_role === role) || null
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

/* Static report artifacts — recognized as official generated Tier-1 / Tier-2 deliverables.
 * NOTE: live binding to a real client/run pipeline is not yet implemented at this surface.
 * These entries are guarded placeholders documented in
 * docs/psee/PI.LENS.V2.PREMIUM-INTERACTIVE-EXECUTIVE-LAYER.01/FUTURE_CLIENT_RUN_BINDING_CONTRACT.md
 */
const REPORT_PACK_ARTIFACTS = [
  {
    id: 'decision-surface',
    name: 'Decision Surface',
    tier: 'DECISION',
    file: 'lens_decision_surface.html',
    binding_path: '/api/report-pack?artifact=decision-surface&client=<client_id>&run=<run_id>',
  },
  {
    id: 'tier1-narrative',
    name: 'Tier-1 Narrative Brief',
    tier: 'TIER-1',
    file: 'lens_tier1_narrative_brief.html',
    binding_path: '/api/report-pack?artifact=tier1-narrative&client=<client_id>&run=<run_id>',
  },
  {
    id: 'tier1-evidence',
    name: 'Tier-1 Evidence Brief',
    tier: 'TIER-1',
    file: 'lens_tier1_evidence_brief.html',
    binding_path: '/api/report-pack?artifact=tier1-evidence&client=<client_id>&run=<run_id>',
  },
  {
    id: 'tier2-diagnostic',
    name: 'Tier-2 Diagnostic Narrative',
    tier: 'TIER-2',
    file: 'lens_tier2_diagnostic_narrative.html',
    binding_path: '/api/report-pack?artifact=tier2-diagnostic&client=<client_id>&run=<run_id>',
  },
]

function ReportPackBand() {
  // Retained for backwards-reference but no longer rendered as a horizontal band.
  // Report Pack is now part of the SupportRail (right column of IntelligenceField).
  return null
}

/* SupportRail — compact right column of the IntelligenceField.
 * Carries: evidence state · qualifier state · Report Pack access.
 * Replaces the prior horizontal Report Pack band.
 */
function SupportRail({ adapted, scope, boardroomMode }) {
  const badge = (adapted && adapted.readinessBadge) || {}
  const chip = (adapted && adapted.qualifierChip) || {}
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
          {REPORT_PACK_ARTIFACTS.map(a => (
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

/* ExecutiveInterpretation — compressed left column.
 * Companion to the SemanticCanvas; not the dominant element on the surface.
 */
/* Mode-reactive interpretation. The left companion shifts tone, label register,
 * and section emphasis to match the active cognition mode. The narrative content
 * does not change — only how it is framed. */
const INTERP_MODE_FRAMING = {
  EXECUTIVE_BALANCED:  { label: 'EXECUTIVE INTERPRETATION', tone: 'posture',    assessmentLabel: 'Assessment',          whyLabel: 'Why this matters',         structuralLabel: 'Structural context' },
  EXECUTIVE_DENSE:     { label: 'STRUCTURAL INTERPRETATION', tone: 'structural', assessmentLabel: 'Structural reading',  whyLabel: 'Cause and propagation',    structuralLabel: 'Structural context' },
  INVESTIGATION_DENSE: { label: 'FORENSIC INTERPRETATION',   tone: 'forensic',   assessmentLabel: 'Evidence reading',    whyLabel: 'What the evidence shows',  structuralLabel: 'Structural lineage' },
  BOARDROOM:           { label: 'PROJECTION INTERPRETATION', tone: 'projection', assessmentLabel: 'Posture',             whyLabel: '',                         structuralLabel: '' },
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
      {narrative.why_primary_statement && !boardroomMode && framing.whyLabel && (
        <div className="interp-block">
          <div className="interp-section-label">{framing.whyLabel}</div>
          <div className="interp-why">{narrative.why_primary_statement}</div>
        </div>
      )}
      {narrative.structural_summary && densityClass === 'INVESTIGATION_DENSE' && !boardroomMode && framing.structuralLabel && (
        <div className="interp-block">
          <div className="interp-section-label">{framing.structuralLabel}</div>
          <div className="interp-structural">{narrative.structural_summary}</div>
        </div>
      )}
    </aside>
  )
}

function BalancedConsequenceField({ adapted, blocks, scope, renderState }) {
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
          { id: 'Z2', name: 'Resolution Boundary' },
          { id: 'Z4', name: 'Pressure Anchor' },
        ]}
      />

      {/* Decision Posture — semantic actor A */}
      <div className="actor actor--decision-posture">
        <div className="actor-tag">
          <span className="actor-code">DP</span>
          <span className="actor-name">Decision Posture</span>
        </div>
        <div className="actor-decision-state">{badge.state_label || '—'}</div>
        {chip.renders && (
          <div className="actor-decision-qualifier">
            <span className="actor-decision-qualifier-class">{chip.class_label || chip.qualifier_class}</span>
            <span className="actor-decision-qualifier-note">advisory bound · executive action requires confirmation</span>
          </div>
        )}
      </div>

      {/* Resolution Boundary — semantic actor M */}
      <div className="actor actor--resolution-boundary">
        <div className="actor-tag">
          <span className="actor-code">RB</span>
          <span className="actor-name">Resolution Boundary</span>
        </div>
        <div className="actor-resolution-grid">
          <div className="actor-resolution-cell actor-resolution-cell--known">
            <div className="actor-resolution-cell-label">Known · structurally backed</div>
            <div className="actor-resolution-cell-value">{grounded} of {total} domains</div>
            <div className="actor-resolution-cell-meta">primary delivery · coordination layer</div>
          </div>
          <div className="actor-resolution-cell actor-resolution-cell--partial">
            <div className="actor-resolution-cell-label">Partial · semantic-only exposure</div>
            <div className="actor-resolution-cell-value">{Math.max(0, total - grounded)} of {total} domains</div>
            <div className="actor-resolution-cell-meta">secondary delivery (Q-01)</div>
          </div>
          <div className="actor-resolution-cell actor-resolution-cell--unknown">
            <div className="actor-resolution-cell-label">Execution-not-yet-validated</div>
            <div className="actor-resolution-cell-value">advisory</div>
            <div className="actor-resolution-cell-meta">downstream secondary impact</div>
          </div>
        </div>
      </div>

      {/* Confidence Boundary — semantic actor B (compact ribbon) */}
      <div className="actor actor--confidence-boundary">
        <div className="actor-tag">
          <span className="actor-code">CB</span>
          <span className="actor-name">Confidence Boundary</span>
        </div>
        <div className="actor-confidence-bar">
          <div className="actor-confidence-bar-fill" style={{ width: `${groundedPct}%` }} aria-label={`${groundedPct}% structurally backed`} />
          <div className="actor-confidence-bar-advisory" style={{ width: `${100 - groundedPct}%` }} aria-label={`${100 - groundedPct}% advisory bound`} />
        </div>
        <div className="actor-confidence-meta">
          <span><span className="actor-confidence-dot actor-confidence-dot--grounded" /> {groundedPct}% supported</span>
          <span><span className="actor-confidence-dot actor-confidence-dot--advisory" /> {100 - groundedPct}% advisory bound</span>
        </div>
      </div>

      {/* Pressure Anchor — semantic actor C (single cue, not a triad) */}
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
    </div>
  )
}

function DenseTopologyField({ adapted, blocks, scope }) {
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

      {/* Semantic Topology + Structural Backing + Semantic-Only Exposure (G + H + I) */}
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

      {/* Cluster Concentration — semantic actor J */}
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

      {/* Absorption Load — semantic actor E (Coordination Layer dedicated panel) */}
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
    </div>
  )
}

function InvestigationTraceField({ adapted, blocks, scope, fullReport }) {
  // Flatten signal_cards across all blocks — each individual signal becomes a row.
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

      {/* Evidence Trace · lineage chain — semantic actor L */}
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

      {/* Signal Stack — semantic actor K (every signal individually, not 3 domains) */}
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
                  <span className="actor-signal-row-tier">{s.pressure_tier}</span>
                </div>
                <div className="actor-signal-row-body">
                  <div className="actor-signal-row-head">
                    <span className="actor-signal-row-name">{s.signal_label}</span>
                    <span className="actor-signal-row-domain">{s.domain}</span>
                  </div>
                  <div className="actor-signal-row-pressure">{s.pressure_label}</div>
                  <div className="actor-signal-row-evidence">{s.evidence_text}</div>
                  <div className="actor-signal-row-conf">
                    <span className="actor-signal-row-conf-label">Confidence</span>
                    <span className="actor-signal-row-conf-value">{s.grounding_label}</span>
                    {s.grounding_status !== 'Q-00' && <span className="actor-signal-row-conf-flag">advisory bound</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inference Prohibition — semantic actor N */}
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
    </div>
  )
}

function BoardroomAtmosphericField({ adapted, renderState, scope }) {
  const badge = (adapted && adapted.readinessBadge) || {}
  const chip = (adapted && adapted.qualifierChip) || {}
  const grounded = (scope && scope.grounded_domain_count) || 0
  const total = (scope && scope.domain_count) || 1
  const groundedPct = Math.round((grounded / Math.max(1, total)) * 100)
  const advisoryPct = 100 - groundedPct
  return (
    <div className="rep-field rep-field--boardroom">
      <RepModeTag
        label="Projection lens"
        sub="Boardroom — minimal chrome"
        zones={[
          { id: 'Z1', name: 'Decision Posture' },
          { id: 'Z2', name: 'Confidence Envelope' },
        ]}
      />

      {/* Decision Posture label above ring */}
      <div className="rep-board-decision-label">DECISION POSTURE</div>

      {/*
        Confidence Envelope ring — semantic actor B made visual.
        The arc represents the structural-backing ratio of the assessment:
          - filled state-color arc = grounded portion (e.g. 67%)
          - dashed/lighter arc = advisory-bounded portion (e.g. 33%)
        The ring is no longer a decorative atmospheric mark.
      */}
      <div className="rep-board-mark" data-state={renderState} aria-label={`Confidence envelope: ${groundedPct}% structurally backed, ${advisoryPct}% advisory bound`}>
        <div className="rep-board-envelope">
          <div
            className="rep-board-envelope-arc"
            style={{
              background: `conic-gradient(var(--state-color) 0deg ${groundedPct * 3.6}deg, rgba(230,184,0,0.55) ${groundedPct * 3.6}deg 360deg)`,
            }}
          />
          <div className="rep-board-envelope-mask" />
          <div className="rep-board-envelope-center">
            <div className="rep-board-envelope-state">{chip.class_label || chip.qualifier_class || badge.state_label || '—'}</div>
            <div className="rep-board-envelope-sub">qualified-ready</div>
          </div>
        </div>
      </div>

      {/* Envelope readout */}
      <div className="rep-board-envelope-readout">
        <div className="rep-board-envelope-readout-row">
          <span className="rep-board-envelope-readout-dot rep-board-envelope-readout-dot--grounded" />
          <span className="rep-board-envelope-readout-value">{groundedPct}%</span>
          <span className="rep-board-envelope-readout-label">structurally backed</span>
        </div>
        <div className="rep-board-envelope-readout-row">
          <span className="rep-board-envelope-readout-dot rep-board-envelope-readout-dot--advisory" />
          <span className="rep-board-envelope-readout-value">{advisoryPct}%</span>
          <span className="rep-board-envelope-readout-label">advisory bound</span>
        </div>
      </div>

      <div className="rep-board-statement">
        {badge.state_label || 'Operating posture'}. Pressure is propagating through coordination — advisory-bounded at the secondary receiver.
      </div>
      <div className="rep-board-line" aria-hidden="true" />
      <div className="rep-board-scope">
        {(scope && scope.grounding_label) || 'Partial Coverage'}
      </div>
    </div>
  )
}

function RepresentationField({ boardroomMode, densityClass, adapted, renderState, blocks, scope, fullReport }) {
  if (boardroomMode) {
    return <BoardroomAtmosphericField adapted={adapted} renderState={renderState} scope={scope} />
  }
  if (densityClass === 'INVESTIGATION_DENSE') {
    return <InvestigationTraceField adapted={adapted} blocks={blocks} scope={scope} fullReport={fullReport} />
  }
  if (densityClass === 'EXECUTIVE_BALANCED') {
    return <BalancedConsequenceField adapted={adapted} blocks={blocks} scope={scope} renderState={renderState} />
  }
  return <DenseTopologyField adapted={adapted} blocks={blocks} scope={scope} />
}

function IntelligenceField({ narrative, adapted, densityClass, boardroomMode, renderState, evidenceBlocks }) {
  const scope = FLAGSHIP_REAL_REPORT.topology_scope || {}
  return (
    <div
      className={`intelligence-field intelligence-field--three-col${boardroomMode ? ' intelligence-field--boardroom' : ''}`}
      data-mode={boardroomMode ? 'BOARDROOM' : densityClass}
    >
      {/* LEFT — Executive Interpretation Layer (compressed companion) */}
      <ExecutiveInterpretation
        narrative={narrative}
        densityClass={densityClass}
        boardroomMode={boardroomMode}
        adapted={adapted}
      />

      {/* CENTER — Semantic Operational Canvas (primary cognition surface) */}
      <main className="intel-canvas" role="region" aria-label="Semantic operational canvas">
        <RepresentationField
          boardroomMode={boardroomMode}
          densityClass={densityClass}
          adapted={adapted}
          renderState={renderState}
          blocks={evidenceBlocks}
          scope={scope}
          fullReport={FLAGSHIP_REAL_REPORT}
        />
      </main>

      {/* RIGHT — Support Rail (evidence state · qualifier · Report Pack access) */}
      <SupportRail
        adapted={adapted}
        scope={scope}
        boardroomMode={boardroomMode}
      />
    </div>
  )
}

function DomainNode({ name, pressureTier, role, groundingStatus }) {
  const pm = PRESSURE_META[pressureTier] || PRESSURE_META.MODERATE
  const rm = ROLE_META[role] || { label: role, symbol: '·', color: '#5a6580' }
  const isPartial = groundingStatus && groundingStatus !== 'Q-00'
  return (
    <div className="domain-node" style={{ '--pcolor': pm.color }}>
      <div className="domain-node-top">
        <span className="domain-role-sym" style={{ color: rm.color }}>{rm.symbol}</span>
        <span className="domain-role-lbl">{rm.label}</span>
        {isPartial && <span className="domain-partial">Q-01</span>}
      </div>
      <div className="domain-name">{name}</div>
      <div className="domain-pressure" style={{ color: pm.color }}>
        {pm.symbol} {pm.label}
      </div>
    </div>
  )
}

function PressureConnector({ pressureTier }) {
  const pm = PRESSURE_META[pressureTier] || PRESSURE_META.MODERATE
  return (
    <div className="pressure-connector" style={{ '--pcolor': pm.color }}>
      <div className="connector-line" />
      <div className="connector-head">›</div>
    </div>
  )
}

function StructuralTopologyZone({ evidenceBlocks, propagationChains }) {
  // Demoted to a thin selected-path strip.
  // Previously this was a full-width chain of weighted nodes that duplicated the
  // semantic content already present in each mode's center canvas. The duplication
  // created the illusion of richness; now the strip is a calm contextual line.
  const primary = propagationChains && propagationChains.length
    ? propagationChains.reduce((a, b) => a.path.length >= b.path.length ? a : b, propagationChains[0])
    : null
  if (!primary) return null
  return (
    <div className="topology-strip" aria-label="Selected propagation path">
      <span className="topology-strip-label">SELECTED PATH</span>
      <span className="topology-strip-path">{primary.path.join(' → ')}</span>
      <span className="topology-strip-sep">·</span>
      <span
        className="topology-strip-tier"
        style={{ color: (PRESSURE_META[primary.pressure_tier] || {}).color }}
      >
        {primary.pressure_tier} origin
      </span>
      <span className="topology-strip-sep">·</span>
      <span className="topology-strip-meta">
        {(propagationChains || []).length} chain{(propagationChains || []).length === 1 ? '' : 's'} captured
      </span>
    </div>
  )
}

function EvidenceBlock({ block }) {
  const firstCard = block.signal_cards && block.signal_cards[0]
  const pm = firstCard ? (PRESSURE_META[firstCard.pressure_tier] || PRESSURE_META.MODERATE) : null
  const rm = ROLE_META[block.propagation_role] || null
  const isPartial = block.grounding_status && block.grounding_status !== 'Q-00'
  return (
    <div className={`evidence-block${isPartial ? ' evidence-block--partial' : ''}`}>
      <div className="eb-header">
        <div className="eb-domain">{block.domain_alias}</div>
        <div className="eb-tags">
          {rm && <span className="eb-tag" style={{ color: rm.color }}>{rm.symbol} {rm.label}</span>}
          {pm && <span className="eb-tag" style={{ color: pm.color }}>{pm.symbol} {pm.label}</span>}
          {isPartial && <span className="eb-tag eb-tag--partial">PARTIAL</span>}
        </div>
      </div>
      {block.evidence_description && (
        <div className="eb-description">{block.evidence_description}</div>
      )}
      {firstCard && firstCard.evidence_text && (
        <div className="eb-signal">{firstCard.evidence_text}</div>
      )}
    </div>
  )
}

function EvidenceDepthLayer({ evidenceBlocks, densityClass }) {
  if (!evidenceBlocks || !evidenceBlocks.length) return null
  const showAll = densityClass !== 'EXECUTIVE_BALANCED'
  const visible = showAll ? evidenceBlocks : evidenceBlocks.slice(0, 2)
  return (
    <div className="evidence-layer">
      <div className="zone-label">SIGNAL EVIDENCE</div>
      <div className="evidence-grid">
        {visible.map((b, i) => <EvidenceBlock key={b.domain_alias || i} block={b} />)}
      </div>
      {!showAll && evidenceBlocks.length > 2 && (
        <div className="evidence-more">
          +{evidenceBlocks.length - 2} additional domains visible in Dense and Investigation views
        </div>
      )}
    </div>
  )
}

function GovernanceRibbon({ governance }) {
  const entries = Object.entries(governance)
  const allPass = entries.every(([, v]) => v === true)
  return (
    <div className={`gov-ribbon${allPass ? '' : ' gov-ribbon--fail'}`}>
      <span className="gov-label">GOVERNANCE</span>
      <div className="gov-items">
        {entries.map(([key, val]) => (
          <span key={key} className={`gov-item${val ? ' gov-pass' : ' gov-fail'}`}>
            <span className="gov-dot">{val ? '✓' : '✗'}</span>
            <span className="gov-key">{key.replace(/_/g, ' ')}</span>
          </span>
        ))}
      </div>
      <a href="/" className="gov-back" title="Return to executive overview">← Overview</a>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LensV2FlagshipPage() {
  const [densityClass, setDensityClass] = useState('EXECUTIVE_DENSE')
  const [boardroomMode, setBoardroomMode] = useState(false)
  const [investigationStage, setInvestigationStage] = useState('SUMMARY')

  const result = useMemo(() => orchestrateFlagshipExperience(
    FLAGSHIP_REAL_REPORT,
    'EXECUTIVE',
    densityClass,
    boardroomMode,
    investigationStage,
  ), [densityClass, boardroomMode, investigationStage])

  const { renderState, adapted, motionProfile, urgencyFrame, densityLayout, governance } = result
  const gravityToken = resolveGravityToken(renderState)
  const presenceToken = resolvePresenceToken(renderState)
  const narrative = (adapted && adapted.narrative) || {}
  const qualifierVisible = densityLayout.qualifier_notice_visible === true

  const isBlocked = renderState === 'BLOCKED'
  const isDiagnostic = renderState === 'DIAGNOSTIC_ONLY'

  return (
    <>
      <Head>
        <title>LENS v2 — Executive Intelligence</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div
        className="v2-canvas"
        data-render-state={renderState}
        data-gravity-token={gravityToken}
        data-presence-token={presenceToken}
        data-boardroom={String(boardroomMode)}
        data-density={densityClass}
      >
        <AuthorityBand
          densityClass={densityClass}
          boardroomMode={boardroomMode}
          onDensityChange={setDensityClass}
          onBoardroomToggle={() => setBoardroomMode(p => !p)}
        />

        <div className="v2-body">
          {isBlocked && <BlockedDeclaration adapted={adapted} />}
          {isDiagnostic && !isBlocked && <DiagnosticDeclaration />}

          {!isBlocked && <DeclarationZone renderState={renderState} adapted={adapted} />}

          <QualifierMandate
            qualifierClass={FLAGSHIP_REAL_REPORT.qualifier_class}
            visible={qualifierVisible}
          />

          <IntelligenceField
            narrative={narrative}
            adapted={adapted}
            densityClass={densityClass}
            boardroomMode={boardroomMode}
            renderState={renderState}
            evidenceBlocks={FLAGSHIP_REAL_REPORT.evidence_blocks}
          />

          <StructuralTopologyZone
            evidenceBlocks={FLAGSHIP_REAL_REPORT.evidence_blocks}
            propagationChains={FLAGSHIP_PROPAGATION_CHAINS}
          />

          {/* Evidence Layer is gated to INVESTIGATION mode only — in BALANCED, DENSE,
              and BOARDROOM the per-block evidence cards repeated content already
              represented as semantic actors in the center canvas, and read as crushed
              footer cards. INVESTIGATION mode keeps the contextual evidence drawer. */}
          {densityClass === 'INVESTIGATION_DENSE' && !boardroomMode && (
            <EvidenceDepthLayer
              evidenceBlocks={FLAGSHIP_REAL_REPORT.evidence_blocks}
              densityClass={densityClass}
            />
          )}
        </div>

        <GovernanceRibbon governance={governance} />
      </div>

      <style jsx global>{`
        /* ── Reset ───────────────────────────────────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { color: inherit; text-decoration: none; }
        button { cursor: pointer; font-family: inherit; }

        /* ── Entrance animations ─────────────────────────────────────────── */
        @keyframes v2Enter {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes v2Appear {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Root canvas ─────────────────────────────────────────────────── */
        /*
         * Color doctrine:
         *   #e8edf8  primary text     (near-white, high contrast)
         *   #9aa0bc  secondary text   (readable mid-grey)
         *   #5a6580  tertiary text    (dim but visible)
         *   #3a4560  section labels   (clearly visible)
         *   #232d42  ghost/structural (very subtle)
         *   #080a0f  deep surface
         *   #0d0f14  primary canvas
         *   #111420  card surface
         */
        .v2-canvas {
          min-height: 100vh;
          /* Graphite ground with subtle environmental gradient — replaces near-black flat surface */
          background:
            radial-gradient(120% 80% at 18% 0%, rgba(74,158,255,0.04) 0%, transparent 55%),
            radial-gradient(140% 90% at 88% 110%, rgba(255,158,74,0.025) 0%, transparent 60%),
            #14171f;
          color: #e8edf8;
          /* Humanist sans system stack — replaces monospace primary per cinematic doctrine */
          font-family: -apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", "SF Pro Text", system-ui, "Segoe UI", Roboto, sans-serif;
          font-feature-settings: "ss01", "cv11", "cv02";
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-size: 14px;
          line-height: 1.55;
          display: flex;
          flex-direction: column;
          --state-color:  #4a9eff;
          --state-bg:     rgba(74,158,255,0.07);
          --state-border: rgba(74,158,255,0.22);
        }
        .v2-canvas[data-render-state="EXECUTIVE_READY"] {
          --state-color:  #64ffda;
          --state-bg:     rgba(100,255,218,0.06);
          --state-border: rgba(100,255,218,0.22);
        }
        .v2-canvas[data-render-state="EXECUTIVE_READY_WITH_QUALIFIER"] {
          --state-color:  #e6b800;
          --state-bg:     rgba(230,184,0,0.06);
          --state-border: rgba(230,184,0,0.26);
        }
        .v2-canvas[data-render-state="DIAGNOSTIC_ONLY"] {
          --state-color:  #ff9e4a;
          --state-bg:     rgba(255,158,74,0.06);
          --state-border: rgba(255,158,74,0.22);
        }
        .v2-canvas[data-render-state="BLOCKED"] {
          --state-color:  #ff6b6b;
          --state-bg:     rgba(255,107,107,0.06);
          --state-border: rgba(255,107,107,0.22);
        }

        /* ── Authority Band ──────────────────────────────────────────────── */
        .auth-band {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 56px;
          background: rgba(11, 13, 18, 0.78);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid #1a2030;
          position: sticky;
          top: 0;
          z-index: 100;
          animation: v2Appear 0.25s ease both;
        }
        .auth-left {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .auth-wordmark {
          font-size: 14px;
          font-weight: 600;
          color: var(--state-color);
          letter-spacing: 0.32em;
          transition: color 0.4s;
        }
        .auth-version {
          font-size: 10px;
          color: #5a6580;
          letter-spacing: 0.08em;
          font-weight: 500;
        }
        .auth-sep {
          display: inline-block;
          width: 1px;
          height: 11px;
          background: #232d42;
          margin: 0 6px;
          vertical-align: middle;
        }
        .auth-descriptor {
          font-size: 11px;
          color: #6a7593;
          letter-spacing: 0.07em;
          font-weight: 400;
        }
        .auth-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .auth-program {
          font-size: 11px;
          color: #6a7593;
          letter-spacing: 0.04em;
          font-weight: 400;
        }
        .auth-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .auth-mode-group {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }
        .auth-density-group {
          display: flex;
          border: 1px solid #2a334a;
          border-radius: 4px;
          overflow: hidden;
          background: rgba(10, 12, 18, 0.5);
        }
        .auth-density-btn {
          background: transparent;
          border: none;
          border-right: 1px solid #2a334a;
          color: #7a85a3;
          padding: 7px 16px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          transition: background 0.18s ease, color 0.18s ease;
          cursor: pointer;
        }
        .auth-density-btn:last-child { border-right: none; }
        .auth-density-btn:hover {
          background: rgba(34, 41, 60, 0.55);
          color: #b6bdd6;
        }
        .auth-density-btn.active {
          background: var(--state-bg);
          color: var(--state-color);
          font-weight: 600;
        }
        .auth-density-btn--boardroom {
          letter-spacing: 0.14em;
        }
        .auth-density-btn:focus-visible {
          outline: 1px solid var(--state-color);
          outline-offset: -1px;
        }
        .auth-persona-line {
          font-size: 10px;
          color: #6a7593;
          letter-spacing: 0.02em;
          text-align: right;
          font-weight: 400;
          line-height: 1;
          transition: color 0.4s;
        }
        .auth-persona-label {
          color: #b6bdd6;
          font-weight: 500;
          letter-spacing: 0.04em;
        }
        .auth-persona-sep {
          color: #3a4560;
        }
        .auth-persona-sub {
          color: #6a7593;
        }

        /* ── Body ────────────────────────────────────────────────────────── */
        .v2-body { flex: 1; display: flex; flex-direction: column; }

        /* ── Blocked Declaration ─────────────────────────────────────────── */
        .blocked-declaration {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          padding: 40px 48px;
          background: rgba(255,107,107,0.05);
          border-bottom: 1px solid rgba(255,107,107,0.15);
          animation: v2Enter 0.4s ease 0.1s both;
        }
        .blocked-icon { font-size: 18px; color: #ff6b6b; margin-top: 5px; flex-shrink: 0; }
        .blocked-headline {
          font-size: 20px;
          font-weight: 700;
          color: #ff6b6b;
          letter-spacing: 0.06em;
          margin-bottom: 10px;
        }
        .blocked-detail { font-size: 14px; color: #5a6580; line-height: 1.7; }

        /* ── Diagnostic Declaration ──────────────────────────────────────── */
        .diagnostic-declaration {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 48px;
          background: rgba(255,158,74,0.05);
          border-bottom: 1px solid rgba(255,158,74,0.15);
          animation: v2Enter 0.4s ease 0.1s both;
        }
        .diagnostic-icon { font-size: 15px; color: #ff9e4a; flex-shrink: 0; }
        .diagnostic-headline {
          font-size: 12px;
          font-weight: 700;
          color: #ff9e4a;
          letter-spacing: 0.09em;
        }
        .diagnostic-detail { font-size: 12px; color: #5a6580; }

        /* ── Declaration Zone ────────────────────────────────────────────── */
        .declaration-zone {
          padding: 80px 56px 56px;
          border-bottom: 1px solid #1a2030;
          border-left: 4px solid var(--state-color);
          background:
            radial-gradient(120% 80% at 12% 50%, var(--state-bg) 0%, transparent 55%),
            linear-gradient(90deg, rgba(20,23,31,0.55) 0%, transparent 70%);
          animation: v2Enter 0.5s ease 0.12s both;
          transition: border-color 0.4s, background 0.4s;
        }
        .declaration-pre-label {
          font-size: 10px;
          color: #5a6580;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          margin-bottom: 22px;
          font-weight: 500;
        }
        .declaration-state {
          font-size: 64px;
          font-weight: 600;
          color: var(--state-color);
          letter-spacing: -0.012em;
          line-height: 1.04;
          transition: color 0.4s;
          max-width: 1100px;
        }
        .declaration-scope {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 22px;
        }
        .declaration-scope-item {
          font-size: 12px;
          color: #6a7593;
          letter-spacing: 0.04em;
          font-weight: 400;
        }
        .declaration-scope-sep { color: #3a4560; }

        /* ── Qualifier Mandate ───────────────────────────────────────────── */
        .qualifier-mandate {
          display: flex;
          align-items: flex-start;
          gap: 28px;
          padding: 20px 56px;
          background: rgba(230,184,0,0.05);
          border-top: 1px solid rgba(230,184,0,0.16);
          border-bottom: 1px solid rgba(230,184,0,0.16);
          animation: v2Enter 0.5s ease 0.22s both;
        }
        .qualifier-mandate-left {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .qualifier-mandate-class {
          font-size: 10px;
          font-weight: 700;
          color: #e6b800;
          letter-spacing: 0.16em;
          background: rgba(230,184,0,0.12);
          border: 1px solid rgba(230,184,0,0.28);
          padding: 3px 10px;
          border-radius: 2px;
          white-space: nowrap;
        }
        .qualifier-mandate-sublabel {
          font-size: 9px;
          color: rgba(230,184,0,0.5);
          letter-spacing: 0.1em;
          text-align: center;
        }
        .qualifier-mandate-text {
          font-size: 13.5px;
          color: rgba(230,184,0,0.82);
          line-height: 1.6;
          letter-spacing: 0;
          padding-top: 2px;
          font-weight: 400;
        }

        /* ── Intelligence Field — three-column operational surface ───────── */
        .intelligence-field {
          display: grid;
          grid-template-columns: minmax(260px, 0.85fr) minmax(0, 2.2fr) minmax(280px, 0.8fr);
          border-bottom: 1px solid #1a2030;
          animation: v2Enter 0.5s ease 0.32s both;
          align-items: stretch;
        }
        .intelligence-field--boardroom {
          grid-template-columns: minmax(240px, 0.7fr) minmax(0, 2.6fr) minmax(260px, 0.7fr);
        }
        @media (max-width: 1280px) {
          .intelligence-field {
            grid-template-columns: minmax(240px, 0.9fr) minmax(0, 1.8fr) minmax(240px, 0.7fr);
          }
        }

        /* LEFT — Executive Interpretation Layer (compressed companion) */
        .intel-interp {
          padding: 48px 32px 48px 56px;
          border-right: 1px solid #1a2030;
          display: flex;
          flex-direction: column;
          gap: 24px;
          background: rgba(8, 10, 15, 0.32);
        }
        .intel-interp[aria-label] { /* selector boost */ }
        .interp-tag {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding-bottom: 16px;
          border-bottom: 1px solid #1a2030;
        }
        .interp-tag-label {
          font-size: 9px;
          color: #5a6580;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .interp-tag-state {
          font-size: 13px;
          font-weight: 600;
          color: var(--state-color);
          letter-spacing: -0.003em;
          line-height: 1.3;
          transition: color 0.4s;
        }
        .interp-block { display: flex; flex-direction: column; gap: 8px; }
        .interp-section-label {
          font-size: 9px;
          color: #5a6580;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .interp-summary {
          font-size: 13px;
          color: #c5cce3;
          line-height: 1.6;
          letter-spacing: -0.002em;
          font-weight: 400;
          border-left: 2px solid var(--state-color);
          padding-left: 14px;
          transition: border-color 0.4s, color 0.3s;
        }
        /* Mode-reactive interpretation tonal shifts — same content, different register. */
        .intel-interp[data-tone="posture"]    .interp-summary { color: #d6dceb; }
        .intel-interp[data-tone="structural"] .interp-summary { color: #c5cce3; border-left-color: rgba(255,158,74,0.6); }
        .intel-interp[data-tone="forensic"]   .interp-summary { color: #c5cce3; border-left-color: rgba(230,184,0,0.6); }
        .intel-interp[data-tone="projection"] .interp-summary { color: #e8edf8; font-size: 14px; line-height: 1.55; }
        .intel-interp[data-tone="forensic"]   .interp-tag-label { color: #b08c00; }
        .intel-interp[data-tone="structural"] .interp-tag-label { color: #b87632; }
        .intel-interp[data-tone="projection"] .interp-tag-label { color: #5a6580; }
        .interp-why {
          font-size: 12px;
          color: #9aa0bc;
          line-height: 1.6;
          letter-spacing: 0;
          padding-left: 16px;
          font-weight: 400;
        }
        .interp-structural {
          font-size: 11px;
          color: #7a85a3;
          line-height: 1.55;
          padding-left: 16px;
        }

        /* CENTER — Semantic Operational Canvas (primary cognition surface) */
        .intel-canvas {
          padding: 56px 56px 64px;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(110% 70% at 50% 0%, rgba(74,158,255,0.04) 0%, transparent 60%),
            radial-gradient(70% 50% at 50% 100%, rgba(255,158,74,0.025) 0%, transparent 70%);
          min-height: 620px;
        }
        .intelligence-field--boardroom .intel-canvas {
          padding: 72px 64px 80px;
          background:
            radial-gradient(80% 60% at 50% 35%, var(--state-bg) 0%, transparent 70%);
          min-height: 680px;
        }

        /* RIGHT — Support Rail (compact) */
        .intel-support {
          padding: 48px 32px 48px 28px;
          border-left: 1px solid #1a2030;
          background: rgba(8, 10, 15, 0.42);
          display: flex;
          flex-direction: column;
          gap: 26px;
        }
        .intelligence-field--boardroom .intel-support {
          padding: 64px 32px 64px 28px;
        }
        .support-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .support-label {
          font-size: 9px;
          color: #5a6580;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .support-readiness {
          font-size: 13px;
          font-weight: 600;
          color: var(--state-color);
          letter-spacing: -0.002em;
          line-height: 1.3;
          transition: color 0.4s;
        }
        .support-coverage {
          font-size: 11px;
          color: #b6bdd6;
          line-height: 1.5;
        }
        .support-coverage-meta {
          font-size: 10px;
          color: #6a7593;
          letter-spacing: 0.02em;
        }
        .support-block--qualifier {
          padding-top: 18px;
          border-top: 1px solid #1a2030;
        }
        .support-qualifier-class {
          font-size: 13px;
          font-weight: 600;
          color: #e6b800;
          letter-spacing: 0.04em;
        }
        .support-qualifier-note {
          font-size: 9px;
          color: #6a7593;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .support-block--reports {
          margin-top: auto;
          padding-top: 22px;
          border-top: 1px solid #1a2030;
          gap: 10px;
        }
        .support-reports-sub {
          font-size: 10px;
          color: #6a7593;
          line-height: 1.5;
          margin-bottom: 4px;
        }
        .support-reports-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .support-report-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 8px 10px;
          background: rgba(20, 23, 31, 0.4);
          border: 1px solid #1a2030;
          border-radius: 3px;
          cursor: not-allowed;
          transition: border-color 0.18s ease;
        }
        .support-report-item:hover {
          border-color: #2a334a;
        }
        .support-report-tier {
          font-size: 8px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #5a6580;
          font-weight: 500;
        }
        .support-report-name {
          font-size: 11px;
          color: #c5cce3;
          font-weight: 500;
          letter-spacing: -0.002em;
          line-height: 1.3;
        }
        .support-reports-state {
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 9px;
          color: #6a7593;
          letter-spacing: 0.04em;
          line-height: 1.5;
        }
        .support-reports-state-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #6a7593;
          opacity: 0.55;
          flex-shrink: 0;
        }

        .status-value--state { color: var(--state-color); transition: color 0.4s; font-weight: 600; }

        /* ── Representation Field — primary semantic operational canvas ───
         * Each lens mode renders the field as an atmospheric environment, not as
         * a stack of cards. The field provides ambient gradient backing; actors
         * provide semantic zones inside it. */
        .rep-field {
          display: flex;
          flex-direction: column;
          gap: 18px;
          flex: 1;
          animation: v2Enter 0.45s ease both;
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
          position: relative;
          padding: 18px 0;
        }
        .rep-field::after {
          /* Mode-specific atmospheric backing layer — set per-mode below. */
          content: '';
          position: absolute;
          inset: -16px -24px;
          z-index: -1;
          pointer-events: none;
        }
        .rep-field--balanced::after {
          background:
            radial-gradient(60% 50% at 22% 28%, var(--state-bg) 0%, transparent 65%),
            radial-gradient(45% 40% at 78% 78%, rgba(230,184,0,0.05) 0%, transparent 70%),
            radial-gradient(80% 60% at 50% 100%, rgba(74,158,255,0.025) 0%, transparent 80%);
        }
        .rep-field--dense::after {
          background:
            radial-gradient(38% 32% at 22% 30%, rgba(255,107,107,0.07) 0%, transparent 60%),
            radial-gradient(55% 42% at 50% 55%, rgba(255,158,74,0.06) 0%, transparent 72%),
            radial-gradient(34% 28% at 80% 80%, rgba(230,184,0,0.06) 0%, transparent 65%);
        }
        .rep-field--investigation::after {
          background:
            linear-gradient(180deg, rgba(74,158,255,0.04) 0%, transparent 30%, rgba(230,184,0,0.04) 100%);
        }
        .rep-field--boardroom::after {
          background:
            radial-gradient(70% 60% at 50% 42%, var(--state-bg) 0%, transparent 75%);
        }

        .rep-mode-tag {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-bottom: 18px;
          border-bottom: 1px solid #1a2030;
        }
        .rep-mode-tag-label {
          font-size: 11px;
          color: #b6bdd6;
          letter-spacing: 0.06em;
          font-weight: 500;
          text-transform: uppercase;
        }
        .rep-mode-tag-sub {
          font-size: 10px;
          color: #6a7593;
          letter-spacing: 0.04em;
          font-weight: 400;
        }
        .rep-mode-tag-zones {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 8px;
          margin-top: 10px;
        }
        .rep-zone-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 8px 3px 6px;
          background: rgba(74, 158, 255, 0.06);
          border: 1px solid rgba(74, 158, 255, 0.18);
          border-radius: 11px;
          font-size: 9px;
          letter-spacing: 0.06em;
          color: #b6bdd6;
          line-height: 1;
        }
        .rep-zone-chip-id {
          font-weight: 600;
          color: #6a8cd6;
          letter-spacing: 0.08em;
        }
        .rep-zone-chip-name {
          color: #9aa0bc;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .rep-field--boardroom .rep-mode-tag-zones {
          justify-content: center;
        }

        /* Dense — cluster concentration panel */
        .rep-dense-cluster {
          padding: 14px 16px;
          background: rgba(20, 23, 31, 0.55);
          border-left: 2px solid rgba(74, 158, 255, 0.32);
          border-radius: 0 4px 4px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .rep-dense-cluster-bar {
          width: 100%;
          height: 4px;
          background: rgba(74, 158, 255, 0.08);
          border-radius: 2px;
          overflow: hidden;
        }
        .rep-dense-cluster-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--state-color) 0%, rgba(74,158,255,0.6) 100%);
          opacity: 0.75;
          transition: width 0.4s ease;
        }
        .rep-dense-cluster-meta {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .rep-dense-cluster-label {
          font-size: 9px;
          color: #5a6580;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .rep-dense-cluster-value {
          font-size: 11px;
          color: #b6bdd6;
          line-height: 1.5;
        }

        /* (Report Pack horizontal band removed — Report Pack lives inside the SupportRail now.) */

        /* ── Evidence-state compact block (used by Balanced / Dense / Investigation) ── */
        .rep-evstate {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 18px;
          border-top: 1px solid #1a2030;
          margin-top: auto;
        }
        .rep-evstate--compact {
          gap: 6px;
        }
        .rep-evstate-label {
          font-size: 9px;
          color: #5a6580;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .rep-evstate-readiness {
          font-size: 14px;
          font-weight: 600;
          color: var(--state-color);
          letter-spacing: -0.005em;
          transition: color 0.4s;
          line-height: 1.3;
        }
        .rep-evstate-coverage {
          font-size: 11px;
          color: #b6bdd6;
          line-height: 1.5;
        }
        .rep-evstate-coverage-meta { color: #6a7593; }
        .rep-evstate-qualifier {
          margin-top: 4px;
          padding-top: 10px;
          border-top: 1px solid #14181f;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .rep-evstate-qualifier-class {
          font-size: 11px;
          font-weight: 600;
          color: #e6b800;
          letter-spacing: 0.04em;
        }
        .rep-evstate-qualifier-note {
          font-size: 9px;
          color: #6a7593;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── BALANCED — Executive Consequence Canvas (horizontal flow) ──── */
        .rep-field--balanced .rep-balanced-statement {
          font-size: 17px;
          color: #d6dceb;
          line-height: 1.55;
          letter-spacing: -0.005em;
          font-weight: 400;
          padding-left: 18px;
          border-left: 2px solid var(--state-border);
          max-width: 720px;
        }
        .rep-balanced-anchors {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          padding: 24px 0 8px;
          position: relative;
        }
        .rep-balanced-anchors::before {
          content: '';
          position: absolute;
          left: 12%;
          right: 12%;
          top: 56px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255,107,107,0.42) 0%, rgba(255,158,74,0.38) 50%, rgba(255,215,0,0.38) 100%);
          opacity: 0.85;
        }
        .rep-anchor {
          position: relative;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          --tier-color: #6a7593;
        }
        .rep-anchor[data-tier="HIGH"]     { --tier-color: #ff6b6b; }
        .rep-anchor[data-tier="ELEVATED"] { --tier-color: #ff9e4a; }
        .rep-anchor[data-tier="MODERATE"] { --tier-color: #ffd700; }
        .rep-anchor[data-tier="LOW"]      { --tier-color: #64ffda; }
        .rep-anchor::before {
          content: '';
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--tier-color) 0%, transparent 70%);
          opacity: 0.32;
          margin-bottom: 4px;
        }
        .rep-anchor::after {
          content: '';
          position: absolute;
          left: 12px;
          top: 12px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--tier-color);
          box-shadow: 0 0 14px 1px var(--tier-color);
          opacity: 0.95;
        }
        .rep-anchor-rail { display: none; }
        .rep-anchor-label {
          font-size: 9px;
          color: #5a6580;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
          margin-top: 6px;
        }
        .rep-anchor-name {
          font-size: 15px;
          color: #e8edf8;
          font-weight: 600;
          letter-spacing: -0.003em;
          line-height: 1.3;
        }
        .rep-anchor-state {
          font-size: 12px;
          color: var(--tier-color);
          font-weight: 500;
          letter-spacing: 0.02em;
          opacity: 0.95;
        }

        /* ── DENSE — Semantic Topology Canvas (spatial composition) ────── */
        .rep-field--dense .rep-topo {
          display: grid;
          grid-template-columns: 1fr 1.3fr 1fr;
          gap: 0;
          padding: 36px 0 16px;
          position: relative;
          align-items: center;
          min-height: 280px;
        }
        .rep-field--dense .rep-topo::before {
          content: '';
          position: absolute;
          left: 22%;
          right: 22%;
          top: 50%;
          height: 1px;
          background: linear-gradient(90deg, var(--high-c, #ff6b6b) 0%, var(--elev-c, #ff9e4a) 50%, var(--mod-c, #ffd700) 100%);
          --high-c: rgba(255,107,107,0.55);
          --elev-c: rgba(255,158,74,0.55);
          --mod-c: rgba(255,215,0,0.55);
          opacity: 0.5;
          transform: translateY(-1px);
        }
        .rep-topo-step {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 16px 12px;
          --tier-color: #6a7593;
        }
        .rep-topo-step--pass_through {
          background: rgba(20, 23, 31, 0.6);
          border: 1px solid rgba(255, 158, 74, 0.18);
          border-radius: 6px;
          padding: 24px 18px;
          z-index: 2;
        }
        .rep-topo-step--origin .rep-topo-marker,
        .rep-topo-step--receiver .rep-topo-marker {
          align-self: center;
        }
        .rep-topo-step[data-tier="HIGH"]     { --tier-color: #ff6b6b; }
        .rep-topo-step[data-tier="ELEVATED"] { --tier-color: #ff9e4a; }
        .rep-topo-step[data-tier="MODERATE"] { --tier-color: #ffd700; }
        .rep-topo-step[data-tier="LOW"]      { --tier-color: #64ffda; }
        .rep-topo-marker {
          position: relative;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .rep-topo-step--pass_through .rep-topo-marker {
          width: 72px;
          height: 72px;
        }
        .rep-topo-glow {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--tier-color) 0%, transparent 60%);
          opacity: 0.32;
        }
        .rep-topo-dot {
          position: relative;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--tier-color);
          box-shadow: 0 0 18px 1px var(--tier-color);
        }
        .rep-topo-step--pass_through .rep-topo-dot {
          width: 22px;
          height: 22px;
          box-shadow: 0 0 24px 2px var(--tier-color);
        }
        .rep-topo-meta {
          display: flex;
          flex-direction: column;
          gap: 3px;
          align-items: center;
          text-align: center;
        }
        .rep-topo-role {
          font-size: 9px;
          color: #5a6580;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .rep-topo-name {
          font-size: 14px;
          color: #e8edf8;
          font-weight: 600;
          letter-spacing: -0.002em;
        }
        .rep-topo-step--pass_through .rep-topo-name {
          font-size: 16px;
        }
        .rep-topo-tier {
          font-size: 11px;
          color: var(--tier-color);
          font-weight: 500;
          margin-top: 2px;
        }
        .rep-topo-partial {
          font-size: 10px;
          color: #e6b800;
          letter-spacing: 0.06em;
          margin-top: 2px;
        }
        .rep-topo-edge { display: none; } /* spatial layout uses ::before line */
        .rep-dense-note {
          font-size: 12px;
          color: #9aa0bc;
          line-height: 1.6;
          font-style: normal;
          padding: 14px 16px;
          background: rgba(20, 23, 31, 0.55);
          border-left: 2px solid #2a334a;
          border-radius: 0 4px 4px 0;
        }

        /* ── INVESTIGATION — Evidence Trace Field ───────────────────────── */
        .rep-field--investigation .rep-trace-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .rep-trace-band {
          padding: 14px 16px;
          background: rgba(20, 23, 31, 0.55);
          border-left: 2px solid var(--tier-color, #2a334a);
          border-radius: 0 4px 4px 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          --tier-color: #6a7593;
        }
        .rep-trace-band[data-tier="HIGH"]     { --tier-color: #ff6b6b; }
        .rep-trace-band[data-tier="ELEVATED"] { --tier-color: #ff9e4a; }
        .rep-trace-band[data-tier="MODERATE"] { --tier-color: #ffd700; }
        .rep-trace-band[data-tier="LOW"]      { --tier-color: #64ffda; }
        .rep-trace-band--partial {
          background:
            linear-gradient(90deg, rgba(230,184,0,0.07) 0%, rgba(20,23,31,0.55) 30%);
        }
        .rep-trace-band-head {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .rep-trace-band-label {
          font-size: 10px;
          color: var(--tier-color);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .rep-trace-band-domain {
          font-size: 13px;
          color: #e8edf8;
          font-weight: 600;
          letter-spacing: -0.002em;
        }
        .rep-trace-band-explain {
          font-size: 12px;
          color: #b6bdd6;
          line-height: 1.55;
        }
        .rep-trace-band-conf {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          padding-top: 6px;
          border-top: 1px solid #14181f;
        }
        .rep-trace-band-conf-label {
          color: #5a6580;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .rep-trace-band-conf-value {
          color: #b6bdd6;
        }
        .rep-trace-band-conf-flag {
          color: #e6b800;
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        /* ── BOARDROOM — Atmospheric Field ──────────────────────────────── */
        .rep-field--boardroom {
          align-items: center;
          text-align: center;
          gap: 28px;
          justify-content: center;
        }
        .rep-field--boardroom .rep-mode-tag {
          align-items: center;
          text-align: center;
          padding-bottom: 0;
          border-bottom: none;
        }
        .rep-board-mark {
          position: relative;
          width: 320px;
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 24px 0 12px;
        }
        .rep-board-mark-glow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle, var(--state-color) 0%, transparent 60%);
          opacity: 0.22;
        }
        .rep-board-mark-ring {
          position: relative;
          width: 168px;
          height: 168px;
          border-radius: 50%;
          border: 1px solid var(--state-color);
          box-shadow:
            0 0 48px 0 var(--state-bg),
            inset 0 0 32px 0 var(--state-bg);
          opacity: 0.92;
          transition: border-color 0.4s, box-shadow 0.4s;
        }
        .rep-board-mark-ring::before {
          content: '';
          position: absolute;
          inset: -22px;
          border-radius: 50%;
          border: 1px solid var(--state-border);
          opacity: 0.6;
        }
        .rep-board-statement {
          font-size: 19px;
          color: #e8edf8;
          line-height: 1.5;
          letter-spacing: -0.008em;
          font-weight: 400;
          max-width: 520px;
        }
        .rep-board-line {
          width: 56%;
          max-width: 320px;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--state-color) 50%, transparent 100%);
          opacity: 0.5;
        }
        .rep-board-scope {
          font-size: 11px;
          color: #6a7593;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        /* ── Shared zone label ───────────────────────────────────────────── */
        .zone-label {
          font-size: 9px;
          color: #3a4560;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }

        /* ── Selected propagation path strip (demoted from full-width topology zone) ── */
        .topology-strip {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 56px;
          background: rgba(8, 10, 15, 0.42);
          border-bottom: 1px solid #1a2030;
          animation: v2Enter 0.5s ease 0.48s both;
          flex-wrap: wrap;
        }
        .topology-strip-label {
          font-size: 9px;
          color: #5a6580;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
          flex-shrink: 0;
        }
        .topology-strip-path {
          font-size: 12px;
          color: #b6bdd6;
          letter-spacing: 0;
          font-weight: 500;
        }
        .topology-strip-sep { color: #3a4560; }
        .topology-strip-tier {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .topology-strip-meta {
          font-size: 11px;
          color: #6a7593;
          letter-spacing: 0.02em;
        }

        /* (Original .topology-zone kept for fallback; demoted in this iteration to .topology-strip.) */
        .topology-zone {
          padding: 56px 56px;
          border-bottom: 1px solid #1a2030;
          animation: v2Enter 0.5s ease 0.48s both;
          display: none; /* not rendered after PI.LENS.V2.SEMANTIC-REPRESENTATION-SYSTEM.01 */
        }
        .topology-chain {
          display: flex;
          align-items: center;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .chain-item { display: flex; align-items: center; }

        /* Domain node */
        .domain-node {
          flex-shrink: 0;
          min-width: 160px;
          padding: 18px 22px;
          background: #080a0f;
          border: 1px solid #232d42;
          border-radius: 3px;
          display: flex;
          flex-direction: column;
          gap: 7px;
          transition: border-color 0.2s;
        }
        .domain-node:hover { border-color: var(--pcolor, #3a4560); }
        .domain-node-top {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .domain-role-sym { font-size: 10px; }
        .domain-role-lbl {
          font-size: 8px;
          color: #5a6580;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }
        .domain-partial {
          font-size: 7px;
          color: #e6b800;
          background: rgba(230,184,0,0.1);
          border: 1px solid rgba(230,184,0,0.22);
          padding: 1px 5px;
          border-radius: 1px;
          margin-left: 2px;
          letter-spacing: 0.06em;
        }
        .domain-name {
          font-size: 13px;
          color: #e8edf8;
          font-weight: 600;
          letter-spacing: 0.03em;
          line-height: 1.3;
        }
        .domain-pressure {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        /* Pressure connector */
        .pressure-connector {
          display: flex;
          align-items: center;
          padding: 0 6px;
          flex-shrink: 0;
        }
        .connector-line {
          width: 28px;
          height: 1px;
          background: var(--pcolor, #3a4560);
          opacity: 0.35;
        }
        .connector-head {
          font-size: 20px;
          color: var(--pcolor, #3a4560);
          opacity: 0.45;
          margin-left: -6px;
          line-height: 1;
        }

        .topology-footnote {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid #1a2030;
          flex-wrap: wrap;
        }
        .footnote-label {
          font-size: 8px;
          color: #3a4560;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .footnote-path { font-size: 12px; color: #5a6580; letter-spacing: 0.03em; }
        .footnote-sep { color: #3a4560; }
        .footnote-tier { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }

        /* ── Evidence Layer ──────────────────────────────────────────────── */
        .evidence-layer {
          padding: 56px 56px 64px;
          border-bottom: 1px solid #1a2030;
          animation: v2Enter 0.5s ease 0.62s both;
        }
        /*
         * Evidence layer composition:
         *   First block reads as the dominant evidence anchor.
         *   Subsequent blocks read as supporting evidence, visibly demoted.
         *   This breaks the 3-equal-card grid gravity that read as dashboard.
         */
        .evidence-grid {
          display: grid;
          grid-template-columns: minmax(0, 2.1fr) minmax(0, 1fr) minmax(0, 1fr);
          gap: 14px;
          align-items: stretch;
        }
        @media (max-width: 1100px) {
          .evidence-grid { grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); }
          .evidence-grid > .evidence-block:nth-child(n+3) { grid-column: span 2; }
        }
        .evidence-block {
          background: rgba(8, 10, 15, 0.55);
          border: 1px solid #232d42;
          border-radius: 4px;
          padding: 22px 26px;
          display: flex;
          flex-direction: column;
          gap: 11px;
          transition: border-color 0.2s, background 0.2s;
        }
        .evidence-block:first-child {
          background: rgba(20, 23, 31, 0.78);
          border-color: #2a334a;
          padding: 28px 32px;
        }
        .evidence-block:hover { border-color: #3a4560; }
        .evidence-block--partial { border-color: rgba(230,184,0,0.18); }
        .evidence-block--partial:hover { border-color: rgba(230,184,0,0.35); }
        .evidence-block:first-child .eb-domain { font-size: 16px; }
        .evidence-block:first-child .eb-description { font-size: 13.5px; color: #b6bdd6; }
        .eb-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }
        .eb-domain {
          font-size: 13px;
          color: #e8edf8;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .eb-tags {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .eb-tag {
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .eb-tag--partial {
          color: #e6b800;
          background: rgba(230,184,0,0.08);
          border: 1px solid rgba(230,184,0,0.18);
          padding: 1px 5px;
          border-radius: 1px;
        }
        .eb-description {
          font-size: 12px;
          color: #9aa0bc;
          line-height: 1.65;
          letter-spacing: 0.02em;
        }
        .eb-signal {
          font-size: 11px;
          color: #5a6580;
          line-height: 1.65;
          letter-spacing: 0.02em;
          font-style: italic;
          padding-top: 2px;
          border-top: 1px solid #1a2030;
        }
        .evidence-more {
          margin-top: 16px;
          font-size: 10px;
          color: #3a4560;
          letter-spacing: 0.06em;
          font-style: italic;
        }

        /* ── Governance Ribbon ───────────────────────────────────────────── */
        .gov-ribbon {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 9px 48px;
          background: #080a0f;
          border-top: 1px solid #1a2030;
          flex-wrap: wrap;
          gap: 0 0;
        }
        .gov-ribbon--fail { border-top-color: rgba(255,107,107,0.25); }
        .gov-label {
          font-size: 8px;
          color: #232d42;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-right: 16px;
          flex-shrink: 0;
        }
        .gov-items {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 14px;
          flex: 1;
        }
        .gov-item { display: flex; align-items: center; gap: 4px; }
        .gov-dot { font-size: 7px; }
        .gov-pass .gov-dot { color: #1f3a2e; }
        .gov-pass .gov-key { color: #1f3a2e; }
        .gov-fail .gov-dot { color: #ff6b6b; }
        .gov-fail .gov-key { color: #ff6b6b; }
        .gov-key {
          font-size: 7px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .gov-back {
          margin-left: auto;
          font-size: 9px;
          color: #3a4560;
          letter-spacing: 0.1em;
          flex-shrink: 0;
          transition: color 0.15s;
        }
        .gov-back:hover { color: var(--state-color); }

        /* ════════════════════════════════════════════════════════════════
         * SEMANTIC ACTOR PANEL SYSTEM
         * Shared visual grammar for the 15 semantic actors composed across
         * the four lens modes. Replaces the prior mode-specific panels.
         * ════════════════════════════════════════════════════════════════ */

        /* Actors are no longer cards. They are semantic zones inside an atmospheric field.
         * The shared shell is invisible by default; per-mode field gradients provide the
         * atmospheric backing. Each actor reveals only via a subtle top resonance line
         * and the actor-tag — there is no enclosing rectangle. */
        .actor {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 18px 22px 22px;
          background: transparent;
          border: none;
          border-radius: 0;
          position: relative;
        }
        .actor::before {
          content: '';
          position: absolute;
          left: 22px;
          right: 22px;
          top: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(74,158,255,0.22) 22%, rgba(74,158,255,0.22) 78%, transparent 100%);
          opacity: 0.6;
        }
        .rep-field > .actor:first-of-type::before { display: none; }
        .actor-tag {
          display: flex;
          align-items: baseline;
          gap: 12px;
          padding-bottom: 0;
          border-bottom: none;
        }
        .actor-code {
          font-size: 9px;
          font-weight: 700;
          color: #6a8cd6;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 2px 6px;
          background: rgba(74,158,255,0.07);
          border: 1px solid rgba(74,158,255,0.2);
          border-radius: 3px;
        }
        .actor-name {
          font-size: 11px;
          color: #b6bdd6;
          letter-spacing: 0.04em;
          font-weight: 500;
          text-transform: uppercase;
        }

        /* ── Decision Posture (A) ──────────────────────────────────────── */
        .actor--decision-posture .actor-decision-state {
          font-size: 22px;
          font-weight: 600;
          color: var(--state-color);
          letter-spacing: -0.008em;
          line-height: 1.2;
          transition: color 0.4s;
        }
        .actor-decision-qualifier {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding-top: 6px;
        }
        .actor-decision-qualifier-class {
          font-size: 12px;
          font-weight: 600;
          color: #e6b800;
          letter-spacing: 0.04em;
        }
        .actor-decision-qualifier-note {
          font-size: 11px;
          color: #9aa0bc;
          line-height: 1.5;
        }

        /* ── Resolution Boundary (M) ───────────────────────────────────── */
        .actor-resolution-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
        .actor-resolution-cell {
          padding: 14px 16px 14px 18px;
          background: linear-gradient(180deg, rgba(8,10,15,0.32) 0%, transparent 100%);
          border: none;
          border-radius: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: relative;
        }
        .actor-resolution-cell::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8px;
          bottom: 8px;
          width: 2px;
          border-radius: 1px;
          background: var(--cell-rail, rgba(122,133,163,0.55));
          filter: blur(0.4px);
        }
        .actor-resolution-cell::after {
          content: '';
          position: absolute;
          left: 2px;
          top: 8px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--cell-rail, rgba(122,133,163,0.55)) 0%, transparent 70%);
          opacity: 0.55;
        }
        .actor-resolution-cell--known    { --cell-rail: rgba(74,158,255,0.6); }
        .actor-resolution-cell--partial  { --cell-rail: rgba(230,184,0,0.6); }
        .actor-resolution-cell--unknown  { --cell-rail: rgba(122,133,163,0.55); }
        .actor-resolution-cell-label {
          font-size: 9px;
          color: #5a6580;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .actor-resolution-cell-value {
          font-size: 14px;
          color: #e8edf8;
          font-weight: 600;
          letter-spacing: -0.003em;
        }
        .actor-resolution-cell--partial .actor-resolution-cell-value { color: #e6b800; }
        .actor-resolution-cell-meta {
          font-size: 11px;
          color: #9aa0bc;
          line-height: 1.45;
        }

        /* ── Confidence Boundary (B) ───────────────────────────────────── */
        .actor-confidence-bar {
          display: flex;
          height: 6px;
          border-radius: 3px;
          overflow: hidden;
          background: rgba(20,23,31,0.6);
        }
        .actor-confidence-bar-fill {
          background: linear-gradient(90deg, var(--state-color) 0%, rgba(74,158,255,0.7) 100%);
          opacity: 0.85;
        }
        .actor-confidence-bar-advisory {
          background:
            repeating-linear-gradient(
              45deg,
              rgba(230,184,0,0.45) 0,
              rgba(230,184,0,0.45) 4px,
              rgba(230,184,0,0.18) 4px,
              rgba(230,184,0,0.18) 8px
            );
        }
        .actor-confidence-meta {
          display: flex;
          gap: 20px;
          font-size: 11px;
          color: #b6bdd6;
        }
        .actor-confidence-meta span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .actor-confidence-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .actor-confidence-dot--grounded {
          background: var(--state-color);
          opacity: 0.85;
        }
        .actor-confidence-dot--advisory {
          background: rgba(230,184,0,0.7);
        }

        /* ── Pressure Anchor (C) — single cue ─────────────────────────── */
        .actor-anchor-line {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 0;
          --tier-color: #6a7593;
        }
        .actor-anchor-line[data-tier="HIGH"]     { --tier-color: #ff6b6b; }
        .actor-anchor-line[data-tier="ELEVATED"] { --tier-color: #ff9e4a; }
        .actor-anchor-line[data-tier="MODERATE"] { --tier-color: #ffd700; }
        .actor-anchor-line[data-tier="LOW"]      { --tier-color: #64ffda; }
        .actor-anchor-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--tier-color);
          box-shadow: 0 0 14px 1px var(--tier-color);
          flex-shrink: 0;
        }
        .actor-anchor-domain {
          font-size: 14px;
          color: #e8edf8;
          font-weight: 600;
          letter-spacing: -0.002em;
        }
        .actor-anchor-tier {
          font-size: 11px;
          color: var(--tier-color);
          font-weight: 500;
          letter-spacing: 0.04em;
          margin-left: auto;
        }

        /* ── Semantic Topology + Structural Backing + Semantic-Only Exposure (G + H + I) ── */
        .actor-topo-matrix {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }
        .actor-topo-cell {
          padding: 18px 16px 16px;
          background:
            radial-gradient(80% 90% at 50% 0%, rgba(20,23,31,0.55) 0%, transparent 80%),
            radial-gradient(60% 60% at 50% 50%, var(--cell-tier-glow, transparent) 0%, transparent 70%);
          border: none;
          border-radius: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          --tier-color: #6a7593;
          --cell-tier-glow: transparent;
          position: relative;
        }
        .actor-topo-cell::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          width: 36%;
          height: 1px;
          transform: translateX(-50%);
          background: linear-gradient(90deg, transparent 0%, var(--tier-color) 50%, transparent 100%);
          opacity: 0.65;
        }
        .actor-topo-cell[data-tier="HIGH"]     { --tier-color: #ff6b6b; --cell-tier-glow: rgba(255,107,107,0.06); }
        .actor-topo-cell[data-tier="ELEVATED"] { --tier-color: #ff9e4a; --cell-tier-glow: rgba(255,158,74,0.06); }
        .actor-topo-cell[data-tier="MODERATE"] { --tier-color: #ffd700; --cell-tier-glow: rgba(255,215,0,0.05); }
        .actor-topo-cell[data-tier="LOW"]      { --tier-color: #64ffda; --cell-tier-glow: rgba(100,255,218,0.05); }
        .actor-topo-cell--grounded::before     { background: linear-gradient(90deg, transparent 0%, rgba(74,158,255,0.5) 50%, transparent 100%); }
        .actor-topo-cell--semantic-only        {
          background:
            radial-gradient(80% 90% at 50% 0%, rgba(28,32,40,0.7) 0%, transparent 85%),
            repeating-linear-gradient(45deg, rgba(230,184,0,0.04) 0, rgba(230,184,0,0.04) 4px, transparent 4px, transparent 8px);
        }
        .actor-topo-cell--semantic-only::before { background: linear-gradient(90deg, transparent 0%, rgba(230,184,0,0.55) 50%, transparent 100%); }
        .actor-topo-cell-role {
          font-size: 9px;
          color: #5a6580;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .actor-topo-cell-name {
          font-size: 14px;
          color: #e8edf8;
          font-weight: 600;
          letter-spacing: -0.002em;
        }
        .actor-topo-cell-state {
          display: flex;
          gap: 8px;
        }
        .actor-topo-cell-tier {
          font-size: 11px;
          color: var(--tier-color);
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .actor-topo-cell-backing {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          color: #b6bdd6;
          letter-spacing: 0;
        }
        .actor-topo-cell--semantic-only .actor-topo-cell-backing { color: #e6b800; }
        .actor-topo-cell-backing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .actor-topo-cell-backing-dot--grounded { background: rgba(74,158,255,0.85); box-shadow: 0 0 6px 0 rgba(74,158,255,0.55); }
        .actor-topo-cell-backing-dot--semantic { background: rgba(230,184,0,0.85); box-shadow: 0 0 6px 0 rgba(230,184,0,0.55); }
        .actor-topo-summary {
          display: flex;
          gap: 14px;
          font-size: 11px;
          color: #9aa0bc;
          padding-top: 6px;
        }
        .actor-topo-summary strong { color: #e8edf8; font-weight: 600; }
        .actor-topo-summary-sep { color: #3a4560; }

        /* ── Cluster Concentration (J) ─────────────────────────────────── */
        .actor-cluster-headline {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .actor-cluster-value {
          font-size: 32px;
          font-weight: 600;
          color: var(--state-color);
          letter-spacing: -0.012em;
          line-height: 1;
          transition: color 0.4s;
        }
        .actor-cluster-label {
          font-size: 11px;
          color: #6a7593;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .actor-cluster-bar {
          height: 4px;
          background: rgba(74,158,255,0.08);
          border-radius: 2px;
          overflow: hidden;
        }
        .actor-cluster-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--state-color) 0%, rgba(74,158,255,0.6) 100%);
          opacity: 0.75;
          transition: width 0.4s ease;
        }
        .actor-cluster-meta {
          font-size: 11px;
          color: #9aa0bc;
          line-height: 1.55;
        }

        /* ── Absorption Load (E) ───────────────────────────────────────── */
        .actor-absorption-panel {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 12px 14px 12px 16px;
          background: linear-gradient(90deg, rgba(255,158,74,0.04) 0%, transparent 70%);
          position: relative;
        }
        .actor-absorption-panel::before {
          content: '';
          position: absolute;
          left: 0;
          top: 12px;
          bottom: 12px;
          width: 2px;
          background: rgba(255,158,74,0.55);
          filter: blur(0.4px);
        }
        .actor-absorption-domain {
          font-size: 14px;
          color: #e8edf8;
          font-weight: 600;
        }
        .actor-absorption-state {
          font-size: 11px;
          color: #ff9e4a;
          font-weight: 500;
          letter-spacing: 0.04em;
        }
        .actor-absorption-bar {
          height: 6px;
          background: rgba(255,158,74,0.08);
          border-radius: 3px;
          overflow: hidden;
        }
        .actor-absorption-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff9e4a 0%, rgba(255,158,74,0.6) 100%);
          opacity: 0.78;
        }
        .actor-absorption-meta {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .actor-absorption-meta-value {
          font-size: 24px;
          font-weight: 600;
          color: #ff9e4a;
          letter-spacing: -0.01em;
        }
        .actor-absorption-meta-label {
          font-size: 11px;
          color: #9aa0bc;
        }
        .actor-absorption-note {
          font-size: 12px;
          color: #9aa0bc;
          line-height: 1.55;
          padding-top: 4px;
        }

        /* ── Evidence Trace · lineage (L) ──────────────────────────────── */
        .actor-trace-lineage {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .actor-trace-step {
          display: grid;
          grid-template-columns: 22px 1fr;
          gap: 12px;
          padding: 8px 0;
          align-items: flex-start;
        }
        .actor-trace-step-marker {
          position: relative;
          width: 22px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 6px;
        }
        .actor-trace-step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(74,158,255,0.85);
          box-shadow: 0 0 8px 0 rgba(74,158,255,0.55);
          flex-shrink: 0;
        }
        .actor-trace-step-edge {
          width: 1px;
          flex: 1;
          background: linear-gradient(180deg, rgba(74,158,255,0.35) 0%, rgba(74,158,255,0.05) 100%);
          margin-top: 4px;
          min-height: 16px;
        }
        .actor-trace-step-meta {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .actor-trace-step-label {
          font-size: 9px;
          color: #5a6580;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .actor-trace-step-value {
          font-size: 12px;
          color: #b6bdd6;
          font-family: ui-monospace, "SF Mono", Menlo, monospace;
          letter-spacing: 0.01em;
          word-break: break-all;
        }

        /* ── Signal Stack (K) ──────────────────────────────────────────── */
        .actor-signal-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .actor-signal-row {
          display: grid;
          grid-template-columns: 84px 1fr;
          gap: 14px;
          padding: 14px 16px;
          background:
            linear-gradient(180deg, rgba(8,10,15,0.4) 0%, rgba(8,10,15,0.18) 100%);
          border: none;
          border-radius: 0;
          --tier-color: #6a7593;
          position: relative;
        }
        .actor-signal-row::before {
          content: '';
          position: absolute;
          left: 0;
          top: 14px;
          bottom: 14px;
          width: 2px;
          background: var(--tier-color);
          filter: blur(0.4px);
          opacity: 0.85;
        }
        .actor-signal-row + .actor-signal-row::after {
          content: '';
          position: absolute;
          top: 0;
          left: 16px;
          right: 16px;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(74,158,255,0.12) 50%, transparent 100%);
        }
        .actor-signal-row[data-tier="HIGH"]     { --tier-color: #ff6b6b; }
        .actor-signal-row[data-tier="ELEVATED"] { --tier-color: #ff9e4a; }
        .actor-signal-row[data-tier="MODERATE"] { --tier-color: #ffd700; }
        .actor-signal-row[data-tier="LOW"]      { --tier-color: #64ffda; }
        .actor-signal-row[data-grounding="Q-01"] {
          background: linear-gradient(90deg, rgba(230,184,0,0.06) 0%, rgba(8,10,15,0.5) 30%);
        }
        .actor-signal-row-mark {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding-top: 4px;
        }
        .actor-signal-row-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--tier-color);
          box-shadow: 0 0 10px 0 var(--tier-color);
        }
        .actor-signal-row-tier {
          font-size: 9px;
          color: var(--tier-color);
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .actor-signal-row-body {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }
        .actor-signal-row-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .actor-signal-row-name {
          font-size: 13px;
          color: #e8edf8;
          font-weight: 600;
          letter-spacing: -0.003em;
        }
        .actor-signal-row-domain {
          font-size: 10px;
          color: #6a7593;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .actor-signal-row-pressure {
          font-size: 11px;
          color: var(--tier-color);
          font-weight: 500;
        }
        .actor-signal-row-evidence {
          font-size: 12px;
          color: #b6bdd6;
          line-height: 1.55;
        }
        .actor-signal-row-conf {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 4px;
          border-top: 1px solid #14181f;
          font-size: 10px;
        }
        .actor-signal-row-conf-label {
          color: #5a6580;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .actor-signal-row-conf-value { color: #b6bdd6; }
        .actor-signal-row-conf-flag {
          color: #e6b800;
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        /* ── Inference Prohibition (N) ─────────────────────────────────── */
        .actor-inference-statement {
          font-size: 13px;
          color: #c5cce3;
          line-height: 1.6;
          padding: 14px 16px 14px 18px;
          background:
            linear-gradient(90deg, rgba(230,184,0,0.07) 0%, rgba(230,184,0,0.02) 35%, transparent 80%);
          border: none;
          border-radius: 0;
          position: relative;
        }
        .actor-inference-statement::before {
          content: '';
          position: absolute;
          left: 0;
          top: 14px;
          bottom: 14px;
          width: 2px;
          background: rgba(230,184,0,0.55);
          filter: blur(0.5px);
        }
        .actor-inference-statement::after {
          /* governance contour — broader band that extends behind the statement */
          content: '';
          position: absolute;
          inset: -8px -16px;
          background:
            radial-gradient(70% 100% at 0% 50%, rgba(230,184,0,0.04) 0%, transparent 70%);
          z-index: -1;
        }
        .actor-inference-rules {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .actor-inference-rules-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .actor-inference-rules-label {
          font-size: 9px;
          color: #5a6580;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .actor-inference-rules-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .actor-inference-rule {
          font-size: 10px;
          font-family: ui-monospace, "SF Mono", Menlo, monospace;
          color: #b6bdd6;
          padding: 3px 8px;
          background: rgba(230,184,0,0.06);
          border: 1px solid rgba(230,184,0,0.22);
          border-radius: 3px;
          letter-spacing: 0.02em;
        }

        /* ── BOARDROOM — Confidence Envelope ring (replaces decorative ring) ── */
        .rep-board-decision-label {
          font-size: 10px;
          color: #5a6580;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          font-weight: 500;
          margin-top: 8px;
        }
        .rep-board-envelope {
          position: relative;
          width: 320px;
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rep-board-envelope::before {
          /* Outer atmospheric ring — projection-grade halo */
          content: '';
          position: absolute;
          inset: -36px;
          border-radius: 50%;
          border: 1px solid var(--state-border);
          opacity: 0.42;
        }
        .rep-board-envelope::after {
          /* Far outer atmospheric ring — barely visible, projection ceremony */
          content: '';
          position: absolute;
          inset: -88px;
          border-radius: 50%;
          border: 1px dashed var(--state-border);
          opacity: 0.18;
        }
        .rep-board-envelope-arc {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          /* background applied inline by component */
          opacity: 0.85;
        }
        .rep-board-envelope-mask {
          position: absolute;
          inset: 22px;
          border-radius: 50%;
          background: rgba(11, 13, 18, 0.94);
        }
        .rep-board-envelope-center {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .rep-board-envelope-state {
          font-size: 48px;
          font-weight: 600;
          color: var(--state-color);
          letter-spacing: -0.014em;
          line-height: 1;
          transition: color 0.4s;
        }
        .rep-board-envelope-sub {
          font-size: 11px;
          color: #6a7593;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .rep-board-envelope-readout {
          display: flex;
          gap: 28px;
          padding-top: 4px;
        }
        .rep-board-envelope-readout-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .rep-board-envelope-readout-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .rep-board-envelope-readout-dot--grounded { background: var(--state-color); opacity: 0.85; }
        .rep-board-envelope-readout-dot--advisory { background: rgba(230,184,0,0.75); }
        .rep-board-envelope-readout-value {
          font-size: 16px;
          font-weight: 600;
          color: #e8edf8;
          letter-spacing: -0.005em;
        }
        .rep-board-envelope-readout-label {
          font-size: 10px;
          color: #9aa0bc;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
      `}</style>
    </>
  )
}
