/**
 * pages/lens-v2-flagship.js
 * PI.LENS.V2.FLAGSHIP-SPINOFF-MOUNTPOINT.01
 *
 * LENS v2 Flagship Executive Intelligence Experience — isolated spinoff route.
 *
 * This route is a clean spinoff and does NOT modify the existing ExecLens 42.x
 * demo root at pages/index.js. Both routes coexist independently.
 *
 * Spinoff URL: http://localhost:3000/lens-v2-flagship
 * Old demo URL: http://localhost:3000/ (unchanged)
 *
 * Stack:
 *   validation → adaptReport() → orchestrateFlagshipExperience() → LensV2FlagshipExperience
 *
 * Governance:
 *   - topology always read-only
 *   - qualifier never suppressed
 *   - blocked/diagnostic states non-degradable
 *   - no AI calls, no prompt surfaces, no chatbot UX
 *   - no animated propagation flow (VIS-PROP-02)
 */

import Head from 'next/head'
import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import — avoids SSR processing of 'use client' component tree
const LensV2FlagshipExperience = dynamic(
  () => import('../flagship-experience/LensV2FlagshipExperience'),
  { ssr: false, loading: () => <div className="v2-loading">Initializing intelligence surface…</div> }
)

// CJS modules — webpack handles interop
const {
  orchestrateFlagshipExperience,
  resolveBoardroomConfig,
  resolveGravityToken,
  resolvePresenceToken,
} = require('../flagship-experience/flagshipOrchestration')

const { FLAGSHIP_REAL_REPORT, FLAGSHIP_PROPAGATION_CHAINS } = require('../flagship-experience/fixtures/flagship_real_report.fixture')

// Density class options
const DENSITY_OPTIONS = [
  { value: 'EXECUTIVE_BALANCED', label: 'Balanced' },
  { value: 'EXECUTIVE_DENSE', label: 'Dense' },
  { value: 'INVESTIGATION_DENSE', label: 'Investigation' },
]

// Build adapted props from the real report fixture + orchestration result
function buildAdaptedProps(orchestrationResult, propagationChains) {
  const adapted = orchestrationResult.adapted
  const narrative = adapted.narrative || {}
  return {
    executive_summary: narrative.executive_summary || null,
    why_primary_statement: narrative.why_primary_statement || null,
    structural_summary: narrative.structural_summary || null,
    qualifier_class: FLAGSHIP_REAL_REPORT.qualifier_class,
    qualifier_notice_text: 'Partial signal grounding. Advisory confirmation recommended before executive action.',
    propagation_chains: propagationChains,
    evidence_blocks: FLAGSHIP_REAL_REPORT.evidence_blocks || [],
    readiness_state_label: adapted.readinessBadge ? adapted.readinessBadge.state_label : 'Executive Ready — Qualified',
  }
}

