/**
 * pages/lens-v2-flagship.js
 * PI.LENS.V2.FLAGSHIP-EXPERIENCE-ELEVATION.01
 *
 * LENS v2 — Flagship Executive Intelligence Surface
 * Premium visual redesign. Category-defining executive intelligence.
 *
 * Governance:
 *   - topology always read-only
 *   - qualifier never suppressed
 *   - blocked/diagnostic states non-degradable
 *   - no AI calls, no prompt surfaces, no chatbot UX
 *   - no animated propagation flow (VIS-PROP-02)
 *   - entrance animations are UI choreography only (not propagation simulation)
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
  HIGH:     { color: '#ff6b6b', bg: 'rgba(255,107,107,0.12)', label: 'HIGH',     symbol: '▲' },
  ELEVATED: { color: '#ff9e4a', bg: 'rgba(255,158,74,0.12)',  label: 'ELEVATED', symbol: '△' },
  MODERATE: { color: '#ffd700', bg: 'rgba(255,215,0,0.12)',   label: 'MODERATE', symbol: '◇' },
  LOW:      { color: '#64ffda', bg: 'rgba(100,255,218,0.12)', label: 'LOW',      symbol: '○' },
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
  { value: 'EXECUTIVE_BALANCED',  label: 'BALANCED' },
  { value: 'EXECUTIVE_DENSE',     label: 'DENSE' },
  { value: 'INVESTIGATION_DENSE', label: 'INVESTIGATION' },
]

// ── Derived domain nodes from evidence_blocks ─────────────────────────────────

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
  return (
    <div className="auth-band">
      <div className="auth-left">
        <span className="auth-wordmark">LENS</span>
        <span className="auth-version">v2</span>
        <span className="auth-divider" />
        <span className="auth-descriptor">EXECUTIVE INTELLIGENCE SURFACE</span>
      </div>
      <div className="auth-center">
        <span className="auth-stream">PI.LENS.V2 · ELEVATION.01</span>
      </div>
      <div className="auth-right">
        <div className="auth-density-group">
          {DENSITY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`auth-density-btn${densityClass === opt.value ? ' active' : ''}`}
              onClick={() => onDensityChange(opt.value)}
              aria-pressed={densityClass === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          className={`auth-boardroom-btn${boardroomMode ? ' active' : ''}`}
          onClick={onBoardroomToggle}
          aria-pressed={boardroomMode}
        >
          {boardroomMode ? '◉ BOARDROOM' : '○ BOARDROOM'}
        </button>
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
          {badge.state_label || 'This report cannot proceed to executive action. Structural escalation required.'}
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
      <span className="diagnostic-detail">Readiness resolution pending. Advisory output only.</span>
    </div>
  )
}

function DeclarationZone({ renderState, adapted }) {
  const badge = (adapted && adapted.readinessBadge) || {}
  const label = STATE_LABELS[renderState] || renderState.replace(/_/g, ' ')
  return (
    <div className="declaration-zone">
      <div className="declaration-label">READINESS ASSESSMENT</div>
      <div className="declaration-state">{label}</div>
      {badge.state_label && badge.state_label !== label && (
        <div className="declaration-badge-label">{badge.state_label}</div>
      )}
    </div>
  )
}

function QualifierMandate({ qualifierClass, visible }) {
  if (!visible || !qualifierClass || qualifierClass === 'Q-00') return null
  return (
    <div className="qualifier-mandate" role="alert" aria-atomic="true">
      <span className="qualifier-mandate-class">QUALIFIER {qualifierClass}</span>
      <span className="qualifier-mandate-divider">·</span>
      <span className="qualifier-mandate-text">
        Partial signal grounding. Advisory confirmation recommended before executive action.
      </span>
    </div>
  )
}

function IntelligenceField({ narrative, adapted, motionProfile, urgencyFrame, densityClass }) {
  const chip = (adapted && adapted.qualifierChip) || {}
  const badge = (adapted && adapted.readinessBadge) || {}
  return (
    <div className="intelligence-field">
      <div className="intelligence-primary">
        {narrative.executive_summary && (
          <div className="intel-block">
            <div className="intel-section-label">EXECUTIVE INTELLIGENCE</div>
            <div className="intel-summary-text">{narrative.executive_summary}</div>
          </div>
        )}
        {narrative.why_primary_statement && (
          <div className="intel-block">
            <div className="intel-section-label">WHY THIS MATTERS</div>
            <div className="intel-why-text">{narrative.why_primary_statement}</div>
          </div>
        )}
        {narrative.structural_summary && densityClass !== 'EXECUTIVE_BALANCED' && (
          <div className="intel-block">
            <div className="intel-section-label">STRUCTURAL FINDINGS</div>
            <div className="intel-structural-text">{narrative.structural_summary}</div>
          </div>
        )}
      </div>
      <div className="intelligence-signals">
        <div className="signal-section">
          <div className="signal-label">STATE</div>
          <div className="signal-value signal-state">{badge.state_label || '—'}</div>
        </div>
        {chip.renders && (
          <div className="signal-section">
            <div className="signal-label">QUALIFIER</div>
            <div className="signal-value signal-qualifier">{chip.class_label || chip.qualifier_class || '—'}</div>
          </div>
        )}
        {motionProfile && motionProfile.profile && (
          <div className="signal-section">
            <div className="signal-label">MOTION PROFILE</div>
            <div className="signal-value signal-muted">{motionProfile.profile.replace(/_/g, ' ')}</div>
          </div>
        )}
        {urgencyFrame && urgencyFrame.tier && (
          <div className="signal-section">
            <div className="signal-label">URGENCY</div>
            <div className="signal-value signal-muted">{urgencyFrame.tier.replace(/_/g, ' ')}</div>
          </div>
        )}
      </div>
    </div>
  )
}

function DomainNode({ name, pressureTier, role, groundingStatus }) {
  const pm = PRESSURE_META[pressureTier] || PRESSURE_META.MODERATE
  const rm = ROLE_META[role] || { label: role, symbol: '·', color: '#4a5570' }
  const isPartial = groundingStatus && groundingStatus !== 'Q-00'
  return (
    <div
      className="domain-node"
      style={{ '--pressure-color': pm.color, '--pressure-bg': pm.bg }}
    >
      <div className="domain-node-role">
        <span className="domain-node-role-symbol" style={{ color: rm.color }}>{rm.symbol}</span>
        <span className="domain-node-role-label">{rm.label}</span>
      </div>
      <div className="domain-node-name">{name}</div>
      <div className="domain-node-pressure">
        <span className="domain-node-pressure-symbol">{pm.symbol}</span>
        <span className="domain-node-pressure-label">{pm.label}</span>
        {isPartial && <span className="domain-node-qualifier">Q</span>}
      </div>
    </div>
  )
}

function PressureConnector({ pressureTier }) {
  const pm = PRESSURE_META[pressureTier] || PRESSURE_META.MODERATE
  return (
    <div className="pressure-connector" style={{ '--pressure-color': pm.color }}>
      <div className="pressure-connector-line" />
      <div className="pressure-connector-arrow">›</div>
    </div>
  )
}

function StructuralTopologyZone({ evidenceBlocks, propagationChains }) {
  const domainNodes = getDomainNodes(evidenceBlocks)
  if (!domainNodes.length) return null

  const primaryChain = propagationChains && propagationChains.length
    ? propagationChains.reduce((a, b) => a.path.length >= b.path.length ? a : b, propagationChains[0])
    : null

  return (
    <div className="topology-zone">
      <div className="topology-zone-label">STRUCTURAL TOPOLOGY</div>
      <div className="topology-chain">
        {domainNodes.map((domain, idx) => (
          <div key={domain.name || idx} className="topology-chain-item">
            <DomainNode
              name={domain.name}
              pressureTier={domain.pressureTier}
              role={domain.role}
              groundingStatus={domain.groundingStatus}
            />
            {idx < domainNodes.length - 1 && (
              <PressureConnector pressureTier={domain.pressureTier} />
            )}
          </div>
        ))}
      </div>
      {primaryChain && (
        <div className="topology-chain-meta">
          <span className="topology-chain-meta-label">PROPAGATION PATH</span>
          <span className="topology-chain-meta-value">{primaryChain.path.join(' → ')}</span>
          <span className="topology-chain-meta-sep">·</span>
          <span
            className="topology-chain-meta-pressure"
            style={{ color: (PRESSURE_META[primaryChain.pressure_tier] || {}).color }}
          >
            {primaryChain.pressure_tier}
          </span>
        </div>
      )}
    </div>
  )
}

function EvidenceBlock({ block }) {
  const dominantSignal = block.signal_cards && block.signal_cards[0]
  const pressure = dominantSignal ? (PRESSURE_META[dominantSignal.pressure_tier] || PRESSURE_META.MODERATE) : null
  const role = ROLE_META[block.propagation_role] || null
  const isPartial = block.grounding_status && block.grounding_status !== 'Q-00'

  return (
    <div className="evidence-block">
      <div className="evidence-block-header">
        <div className="evidence-block-domain">{block.domain_alias}</div>
        <div className="evidence-block-meta">
          {role && (
            <span className="evidence-block-role" style={{ color: role.color }}>
              {role.symbol} {role.label}
            </span>
          )}
          {pressure && (
            <span className="evidence-block-pressure" style={{ color: pressure.color }}>
              {pressure.symbol} {pressure.label}
            </span>
          )}
          {isPartial && (
            <span className="evidence-block-partial">PARTIAL</span>
          )}
        </div>
      </div>
      {block.evidence_description && (
        <div className="evidence-block-description">{block.evidence_description}</div>
      )}
      {dominantSignal && dominantSignal.evidence_text && (
        <div className="evidence-block-text">{dominantSignal.evidence_text}</div>
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
      <div className="evidence-layer-label">EVIDENCE DEPTH</div>
      <div className="evidence-grid">
        {visible.map((block, idx) => (
          <EvidenceBlock key={block.domain_alias || idx} block={block} />
        ))}
      </div>
      {!showAll && evidenceBlocks.length > 2 && (
        <div className="evidence-truncation">
          +{evidenceBlocks.length - 2} additional domains in dense view
        </div>
      )}
    </div>
  )
}

function GovernanceRibbon({ governance }) {
  const entries = Object.entries(governance)
  const allPass = entries.every(([, v]) => v === true)
  return (
    <div className={`gov-ribbon${allPass ? '' : ' gov-ribbon--warn'}`}>
      <span className="gov-ribbon-label">GOVERNANCE</span>
      <div className="gov-ribbon-items">
        {entries.map(([key, val]) => (
          <span key={key} className={`gov-ribbon-item${val ? ' gov-pass' : ' gov-fail'}`}>
            <span className="gov-item-dot">{val ? '✓' : '✗'}</span>
            <span className="gov-item-key">{key.replace(/_/g, ' ')}</span>
          </span>
        ))}
      </div>
      <a href="/" className="gov-ribbon-back">← 42.x</a>
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

  const {
    renderState,
    adapted,
    motionProfile,
    urgencyFrame,
    densityLayout,
    governance,
  } = result

  const gravityToken = resolveGravityToken(renderState)
  const presenceToken = resolvePresenceToken(renderState)
  const narrative = (adapted && adapted.narrative) || {}
  const qualifierVisible = densityLayout.qualifier_notice_visible === true

  const isBlocked = renderState === 'BLOCKED'
  const isDiagnostic = renderState === 'DIAGNOSTIC_ONLY'

  return (
    <>
      <Head>
        <title>LENS v2 — Flagship Intelligence Surface</title>
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

          {!isBlocked && (
            <DeclarationZone renderState={renderState} adapted={adapted} />
          )}

          <QualifierMandate
            qualifierClass={FLAGSHIP_REAL_REPORT.qualifier_class}
            visible={qualifierVisible}
          />

          <IntelligenceField
            narrative={narrative}
            adapted={adapted}
            motionProfile={motionProfile}
            urgencyFrame={urgencyFrame}
            densityClass={densityClass}
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
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes v2Appear {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Canvas root ─────────────────────────────────────────────────── */
        .v2-canvas {
          min-height: 100vh;
          background: #0d0f14;
          color: #ccd6f6;
          font-family: 'Courier New', Courier, monospace;
          font-size: 13px;
          display: flex;
          flex-direction: column;
          --state-color: #4a9eff;
          --state-bg:    rgba(74,158,255,0.06);
          --state-border:rgba(74,158,255,0.2);
        }
        .v2-canvas[data-render-state="EXECUTIVE_READY"] {
          --state-color: #64ffda;
          --state-bg:    rgba(100,255,218,0.05);
          --state-border:rgba(100,255,218,0.2);
        }
        .v2-canvas[data-render-state="EXECUTIVE_READY_WITH_QUALIFIER"] {
          --state-color: #e6b800;
          --state-bg:    rgba(230,184,0,0.05);
          --state-border:rgba(230,184,0,0.25);
        }
        .v2-canvas[data-render-state="DIAGNOSTIC_ONLY"] {
          --state-color: #ff9e4a;
          --state-bg:    rgba(255,158,74,0.05);
          --state-border:rgba(255,158,74,0.2);
        }
        .v2-canvas[data-render-state="BLOCKED"] {
          --state-color: #ff6b6b;
          --state-bg:    rgba(255,107,107,0.05);
          --state-border:rgba(255,107,107,0.2);
        }

        /* ── Authority Band ──────────────────────────────────────────────── */
        .auth-band {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 40px;
          background: #080a0f;
          border-bottom: 1px solid #141720;
          position: sticky;
          top: 0;
          z-index: 100;
          animation: v2Appear 0.3s ease both;
        }
        .auth-left {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .auth-wordmark {
          font-size: 16px;
          font-weight: 700;
          color: var(--state-color);
          letter-spacing: 0.28em;
          text-transform: uppercase;
          transition: color 0.4s;
        }
        .auth-version {
          font-size: 10px;
          color: #2a2f40;
          letter-spacing: 0.08em;
        }
        .auth-divider {
          display: inline-block;
          width: 1px;
          height: 12px;
          background: #1a1e2b;
          margin: 0 2px;
          vertical-align: middle;
        }
        .auth-descriptor {
          font-size: 8px;
          color: #2a2f40;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .auth-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .auth-stream {
          font-size: 8px;
          color: #1a1e2b;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .auth-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .auth-density-group {
          display: flex;
          gap: 0;
          background: #0d0f14;
          border: 1px solid #1a1e2b;
          border-radius: 2px;
          overflow: hidden;
        }
        .auth-density-btn {
          background: transparent;
          border: none;
          border-right: 1px solid #1a1e2b;
          color: #2a2f40;
          padding: 5px 14px;
          font-size: 8px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: background 0.15s, color 0.15s;
        }
        .auth-density-btn:last-child { border-right: none; }
        .auth-density-btn:hover {
          background: #141720;
          color: #7a8aaa;
        }
        .auth-density-btn.active {
          background: var(--state-bg);
          color: var(--state-color);
        }
        .auth-boardroom-btn {
          background: transparent;
          border: 1px solid #1a1e2b;
          color: #2a2f40;
          padding: 5px 14px;
          font-size: 8px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border-radius: 2px;
          transition: all 0.2s;
        }
        .auth-boardroom-btn:hover {
          border-color: #2a2f40;
          color: #4a5570;
        }
        .auth-boardroom-btn.active {
          background: var(--state-bg);
          border-color: var(--state-border);
          color: var(--state-color);
        }

        /* ── Body ────────────────────────────────────────────────────────── */
        .v2-body { flex: 1; display: flex; flex-direction: column; }

        /* ── Blocked Declaration ─────────────────────────────────────────── */
        .blocked-declaration {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          padding: 36px 40px;
          background: rgba(255,107,107,0.04);
          border-bottom: 1px solid rgba(255,107,107,0.12);
          animation: v2Enter 0.4s ease 0.1s both;
        }
        .blocked-icon {
          font-size: 20px;
          color: #ff6b6b;
          line-height: 1;
          margin-top: 6px;
          flex-shrink: 0;
        }
        .blocked-headline {
          font-size: 20px;
          font-weight: 700;
          color: #ff6b6b;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .blocked-detail {
          font-size: 13px;
          color: #4a5570;
          letter-spacing: 0.03em;
          line-height: 1.65;
        }

        /* ── Diagnostic Declaration ──────────────────────────────────────── */
        .diagnostic-declaration {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 40px;
          background: rgba(255,158,74,0.04);
          border-bottom: 1px solid rgba(255,158,74,0.12);
          animation: v2Enter 0.4s ease 0.1s both;
        }
        .diagnostic-icon { font-size: 16px; color: #ff9e4a; flex-shrink: 0; }
        .diagnostic-headline {
          font-size: 12px;
          font-weight: 700;
          color: #ff9e4a;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .diagnostic-detail {
          font-size: 11px;
          color: #2a2f40;
          letter-spacing: 0.04em;
        }

        /* ── Declaration Zone ────────────────────────────────────────────── */
        .declaration-zone {
          padding: 52px 40px 44px;
          border-bottom: 1px solid #141720;
          animation: v2Enter 0.5s ease 0.15s both;
        }
        .declaration-label {
          font-size: 8px;
          color: #2a2f40;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .declaration-state {
          font-size: 44px;
          font-weight: 700;
          color: var(--state-color);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          line-height: 1.05;
          transition: color 0.4s;
        }
        .declaration-badge-label {
          margin-top: 10px;
          font-size: 11px;
          color: #4a5570;
          letter-spacing: 0.08em;
        }

        /* ── Qualifier Mandate ───────────────────────────────────────────── */
        .qualifier-mandate {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 40px;
          background: rgba(230,184,0,0.06);
          border-top: 1px solid rgba(230,184,0,0.18);
          border-bottom: 1px solid rgba(230,184,0,0.18);
          animation: v2Enter 0.5s ease 0.25s both;
        }
        .qualifier-mandate-class {
          font-size: 10px;
          font-weight: 700;
          color: #e6b800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          white-space: nowrap;
          background: rgba(230,184,0,0.1);
          border: 1px solid rgba(230,184,0,0.25);
          padding: 3px 10px;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .qualifier-mandate-divider {
          color: rgba(230,184,0,0.25);
          font-size: 13px;
          flex-shrink: 0;
        }
        .qualifier-mandate-text {
          font-size: 12px;
          color: rgba(230,184,0,0.7);
          letter-spacing: 0.03em;
          line-height: 1.5;
        }

        /* ── Intelligence Field ──────────────────────────────────────────── */
        .intelligence-field {
          display: grid;
          grid-template-columns: 1fr 260px;
          border-bottom: 1px solid #141720;
          animation: v2Enter 0.5s ease 0.35s both;
        }

        /* Primary (left) */
        .intelligence-primary {
          padding: 40px 40px;
          border-right: 1px solid #141720;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .intel-block { display: flex; flex-direction: column; }
        .intel-section-label {
          font-size: 7px;
          color: #1e2332;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .intel-summary-text {
          font-size: 15px;
          color: #ccd6f6;
          line-height: 1.8;
          letter-spacing: 0.02em;
          border-left: 2px solid var(--state-color);
          padding-left: 20px;
          transition: border-color 0.4s;
        }
        .intel-why-text {
          font-size: 13px;
          color: #7a8aaa;
          line-height: 1.75;
          letter-spacing: 0.02em;
          padding-left: 22px;
        }
        .intel-structural-text {
          font-size: 11px;
          color: #4a5570;
          line-height: 1.7;
          letter-spacing: 0.02em;
          padding-left: 22px;
          font-style: italic;
        }

        /* Signals (right) */
        .intelligence-signals {
          padding: 40px 28px;
          background: #080a0f;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .signal-section { display: flex; flex-direction: column; gap: 5px; }
        .signal-label {
          font-size: 7px;
          color: #1e2332;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .signal-value {
          font-size: 11px;
          color: #ccd6f6;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          line-height: 1.4;
        }
        .signal-value.signal-state { color: var(--state-color); transition: color 0.4s; }
        .signal-value.signal-qualifier { color: #e6b800; }
        .signal-value.signal-muted { color: #2a2f40; }

        /* ── Structural Topology Zone ────────────────────────────────────── */
        .topology-zone {
          padding: 40px 40px;
          border-bottom: 1px solid #141720;
          animation: v2Enter 0.5s ease 0.5s both;
        }
        .topology-zone-label {
          font-size: 7px;
          color: #1e2332;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }
        .topology-chain {
          display: flex;
          align-items: center;
          gap: 0;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .topology-chain-item { display: flex; align-items: center; }

        /* Domain Node */
        .domain-node {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
          padding: 18px 22px;
          background: #080a0f;
          border: 1px solid #1a1e2b;
          border-radius: 3px;
          min-width: 150px;
          transition: border-color 0.2s;
        }
        .domain-node:hover { border-color: var(--pressure-color); }
        .domain-node-role {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .domain-node-role-symbol { font-size: 10px; }
        .domain-node-role-label {
          font-size: 7px;
          color: #2a2f40;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .domain-node-name {
          font-size: 12px;
          color: #ccd6f6;
          letter-spacing: 0.04em;
          font-weight: 600;
          line-height: 1.35;
        }
        .domain-node-pressure {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .domain-node-pressure-symbol {
          font-size: 9px;
          color: var(--pressure-color);
        }
        .domain-node-pressure-label {
          font-size: 8px;
          color: var(--pressure-color);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .domain-node-qualifier {
          font-size: 7px;
          color: #e6b800;
          letter-spacing: 0.12em;
          background: rgba(230,184,0,0.1);
          border: 1px solid rgba(230,184,0,0.2);
          padding: 1px 4px;
          border-radius: 1px;
          margin-left: 4px;
        }

        /* Pressure Connector */
        .pressure-connector {
          display: flex;
          align-items: center;
          padding: 0 6px;
          flex-shrink: 0;
        }
        .pressure-connector-line {
          width: 28px;
          height: 1px;
          background: var(--pressure-color);
          opacity: 0.3;
        }
        .pressure-connector-arrow {
          font-size: 18px;
          color: var(--pressure-color);
          opacity: 0.5;
          margin-left: -5px;
          line-height: 1;
        }

        .topology-chain-meta {
          margin-top: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #141720;
          flex-wrap: wrap;
        }
        .topology-chain-meta-label {
          font-size: 7px;
          color: #1e2332;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .topology-chain-meta-value {
          font-size: 11px;
          color: #2a2f40;
          letter-spacing: 0.04em;
        }
        .topology-chain-meta-sep { color: #1a1e2b; }
        .topology-chain-meta-pressure {
          font-size: 9px;
          letter-spacing: 0.12em;
          font-weight: 700;
          text-transform: uppercase;
        }

        /* ── Evidence Depth Layer ────────────────────────────────────────── */
        .evidence-layer {
          padding: 40px 40px;
          border-bottom: 1px solid #141720;
          animation: v2Enter 0.5s ease 0.65s both;
        }
        .evidence-layer-label {
          font-size: 7px;
          color: #1e2332;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .evidence-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 12px;
        }
        .evidence-block {
          background: #080a0f;
          border: 1px solid #1a1e2b;
          border-radius: 3px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: border-color 0.2s;
        }
        .evidence-block:hover { border-color: #2a2f40; }
        .evidence-block-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }
        .evidence-block-domain {
          font-size: 11px;
          color: #7a8aaa;
          letter-spacing: 0.06em;
          font-weight: 600;
          text-transform: uppercase;
        }
        .evidence-block-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .evidence-block-role {
          font-size: 8px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .evidence-block-pressure {
          font-size: 8px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .evidence-block-partial {
          font-size: 7px;
          color: #e6b800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(230,184,0,0.08);
          border: 1px solid rgba(230,184,0,0.18);
          padding: 1px 5px;
          border-radius: 1px;
        }
        .evidence-block-description {
          font-size: 11px;
          color: #4a5570;
          letter-spacing: 0.02em;
          line-height: 1.6;
        }
        .evidence-block-text {
          font-size: 11px;
          color: #2a2f40;
          letter-spacing: 0.02em;
          line-height: 1.6;
          font-style: italic;
        }
        .evidence-truncation {
          margin-top: 16px;
          font-size: 9px;
          color: #1e2332;
          letter-spacing: 0.1em;
          font-style: italic;
        }

        /* ── Governance Ribbon ───────────────────────────────────────────── */
        .gov-ribbon {
          display: flex;
          align-items: center;
          gap: 0 20px;
          padding: 10px 40px;
          background: #080a0f;
          border-top: 1px solid #141720;
          flex-wrap: wrap;
        }
        .gov-ribbon--warn { border-top-color: rgba(255,107,107,0.2); }
        .gov-ribbon-label {
          font-size: 7px;
          color: #1a1e2b;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-right: 6px;
          flex-shrink: 0;
        }
        .gov-ribbon-items {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 16px;
          flex: 1;
        }
        .gov-ribbon-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .gov-item-dot { font-size: 7px; }
        .gov-ribbon-item.gov-pass .gov-item-dot { color: #1a3d2e; }
        .gov-ribbon-item.gov-pass .gov-item-key { color: #1a2c20; }
        .gov-ribbon-item.gov-fail .gov-item-dot { color: #ff6b6b; }
        .gov-ribbon-item.gov-fail .gov-item-key { color: #ff6b6b; }
        .gov-item-key {
          font-size: 7px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }
        .gov-ribbon-back {
          margin-left: auto;
          font-size: 8px;
          color: #1a1e2b;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: color 0.15s;
          flex-shrink: 0;
        }
        .gov-ribbon-back:hover { color: var(--state-color); }
      `}</style>
    </>
  )
}
