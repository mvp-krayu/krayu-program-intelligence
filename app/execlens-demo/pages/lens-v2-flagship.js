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
import { useState, useMemo, useCallback } from 'react'
import LensDisclosureShell from '../components/lens-v2/LensDisclosureShell'


const {
  orchestrateFlagshipExperience,
  resolveBoardroomConfig,
  resolveGravityToken,
  resolvePresenceToken,
} = require('../flagship-experience/flagshipOrchestration')

/* Live binding migration — PI.LENS.V2.BLUEEDGE-LIVE-BINDING.01
 * Productized — PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
 * Parameterized — PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-REGISTRY-UNIFICATION.01
 *
 * The flagship route now hydrates from a real governed substrate via the
 * generic, manifest-driven resolver. The page accepts ?client and ?run
 * query parameters; without them it defaults to the canonical BlueEdge
 * productized run. Unknown client/run pairs fail closed (no fixture
 * fallback, no synthetic semantics).
 */
const DEFAULT_BINDING_CLIENT = 'blueedge'
const DEFAULT_BINDING_RUN = 'run_blueedge_productized_01_fixed'

// Param-safety: alphanumerics, underscore, hyphen; reject empty / >200 / `..`.
function paramSafe(value) {
  if (typeof value !== 'string') return false
  if (value.length === 0 || value.length > 200) return false
  if (!/^[A-Za-z0-9_\-]+$/.test(value)) return false
  if (value.includes('..')) return false
  return true
}


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

// ── Page ──────────────────────────────────────────────────────────────────────

/* getServerSideProps — backward-compatible redirect.
 *
 * PI.LENS.V2.PHASE3.URL-SEPARATION.01
 *
 * The canonical LENS v2 executive route is now /lens/[client]/[run].
 * This legacy entry point redirects to the canonical route, preserving
 * any ?client and ?run query parameters in the path.
 *
 * The component is still exported as the default for import by the
 * canonical route page — do not remove it.
 */
export async function getServerSideProps(context) {
  const query = (context && context.query) || {};
  const client = (typeof query.client === 'string' && query.client) || 'blueedge';
  const run = (typeof query.run === 'string' && query.run) || 'run_blueedge_productized_01_fixed';
  return {
    redirect: {
      destination: `/lens/${encodeURIComponent(client)}/${encodeURIComponent(run)}`,
      permanent: false,
    },
  }
}