export default function LensV2FlagshipPage() {
  const [densityClass, setDensityClass] = useState('EXECUTIVE_DENSE')
  const [boardroomMode, setBoardroomMode] = useState(false)
  const [investigationStage, setInvestigationStage] = useState('SUMMARY')

  // Orchestrate the full LENS v2 stack — deterministic, memoized by density
  const orchestrationResult = useMemo(() => {
    return orchestrateFlagshipExperience(
      FLAGSHIP_REAL_REPORT,
      'EXECUTIVE',
      densityClass,
      boardroomMode,
      investigationStage
    )
  }, [densityClass, boardroomMode, investigationStage])

  const adaptedProps = useMemo(() => {
    return buildAdaptedProps(orchestrationResult, FLAGSHIP_PROPAGATION_CHAINS)
  }, [orchestrationResult])

  const { renderState } = orchestrationResult
  const gravityToken = resolveGravityToken(renderState)
  const presenceToken = resolvePresenceToken(renderState)
  const boardroomConfig = resolveBoardroomConfig(renderState, densityClass)
  const gov = orchestrationResult.governance

  return (
    <>
      <Head>
        <title>LENS v2 — Executive Intelligence Experience</title>
        <meta name="description" content="LENS v2 Flagship Executive Intelligence Experience — PI.LENS.V2.FLAGSHIP-SPINOFF-MOUNTPOINT.01" />
      </Head>

      <div
        className="v2-root"
        data-gravity-token={gravityToken}
        data-presence-token={presenceToken}
        data-render-state={renderState}
      >

        {/* ── Authority header ── */}
        <header className="v2-header">
          <div className="v2-header-left">
            <div className="v2-wordmark">LENS v2</div>
            <div className="v2-subtitle">EXECUTIVE INTELLIGENCE EXPERIENCE</div>
          </div>
          <div className="v2-header-right">
            <span className="v2-contract-tag">PI.LENS.V2 · PHASE 2B</span>
            <span className="v2-stream-tag">SPINOFF ROUTE · /lens-v2-flagship</span>
          </div>
        </header>

        {/* ── Control bar ── */}
        <div className="v2-controls" aria-label="Experience controls">
          <div className="v2-control-group">
            <span className="v2-control-label">DENSITY</span>
            <div className="v2-density-switcher">
              {DENSITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`v2-density-btn${densityClass === opt.value ? ' v2-density-btn--active' : ''}`}
                  onClick={() => setDensityClass(opt.value)}
                  data-density-class={opt.value}
                  aria-pressed={densityClass === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="v2-control-group">
            <button
              className={`v2-boardroom-btn${boardroomMode ? ' v2-boardroom-btn--active' : ''}`}
              onClick={() => setBoardroomMode(prev => !prev)}
              aria-pressed={boardroomMode}
              data-boardroom-pacing={boardroomConfig.pacing}
            >
              {boardroomMode ? '◉ BOARDROOM ACTIVE' : '○ BOARDROOM MODE'}
            </button>
          </div>

          <div className="v2-control-group">
            <span className="v2-render-state-badge" data-render-state={renderState}>
              {renderState.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* ── Flagship experience ── */}
        <main className="v2-experience-canvas" data-boardroom-mode={String(boardroomMode)}>
          <LensV2FlagshipExperience
            adaptedProps={adaptedProps}
            renderState={renderState}
            qualifierClass={FLAGSHIP_REAL_REPORT.qualifier_class}
            densityClass={densityClass}
            boardroomMode={boardroomMode}
            presentationMode={boardroomMode}
            investigationStage={investigationStage}
          />
        </main>

        {/* ── Governance status strip ── */}
        <footer className="v2-governance-strip" aria-label="Governance status">
          <div className="v2-gov-title">GOVERNANCE</div>
          <div className="v2-gov-grid">
            {Object.entries(gov).map(([key, val]) => (
              <div key={key} className={`v2-gov-item${val ? ' v2-gov-item--pass' : ' v2-gov-item--fail'}`}>
                <span className="v2-gov-indicator">{val ? '✓' : '✗'}</span>
                <span className="v2-gov-key">{key.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
          <div className="v2-gov-footer">
            <a href="/" className="v2-back-link">← ExecLens 42.x demo</a>
            <span className="v2-build-tag">614/614 · PHASE 2B COMPLETE</span>
          </div>
        </footer>

      </div>

      <style jsx>{`
        /* ── Root ── */
        .v2-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 13px;
          display: flex;
          flex-direction: column;
        }

        .v2-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          color: var(--text-dim);
          font-size: 12px;
          letter-spacing: 0.08em;
        }

        /* ── Authority header ── */
        .v2-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 20px 28px 16px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-panel);
        }

        .v2-wordmark {
          font-size: 22px;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .v2-subtitle {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.14em;
          margin-top: 3px;
          text-transform: uppercase;
        }

        .v2-header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .v2-contract-tag {
          font-size: 10px;
          color: var(--accent);
          letter-spacing: 0.1em;
          background: rgba(74,158,255,0.08);
          border: 1px solid rgba(74,158,255,0.18);
          padding: 2px 8px;
          border-radius: 2px;
        }

        .v2-stream-tag {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.06em;
        }

        /* ── Control bar ── */
        .v2-controls {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 12px 28px;
          border-bottom: 1px solid var(--border-dim);
          background: var(--bg-card-deep);
          flex-wrap: wrap;
        }

        .v2-control-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .v2-control-label {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .v2-density-switcher {
          display: flex;
          gap: 2px;
          border: 1px solid var(--border);
          border-radius: 3px;
          overflow: hidden;
        }

        .v2-density-btn {
          background: transparent;
          color: var(--text-dim);
          border: none;
          padding: 4px 12px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          cursor: pointer;
          text-transform: uppercase;
          transition: background 0.15s, color 0.15s;
        }

        .v2-density-btn:hover {
          background: var(--accent-faint);
          color: var(--text);
        }

        .v2-density-btn--active {
          background: var(--accent-dim);
          color: var(--accent);
          font-weight: 600;
        }

        .v2-boardroom-btn {
          background: transparent;
          color: var(--text-dim);
          border: 1px solid var(--border);
          padding: 4px 14px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          cursor: pointer;
          border-radius: 3px;
          text-transform: uppercase;
          transition: all 0.15s;
        }

        .v2-boardroom-btn:hover {
          border-color: var(--accent-dim);
          color: var(--text);
        }

        .v2-boardroom-btn--active {
          background: rgba(74,158,255,0.12);
          border-color: var(--accent);
          color: var(--accent);
        }

        .v2-render-state-badge {
          font-size: 10px;
          letter-spacing: 0.1em;
          padding: 3px 10px;
          border-radius: 2px;
          text-transform: uppercase;
          font-weight: 600;
        }

        [data-render-state="EXECUTIVE_READY"] .v2-render-state-badge,
        .v2-render-state-badge[data-render-state="EXECUTIVE_READY"] {
          background: rgba(100,255,218,0.08);
          color: var(--green);
          border: 1px solid rgba(100,255,218,0.2);
        }

        [data-render-state="EXECUTIVE_READY_WITH_QUALIFIER"] .v2-render-state-badge,
        .v2-render-state-badge[data-render-state="EXECUTIVE_READY_WITH_QUALIFIER"] {
          background: rgba(255,215,0,0.08);
          color: var(--yellow);
          border: 1px solid rgba(255,215,0,0.2);
        }

        [data-render-state="DIAGNOSTIC_ONLY"] .v2-render-state-badge,
        .v2-render-state-badge[data-render-state="DIAGNOSTIC_ONLY"] {
          background: rgba(255,158,74,0.08);
          color: var(--orange);
          border: 1px solid rgba(255,158,74,0.2);
        }

        [data-render-state="BLOCKED"] .v2-render-state-badge,
        .v2-render-state-badge[data-render-state="BLOCKED"] {
          background: rgba(255,107,107,0.08);
          color: var(--red);
          border: 1px solid rgba(255,107,107,0.2);
        }

        /* ── Experience canvas ── */
        .v2-experience-canvas {
          flex: 1;
          padding: 28px;
          background: var(--bg);
        }

        .v2-experience-canvas[data-boardroom-mode="true"] {
          padding: 0;
          background: #080a0f;
        }

        /* ── Governance strip ── */
        .v2-governance-strip {
          border-top: 1px solid var(--border-dim);
          background: var(--bg-card-deep);
          padding: 16px 28px;
        }

        .v2-gov-title {
          font-size: 9px;
          color: var(--text-muted);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .v2-gov-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 16px;
          margin-bottom: 14px;
        }

        .v2-gov-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          letter-spacing: 0.04em;
        }

        .v2-gov-item--pass {
          color: var(--text-muted);
        }

        .v2-gov-item--fail {
          color: var(--red);
          font-weight: 600;
        }

        .v2-gov-indicator {
          font-size: 9px;
        }

        .v2-gov-item--pass .v2-gov-indicator {
          color: var(--green);
        }

        .v2-gov-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid var(--border-dim);
        }

        .v2-back-link {
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          transition: color 0.15s;
        }

        .v2-back-link:hover {
          color: var(--accent);
        }

        .v2-build-tag {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.08em;
        }

        /* ── Flagship component data region styling ── */
        :global([data-intelligence-presence]) {
          display: flex;
          flex-direction: column;
          gap: 0;
          min-height: 400px;
        }

        :global([data-operational-gravity]) {
          flex: 1;
          border: 1px solid var(--border);
          border-radius: 4px;
          overflow: hidden;
        }

        :global([data-boardroom-mode="true"]) {
          border: none;
          border-radius: 0;
        }

        :global([data-reveal-cinema]) {
          padding: 0;
        }

        :global([data-investigation-flow]) {
          padding: 0;
        }

        :global([data-operational-canvas]) {
          padding: 0;
        }

        :global([data-attention-director]) {
          padding: 0;
        }

        /* ── Blocked escalation ── */
        :global([data-blocked-escalation]) {
          background: rgba(255,107,107,0.06);
          border: 1px solid rgba(255,107,107,0.25);
          border-radius: 4px;
          padding: 24px 28px;
          margin: 20px;
        }

        :global([data-blocked-headline]) {
          font-size: 15px;
          color: var(--red);
          font-weight: 700;
          letter-spacing: 0.04em;
          margin-bottom: 8px;
        }

        :global([data-blocked-reason]) {
          font-size: 12px;
          color: var(--text-dim);
          letter-spacing: 0.04em;
        }

        /* ── Diagnostic escalation ── */
        :global([data-diagnostic-escalation]) {
          background: rgba(255,158,74,0.06);
          border: 1px solid rgba(255,158,74,0.25);
          border-radius: 4px;
          padding: 16px 28px;
          margin: 20px;
        }

        :global([data-diagnostic-headline]) {
          font-size: 13px;
          color: var(--orange);
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        /* ── Readiness command ── */
        :global([data-readiness-command]) {
          padding: 20px 28px 0;
        }

        :global([data-readiness-badge]) {
          font-size: 18px;
          font-weight: 700;
          color: var(--yellow);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── Qualifier notice ── */
        :global([data-qualifier-notice]) {
          background: rgba(255,215,0,0.05);
          border-left: 3px solid var(--yellow);
          padding: 10px 20px;
          margin: 12px 28px;
          font-size: 12px;
          color: var(--yellow);
          letter-spacing: 0.04em;
          border-radius: 0 3px 3px 0;
        }

        /* ── Q-04 absence notice ── */
        :global([data-q04-absence-notice]) {
          background: rgba(255,107,107,0.05);
          border-left: 3px solid var(--red);
          padding: 10px 20px;
          margin: 12px 28px;
          font-size: 12px;
          color: var(--red);
          letter-spacing: 0.04em;
        }

        /* ── Intelligence narrative ── */
        :global([data-intelligence-narrative]) {
          padding: 20px 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        :global([data-executive-summary]) {
          font-size: 14px;
          color: var(--text);
          line-height: 1.7;
          letter-spacing: 0.02em;
          border-left: 3px solid var(--accent);
          padding-left: 16px;
        }

        :global([data-why-statement]) {
          font-size: 12px;
          color: var(--text-dim);
          line-height: 1.65;
          letter-spacing: 0.02em;
          padding-left: 19px;
        }

        :global([data-structural-findings]) {
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1.6;
          letter-spacing: 0.02em;
          padding-left: 19px;
          font-style: italic;
        }

        /* ── Propagation zone ── */
        :global([data-propagation-zone]) {
          padding: 20px 28px;
          border-top: 1px solid var(--border-dim);
        }

        :global([data-topology-realization]) {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        :global([data-propagation-chain]) {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 12px 16px;
        }

        :global([data-propagation-path]) {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 6px;
        }

        :global([data-domain-node]) {
          font-size: 12px;
          color: var(--text);
          background: var(--bg-card-deep);
          border: 1px solid var(--border);
          padding: 3px 10px;
          border-radius: 2px;
          letter-spacing: 0.04em;
        }

        :global([data-domain-node]:not(:last-child)::after) {
          content: ' →';
          color: var(--text-muted);
          margin-left: 8px;
        }

        :global([data-role-label]) {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        :global([data-pressure-label]) {
          font-size: 10px;
          color: var(--text-dim);
          letter-spacing: 0.06em;
          margin-top: 2px;
        }

        /* Pressure tier coloring */
        :global([data-pressure-token="token-pressure-high"] [data-role-label]) { color: var(--red); }
        :global([data-pressure-token="token-pressure-elevated"] [data-role-label]) { color: var(--orange); }
        :global([data-pressure-token="token-pressure-moderate"] [data-role-label]) { color: var(--yellow); }
        :global([data-pressure-token="token-pressure-low"] [data-role-label]) { color: var(--green); }

        /* ── Evidence layer ── */
        :global([data-evidence-layer]) {
          padding: 16px 28px 24px;
          border-top: 1px solid var(--border-dim);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        :global([data-evidence-block]) {
          background: var(--bg-card-deep);
          border: 1px solid var(--border-dim);
          border-radius: 3px;
          padding: 10px 14px;
          display: flex;
          gap: 16px;
          align-items: center;
        }

        :global([data-domain-alias]) {
          font-size: 12px;
          color: var(--text);
          letter-spacing: 0.04em;
        }
      `}</style>
    </>
  )
}
