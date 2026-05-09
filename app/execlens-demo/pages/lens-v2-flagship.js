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

/* ── Representation Field — persona-weighted operational intelligence canvas ─────
 * The right-side companion to the Executive Assessment.
 * Replaces the prior compact status anchor.
 * Branches on:
 *   - boardroomMode (projection lens — wins over densityClass)
 *   - densityClass:
 *       EXECUTIVE_BALANCED   → BalancedConsequenceField   (Executive / CEO)
 *       EXECUTIVE_DENSE      → DenseTopologyField         (Structural / CTO)
 *       INVESTIGATION_DENSE  → InvestigationTraceField    (Analyst / Evidence)
 * Uses ONLY existing data on the page — no invented signals, no invented metrics.
 * No card-grid, no KPI panel, no graph playground, no static topology regression.
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

function RepModeTag({ label, sub }) {
  return (
    <div className="rep-mode-tag" role="presentation">
      <span className="rep-mode-tag-label">{label}</span>
      <span className="rep-mode-tag-sub">{sub}</span>
    </div>
  )
}

function BalancedConsequenceField({ adapted, blocks, scope }) {
  const origin = findByRole(blocks, 'ORIGIN')
  const passthrough = findByRole(blocks, 'PASS_THROUGH')
  const receiver = findByRole(blocks, 'RECEIVER')
  return (
    <div className="rep-field rep-field--balanced">
      <RepModeTag label="Executive lens" sub="CEO · consequence-first read" />
      <div className="rep-balanced-statement">
        Pressure originates upstream and is being absorbed through the coordination layer; secondary delivery remains within bounds, advisory-qualified.
      </div>
      <div className="rep-balanced-anchors" aria-label="Consequence path">
        {origin && (
          <div className="rep-anchor rep-anchor--origin" data-tier={origin.signal_cards[0].pressure_tier}>
            <div className="rep-anchor-rail" />
            <div className="rep-anchor-label">Source pressure</div>
            <div className="rep-anchor-name">{origin.domain_alias}</div>
            <div className="rep-anchor-state">{origin.signal_cards[0].pressure_label}</div>
          </div>
        )}
        {passthrough && (
          <div className="rep-anchor rep-anchor--passthrough" data-tier={passthrough.signal_cards[0].pressure_tier}>
            <div className="rep-anchor-rail" />
            <div className="rep-anchor-label">Coordination absorption</div>
            <div className="rep-anchor-name">{passthrough.domain_alias}</div>
            <div className="rep-anchor-state">Conducting · not generating</div>
          </div>
        )}
        {receiver && (
          <div className="rep-anchor rep-anchor--receiver" data-tier={receiver.signal_cards[0].pressure_tier}>
            <div className="rep-anchor-rail" />
            <div className="rep-anchor-label">Secondary impact</div>
            <div className="rep-anchor-name">{receiver.domain_alias}</div>
            <div className="rep-anchor-state">{receiver.signal_cards[0].pressure_label}</div>
          </div>
        )}
      </div>
      <RepEvidenceState adapted={adapted} scope={scope} compact />
    </div>
  )
}

function DenseTopologyField({ adapted, blocks, scope }) {
  const origin = findByRole(blocks, 'ORIGIN')
  const passthrough = findByRole(blocks, 'PASS_THROUGH')
  const receiver = findByRole(blocks, 'RECEIVER')
  const nodes = [origin, passthrough, receiver].filter(Boolean)
  return (
    <div className="rep-field rep-field--dense">
      <RepModeTag label="Structural lens" sub="CTO · structural cause and propagation" />
      <div className="rep-topo" aria-label="Source to pass-through to receiver propagation">
        {nodes.map((node, i) => {
          const tier = node.signal_cards[0].pressure_tier
          const isPartial = node.grounding_status && node.grounding_status !== 'Q-00'
          const role = node.propagation_role
          return (
            <div key={node.domain_alias} className={`rep-topo-step rep-topo-step--${role.toLowerCase()}`} data-tier={tier}>
              <div className="rep-topo-marker">
                <div className="rep-topo-glow" />
                <div className="rep-topo-dot" />
              </div>
              <div className="rep-topo-meta">
                <div className="rep-topo-role">{role.replace(/_/g, '-')}</div>
                <div className="rep-topo-name">{node.domain_alias}</div>
                <div className="rep-topo-tier">{node.signal_cards[0].pressure_label}</div>
                {isPartial && (
                  <div className="rep-topo-partial">{node.grounding_status} · advisory bound</div>
                )}
              </div>
              {i < nodes.length - 1 && <div className="rep-topo-edge" aria-hidden="true" />}
            </div>
          )
        })}
      </div>
      <div className="rep-dense-note">
        Coordination layer is conducting upstream pressure rather than generating it — consistent with organizational stress migration, not isolated incident.
      </div>
      <RepEvidenceState adapted={adapted} scope={scope} compact />
    </div>
  )
}

function InvestigationTraceField({ adapted, blocks, scope }) {
  const origin = findByRole(blocks, 'ORIGIN')
  const passthrough = findByRole(blocks, 'PASS_THROUGH')
  const receiver = findByRole(blocks, 'RECEIVER')
  const bands = [
    origin && {
      label: 'Observed pressure',
      domain: origin.domain_alias,
      explain: origin.signal_cards[0].evidence_text,
      conf: origin.grounding_label,
      tier: origin.signal_cards[0].pressure_tier,
      role: 'origin',
      partial: origin.grounding_status !== 'Q-00',
    },
    passthrough && {
      label: 'Propagation absorption',
      domain: passthrough.domain_alias,
      explain: passthrough.evidence_description,
      conf: passthrough.grounding_label,
      tier: passthrough.signal_cards[0].pressure_tier,
      role: 'passthrough',
      partial: passthrough.grounding_status !== 'Q-00',
    },
    receiver && {
      label: 'Qualified receiver state',
      domain: receiver.domain_alias,
      explain: receiver.evidence_description,
      conf: receiver.grounding_label,
      tier: receiver.signal_cards[0].pressure_tier,
      role: 'receiver',
      partial: receiver.grounding_status !== 'Q-00',
    },
  ].filter(Boolean)
  return (
    <div className="rep-field rep-field--investigation">
      <RepModeTag label="Evidence lens" sub="Analyst · evidence trace and confidence" />
      <div className="rep-trace-stack" aria-label="Evidence trace stack">
        {bands.map(b => (
          <div key={b.label} className={`rep-trace-band rep-trace-band--${b.role}${b.partial ? ' rep-trace-band--partial' : ''}`} data-tier={b.tier}>
            <div className="rep-trace-band-head">
              <span className="rep-trace-band-label">{b.label}</span>
              <span className="rep-trace-band-domain">{b.domain}</span>
            </div>
            <div className="rep-trace-band-explain">{b.explain}</div>
            <div className="rep-trace-band-conf">
              <span className="rep-trace-band-conf-label">Confidence</span>
              <span className="rep-trace-band-conf-value">{b.conf}</span>
              {b.partial && <span className="rep-trace-band-conf-flag">advisory bound</span>}
            </div>
          </div>
        ))}
      </div>
      <RepEvidenceState adapted={adapted} scope={scope} compact />
    </div>
  )
}

function BoardroomAtmosphericField({ adapted, renderState, scope }) {
  const badge = (adapted && adapted.readinessBadge) || {}
  return (
    <div className="rep-field rep-field--boardroom">
      <RepModeTag label="Projection lens" sub="Boardroom — minimal chrome" />
      <div className="rep-board-mark" data-state={renderState} aria-hidden="true">
        <div className="rep-board-mark-glow" />
        <div className="rep-board-mark-ring" />
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

function RepresentationField({ boardroomMode, densityClass, adapted, renderState, blocks, scope }) {
  if (boardroomMode) {
    return <BoardroomAtmosphericField adapted={adapted} renderState={renderState} scope={scope} />
  }
  if (densityClass === 'INVESTIGATION_DENSE') {
    return <InvestigationTraceField adapted={adapted} blocks={blocks} scope={scope} />
  }
  if (densityClass === 'EXECUTIVE_BALANCED') {
    return <BalancedConsequenceField adapted={adapted} blocks={blocks} scope={scope} />
  }
  return <DenseTopologyField adapted={adapted} blocks={blocks} scope={scope} />
}

function IntelligenceField({ narrative, adapted, densityClass, boardroomMode, renderState, evidenceBlocks }) {
  const scope = FLAGSHIP_REAL_REPORT.topology_scope || {}
  return (
    <div className={`intelligence-field${boardroomMode ? ' intelligence-field--boardroom' : ''}`}>
      {/* Primary — narrative */}
      <div className="intel-primary">
        {narrative.executive_summary && (
          <div className="intel-block intel-block--lead">
            <div className="intel-label">EXECUTIVE ASSESSMENT</div>
            <div className="intel-summary">{narrative.executive_summary}</div>
          </div>
        )}
        {narrative.why_primary_statement && (
          <div className="intel-block">
            <div className="intel-label">WHY THIS MATTERS</div>
            <div className="intel-why">{narrative.why_primary_statement}</div>
          </div>
        )}
        {narrative.structural_summary && densityClass !== 'EXECUTIVE_BALANCED' && !boardroomMode && (
          <div className="intel-block">
            <div className="intel-label">STRUCTURAL CONTEXT</div>
            <div className="intel-structural">{narrative.structural_summary}</div>
          </div>
        )}
      </div>

      {/* Right column — persona-weighted Representation Field */}
      <aside className="rep-column" aria-label="Representation field">
        <RepresentationField
          boardroomMode={boardroomMode}
          densityClass={densityClass}
          adapted={adapted}
          renderState={renderState}
          blocks={evidenceBlocks}
          scope={scope}
        />
      </aside>
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
  const nodes = getDomainNodes(evidenceBlocks)
  if (!nodes.length) return null
  const primary = propagationChains && propagationChains.length
    ? propagationChains.reduce((a, b) => a.path.length >= b.path.length ? a : b, propagationChains[0])
    : null
  return (
    <div className="topology-zone">
      <div className="zone-label">PROPAGATION STRUCTURE</div>
      <div className="topology-chain">
        {nodes.map((n, i) => (
          <div key={n.name || i} className="chain-item">
            <DomainNode {...n} />
            {i < nodes.length - 1 && <PressureConnector pressureTier={n.pressureTier} />}
          </div>
        ))}
      </div>
      {primary && (
        <div className="topology-footnote">
          <span className="footnote-label">Full path</span>
          <span className="footnote-path">{primary.path.join(' → ')}</span>
          <span className="footnote-sep">·</span>
          <span className="footnote-tier" style={{ color: (PRESSURE_META[primary.pressure_tier] || {}).color }}>
            {primary.pressure_tier} origin
          </span>
        </div>
      )}
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

          <EvidenceDepthLayer
            evidenceBlocks={FLAGSHIP_REAL_REPORT.evidence_blocks}
            densityClass={densityClass}
          />
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

        /* ── Intelligence Field ──────────────────────────────────────────── */
        .intelligence-field {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(380px, 0.62fr);
          border-bottom: 1px solid #1a2030;
          animation: v2Enter 0.5s ease 0.32s both;
        }
        .intelligence-field--boardroom {
          /* Boardroom: narrative dominates; representation field acts as quiet vertical accent. */
          grid-template-columns: minmax(0, 1fr) minmax(320px, 0.42fr);
        }

        /* Narrative (left) */
        .intel-primary {
          padding: 56px 64px 56px 56px;
          border-right: 1px solid #1a2030;
          display: flex;
          flex-direction: column;
          gap: 40px;
          max-width: 760px;
        }
        .intelligence-field--boardroom .intel-primary {
          padding: 72px 80px 72px 56px;
          gap: 48px;
        }
        .intel-block { display: flex; flex-direction: column; gap: 14px; }
        .intel-label {
          font-size: 10px;
          color: #5a6580;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .intel-summary {
          font-size: 18px;
          color: #e8edf8;
          line-height: 1.65;
          letter-spacing: -0.005em;
          font-weight: 400;
          border-left: 2px solid var(--state-color);
          padding-left: 22px;
          transition: border-color 0.4s;
        }
        .intel-why {
          font-size: 15px;
          color: #b6bdd6;
          line-height: 1.7;
          letter-spacing: -0.002em;
          padding-left: 24px;
          font-weight: 400;
        }
        .intel-structural {
          font-size: 13px;
          color: #7a85a3;
          line-height: 1.65;
          letter-spacing: 0;
          padding-left: 24px;
          font-style: normal;
        }

        .status-value--state { color: var(--state-color); transition: color 0.4s; font-weight: 600; }

        /* ── Representation Field (right column) ─────────────────────────── */
        .rep-column {
          padding: 56px 36px;
          background:
            linear-gradient(180deg, rgba(8,10,15,0.45) 0%, rgba(8,10,15,0.65) 100%),
            radial-gradient(120% 60% at 100% 0%, rgba(74,158,255,0.045) 0%, transparent 60%);
          border-left: 1px solid #1a2030;
          display: flex;
          flex-direction: column;
          gap: 22px;
          align-self: stretch;
          min-height: 100%;
        }
        .intelligence-field--boardroom .rep-column {
          background:
            radial-gradient(80% 60% at 50% 20%, var(--state-bg) 0%, transparent 65%),
            linear-gradient(180deg, rgba(8,10,15,0.7) 0%, rgba(8,10,15,0.5) 100%);
          padding: 72px 36px;
        }

        .rep-field {
          display: flex;
          flex-direction: column;
          gap: 22px;
          flex: 1;
          animation: v2Enter 0.45s ease both;
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

        /* ── BALANCED — Executive Consequence Field ──────────────────────── */
        .rep-field--balanced .rep-balanced-statement {
          font-size: 14px;
          color: #c5cce3;
          line-height: 1.6;
          letter-spacing: -0.002em;
          font-weight: 400;
          padding-left: 14px;
          border-left: 1px solid var(--state-border);
        }
        .rep-balanced-anchors {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 4px 0;
          position: relative;
        }
        .rep-balanced-anchors::before {
          content: '';
          position: absolute;
          left: 5px;
          top: 12px;
          bottom: 12px;
          width: 1px;
          background: linear-gradient(180deg, rgba(255,107,107,0.35) 0%, rgba(255,158,74,0.32) 50%, rgba(255,215,0,0.32) 100%);
        }
        .rep-anchor {
          position: relative;
          padding: 10px 0 10px 22px;
          --tier-color: #6a7593;
        }
        .rep-anchor[data-tier="HIGH"]     { --tier-color: #ff6b6b; }
        .rep-anchor[data-tier="ELEVATED"] { --tier-color: #ff9e4a; }
        .rep-anchor[data-tier="MODERATE"] { --tier-color: #ffd700; }
        .rep-anchor[data-tier="LOW"]      { --tier-color: #64ffda; }
        .rep-anchor::before {
          content: '';
          position: absolute;
          left: 1.5px;
          top: 16px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--tier-color);
          box-shadow: 0 0 12px 0 var(--tier-color);
          opacity: 0.85;
        }
        .rep-anchor-rail { display: none; }
        .rep-anchor-label {
          font-size: 9px;
          color: #5a6580;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .rep-anchor-name {
          font-size: 14px;
          color: #e8edf8;
          font-weight: 600;
          letter-spacing: -0.002em;
          line-height: 1.3;
        }
        .rep-anchor-state {
          font-size: 11px;
          color: var(--tier-color);
          font-weight: 500;
          letter-spacing: 0.02em;
          margin-top: 3px;
          opacity: 0.92;
        }

        /* ── DENSE — Structural Topology Field ──────────────────────────── */
        .rep-field--dense .rep-topo {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px 0 4px;
          position: relative;
        }
        .rep-topo-step {
          position: relative;
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 14px;
          padding: 10px 0;
          --tier-color: #6a7593;
        }
        .rep-topo-step[data-tier="HIGH"]     { --tier-color: #ff6b6b; }
        .rep-topo-step[data-tier="ELEVATED"] { --tier-color: #ff9e4a; }
        .rep-topo-step[data-tier="MODERATE"] { --tier-color: #ffd700; }
        .rep-topo-step[data-tier="LOW"]      { --tier-color: #64ffda; }
        .rep-topo-marker {
          position: relative;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .rep-topo-glow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle, var(--tier-color) 0%, transparent 65%);
          opacity: 0.22;
        }
        .rep-topo-dot {
          position: relative;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--tier-color);
          box-shadow: 0 0 10px 0 var(--tier-color);
        }
        .rep-topo-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-top: 4px;
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
          margin-top: 4px;
        }
        .rep-topo-edge {
          position: absolute;
          left: 18px;
          top: 38px;
          bottom: -10px;
          width: 1px;
          background: linear-gradient(180deg, var(--tier-color) 0%, transparent 100%);
          opacity: 0.42;
        }
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
          width: 180px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 12px 0 4px;
        }
        .rep-board-mark-glow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle, var(--state-color) 0%, transparent 65%);
          opacity: 0.18;
        }
        .rep-board-mark-ring {
          position: relative;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 1px solid var(--state-color);
          box-shadow:
            0 0 28px 0 var(--state-bg),
            inset 0 0 18px 0 var(--state-bg);
          opacity: 0.85;
          transition: border-color 0.4s, box-shadow 0.4s;
        }
        .rep-board-statement {
          font-size: 16px;
          color: #e8edf8;
          line-height: 1.55;
          letter-spacing: -0.005em;
          font-weight: 400;
          max-width: 320px;
        }
        .rep-board-line {
          width: 60%;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--state-color) 50%, transparent 100%);
          opacity: 0.45;
        }
        .rep-board-scope {
          font-size: 11px;
          color: #6a7593;
          letter-spacing: 0.08em;
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

        /* ── Structural Topology Zone ────────────────────────────────────── */
        .topology-zone {
          padding: 56px 56px;
          border-bottom: 1px solid #1a2030;
          animation: v2Enter 0.5s ease 0.48s both;
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
      `}</style>
    </>
  )
}