export default function LensV2FlagshipPage({ livePayload, livePropagationChains, liveBindingError, bindingClient, bindingRun, reconciliationAwareness, domainTraceability, substrateBinding, reportBinding, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData }) {
  const [densityClass, setDensityClass] = useState('EXECUTIVE_DENSE')
  const [boardroomMode, setBoardroomMode] = useState(false)
  const [investigationStage, setInvestigationStage] = useState('SUMMARY')
  const [pendingTransitionDomain, setPendingTransitionDomain] = useState(null)
  const [pendingTransitionZone, setPendingTransitionZone] = useState(null)

  const handleModeTransition = useCallback((targetMode, focusedDomainId, targetZoneKey) => {
    setBoardroomMode(false)
    setDensityClass(targetMode)
    if (focusedDomainId) setPendingTransitionDomain(focusedDomainId)
    if (targetZoneKey) setPendingTransitionZone(targetZoneKey)
  }, [])

  const reportObject = livePayload || null

  const result = useMemo(() => {
    if (!reportObject) return null
    return orchestrateFlagshipExperience(
      reportObject,
      'EXECUTIVE',
      densityClass,
      boardroomMode,
      investigationStage,
    )
  }, [reportObject, densityClass, boardroomMode, investigationStage])

  // Live binding failure surface — fixture fallback DISABLED per contract
  if (!reportObject || !result) {
    return (
      <>
        <Head>
          <title>LENS v2 — Live binding failure</title>
        </Head>
        <div style={{
          minHeight: '100vh',
          background: '#14171f',
          color: '#e8edf8',
          fontFamily: '-apple-system, "system-ui", Inter, "Helvetica Neue", system-ui, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 32px',
          textAlign: 'center',
          gap: '24px',
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.32em', color: '#ff6b6b' }}>LIVE_BINDING_FAILED</div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#e8edf8', maxWidth: '720px', lineHeight: 1.3 }}>
            LENS V2 could not bind to the BlueEdge productized substrate.
          </div>
          <div style={{ fontSize: '13px', color: '#9aa0bc', maxWidth: '640px', lineHeight: 1.6 }}>
            Fixture fallback is disabled by contract (FIXTURE_FALLBACK_DISABLED).
            The flagship surface refuses to display synthetic semantics.
          </div>
          {liveBindingError && (
            <pre style={{
              fontSize: '11px',
              color: '#7a85a3',
              background: 'rgba(20,23,31,0.6)',
              padding: '14px 18px',
              borderRadius: 4,
              maxWidth: '720px',
              overflow: 'auto',
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              textAlign: 'left',
            }}>{JSON.stringify(liveBindingError, null, 2)}</pre>
          )}
        </div>
      </>
    )
  }

  const { renderState, adapted, motionProfile, urgencyFrame, densityLayout, governance } = result
  const gravityToken = resolveGravityToken(renderState)
  const presenceToken = resolvePresenceToken(renderState)
  const narrative = (adapted && adapted.narrative) || {}
  const qualifierVisible = densityLayout.qualifier_notice_visible === true

  const isBlocked = renderState === 'BLOCKED'
  const isDiagnostic = renderState === 'DIAGNOSTIC_ONLY'

  // Live binding visible indicators — per contract requirements
  const ipActor =
    reportObject.actor_registry && reportObject.actor_registry.inference_prohibition
  const ipPlaceholderActive = !!(ipActor && ipActor.status === 'PLACEHOLDER_BINDING_PENDING')
  const ipEnforced = !!(
    ipActor && ipActor.status === 'HYDRATED'
    && ipActor.value && ipActor.value.inference_prohibition_status === 'ENFORCED'
  )

  // Q-class governance disclosure (Q02 amendment, 2026-05-10)
  const governanceQualifier = (reportObject.qualifier_summary && reportObject.qualifier_summary.qualifier_class)
    || reportObject.qualifier_class_governance
    || reportObject.qualifier_class
  const governanceQualifierLabel = (reportObject.qualifier_summary && reportObject.qualifier_summary.qualifier_label)
    || ''
  const governanceQualifierNote = (reportObject.qualifier_summary && reportObject.qualifier_summary.qualifier_note)
    || ''

  // Override the legacy chip with the governance-true class and label so
  // every downstream consumer (RepEvidenceState, SupportRail, ActorCard,
  // BoardroomCard) displays the Q02-amendment language without touching
  // the legacy QualifierChipAdapter (which retains its fixture-era tests).
  const adaptedDisplay = useMemo(() => {
    if (!adapted) return adapted
    const origChip = (adapted && adapted.qualifierChip) || {}
    const renders =
      governanceQualifier === 'Q-02' || governanceQualifier === 'Q-03'
        ? true
        : (governanceQualifier === 'Q-01' || governanceQualifier === 'Q-04')
        ? false
        : !!origChip.renders
    return {
      ...adapted,
      qualifierChip: {
        ...origChip,
        renders,
        qualifier_class: governanceQualifier || origChip.qualifier_class,
        class_label: governanceQualifierLabel || origChip.class_label || origChip.chip_label,
        chip_label: governanceQualifierLabel || origChip.chip_label,
        tooltip_text: governanceQualifierNote || origChip.tooltip_text,
      },
    }
  }, [adapted, governanceQualifier, governanceQualifierLabel, governanceQualifierNote])

  // Active client/run for the rendered report-pack registry. Defaults to
  // the canonical BlueEdge productized run when query-bound.
  const activeBindingClient = bindingClient || (reportObject && reportObject.client) || DEFAULT_BINDING_CLIENT
  const activeBindingRun    = bindingRun    || (reportObject && reportObject.run_id) || DEFAULT_BINDING_RUN
  const reportPackArtifactsForRender = useMemo(
    () => buildReportPackRegistry(activeBindingClient, activeBindingRun),
    [activeBindingClient, activeBindingRun]
  )

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
        data-binding-status={reportObject.binding_status || 'UNKNOWN'}
        data-binding-client={reportObject.client_name || ''}
        data-binding-run={reportObject.run_id || ''}
      >
        {/* Live substrate banner — visible governance affordance */}
        <div className="v2-live-banner" role="status" aria-live="polite">
          <span className="v2-live-banner-dot" />
          <span className="v2-live-banner-label">LIVE SUBSTRATE</span>
          <span className="v2-live-banner-sep">·</span>
          <span className="v2-live-banner-detail">
            {(reportObject.client_name || reportObject.client || activeBindingClient)} · {reportObject.run_id || activeBindingRun} · baseline {reportObject.baseline_commit}
          </span>
          {ipPlaceholderActive && (
            <>
              <span className="v2-live-banner-sep">·</span>
              <span className="v2-live-banner-warn">INFERENCE PROHIBITION: BINDING PENDING</span>
            </>
          )}
          {ipEnforced && (
            <>
              <span className="v2-live-banner-sep">·</span>
              <span className="v2-live-banner-ok">INFERENCE PROHIBITION: ENFORCED</span>
            </>
          )}
          {governanceQualifier && governanceQualifier !== 'Q-01' && (
            <>
              <span className="v2-live-banner-sep">·</span>
              <span className="v2-live-banner-qclass">QUALIFIER {governanceQualifier}</span>
            </>
          )}
        </div>

        <AuthorityBand
          densityClass={densityClass}
          boardroomMode={boardroomMode}
          onDensityChange={setDensityClass}
          onBoardroomToggle={() => setBoardroomMode(p => !p)}
        />

        <div className="v2-body">
          {isBlocked && <BlockedDeclaration adapted={adaptedDisplay} />}
          {isDiagnostic && !isBlocked && <DiagnosticDeclaration />}

          <LensDisclosureShell
            renderState={renderState}
            densityClass={densityClass}
            boardroomMode={boardroomMode}
            substrateBinding={substrateBinding}
            reconciliationAwareness={reconciliationAwareness}
            qualifierClass={governanceQualifier}
            qualifierVisible={qualifierVisible}
            adapted={adaptedDisplay}
            governance={governance}
            qualifierLabel={governanceQualifierLabel}
            qualifierNote={governanceQualifierNote}
            domainTraceability={domainTraceability}
            narrative={narrative}
            evidenceBlocks={reportObject.evidence_blocks}
            fullReport={reportObject}
            reportPackArtifacts={reportPackArtifactsForRender}
            propagationChains={livePropagationChains || []}
            correspondenceData={correspondenceData}
            evidenceIntakeData={evidenceIntakeData}
            debtIndexData={debtIndexData}
            progressionData={progressionData}
            maturityData={maturityData}
            temporalAnalyticsData={temporalAnalyticsData}
            temporalLifecycleData={temporalLifecycleData}
            onModeTransition={handleModeTransition}
            pendingTransitionZone={pendingTransitionZone}
            onTransitionZoneConsumed={() => setPendingTransitionZone(null)}
          />
        </div>
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
         *   #6a7a9a  tertiary text    (dim but visible)
         *   #5e6d8a  muted text       (readable quiet)
         *   #3a4560  separators       (decorative only)
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

        /* ── Live Substrate Banner ───────────────────────────────────────── */
        .v2-live-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 56px;
          background:
            linear-gradient(90deg, rgba(74,158,255,0.08) 0%, rgba(74,158,255,0.02) 50%, rgba(230,184,0,0.04) 100%);
          border-bottom: 1px solid rgba(74,158,255,0.18);
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #b6bdd6;
          flex-wrap: wrap;
        }
        .v2-live-banner-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(74,158,255,0.8);
          box-shadow: 0 0 8px 0 rgba(74,158,255,0.6);
          flex-shrink: 0;
        }
        .v2-live-banner-label {
          color: #6a8cd6;
          font-weight: 600;
          letter-spacing: 0.2em;
        }
        .v2-live-banner-sep { color: #3a4560; }
        .v2-live-banner-detail {
          color: #9aa0bc;
          letter-spacing: 0.04em;
          text-transform: none;
          font-family: ui-monospace, "SF Mono", Menlo, monospace;
          font-size: 10px;
        }
        .v2-live-banner-warn {
          color: #e6b800;
          font-weight: 600;
          letter-spacing: 0.16em;
        }
        .v2-live-banner-ok {
          color: #5dd29f;
          font-weight: 600;
          letter-spacing: 0.16em;
        }
        .v2-live-banner-qclass {
          color: #d8e0f0;
          font-weight: 600;
          letter-spacing: 0.18em;
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
          color: #8a96b2;
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
        .blocked-detail { font-size: 14px; color: #8a96b2; line-height: 1.7; }

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
        .diagnostic-detail { font-size: 12px; color: #8a96b2; }

        /* ── Declaration Zone ────────────────────────────────────────────── */
        .declaration-zone {
          padding: 80px 56px 56px;
          border-bottom: 1px solid #1a2030;
          border-left: 4px solid var(--state-color);
          background:
            radial-gradient(120% 80% at 12% 50%, var(--state-bg) 0%, transparent 55%),
            linear-gradient(90deg, rgba(20,23,31,0.55) 0%, transparent 70%);
          transition: border-color 0.4s, background 0.4s;
        }
        .declaration-pre-label {
          font-size: 10px;
          color: #8a96b2;
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

        /* ── Boardroom Decision View (Phase 3B) ─────────────────────────── */
        .declaration-zone--boardroom {
          padding: 72px 56px 48px;
          border-left: 4px solid var(--state-color);
          background:
            radial-gradient(100% 70% at 8% 40%, var(--state-bg) 0%, transparent 50%),
            linear-gradient(90deg, rgba(20,23,31,0.55) 0%, transparent 60%);
        }
        .declaration-boardroom-pre {
          font-size: 10px;
          color: #8a96b2;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 16px;
        }
        .declaration-boardroom-posture {
          font-size: 72px;
          font-weight: 700;
          color: var(--state-color);
          letter-spacing: -0.02em;
          line-height: 1;
          transition: color 0.4s;
        }
        .declaration-boardroom-rationale {
          font-size: 14px;
          color: #8a95b0;
          line-height: 1.5;
          margin-top: 16px;
          max-width: 640px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .declaration-boardroom-badges {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .declaration-badge {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 8px 16px;
          border: 1px solid #2a2f40;
          border-radius: 4px;
          background: rgba(20,23,32,0.6);
        }
        .declaration-badge[data-status="COMPLETE"],
        .declaration-badge[data-status="FULL"],
        .declaration-badge[data-status="LOW"] {
          border-color: rgba(100,255,218,0.25);
        }
        .declaration-badge[data-status="PARTIAL"],
        .declaration-badge[data-status="MODERATE"] {
          border-color: rgba(255,215,0,0.25);
        }
        .declaration-badge[data-status="ELEVATED"],
        .declaration-badge[data-status="HIGH"] {
          border-color: rgba(255,107,107,0.25);
        }
        .declaration-badge-label {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .declaration-badge-value {
          font-size: 12px;
          color: #ccd6f6;
          letter-spacing: 0.02em;
        }

        /* ── Decision Surface — Score Gauge + Boundary ──────────────────── */
        /* ── Boardroom Cockpit ────────────────────────────────────────── */
        .rep-field--cockpit {
          display: flex;
          flex-direction: column;
          gap: 0;
          text-align: left;
        }
        .rep-field--cockpit .rep-mode-tag {
          border-bottom: 1px solid #1e2330;
          text-align: left;
        }
        .cockpit-finding {
          padding: 20px 0;
          border-bottom: 1px solid #1e2330;
        }
        .cockpit-finding-verdict {
          font-size: 11px;
          letter-spacing: 0.2em;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .cockpit-finding[data-found="true"] .cockpit-finding-verdict {
          color: #ff9e4a;
        }
        .cockpit-finding[data-found="false"] .cockpit-finding-verdict {
          color: #64ffda;
        }
        .cockpit-finding-summary {
          font-size: 12px;
          color: #9aa4c0;
          line-height: 1.6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ── Signal Field (BOARDROOM atmospheric projection) ────────── */
        .signal-field {
          padding: 14px 0;
          border-bottom: 1px solid #1e2330;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .signal-field[data-pressure="active"] {
          border-bottom-color: rgba(255, 158, 74, 0.15);
        }
        .signal-field-vector {
          display: flex;
          align-items: center;
          gap: 0;
        }
        .signal-field-node {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .signal-field-glyph {
          font-size: 10px;
          line-height: 1;
        }
        .signal-field-node[data-tier="HIGH"] .signal-field-glyph { color: #ff6b6b; }
        .signal-field-node[data-tier="ELEVATED"] .signal-field-glyph { color: #ff9e4a; }
        .signal-field-node[data-tier="MODERATE"] .signal-field-glyph { color: #ffd700; }
        .signal-field-node[data-tier="LOW"] .signal-field-glyph { color: #64ffda; }
        .signal-field-domain {
          font-size: 10px;
          color: #8a96b2;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.02em;
        }
        .signal-field-node[data-tier="HIGH"] .signal-field-domain { color: #ccd6f6; }
        .signal-field-arrow {
          font-size: 10px;
          color: #2a2f40;
          margin: 0 8px;
        }
        .signal-field[data-pressure="active"] .signal-field-arrow { color: #7a8aaa; }
        .signal-field-strip {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: auto;
        }
        .signal-field-pip {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .signal-field-pip[data-severity="CRITICAL"] { background: #ff6b6b; box-shadow: 0 0 4px rgba(255, 107, 107, 0.4); }
        .signal-field-pip[data-severity="HIGH"] { background: #ff6b6b; box-shadow: 0 0 4px rgba(255, 107, 107, 0.3); }
        .signal-field-pip[data-severity="ELEVATED"] { background: #ff9e4a; box-shadow: 0 0 3px rgba(255, 158, 74, 0.3); }
        .signal-field-pip[data-severity="MODERATE"] { background: #ffd700; }
        .signal-field-count {
          font-size: 9px;
          color: #ff9e4a;
          letter-spacing: 0.06em;
          margin-left: 4px;
          font-family: 'Courier New', monospace;
        }
        .signal-field-nominal {
          font-size: 9px;
          color: #7a8aaa;
          letter-spacing: 0.06em;
          margin-left: 4px;
          font-family: 'Courier New', monospace;
        }

        /* ── Cockpit Synthesis (BOARDROOM signal presence) ────────────── */
        .cockpit-synthesis {
          padding: 14px 0;
          border-bottom: 1px solid #1e2330;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cockpit-synthesis-conclusion {
          font-size: 12px;
          color: #ccd6f6;
          line-height: 1.55;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .cockpit-synthesis-compound {
          font-size: 11px;
          color: #9aa4c0;
          line-height: 1.55;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .cockpit-synthesis-confidence {
          font-size: 10px;
          color: #8a96b2;
          line-height: 1.5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .cockpit-synthesis-pressure {
          font-size: 11px;
          color: #ff9e4a;
          font-family: 'Courier New', monospace;
        }

        .cockpit-instruments {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 24px;
          padding: 20px 0;
          border-bottom: 1px solid #1e2330;
          align-items: start;
        }
        .cockpit-gauge-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .cockpit-gauge-svg {
          width: 160px;
          height: 96px;
        }
        .cockpit-gauge-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          color: #8a96b2;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .cockpit-gauge-sep {
          color: #2a2f40;
        }

        .cockpit-signal-panel {
          min-width: 0;
        }
        .cockpit-signal-label,
        .cockpit-coverage-label {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 10px;
        }
        .cockpit-signal {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 6px 0;
        }
        .cockpit-signal + .cockpit-signal {
          border-top: 1px solid #12151f;
        }
        .cockpit-signal-bar {
          width: 3px;
          min-height: 28px;
          border-radius: 2px;
          flex-shrink: 0;
          margin-top: 2px;
          opacity: 0.35;
        }
        .cockpit-signal--active .cockpit-signal-bar {
          opacity: 1;
        }
        .cockpit-signal-body {
          min-width: 0;
        }
        .cockpit-signal-name {
          font-size: 11px;
          color: #8a96b2;
          font-weight: 500;
          margin-bottom: 2px;
        }
        .cockpit-signal--active .cockpit-signal-name {
          color: #ccd6f6;
        }
        .cockpit-signal-reading {
          font-size: 11px;
          color: #8a96b2;
          line-height: 1.5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .cockpit-signal--active .cockpit-signal-reading {
          color: #8a96b2;
        }
        .cockpit-signal-tally {
          font-size: 10px;
          color: #7a8aaa;
          margin-top: 8px;
          letter-spacing: 0.06em;
        }

        .cockpit-coverage-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .cockpit-coverage-ring {
          width: 88px;
          height: 88px;
        }
        .cockpit-coverage-svg {
          width: 100%;
          height: 100%;
        }
        .cockpit-coverage-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 8px;
        }
        .cockpit-coverage-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          color: #8a96b2;
          white-space: nowrap;
        }
        .cockpit-coverage-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .cockpit-coverage-dot--backed { background: #64ffda; }
        .cockpit-coverage-dot--advisory { background: #ffd700; opacity: 0.6; }

        /* Cockpit Topology Preview (compact, clickable) */
        .cockpit-topology-preview {
          padding: 12px 0;
          border-top: 1px solid #1e2330;
          border-bottom: 1px solid #1e2330;
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
        }
        .cockpit-topology-preview:hover {
          background: rgba(74, 158, 255, 0.03);
        }
        .cockpit-topology-preview .topo-graph-wrap {
          margin-bottom: 0;
        }
        .cockpit-topology-preview .topo-graph-heading {
          font-size: 9px;
          text-align: center;
        }
        .cockpit-topology-preview .topo-graph-svg {
          pointer-events: none;
        }
        .cockpit-topology-hint {
          text-align: center;
          font-size: 9px;
          color: #7a8aaa;
          letter-spacing: 0.08em;
          margin-top: 4px;
          transition: color 0.2s;
        }
        .cockpit-topology-preview:hover .cockpit-topology-hint {
          color: #4a9eff;
        }

        /* Topology Modal (full-screen overlay) */
        .topo-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9000;
          background: rgba(0, 0, 0, 0.88);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(6px);
        }
        .topo-modal {
          width: 96vw;
          height: 94vh;
          max-width: 1800px;
          background: #0d0f14;
          border: 1px solid #2a2f40;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
        }
        .topo-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 28px;
          border-bottom: 1px solid #1e2330;
          flex-shrink: 0;
        }
        .topo-modal-title {
          font-size: 12px;
          color: #8a96b2;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
          font-family: 'Courier New', monospace;
        }
        .topo-modal-close {
          background: none;
          border: 1px solid #2a2f40;
          color: #8a96b2;
          font-size: 16px;
          width: 36px;
          height: 36px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .topo-modal-close:hover {
          background: rgba(74, 158, 255, 0.1);
          border-color: #4a9eff;
          color: #ccd6f6;
        }
        .topo-modal-body {
          padding: 0;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .topo-modal-graph {
          padding: 16px 28px 8px;
          flex-shrink: 0;
        }
        .topo-modal-graph .topo-graph-heading {
          font-size: 11px;
          margin-bottom: 10px;
        }
        .topo-modal-graph .topo-graph-svg {
          pointer-events: auto;
          width: 100%;
          height: auto;
        }
        .topo-modal-meta {
          font-size: 11px;
          color: #8a96b2;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.06em;
        }
        .topo-modal-domains {
          padding: 12px 28px 24px;
          border-top: 1px solid #1e2330;
        }
        .topo-modal-domains-heading {
          font-size: 10px;
          color: #8a96b2;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 10px;
          font-family: 'Courier New', monospace;
        }
        .topo-modal-domains-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 8px;
        }
        .topo-modal-domain-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          background: #141720;
          border: 1px solid #1e2330;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .topo-modal-domain-card:hover {
          border-color: #3a4560;
          background: #1a1e2b;
        }
        .topo-modal-domain-card--focused {
          border-color: #4a9eff;
          background: rgba(74, 158, 255, 0.08);
          box-shadow: 0 0 0 1px rgba(74, 158, 255, 0.2);
        }
        .topo-modal-domain-card--pz {
          border-left: 2px solid rgba(255, 215, 0, 0.45);
        }
        .topo-modal-domain-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .topo-modal-domain-name {
          font-size: 12px;
          color: #ccd6f6;
          font-weight: 500;
          flex: 1;
          min-width: 0;
        }
        .topo-modal-domain-meta {
          font-size: 9px;
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
          flex-shrink: 0;
        }
        .topo-modal-domain-lineage {
          font-size: 9px;
          font-weight: 600;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }

        /* ── DomainStructuralPanel ───────────────────────────────────────── */
        .dsp-panel {
          background: #12151f;
          border: 1px solid #2a2f40;
          border-left: 3px solid #4a5570;
          border-radius: 4px;
          padding: 16px 20px;
          margin: 0 0 16px 0;
          animation: v2Appear 0.15s ease-out;
        }
        .dsp-unavailable {
          font-size: 11px;
          color: #8a96b2;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-style: italic;
        }
        .dsp-section {
          margin-bottom: 14px;
        }
        .dsp-section:last-child {
          margin-bottom: 0;
        }
        .dsp-section-label {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid #1e2330;
        }
        .dsp-grid {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .dsp-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          min-height: 20px;
        }
        .dsp-row--stack {
          flex-direction: column;
          gap: 4px;
        }
        .dsp-key {
          font-size: 10px;
          color: #8a96b2;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          min-width: 130px;
          flex-shrink: 0;
          letter-spacing: 0.02em;
        }
        .dsp-val {
          font-size: 11px;
          color: #ccd6f6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dsp-mono {
          font-family: 'Courier New', monospace;
          font-size: 11px;
        }
        .dsp-dim {
          color: #7a8aaa;
        }
        .dsp-confidence-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dsp-badge {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
        }
        .dsp-badge--ok {
          color: #64ffda;
        }
        .dsp-badge--gap {
          color: #ff9e4a;
        }
        .dsp-factors {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .dsp-factor {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #8a96b2;
          background: #1a1e2b;
          padding: 2px 8px;
          border-radius: 2px;
          border: 1px solid #2a2f40;
        }
        .dsp-refs {
          display: flex;
          flex-direction: column;
          gap: 2px;
          max-height: 80px;
          overflow-y: auto;
          background: #0d0f14;
          border: 1px solid #1e2330;
          border-radius: 2px;
          padding: 6px 8px;
        }
        .dsp-ref {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #8a96b2;
          white-space: nowrap;
        }

        /* ── Evidence Sources (5A.2) ─────────────────────────────────────── */
        .dsp-sources {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .dsp-source {
          background: #0d0f14;
          border: 1px solid #1e2330;
          border-radius: 2px;
          padding: 8px 10px;
        }
        .dsp-source-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .dsp-source-class {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .dsp-source-id {
          font-family: 'Courier New', monospace;
          font-size: 9px;
        }
        .dsp-source-hash {
          font-size: 9px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin-left: auto;
        }
        .dsp-source-hash--ok { color: #64ffda; }
        .dsp-source-hash--fail { color: #ff6b6b; }
        .dsp-source-path {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #8a96b2;
          word-break: break-all;
          line-height: 1.4;
        }
        .dsp-source-desc {
          font-size: 10px;
          color: #7a8aaa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin-top: 4px;
          line-height: 1.4;
        }
        .dsp-source-ops {
          display: flex;
          flex-wrap: wrap;
          gap: 3px;
          margin-top: 4px;
        }
        .dsp-source-op {
          font-family: 'Courier New', monospace;
          font-size: 8px;
          color: #8a96b2;
          background: #141720;
          padding: 1px 5px;
          border-radius: 2px;
          border: 1px solid #1e2330;
          letter-spacing: 0.02em;
        }

        /* ── Trace origin affordance ─────────────────────────────────────── */
        .topo-modal-trace-origin {
          display: inline-block;
          margin-left: 10px;
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: #4a9eff;
          background: none;
          border: 1px solid #2a2f40;
          border-radius: 2px;
          padding: 1px 6px;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.15s ease;
        }
        .topo-modal-trace-origin:hover {
          opacity: 1;
          border-color: #4a9eff;
        }

        /* ── Blockage posture summary (5A.3) ─────────────────────────────── */
        .blockage-posture {
          background: #0d0f14;
          border: 1px solid #1e2330;
          border-radius: 3px;
          padding: 10px 14px;
          margin: 12px 0 0 0;
        }
        .blockage-posture-label {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 8px;
          border-bottom: 1px solid #1e2330;
          padding-bottom: 4px;
        }
        .blockage-posture-row {
          display: flex;
          gap: 20px;
          margin-bottom: 8px;
        }
        .blockage-posture-metric {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .blockage-posture-metric-value {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          color: #ccd6f6;
          font-weight: 500;
        }
        .blockage-posture-metric-label {
          font-size: 9px;
          color: #7a8aaa;
          letter-spacing: 0.05em;
        }
        .blockage-posture-dims {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 4px 12px;
          margin-bottom: 6px;
        }
        .blockage-posture-dim {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .blockage-posture-dim-id {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: #8a96b2;
          min-width: 18px;
        }
        .blockage-posture-dim-bar-track {
          width: 40px;
          height: 3px;
          background: #1e2330;
          border-radius: 1px;
          overflow: hidden;
        }
        .blockage-posture-dim-bar-fill {
          display: block;
          height: 100%;
          border-radius: 1px;
        }
        .blockage-posture-dim-score {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          min-width: 28px;
          text-align: right;
        }
        .blockage-posture-continuity {
          font-size: 10px;
          color: #7a8aaa;
          line-height: 1.4;
          margin-top: 4px;
        }

        /* ── Domain debt section (5A.3) ──────────────────────────────────── */
        .dsp-debt-status--active { color: #ff9e4a; }
        .dsp-debt-status--partial { color: #ffd700; }
        .dsp-debt-items {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .dsp-debt-item {
          background: #0d0f14;
          border: 1px solid #1e2330;
          border-radius: 3px;
          padding: 6px 10px;
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }
        .dsp-debt-item-id {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #8a96b2;
        }
        .dsp-debt-item-severity {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .dsp-debt-item-cat {
          font-size: 10px;
          color: #7a8aaa;
        }
        .dsp-debt-item-blocks {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: #ff6b6b;
          letter-spacing: 0.03em;
        }
        .dsp-exposure {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: 600;
        }
        .dsp-reducibility {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          font-weight: 500;
        }

        /* ── Temporal structural summary (5A.5) ──────────────────────────── */
        .temporal-summary {
          background: #0d0f14;
          border: 1px solid #1e2330;
          border-radius: 3px;
          padding: 10px 14px;
          margin: 8px 0 0 0;
        }
        .temporal-summary-label {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .temporal-summary-row {
          display: flex;
          gap: 20px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }
        .temporal-summary-metric {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .temporal-summary-metric-value {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          color: #ccd6f6;
        }
        .temporal-summary-metric-label {
          font-size: 9px;
          color: #7a8aaa;
        }
        .temporal-summary-transitions {
          display: flex;
          gap: 16px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }
        .temporal-summary-transition {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #4a9eff;
        }
        .temporal-summary-persistent {
          border-top: 1px solid #1e2330;
          padding-top: 6px;
          margin-top: 6px;
        }
        .temporal-summary-persistent-label {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .temporal-summary-persistent-domains {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .temporal-summary-persistent-domain {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #8a96b2;
        }
        .temporal-summary-persistent-note {
          font-size: 10px;
          color: #7a8aaa;
          margin-top: 2px;
        }
        .temporal-summary-divergence {
          font-size: 10px;
          color: #8a96b2;
          margin-top: 4px;
        }
        .temporal-summary-degradation {
          font-size: 10px;
          color: #7a8aaa;
          margin-top: 2px;
        }

        /* ── Integrated investigation flow (5A.6) ─────────────────────────── */
        .temporal-summary-persistent-domain--link {
          cursor: pointer;
          transition: color 0.15s ease;
        }
        .temporal-summary-persistent-domain--link:hover {
          color: #4a9eff;
        }
        .temporal-summary-persistent-domain--link:focus-visible {
          outline: 1px solid #4a9eff;
          outline-offset: 2px;
          border-radius: 2px;
        }
        .blockage-posture-nav {
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid #1e2330;
        }
        .blockage-posture-nav-link {
          font-size: 10px;
          color: #4a9eff;
          cursor: pointer;
          transition: color 0.15s ease;
        }
        .blockage-posture-nav-link:hover {
          color: #6db8ff;
        }
        .blockage-posture-nav-link:focus-visible {
          outline: 1px solid #4a9eff;
          outline-offset: 2px;
          border-radius: 2px;
        }
        .dsp-peer-nav {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid #1e2330;
        }
        .dsp-peer-nav-arrow {
          background: none;
          border: 1px solid #2a2f40;
          border-radius: 3px;
          color: #8a96b2;
          font-size: 11px;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 0;
        }
        .dsp-peer-nav-arrow:hover:not(:disabled) {
          border-color: #4a9eff;
          color: #4a9eff;
        }
        .dsp-peer-nav-arrow:disabled {
          opacity: 0.3;
          cursor: default;
        }
        .dsp-peer-nav-label {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #8a96b2;
        }

        /* ── Domain temporal section (5A.5) ──────────────────────────────── */
        .dsp-temporal-arrow {
          color: #8a96b2;
          font-size: 11px;
          margin: 0 4px;
        }
        .dsp-temporal-level {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          font-weight: 600;
        }
        .dsp-temporal-basis {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #7a8aaa;
        }
        .dsp-temporal-persistence {
          font-size: 10px;
          color: #ff6b6b;
        }

        /* ── DomainPostureCard (BOARDROOM executive synthesis) ─────────── */
        .posture-card {
          background: #12151f;
          border: 1px solid #2a2f40;
          border-left: 3px solid #4a9eff;
          padding: 16px 18px;
          margin-top: 12px;
        }
        .posture-card-header {
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid #1e2330;
        }
        .posture-card-name {
          font-size: 13px;
          font-weight: 600;
          color: #ccd6f6;
          letter-spacing: 0.02em;
        }
        .posture-card-id {
          font-size: 10px;
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
          margin-top: 3px;
        }
        .posture-card-rows {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .posture-card-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 7px 0;
          border-bottom: 1px solid #161a25;
        }
        .posture-card-row:last-child {
          border-bottom: none;
        }
        .posture-card-row-label {
          font-size: 10px;
          color: #8a96b2;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          flex-shrink: 0;
        }
        .posture-card-row-value {
          font-size: 11px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          text-align: right;
        }
        .posture-card-row[data-tone="ok"] .posture-card-row-value { color: #64ffda; }
        .posture-card-row[data-tone="partial"] .posture-card-row-value { color: #ffd700; }
        .posture-card-row[data-tone="gap"] .posture-card-row-value { color: #ff9e4a; }
        .posture-card-row--navigable {
          cursor: pointer;
          transition: background 0.15s ease;
          margin: 0 -10px;
          padding-left: 10px;
          padding-right: 10px;
          border-radius: 2px;
        }
        .posture-card-row--navigable:hover {
          background: rgba(74, 158, 255, 0.06);
        }
        .posture-card-row--navigable:focus-visible {
          outline: 1px solid rgba(74, 158, 255, 0.3);
          outline-offset: -1px;
        }
        .posture-card-row-arrow {
          display: inline-block;
          margin-left: 6px;
          color: #2a2f40;
          font-size: 10px;
          transition: color 0.15s ease, transform 0.15s ease;
        }
        .posture-card-row--navigable:hover .posture-card-row-arrow {
          color: #4a9eff;
          transform: translateX(2px);
        }
        .posture-card-transitions {
          margin-top: 14px;
        }
        .posture-card-transitions-rule {
          height: 1px;
          background: #2a2f40;
          margin-bottom: 10px;
        }
        .posture-card-transition {
          display: block;
          width: 100%;
          background: none;
          border: none;
          padding: 6px 0;
          font-size: 11px;
          color: #8a96b2;
          text-align: left;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          transition: color 0.15s ease;
          cursor: pointer;
        }
        .posture-card-transition:hover {
          color: #4a9eff;
        }
        .posture-card-transition-arrow {
          color: #7a8aaa;
          margin-left: 4px;
          transition: color 0.15s ease;
        }
        .posture-card-transition:hover .posture-card-transition-arrow {
          color: #4a9eff;
        }

        /* ── DomainStructuralDecomposition (DENSE mid-depth) ──────────── */
        .dsd-panel {
          background: #12151f;
          border: 1px solid #2a2f40;
          border-left: 3px solid #4a5570;
          padding: 14px 16px;
          margin-top: 12px;
        }

        /* ── Topology Preview (DENSE + INVESTIGATION) ────────────────── */
        .dense-topology-preview,
        .investigation-topology-preview {
          padding: 12px 0;
          border-top: 1px solid #1e2330;
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
          margin-top: 8px;
        }
        .dense-topology-preview:hover,
        .investigation-topology-preview:hover {
          background: rgba(74, 158, 255, 0.03);
        }
        .dense-topology-preview .topo-graph-wrap,
        .investigation-topology-preview .topo-graph-wrap {
          margin-bottom: 0;
        }
        .dense-topology-preview .topo-graph-heading,
        .investigation-topology-preview .topo-graph-heading {
          font-size: 9px;
          text-align: center;
        }
        .dense-topology-preview .topo-graph-svg,
        .investigation-topology-preview .topo-graph-svg {
          pointer-events: none;
        }
        .dense-topology-hint,
        .investigation-topology-hint {
          text-align: center;
          font-size: 9px;
          color: #7a8aaa;
          letter-spacing: 0.08em;
          margin-top: 4px;
          transition: color 0.2s;
        }
        .dense-topology-preview:hover .dense-topology-hint,
        .investigation-topology-preview:hover .investigation-topology-hint {
          color: #4a9eff;
        }

        .cockpit-impact {
          padding: 18px 0;
          border-bottom: 1px solid #1e2330;
        }
        .cockpit-impact-label,
        .cockpit-action-label {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 10px;
        }
        .cockpit-impact-assessment {
          font-size: 12px;
          color: #9aa4c0;
          line-height: 1.6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .cockpit-impact-flow {
          display: flex;
          align-items: center;
          gap: 0;
          margin-top: 14px;
          padding: 10px 14px;
          background: #12151f;
          border-radius: 4px;
          border: 1px solid #1e2330;
        }
        .cockpit-impact-node {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cockpit-impact-arrow {
          color: #7a8aaa;
          font-size: 14px;
          margin: 0 8px;
        }
        .cockpit-impact-domain {
          font-size: 11px;
          color: #ccd6f6;
          font-weight: 500;
        }
        .cockpit-impact-role {
          font-size: 9px;
          color: #7a8aaa;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .cockpit-action {
          padding: 18px 0;
        }
        .cockpit-action-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cockpit-action-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .cockpit-action-marker {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4a9eff;
          flex-shrink: 0;
          margin-top: 5px;
        }
        .cockpit-action-text {
          font-size: 12px;
          color: #9aa4c0;
          line-height: 1.5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .cockpit-footer {
          font-size: 10px;
          color: #3a4560;
          font-style: italic;
          padding-top: 12px;
          border-top: 1px solid #12151f;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ── Qualifier Mandate ───────────────────────────────────────────── */
        .qualifier-mandate {
          display: flex;
          align-items: flex-start;
          gap: 28px;
          padding: 20px 56px;
          background: rgba(230,184,0,0.05);
          border-top: 1px solid rgba(230,184,0,0.16);
          border-bottom: 1px solid rgba(230,184,0,0.16);
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

        /* ── Qualifier Narrative (inline) ────────────────────────────────── */
        .qualifier-narrative {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px 56px;
          border-bottom: 1px solid #1a2030;
        }
        .qualifier-narrative-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(230,184,0,0.6);
          flex-shrink: 0;
          margin-top: 6px;
        }
        .qualifier-narrative-text {
          font-size: 12.5px;
          color: rgba(230,184,0,0.65);
          line-height: 1.55;
          font-style: italic;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ── Intelligence Field — three-column operational surface ───────── */
        .intelligence-field {
          display: grid;
          grid-template-columns: minmax(260px, 0.85fr) minmax(0, 2.2fr) minmax(280px, 0.8fr);
          border-bottom: 1px solid #1a2030;
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
          position: sticky;
          top: 73px;
          align-self: start;
          max-height: calc(100vh - 73px);
          overflow-y: auto;
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
          color: #8a96b2;
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
          color: #8a96b2;
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
        .intel-interp[data-tone="projection"] .interp-tag-label { color: #8a96b2; }
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
        .interp-synthesis {
          font-size: 12px;
          color: #ccd6f6;
          line-height: 1.6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .intel-interp[data-tone="projection"] .interp-synthesis {
          font-size: 13px;
          line-height: 1.55;
          color: #e8edf8;
        }
        .interp-synthesis-meta {
          font-size: 10px;
          color: #8a96b2;
          margin-top: 4px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ── DENSE Zone-Focused Interpretation ──────────────── */
        .intel-interp--zone-active {
          transition: opacity 0.2s ease;
        }
        .interp-zone-focus {
          display: flex;
          flex-direction: column;
          gap: 10px;
          animation: interpZoneIn 0.2s ease;
        }
        @keyframes interpZoneIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .interp-zone-badge {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .interp-zone-badge-code {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 18px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.05em;
          font-family: 'Courier New', monospace;
          color: #ccd6f6;
          background: rgba(74, 158, 255, 0.12);
          border: 1px solid rgba(74, 158, 255, 0.2);
          border-radius: 2px;
        }
        .interp-zone-badge-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #8a96b2;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .interp-zone-heading {
          font-size: 12px;
          font-weight: 600;
          color: #ccd6f6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.4;
        }
        .interp-zone-body {
          font-size: 12px;
          line-height: 1.65;
          color: #a0aac4;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .interp-zone-structural {
          font-size: 10px;
          color: #8a96b2;
          font-family: 'Courier New', monospace;
          padding: 6px 8px;
          background: rgba(10, 12, 18, 0.4);
          border-left: 2px solid #2a2f40;
          border-radius: 0 2px 2px 0;
        }
        /* ── Signal attribution in zone interpretation (5A.8.9) ── */
        .interp-zone-signals {
          margin-top: 4px;
          padding-top: 8px;
          border-top: 1px solid #1e2330;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .interp-zone-signals-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #7a8aaa;
          margin-bottom: 2px;
        }
        .interp-zone-signal {
          display: flex;
          align-items: baseline;
          gap: 8px;
          font-size: 10px;
          line-height: 1.5;
        }
        .interp-zone-signal-severity {
          font-size: 9px;
          font-weight: 600;
          font-family: 'Courier New', monospace;
          color: #8a96b2;
          flex-shrink: 0;
          min-width: 52px;
        }
        .interp-zone-signal[data-severity="CRITICAL"] .interp-zone-signal-severity,
        .interp-zone-signal[data-severity="HIGH"] .interp-zone-signal-severity {
          color: #ff6b6b;
        }
        .interp-zone-signal[data-severity="ELEVATED"] .interp-zone-signal-severity {
          color: #ff9e4a;
        }
        .interp-zone-signal-text {
          color: #8a96b2;
          font-size: 10px;
          line-height: 1.5;
        }
        .interp-zone-signal--compound .interp-zone-signal-text {
          color: #6a7590;
          font-style: italic;
          font-size: 10px;
        }

        .interp-context-secondary {
          margin-top: 12px;
          border-top: 1px solid #1e2330;
          padding-top: 8px;
        }
        .interp-context-secondary-toggle {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #7a8aaa;
          cursor: pointer;
          padding: 4px 0;
          list-style: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          transition: color 0.15s ease;
        }
        .interp-context-secondary-toggle:hover {
          color: #8a96b2;
        }
        .interp-context-secondary-toggle::-webkit-details-marker { display: none; }
        .interp-context-secondary-toggle::marker { content: ''; }
        .interp-context-secondary[open] .interp-context-secondary-toggle {
          color: #8a96b2;
          margin-bottom: 8px;
        }
        .interp-context-secondary .interp-block {
          opacity: 0.7;
        }

        /* ── BALANCED — Narrative-First Vertical Layout ──────────────── */
        .intelligence-field--narrative-first {
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid #1a2030;
        }
        .intelligence-field--narrative-first .intel-interp {
          padding: 48px 56px 36px;
          border-right: none;
          border-bottom: 1px solid #1a2030;
          background: rgba(8, 10, 15, 0.32);
        }
        .intelligence-field--narrative-first .interp-summary {
          font-size: 14px;
          line-height: 1.65;
          max-width: 820px;
        }
        .intelligence-field--narrative-first .interp-why {
          max-width: 780px;
        }
        .intelligence-field--narrative-first .interp-structural {
          max-width: 780px;
        }

        .balanced-indicators {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid #1a2030;
        }
        .balanced-indicator {
          padding: 24px 56px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .balanced-indicator--dp {
          border-right: 1px solid #1a2030;
        }
        .balanced-indicator-tag {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .balanced-indicator-state {
          font-size: 15px;
          font-weight: 600;
          color: var(--state-color);
          letter-spacing: -0.005em;
          line-height: 1.3;
        }
        .balanced-indicator-qualifier {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 2px;
        }
        .balanced-indicator-qualifier-class {
          font-size: 11px;
          font-weight: 600;
          color: #e6b800;
          letter-spacing: 0.04em;
        }
        .balanced-indicator-qualifier-note {
          font-size: 9px;
          color: #6a7593;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .balanced-indicator-anchor {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .balanced-indicator-anchor[data-tier="HIGH"]     { --tier-color: #ff6b6b; }
        .balanced-indicator-anchor[data-tier="ELEVATED"] { --tier-color: #ff9e4a; }
        .balanced-indicator-anchor[data-tier="MODERATE"] { --tier-color: #ffd700; }
        .balanced-indicator-anchor[data-tier="LOW"]      { --tier-color: #64ffda; }

        .signal-narrative {
          padding: 28px 56px 24px;
          border-bottom: 1px solid #1a2030;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .signal-narrative-label {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .signal-narrative-lead {
          font-size: 13px;
          color: #ccd6f6;
          line-height: 1.6;
          font-weight: 500;
          max-width: 780px;
        }
        .signal-narrative-findings {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 780px;
        }
        .signal-narrative-finding {
          padding-left: 14px;
          border-left: 2px solid rgba(255, 158, 74, 0.35);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .signal-narrative-finding--nominal {
          border-left-color: rgba(100, 255, 218, 0.25);
        }
        .signal-narrative-finding-text {
          font-size: 12px;
          color: #b6bdd6;
          line-height: 1.6;
        }
        .signal-narrative-finding-where {
          font-size: 11px;
          color: #8a96b2;
          line-height: 1.5;
        }
        .signal-narrative-compound {
          font-size: 12px;
          color: #9aa0bc;
          line-height: 1.6;
          max-width: 780px;
        }
        .signal-narrative-confidence {
          font-size: 11px;
          color: #8a96b2;
          line-height: 1.5;
          font-style: italic;
        }

        /* Dense Signal Assessment (CTO register) */
        .actor--signal-assessment {
          margin-top: 12px;
        }
        .dense-signal-entry {
          padding: 10px 0;
          border-bottom: 1px solid #1a1e2b;
        }
        .dense-signal-entry:last-of-type {
          border-bottom: none;
        }
        .dense-signal-header {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 4px;
        }
        .dense-signal-name {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #ccd6f6;
          font-weight: 600;
        }
        .dense-signal-badge {
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 1px 6px;
          border-radius: 2px;
          border: 1px solid;
          font-weight: 500;
        }
        .dense-signal-badge[data-severity="CRITICAL"] { color: #ff6b6b; background: rgba(255, 107, 107, 0.08); border-color: rgba(255, 107, 107, 0.2); }
        .dense-signal-badge[data-severity="HIGH"] { color: #ff6b6b; background: rgba(255, 107, 107, 0.08); border-color: rgba(255, 107, 107, 0.2); }
        .dense-signal-badge[data-severity="ELEVATED"] { color: #ff9e4a; background: rgba(255, 158, 74, 0.08); border-color: rgba(255, 158, 74, 0.2); }
        .dense-signal-badge[data-severity="MODERATE"] { color: #ffd700; background: rgba(255, 215, 0, 0.08); border-color: rgba(255, 215, 0, 0.2); }
        .dense-signal-badge[data-severity="NOMINAL"] { color: #64ffda; background: rgba(100, 255, 218, 0.08); border-color: rgba(100, 255, 218, 0.2); }
        .dense-signal-val {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #8a96b2;
          letter-spacing: 0.02em;
        }
        .dense-signal-prose {
          font-size: 12px;
          color: #a0adc6;
          line-height: 1.55;
          padding-left: 2px;
        }
        .dense-signal-where {
          font-size: 11px;
          color: #7a8aaa;
          line-height: 1.45;
          margin-top: 3px;
          padding-left: 2px;
        }
        .dense-signal-compound {
          font-size: 11px;
          color: #8a96b2;
          line-height: 1.5;
          margin-top: 8px;
          padding: 8px 10px;
          border-left: 2px solid rgba(255, 158, 74, 0.3);
          font-style: italic;
        }
        .dense-signal-confidence {
          font-size: 10px;
          color: #7a8aaa;
          line-height: 1.45;
          margin-top: 6px;
          font-style: italic;
        }

        .actor--propagation-flow {
          margin-top: 12px;
          padding: 20px 0 8px;
          border-top: 1px solid #1a2030;
        }
        .propagation-flow-strip {
          display: flex;
          align-items: stretch;
          gap: 0;
          margin-top: 14px;
        }
        .propagation-flow-node {
          display: flex;
          align-items: center;
          gap: 0;
          flex: 1;
          min-width: 0;
        }
        .propagation-flow-arrow {
          font-size: 18px;
          color: #7a8aaa;
          padding: 0 8px;
          flex-shrink: 0;
          line-height: 1;
        }
        .propagation-flow-card {
          background: #12151f;
          border: 1px solid #1e2330;
          border-radius: 4px;
          padding: 12px 14px;
          flex: 1;
          min-width: 0;
        }
        .propagation-flow-role {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8a96b2;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .propagation-flow-domain {
          font-size: 12px;
          color: #ccd6f6;
          font-weight: 500;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .propagation-flow-pressure {
          font-size: 10px;
          color: #8a96b2;
          margin-bottom: 4px;
        }
        .propagation-flow-backing {
          font-size: 9px;
          color: #7a8aaa;
        }
        .propagation-flow-backing--grounded {
          color: #64ffda;
        }
        .propagation-flow-narrative {
          font-size: 10px;
          color: #7a8aaa;
          margin-top: 10px;
          font-style: italic;
          line-height: 1.5;
        }
        [data-tier="HIGH"] .propagation-flow-card,
        [data-tier="CRITICAL"] .propagation-flow-card {
          border-color: rgba(255, 107, 107, 0.2);
        }
        [data-tier="ELEVATED"] .propagation-flow-card {
          border-color: rgba(255, 158, 74, 0.2);
        }
        [data-tier="MODERATE"] .propagation-flow-card {
          border-color: rgba(255, 215, 0, 0.15);
        }

        .evidence-boundary {
          padding: 32px 56px 28px;
          border-bottom: 1px solid #1a2030;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .evidence-boundary-label {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .evidence-boundary-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0;
          align-items: stretch;
        }
        .evidence-boundary-col {
          padding: 20px 28px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .evidence-boundary-col--confirmed {
          background: rgba(100, 255, 218, 0.04);
          border: 1px solid rgba(100, 255, 218, 0.12);
          border-radius: 4px 0 0 4px;
        }
        .evidence-boundary-col--unknown {
          background: rgba(122, 138, 170, 0.04);
          border: 1px solid rgba(122, 138, 170, 0.12);
          border-radius: 0 4px 4px 0;
        }
        .evidence-boundary-divider {
          width: 1px;
          background: #2a2f40;
        }
        .evidence-boundary-heading {
          font-size: 10px;
          color: #8a96b2;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .evidence-boundary-col--confirmed .evidence-boundary-heading { color: #64ffda; }
        .evidence-boundary-col--unknown .evidence-boundary-heading { color: #8a96b2; }
        .evidence-boundary-count {
          font-size: 28px;
          font-weight: 600;
          color: #ccd6f6;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .evidence-boundary-col--confirmed .evidence-boundary-count { color: #64ffda; }
        .evidence-boundary-detail {
          font-size: 11px;
          color: #9aa0bc;
          line-height: 1.4;
        }
        .evidence-boundary-meta {
          font-size: 10px;
          color: #8a96b2;
          line-height: 1.4;
        }
        .evidence-boundary-note {
          font-size: 11px;
          color: #8a96b2;
          font-style: italic;
          letter-spacing: 0.01em;
          line-height: 1.5;
          padding-left: 14px;
          border-left: 2px solid rgba(122, 138, 170, 0.25);
        }

        .structural-conclusion {
          padding: 28px 56px 36px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .structural-conclusion-rule {
          height: 1px;
          background: linear-gradient(90deg, rgba(74, 158, 255, 0.2) 0%, rgba(74, 158, 255, 0.06) 60%, transparent 100%);
        }
        .structural-conclusion-text {
          font-size: 13px;
          color: #9aa0bc;
          line-height: 1.6;
          letter-spacing: 0.005em;
          max-width: 780px;
          font-style: italic;
        }

        /* Pressure Zone Focus Block */
        .pressure-zone-focus {
          padding: 24px 56px 20px;
          border-bottom: 1px solid #1a2030;
          border-left: 3px solid rgba(255, 158, 74, 0.35);
          margin-left: 56px;
          margin-right: 56px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pressure-zone-focus[data-tier="HIGH"] { border-left-color: rgba(255, 107, 107, 0.5); }
        .pressure-zone-focus[data-tier="ELEVATED"] { border-left-color: rgba(255, 158, 74, 0.45); }
        .pressure-zone-focus[data-tier="NOMINAL"] { border-left-color: rgba(100, 255, 218, 0.3); }
        .pressure-zone-focus-label {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .pressure-zone-focus-name {
          font-size: 15px;
          font-weight: 600;
          color: #ccd6f6;
          letter-spacing: -0.005em;
        }
        .pressure-zone-focus-classification {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          color: #8a96b2;
        }
        .pressure-zone-focus-class-tag {
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9aa0bc;
        }
        .pressure-zone-focus-class-sep { color: #2a2f40; }
        .pressure-zone-focus-class-count { color: #8a96b2; }
        .pressure-zone-focus-narrative {
          font-size: 12px;
          color: #9aa0bc;
          line-height: 1.6;
          max-width: 780px;
          margin-top: 4px;
        }

        /* Tier Handoff Statement */
        .tier-handoff {
          padding: 20px 56px 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .tier-handoff-rule {
          height: 1px;
          background: linear-gradient(90deg, rgba(42, 47, 64, 0.5) 0%, rgba(42, 47, 64, 0.15) 60%, transparent 100%);
        }
        .tier-handoff-text {
          font-size: 10px;
          color: #7a8aaa;
          line-height: 1.6;
          letter-spacing: 0.02em;
          max-width: 680px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Cockpit Evidence Boundary (compact, BOARDROOM) */
        .cockpit-evidence-boundary {
          padding: 16px 24px;
          border-top: 1px solid #1a2030;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cockpit-evidence-boundary-label {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .cockpit-evidence-boundary-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
        }
        .cockpit-evidence-boundary-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #b6bdd6;
        }
        .cockpit-evidence-boundary-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .cockpit-evidence-boundary-dot--backed { background: #64ffda; }
        .cockpit-evidence-boundary-dot--advisory { background: #7a8aaa; }
        .cockpit-evidence-boundary-sep { color: #2a2f40; }
        .cockpit-evidence-boundary-note {
          font-size: 10px;
          color: #8a96b2;
          font-style: italic;
          line-height: 1.4;
        }

        /* BALANCED Narrative Emergence (5B.2 — interpretive surfaces) */
        .balanced-narrative {
          margin: 20px 0;
          padding: 16px 20px;
          background: rgba(74, 158, 255, 0.03);
          border-left: 2px solid rgba(74, 158, 255, 0.15);
          border-radius: 0 4px 4px 0;
          transition: opacity 0.15s ease;
        }
        .balanced-narrative[data-emergence="PRIMARY"] {
          border-left-width: 3px;
          border-left-color: rgba(74, 158, 255, 0.25);
          padding: 20px 24px;
          margin: 28px 0;
          background: rgba(74, 158, 255, 0.04);
        }
        .balanced-narrative[data-emergence="SECONDARY"] {
          background: transparent;
          border-left-color: rgba(74, 158, 255, 0.12);
          padding: 14px 20px;
          margin: 16px 0;
        }
        .balanced-narrative[data-emergence="TERTIARY"] {
          background: transparent;
          border-left-color: rgba(74, 158, 255, 0.04);
          border-left-width: 1px;
          padding: 8px 20px;
          margin: 8px 0;
        }
        .balanced-narrative-marker {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 10px;
        }
        .balanced-narrative-subordinate-marker {
          font-size: 9.5px;
          color: #7a8aaa;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
          font-family: 'Courier New', monospace;
        }

        /* Layer 1 — Executive Observation (full visibility, highest intensity) */
        .balanced-narrative-layer1 {
          font-size: 12.5px;
          color: #ccd6f6;
          line-height: 1.7;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          max-width: 640px;
        }
        .balanced-narrative[data-emergence="PRIMARY"] .balanced-narrative-layer1 {
          font-size: 13px;
          line-height: 1.75;
          color: #d6dceb;
        }
        .balanced-narrative[data-emergence="SECONDARY"] .balanced-narrative-layer1 {
          font-size: 12px;
          line-height: 1.6;
          color: #9aa8c4;
        }
        .balanced-narrative[data-emergence="SECONDARY"] .balanced-narrative-layer2 {
          color: #7a8aaa;
          font-size: 10px;
        }
        .balanced-narrative[data-emergence="TERTIARY"] .balanced-narrative-layer1 {
          font-size: 11.5px;
          line-height: 1.5;
          color: #8a96b2;
        }
        .balanced-narrative[data-emergence="TERTIARY"] .balanced-narrative-subordinate-marker {
          font-size: 9px;
          color: #4a5570;
        }

        /* Layer 2 — Structural Basis (visible but receding — lower intensity) */
        .balanced-narrative-layer2 {
          margin-top: 8px;
          font-size: 10.5px;
          color: #5a6a88;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.02em;
          line-height: 1.5;
        }

        /* Layer 3 — Evidence Lineage (collapsed by default — constitutional grounding anchors) */
        .balanced-narrative-layer3 {
          margin-top: 10px;
        }
        .balanced-narrative-trace-toggle {
          font-size: 9.5px;
          color: #7a8aaa;
          letter-spacing: 0.08em;
          cursor: pointer;
          font-family: 'Courier New', monospace;
          list-style: none;
          user-select: none;
          transition: color 0.15s ease;
        }
        .balanced-narrative-trace-toggle::-webkit-details-marker { display: none; }
        .balanced-narrative-trace-toggle::before {
          content: '▸ ';
          font-size: 8px;
          color: #3a4560;
          transition: transform 0.15s ease;
          display: inline-block;
        }
        .balanced-narrative-layer3[open] .balanced-narrative-trace-toggle::before {
          content: '▾ ';
        }
        .balanced-narrative-trace-toggle:hover {
          color: #8a96b2;
        }
        .balanced-narrative-trace-body {
          margin-top: 8px;
          padding-left: 10px;
          border-left: 1px solid rgba(74, 158, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .balanced-narrative-anchor {
          display: flex;
          align-items: baseline;
          gap: 10px;
          font-size: 10px;
          font-family: 'Courier New', monospace;
          color: #7a8aaa;
        }
        .balanced-narrative-anchor[data-severity="CRITICAL"] .balanced-narrative-anchor-source { color: #ff6b6b; }
        .balanced-narrative-anchor[data-severity="ELEVATED"] .balanced-narrative-anchor-source { color: #ff9e4a; }
        .balanced-narrative-anchor[data-severity="NOMINAL"] .balanced-narrative-anchor-source { color: #64ffda; }
        .balanced-narrative-anchor-source {
          flex-shrink: 0;
          color: #4a5570;
          min-width: 140px;
        }
        .balanced-narrative-anchor-claim {
          color: #7a8aaa;
        }

        /* Intelligence Emergence Index (SupportRail) */
        .support-block--emergence {
          border-top: 1px solid #1a2030;
        }
        .emergence-index {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 8px;
        }
        .emergence-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          color: #7a8aaa;
          transition: color 0.15s ease;
        }
        .emergence-indicator[data-active="true"] {
          color: #8a96b2;
        }
        .emergence-indicator-dot {
          font-size: 8px;
          width: 12px;
          text-align: center;
          flex-shrink: 0;
        }
        .emergence-indicator[data-active="true"] .emergence-indicator-dot {
          color: #4a9eff;
        }
        .emergence-indicator-label {
          letter-spacing: 0.01em;
        }
        .emergence-indicator[data-tier="TERTIARY"] {
          font-size: 9.5px;
          color: #4a5570;
        }
        .emergence-indicator[data-tier="TERTIARY"][data-active="true"] {
          color: #5a6a88;
        }
        .emergence-indicator[data-tier="TERTIARY"][data-active="true"] .emergence-indicator-dot {
          color: rgba(74, 158, 255, 0.5);
        }

        /* Left column interpretive markers (BALANCED) */
        .intel-interp--balanced-interpretive .interp-75x-marker {
          font-size: 8px;
          color: #8a96b2;
          letter-spacing: 0.12em;
          padding: 1px 5px;
          border: 1px solid #2a2f40;
          border-radius: 2px;
          margin-left: 8px;
          vertical-align: middle;
        }
        .interp-block--interpretive {
          border-left: 2px solid rgba(74, 158, 255, 0.15);
          padding-left: 10px;
          margin-left: -10px;
        }
        .interp-section-label--emerged {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .interp-synthesis--emerged {
          font-size: 10.5px;
          color: #8a96b2;
          line-height: 1.5;
        }
        .interp-block--tertiary {
          border-left-color: rgba(74, 158, 255, 0.06);
          border-left-width: 1px;
        }
        .interp-block--tertiary .interp-section-label--emerged {
          font-size: 9px;
          color: #4a5570;
        }
        .interp-block--tertiary .interp-synthesis--emerged {
          font-size: 10px;
          color: #5a6a88;
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
          position: sticky;
          top: 73px;
          align-self: start;
          max-height: calc(100vh - 73px);
          overflow-y: auto;
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
          color: #8a96b2;
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
          color: #8a96b2;
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

        /* ── Available Executive Paths (SupportRail, BOARDROOM) ───────── */
        .support-block--paths {
          border-top: 1px solid #1e2330;
        }
        .support-paths-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .support-path-item {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 5px 0;
        }
        .support-path-marker {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #4a5570;
          flex-shrink: 0;
          margin-top: 5px;
        }
        .support-path-text {
          font-size: 11px;
          color: #8a96b2;
          line-height: 1.45;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ── DENSE Zone-Contextual Traversal Paths ──────────────── */
        .support-block--zone-paths {
          border-top: 1px solid #1e2330;
          animation: supportZoneIn 0.2s ease;
        }
        .support-block--zone-paths .support-paths-list {
          max-height: 280px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #2a2f40 transparent;
        }
        @keyframes supportZoneIn {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .support-zone-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .support-zone-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 16px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.05em;
          font-family: 'Courier New', monospace;
          color: #ccd6f6;
          background: rgba(74, 158, 255, 0.12);
          border: 1px solid rgba(74, 158, 255, 0.2);
          border-radius: 2px;
        }
        .support-path-item--zone {
          cursor: pointer;
          padding: 6px 8px;
          margin: 0 -8px;
          border-radius: 2px;
          transition: background 0.15s ease;
        }
        .support-path-item--zone:hover {
          background: rgba(74, 158, 255, 0.06);
        }
        .support-path-icon {
          font-size: 10px;
          color: #7a8aaa;
          flex-shrink: 0;
          width: 14px;
          text-align: center;
          transition: color 0.15s ease;
        }
        .support-path-item--zone:hover .support-path-icon {
          color: #4a9eff;
        }
        .support-path-item--zone:hover .support-path-text {
          color: #ccd6f6;
        }

        /* ── Narrative Affordance Overlay (5A.8.10) ── */
        .support-path-item--zone {
          position: relative;
          flex-wrap: wrap;
        }
        .path-narrative-overlay {
          display: none;
          width: 100%;
          margin-top: 6px;
          padding: 10px;
          background: #12151f;
          border: 1px solid #2a2f40;
          border-radius: 3px;
        }
        .support-path-item--zone:hover .path-narrative-overlay {
          display: block;
          animation: narrativeIn 0.2s ease;
        }
        @keyframes narrativeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .path-narrative-text {
          font-size: 11px;
          line-height: 1.6;
          color: #a0aac4;
          margin-bottom: 8px;
        }
        .path-narrative-question {
          display: flex;
          flex-direction: column;
          gap: 3px;
          margin-bottom: 8px;
        }
        .path-narrative-question-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #4a9eff;
        }
        .path-narrative-question-text {
          font-size: 11px;
          line-height: 1.5;
          color: #ccd6f6;
          font-style: italic;
        }
        .path-narrative-boundary {
          font-size: 10px;
          line-height: 1.5;
          color: #8a96b2;
          font-family: 'Courier New', monospace;
          padding: 5px 7px;
          background: rgba(10, 12, 18, 0.5);
          border-left: 2px solid #2a2f40;
        }

        /* ── Guided Query Chips (5B.1.1) ── */
        .support-path-item--zone[aria-pressed="true"] {
          background: rgba(74, 158, 255, 0.1);
          border-left: 2px solid #4a9eff;
          padding-left: 6px;
        }
        .support-path-item--zone[aria-pressed="true"] .support-path-icon {
          color: #4a9eff;
        }
        .support-path-item--zone[aria-pressed="true"] .support-path-text {
          color: #ccd6f6;
        }
        .support-path-item--zone:focus-visible {
          outline: 1px solid rgba(74, 158, 255, 0.4);
          outline-offset: 1px;
        }
        .support-path-item--zone[data-explored="true"] .support-path-icon {
          color: #3a4560;
        }
        .support-path-item--zone[data-explored="true"]:not([aria-pressed="true"]) .support-path-text {
          color: #8a96b2;
        }

        /* ── Zone Query Separator & Tonal Styling ── */
        .zone-paths-separator {
          height: 1px;
          background: #2a2f40;
          margin: 4px 0;
          opacity: 0.6;
        }
        .support-path-item--zone[data-tone="alarming"] {
          border-left: 2px solid rgba(255, 107, 107, 0.35);
          padding-left: 6px;
        }
        .support-path-item--zone[data-tone="quiet"] {
          opacity: 0.75;
        }
        .support-path-item--zone[data-tone="quiet"]:hover {
          opacity: 1;
        }

        /* ── Answer Panel (5B.1.3) ── */
        .intel-interp--query-active {
          animation: narrativeIn 0.2s ease;
        }
        .query-answer-panel {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .query-answer-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .query-answer-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #4a9eff;
          padding: 2px 6px;
          background: rgba(74, 158, 255, 0.1);
          border: 1px solid rgba(74, 158, 255, 0.2);
          border-radius: 2px;
          flex-shrink: 0;
        }
        .query-answer-header-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #7a8aaa;
        }
        .query-answer-dismiss {
          margin-left: auto;
          background: none;
          border: 1px solid #2a2f40;
          color: #8a96b2;
          font-size: 11px;
          width: 22px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease;
          flex-shrink: 0;
        }
        .query-answer-dismiss:hover {
          border-color: #7a8aaa;
          color: #ccd6f6;
        }
        .query-answer-question {
          font-size: 12px;
          line-height: 1.55;
          color: #ccd6f6;
          font-style: italic;
          padding-left: 10px;
          border-left: 2px solid rgba(74, 158, 255, 0.3);
        }
        .query-answer-summary {
          font-size: 11px;
          line-height: 1.65;
          color: #b8c2da;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .query-answer-evidence {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 8px 0;
          border-top: 1px solid #1e2330;
          border-bottom: 1px solid #1e2330;
        }
        .query-answer-evidence-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          padding: 2px 0;
        }
        .query-answer-evidence-label {
          font-size: 10px;
          color: #8a96b2;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .query-answer-evidence-value {
          font-size: 10px;
          font-family: 'Courier New', monospace;
          color: #a0adc6;
          text-align: right;
        }
        .query-answer-evidence-row[data-severity="critical"] .query-answer-evidence-value {
          color: #ff6b6b;
        }
        .query-answer-evidence-row[data-severity="elevated"] .query-answer-evidence-value {
          color: #ff9e4a;
        }
        .query-answer-evidence-row[data-severity="nominal"] .query-answer-evidence-value {
          color: #64ffda;
        }
        .query-answer-context {
          font-size: 10px;
          line-height: 1.5;
          color: #8a96b2;
          font-family: 'Courier New', monospace;
          padding: 6px 8px;
          background: rgba(10, 12, 18, 0.5);
          border-left: 2px solid #2a2f40;
        }
        .query-answer-boundary {
          font-size: 10px;
          line-height: 1.5;
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
          padding: 5px 7px;
          background: rgba(10, 12, 18, 0.3);
          border-left: 2px solid rgba(100, 255, 218, 0.15);
        }

        /* ── MICRO depth panel ── */
        .query-answer-panel--micro {
          gap: 8px;
        }
        .query-answer-panel--micro .query-answer-summary {
          font-size: 11px;
          line-height: 1.5;
        }
        .query-answer-evidence-inline {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 4px 0;
        }
        .query-answer-evidence-chip {
          font-size: 10px;
          font-family: 'Courier New', monospace;
          color: #8a95b0;
          padding: 2px 6px;
          background: rgba(10, 12, 18, 0.4);
          border: 1px solid #1e2330;
          border-radius: 2px;
        }
        .query-answer-evidence-chip[data-severity="critical"] {
          color: #ff6b6b;
          border-color: rgba(255, 107, 107, 0.2);
        }
        .query-answer-evidence-chip[data-severity="elevated"] {
          color: #ff9e4a;
          border-color: rgba(255, 158, 74, 0.2);
        }
        .query-answer-evidence-chip[data-severity="nominal"] {
          color: #64ffda;
          border-color: rgba(100, 255, 218, 0.15);
        }

        /* ── DEEP depth panel ── */
        .query-answer-panel--deep {
          gap: 14px;
        }
        .query-answer-panel--deep .query-answer-question {
          border-left-width: 3px;
        }
        .query-answer-panel--deep .query-answer-summary {
          line-height: 1.7;
        }
        .query-answer-panel--deep .query-answer-context {
          padding: 8px 10px;
        }

        /* ── Structural Depth / Expansion panels ── */
        .query-answer-panel--expansion {
          gap: 12px;
          border-left: 2px solid rgba(74, 158, 255, 0.3);
        }
        .expansion-authority-marker {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: 0.5px;
          color: #4a9eff;
          background: rgba(74, 158, 255, 0.08);
          padding: 1px 6px;
          border-radius: 2px;
          margin-left: auto;
          margin-right: 8px;
        }
        .expansion-governance-footer {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: 0.5px;
          color: #4a5570;
          padding-top: 8px;
          border-top: 1px solid #1e2330;
          margin-top: 4px;
        }

        /* ── Structural Depth Indicator (SupportRail) ── */
        .support-block--structural-depth {
          border-color: #1e2330;
        }
        .support-block--depth-active {
          border-color: rgba(74, 158, 255, 0.15);
        }
        .structural-depth-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          background: none;
          border: 1px solid #2a2f40;
          border-radius: 3px;
          padding: 8px 10px;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .structural-depth-indicator:hover {
          border-color: rgba(74, 158, 255, 0.3);
          background: rgba(74, 158, 255, 0.04);
        }
        .structural-depth-glyph {
          font-size: 12px;
          color: #4a9eff;
          opacity: 0.7;
        }
        .structural-depth-glyph--active {
          opacity: 1;
        }
        .structural-depth-label {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          letter-spacing: 0.8px;
          color: #7a8aaa;
        }
        .structural-depth-active-state {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .structural-depth-active-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .structural-depth-dismiss {
          background: none;
          border: none;
          color: #4a5570;
          cursor: pointer;
          font-size: 12px;
          padding: 0 2px;
          margin-left: auto;
          transition: color 0.15s ease;
        }
        .structural-depth-dismiss:hover {
          color: #7a8aaa;
        }
        .expansion-chips-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .expansion-chip {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          padding: 6px 8px;
          border-radius: 3px;
          cursor: pointer;
          transition: background 0.15s ease;
          border: 1px solid transparent;
        }
        .expansion-chip:hover {
          background: rgba(74, 158, 255, 0.04);
          border-color: rgba(74, 158, 255, 0.12);
        }
        .expansion-chip[aria-pressed="true"] {
          background: rgba(74, 158, 255, 0.08);
          border-color: rgba(74, 158, 255, 0.2);
        }
        .expansion-chip[data-explored="true"] {
          opacity: 0.6;
        }
        .expansion-chip[data-tone="alarming"] {
          border-left: 2px solid rgba(255, 107, 107, 0.3);
        }
        .expansion-chip[data-tone="quiet"] {
          opacity: 0.7;
        }
        .expansion-chip-icon {
          font-size: 10px;
          color: #4a9eff;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .expansion-chip-text {
          font-family: var(--font-ui), system-ui, sans-serif;
          font-size: 11px;
          line-height: 1.45;
          color: #8a96b2;
        }
        .expansion-chip:hover .expansion-chip-text {
          color: #ccd6f6;
        }

        /* ── Depth-escalated intelligence field indicator ── */
        .intelligence-field[data-depth-escalated="true"] {
          border-top: 1px solid rgba(74, 158, 255, 0.08);
        }

        /* ── Evidence Record Export ─── */
        .support-block--trail {
          border-top: 1px solid #2a2f40;
        }
        .trail-export-summary {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 4px;
        }
        .trail-count {
          font-size: 11px;
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
        }
        .trail-export-trigger {
          margin-top: 8px;
          padding: 6px 12px;
          background: transparent;
          border: 1px solid #2a2f40;
          color: #4a9eff;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          letter-spacing: 0.05em;
          cursor: pointer;
          text-transform: uppercase;
          transition: border-color 0.15s ease, color 0.15s ease;
          width: 100%;
          text-align: center;
        }
        .trail-export-trigger:hover {
          border-color: #4a9eff;
          color: #ccd6f6;
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
          display: none;
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
          justify-content: flex-start;
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
          color: #8a96b2;
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
          color: #8a96b2;
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
          color: #8a96b2;
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
          color: #8a96b2;
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
          color: #8a96b2;
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
          align-items: stretch;
          text-align: left;
          gap: 0;
          justify-content: flex-start;
        }
        .rep-field--boardroom .rep-mode-tag {
          align-items: flex-start;
          text-align: left;
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
        /* ── Executive Topology Surface (Phase 3B) ─────────────────────── */
        .topo-executive {
          padding: 20px 40px;
          border-bottom: 1px solid #1a2030;
          background: linear-gradient(180deg, rgba(8,10,15,0.4) 0%, rgba(13,15,20,0.2) 100%);
        }
        .topo-executive--boardroom {
          padding: 24px 0;
          max-width: 720px;
          margin: 0 auto;
          background: none;
          border-bottom: none;
        }
        .topo-executive--boardroom .topo-graph-heading {
          text-align: center;
        }
        .topo-executive-header {
          margin-bottom: 8px;
        }
        .topo-executive-pre {
          font-size: 10px;
          color: #8a96b2;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* Structural Composition stat cards */
        .topo-composition {
          margin-bottom: 14px;
        }
        .topo-composition-summary {
          font-size: 11px;
          color: #d29922;
          line-height: 1.4;
          margin-bottom: 10px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .topo-composition-stats {
          display: flex;
          gap: 8px;
        }
        .topo-stat-card {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #2a2f40;
          border-radius: 3px;
          background: rgba(20,23,32,0.5);
          text-align: center;
        }
        .topo-stat-value {
          font-size: 22px;
          font-weight: 600;
          color: #e0e6f4;
          line-height: 1.1;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
        }
        .topo-stat-label {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* Evidence Card Panel */
        .topo-evidence-panel {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }
        .topo-evidence-card {
          padding: 10px 14px;
          border: 1px solid #2a2f40;
          border-radius: 3px;
          background: rgba(20,23,32,0.5);
          border-top: 2px solid #4a5570;
        }
        .topo-evidence-card[data-tier="HIGH"]     { border-top-color: #ff6b6b; }
        .topo-evidence-card[data-tier="ELEVATED"] { border-top-color: #ff9e4a; }
        .topo-evidence-card[data-tier="MODERATE"] { border-top-color: #ffd700; }
        .topo-evidence-card[data-tier="LOW"]      { border-top-color: #64ffda; }
        .topo-evidence-card-role {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .topo-evidence-card-name {
          font-size: 12px;
          font-weight: 600;
          color: #ccd6f6;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          margin-bottom: 4px;
        }
        .topo-evidence-card-ground {
          font-size: 10px;
          color: #64ffda;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          margin-bottom: 6px;
        }
        .topo-evidence-card-signal {
          font-size: 10px;
          color: #8a96b2;
          margin-bottom: 4px;
        }
        .topo-evidence-card-text {
          font-size: 10px;
          color: #7a8aaa;
          line-height: 1.4;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .topo-executive--boardroom .topo-evidence-panel { display: none; }

        /* Topology Graph SVG */
        .topo-graph-wrap {
          margin-bottom: 14px;
        }
        .topo-graph-heading {
          font-size: 10px;
          color: #8a96b2;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .topo-graph-svg {
          width: 100%;
          height: auto;
          display: block;
        }
        .topo-executive--boardroom .topo-graph-wrap { margin-bottom: 12px; }

        /* Domain Coverage Grid */
        .topo-coverage {
          margin-top: 4px;
        }
        .topo-coverage-heading {
          font-size: 10px;
          color: #8a96b2;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .topo-coverage-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
        }
        .topo-coverage-card {
          padding: 8px 10px;
          border: 1px solid #2a2f40;
          border-radius: 3px;
          background: rgba(20,23,32,0.4);
          transition: border-color 0.15s ease;
        }
        .topo-coverage-card:hover { border-color: #3a4560; }
        .topo-coverage-card--focused {
          border-color: #4a9eff;
          background: rgba(74, 158, 255, 0.06);
          box-shadow: 0 0 0 1px rgba(74, 158, 255, 0.2);
        }
        .topo-coverage-card--backed { border-left: 2px solid rgba(100,255,218,0.35); }
        .topo-coverage-card--pz { border-left: 2px solid rgba(255,215,0,0.45); }
        .topo-coverage-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .topo-coverage-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          display: inline-block;
        }
        .topo-coverage-card-name {
          font-size: 11px;
          font-weight: 600;
          color: #ccd6f6;
          line-height: 1.2;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
        }
        .topo-coverage-card-meta {
          font-size: 9px;
          color: #7a8aaa;
          margin-bottom: 2px;
        }
        .topo-coverage-card-lineage {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
        }
        .topo-coverage-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid #1e2330;
        }
        .topo-coverage-legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 9px;
          color: #6a7593;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* BOARDROOM: show composition + graph, hide coverage grid */
        .topo-executive--boardroom .topo-coverage { display: none; }

        /* ── SQO Intelligence Zone — qualification narrative ────────── */
        .sqo-intelligence {
          padding: 20px 56px 18px;
          border-bottom: 1px solid #1a2030;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sqo-compact-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 6px 0;
          user-select: none;
        }
        .sqo-compact-state {
          font-size: 12px;
          font-weight: 700;
          color: var(--state-color, #4a9eff);
          letter-spacing: 0.06em;
          padding: 2px 7px;
          background: rgba(74, 158, 255, 0.08);
          border: 1px solid rgba(74, 158, 255, 0.2);
          border-radius: 3px;
          flex-shrink: 0;
        }
        .sqo-compact[data-s-state="S3"] .sqo-compact-state {
          color: #64ffda;
          background: rgba(100, 255, 218, 0.08);
          border-color: rgba(100, 255, 218, 0.2);
        }
        .sqo-compact[data-s-state="S1"] .sqo-compact-state,
        .sqo-compact[data-s-state="S0"] .sqo-compact-state {
          color: #ff9e4a;
          background: rgba(255, 158, 74, 0.08);
          border-color: rgba(255, 158, 74, 0.2);
        }
        .sqo-compact-label {
          font-size: 12px;
          color: #9aa0bc;
          letter-spacing: 0.01em;
        }
        .sqo-compact-caret {
          font-size: 10px;
          color: #8a96b2;
          margin-left: auto;
          transition: color 0.15s ease;
        }
        .sqo-compact-badge:hover .sqo-compact-caret {
          color: #8a95b0;
        }
        .sqo-compact-detail {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 8px 0 4px;
          border-top: 1px solid #1e2330;
          max-width: 780px;
        }
        .sqo-compact-action {
          padding-top: 4px;
        }
        .sqo-intelligence-description {
          font-size: 11px;
          color: #8a96b2;
          line-height: 1.55;
          padding-left: 12px;
          border-left: 2px solid rgba(74, 158, 255, 0.12);
        }
        .sqo-intelligence-line {
          font-size: 11px;
          color: #8a96b2;
          line-height: 1.55;
        }
        .sqo-intelligence-line--debt {
          color: #9aa0bc;
          font-weight: 500;
        }
        .sqo-intelligence-line--condition {
          color: rgba(230, 184, 0, 0.8);
          font-size: 10px;
        }
        .sqo-intelligence-line--resolution {
          color: #6a7590;
          font-size: 10px;
        }
        .sqo-intelligence-line--progression {
          color: #6a7590;
          font-size: 10px;
        }
        .sqo-intelligence-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border: 1px solid #2a2f40;
          border-radius: 3px;
          text-decoration: none;
          transition: border-color 0.15s ease, background 0.15s ease;
          cursor: pointer;
        }
        .sqo-intelligence-action:hover {
          border-color: #4a9eff;
          background: rgba(74, 158, 255, 0.04);
        }
        .sqo-intelligence-action-label {
          font-size: 11px;
          color: #8a95b0;
          letter-spacing: 0.02em;
          transition: color 0.15s ease;
        }
        .sqo-intelligence-action:hover .sqo-intelligence-action-label {
          color: #ccd6f6;
        }
        .sqo-intelligence-action-arrow {
          font-size: 12px;
          color: #7a8aaa;
          transition: color 0.15s ease, transform 0.15s ease;
        }
        .sqo-intelligence-action:hover .sqo-intelligence-action-arrow {
          color: #4a9eff;
          transform: translateX(2px);
        }

        /* Legacy topology-strip and topology-zone (deprecated) */
        .topology-strip { display: none; }
        .topology-zone { display: none; }
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
          color: #8a96b2;
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
        .footnote-path { font-size: 12px; color: #8a96b2; letter-spacing: 0.03em; }
        .footnote-sep { color: #3a4560; }
        .footnote-tier { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }

        /* ── Evidence Layer ──────────────────────────────────────────────── */
        .evidence-layer {
          padding: 56px 56px 64px;
          border-bottom: 1px solid #1a2030;
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
          color: #8a96b2;
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

        /* ── Signal Interpretation Section ─────────────────────────────── */
        .signal-interp-section {
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid #1a2030;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .signal-interp-label {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .signal-interp-block {
          padding: 16px 20px;
          background: rgba(8, 10, 15, 0.45);
          border: 1px solid #1e2330;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-left: 3px solid #5a6580;
        }
        .signal-interp-block[data-severity="HIGH"] { border-left-color: #ff6b6b; }
        .signal-interp-block[data-severity="ELEVATED"] { border-left-color: #ff9e4a; }
        .signal-interp-block[data-severity="MODERATE"] { border-left-color: #ffd700; }
        .signal-interp-block[data-severity="NOMINAL"] { border-left-color: #64ffda; }
        .signal-interp-header {
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
        }
        .signal-interp-name {
          font-size: 12px;
          font-weight: 600;
          color: #ccd6f6;
          letter-spacing: 0.02em;
        }
        .signal-interp-value {
          font-size: 12px;
          color: #8a96b2;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
        }
        .signal-interp-severity {
          font-size: 8px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 600;
          padding: 1px 6px;
          border-radius: 2px;
          color: #8a96b2;
          background: rgba(90, 101, 128, 0.1);
          border: 1px solid rgba(90, 101, 128, 0.2);
        }
        .signal-interp-severity[data-severity="HIGH"] { color: #ff6b6b; background: rgba(255, 107, 107, 0.08); border-color: rgba(255, 107, 107, 0.2); }
        .signal-interp-severity[data-severity="ELEVATED"] { color: #ff9e4a; background: rgba(255, 158, 74, 0.08); border-color: rgba(255, 158, 74, 0.2); }
        .signal-interp-severity[data-severity="MODERATE"] { color: #ffd700; background: rgba(255, 215, 0, 0.08); border-color: rgba(255, 215, 0, 0.2); }
        .signal-interp-severity[data-severity="NOMINAL"] { color: #64ffda; background: rgba(100, 255, 218, 0.08); border-color: rgba(100, 255, 218, 0.2); }
        .signal-interp-prose {
          font-size: 12px;
          color: #b6bdd6;
          line-height: 1.6;
          letter-spacing: 0.005em;
        }
        .signal-interp-concentration {
          font-size: 11px;
          color: #8a96b2;
          line-height: 1.5;
        }
        .signal-interp-confidence {
          font-size: 10px;
          color: #8a96b2;
          line-height: 1.5;
          font-style: italic;
        }
        .signal-interp-copresence {
          font-size: 11px;
          color: #9aa0bc;
          line-height: 1.55;
          padding: 12px 16px;
          background: rgba(74, 158, 255, 0.04);
          border: 1px solid rgba(74, 158, 255, 0.1);
          border-radius: 3px;
        }
        .signal-interp-compound {
          font-size: 12px;
          color: #b6bdd6;
          line-height: 1.6;
          padding-left: 14px;
          border-left: 2px solid rgba(255, 158, 74, 0.3);
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
          color: #7a8aaa;
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
        .gov-pass .gov-dot { color: #2d6e52; }
        .gov-pass .gov-key { color: #3d7e62; }
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
         * DISCLOSURE SHELL — CINEMATIC VISUAL DOCTRINE
         * PI.LENS.V2.PHASE3.CINEMATIC-VISUAL-DOCTRINE.01
         *
         * Tier semantics:
         *   tier0 — command declaration: calm, undeniable, minimal density
         *   tier1 — operational context: stable rhythm, low-friction scan
         *   tier2 — exploratory depth: recessed, lower interruption
         *   tier3 — investigation immersion: isolated, intentionally deep
         * ════════════════════════════════════════════════════════════════ */

        .disclosure-shell {
          display: flex;
          flex-direction: column;
          --tier-gap-0: 0px;
          --tier-gap-1: 1px;
          --tier-gap-2: 12px;
          --tier-gap-3: 24px;
        }

        /* ── Tier structure ─────────────────────────────────────────── */
        .disclosure-tier {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* Tier 0 — command declaration layer
         * Full opacity, full contrast. The executive reads this first
         * and may read nothing else. */
        .disclosure-tier--0 {
          animation: v2Enter 0.4s ease 0.08s both;
        }

        /* Tier 1 — operational intelligence layer
         * Slightly softened entry. Readable without competing with tier0.
         * Subtle top separator creates cognitive breathing room. */
        .disclosure-tier--1 {
          margin-top: var(--tier-gap-1);
          animation: v2Enter 0.45s ease 0.18s both;
          border-top: 1px solid rgba(42, 51, 74, 0.4);
        }
        .disclosure-tier--1::before {
          content: '';
          position: absolute;
          top: 0;
          left: 56px;
          right: 56px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(74,158,255,0.08) 30%, rgba(74,158,255,0.08) 70%, transparent);
          pointer-events: none;
        }

        /* Tier 2 — exploratory depth layer
         * Visually recessed. Lower contrast background signals
         * "you chose to go deeper." Content is available but
         * does not demand attention. */
        .disclosure-tier--2 {
          margin-top: var(--tier-gap-2);
          animation: v2Enter 0.5s ease 0.28s both;
          background:
            linear-gradient(180deg, rgba(8,10,15,0.25) 0%, transparent 40%);
          position: relative;
        }
        .disclosure-tier--2::before {
          content: '';
          position: absolute;
          top: 0;
          left: 40px;
          right: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(42,51,74,0.5) 20%, rgba(42,51,74,0.5) 80%, transparent);
          pointer-events: none;
        }
        .disclosure-tier--2 .declaration-zone,
        .disclosure-tier--2 .qualifier-mandate,
        .disclosure-tier--2 .trust-zone,
        .disclosure-tier--2 .recon-zone {
          opacity: 0.88;
        }

        /* Tier 3 — investigation immersion layer
         * Isolated from the executive flow. Darker atmospheric
         * ground signals forensic depth. The reader has
         * intentionally entered investigation territory. */
        .disclosure-tier--3 {
          margin-top: var(--tier-gap-3);
          animation: v2Enter 0.55s ease 0.38s both;
          background:
            linear-gradient(180deg, rgba(8,10,15,0.45) 0%, rgba(8,10,15,0.2) 60%, transparent);
          border-top: 1px solid rgba(42, 51, 74, 0.35);
          padding-top: 8px;
          position: relative;
        }
        .disclosure-tier--3::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 56px;
          right: 56px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(230,184,0,0.12) 30%, rgba(230,184,0,0.12) 70%, transparent);
          pointer-events: none;
        }
        .disclosure-tier--3::after {
          content: 'INVESTIGATION DEPTH';
          position: absolute;
          top: -8px;
          left: 56px;
          font-size: 8px;
          letter-spacing: 0.28em;
          color: rgba(230,184,0,0.35);
          background: #14171f;
          padding: 0 12px 0 0;
          pointer-events: none;
        }

        /* ── Zone wrappers ──────────────────────────────────────────── */
        .disclosure-zone {
          transition: opacity 0.3s ease;
        }

        /* Promoted zones: zones elevated from a lower tier due to
         * CRITICAL severity. Subtle left-edge marker signals
         * "this was promoted for your attention" without alarm. */
        .disclosure-zone--promoted {
          position: relative;
        }
        .disclosure-zone--promoted::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: linear-gradient(180deg, var(--state-color) 0%, transparent 100%);
          opacity: 0.5;
          pointer-events: none;
          z-index: 1;
        }

        /* Severity-aware zone atmosphere */
        .disclosure-zone[data-severity="CRITICAL"] {
          position: relative;
        }
        .disclosure-zone[data-severity="CRITICAL"]::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(255,107,107,0.03) 0%, transparent 40%);
          pointer-events: none;
          z-index: 0;
        }
        .disclosure-zone[data-severity="ELEVATED"] {
          position: relative;
        }
        .disclosure-zone[data-severity="ELEVATED"]::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(230,184,0,0.02) 0%, transparent 30%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Escalation banner ──────────────────────────────────────── */
        /* Consequence interruption without chaos. The banner announces
         * critical conditions with calm authority — no flashing, no
         * alarm aesthetic, no dashboard panic. */
        .disclosure-escalation {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 56px;
          background:
            linear-gradient(90deg, rgba(255,107,107,0.06) 0%, rgba(255,107,107,0.02) 40%, transparent 100%);
          border-bottom: 1px solid rgba(255,107,107,0.12);
          animation: v2Enter 0.35s ease both;
        }
        .disclosure-escalation-count {
          font-size: 15px;
          font-weight: 600;
          color: #ff6b6b;
          line-height: 1;
          min-width: 18px;
          text-align: center;
        }
        .disclosure-escalation-label {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,107,107,0.7);
          font-weight: 500;
        }
        .disclosure-escalation-zones {
          font-size: 9px;
          color: rgba(154,112,112,0.7);
          font-family: ui-monospace, "SF Mono", Menlo, monospace;
          letter-spacing: 0.04em;
          margin-left: auto;
        }

        /* ── Persona-atmospheric separation ─────────────────────────── */
        /* Boardroom persona: maximum cognitive compression.
         * Suppress tier gaps, flatten hierarchy, reduce chrome. */
        .disclosure-shell[data-persona="BOARDROOM"] {
          --tier-gap-1: 0px;
          --tier-gap-2: 0px;
          --tier-gap-3: 0px;
        }
        .disclosure-shell[data-persona="BOARDROOM"] .disclosure-tier--2::before,
        .disclosure-shell[data-persona="BOARDROOM"] .disclosure-tier--3::before,
        .disclosure-shell[data-persona="BOARDROOM"] .disclosure-tier--3::after {
          display: none;
        }
        .disclosure-shell[data-persona="BOARDROOM"] .disclosure-tier--2,
        .disclosure-shell[data-persona="BOARDROOM"] .disclosure-tier--3 {
          background: none;
          border-top: none;
          padding-top: 0;
        }

        /* Investigation persona: deepen tier3 immersion further. */
        .disclosure-shell[data-persona="INVESTIGATION_DENSE"] {
          --tier-gap-3: 32px;
        }
        .disclosure-shell[data-persona="INVESTIGATION_DENSE"] .disclosure-tier--3 {
          background:
            linear-gradient(180deg, rgba(8,10,15,0.55) 0%, rgba(8,10,15,0.3) 50%, transparent);
          padding: 16px 0 0;
        }

        /* ── Collapsed tier summary ── */
        .disclosure-collapsed {
          margin: 8px 64px;
          padding: 0;
          opacity: 0;
          animation: v2Enter 0.3s ease forwards;
          animation-delay: 0.32s;
        }
        .disclosure-collapsed-inner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 14px;
          border-left: 2px solid rgba(74,158,255,0.10);
          background: linear-gradient(90deg, rgba(20,23,32,0.35) 0%, transparent 60%);
        }
        .disclosure-collapsed-zones {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }
        .disclosure-collapsed-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-ui);
          font-size: 11px;
          color: var(--text-dim);
          letter-spacing: 0.02em;
        }
        .disclosure-collapsed-chip[data-severity="CRITICAL"] {
          color: var(--semantic-red);
        }
        .disclosure-collapsed-chip[data-severity="ELEVATED"] {
          color: var(--semantic-yellow);
        }
        .disclosure-collapsed-chip-dot {
          font-size: 8px;
          line-height: 1;
        }
        .disclosure-collapsed-chip-name {
          white-space: nowrap;
        }
        .disclosure-collapsed-expand {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: 1px solid rgba(42,47,64,0.4);
          border-radius: 2px;
          padding: 3px 10px;
          cursor: pointer;
          color: var(--text-dim);
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          transition: border-color 0.15s ease, color 0.15s ease;
          flex-shrink: 0;
        }
        .disclosure-collapsed-expand:hover {
          border-color: rgba(74,158,255,0.3);
          color: var(--text-primary);
        }
        .disclosure-collapsed-expand:focus-visible {
          outline: 1px solid rgba(74,158,255,0.5);
          outline-offset: 1px;
        }
        .disclosure-collapsed-expand-caret {
          font-size: 10px;
          line-height: 1;
        }

        /* ── Tier collapse button (visible on expanded collapsible tiers) ── */
        .disclosure-tier-collapse {
          display: flex;
          justify-content: flex-end;
          padding: 0 64px;
          margin-bottom: 4px;
        }
        .disclosure-tier-collapse-label {
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: var(--text-muted);
          cursor: pointer;
          background: none;
          border: none;
          padding: 2px 8px;
          transition: color 0.15s ease;
        }
        .disclosure-tier-collapse:hover .disclosure-tier-collapse-label {
          color: var(--text-dim);
        }

        /* ── Governance Envelope (5A.8.6) ── */
        .disclosure-footer {
          padding: 14px 56px 18px;
          border-top: 1px solid #2a3350;
        }
        .disclosure-footer-inner {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .disclosure-footer-status {
          display: flex;
          align-items: center;
          gap: 7px;
          flex-shrink: 0;
        }
        .disclosure-footer-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #64ffda;
          flex-shrink: 0;
        }
        .disclosure-footer-status-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: #64ffda;
          text-transform: uppercase;
        }
        .disclosure-footer-prohibition {
          font-size: 10px;
          color: #7a85a3;
          letter-spacing: 0.02em;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .disclosure-footer-qualifier {
          font-size: 9px;
          color: rgba(230,184,0,0.5);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .disclosure-footer-expand {
          background: none;
          border: 1px solid #2a2f40;
          color: #8a96b2;
          font-size: 10px;
          width: 22px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          cursor: pointer;
          margin-left: auto;
          transition: border-color 0.15s ease, color 0.15s ease;
        }
        .disclosure-footer-expand:hover {
          border-color: #7a8aaa;
          color: #8a95b0;
        }
        .disclosure-footer-details {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #1e2330;
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }
        .disclosure-footer-detail-row {
          font-size: 10px;
          font-family: 'Courier New', monospace;
          color: #8a96b2;
          letter-spacing: 0.03em;
        }

        /* ════════════════════════════════════════════════════════════════
         * SEMANTIC TRUST POSTURE ZONE
         * PI.LENS.V2.RECONCILIATION-CONSUMPTION-LAYER.01
         * ════════════════════════════════════════════════════════════════ */

        .trust-zone {
          margin: 0 64px;
          padding: 18px 24px;
          border: 1px solid rgba(74,158,255,0.12);
          background: rgba(20,23,31,0.6);
          border-radius: 2px;
          margin-bottom: 12px;
        }
        .trust-zone--boardroom {
          padding: 8px 20px;
          border: none;
          background: transparent;
          border-bottom: 1px solid rgba(42,47,64,0.5);
          margin: 0 64px;
          border-radius: 0;
        }
        .trust-zone--simplified {
          padding: 10px 56px;
          border: none;
          background: transparent;
          border-bottom: 1px solid #1a2030;
          margin: 0;
          border-radius: 0;
        }
        .trust-zone-compact {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          letter-spacing: 0.04em;
          color: #8a96b2;
        }
        .trust-zone-compact-level {
          font-weight: 700;
          letter-spacing: 0.06em;
        }
        .trust-zone-compact-sep {
          color: #3a4560;
          user-select: none;
        }
        .trust-zone-compact-state {
          color: #9aa0bc;
          font-weight: 600;
        }
        .trust-zone-compact-grounding {
          color: #8a96b2;
        }
        .trust-zone-compact-maturity {
          color: #8a96b2;
          font-size: 11px;
        }
        .trust-zone-strip {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          letter-spacing: 0.04em;
          color: #8a96b2;
        }
        .trust-zone-level {
          font-weight: 700;
          letter-spacing: 0.06em;
        }
        .trust-zone-sep {
          color: #7a8aaa;
          user-select: none;
        }
        .trust-zone-s-state {
          color: #ccd6f6;
          font-weight: 600;
        }
        .trust-zone-q-class {
          color: #8a96b2;
        }
        .trust-zone-trend {
          font-weight: 600;
        }
        .trust-zone-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .trust-zone-header-label {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7a8aaa;
          font-weight: 600;
        }
        .trust-zone-header-level {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 2px 10px;
          border: 1px solid;
          border-radius: 2px;
          background: rgba(0,0,0,0.2);
        }

        .trust-zone-qualification {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .trust-zone-qual-primary {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .trust-zone-qual-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 6px 14px;
          border: 1px solid;
          border-radius: 2px;
          background: rgba(0,0,0,0.2);
          min-width: 56px;
        }
        .trust-zone-qual-s-state {
          font-family: 'Courier New', monospace;
          font-size: 18px;
          font-weight: 700;
          color: #ccd6f6;
          letter-spacing: 0.04em;
          line-height: 1.2;
        }
        .trust-zone-qual-q-class {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #8a96b2;
          letter-spacing: 0.06em;
          line-height: 1.2;
        }
        .trust-zone-qual-detail {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .trust-zone-qual-grounding {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #ccd6f6;
        }
        .trust-zone-qual-maturity {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #8a96b2;
        }
        .trust-zone-progression {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .trust-zone-progression-label {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #8a96b2;
          white-space: nowrap;
        }
        .trust-zone-progression-bar-wrap {
          width: 80px;
          height: 6px;
          background: rgba(42,47,64,0.6);
          border-radius: 1px;
          overflow: hidden;
        }
        .trust-zone-progression-bar {
          height: 100%;
          background: #4a9eff;
          border-radius: 1px;
          transition: width 0.3s ease;
        }
        .trust-zone-progression-pct {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #ccd6f6;
          min-width: 42px;
          text-align: right;
        }

        .trust-zone-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 14px;
        }
        .trust-zone-metric-card {
          padding: 10px 12px;
          background: rgba(13,15,20,0.5);
          border: 1px solid rgba(42,47,64,0.5);
          border-radius: 2px;
        }
        .trust-zone-metric-label {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #7a8aaa;
          margin-bottom: 4px;
        }
        .trust-zone-metric-value {
          font-family: 'Courier New', monospace;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .trust-zone-metric-sub {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #8a96b2;
          line-height: 1.4;
        }
        .trust-zone-metric-detail {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #7a8aaa;
          margin-top: 3px;
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .trust-zone-metric-detail--warn {
          color: #ff9e4a;
        }
        .trust-zone-metric-detail-sep {
          color: #7a8aaa;
        }

        .trust-zone-structural {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(42,47,64,0.4);
        }
        .trust-zone-structural-label {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #7a8aaa;
          margin-bottom: 8px;
        }
        .trust-zone-structural-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .trust-zone-structural-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .trust-zone-structural-value {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          font-weight: 700;
          color: #ccd6f6;
        }
        .trust-zone-structural-key {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #7a8aaa;
        }

        .trust-zone-unresolved-disclosure {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid rgba(42,47,64,0.3);
        }
        .trust-zone-unresolved-label {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #ff9e4a;
          margin-bottom: 6px;
        }
        .trust-zone-unresolved-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 3px 0;
          font-family: 'Courier New', monospace;
          font-size: 11px;
        }
        .trust-zone-unresolved-id {
          color: #ccd6f6;
          font-weight: 600;
          min-width: 40px;
        }
        .trust-zone-unresolved-name {
          color: #8a96b2;
        }
        .trust-zone-unresolved-type {
          color: #7a8aaa;
          font-size: 10px;
        }

        /* ════════════════════════════════════════════════════════════════
         * RECONCILIATION AWARENESS ZONE
         * PI.LENS.V2.RECONCILIATION-RUNTIME-CONSUMPTION.01
         * ════════════════════════════════════════════════════════════════ */

        .recon-zone {
          margin: 0 64px;
          padding: 18px 24px;
          border: 1px solid rgba(74,158,255,0.12);
          background: rgba(20,23,31,0.6);
        }

        .recon-zone--boardroom {
          margin: 0 120px;
          padding: 10px 24px;
          border: none;
          border-bottom: 1px solid rgba(90,101,128,0.15);
          background: transparent;
        }

        .recon-zone-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .recon-zone-label {
          font-size: 9px;
          letter-spacing: 0.28em;
          color: #8a96b2;
          text-transform: uppercase;
        }

        .recon-zone-posture-tag {
          font-size: 9px;
          letter-spacing: 0.06em;
          padding: 2px 8px;
          border: 1px solid;
        }

        .recon-zone-trend {
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-left: auto;
        }
        .recon-zone-trend--improving { color: #64ffda; }
        .recon-zone-trend--degrading { color: #ff6b6b; }
        .recon-zone-trend--stable { color: #8a96b2; }
        .recon-zone-trend--insufficient_data { color: #3a4560; }

        .recon-zone-posture-strip {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .recon-zone-posture-symbol { font-size: 14px; }
        .recon-zone-posture-label {
          font-size: 11px;
          color: #9aa0bc;
          letter-spacing: 0.06em;
        }
        .recon-zone-posture-confidence {
          font-size: 14px;
          color: #e8edf8;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .recon-zone-metrics {
          display: flex;
          gap: 24px;
          margin-bottom: 14px;
        }

        .recon-zone-metric {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .recon-zone-metric--primary .recon-zone-metric-value {
          font-size: 20px;
          font-weight: 600;
        }

        .recon-zone-metric-value {
          font-size: 14px;
          color: #e8edf8;
          letter-spacing: -0.01em;
        }

        .recon-zone-metric-label {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* Trajectory */
        .recon-trajectory {
          padding: 12px 0;
          border-top: 1px solid rgba(90,101,128,0.15);
        }

        .recon-trajectory-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .recon-trajectory-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          color: #8a96b2;
          text-transform: uppercase;
        }

        .recon-trajectory-delta {
          font-size: 10px;
          letter-spacing: 0.02em;
          color: #7a85a3;
        }
        .recon-trajectory-delta--up { color: #64ffda; }
        .recon-trajectory-delta--down { color: #ff6b6b; }

        .recon-trajectory-epochs {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .recon-trajectory-epoch {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .recon-trajectory-epoch-label {
          font-size: 9px;
          color: #8a96b2;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          min-width: 80px;
        }
        .recon-trajectory-epoch--current .recon-trajectory-epoch-label { color: #9aa0bc; }

        .recon-trajectory-epoch-bar-wrap {
          flex: 1;
          height: 6px;
          background: rgba(90,101,128,0.12);
          overflow: hidden;
        }

        .recon-trajectory-epoch-bar {
          height: 100%;
          background: rgba(74,158,255,0.5);
          transition: width 0.3s ease;
        }
        .recon-trajectory-epoch--current .recon-trajectory-epoch-bar { background: #4a9eff; }

        .recon-trajectory-epoch-value {
          font-size: 10px;
          color: #7a85a3;
          min-width: 40px;
          text-align: right;
        }
        .recon-trajectory-epoch--current .recon-trajectory-epoch-value { color: #e8edf8; }

        .recon-trajectory-movements {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }

        .recon-trajectory-movement {
          font-size: 9px;
          padding: 1px 6px;
          border: 1px solid rgba(90,101,128,0.2);
          color: #7a85a3;
        }
        .recon-trajectory-movement--up { color: #64ffda; border-color: rgba(100,255,218,0.25); }
        .recon-trajectory-movement--down { color: #ff6b6b; border-color: rgba(255,107,107,0.25); }

        /* Debt disclosure */
        .recon-debt {
          padding: 12px 0;
          border-top: 1px solid rgba(90,101,128,0.15);
        }

        .recon-debt-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .recon-debt-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          color: #8a96b2;
          text-transform: uppercase;
        }

        .recon-debt-rate {
          font-size: 9px;
          color: #64ffda;
          letter-spacing: 0.04em;
          margin-left: auto;
        }

        .recon-debt-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .recon-debt-item {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 3px 0;
        }

        .recon-debt-item-id {
          font-size: 10px;
          color: #ff6b6b;
          min-width: 80px;
        }

        .recon-debt-item-name {
          font-size: 10px;
          color: #7a85a3;
          flex: 1;
        }

        .recon-debt-item-type {
          font-size: 9px;
          color: #3a4560;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* Per-domain correspondence */
        .recon-domains {
          padding: 12px 0;
          border-top: 1px solid rgba(90,101,128,0.15);
        }

        .recon-domains-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          color: #8a96b2;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .recon-domains-grid {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .recon-domain-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 0;
          font-size: 10px;
        }

        .recon-domain-badge {
          font-size: 9px;
          padding: 1px 5px;
          border: 1px solid rgba(90,101,128,0.2);
          min-width: 24px;
          text-align: center;
          letter-spacing: 0.02em;
        }
        .recon-domain-badge--l5 { color: #64ffda; border-color: rgba(100,255,218,0.3); }
        .recon-domain-badge--l4 { color: #4a9eff; border-color: rgba(74,158,255,0.3); }
        .recon-domain-badge--l3 { color: #ffd700; border-color: rgba(255,215,0,0.3); }
        .recon-domain-badge--l2 { color: #ff9e4a; border-color: rgba(255,158,74,0.3); }
        .recon-domain-badge--l1 { color: #ff6b6b; border-color: rgba(255,107,107,0.3); }

        .recon-domain-id { color: #9aa0bc; min-width: 80px; }
        .recon-domain-name { color: #7a85a3; flex: 1; }
        .recon-domain-dom { color: #8a96b2; min-width: 50px; }

        .recon-domain-status {
          font-size: 9px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .recon-domain-status--reconciled { color: #64ffda; }
        .recon-domain-status--unreconciled { color: #3a4560; }

        /* Drilldown interaction — debt entries */
        .recon-debt-entry {
          border-bottom: 1px solid rgba(90,101,128,0.08);
        }
        .recon-debt-entry:last-child { border-bottom: none; }

        .recon-debt-item--drillable {
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .recon-debt-item--drillable:hover {
          background: rgba(74,158,255,0.04);
        }

        .recon-debt-item-expand {
          font-size: 9px;
          color: #3a4560;
          min-width: 10px;
          transition: color 0.15s ease;
        }
        .recon-debt-item--drillable:hover .recon-debt-item-expand {
          color: #8a96b2;
        }

        /* Drilldown interaction — domain entries */
        .recon-domain-entry {
          border-bottom: 1px solid rgba(90,101,128,0.08);
        }
        .recon-domain-entry:last-child { border-bottom: none; }

        .recon-domain-row--drillable {
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .recon-domain-row--drillable:hover {
          background: rgba(74,158,255,0.04);
        }

        .recon-domain-expand {
          font-size: 9px;
          color: #3a4560;
          margin-left: auto;
          transition: color 0.15s ease;
        }
        .recon-domain-row--drillable:hover .recon-domain-expand {
          color: #8a96b2;
        }

        /* Drilldown panel (shared) */
        .recon-drilldown {
          padding: 8px 0 10px 18px;
          border-left: 2px solid rgba(74,158,255,0.15);
          margin: 4px 0 2px 4px;
        }

        .recon-drilldown-section {
          margin-bottom: 6px;
        }
        .recon-drilldown-section:last-child { margin-bottom: 0; }

        .recon-drilldown-key {
          font-size: 9px;
          color: #3a4560;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 2px;
        }

        .recon-drilldown-val {
          font-size: 10px;
          color: #7a85a3;
          line-height: 1.5;
          display: block;
        }

        .recon-drilldown-val--hint {
          color: #ffd700;
          font-style: italic;
        }

        .recon-drilldown-meta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid rgba(90,101,128,0.08);
        }

        .recon-drilldown-meta-item {
          font-size: 9px;
          color: #3a4560;
          letter-spacing: 0.02em;
        }

        /* Provenance */
        .recon-provenance {
          padding: 12px 0;
          border-top: 1px solid rgba(90,101,128,0.15);
        }

        .recon-provenance-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          color: #8a96b2;
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }

        .recon-provenance-items {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .recon-provenance-item {
          display: flex;
          gap: 4px;
          align-items: baseline;
        }

        .recon-provenance-key {
          font-size: 9px;
          color: #3a4560;
          letter-spacing: 0.04em;
        }

        .recon-provenance-val {
          font-size: 9px;
          color: #8a96b2;
        }

        .recon-provenance-val--pass { color: #64ffda; }

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
          color: #8a96b2;
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
          color: #8a96b2;
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
          color: #8a96b2;
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
          color: #8a96b2;
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
          color: #8a96b2;
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

        /* ── Investigation Reading Guide (inline preamble) ─────────────── */
        .reading-guide-preamble {
          margin-bottom: 16px;
          padding: 14px 16px 16px;
          border-left: 2px solid rgba(74,158,255,0.2);
          background: rgba(74,158,255,0.02);
        }
        .reading-guide-preamble-label {
          font-size: 9px;
          font-weight: 600;
          color: #8a96b2;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .reading-guide-preamble-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .reading-guide-prose {
          font-size: 12px;
          color: #8a96b2;
          line-height: 1.6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin: 0;
        }
        .reading-guide-prose strong {
          color: #9aa0bc;
          font-weight: 600;
        }
        .reading-guide-prose--hint {
          font-size: 11px;
          color: #7a8aaa;
          font-style: italic;
          margin-top: 4px;
        }

        /* ── Term Hint (contextual decode tooltip) ───────────────────────── */
        .term-hint {
          position: relative;
          border-bottom: 1px dotted rgba(74,158,255,0.35);
          cursor: help;
        }
        .term-hint-popup {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          padding: 10px 12px;
          background: #161a25;
          border: 1px solid #2a3348;
          border-radius: 4px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 6px;
          pointer-events: none;
        }
        .term-hint-popup::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: #2a3348;
        }
        .term-hint-popup-exec {
          font-size: 11.5px;
          color: #ccd6f6;
          line-height: 1.5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .term-hint-popup-tech {
          font-size: 10px;
          color: #8a96b2;
          line-height: 1.45;
          font-family: 'Courier New', monospace;
          border-top: 1px solid #1e2330;
          padding-top: 5px;
        }

        /* ── BOARDROOM — Confidence Envelope ring (replaces decorative ring) ── */
        .rep-board-decision-label {
          font-size: 10px;
          color: #8a96b2;
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
