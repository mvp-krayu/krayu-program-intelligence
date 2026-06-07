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
import { SoftwareIntelligenceModuleToggle } from '../components/lens-v2/zones/SoftwareIntelligenceField'


const {
  orchestrateFlagshipExperience,
  resolveBoardroomConfig,
  resolveGravityToken,
  resolvePresenceToken,
} = require('../flagship-experience/flagshipOrchestration')

const { compileBoardroomProjection } = require('../lib/lens-v2/generic/BoardroomProjectionCompiler')
const { deriveProjection, deriveModuleState, PROJECTION_STATUS } = require('../lib/lens-v2/SoftwareIntelligenceProjectionAdapter')
const { synthesize: synthesizeForProjection, qualifyDomainBacking: qualifyForProjection } = require('../lib/lens-v2/SignalSynthesisEngine')
const { compile: compileForProjection } = require('../lib/lens-v2/software-intelligence/ConsequenceCompiler')

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
    value: 'OPERATOR_DENSE',
    label: 'OPERATOR',
    persona_label: 'Evidence lens',
    persona_sub: 'Operator · evidence inspection and confidence',
    aria: 'Operator — engineering evidence inspection and confidence lens',
  },
]
const BOARDROOM_PERSONA = {
  persona_label: 'Projection lens',
  persona_sub: 'Boardroom projection — minimal chrome',
  aria: 'Boardroom projection lens — minimal chrome, declaration-supportive',
}

// ── Inner components ──────────────────────────────────────────────────────────

function AuthorityBand({ densityClass, boardroomMode, onDensityChange, onBoardroomToggle, swIntelActive, swIntelAvailable, onSwIntelToggle }) {
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
          <SoftwareIntelligenceModuleToggle
            active={swIntelActive}
            available={swIntelAvailable}
            onToggle={onSwIntelToggle}
          />
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

export default function LensV2FlagshipPage({ livePayload, livePropagationChains, liveBindingError, bindingClient, bindingRun, reconciliationAwareness, domainTraceability, substrateBinding, reportBinding, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, sqoAuthorityWorkspace, sqoBinding, runtimeConnectivityEdges, visibilityLayerCompleteness, runtimeGraphs }) {
  const [densityClass, setDensityClass] = useState('EXECUTIVE_DENSE')
  const [boardroomMode, setBoardroomMode] = useState(false)
  const [operatorStage, setOperatorStage] = useState('SUMMARY')
  const [pendingTransitionDomain, setPendingTransitionDomain] = useState(null)
  const [pendingTransitionZone, setPendingTransitionZone] = useState(null)
  const [swIntelActive, setSwIntelActive] = useState(false)

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
      operatorStage,
    )
  }, [reportObject, densityClass, boardroomMode, operatorStage])

  const boardroomProjection = useMemo(() => {
    if (!reportObject || !boardroomMode) return null
    return compileBoardroomProjection(reportObject)
  }, [reportObject, boardroomMode])

  const swIntelProjection = useMemo(() => {
    if (!reportObject) return null
    const qualified = qualifyForProjection(reportObject, visibilityLayerCompleteness, runtimeConnectivityEdges, runtimeGraphs)
    const synResult = synthesizeForProjection(qualified)
    const csqResult = synResult ? compileForProjection(synResult, qualified) : null
    if (synResult) {
      qualified._synthesisResult = synResult
      reportObject._synthesisResult = synResult
    }
    return deriveProjection(qualified, synResult, csqResult)
  }, [reportObject, visibilityLayerCompleteness, runtimeConnectivityEdges, runtimeGraphs])

  const swIntelAvailable = swIntelProjection && swIntelProjection.module_state !== PROJECTION_STATUS.ABSENT
  const handleSwIntelToggle = useCallback(() => setSwIntelActive(p => !p), [])
  const handleSwIntelDeactivate = useCallback(() => setSwIntelActive(false), [])

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
          onDensityChange={v => { setDensityClass(v); setBoardroomMode(false) }}
          onBoardroomToggle={() => setBoardroomMode(p => !p)}
          swIntelActive={swIntelActive}
          swIntelAvailable={swIntelAvailable}
          onSwIntelToggle={handleSwIntelToggle}
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
            boardroomProjection={boardroomProjection}
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
            swIntelActive={swIntelActive}
            swIntelProjection={swIntelProjection}
            onSwIntelDeactivate={handleSwIntelDeactivate}
            sqoAuthorityWorkspace={sqoAuthorityWorkspace}
            sqoBinding={sqoBinding}
            runtimeConnectivityEdges={runtimeConnectivityEdges}
            visibilityLayerCompleteness={visibilityLayerCompleteness}
            runtimeGraphs={runtimeGraphs}
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
        .v2-live-banner-sep { color: #7a8aaa; }
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
          color: #8a96b2;
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
          color: #8a96b2;
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
          color: #8a96b2;
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
          color: #8a96b2;
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
          color: #7a8aaa;
        }
        .auth-persona-sub {
          color: #8a96b2;
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
          color: #8a96b2;
          letter-spacing: 0.04em;
          font-weight: 400;
        }
        .declaration-scope-sep { color: #7a8aaa; }

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
          width: 120px;
          height: 72px;
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

        /* ─── Structural Pressure Profile ─── */

        .cockpit-pressure-panel {
          min-width: 0;
        }
        .cockpit-pressure-label {
          font-size: 9px;
          color: #8a96b2;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 10px;
        }
        .cockpit-pressure-dim {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 10px;
        }
        .cockpit-pressure-dim-visual {
          flex-shrink: 0;
          margin-top: 1px;
        }
        .cockpit-pressure-dim-content {
          min-width: 0;
          flex: 1;
        }
        .cockpit-pressure-dim-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        .cockpit-pressure-dim-name {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: 600;
          color: #ccd6f6;
          letter-spacing: 0.02em;
        }
        .cockpit-pressure-dim[data-active="false"] .cockpit-pressure-dim-name {
          color: #7a8aaa;
          font-weight: 400;
        }
        .cockpit-pressure-dim-severity {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .cockpit-pressure-dim-severity[data-severity="CRITICAL"] { color: #ff6b6b; }
        .cockpit-pressure-dim-severity[data-severity="HIGH"] { color: #ff9e4a; }
        .cockpit-pressure-dim-severity[data-severity="ELEVATED"] { color: #ffd700; }
        .cockpit-pressure-dim-severity[data-severity="MODERATE"] { color: #7a8aaa; }
        .cockpit-pressure-dim-severity[data-severity="NOMINAL"] { color: #4a5570; }
        .cockpit-pressure-dim-locale {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 10.5px;
          color: #7a8aaa;
          line-height: 1.35;
        }
        .cockpit-pressure-dim[data-active="false"] .cockpit-pressure-dim-locale {
          color: #4a5570;
        }
        .cockpit-pressure-synthesis {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 11px;
          color: #9aa0bc;
          line-height: 1.4;
          padding-top: 6px;
          border-top: 1px solid #1e2330;
          margin-top: 4px;
          margin-bottom: 6px;
        }
        .structural-glyph {
          display: block;
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
          padding: 14px 10px;
          margin: 8px 0;
          border: 1px solid #1e2330;
          border-left: 2px solid rgba(74, 158, 255, 0.25);
          background: rgba(18, 21, 31, 0.4);
          cursor: pointer;
          position: relative;
          transition: background 0.2s, border-color 0.2s;
        }
        .cockpit-topology-preview:hover {
          background: rgba(74, 158, 255, 0.04);
          border-left-color: rgba(74, 158, 255, 0.5);
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
          border-color: #7a8aaa;
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

        /* ── Integrated operator flow (5A.6) ───────────────────────────────── */
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

        /* ── Topology Preview (DENSE + OPERATOR) ────────────────── */
        .dense-topology-preview,
        .operator-topology-preview {
          padding: 12px 0;
          border-top: 1px solid #1e2330;
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
          margin-top: 8px;
        }
        .dense-topology-preview:hover,
        .operator-topology-preview:hover {
          background: rgba(74, 158, 255, 0.03);
        }
        .dense-topology-preview .topo-graph-wrap,
        .operator-topology-preview .topo-graph-wrap {
          margin-bottom: 0;
        }
        .dense-topology-preview .topo-graph-heading,
        .operator-topology-preview .topo-graph-heading {
          font-size: 9px;
          text-align: center;
        }
        .dense-topology-preview .topo-graph-svg,
        .operator-topology-preview .topo-graph-svg {
          pointer-events: none;
        }
        .dense-topology-hint,
        .operator-topology-hint {
          text-align: center;
          font-size: 9px;
          color: #7a8aaa;
          letter-spacing: 0.08em;
          margin-top: 4px;
          transition: color 0.2s;
        }
        .dense-topology-preview:hover .dense-topology-hint,
        .operator-topology-preview:hover .operator-topology-hint {
          color: #4a9eff;
        }

        /* ── Investigation Governance Audit ── */
        .actor--operator-governance {
          margin: 20px 0;
          padding: 16px;
          background: var(--card-deep, #12151f);
          border: 1px solid var(--border-dim, #1e2330);
          border-left: 2px solid #4a9eff;
        }
        .inv-gov-section {
          margin: 14px 0 0;
          padding: 12px 0 0;
          border-top: 1px solid var(--border-dim, #1e2330);
        }
        .inv-gov-section:first-of-type {
          margin-top: 10px;
          border-top: none;
          padding-top: 0;
        }
        .inv-gov-section-head {
          font: 500 11px/1 'Courier New', monospace;
          color: #ccd6f6;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 8px;
        }
        .inv-gov-sub-head {
          font: 400 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 10px 0 6px;
        }
        .inv-gov-table {
          width: 100%;
          border-collapse: collapse;
          font: 11px/1.4 'Courier New', monospace;
        }
        .inv-gov-table th {
          text-align: left;
          font-weight: 500;
          color: #7a8aaa;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 4px 8px 4px 0;
          border-bottom: 1px solid var(--border-dim, #1e2330);
        }
        .inv-gov-table td {
          padding: 3px 8px 3px 0;
          color: #8a96b2;
          vertical-align: top;
          border-bottom: 1px solid rgba(30, 35, 48, 0.4);
        }
        .inv-gov-table--compact td,
        .inv-gov-table--compact th {
          padding: 2px 6px 2px 0;
          font-size: 10px;
        }
        .inv-gov-table--dim td {
          font-size: 10px;
        }
        .inv-gov-key {
          color: #a0adc6;
          white-space: nowrap;
          width: 160px;
        }
        .inv-gov-val {
          color: #ccd6f6;
        }
        .inv-gov-val--warn {
          color: #ffd700;
        }
        .inv-gov-val--reject,
        .inv-gov-stat-val--reject {
          color: #ff6b6b;
        }
        .inv-gov-val--arb,
        .inv-gov-stat-val--arb {
          color: #ff9e4a;
        }
        .inv-gov-val[data-verdict="PASS"],
        .inv-gov-val[data-status="PASS"],
        .inv-gov-val[data-status="CERTIFIED"] {
          color: #64ffda;
        }
        .inv-gov-val[data-verdict="FAIL"],
        .inv-gov-val[data-status="FAIL"] {
          color: #ff6b6b;
        }
        .inv-gov-id {
          font-size: 9px;
          color: #a0adc6;
          font-family: 'Courier New', monospace;
        }
        .inv-gov-num {
          text-align: right;
          font-variant-numeric: tabular-nums;
          font-family: 'Courier New', monospace;
        }
        .inv-gov-ts {
          font-size: 9px;
          color: #a0adc6;
        }
        .inv-gov-detail {
          font-size: 10px;
          color: #a0adc6;
          max-width: 280px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .inv-gov-dim-name {
          text-transform: lowercase;
          font-size: 10px;
        }
        .inv-gov-grid {
          display: flex;
          gap: 16px;
          margin: 6px 0;
        }
        .inv-gov-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .inv-gov-stat-val {
          font: 600 16px/1 'Courier New', monospace;
          color: #ccd6f6;
        }
        .inv-gov-stat-label {
          font: 400 9px/1 'Courier New', monospace;
          color: #a0adc6;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .inv-gov-class-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 4px 0;
        }
        .inv-gov-class-item {
          display: flex;
          align-items: baseline;
          gap: 4px;
          background: rgba(74, 158, 255, 0.06);
          padding: 3px 8px;
          border-radius: 2px;
        }
        .inv-gov-class-count {
          font: 600 12px/1 'Courier New', monospace;
          color: #4a9eff;
        }
        .inv-gov-class-name {
          font: 400 9px/1 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .inv-gov-trajectory {
          font: 400 11px/1.3 'Courier New', monospace;
          color: #8a96b2;
          margin: 6px 0;
        }
        .inv-gov-trajectory strong {
          color: #ccd6f6;
        }
        .inv-gov-phase-block {
          margin: 8px 0 0;
        }
        .inv-gov-observation {
          margin: 8px 0;
          padding: 8px 10px;
          background: rgba(74, 158, 255, 0.04);
          border-left: 2px solid var(--border-dim, #1e2330);
        }
        .inv-gov-observation[data-status="convergence"] {
          border-left-color: #64ffda;
        }
        .inv-gov-observation[data-status="divergence"] {
          border-left-color: #ff9e4a;
        }
        .inv-gov-observation[data-status="convergence_with_divergence"] {
          border-left-color: #ffd700;
        }
        .inv-gov-obs-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .inv-gov-obs-id {
          font: 400 9px/1 'Courier New', monospace;
          color: #a0adc6;
        }
        .inv-gov-obs-status {
          font: 500 9px/1 'Courier New', monospace;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #7a8aaa;
        }
        .inv-gov-obs-title {
          font: 500 11px/1.3 'Courier New', monospace;
          color: #ccd6f6;
          margin-bottom: 4px;
        }
        .inv-gov-obs-body {
          font: 400 10px/1.4 'Courier New', monospace;
          color: #8a96b2;
        }
        .inv-gov-obs-divergence {
          font: 400 10px/1.3 'Courier New', monospace;
          color: #ff9e4a;
          margin-top: 4px;
        }
        .inv-gov-forensics-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          margin: 10px 0 4px;
          padding: 8px 10px;
          background: var(--card-deep, #12151f);
          border: 1px solid var(--border-dim, #1e2330);
          border-radius: 4px;
          font: 500 10px/1.3 -apple-system, BlinkMacSystemFont, sans-serif;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .inv-gov-forensics-toggle:hover { color: #9aa6c2; border-color: #2a2f40; }
        .inv-gov-forensics-toggle-icon { font-size: 10px; color: #4a5570; }
        .inv-gov-footer {
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px solid var(--border-dim, #1e2330);
          font: 400 9px/1.3 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .inv-gov-footer-statement { margin-bottom: 4px; }
        .inv-gov-footer-rules { margin-top: 6px; display: flex; flex-wrap: wrap; gap: 8px; }
        .inv-gov-footer-rule-set { color: #4a5570; }
        tr[data-result="PASS"] td[data-result] { color: #64ffda; }
        tr[data-result="FAIL"] td[data-result] { color: #ff6b6b; }
        tr[data-verdict="PASS"] td[data-verdict] { color: #64ffda; }
        tr[data-verdict="FAIL"] td[data-verdict] { color: #ff6b6b; }
        tr[data-severity="CRITICAL"] { background: rgba(255, 107, 107, 0.06); }
        td[data-disposition="REJECTED"] { color: #ff6b6b; }
        td[data-disposition="ARBITRATED"] { color: #ff9e4a; }
        td[data-disposition="ACCEPTED"] { color: #64ffda; }

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
          color: #7a8aaa;
          font-style: italic;
          padding-top: 12px;
          border-top: 1px solid #12151f;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* ── Boardroom Narrative Envelope ────────────────────────────────── */
        .rep-field--narrative {
          display: flex;
          flex-direction: column;
          gap: 0;
          text-align: left;
        }
        .rep-field--narrative .rep-mode-tag {
          border-bottom: 1px solid #1e2330;
          text-align: left;
        }
        .narrative-envelope {
          padding: 28px 0 20px;
        }
        .narrative-envelope--posture {
          padding: 24px 0 16px;
        }
        .narrative-header {
          display: flex;
          align-items: baseline;
          gap: 20px;
          margin-bottom: 28px;
          padding-bottom: 16px;
          border-bottom: 1px solid #1e2330;
        }
        .narrative-header-state {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .narrative-header-s-state {
          font-size: 28px;
          font-weight: 700;
          color: #4a9eff;
          letter-spacing: 0.06em;
          font-family: 'Courier New', Courier, monospace;
        }
        .narrative-header-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #8a96b2;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .narrative-header-specimen {
          font-size: 12px;
          color: #7a8aaa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin-left: auto;
        }
        .narrative-body {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .narrative-paragraph {
          padding: 16px 14px 20px;
          border-bottom: 1px solid rgba(30,35,48,0.5);
          cursor: pointer;
          border-left: 3px solid transparent;
          transition: border-color 0.15s ease, background 0.15s ease;
          border-radius: 2px;
        }
        .narrative-paragraph:hover {
          background: rgba(74,158,255,0.03);
          border-left-color: rgba(74,158,255,0.2);
        }
        .narrative-paragraph--selected {
          background: rgba(74,158,255,0.06);
          border-left-color: #4a9eff;
        }
        .narrative-paragraph--selected:hover {
          background: rgba(74,158,255,0.08);
        }
        .narrative-paragraph:last-child {
          border-bottom: none;
        }
        .narrative-paragraph-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .narrative-arc-chip {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 2px 8px;
          border: 1px solid;
          border-radius: 3px;
          font-family: 'Courier New', Courier, monospace;
          background: transparent;
        }
        .narrative-anchor-count {
          font-size: 9px;
          color: #7a8aaa;
          font-family: 'Courier New', Courier, monospace;
          letter-spacing: 0.06em;
        }
        .narrative-paragraph-text {
          font-size: 14.5px;
          line-height: 1.72;
          color: #b8c4e0;
          font-family: 'Georgia', 'Times New Roman', serif;
          letter-spacing: 0.008em;
        }
        .narrative-paragraph[data-arc="OPENING"] .narrative-paragraph-text {
          color: #ccd6f6;
        }
        .narrative-paragraph[data-arc="REVELATION"] .narrative-paragraph-text {
          color: #ccd6f6;
        }
        .narrative-paragraph[data-arc="QUALIFICATION"] .narrative-paragraph-text {
          color: #8a96b2;
          font-size: 13.5px;
        }

        /* ── Evidence Anchor Display (LEFT panel) ────────────────────────── */
        .intel-interp--narrative-evidence .interp-section-label {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .intel-interp--narrative-evidence .interp-synthesis {
          font-size: 12px;
          color: #a0aac4;
          line-height: 1.65;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .intel-interp--narrative-evidence .interp-synthesis-meta {
          font-size: 10px;
          color: #8a96b2;
        }
        .intel-interp--narrative-evidence .interp-block--evidence-anchor {
          border-left: 2px solid rgba(74,158,255,0.3);
          padding-left: 10px;
        }
        .intel-interp--narrative-evidence .interp-synthesis--basis {
          font-size: 12px;
          color: #a0aac4;
          line-height: 1.65;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .intel-interp--narrative-evidence .interp-synthesis--prompt {
          font-size: 12px;
          color: #8a96b2;
          font-style: italic;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .interp-evidence-object {
          padding: 6px 0;
          border-bottom: 1px solid rgba(30,35,48,0.4);
        }
        .interp-evidence-object:last-child {
          border-bottom: none;
        }
        .interp-evidence-object-phase {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #4a9eff;
          font-family: 'Courier New', Courier, monospace;
          margin-bottom: 2px;
        }
        .interp-evidence-object-path {
          font-size: 10px;
          color: #7a8aaa;
          font-family: 'Courier New', Courier, monospace;
          word-break: break-all;
        }
        .interp-evidence-object-class {
          font-size: 9px;
          color: #8a96b2;
          margin-top: 2px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .narrative-proof-anchor-id {
          font-size: 10px;
          color: #4a9eff;
          font-family: 'Courier New', Courier, monospace;
          letter-spacing: 0.06em;
        }
        .narrative-proof-anchor-class {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #8a96b2;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .narrative-proof-anchor-refs {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 4px;
        }
        .narrative-proof-anchor-ref {
          font-size: 9px;
          color: #7a8aaa;
          font-family: 'Courier New', Courier, monospace;
          background: rgba(74,158,255,0.06);
          padding: 1px 6px;
          border-radius: 3px;
          border: 1px solid rgba(74,158,255,0.1);
        }

        /* ── Support Rail — Boardroom S1 ─────────────────────────────────── */
        .support-qualification-state {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 4px;
        }
        .support-qualification-s {
          font-size: 16px;
          font-weight: 700;
          color: #4a9eff;
          font-family: 'Courier New', Courier, monospace;
        }
        .support-qualification-gate {
          font-size: 10px;
          color: #8a96b2;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .support-qualification-detail {
          font-size: 11px;
          color: #8a96b2;
          line-height: 1.5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .support-kv-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .support-kv {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 11px;
        }
        .support-kv-key {
          color: #8a96b2;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .support-kv-val {
          color: #8a96b2;
          font-family: 'Courier New', Courier, monospace;
          font-size: 11px;
        }
        .support-kv-maturity {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #7a8aaa;
          margin-top: 6px;
          font-family: 'Courier New', Courier, monospace;
        }
        .support-arc-name {
          font-size: 12px;
          color: #ccd6f6;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .support-arc-hint {
          font-size: 10px;
          color: #7a8aaa;
          font-style: italic;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .narrative-provenance {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          padding-top: 16px;
          margin-top: 8px;
          border-top: 1px solid #1e2330;
          font-size: 10px;
          font-family: 'Courier New', Courier, monospace;
          color: #7a8aaa;
          letter-spacing: 0.04em;
        }
        .narrative-provenance-sep {
          color: #2a2f40;
        }
        .narrative-provenance-method {
          color: #8a96b2;
        }
        .narrative-provenance-contract {
          color: #4a9eff;
          opacity: 0.6;
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
          color: #8a96b2;
          line-height: 1.55;
          padding-left: 16px;
        }
        .interp-block--conditions {
          border-top: 1px solid rgba(42, 47, 64, 0.4);
        }
        .interp-conditions-strip {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .interp-condition-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          padding: 3px 0;
        }
        .interp-condition-name {
          font: 500 11px/1.3 'Courier New', monospace;
          color: #ccd6f6;
        }
        .interp-condition-row[data-severity="HIGH"] .interp-condition-name { color: #ff8a8a; }
        .interp-condition-row[data-severity="ELEVATED"] .interp-condition-name { color: #ffb57a; }
        .interp-condition-domain {
          font: 400 10px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #8a96b2;
        }
        .interp-block--module-teaser {
          border-top: 1px solid rgba(42, 47, 64, 0.4);
        }
        .interp-module-teaser-text {
          font: 500 11px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #8a96b0;
          margin-bottom: 4px;
        }
        .interp-module-teaser-consequence {
          font: 400 10px/1.4 'Courier New', monospace;
          color: #ff9e4a;
          margin-bottom: 4px;
          letter-spacing: 0.02em;
        }
        .interp-module-teaser-cta {
          font: 400 10px/1.4 'Courier New', monospace;
          color: #4a9eff;
          letter-spacing: 0.04em;
        }
        .intel-interp--condition-active {
          border-left: 2px solid #4a9eff;
        }
        .interp-condition-dismiss {
          background: none;
          border: none;
          color: #7a8aaa;
          font-size: 14px;
          cursor: pointer;
          margin-left: auto;
          padding: 2px 6px;
        }
        .interp-condition-dismiss:hover { color: #ccd6f6; }
        .interp-condition-detail {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .interp-condition-title {
          font: 600 14px/1.3 'Courier New', monospace;
          color: #ccd6f6;
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .interp-condition-title[data-severity="HIGH"] { color: #ff8a8a; }
        .interp-condition-title[data-severity="ELEVATED"] { color: #ffb57a; }
        .interp-condition-sev {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-left: auto;
        }
        .interp-condition-consequence {
          font: 400 12px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #a0adc6;
        }
        .interp-condition-targets {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .interp-condition-target-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .domain-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 4px;
          font: 600 11px/1 'Courier New', monospace;
          color: #ccd6f6;
          background: rgba(74, 158, 255, 0.08);
          border: 1px solid rgba(74, 158, 255, 0.2);
          cursor: default;
        }
        .domain-chip[data-severity="CRITICAL"] { background: rgba(255, 107, 107, 0.1); border-color: rgba(255, 107, 107, 0.25); }
        .domain-chip[data-severity="HIGH"] { background: rgba(255, 107, 107, 0.08); border-color: rgba(255, 107, 107, 0.2); }
        .domain-chip[data-severity="ELEVATED"] { background: rgba(255, 158, 74, 0.08); border-color: rgba(255, 158, 74, 0.2); }
        .domain-chip[data-severity="MODERATE"] { background: rgba(255, 215, 0, 0.06); border-color: rgba(255, 215, 0, 0.15); }
        .domain-chip-role {
          font: 400 9px/1 -apple-system, sans-serif;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .intel-interp--domain-focus {
          border-left: 2px solid #4a9eff;
          padding: 12px 14px;
          margin-bottom: 12px;
        }
        .domain-focus-header { margin-bottom: 10px; }
        .domain-focus-name {
          font: 600 15px/1.3 -apple-system, sans-serif;
          color: #ccd6f6;
        }
        .domain-focus-role {
          font: 500 11px/1 'Courier New', monospace;
          color: #4a9eff;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 4px;
        }
        .domain-focus-stats {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }
        .domain-focus-stat {
          font: 400 11px/1 'Courier New', monospace;
          color: #7a8aaa;
        }
        .domain-focus-section {
          margin-top: 10px;
        }
        .domain-focus-condition {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          border-bottom: 1px solid rgba(42, 47, 64, 0.5);
        }
        .domain-focus-condition:last-child { border-bottom: none; }
        .domain-focus-condition-name {
          font: 400 12px/1.4 -apple-system, sans-serif;
          color: #c5cce3;
        }
        .domain-focus-condition-sev {
          font: 600 10px/1 'Courier New', monospace;
          letter-spacing: 0.05em;
        }
        .domain-focus-condition[data-severity="CRITICAL"] .domain-focus-condition-sev { color: #ff6b6b; }
        .domain-focus-condition[data-severity="HIGH"] .domain-focus-condition-sev { color: #ff8a8a; }
        .domain-focus-condition[data-severity="ELEVATED"] .domain-focus-condition-sev { color: #ffb57a; }
        .domain-focus-condition[data-severity="MODERATE"] .domain-focus-condition-sev { color: #ffd700; }
        .domain-focus-source {
          font: 400 11px/1.4 'Courier New', monospace;
          color: #7a8aaa;
        }
        .condition-grouped-entry {
          padding: 10px 14px;
          margin-bottom: 6px;
          background: #12151f;
          border-radius: 6px;
          border-left: 3px solid #2a2f40;
        }
        .condition-grouped-entry[data-severity="CRITICAL"] { border-left-color: #ff6b6b; }
        .condition-grouped-entry[data-severity="HIGH"] { border-left-color: #ff8a8a; }
        .condition-grouped-entry[data-severity="ELEVATED"] { border-left-color: #ffb57a; }
        .condition-grouped-entry[data-severity="MODERATE"] { border-left-color: #ffd700; }
        .condition-grouped-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .condition-grouped-domains {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .condition-grouped-overflow {
          font: 400 12px/1 'Courier New', monospace;
          color: #5a6580;
          padding: 8px 0 4px;
        }
        .interp-condition-target {
          display: flex;
          align-items: baseline;
          gap: 6px;
          padding: 3px 0;
        }
        .interp-condition-target-name {
          font: 600 12px/1 'Courier New', monospace;
          color: #ccd6f6;
        }
        .interp-condition-target-id {
          font: 400 10px/1 'Courier New', monospace;
          color: #7a8aaa;
        }
        .interp-condition-target-role {
          font: 400 10px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #8a96b2;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .interp-condition-field {
          padding-top: 4px;
        }
        .interp-condition-field-value {
          font: 400 11px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #a0adc6;
          margin-top: 2px;
        }
        .interp-condition-surfaces {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 4px;
        }
        .interp-condition-trace-text {
          font: 400 10px/1.4 'Courier New', monospace;
          color: #7a8aaa;
          margin-top: 2px;
        }
        .interp-condition-corridor-group {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 4px 8px;
          margin-top: 4px;
        }
        .interp-condition-corridor-label {
          font: 600 9px/1 'Courier New', monospace;
          letter-spacing: 0.08em;
          flex-shrink: 0;
        }
        .interp-condition-corridor-domain {
          font: 400 11px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ccd6f6;
        }
        .interp-condition-corridor-domain + .interp-condition-corridor-domain::before {
          content: '· ';
          color: #4a5570;
        }
        .interp-condition-corridor-evidence {
          font: 400 9px/1.4 'Courier New', monospace;
          color: #5e6d8a;
          margin-top: 6px;
        }
        .interp-condition-corridor-role {
          font: 400 9px/1.4 'Courier New', monospace;
          color: #64ffda;
          opacity: 0.7;
          margin-left: 4px;
        }
        .propagation-corridor-group .interp-condition-corridor-label {
          color: #64ffda;
        }

        /* ─── Pressure Zone Cognition ─── */
        .interp-condition-zone-section { }
        .interp-condition-zone-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .interp-condition-zone-classification {
          font: 600 9px/1 'Courier New', monospace;
          color: #ff6b6b;
          padding: 2px 6px;
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 2px;
          letter-spacing: 0.5px;
        }
        .interp-condition-zone-id {
          font: 400 9px/1 'Courier New', monospace;
          color: #5e6d8a;
        }
        .interp-condition-zone-signals {
          margin-top: 4px;
        }
        .interp-condition-zone-signal {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 2px 0;
        }
        .interp-condition-zone-signal-id {
          font: 400 9px/1.2 'Courier New', monospace;
          color: #5e6d8a;
          min-width: 52px;
        }
        .interp-condition-zone-signal-name {
          font: 400 10px/1.3 'Courier New', monospace;
          color: #9aa8c7;
        }
        .interp-condition-zone-advisories {
          margin-top: 4px;
        }
        .interp-condition-zone-advisory {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 2px 0 2px 8px;
          border-left: 2px dashed #5e6d8a;
        }
        .interp-condition-zone-advisory-name {
          font: 400 10px/1.3 'Courier New', monospace;
          color: #7a8aaa;
        }
        .interp-condition-zone-advisory-id {
          font: 400 9px/1.2 'Courier New', monospace;
          color: #4a5570;
        }

        /* ─── Compound Convergence Cognition ─── */
        .interp-condition-convergence-section { }
        .interp-condition-convergence-header {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 4px;
        }
        .interp-condition-convergence-factor {
          font: 600 10px/1.2 'Courier New', monospace;
          color: #ff6b6b;
          padding: 1px 5px;
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 2px;
        }
        .interp-condition-escalation {
          font: 400 10px/1.4 'Courier New', monospace;
          color: #ff9e4a;
          margin-bottom: 6px;
        }
        .interp-condition-contributing-list {
          margin-top: 4px;
        }
        .interp-condition-contributing-entry {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 3px 0 3px 8px;
          border-left: 2px solid #4a5570;
        }
        .interp-condition-contributing-entry[data-overlay="PRESSURE_ZONE"] {
          border-left-color: #ff6b6b;
        }
        .interp-condition-contributing-entry[data-overlay="IMPORT_PRESSURE"] {
          border-left-color: #ff9e4a;
        }
        .interp-condition-contributing-entry[data-overlay="PROPAGATION_CORRIDOR"] {
          border-left-color: #64ffda;
        }
        .interp-condition-contributing-entry[data-overlay="CLUSTER_PRESSURE"] {
          border-left-color: #ffd700;
        }
        .interp-condition-contributing-entry[data-overlay="COUPLING_CORRIDOR"] {
          border-left-color: #4a9eff;
        }
        .interp-condition-contributing-title {
          font: 400 10px/1.3 'Courier New', monospace;
          color: #ccd6f6;
          flex: 1;
        }
        .interp-condition-contributing-type {
          font: 400 8px/1 'Courier New', monospace;
          color: #4a5570;
          letter-spacing: 0.3px;
        }

        /* ─── Cluster Gravity Cognition ─── */
        .interp-condition-cluster-section { }
        .interp-condition-cluster-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .interp-condition-cluster-identity {
          font: 600 10px/1.2 'Courier New', monospace;
          color: #ffd700;
          padding: 2px 6px;
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 2px;
          letter-spacing: 0.5px;
        }
        .interp-condition-cluster-metrics {
          margin-top: 4px;
        }
        .interp-condition-cluster-metric {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 2px 0;
        }
        .interp-condition-cluster-composition {
          margin-top: 4px;
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

        /* ── BALANCED — Zone 1: Operational Posture (PRIMARY) ───────── */
        .balanced-zone--posture {
          padding: 40px 0 32px;
          border-bottom: 1px solid rgba(42, 47, 64, 0.25);
          margin-bottom: 28px;
        }
        .balanced-posture-statement {
          font: 400 16px/1.75 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ccd6f6;
          max-width: 660px;
          margin: 0 0 16px;
        }
        .balanced-posture-chips {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .balanced-posture-chip {
          font: 500 10px/1 'Courier New', monospace;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 2px;
          border: 1px solid rgba(42, 47, 64, 0.4);
          color: #8a96b2;
          background: rgba(20, 23, 32, 0.5);
        }
        .balanced-posture-chip[data-tone="critical"] {
          color: #ff6b6b;
          border-color: rgba(255, 107, 107, 0.25);
        }
        .balanced-posture-chip[data-tone="elevated"] {
          color: #ff9e4a;
          border-color: rgba(255, 158, 74, 0.2);
        }
        .balanced-posture-chip[data-tone="nominal"] {
          color: #64ffda;
          border-color: rgba(100, 255, 218, 0.2);
        }
        .balanced-posture-chip[data-tone="muted"] {
          color: #7a8aaa;
          border-color: rgba(42, 47, 64, 0.4);
        }

        /* ── BALANCED — SW-INTEL Enhancement Elements ──────── */
        .balanced-sw-enhancement {
          margin-top: 14px;
          padding: 12px 14px;
          border-left: 2px solid rgba(74, 158, 255, 0.3);
          background: rgba(74, 158, 255, 0.03);
        }
        .balanced-sw-enhancement-tag {
          font: 600 8px/1 'Courier New', monospace;
          color: #4a9eff;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }
        .balanced-sw-enhancement-text {
          font: 400 13px/1.6 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #9aa8c7;
          margin: 0;
        }
        .balanced-sw-enhancement-tag-inline {
          font: 600 9px/1 'Courier New', monospace;
          color: #4a9eff;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .balanced-sw-enhancement-convergence {
          font: 400 13px/1.6 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #9aa8c7;
          margin: 0 0 14px;
        }

        .balanced-zone--reinforcement {
          padding: 20px 0 24px;
          border-bottom: 1px solid rgba(42, 47, 64, 0.25);
          margin-bottom: 12px;
        }
        .balanced-sw-reinforcement-flow {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .balanced-sw-reinforcement-entry {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }
        .balanced-sw-reinforcement-verb {
          font: 600 10px/1 'Courier New', monospace;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          flex-shrink: 0;
          min-width: 90px;
          color: #4a9eff;
        }
        .balanced-sw-reinforcement-entry[data-verb="amplifies"] .balanced-sw-reinforcement-verb { color: #ff9e4a; }
        .balanced-sw-reinforcement-entry[data-verb="widens"] .balanced-sw-reinforcement-verb { color: #ffd700; }
        .balanced-sw-reinforcement-entry[data-verb="concentrates"] .balanced-sw-reinforcement-verb { color: #ff6b6b; }
        .balanced-sw-reinforcement-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .balanced-sw-reinforcement-title {
          font: 500 13px/1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ccd6f6;
        }
        .balanced-sw-reinforcement-sentence {
          font: 400 12px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #7a8aaa;
        }

        .balanced-zone--consequence-story {
          padding: 20px 0 24px;
          border-bottom: 1px solid rgba(42, 47, 64, 0.25);
          margin-bottom: 12px;
        }
        .balanced-sw-consequence-title {
          font: 500 15px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ccd6f6;
          border-left: 2px solid #4a9eff;
          padding-left: 14px;
          margin-bottom: 10px;
        }
        .balanced-sw-consequence-text {
          font: 400 13px/1.65 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #9aa8c7;
          margin: 0 0 10px;
          padding-left: 16px;
        }
        .balanced-sw-consequence-combination {
          font: 400 12px/1.6 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #9aa8c7;
          margin: 0 0 12px;
          padding-left: 16px;
          border-left: 2px solid rgba(255, 158, 74, 0.3);
        }
        .balanced-sw-consequence-combination-chain {
          margin: 0 0 12px;
          padding-left: 16px;
          border-left: 2px solid rgba(255, 158, 74, 0.35);
        }
        .balanced-sw-consequence-combination-flow {
          font: 500 11px/1 'Courier New', monospace;
          color: #ccd6f6;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 2px;
        }
        .balanced-sw-consequence-combination-primitive {
          color: #a8b2d1;
        }
        .balanced-sw-consequence-combination-op {
          color: #5e6d8a;
          padding: 0 2px;
        }
        .balanced-sw-consequence-combination-result {
          color: #ff9e4a;
          font-weight: 600;
        }
        .balanced-sw-consequence-combination-explanation {
          font: 400 12px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #9aa8c7;
          margin: 6px 0 0;
        }
        .balanced-sw-consequence-escalation {
          font: 400 10px/1.4 'Courier New', monospace;
          color: #ff6b6b;
          margin: 4px 0 0;
        }
        .balanced-sw-consequence-conditions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding-left: 16px;
        }
        .balanced-sw-consequence-condition {
          font: 400 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          padding: 3px 8px;
          border: 1px solid #1e2330;
          border-radius: 2px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* ── BALANCED — Ontology Class Grouping ──────── */

        .balanced-zone--class-awareness {
          padding: 20px 0 24px;
          border-bottom: 1px solid rgba(42, 47, 64, 0.25);
          margin-bottom: 12px;
        }
        .balanced-class-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
          margin-bottom: 12px;
        }
        .balanced-class-chip {
          padding: 10px 12px;
          background: rgba(18, 21, 31, 0.6);
          border: 1px solid #1e2330;
          border-left: 2px solid #4a9eff;
        }
        .balanced-class-chip-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }
        .balanced-class-chip-id {
          font: 700 9px/1 'Courier New', monospace;
          color: #4a9eff;
          letter-spacing: 0.08em;
          background: rgba(74, 158, 255, 0.08);
          padding: 2px 5px;
          border: 1px solid rgba(74, 158, 255, 0.15);
        }
        .balanced-class-chip-name {
          font: 600 11px/1 'Courier New', monospace;
          color: #ccd6f6;
          letter-spacing: 0.01em;
        }
        .balanced-class-chip-count {
          font: 500 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          margin-left: auto;
        }
        .balanced-class-chip-question {
          font: 400 11px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #7a8aaa;
          font-style: italic;
        }
        .balanced-class-descent {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 8px;
          border-top: 1px solid rgba(42, 47, 64, 0.2);
        }
        .balanced-class-descent-count {
          font: 400 10px/1 'Courier New', monospace;
          color: #7a8aaa;
        }
        .balanced-class-descent-hint {
          font: 400 10px/1 'Courier New', monospace;
          color: #4a9eff;
          opacity: 0.6;
          margin-left: auto;
        }

        /* ── BALANCED — Zone 2: Pressure Synthesis (SECONDARY) ──────── */
        .balanced-zone--synthesis {
          padding: 28px 0 24px;
          border-bottom: 1px solid rgba(42, 47, 64, 0.25);
          margin-bottom: 24px;
        }
        .balanced-zone-label {
          font: 600 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .balanced-synthesis-theme {
          margin-bottom: 18px;
        }
        .balanced-synthesis-theme:last-of-type {
          margin-bottom: 14px;
        }
        .balanced-synthesis-theme-label {
          font: 500 11px/1 'Courier New', monospace;
          color: #ff9e4a;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .balanced-synthesis-theme-text {
          font: 400 14px/1.7 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #b8c4de;
          max-width: 620px;
          margin: 0;
        }
        .balanced-synthesis-count {
          font: 400 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          letter-spacing: 0.03em;
          padding-top: 4px;
        }
        .balanced-synthesis-disclosure {
          margin-top: 14px;
        }
        .balanced-synthesis-disclosure-toggle {
          font: 400 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          letter-spacing: 0.03em;
          cursor: pointer;
          list-style: none;
        }
        .balanced-synthesis-disclosure-toggle::before {
          content: '▸ ';
        }
        .balanced-synthesis-disclosure[open] .balanced-synthesis-disclosure-toggle::before {
          content: '▾ ';
        }
        .balanced-synthesis-disclosure-toggle::-webkit-details-marker {
          display: none;
        }
        .balanced-synthesis-disclosure-body {
          padding: 12px 0 4px;
        }
        .balanced-synthesis-signal-group {
          margin-bottom: 12px;
        }
        .balanced-synthesis-signal-group-label {
          font: 500 9px/1 'Courier New', monospace;
          color: #7a8aaa;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .balanced-synthesis-signal {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 3px 0;
          max-width: 480px;
        }
        .balanced-synthesis-signal-name {
          font: 400 11px/1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #8a96b2;
        }
        .balanced-synthesis-signal-severity {
          font: 500 9px/1 'Courier New', monospace;
          letter-spacing: 0.04em;
        }
        .balanced-synthesis-signal[data-severity="CRITICAL"] .balanced-synthesis-signal-severity,
        .balanced-synthesis-signal[data-severity="HIGH"] .balanced-synthesis-signal-severity {
          color: #ff6b6b;
        }
        .balanced-synthesis-signal[data-severity="ELEVATED"] .balanced-synthesis-signal-severity {
          color: #ff9e4a;
        }
        .balanced-synthesis-signal[data-severity="MODERATE"] .balanced-synthesis-signal-severity {
          color: #ffd700;
        }
        .balanced-synthesis-signal {
          position: relative;
          cursor: default;
        }
        .balanced-synthesis-signal-tooltip {
          display: none;
          position: absolute;
          left: calc(100% + 16px);
          top: -8px;
          z-index: 20;
          width: 380px;
          background: #12151f;
          border: 1px solid #1e2330;
          border-left: 2px solid rgba(74, 158, 255, 0.25);
          border-radius: 3px;
          padding: 16px 18px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.35);
          opacity: 0;
          animation: balanced-annotation-in 0.15s ease forwards;
        }
        @keyframes balanced-annotation-in {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .balanced-synthesis-signal:hover .balanced-synthesis-signal-tooltip {
          display: block;
        }
        .balanced-synthesis-signal-tooltip-consequence {
          font: 400 12.5px/1.7 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ccd6f6;
          margin-bottom: 12px;
        }
        .balanced-synthesis-signal-tooltip-row {
          font: 400 10px/1.5 'Courier New', monospace;
          color: #8a96b2;
          padding: 3px 0;
        }
        .balanced-synthesis-signal-tooltip-label {
          color: #7a8aaa;
          margin-right: 8px;
        }
        .balanced-synthesis-signal-tooltip-label::after {
          content: ':';
        }

        /* ── Zone 3 — Pressure Anchor (operational epicenter) ── */
        .balanced-zone--anchor {
          padding: 32px 0;
          margin: 12px 0 4px;
          border-top: 1px solid #2a2f40;
          border-bottom: 1px solid #2a2f40;
        }
        .balanced-anchor-label {
          font: 500 9px/1 'Courier New', monospace;
          color: #7a8aaa;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .balanced-anchor-zone-name {
          font: 600 21px/1.2 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ccd6f6;
          letter-spacing: -0.01em;
          margin-bottom: 8px;
        }
        .balanced-zone--anchor[data-tier="HIGH"] .balanced-anchor-zone-name {
          color: #ffb3b3;
        }
        .balanced-zone--anchor[data-tier="ELEVATED"] .balanced-anchor-zone-name {
          color: #ffdbb8;
        }
        .balanced-anchor-statement {
          font: 400 14px/1.65 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #9aa8c7;
          margin-bottom: 20px;
        }
        .balanced-anchor-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .balanced-anchor-meta-tag {
          font: 600 9px/1 'Courier New', monospace;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9aa0bc;
          padding: 3px 8px;
          border: 1px solid #2a2f40;
          border-radius: 2px;
        }
        .balanced-anchor-meta-tag[data-tier="HIGH"] {
          color: #ffb3b3;
          border-color: rgba(255, 107, 107, 0.25);
        }
        .balanced-anchor-meta-tag[data-tier="ELEVATED"] {
          color: #ffdbb8;
          border-color: rgba(255, 158, 74, 0.2);
        }
        .balanced-anchor-meta-sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #2a2f40;
        }
        .balanced-anchor-meta-count {
          font: 400 10px/1 'Courier New', monospace;
          color: #7a8aaa;
        }
        .balanced-anchor-subtitle {
          font: 400 11px/1 'Courier New', monospace;
          color: #7a8aaa;
          letter-spacing: 0.04em;
          margin-bottom: 16px;
        }

        .balanced-anchor-visual {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }
        .balanced-anchor-visual-origin {
          font: 600 12px/1 'Courier New', monospace;
          color: #9aa0bc;
          padding: 4px 10px;
          border: 1px solid #2a2f40;
          border-radius: 2px;
          background: rgba(20, 23, 32, 0.5);
        }
        .balanced-anchor-visual-arrow {
          font: 400 12px/1 'Courier New', monospace;
          color: #4a5570;
        }
        .balanced-anchor-visual-target {
          font: 600 12px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ccd6f6;
          padding: 4px 10px;
          border: 1px solid rgba(74, 158, 255, 0.2);
          border-radius: 2px;
          background: rgba(74, 158, 255, 0.05);
        }
        .balanced-anchor-visual-role {
          font: 500 8px/1 'Courier New', monospace;
          color: #4a5570;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .balanced-anchor-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }
        .balanced-anchor-chip {
          font: 400 9px/1 'Courier New', monospace;
          color: #7a8aaa;
          letter-spacing: 0.03em;
          padding: 4px 10px;
          border: 1px solid #1e2330;
          border-radius: 2px;
        }

        .balanced-anchor-facts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px 24px;
          margin-bottom: 20px;
        }
        .balanced-anchor-fact {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 4px 0;
          border-bottom: 1px solid rgba(26, 32, 48, 0.5);
        }
        .balanced-anchor-fact-key {
          font: 400 9px/1.3 'Courier New', monospace;
          color: #4a5570;
          letter-spacing: 0.03em;
        }
        .balanced-anchor-fact-val {
          font: 400 11px/1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #9aa0bc;
        }
        .balanced-anchor-fact-val[data-tone="critical"] { color: #ff9e9e; }
        .balanced-anchor-fact-val[data-tone="elevated"] { color: #ffdbb8; }

        .balanced-anchor-meaning {
          font: 400 13px/1.65 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #7a8aaa;
        }

        /* ── Zone 4 — Confidence Boundary ── */
        .balanced-zone--confidence {
          padding: 32px 0;
          border-top: 1px solid #1e2330;
        }
        .balanced-confidence-label {
          font: 500 9px/1 'Courier New', monospace;
          color: #7a8aaa;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .balanced-confidence-statement {
          font: 400 13px/1.7 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #9aa0bc;
          margin: 0 0 16px;
          max-width: 600px;
        }
        .balanced-confidence-facts {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 16px;
        }
        .balanced-confidence-fact {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }
        .balanced-confidence-fact-key {
          font: 400 9px/1.3 'Courier New', monospace;
          color: #4a5570;
          letter-spacing: 0.03em;
          min-width: 100px;
        }
        .balanced-confidence-fact-val {
          font: 400 11px/1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #8a96b2;
        }
        .balanced-confidence-bar {
          display: flex;
          height: 6px;
          border-radius: 3px;
          overflow: hidden;
          max-width: 320px;
          margin-bottom: 6px;
        }
        .balanced-confidence-bar-confirmed {
          background: rgba(100, 255, 218, 0.35);
        }
        .balanced-confidence-bar-advisory {
          background: rgba(122, 138, 170, 0.15);
        }
        .balanced-confidence-bar-labels {
          display: flex;
          justify-content: space-between;
          max-width: 320px;
        }
        .balanced-confidence-bar-label {
          font: 400 9px/1 'Courier New', monospace;
          color: #4a5570;
        }

        /* ── Zone 5 — Descent Paths ── */
        .balanced-zone--descent {
          padding: 32px 0 40px;
          border-top: 1px solid #1e2330;
        }
        .balanced-descent-label {
          font: 500 9px/1 'Courier New', monospace;
          color: #7a8aaa;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .balanced-descent-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          max-width: 520px;
        }
        .balanced-descent-card {
          padding: 16px 18px;
          border: 1px solid #1e2330;
          border-radius: 3px;
          background: rgba(18, 21, 31, 0.4);
        }
        .balanced-descent-card-title {
          font: 600 10px/1 'Courier New', monospace;
          color: #9aa0bc;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }
        .balanced-descent-card-desc {
          font: 400 11px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #7a8aaa;
        }

        /* ── BALANCED — Consequence Briefing Corridor ── */
        .balanced-briefing-corridor {
          display: flex;
          flex-direction: column;
          gap: 0;
          max-width: 720px;
          margin: 0 auto;
          padding: 32px 24px;
        }
        .balanced-briefing-posture {
          padding: 0 0 24px;
          border-bottom: 1px solid #1e2330;
        }
        .balanced-briefing-headline {
          font: 400 21px/1.35 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ccd6f6;
          margin: 0 0 10px;
          letter-spacing: -0.01em;
        }
        .balanced-briefing-dynamics {
          font: 400 15px/1.6 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #9aa8c7;
          margin: 0;
        }
        .balanced-briefing-chips {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        .balanced-briefing-chip {
          font: 500 9px/1 'Courier New', monospace;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 2px;
          border: 1px solid #2a2f40;
          color: #7a8aaa;
          background: rgba(26, 30, 43, 0.5);
        }
        .balanced-briefing-chip[data-tone="pressured"] { border-color: rgba(255, 107, 107, 0.3); color: #ff9e9e; }
        .balanced-briefing-chip[data-tone="advisory"] { border-color: rgba(255, 215, 0, 0.2); color: #e6c547; }
        .balanced-briefing-chip[data-tone="qualified"] { border-color: rgba(100, 255, 218, 0.2); color: #64ffda; }

        .balanced-briefing-primary-story {
          padding: 32px 0;
          border-bottom: 1px solid #1e2330;
        }
        .balanced-briefing-story-anchor {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 16px;
        }
        .balanced-briefing-story-label {
          font: 600 28px/1.15 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ccd6f6;
          letter-spacing: -0.02em;
        }
        .balanced-briefing-story-subtitle {
          font: 400 11px/1 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .balanced-briefing-story-title {
          font: 500 16px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ccd6f6;
          margin-bottom: 10px;
          border-left: 2px solid #4a9eff;
          padding-left: 14px;
        }
        .balanced-briefing-story-text {
          font: 400 14px/1.65 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #9aa8c7;
          padding-left: 16px;
        }
        .balanced-briefing-combination {
          font: 400 13px/1.6 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #9aa8c7;
          margin-top: 10px;
          padding-left: 16px;
          border-left: 2px solid rgba(255, 158, 74, 0.3);
        }
        .balanced-briefing-combination-chain {
          margin-top: 12px;
          padding-left: 16px;
          border-left: 2px solid rgba(255, 158, 74, 0.35);
        }
        .balanced-briefing-combination-flow {
          font: 500 11px/1 'Courier New', monospace;
          color: #ccd6f6;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 2px;
        }
        .balanced-briefing-combination-primitive {
          color: #a8b2d1;
        }
        .balanced-briefing-combination-op {
          color: #5e6d8a;
          padding: 0 2px;
        }
        .balanced-briefing-combination-result {
          color: #ff9e4a;
          font-weight: 600;
        }
        .balanced-briefing-combination-explanation {
          font: 400 12px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #9aa8c7;
          margin-top: 6px;
        }
        .balanced-briefing-combination-escalation {
          font: 400 10px/1.4 'Courier New', monospace;
          color: #ff6b6b;
          margin-top: 4px;
        }
        .balanced-briefing-source-conditions {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 14px;
          padding-left: 16px;
        }
        .balanced-briefing-source-condition {
          font: 400 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          padding: 3px 8px;
          border: 1px solid #1e2330;
          border-radius: 2px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .balanced-briefing-facts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          margin-top: 20px;
          background: #1e2330;
          border: 1px solid #1e2330;
          border-radius: 3px;
          overflow: hidden;
        }
        .balanced-briefing-fact {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 10px 14px;
          background: #141720;
        }
        .balanced-briefing-fact-key {
          font: 500 9px/1 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .balanced-briefing-fact-value {
          font: 400 13px/1.3 'Courier New', monospace;
          color: #ccd6f6;
        }
        .balanced-briefing-fact[data-tone="critical"] .balanced-briefing-fact-value { color: #ff9e9e; }

        .balanced-briefing-reinforcement {
          padding: 24px 0;
          border-bottom: 1px solid #1e2330;
        }
        .balanced-briefing-reinforcement-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 14px;
        }
        .balanced-briefing-reinforcement-label {
          font: 500 9px/1 'Courier New', monospace;
          color: #7a8aaa;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .balanced-briefing-reinforcement-count {
          font: 400 11px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #4a5570;
        }
        .balanced-briefing-convergence {
          font: 400 14px/1.6 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #9aa8c7;
          padding: 12px 16px;
          margin-bottom: 16px;
          border-left: 2px solid rgba(74, 158, 255, 0.4);
          background: rgba(74, 158, 255, 0.03);
        }
        .balanced-briefing-flow {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .balanced-briefing-flow-entry {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 10px 14px;
          background: rgba(20, 23, 32, 0.5);
          border: 1px solid #1e2330;
          border-radius: 3px;
        }
        .balanced-briefing-flow-verb {
          font: 600 10px/1.6 'Courier New', monospace;
          color: #4a9eff;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          min-width: 100px;
          flex-shrink: 0;
          padding-top: 2px;
        }
        .balanced-briefing-flow-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .balanced-briefing-flow-title {
          font: 500 13px/1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ccd6f6;
        }
        .balanced-briefing-flow-sentence {
          font: 400 12px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #7a8aaa;
        }
        .balanced-briefing-flow-entry[data-verb="amplifies"] .balanced-briefing-flow-verb { color: #ff9e4a; }
        .balanced-briefing-flow-entry[data-verb="widens"] .balanced-briefing-flow-verb { color: #ffd700; }
        .balanced-briefing-flow-entry[data-verb="concentrates"] .balanced-briefing-flow-verb { color: #ff6b6b; }

        .balanced-briefing-confidence {
          padding: 20px 0;
          border-bottom: 1px solid #1e2330;
        }
        .balanced-briefing-confidence-text {
          font: 400 13px/1.6 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #7a8aaa;
          margin-bottom: 10px;
        }
        .balanced-briefing-confidence-bar {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .balanced-briefing-bar-track {
          height: 8px;
          background: #1a1e2b;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #1e2330;
        }
        .balanced-briefing-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #64ffda, rgba(100, 255, 218, 0.6));
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        .balanced-briefing-bar-labels {
          display: flex;
          justify-content: space-between;
        }
        .balanced-briefing-bar-confirmed {
          font: 400 10px/1 'Courier New', monospace;
          color: #64ffda;
        }
        .balanced-briefing-bar-advisory {
          font: 400 10px/1 'Courier New', monospace;
          color: #7a8aaa;
        }

        .balanced-briefing-descent {
          padding: 20px 0 0;
          display: flex;
          gap: 12px;
        }
        .balanced-briefing-descent-path {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px 14px;
          border: 1px solid #1e2330;
          border-radius: 3px;
          background: rgba(20, 23, 32, 0.3);
        }
        .balanced-briefing-descent-target {
          font: 500 10px/1 'Courier New', monospace;
          color: #4a9eff;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }
        .balanced-briefing-descent-desc {
          font: 400 11px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #7a8aaa;
        }

        /* ── BALANCED — Left panel orientation block ── */
        .interp-block--orientation {
          border-top: 1px solid #1a2030;
          padding-top: 12px;
        }
        .interp-orientation-grid {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 6px;
        }
        .interp-orient-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 3px 0;
        }
        .interp-orient-key {
          font: 400 9px/1.3 'Courier New', monospace;
          color: #4a5570;
          letter-spacing: 0.03em;
        }
        .interp-orient-val {
          font: 400 10px/1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #8a96b2;
          text-align: right;
          max-width: 62%;
        }
        .interp-orient-val[data-tone="critical"] { color: #ff9e9e; }
        .interp-orient-val[data-tone="elevated"] { color: #ffdbb8; }
        .interp-orient-val[data-tone="nominal"] { color: #64ffda; }

        /* ── BALANCED — Side panel compression (not removal) ── */
        .intelligence-field[data-mode="EXECUTIVE_BALANCED"] .intel-support .support-block {
          padding: 10px 16px;
        }
        .intelligence-field[data-mode="EXECUTIVE_BALANCED"] .intel-support .support-label {
          font-size: 8px;
          letter-spacing: 0.16em;
          color: #4a5570;
        }
        .intelligence-field[data-mode="EXECUTIVE_BALANCED"] .intel-support .support-readiness,
        .intelligence-field[data-mode="EXECUTIVE_BALANCED"] .intel-support .support-qualifier-class {
          font-size: 11px;
        }
        .intelligence-field[data-mode="EXECUTIVE_BALANCED"] .intel-support .support-coverage-meta {
          font-size: 9px;
          color: #4a5570;
        }
        .intelligence-field[data-mode="EXECUTIVE_BALANCED"] .support-block--balanced-compressed .emergence-indicator {
          padding: 1px 0;
        }
        .intelligence-field[data-mode="EXECUTIVE_BALANCED"] .support-block--balanced-compressed .emergence-indicator-label {
          font-size: 9px;
        }
        .intelligence-field[data-mode="EXECUTIVE_BALANCED"] .intel-support .support-reports-sub,
        .intelligence-field[data-mode="EXECUTIVE_BALANCED"] .intel-support .support-reports-state {
          display: none;
        }
        .intelligence-field[data-mode="EXECUTIVE_BALANCED"] .intel-support .support-report-item {
          padding: 3px 0;
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
          color: #8a96b2;
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

        /* Signal Family Tags + Grouping */
        .dense-signal-family-tag {
          font: 500 8px/1 'Courier New', monospace;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 2px 5px;
          border-radius: 2px;
          border: 1px solid;
          white-space: nowrap;
        }
        .dense-signal-family-tag[data-family="ISIG"] {
          color: #4a9eff;
          background: rgba(74, 158, 255, 0.08);
          border-color: rgba(74, 158, 255, 0.25);
        }
        .dense-signal-family-tag[data-family="DPSIG"] {
          color: #ff9e4a;
          background: rgba(255, 158, 74, 0.06);
          border-color: rgba(255, 158, 74, 0.2);
        }
        .dense-signal-family-tag[data-family="PSIG"] {
          color: #64ffda;
          background: rgba(100, 255, 218, 0.06);
          border-color: rgba(100, 255, 218, 0.2);
        }
        .dense-signal-level-note {
          font: italic 10px/1.35 'Courier New', monospace;
          color: #a0adc6;
          margin-top: 3px;
          padding-left: 2px;
        }
        .dense-signal-group {
          margin: 10px 0 0;
          padding: 8px 0 0;
          border-top: 1px solid rgba(42, 47, 64, 0.6);
        }
        .dense-signal-group:first-of-type {
          margin-top: 4px;
          border-top: none;
          padding-top: 0;
        }
        .dense-signal-group-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .dense-signal-group-label {
          font: 500 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .dense-signal-group-count {
          font: 600 10px/1 'Courier New', monospace;
          color: #7a8aaa;
        }
        .dense-signal-group[data-family="ISIG"] .dense-signal-group-label { color: #4a9eff; }
        .dense-signal-group[data-family="PSIG"] .dense-signal-group-label { color: #64ffda; }

        /* Translated Signal Cognition Entries */
        .dense-signal-entry--translated {
          padding: 12px 0;
          border-bottom: 1px solid rgba(42, 47, 64, 0.5);
        }
        .dense-signal-entry--translated:last-of-type {
          border-bottom: none;
        }
        .dense-signal-entry--translated .dense-signal-header {
          margin-bottom: 6px;
        }
        .dense-signal-entry--translated .dense-signal-name {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          color: #ccd6f6;
          letter-spacing: 0.01em;
        }
        .dense-signal-consequence {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 12px;
          color: #a0adc6;
          line-height: 1.55;
          margin-bottom: 8px;
        }
        .dense-signal-topology-effect,
        .dense-signal-governance {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 3px 0;
        }
        .dense-signal-effect-label,
        .dense-signal-governance-label {
          font: 500 9px/1 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          min-width: 90px;
          flex-shrink: 0;
        }
        .dense-signal-effect-value {
          font: 400 11px/1.4 'Courier New', monospace;
          color: #8a96b2;
        }
        .dense-signal-governance-value {
          font: 400 11px/1.4 'Courier New', monospace;
          color: #7a8aaa;
        }
        .dense-signal-l2 {
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid rgba(42, 47, 64, 0.3);
        }
        .dense-signal-l2-label {
          font: 500 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          letter-spacing: 0.04em;
        }
        .dense-signal-derivation-toggle {
          display: inline-block;
          margin-top: 6px;
          padding: 0;
          border: none;
          background: none;
          font: 400 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: color 0.15s ease;
        }
        .dense-signal-derivation-toggle:hover {
          color: #a0adc6;
        }
        .dense-signal-derivation {
          margin-top: 4px;
          padding: 6px 8px;
          background: rgba(13, 15, 20, 0.5);
          border-left: 2px solid rgba(42, 47, 64, 0.4);
        }
        .dense-signal-derivation-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 2px 0;
        }
        .dense-signal-derivation-key {
          font: 400 9px/1 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          min-width: 80px;
          flex-shrink: 0;
        }
        .dense-signal-derivation-val {
          font: 400 10px/1 'Courier New', monospace;
          color: #a0adc6;
        }

        /* Synthesized Condition Section */
        .actor--synthesized-conditions {
          margin: 0;
          padding: 10px 14px;
        }
        .actor--module-teaser {
          border: 1px solid rgba(42, 47, 64, 0.4);
          background: rgba(13, 15, 20, 0.4);
        }
        .module-teaser-body {
          padding: 12px 0 4px;
        }
        .module-teaser-headline {
          font: 600 11px/1 'Courier New', monospace;
          color: #4a9eff;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .module-teaser-count {
          font: 400 12px/1.5 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ccd6f6;
          margin-bottom: 4px;
        }
        .module-teaser-prompt {
          font: 400 10px/1.4 'Courier New', monospace;
          color: #5e6d8a;
          margin-bottom: 8px;
        }
        .module-teaser-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .module-teaser-item {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 4px 8px;
          background: rgba(26, 30, 43, 0.5);
          border-left: 2px solid #2a2f40;
        }
        .module-teaser-item[data-severity="CRITICAL"] { border-left-color: #ff6b6b; }
        .module-teaser-item[data-severity="HIGH"] { border-left-color: #ff9e4a; }
        .module-teaser-item[data-severity="ELEVATED"] { border-left-color: #ffd700; }
        .module-teaser-item-severity {
          font: 600 9px/1 'Courier New', monospace;
          color: #5e6d8a;
          letter-spacing: 0.06em;
          min-width: 56px;
        }
        .module-teaser-item[data-severity="CRITICAL"] .module-teaser-item-severity { color: #ff6b6b; }
        .module-teaser-item[data-severity="HIGH"] .module-teaser-item-severity { color: #ff9e4a; }
        .module-teaser-item[data-severity="ELEVATED"] .module-teaser-item-severity { color: #ffd700; }
        .module-teaser-item-title {
          font: 400 11px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #8a96b0;
        }
        .module-teaser-overflow {
          font: 400 10px/1.4 'Courier New', monospace;
          color: #4a5570;
          padding: 2px 8px;
        }
        .module-teaser-consequence {
          font: 400 10px/1.4 'Courier New', monospace;
          color: #ff9e4a;
          padding: 6px 8px 0;
          border-top: 1px solid rgba(42, 47, 64, 0.3);
          margin-top: 4px;
        }
        .condition-primary-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          margin-bottom: 10px;
          background: rgba(13, 15, 20, 0.6);
          border: 1px solid rgba(42, 47, 64, 0.5);
          border-left: 3px solid #ff6b6b;
        }
        .condition-primary-banner[data-severity="CRITICAL"] { border-left-color: #ff6b6b; }
        .condition-primary-banner[data-severity="HIGH"] { border-left-color: #ff9e4a; }
        .condition-primary-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .condition-primary-label {
          font: 600 8px/1 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .condition-primary-title {
          font: 600 13px/1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ccd6f6;
          margin-bottom: 4px;
        }
        .condition-primary-domain {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 2px;
        }
        .condition-primary-domain-name {
          font: 600 11px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #4a9eff;
        }
        .condition-primary-domain-role {
          font: 400 9px/1 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .condition-primary-severity {
          font: 700 9px/1 'Courier New', monospace;
          letter-spacing: 0.06em;
        }
        .condition-primary-severity[data-severity="CRITICAL"] { color: #ff6b6b; }
        .condition-primary-severity[data-severity="HIGH"] { color: #ff9e4a; }

        .condition-group {
          margin-bottom: 8px;
        }
        .condition-group--suppressed {
          opacity: 0.5;
        }
        .condition-group-head {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 0 6px;
        }
        .condition-group-label {
          font: 500 9px/1 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .condition-group[data-group="composite"] .condition-group-label { color: #ff9e4a; }
        .condition-group-count {
          font: 400 9px/1 'Courier New', monospace;
          color: #7a8aaa;
        }

        .condition-entry {
          padding: 10px 0;
          border-bottom: 1px solid rgba(42, 47, 64, 0.4);
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .condition-entry:hover {
          background: rgba(74, 158, 255, 0.03);
        }
        .condition-entry:last-of-type { border-bottom: none; }
        .condition-entry--active {
          background: rgba(74, 158, 255, 0.06);
          border-left: 2px solid #4a9eff;
          padding-left: 10px;
        }
        .condition-entry--composite {
          padding: 10px;
          margin-bottom: 4px;
          background: rgba(255, 158, 74, 0.03);
          border: 1px solid rgba(255, 158, 74, 0.12);
          border-left: 2px solid rgba(255, 158, 74, 0.4);
        }
        .condition-entry--collapsed {
          padding: 5px 0;
          opacity: 0.7;
        }
        .condition-entry--collapsed:hover {
          opacity: 1;
        }
        .condition-entry--collapsed .condition-header {
          margin-bottom: 0;
        }
        .condition-collapsed-domain {
          font-size: 10px;
          color: #7a8aaa;
          margin-left: auto;
        }

        .condition-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .condition-title {
          font: 600 12.5px/1.2 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #ccd6f6;
          flex: 1;
        }
        .condition-severity {
          font: 700 9px/1 'Courier New', monospace;
          letter-spacing: 0.06em;
          padding: 2px 6px;
          border-radius: 2px;
        }
        .condition-severity[data-severity="CRITICAL"] { color: #ff6b6b; background: rgba(255,107,107,0.1); }
        .condition-severity[data-severity="HIGH"] { color: #ff9e4a; background: rgba(255,158,74,0.1); }
        .condition-severity[data-severity="ELEVATED"] { color: #ffd700; background: rgba(255,215,0,0.08); }
        .condition-severity[data-severity="MODERATE"] { color: #7a8aaa; background: rgba(122,138,170,0.08); }
        .condition-severity[data-severity="NOMINAL"] { color: #64ffda; background: rgba(100,255,218,0.06); }

        .condition-consequence {
          font: 400 12px/1.55 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #a0adc6;
          margin-bottom: 8px;
        }
        .condition-targets {
          padding: 6px 0 4px;
        }
        .condition-target-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 3px 0;
        }
        .condition-target-name {
          font: 600 11.5px/1.2 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #4a9eff;
        }
        .condition-target-id {
          font: 400 9px/1 'Courier New', monospace;
          color: #7a8aaa;
        }
        .condition-target-role {
          font: 400 9px/1 'Courier New', monospace;
          color: #8a96b2;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 1px 5px;
          background: rgba(42, 47, 64, 0.3);
          border-radius: 2px;
        }
        .condition-topology-effect,
        .condition-governance {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 3px 0;
        }
        .condition-field-label {
          font: 500 9px/1 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          min-width: 100px;
          flex-shrink: 0;
        }
        .condition-field-value {
          font: 400 11px/1.4 'Courier New', monospace;
          color: #7a8aaa;
        }
        .condition-l2 {
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid rgba(42, 47, 64, 0.3);
        }
        .condition-l2-label {
          font: 500 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          letter-spacing: 0.04em;
        }

        .condition-surface-link {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 6px;
        }
        .condition-surface-link .condition-field-label {
          margin-right: 2px;
        }
        .condition-surface-tag {
          font: 600 10px/1 'Courier New', monospace;
          color: #8ab4f8;
          background: rgba(74, 158, 255, 0.06);
          border: 1px solid rgba(74, 158, 255, 0.12);
          border-radius: 2px;
          padding: 2px 6px;
          letter-spacing: 0.03em;
        }

        .condition-interventions-inline {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
          margin-bottom: 4px;
        }
        .condition-intervention-btn {
          font: 500 10.5px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #a0adc6;
          background: rgba(42, 47, 64, 0.3);
          border: 1px solid rgba(74, 158, 255, 0.15);
          border-radius: 3px;
          padding: 5px 10px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .condition-intervention-btn:hover {
          color: #ccd6f6;
          background: rgba(74, 158, 255, 0.1);
          border-color: rgba(74, 158, 255, 0.3);
        }
        .condition-intervention-btn[data-type="QUALIFY"] {
          border-color: rgba(100, 255, 218, 0.15);
        }
        .condition-intervention-btn[data-type="QUALIFY"]:hover {
          background: rgba(100, 255, 218, 0.08);
          border-color: rgba(100, 255, 218, 0.3);
        }

        .condition-trace-toggle {
          display: inline-block;
          margin-top: 6px;
          padding: 0;
          border: none;
          background: none;
          font: 400 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: color 0.15s ease;
        }
        .condition-trace-toggle:hover {
          color: #a0adc6;
        }

        .condition-trace {
          margin-top: 4px;
          padding: 6px 8px;
          background: rgba(13, 15, 20, 0.5);
          border-left: 2px solid rgba(42, 47, 64, 0.4);
        }
        .condition-trace-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 2px 0;
        }
        .condition-trace-key {
          font: 400 9px/1 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          min-width: 80px;
          flex-shrink: 0;
        }
        .condition-trace-val {
          font: 400 10px/1.3 'Courier New', monospace;
          color: #a0adc6;
        }

        /* Investigation Signal Audit */
        .actor--signal-intelligence {
          margin: 16px 0;
          padding: 14px;
          background: var(--card-deep, #12151f);
          border: 1px solid var(--border-dim, #1e2330);
          border-left: 2px solid #ff9e4a;
        }
        .osi-family-group {
          margin-top: 12px;
        }
        .osi-family-group:first-of-type {
          margin-top: 8px;
        }
        .osi-family-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid var(--border-dim, #1e2330);
        }
        .osi-family-tag {
          font: 600 9px/1 'Courier New', monospace;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 6px;
          border-radius: 2px;
          border: 1px solid #2a2f40;
        }
        .osi-family-tag[data-family="ISIG"] { color: #64ffda; border-color: rgba(100, 255, 218, 0.3); }
        .osi-family-tag[data-family="DPSIG"] { color: #ff9e4a; border-color: rgba(255, 158, 74, 0.3); }
        .osi-family-tag[data-family="PSIG"] { color: #ff6b6b; border-color: rgba(255, 107, 107, 0.3); }
        .osi-family-label {
          font: 500 10px/1 -apple-system, BlinkMacSystemFont, sans-serif;
          color: #8a96b2;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .osi-family-count {
          font: 400 10px/1 'Courier New', monospace;
          color: #5a6a8a;
        }
        .osi-family-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 8px;
        }
        .osi-card {
          padding: 10px 12px;
          background: var(--card-bg, #1a1e2b);
          border: 1px solid var(--border-dim, #1e2330);
          border-radius: 3px;
          border-left: 3px solid #2a2f40;
          transition: border-color 0.15s ease;
        }
        .osi-card[data-severity="HIGH"] { border-left-color: #ff6b6b; }
        .osi-card[data-severity="ELEVATED"] { border-left-color: #ff9e4a; }
        .osi-card[data-severity="MODERATE"] { border-left-color: #ffd700; }
        .osi-card[data-severity="LOW"] { border-left-color: #64ffda; }
        .osi-card[data-severity="NOMINAL"] { border-left-color: #2a2f40; }
        .osi-card[data-severity="ACTIVATED"] { border-left-color: #ffd700; }
        .osi-card-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }
        .osi-card-id {
          font: 400 9px/1 'Courier New', monospace;
          color: #5a6a8a;
        }
        .osi-card-severity {
          font: 600 9px/1 'Courier New', monospace;
          letter-spacing: 0.05em;
          margin-left: auto;
        }
        .osi-card-severity[data-severity="HIGH"] { color: #ff6b6b; }
        .osi-card-severity[data-severity="ELEVATED"] { color: #ff9e4a; }
        .osi-card-severity[data-severity="MODERATE"] { color: #ffd700; }
        .osi-card-severity[data-severity="LOW"] { color: #64ffda; }
        .osi-card-severity[data-severity="NOMINAL"] { color: #5a6a8a; }
        .osi-card-severity[data-severity="ACTIVATED"] { color: #ffd700; }
        .osi-card-title {
          font: 500 12px/1.3 -apple-system, BlinkMacSystemFont, sans-serif;
          color: #ccd6f6;
          margin-bottom: 2px;
        }
        .osi-card-value {
          font: 400 11px/1 'Courier New', monospace;
          color: #8a96b2;
          margin-bottom: 6px;
        }
        .osi-card-interpretation {
          font: 400 11px/1.4 -apple-system, BlinkMacSystemFont, sans-serif;
          color: #8a96b2;
          margin-bottom: 4px;
        }
        .osi-card-concentration {
          font: 400 10px/1.3 'Courier New', monospace;
          color: #7a8aaa;
          margin-bottom: 2px;
        }
        .osi-card-domain-context {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          padding-top: 4px;
          border-top: 1px solid var(--border-dim, #1e2330);
        }
        .osi-card-domain-name {
          font: 500 10px/1 -apple-system, BlinkMacSystemFont, sans-serif;
          color: #9aa6c2;
        }
        .osi-card-domain-conf {
          font: 400 9px/1 'Courier New', monospace;
          color: #7a8aaa;
        }
        .osi-card-domain-advisory {
          font: italic 9px/1 -apple-system, BlinkMacSystemFont, sans-serif;
          color: #ff9e4a;
        }
        .osi-card-note {
          font: italic 10px/1.3 -apple-system, BlinkMacSystemFont, sans-serif;
          color: #7a8aaa;
          margin-top: 2px;
        }
        .actor--signal-evidence-inline {
          margin: 16px 0;
          padding: 14px;
          background: var(--card-deep, #12151f);
          border: 1px solid var(--border-dim, #1e2330);
          border-left: 2px solid #4a9eff;
        }
        .actor--signal-evidence-inline .evidence-grid {
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 10px;
        }
        .actor--signal-evidence-inline .evidence-block {
          padding: 16px 20px;
        }
        .actor--signal-evidence-inline .evidence-block:first-child {
          padding: 16px 20px;
          background: rgba(20, 23, 31, 0.78);
          border-color: #2a334a;
        }
        .actor--signal-evidence-inline .evidence-block:first-child .eb-domain { font-size: 13px; }
        .actor--signal-evidence-inline .evidence-block:first-child .eb-description { font-size: 12px; }
        .actor--signal-evidence-inline .eb-header { flex-wrap: wrap; }
        .actor--signal-audit {
          margin: 16px 0;
          padding: 14px;
          background: var(--card-deep, #12151f);
          border: 1px solid var(--border-dim, #1e2330);
          border-left: 2px solid #ff9e4a;
        }
        .inv-signal-summary {
          display: flex;
          gap: 10px;
          margin: 8px 0;
        }
        .inv-signal-family-chip {
          font: 500 9px/1 'Courier New', monospace;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 2px;
          border: 1px solid;
        }
        .inv-signal-family-chip[data-family="ISIG"] {
          color: #4a9eff;
          background: rgba(74, 158, 255, 0.06);
          border-color: rgba(74, 158, 255, 0.2);
        }
        .inv-signal-family-chip[data-family="DPSIG"] {
          color: #ff9e4a;
          background: rgba(255, 158, 74, 0.06);
          border-color: rgba(255, 158, 74, 0.2);
        }
        .inv-signal-family-chip[data-family="PSIG"] {
          color: #64ffda;
          background: rgba(100, 255, 218, 0.06);
          border-color: rgba(100, 255, 218, 0.2);
        }
        td[data-severity="HIGH"],
        td[data-severity="CRITICAL"] { color: #ff6b6b; }
        td[data-severity="ELEVATED"] { color: #ff9e4a; }
        td[data-severity="ACTIVATED"] { color: #ffd700; }
        td[data-severity="NOMINAL"] { color: #64ffda; }
        .inv-signal-isig-detail {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid var(--border-dim, #1e2330);
        }
        .inv-signal-isig-entry {
          padding: 6px 0;
          border-bottom: 1px solid rgba(30, 35, 48, 0.4);
        }
        .inv-signal-isig-entry:last-child { border-bottom: none; }
        .inv-signal-isig-header {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .inv-signal-isig-name {
          font: 600 11px/1.3 'Courier New', monospace;
          color: #4a9eff;
        }
        .inv-signal-isig-value {
          font: 400 11px/1 'Courier New', monospace;
          color: #ccd6f6;
        }
        .inv-signal-isig-entity {
          font: 400 10px/1.3 'Courier New', monospace;
          color: #8a96b2;
          margin-top: 2px;
        }
        .inv-signal-isig-note {
          font: italic 9px/1.3 'Courier New', monospace;
          color: #a0adc6;
          margin-top: 2px;
        }
        .inv-signal-human-name {
          display: block;
          font: 500 11px/1.3 -apple-system, BlinkMacSystemFont, sans-serif;
          color: #ccd6f6;
        }
        .inv-signal-raw-name {
          display: block;
          font: 400 10px/1.2 'Courier New', monospace;
          color: #5a6a8a;
          margin-top: 1px;
        }

        /* DENSE Governance Lifecycle Zone */
        .actor--governance-lifecycle {
          margin-top: 12px;
          padding: 20px 0 8px;
          border-top: 1px solid rgba(100, 255, 218, 0.1);
        }
        .dense-governance-header {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin: 10px 0;
        }
        .dense-governance-s-level {
          font-family: 'Courier New', monospace;
          font-size: 16px;
          font-weight: 700;
          color: #64ffda;
          padding: 2px 10px;
          background: rgba(100, 255, 218, 0.1);
          border: 1px solid rgba(100, 255, 218, 0.2);
          border-radius: 2px;
        }
        .dense-governance-provenance {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 12px;
          color: #8a96b2;
          text-transform: lowercase;
        }
        .dense-governance-ceiling {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #8a96b2;
        }
        .dense-governance-cert {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 2px;
          background: rgba(100, 255, 218, 0.08);
          color: #64ffda;
          border: 1px solid rgba(100, 255, 218, 0.15);
        }
        .dense-governance-propositions {
          margin: 10px 0;
          padding: 10px 12px;
          background: rgba(26, 30, 43, 0.5);
          border-radius: 3px;
        }
        .dense-governance-prop-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 6px;
        }
        .dense-governance-prop-total {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          font-weight: 600;
          color: #ccd6f6;
        }
        .dense-governance-prop-detail {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 11px;
          color: #7a8aaa;
        }
        .dense-governance-class-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 6px 0;
        }
        .dense-governance-class-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          padding: 2px 6px;
          background: rgba(74, 158, 255, 0.06);
          border: 1px solid rgba(74, 158, 255, 0.1);
          border-radius: 2px;
        }
        .dense-governance-class-count {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          color: #ccd6f6;
        }
        .dense-governance-class-name {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          color: #8a96b2;
          text-transform: lowercase;
          font-size: 9px;
        }
        .dense-governance-confidence {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #8a96b2;
          margin-top: 4px;
        }
        .dense-governance-checks {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 8px 0;
        }
        .dense-governance-check-item {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #7a8aaa;
          padding: 3px 8px;
          border: 1px solid #1e2330;
          border-radius: 2px;
        }
        .dense-governance-check-item[data-status="PASS"] {
          color: #64ffda;
          border-color: rgba(100, 255, 218, 0.15);
        }
        .dense-governance-check-item[data-status="BLOCKED"],
        .dense-governance-check-item[data-status="FAIL"] {
          color: #ff6b6b;
          border-color: rgba(255, 107, 107, 0.15);
        }
        .dense-governance-transitions {
          margin-top: 8px;
        }
        .dense-governance-transition {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 3px 0;
          font-size: 11px;
        }
        .dense-governance-transition-path {
          font-family: 'Courier New', monospace;
          color: #64ffda;
          font-weight: 600;
        }
        .dense-governance-transition-actor {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          color: #8a96b2;
          font-size: 10px;
        }

        /* ── Dense: Behavioral Class View ─── */
        .actor--behavioral-class-view {
          margin-top: 4px;
          padding: 12px 0 8px;
          border-top: 1px solid rgba(42, 47, 64, 0.3);
        }
        .dense-class-summary {
          margin-bottom: 8px;
        }
        .dense-class-summary-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 6px;
        }
        .dense-class-summary-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          background: rgba(26, 30, 43, 0.5);
          border: 1px solid #1e2330;
        }
        .dense-class-summary-chip-id {
          font: 700 8px/1 'Courier New', monospace;
          color: #4a9eff;
          letter-spacing: 0.06em;
        }
        .dense-class-summary-chip-name {
          font: 500 10px/1 'Courier New', monospace;
          color: #ccd6f6;
        }
        .dense-class-summary-chip-count {
          font: 400 9px/1 'Courier New', monospace;
          color: #7a8aaa;
        }
        .dense-class-summary-desc {
          font: 400 10.5px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #7a8aaa;
        }
        .dense-class-toggle {
          background: none;
          border: none;
          font: 400 10px/1 'Courier New', monospace;
          color: #4a9eff;
          cursor: pointer;
          padding: 4px 0;
          letter-spacing: 0.02em;
          opacity: 0.65;
          transition: opacity 0.15s ease;
          text-align: left;
        }
        .dense-class-toggle:hover { opacity: 1; }
        .dense-class-inventory {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .dense-class-group {
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(42, 47, 64, 0.2);
        }
        .dense-class-group:last-child { border-bottom: none; padding-bottom: 0; }
        .dense-class-group-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
        }
        .dense-class-group-id {
          font: 700 9px/1 'Courier New', monospace;
          color: #4a9eff;
          letter-spacing: 0.08em;
          background: rgba(74, 158, 255, 0.08);
          padding: 2px 6px;
          border: 1px solid rgba(74, 158, 255, 0.15);
        }
        .dense-class-group-name {
          font: 600 11px/1 'Courier New', monospace;
          color: #ccd6f6;
          letter-spacing: 0.02em;
        }
        .dense-class-group-count {
          font: 500 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          margin-left: auto;
        }
        .dense-class-group-question {
          font: 400 11px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #7a8aaa;
          font-style: italic;
          margin-bottom: 8px;
          padding-left: 2px;
        }
        .dense-class-group-conditions {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .dense-class-condition {
          padding: 7px 10px;
          background: rgba(26, 30, 43, 0.5);
          border-left: 2px solid #2a2f40;
        }
        .dense-class-condition[data-severity="CRITICAL"] { border-left-color: #ff6b6b; }
        .dense-class-condition[data-severity="HIGH"] { border-left-color: #ff9e4a; }
        .dense-class-condition[data-severity="ELEVATED"] { border-left-color: #ffd700; }
        .dense-class-condition-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 3px;
        }
        .dense-class-condition-name {
          font: 600 11px/1 'Courier New', monospace;
          color: #ccd6f6;
          letter-spacing: 0.01em;
        }
        .dense-class-condition-domain {
          font: 400 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          margin-left: auto;
        }
        .dense-class-condition-severity {
          font: 600 9px/1 'Courier New', monospace;
          letter-spacing: 0.06em;
          padding: 1px 5px;
          background: rgba(42, 47, 64, 0.4);
        }
        .dense-class-condition-severity[data-severity="CRITICAL"] { color: #ff6b6b; }
        .dense-class-condition-severity[data-severity="HIGH"] { color: #ff9e4a; }
        .dense-class-condition-severity[data-severity="ELEVATED"] { color: #ffd700; }
        .dense-class-condition-severity[data-severity="MODERATE"] { color: #ccd6f6; }
        .dense-class-condition-meaning {
          font: 400 11px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #8a94b0;
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

        /* BOARDROOM Governance Intelligence */
        .cockpit-governance-intelligence {
          margin: 20px 0 0;
          padding: 16px 20px;
          background: rgba(100, 255, 218, 0.03);
          border: 1px solid rgba(100, 255, 218, 0.08);
          border-radius: 4px;
        }
        .cockpit-governance-intelligence-label {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #64ffda;
          margin-bottom: 12px;
          opacity: 0.7;
        }
        .cockpit-governance-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 0;
          flex-wrap: wrap;
          border-bottom: 1px solid rgba(42, 47, 64, 0.4);
        }
        .cockpit-governance-row:last-child {
          border-bottom: none;
        }
        .cockpit-governance-badge {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 2px;
          letter-spacing: 0.05em;
        }
        .cockpit-governance-badge--s-level {
          background: rgba(100, 255, 218, 0.12);
          color: #64ffda;
          border: 1px solid rgba(100, 255, 218, 0.2);
        }
        .cockpit-governance-badge--certified {
          background: rgba(100, 255, 218, 0.08);
          color: #64ffda;
          border: 1px solid rgba(100, 255, 218, 0.15);
        }
        .cockpit-governance-badge--certified[data-status="CERTIFIED"] {
          background: rgba(100, 255, 218, 0.12);
        }
        .cockpit-governance-provenance,
        .cockpit-governance-ceiling {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 11px;
          color: #8a96b2;
        }
        .cockpit-governance-detail {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #8a96b2;
        }
        .cockpit-governance-anchor-verdict {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #8a96b2;
        }
        .cockpit-governance-anchor-verdict[data-verdict="PASS"] {
          color: #64ffda;
        }
        .cockpit-governance-anchor-verdict[data-verdict="BLOCKED"] {
          color: #ff6b6b;
        }
        .cockpit-governance-statement {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 12px;
          color: #8a96b2;
          line-height: 1.5;
        }
        .cockpit-governance-statement[data-status="PASS"] {
          color: #64ffda;
        }

        /* Governed BOARDROOM — governance legitimacy envelope */
        .cockpit-governance-intelligence--governed {
          background: rgba(100, 255, 218, 0.02);
          border-color: rgba(100, 255, 218, 0.06);
          padding: 14px 20px;
        }
        .cockpit-governance-intelligence--governed .cockpit-governance-intelligence-label {
          font-size: 9px;
          opacity: 0.5;
          margin-bottom: 10px;
        }
        .cockpit-governance-envelope {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cockpit-governance-sentence {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 12px;
          line-height: 1.55;
          color: #a0adc8;
        }
        .cockpit-governance-authority {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: 0.08em;
          color: #7a8aaa;
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid rgba(42, 47, 64, 0.3);
        }

        /* Governed BOARDROOM — cockpit finding with governed framing */
        .cockpit-finding[data-governed="true"] .cockpit-finding-verdict {
          letter-spacing: 0.06em;
        }
        .cockpit-finding[data-governed="true"][data-found="true"] .cockpit-finding-verdict {
          color: #ffd700;
        }
        .cockpit-finding[data-governed="true"][data-found="false"] .cockpit-finding-verdict {
          color: #64ffda;
        }

        /* Governed BOARDROOM — signal family chips */
        .signal-field-families {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .signal-field-family-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px;
          border: 1px solid rgba(42, 47, 64, 0.5);
          border-radius: 3px;
          background: rgba(20, 23, 32, 0.6);
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #8a96b2;
        }
        .signal-field-family-chip[data-active="true"] {
          border-color: rgba(74, 158, 255, 0.25);
          background: rgba(74, 158, 255, 0.04);
        }
        .signal-field-family-name {
          font-weight: 600;
          letter-spacing: 0.06em;
          color: #8a96b2;
        }
        .signal-field-family-chip[data-active="true"] .signal-field-family-name {
          color: #4a9eff;
        }
        .signal-field-family-caption {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 10px;
          color: #7a8aaa;
        }
        .signal-field-family-count {
          font-size: 9px;
          color: #ff9e4a;
          letter-spacing: 0.04em;
        }

        /* Governed BOARDROOM — governance chips below signal panel */
        .cockpit-governance-chips {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid rgba(42, 47, 64, 0.3);
        }
        .cockpit-gov-chip {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: 0.06em;
          padding: 2px 7px;
          border-radius: 2px;
          background: rgba(42, 47, 64, 0.3);
          color: #8a96b2;
        }
        .cockpit-gov-chip[data-status="PASS"] {
          background: rgba(100, 255, 218, 0.08);
          color: #64ffda;
        }
        .cockpit-gov-chip[data-status="BLOCKED"] {
          background: rgba(255, 107, 107, 0.08);
          color: #ff6b6b;
        }

        /* Governed BOARDROOM — synthesis convergence */
        .cockpit-synthesis-convergence {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 12px;
          color: #8a96b2;
          line-height: 1.55;
          margin-top: 6px;
          font-style: italic;
        }

        /* Governed BOARDROOM — declaration zone tension line */
        .declaration-zone--governed .declaration-boardroom-posture {
          color: #64ffda;
        }
        .declaration-zone--governed .declaration-boardroom-posture[data-level="S2"] {
          color: #64ffda;
        }
        .declaration-zone--governed .declaration-boardroom-posture[data-level="S1"] {
          color: #4a9eff;
        }
        .declaration-boardroom-tension {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          letter-spacing: 0.1em;
          margin-top: 8px;
          color: #8a96b2;
        }
        .declaration-boardroom-tension[data-active="true"] {
          color: #ffd700;
        }
        .declaration-boardroom-tension[data-active="false"] {
          color: #64ffda;
          opacity: 0.7;
        }

        /* Governed BOARDROOM — left panel descent invitation */
        .interp-section-label--descent {
          color: #7a8aaa !important;
          font-size: 9px !important;
          letter-spacing: 0.14em !important;
        }
        .interp-synthesis--descent {
          font-style: italic;
          color: #4a9eff !important;
          font-size: 12px !important;
          opacity: 0.7;
        }
        .interp-synthesis--implication {
          font-style: italic;
          color: #8a96b2 !important;
        }
        .interp-block--implication {
          padding-top: 6px;
          border-top: 1px solid rgba(42, 47, 64, 0.3);
        }
        .interp-synthesis[data-confidence="ADVISORY_BOUND"] { color: #ffd700 !important; }
        .interp-synthesis[data-confidence="GOVERNED"] { color: #64ffda !important; }
        .interp-synthesis[data-confidence="STRUCTURAL_ONLY"] { color: #ff9e4a !important; }

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
          color: #7a8aaa;
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
          color: #7a8aaa;
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
          color: #7a8aaa;
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
          color: #7a8aaa;
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
          color: #7a8aaa;
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
          color: #8a96b2;
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
          color: #8a96b2;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .support-block--visibility {
          padding-top: 14px;
          border-top: 1px solid #1a2030;
        }
        .support-visibility-scope {
          font: 600 11px/1 'Courier New', monospace;
          color: #64ffda;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .support-visibility-scope[data-scope="CODE_CONNECTIVITY"] {
          color: #d29922;
        }
        .support-visibility-scope[data-scope="PARTIAL_CONNECTIVITY"] {
          color: #ff9e4a;
        }
        .support-visibility-profile {
          font: 400 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          margin-top: 4px;
        }
        .support-visibility-bar {
          margin-top: 8px;
          height: 3px;
          background: #1a2030;
          border-radius: 2px;
          overflow: hidden;
        }
        .support-visibility-bar-fill {
          height: 100%;
          background: #d29922;
          border-radius: 2px;
          transition: width 0.3s;
        }
        .support-visibility-bar-fill[data-complete="true"] {
          background: #64ffda;
        }
        .support-visibility-ratio {
          font: 400 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          margin-top: 4px;
        }
        .support-visibility-missing {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 6px;
        }
        .support-visibility-missing-layer {
          font: 400 9px/1.2 'Courier New', monospace;
          color: #d29922;
        }
        .support-block--conditions {
          padding-top: 14px;
          border-top: 1px solid #1a2030;
          gap: 6px;
        }
        .support-condition-item {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 4px;
          padding: 4px 0;
          border-bottom: 1px solid rgba(42, 47, 64, 0.2);
        }
        .support-condition-item:last-child { border-bottom: none; }
        .support-condition-title {
          font: 500 11px/1.3 'Courier New', monospace;
          color: #ccd6f6;
          flex: 1;
          min-width: 0;
        }
        .support-condition-severity {
          font: 600 9px/1 'Courier New', monospace;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          flex-shrink: 0;
        }
        .support-condition-item[data-severity="HIGH"] .support-condition-severity { color: #ff6b6b; }
        .support-condition-item[data-severity="ELEVATED"] .support-condition-severity { color: #ff9e4a; }
        .support-condition-item[data-severity="MODERATE"] .support-condition-severity { color: #ffd700; }
        .support-condition-item[data-severity="LOW"] .support-condition-severity { color: #64ffda; }
        .support-condition-domain {
          font: 400 10px/1 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #8a96b2;
          width: 100%;
        }
        .support-condition-overflow {
          font: 400 10px/1 'Courier New', monospace;
          color: #7a8aaa;
          padding-top: 4px;
        }
        .support-block--condition-focus {
          border-left: 2px solid #4a9eff;
          padding-left: 12px;
        }
        .support-condition-focus-title {
          font: 600 12px/1.3 'Courier New', monospace;
          color: #ccd6f6;
        }
        .support-condition-focus-title[data-severity="HIGH"] { color: #ff8a8a; }
        .support-condition-focus-title[data-severity="ELEVATED"] { color: #ffb57a; }
        .support-condition-intervention {
          padding: 4px 0;
          border-bottom: 1px solid rgba(42, 47, 64, 0.2);
        }
        .support-condition-intervention:last-child { border-bottom: none; }
        .support-condition-intervention-label {
          font: 500 11px/1.3 'Courier New', monospace;
          color: #a0adc6;
          display: block;
        }
        .support-condition-intervention-effect {
          font: 400 10px/1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #7a8aaa;
          display: block;
          margin-top: 2px;
        }
        .support-condition-surface {
          font: 500 11px/1 'Courier New', monospace;
          color: #8ab4f8;
          padding: 2px 0;
        }
        .support-block--reports {
          margin-top: auto;
          padding-top: 22px;
          border-top: 1px solid #1a2030;
          gap: 10px;
        }
        .support-reports-sub {
          font-size: 10px;
          color: #8a96b2;
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
          color: #8a96b2;
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

        /* ── SW-Intel Executive Guide (SupportRail, BOARDROOM + SW-Intel) ─── */
        .support-block--executive-posture {
          border-top: 1px solid #1e2330;
        }
        .support-posture-kv {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 4px;
        }
        .support-posture-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .support-posture-key {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: 0.06em;
          color: #5a6580;
          text-transform: uppercase;
        }
        .support-posture-val {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 11.5px;
          color: #ccd6f6;
          line-height: 1.35;
        }
        .support-posture-val[data-confidence="ADVISORY_BOUND"] { color: #ffd700; }
        .support-posture-val[data-confidence="GOVERNED"] { color: #64ffda; }
        .support-posture-row--implication {
          padding-top: 4px;
          border-top: 1px solid rgba(42, 47, 64, 0.3);
        }
        .support-posture-row--implication .support-posture-val {
          color: #8a96b2;
          font-style: italic;
        }
        .support-sw-intel-descent {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .support-sw-intel-descent-item {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 3px 0;
        }
        .support-sw-intel-descent-target {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          font-weight: 600;
          color: #4a9eff;
          letter-spacing: 0.04em;
          min-width: 90px;
        }
        .support-sw-intel-descent-purpose {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 10.5px;
          color: #7a8aaa;
        }
        .support-sw-intel-confidence {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .support-sw-intel-confidence-class {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: 600;
          color: #ffd700;
        }
        .support-sw-intel-confidence-note {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 10.5px;
          color: #7a8aaa;
          line-height: 1.4;
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
          color: #7a8aaa;
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
          color: #7a8aaa;
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
          color: #7a8aaa;
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

        /* ── Structural Assessment Export ── */
        .support-block--assessment {
          border-top: 1px solid #2a2f40;
          padding-top: 8px;
        }
        .support-assessment-sub {
          font-size: 10px;
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
          margin-top: 2px;
          line-height: 1.4;
        }
        .assessment-export-trigger {
          margin-top: 8px;
          padding: 8px 12px;
          background: rgba(74, 158, 255, 0.08);
          border: 1px solid #4a9eff;
          color: #4a9eff;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          text-transform: uppercase;
          transition: background 0.15s ease, color 0.15s ease;
          width: 100%;
          text-align: center;
        }
        .assessment-export-trigger:hover {
          background: rgba(74, 158, 255, 0.16);
          color: #ccd6f6;
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
        .rep-field--operator::after {
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
          color: #8a96b2;
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
        .rep-evstate-coverage-meta { color: #8a96b2; }
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
          color: #8a96b2;
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
          --tier-color: #8a96b2;
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
          --tier-color: #8a96b2;
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

        /* ── OPERATOR — Evidence Trace Field ───────────────────────── */
        .rep-field--operator .rep-trace-stack {
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
          --tier-color: #8a96b2;
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
          color: #8a96b2;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        /* ── Shared zone label ───────────────────────────────────────────── */
        .zone-label {
          font-size: 9px;
          color: #7a8aaa;
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

        /* Topology Maturity Badge + Registry View */
        .topo-maturity-badge {
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 2px;
          margin-left: 8px;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          border: 1px solid;
        }
        .topo-maturity-badge--structural-registry {
          color: #8a96b2;
          border-color: #2a2f40;
          background: rgba(30,35,48,0.4);
        }
        .topo-maturity-badge--graph-enriched {
          color: #7a8aaa;
          border-color: #2a2f40;
          background: rgba(30,35,48,0.5);
        }
        .topo-maturity-badge--authority-enriched {
          color: #4a9eff;
          border-color: rgba(74,158,255,0.3);
          background: rgba(74,158,255,0.06);
        }
        .topo-maturity-badge--pressure-enriched {
          color: #ffd700;
          border-color: rgba(255,215,0,0.3);
          background: rgba(255,215,0,0.06);
        }
        .topo-maturity-badge--semantic-projection {
          color: #64ffda;
          border-color: rgba(100,255,218,0.3);
          background: rgba(100,255,218,0.06);
        }
        .topo-maturity-description {
          font-size: 10px;
          color: #8a96b2;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin-bottom: 12px;
          line-height: 1.4;
        }
        .topo-registry-compact {
          border: 1px solid #1e2330;
          border-radius: 3px;
          background: rgba(18,21,31,0.5);
          padding: 12px 14px;
        }
        .topo-registry-heading {
          font-size: 10px;
          color: #8a96b2;
          letter-spacing: 0.18em;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          margin-bottom: 10px;
        }
        .topo-registry-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 4px;
        }
        .topo-registry-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 2px;
          background: rgba(20,23,32,0.4);
          border-left: 2px solid #1e2330;
        }
        .topo-registry-item--anchor {
          border-left-color: #ffd700;
        }
        .topo-registry-item-id {
          font-size: 9px;
          color: #7a8aaa;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          flex-shrink: 0;
          width: 44px;
        }
        .topo-registry-item-name {
          font-size: 10px;
          color: #8a96b2;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .topo-registry-item-count {
          font-size: 9px;
          color: #7a8aaa;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          flex-shrink: 0;
        }
        .topo-registry-expand {
          margin-top: 10px;
          font-size: 10px;
          color: #4a9eff;
          cursor: pointer;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          text-align: center;
          padding: 6px;
          border: 1px solid #1e2330;
          border-radius: 2px;
          transition: background 0.15s ease;
        }
        .topo-registry-expand:hover {
          background: rgba(74,158,255,0.06);
        }

        /* Structural Spines Panel */
        .topo-spines-panel {
          margin-bottom: 16px;
          padding: 12px 14px;
          border: 1px solid #1e2330;
          border-radius: 3px;
          background: rgba(18,21,31,0.6);
        }
        .topo-spines-heading {
          font-size: 10px;
          color: #8a96b2;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 10px;
        }
        .topo-spines-dual {
          display: flex;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .topo-spines-dual-tag {
          font-size: 10px;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          color: #ccd6f6;
          padding: 4px 10px;
          border: 1px solid;
          border-radius: 2px;
          background: rgba(20,23,32,0.7);
        }
        .topo-spines-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 6px;
          margin-bottom: 10px;
        }
        .topo-spine-card {
          padding: 8px 10px;
          border: 1px solid #1e2330;
          border-radius: 2px;
          background: rgba(20,23,32,0.4);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .topo-spine-card-rank {
          font-size: 9px;
          color: #8a96b2;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          font-weight: 600;
        }
        .topo-spine-card-path {
          font-size: 11px;
          color: #ccd6f6;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .topo-spine-card-role {
          font-size: 9px;
          color: #7a8aaa;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .topo-spine-card-metrics {
          display: flex;
          gap: 8px;
          margin-top: 2px;
        }
        .topo-spine-metric {
          font-size: 9px;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          color: #7a8aaa;
        }
        .topo-spine-metric[data-type="import"] { color: #4a9eff; }
        .topo-spine-metric[data-type="inherit"] { color: #64ffda; }
        .topo-spines-roles {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .topo-spine-role-chip {
          font-size: 9px;
          color: #7a8aaa;
          padding: 2px 8px;
          border: 1px solid #1e2330;
          border-radius: 2px;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          letter-spacing: 0.06em;
        }

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
        .topo-coverage-card:hover { border-color: #7a8aaa; }
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
          color: #8a96b2;
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
          color: #7a8aaa;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .footnote-path { font-size: 12px; color: #8a96b2; letter-spacing: 0.03em; }
        .footnote-sep { color: #7a8aaa; }
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
        .evidence-block:hover { border-color: #7a8aaa; }
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
          color: #7a8aaa;
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
          color: #7a8aaa;
          letter-spacing: 0.1em;
          flex-shrink: 0;
          transition: color 0.15s;
        }
        .gov-back:hover { color: var(--state-color); }

        /* ── Governance Ribbon — OPERATOR Posture Split ──────────────── */
        .gov-ribbon--operator {
          flex-direction: column;
          align-items: stretch;
          gap: 0;
          padding: 10px 48px 8px;
        }
        .gov-posture {
          display: flex;
          align-items: center;
          gap: 0;
          flex-wrap: wrap;
        }
        .gov-posture .gov-label {
          margin-right: 20px;
        }
        .gov-posture-fields {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 20px;
          flex: 1;
        }
        .gov-posture-field {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
        .gov-posture-label {
          font-size: 7px;
          color: #4a5570;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .gov-posture-value {
          font-size: 11px;
          font-family: 'Courier New', monospace;
          color: #ccd6f6;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .gov-invariants {
          margin-top: 4px;
        }
        .gov-invariants-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          padding: 3px 0;
          cursor: pointer;
          font-family: inherit;
        }
        .gov-invariants-summary {
          font-size: 8px;
          color: #4a5570;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: color 0.15s;
        }
        .gov-invariants-toggle:hover .gov-invariants-summary {
          color: #7a8aaa;
        }
        .gov-invariants-caret {
          font-size: 8px;
          color: #4a5570;
          transition: color 0.15s;
        }
        .gov-invariants-toggle:hover .gov-invariants-caret {
          color: #7a8aaa;
        }
        .gov-invariants-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 14px;
          padding: 6px 0 2px;
        }
        .gov-ribbon--operator .gov-back {
          margin-left: 0;
          margin-top: 6px;
          align-self: flex-start;
        }

        /* ════════════════════════════════════════════════════════════════
         * DISCLOSURE SHELL — CINEMATIC VISUAL DOCTRINE
         * PI.LENS.V2.PHASE3.CINEMATIC-VISUAL-DOCTRINE.01
         *
         * Tier semantics:
         *   tier0 — command declaration: calm, undeniable, minimal density
         *   tier1 — operational context: stable rhythm, low-friction scan
         *   tier2 — exploratory depth: recessed, lower interruption
         *   tier3 — operator immersion: isolated, intentionally deep
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

        /* Tier 3 — operator immersion layer
         * Isolated from the executive flow. Darker atmospheric
         * ground signals forensic depth. The reader has
         * intentionally entered operator territory. */
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
          content: 'OPERATOR DEPTH';
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
        .disclosure-shell[data-persona="OPERATOR_DENSE"] {
          --tier-gap-3: 32px;
        }
        .disclosure-shell[data-persona="OPERATOR_DENSE"] .disclosure-tier--3 {
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
          color: #8a96b2;
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
          color: #7a8aaa;
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
        .recon-zone-trend--insufficient_data { color: #7a8aaa; }

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
          color: #8a96b2;
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
          color: #8a96b2;
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
          color: #8a96b2;
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
          color: #8a96b2;
          flex: 1;
        }

        .recon-debt-item-type {
          font-size: 9px;
          color: #7a8aaa;
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
        .recon-domain-name { color: #8a96b2; flex: 1; }
        .recon-domain-dom { color: #8a96b2; min-width: 50px; }

        .recon-domain-status {
          font-size: 9px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .recon-domain-status--reconciled { color: #64ffda; }
        .recon-domain-status--unreconciled { color: #7a8aaa; }

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
          color: #7a8aaa;
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
          color: #7a8aaa;
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
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 2px;
        }

        .recon-drilldown-val {
          font-size: 10px;
          color: #8a96b2;
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
          color: #7a8aaa;
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
          color: #7a8aaa;
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
          --tier-color: #8a96b2;
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
          --tier-color: #8a96b2;
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
        .actor-topo-summary-sep { color: #7a8aaa; }

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
          color: #8a96b2;
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
        .actor-cluster-enrichment {
          display: flex;
          gap: 4px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 10px;
          font-size: 11px;
          color: #8a96b2;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
        }
        .actor-cluster-enrichment strong {
          color: #ccd6f6;
        }
        .actor-cluster-enrichment-sep {
          color: #7a8aaa;
          margin: 0 2px;
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
          --tier-color: #8a96b2;
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
          color: #8a96b2;
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
          color: #8a96b2;
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

        /* ── Software Intelligence Module ─────────────────────────────── */
        .sw-intel-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border: 1px solid #2a2f40;
          border-radius: 4px;
          background: #12151f;
          color: #7a8aaa;
          font-size: 10px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          margin-left: 12px;
        }
        .sw-intel-toggle:hover { border-color: #4a9eff; color: #ccd6f6; }
        .sw-intel-toggle--active {
          border-color: #4a9eff;
          background: rgba(74,158,255,0.08);
          color: #4a9eff;
        }
        .sw-intel-toggle-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4a5570;
          transition: background 0.15s;
        }
        .sw-intel-toggle--active .sw-intel-toggle-dot { background: #4a9eff; }

        .sw-intel-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid #2a2f40;
          border-radius: 4px;
          background: #12151f;
          margin-bottom: 16px;
        }
        .sw-intel-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4a5570;
        }
        .sw-intel-status[data-state="AVAILABLE"] .sw-intel-status-dot { background: #4a9eff; }
        .sw-intel-status[data-state="INVALID"] .sw-intel-status-dot { background: #ff6b6b; }
        .sw-intel-status-label {
          font-size: 10px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.12em;
          color: #ccd6f6;
          text-transform: uppercase;
        }
        .sw-intel-status-type {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.08em;
          color: #7a8aaa;
          margin-left: auto;
        }

        .sw-intel-view {
          padding: 0 0 16px;
          margin-top: 16px;
          border-top: 1px solid #1e2330;
        }
        .sw-intel-view--dense .sw-intel-panel,
        .sw-intel-view--operator .sw-intel-panel { margin-bottom: 12px; }

        .sw-intel-view-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0 8px;
        }
        .sw-intel-view-module-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #4a9eff;
          text-transform: uppercase;
          font-family: 'Courier New', monospace;
        }
        .sw-intel-deactivate-btn {
          margin-left: auto;
          background: none;
          border: 1px solid #2a2f40;
          border-radius: 3px;
          color: #8a96b2;
          cursor: pointer;
          font-size: 12px;
          padding: 2px 8px;
          line-height: 1;
          transition: color 0.15s, border-color 0.15s;
        }
        .sw-intel-deactivate-btn:hover { color: #ccd6f6; border-color: #7a8aaa; }

        /* ─── Verification Protocol Entry (OPERATOR) ─── */

        .sw-intel-verify-btn {
          background: none;
          border: 1px solid #2a2f40;
          border-radius: 3px;
          color: #8a96b2;
          cursor: pointer;
          font-size: 10px;
          font-weight: 700;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.1em;
          padding: 3px 10px;
          line-height: 1;
          transition: color 0.15s, border-color 0.15s, background 0.15s;
        }
        .sw-intel-verify-btn:hover:not(:disabled) { color: #ccd6f6; border-color: #7a8aaa; background: rgba(74, 158, 255, 0.06); }
        .sw-intel-verify-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .sw-intel-verification-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: 1px solid #2a2f40;
          border-radius: 3px;
          color: #8a96b2;
          cursor: pointer;
          font-size: 10px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
          padding: 2px 8px;
          line-height: 1;
          transition: border-color 0.15s, background 0.15s;
        }
        .sw-intel-verification-badge:hover { background: rgba(74, 158, 255, 0.06); border-color: #7a8aaa; }
        .sw-intel-verification-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7a8aaa;
        }
        .sw-intel-verification-badge[data-verdict="VERIFIED"] { border-color: rgba(100, 255, 218, 0.3); color: #64ffda; }
        .sw-intel-verification-badge[data-verdict="VERIFIED"] .sw-intel-verification-dot { background: #64ffda; }
        .sw-intel-verification-badge[data-verdict="PARTIALLY_VERIFIED"] { border-color: rgba(255, 215, 0, 0.3); color: #ffd700; }
        .sw-intel-verification-badge[data-verdict="PARTIALLY_VERIFIED"] .sw-intel-verification-dot { background: #ffd700; }
        .sw-intel-verification-badge[data-verdict="VERIFICATION_FAILED"] { border-color: rgba(255, 107, 107, 0.3); color: #ff6b6b; }
        .sw-intel-verification-badge[data-verdict="VERIFICATION_FAILED"] .sw-intel-verification-dot { background: #ff6b6b; }
        .sw-intel-verification-badge[data-verdict="CANNOT_INVESTIGATE"] { border-color: #2a2f40; color: #7a8aaa; }
        .sw-intel-verification-badge[data-verdict="CANNOT_INVESTIGATE"] .sw-intel-verification-dot { background: #4a5570; }

        /* ─── Verification Protocol Section (Inline OPERATOR) ─── */

        .verification-protocol-section {
          margin-top: 12px;
          border: 1px solid #2a2f40;
          border-radius: 6px;
          background: #12151f;
        }
        .verification-protocol-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #1e2330;
        }
        .verification-protocol-title {
          font-size: 11px;
          color: #8a96b2;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 500;
          font-family: 'Courier New', monospace;
        }
        .verification-protocol-collapse {
          background: none;
          border: 1px solid #2a2f40;
          color: #7a8aaa;
          font-size: 14px;
          width: 26px;
          height: 26px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s, border-color 0.15s;
        }
        .verification-protocol-collapse:hover { color: #ccd6f6; border-color: #7a8aaa; }

        .verification-verdict {
          margin: 12px 16px 10px;
          padding: 12px 16px;
          border-radius: 4px;
          border-left: 3px solid #7a8aaa;
          background: #141720;
        }
        .verification-verdict[data-verdict="VERIFIED"] { border-left-color: #64ffda; }
        .verification-verdict[data-verdict="PARTIALLY_VERIFIED"] { border-left-color: #ffd700; }
        .verification-verdict[data-verdict="VERIFICATION_FAILED"] { border-left-color: #ff6b6b; }
        .verification-verdict[data-verdict="CANNOT_INVESTIGATE"] { border-left-color: #4a5570; }
        .verification-verdict-label {
          font-size: 14px;
          font-weight: 700;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }
        .verification-verdict[data-verdict="VERIFIED"] .verification-verdict-label { color: #64ffda; }
        .verification-verdict[data-verdict="PARTIALLY_VERIFIED"] .verification-verdict-label { color: #ffd700; }
        .verification-verdict[data-verdict="VERIFICATION_FAILED"] .verification-verdict-label { color: #ff6b6b; }
        .verification-verdict[data-verdict="CANNOT_INVESTIGATE"] .verification-verdict-label { color: #7a8aaa; }
        .verification-verdict-meta {
          font-size: 11px;
          color: #8a96b2;
          font-family: 'Courier New', monospace;
        }
        .verification-verdict-ts {
          font-size: 10px;
          color: #5e6d8a;
          margin-top: 3px;
          font-family: 'Courier New', monospace;
        }
        .verification-verdict-failures {
          font-size: 11px;
          color: #ff6b6b;
          margin-top: 4px;
          font-family: 'Courier New', monospace;
        }

        .verification-steps {
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .verification-replay-section {
          padding: 2px 16px 0;
        }
        .verification-step {
          padding: 10px 12px;
          border-radius: 4px;
          border-left: 3px solid #2a2f40;
          background: #141720;
          position: relative;
        }
        .verification-step::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 1px;
          height: 2px;
          background: #1e2330;
        }
        .verification-step[data-verdict="PASS"] { border-left-color: #64ffda; }
        .verification-step[data-verdict="FAIL"] { border-left-color: #ff6b6b; }
        .verification-step[data-verdict="INSUFFICIENT"] { border-left-color: #ffd700; }
        .verification-step-header {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }
        .verification-step-header:hover .verification-step-name { color: #e0e6ff; }
        .verification-step-number {
          font-size: 10px;
          font-weight: 700;
          color: #5e6d8a;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.1em;
          min-width: 48px;
        }
        .verification-step-name {
          font-size: 12px;
          color: #ccd6f6;
          font-family: 'Courier New', monospace;
          flex: 1;
          transition: color 0.15s;
        }
        .verification-step-verdict {
          font-size: 10px;
          font-weight: 700;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.08em;
        }
        .verification-step[data-verdict="PASS"] .verification-step-verdict { color: #64ffda; }
        .verification-step[data-verdict="FAIL"] .verification-step-verdict { color: #ff6b6b; }
        .verification-step[data-verdict="INSUFFICIENT"] .verification-step-verdict { color: #ffd700; }
        .verification-step-expand {
          font-size: 10px;
          color: #5e6d8a;
          font-family: 'Courier New', monospace;
          width: 14px;
          text-align: center;
          transition: color 0.15s;
        }
        .verification-step-header:hover .verification-step-expand { color: #8a96b2; }
        .verification-step-summary {
          font-size: 11px;
          color: #7a8aaa;
          margin-top: 4px;
          padding-left: 56px;
          font-family: 'Courier New', monospace;
        }
        .verification-step-insufficient {
          font-size: 11px;
          color: #ffd700;
          margin-top: 4px;
          padding-left: 56px;
          font-family: 'Courier New', monospace;
          opacity: 0.8;
        }
        .verification-step-failures {
          margin-top: 6px;
          padding-left: 56px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .verification-failure {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .verification-failure-type {
          font-size: 11px;
          font-weight: 700;
          color: #ff6b6b;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }
        .verification-failure-detail {
          font-size: 11px;
          color: #8a96b2;
          font-family: 'Courier New', monospace;
          line-height: 1.4;
        }
        .verification-failure-severity {
          font-size: 9px;
          color: #5e6d8a;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ─── Verification Proof Detail (Expandable) ─── */

        .verification-proof-detail {
          margin-top: 8px;
          padding: 8px 0 4px 56px;
          border-top: 1px solid #1e2330;
        }

        .vp-proof-table {
          display: flex;
          flex-direction: column;
          gap: 1px;
          font-size: 10px;
          font-family: 'Courier New', monospace;
        }
        .vp-proof-row {
          display: flex;
          gap: 8px;
          padding: 4px 8px;
          background: #0d0f14;
          border-radius: 2px;
          align-items: flex-start;
        }
        .vp-proof-row--header {
          background: none;
          border-bottom: 1px solid #1e2330;
          padding-bottom: 4px;
          margin-bottom: 2px;
        }
        .vp-proof-row--header .vp-proof-cell {
          color: #5e6d8a;
          font-weight: 700;
          letter-spacing: 0.08em;
          font-size: 9px;
        }
        .vp-proof-cell {
          color: #8a96b2;
          min-width: 80px;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .vp-proof-cell--id {
          color: #ccd6f6;
          flex: 0 0 auto;
          min-width: 120px;
          max-width: 200px;
          word-break: break-all;
        }
        .vp-proof-cell--wide {
          flex: 2;
        }
        .vp-proof-cell--mono {
          color: #ccd6f6;
        }
        .vp-proof-cell[data-match="yes"] { color: #64ffda; }
        .vp-proof-cell[data-match="no"] { color: #ff6b6b; }
        .vp-proof-cell[data-match="skip"] { color: #5e6d8a; }

        .vp-proof-tag {
          display: inline-block;
          padding: 1px 6px;
          margin: 1px 2px;
          border-radius: 2px;
          background: rgba(74, 158, 255, 0.06);
          border: 1px solid #1e2330;
          color: #8a96b2;
          font-size: 10px;
          font-family: 'Courier New', monospace;
          white-space: nowrap;
        }
        .vp-proof-tag[data-ref-type="condition"] { border-color: rgba(100, 255, 218, 0.15); color: #64ffda; }
        .vp-proof-tag[data-ref-type="consequence"] { border-color: rgba(74, 158, 255, 0.15); color: #4a9eff; }
        .vp-proof-tag[data-rule-status="valid"] { border-color: rgba(100, 255, 218, 0.15); }
        .vp-proof-tag[data-rule-status="unknown"] { border-color: rgba(255, 107, 107, 0.15); color: #ff6b6b; }
        .vp-proof-none {
          color: #4a5570;
          font-style: italic;
        }

        .vp-proof-traces {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .vp-proof-trace-block {
          padding: 6px 8px;
          background: #0d0f14;
          border-radius: 2px;
        }
        .vp-proof-trace-label {
          font-size: 10px;
          font-weight: 700;
          color: #ccd6f6;
          font-family: 'Courier New', monospace;
          margin-bottom: 4px;
        }
        .vp-proof-trace-chain {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          align-items: center;
        }
        .vp-proof-trace-step {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .vp-proof-trace-node {
          font-size: 10px;
          padding: 1px 5px;
          border-radius: 2px;
          font-family: 'Courier New', monospace;
          background: rgba(74, 158, 255, 0.06);
          border: 1px solid #1e2330;
          color: #8a96b2;
        }
        .vp-proof-trace-node[data-node-type="condition"] { border-color: rgba(100, 255, 218, 0.15); color: #64ffda; }
        .vp-proof-trace-node[data-node-type="consequence"] { border-color: rgba(74, 158, 255, 0.15); color: #4a9eff; }
        .vp-proof-trace-node[data-node-type="combination"] { border-color: rgba(255, 215, 0, 0.15); color: #ffd700; }
        .vp-proof-trace-arrow {
          font-size: 10px;
          color: #4a5570;
          font-family: 'Courier New', monospace;
        }
        .vp-proof-trace-rule {
          font-size: 9px;
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
          padding: 0 2px;
        }

        .vp-proof-combinations {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .vp-proof-combo-block {
          padding: 6px 8px;
          background: #0d0f14;
          border-radius: 2px;
        }
        .vp-proof-combo-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .vp-proof-combo-meta {
          font-size: 10px;
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
        }
        .vp-proof-combo-rule {
          font-size: 10px;
          color: #5e6d8a;
          font-family: 'Courier New', monospace;
          margin-bottom: 4px;
        }
        .vp-proof-combo-contributors {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 4px;
        }
        .vp-proof-combo-contrib-label {
          font-size: 10px;
          color: #5e6d8a;
          font-family: 'Courier New', monospace;
        }
        .vp-proof-combo-escalation {
          font-size: 10px;
          color: #ffd700;
          font-family: 'Courier New', monospace;
          margin-top: 4px;
        }

        .vp-proof-replay {
          font-family: 'Courier New', monospace;
        }
        .vp-proof-replay-detail {
          padding: 4px 8px;
          background: #0d0f14;
          border-radius: 2px;
        }
        .vp-proof-replay-line {
          font-size: 10px;
          color: #8a96b2;
          line-height: 1.6;
        }
        .vp-proof-replay-divergence {
          font-size: 10px;
          color: #ff6b6b;
          line-height: 1.6;
        }

        /* ─── Cognition Node Explanations ─── */

        .vp-explanation {
          padding: 8px 12px;
          margin: 2px 0 8px 0;
          border-left: 2px solid #1e2330;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.5;
        }
        .vp-explanation--rule {
          margin-bottom: 10px;
          border-left-color: #2a2f40;
        }
        .vp-explanation-name {
          font-size: 12px;
          color: #9aa6c2;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .vp-explanation-text {
          font-size: 11px;
          color: #8a96b2;
        }
        .vp-operational-implication {
          font-size: 11px;
          color: #9aa6c2;
          margin-top: 4px;
        }
        .vp-graph-context {
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .vp-graph-direction {
          font-size: 11px;
          color: #6a7a9a;
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0;
        }
        .vp-graph-arrow {
          margin-right: 6px;
          color: #4a5570;
          font-family: 'Courier New', monospace;
        }
        .vp-graph-ref {
          color: #7a8aaa;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .vp-graph-ref:hover {
          color: #9aa6c2;
          text-decoration: underline;
          text-decoration-color: #3a4a6a;
          text-underline-offset: 2px;
        }
        .vp-proof-trace-human {
          display: inline;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 10px;
          color: #6a7a9a;
          margin-left: 4px;
        }
        .vp-proof-trace-human::before {
          content: '(';
        }
        .vp-proof-trace-human::after {
          content: ')';
        }

        .verification-protocol-footer {
          padding: 10px 16px;
          font-size: 10px;
          color: #4a5570;
          font-family: 'Courier New', monospace;
          text-align: center;
          letter-spacing: 0.05em;
        }

        /* ─── Cognition Surface Rendering ─── */

        .sw-intel-surfaces {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sw-intel-surface {
          border: 1px solid #1e2330;
          border-radius: 4px;
          background: #141720;
          padding: 14px 16px;
          border-left: 3px solid #4a5570;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .sw-intel-surface:hover { background: #181c28; }
        .sw-intel-surface[data-severity="HIGH"] { border-left-color: #ff6b6b; }
        .sw-intel-surface[data-severity="ELEVATED"] { border-left-color: #ff9e4a; }
        .sw-intel-surface[data-severity="MODERATE"] { border-left-color: #ffd700; }
        .sw-intel-surface[data-severity="LOW"] { border-left-color: #64ffda; }
        .sw-intel-surface--active {
          background: #181c28;
          border-color: #3a4060;
        }
        .sw-intel-surface--active[data-severity="HIGH"] { border-left-color: #ff6b6b; border-color: rgba(255, 107, 107, 0.25); border-left-color: #ff6b6b; }
        .sw-intel-surface--active[data-severity="ELEVATED"] { border-color: rgba(255, 158, 74, 0.25); border-left-color: #ff9e4a; }
        .sw-intel-surface--active[data-severity="MODERATE"] { border-color: rgba(255, 215, 0, 0.2); border-left-color: #ffd700; }
        .sw-intel-surface--active[data-severity="LOW"] { border-color: rgba(100, 255, 218, 0.2); border-left-color: #64ffda; }

        .sw-intel-surface-condition-link {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 6px;
          padding-bottom: 6px;
          border-bottom: 1px solid #1e2330;
        }
        .sw-intel-condition-tag {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 2px 6px;
          border-radius: 2px;
          background: rgba(74, 158, 255, 0.08);
          color: #8ab4f8;
          border: 1px solid rgba(74, 158, 255, 0.15);
        }
        .sw-intel-condition-tag[data-severity="HIGH"] {
          background: rgba(255, 107, 107, 0.08);
          color: #ff8a8a;
          border-color: rgba(255, 107, 107, 0.15);
        }
        .sw-intel-condition-tag[data-severity="ELEVATED"] {
          background: rgba(255, 158, 74, 0.08);
          color: #ffb57a;
          border-color: rgba(255, 158, 74, 0.15);
        }
        .sw-intel-condition-tag[data-severity="MODERATE"] {
          background: rgba(255, 215, 0, 0.08);
          color: #ffe066;
          border-color: rgba(255, 215, 0, 0.15);
        }

        .sw-intel-surface-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .sw-intel-surface-icon {
          font-size: 15px;
          line-height: 1;
          flex-shrink: 0;
        }
        .sw-intel-surface-name {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          font-weight: 600;
          color: #ccd6f6;
          letter-spacing: 0.02em;
        }
        .sw-intel-surface-severity {
          margin-left: auto;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .sw-intel-surface-summary {
          font-size: 12.5px;
          color: #9aa0bc;
          line-height: 1.5;
          margin-bottom: 6px;
        }
        .sw-intel-surface-consequence {
          font-size: 11.5px;
          color: #7a8aaa;
          line-height: 1.45;
          font-style: italic;
          margin-bottom: 8px;
        }

        .sw-intel-surface-domains {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 8px;
        }
        .sw-intel-surface-domain-tag {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #7a8aaa;
          background: rgba(74,158,255,0.06);
          border: 1px solid #1e2330;
          border-radius: 2px;
          padding: 2px 6px;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sw-intel-surface-domain-more {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #7a8aaa;
          padding: 2px 4px;
        }

        .sw-intel-surface-expand {
          background: none;
          border: none;
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          cursor: pointer;
          padding: 4px 0;
          letter-spacing: 0.04em;
          transition: color 0.15s ease;
        }
        .sw-intel-surface-expand:hover { color: #7a8aaa; }

        .sw-intel-surface-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid #12151f;
        }
        .sw-intel-surface-density {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #7a8aaa;
          letter-spacing: 0.04em;
        }

        /* ─── Surface Detail (expandable) ─── */

        .sw-intel-surface-detail {
          border: 1px solid #12151f;
          border-radius: 3px;
          background: #12151f;
          padding: 8px 10px;
          margin: 6px 0;
        }
        .sw-intel-surface-detail-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding: 3px 0;
          border-bottom: 1px solid rgba(30,35,48,0.5);
        }
        .sw-intel-surface-detail-row:last-child { border-bottom: none; }
        .sw-intel-surface-detail-row--warn {
          border-left: 2px solid #ff9e4a;
          padding-left: 8px;
        }
        .sw-intel-surface-detail-label {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          min-width: 80px;
          flex-shrink: 0;
        }
        .sw-intel-surface-detail-value {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #9aa0bc;
          word-break: break-word;
        }

        /* ─── Propagation Chain ─── */

        .sw-intel-surface-propagation-chain {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 4px;
        }
        .sw-intel-surface-chain-node {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .sw-intel-surface-chain-arrow {
          color: #7a8aaa;
          font-size: 12px;
        }
        .sw-intel-surface-chain-domain {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #ccd6f6;
          background: rgba(74,158,255,0.06);
          padding: 2px 6px;
          border-radius: 2px;
          border: 1px solid #1e2330;
        }
        .sw-intel-surface-chain-node[data-role="ORIGIN"] .sw-intel-surface-chain-domain {
          border-color: rgba(255,107,107,0.3);
        }
        .sw-intel-surface-chain-node[data-role="PASS_THROUGH"] .sw-intel-surface-chain-domain {
          border-color: rgba(255,158,74,0.3);
        }
        .sw-intel-surface-chain-node[data-role="RECEIVER"] .sw-intel-surface-chain-domain {
          border-color: rgba(255,215,0,0.3);
        }
        .sw-intel-surface-chain-role {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ─── Peak Severity Strip ─── */

        .sw-intel-peak-strip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: #12151f;
          border: 1px solid #1e2330;
          border-radius: 3px;
          margin-bottom: 10px;
        }
        .sw-intel-peak-indicator {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }
        .sw-intel-peak-count {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #7a8aaa;
        }
        .sw-intel-peak-elevated {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #ff9e4a;
          margin-left: auto;
        }

        /* ─── Boardroom Narrative ─── */

        .sw-intel-boardroom-narrative {
          font-size: 12px;
          color: #ccd6f6;
          line-height: 1.55;
          padding: 8px 10px;
          margin-bottom: 10px;
          background: rgba(74, 158, 255, 0.04);
          border-left: 2px solid #4a9eff;
          border-radius: 0 2px 2px 0;
        }

        /* ─── Boardroom Surface Cards ─── */

        .sw-intel-boardroom-surface {
          padding: 8px 10px;
          border-left: 2px solid #4a5570;
          margin-bottom: 8px;
        }
        .sw-intel-boardroom-surface[data-severity="HIGH"] { border-left-color: #ff6b6b; }
        .sw-intel-boardroom-surface[data-severity="ELEVATED"] { border-left-color: #ff9e4a; }
        .sw-intel-boardroom-surface-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .sw-intel-boardroom-surface-name {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: 600;
          color: #ccd6f6;
        }
        .sw-intel-boardroom-surface-severity {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          font-weight: 600;
          margin-left: auto;
        }
        .sw-intel-boardroom-surface-summary {
          font-size: 11.5px;
          color: #9aa0bc;
          line-height: 1.45;
        }
        .sw-intel-boardroom-more {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #7a8aaa;
          padding-top: 4px;
        }

        /* ─── SW-Intel Cognition Spine (BOARDROOM augmentation) ─── */

        .cockpit-sw-intel-spine {
          margin: 14px 0;
          padding: 16px 18px;
          background: rgba(18, 21, 31, 0.7);
          border: 1px solid #1e2330;
          border-left: 2px solid #4a9eff;
        }
        .cockpit-sw-intel-spine-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(42, 47, 64, 0.4);
        }
        .cockpit-sw-intel-spine-badge {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #4a9eff;
          background: rgba(74, 158, 255, 0.08);
          padding: 2px 6px;
          border: 1px solid rgba(74, 158, 255, 0.2);
        }
        .cockpit-sw-intel-spine-count {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #9aa0bc;
        }
        .cockpit-sw-intel-spine-posture {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          margin-left: auto;
        }
        .cockpit-sw-intel-spine-posture[data-severity="CRITICAL"] { color: #ff6b6b; }
        .cockpit-sw-intel-spine-posture[data-severity="HIGH"] { color: #ff9e4a; }
        .cockpit-sw-intel-spine-posture[data-severity="ELEVATED"] { color: #ffd700; }
        .cockpit-sw-intel-spine-posture[data-severity="MODERATE"] { color: #ccd6f6; }

        .cockpit-convergence-web {
          margin: 6px 0 12px 0;
        }
        .cockpit-convergence-web svg {
          display: block;
          width: 100%;
        }

        .cockpit-sw-intel-slices {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 12px;
        }
        .cockpit-sw-intel-slice {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 10px;
          background: rgba(26, 30, 43, 0.5);
          border-left: 2px solid #2a2f40;
          transition: border-color 0.15s ease;
        }
        .cockpit-sw-intel-slice[data-severity="CRITICAL"] { border-left-color: #ff6b6b; }
        .cockpit-sw-intel-slice[data-severity="HIGH"] { border-left-color: #ff9e4a; }
        .cockpit-sw-intel-slice[data-severity="ELEVATED"] { border-left-color: #ffd700; }

        .cockpit-sw-intel-slice-glyph {
          flex-shrink: 0;
          margin-top: 2px;
        }
        .cockpit-sw-intel-slice-body {
          min-width: 0;
          flex: 1;
        }
        .cockpit-sw-intel-slice-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .cockpit-sw-intel-slice-name {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: 600;
          color: #ccd6f6;
          letter-spacing: 0.01em;
        }
        .cockpit-sw-intel-slice-domain {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #7a8aaa;
          margin-left: auto;
        }
        .cockpit-sw-intel-slice-confidence {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: 0.04em;
          padding: 1px 5px;
          background: rgba(42, 47, 64, 0.4);
        }
        .cockpit-sw-intel-slice-confidence[data-confidence="GOVERNED"] { color: #64ffda; }
        .cockpit-sw-intel-slice-confidence[data-confidence="ADVISORY_BOUND"] { color: #ffd700; }
        .cockpit-sw-intel-slice-confidence[data-confidence="STRUCTURAL_ONLY"] { color: #ff9e4a; }

        .cockpit-sw-intel-slice-meaning {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 11.5px;
          color: #8a94b0;
          line-height: 1.45;
        }

        .cockpit-sw-intel-synthesis {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 12px;
          color: #bcc6e0;
          line-height: 1.5;
          padding: 8px 10px;
          background: rgba(26, 30, 43, 0.3);
          border-top: 1px solid rgba(42, 47, 64, 0.4);
        }

        /* ─── SW-Intel Posture Block (BOARDROOM) ─── */

        .cockpit-sw-intel-themes {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 14px;
        }
        .cockpit-sw-intel-theme {
          padding: 10px 12px;
          background: rgba(26, 30, 43, 0.5);
          border-left: 2px solid #2a2f40;
        }
        .cockpit-sw-intel-theme[data-severity="CRITICAL"] { border-left-color: #ff6b6b; }
        .cockpit-sw-intel-theme[data-severity="HIGH"] { border-left-color: #ff9e4a; }
        .cockpit-sw-intel-theme[data-severity="ELEVATED"] { border-left-color: #ffd700; }
        .cockpit-sw-intel-theme-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .cockpit-sw-intel-theme-label {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          font-weight: 600;
          color: #ccd6f6;
          letter-spacing: 0.01em;
        }
        .cockpit-sw-intel-theme-severity {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.06em;
          margin-left: auto;
          padding: 1px 5px;
          background: rgba(42, 47, 64, 0.4);
        }
        .cockpit-sw-intel-theme-severity[data-severity="CRITICAL"] { color: #ff6b6b; }
        .cockpit-sw-intel-theme-severity[data-severity="HIGH"] { color: #ff9e4a; }
        .cockpit-sw-intel-theme-severity[data-severity="ELEVATED"] { color: #ffd700; }
        .cockpit-sw-intel-theme-severity[data-severity="MODERATE"] { color: #ccd6f6; }
        .cockpit-sw-intel-theme-bar {
          height: 4px;
          background: rgba(42, 47, 64, 0.3);
          margin-bottom: 6px;
          overflow: hidden;
        }
        .cockpit-sw-intel-theme-bar-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
        .cockpit-sw-intel-theme-bar-fill[data-severity="CRITICAL"] { background: rgba(255, 107, 107, 0.7); }
        .cockpit-sw-intel-theme-bar-fill[data-severity="HIGH"] { background: rgba(255, 158, 74, 0.7); }
        .cockpit-sw-intel-theme-bar-fill[data-severity="ELEVATED"] { background: rgba(255, 215, 0, 0.6); }
        .cockpit-sw-intel-theme-bar-fill[data-severity="MODERATE"] { background: rgba(74, 158, 255, 0.5); }
        .cockpit-sw-intel-theme-desc {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 11px;
          color: #8a94b0;
          line-height: 1.4;
        }
        .cockpit-sw-intel-concentration {
          padding: 10px 12px;
          background: rgba(18, 21, 31, 0.4);
          border: 1px solid rgba(42, 47, 64, 0.3);
        }
        .cockpit-sw-intel-concentration-label {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #7a8aaa;
          margin-bottom: 8px;
        }
        .cockpit-sw-intel-concentration-row {
          display: grid;
          grid-template-columns: 1fr 40px 100px;
          align-items: center;
          gap: 8px;
          padding: 4px 0;
        }
        .cockpit-sw-intel-concentration-domain {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #ccd6f6;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cockpit-sw-intel-concentration-weight {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #9aa0bc;
          text-align: right;
        }
        .cockpit-sw-intel-concentration-bar {
          height: 4px;
          background: rgba(42, 47, 64, 0.3);
          overflow: hidden;
        }
        .cockpit-sw-intel-concentration-bar-fill {
          height: 100%;
          background: rgba(74, 158, 255, 0.55);
          transition: width 0.3s ease;
        }
        .cockpit-sw-intel-posture-detail {
          margin-top: 12px;
        }

        .cockpit-sw-intel-posture-block {
          margin-top: 2px;
        }
        .cockpit-sw-intel-posture-narrative {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 13px;
          color: #bcc6e0;
          line-height: 1.65;
          margin-bottom: 14px;
        }
        .cockpit-sw-intel-posture-domains {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-top: 10px;
          border-top: 1px solid rgba(42, 47, 64, 0.35);
        }
        .cockpit-sw-intel-posture-domain {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 6px 10px;
          min-width: 0;
        }
        .cockpit-sw-intel-posture-domain-name {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: 600;
          color: #ccd6f6;
          letter-spacing: 0.01em;
          flex-shrink: 0;
        }
        .cockpit-sw-intel-posture-domain-weight {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #7a8aaa;
          margin-left: auto;
          white-space: nowrap;
        }
        .cockpit-sw-intel-posture-domain-risk-shape {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #a8b2d1;
          font-style: italic;
          width: 100%;
          padding-left: 1px;
        }
        .cockpit-sw-intel-posture-disclosure {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(42, 47, 64, 0.35);
        }
        .cockpit-sw-intel-posture-disclosure-toggle {
          background: none;
          border: none;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #4a9eff;
          cursor: pointer;
          padding: 0;
          letter-spacing: 0.02em;
          opacity: 0.7;
          transition: opacity 0.15s ease;
        }
        .cockpit-sw-intel-posture-disclosure-toggle:hover {
          opacity: 1;
        }

        /* ─── Operational Confidence ─── */

        .cockpit-operational-confidence {
          margin: 8px 0;
          padding: 8px 12px;
          background: rgba(18, 21, 31, 0.5);
          border: 1px solid #1e2330;
        }
        .cockpit-operational-confidence-label {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #7a8aaa;
          margin-bottom: 6px;
        }
        .cockpit-operational-confidence-items {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 11.5px;
          color: #9aa0bc;
          line-height: 1.4;
        }
        .cockpit-operational-confidence-sep {
          color: #2a2f40;
        }
        .cockpit-operational-confidence-item[data-level="ADVISORY_BOUND"] { color: #ffd700; }
        .cockpit-operational-confidence-item[data-level="GOVERNED"] { color: #64ffda; }
        .cockpit-operational-confidence-item[data-level="STRUCTURAL_ONLY"] { color: #ff9e4a; }

        /* ─── Balanced Section Severity ─── */

        .sw-intel-balanced-section-severity {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          margin-left: 8px;
        }
        .sw-intel-balanced-section-consequence {
          font-size: 11px;
          color: #5a6380;
          font-style: italic;
          line-height: 1.4;
          margin-top: 4px;
        }

        .sw-intel-panel {
          border: 1px solid #1e2330;
          border-radius: 4px;
          background: #141720;
          padding: 12px 16px;
        }
        .sw-intel-panel-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .sw-intel-panel-code {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.14em;
          color: #4a9eff;
          padding: 2px 6px;
          background: rgba(74,158,255,0.06);
          border-radius: 2px;
        }
        .sw-intel-panel-title {
          font-size: 12px;
          font-weight: 600;
          color: #ccd6f6;
          letter-spacing: 0.04em;
        }
        .sw-intel-panel-count {
          font-size: 10px;
          color: #7a8aaa;
          margin-left: auto;
          font-family: 'Courier New', monospace;
        }

        .sw-intel-trace {
          font-size: 9px;
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
          margin-top: 6px;
          letter-spacing: 0.04em;
        }

        /* Attention panel */
        .sw-intel-attention-list { display: flex; flex-direction: column; gap: 8px; }
        .sw-intel-attention-item {
          padding: 8px 12px;
          background: #1a1e2b;
          border-radius: 3px;
          border-left: 3px solid #4a5570;
        }
        .sw-intel-attention-item[data-severity="HIGH"] { border-left-color: #ff6b6b; }
        .sw-intel-attention-item[data-severity="ELEVATED"] { border-left-color: #ff9e4a; }
        .sw-intel-attention-item[data-severity="MODERATE"] { border-left-color: #ffd700; }
        .sw-intel-attention-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .sw-intel-attention-severity {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.12em;
          font-weight: 600;
        }
        .sw-intel-attention-name {
          font-size: 11px;
          color: #ccd6f6;
          font-weight: 500;
        }
        .sw-intel-attention-statement {
          font-size: 12px;
          color: #9aa0bc;
          line-height: 1.5;
        }
        .sw-intel-attention-trace {
          font-size: 8px;
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
          margin-top: 4px;
        }

        /* Pressure panel */
        .sw-intel-pressure-list { display: flex; flex-direction: column; gap: 8px; }
        .sw-intel-pressure-item {
          padding: 8px 12px;
          background: #1a1e2b;
          border-radius: 3px;
        }
        .sw-intel-pressure-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .sw-intel-pressure-type {
          font-size: 10px;
          color: #ccd6f6;
          font-family: 'Courier New', monospace;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .sw-intel-pressure-family {
          font-size: 9px;
          padding: 1px 5px;
          border-radius: 2px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.08em;
        }
        .sw-intel-pressure-family[data-family="DPSIG"] { color: #4a9eff; background: rgba(74,158,255,0.08); }
        .sw-intel-pressure-family[data-family="ISIG"] { color: #64ffda; background: rgba(100,255,218,0.08); }
        .sw-intel-pressure-family[data-family="PSIG"] { color: #ffd700; background: rgba(255,215,0,0.08); }
        .sw-intel-pressure-severity {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.1em;
          margin-left: auto;
        }
        .sw-intel-pressure-statement {
          font-size: 12px;
          color: #9aa0bc;
          line-height: 1.5;
        }
        .sw-intel-pressure-concentration {
          font-size: 11px;
          color: #7a8aaa;
          margin-top: 2px;
        }

        /* Execution corridors */
        .sw-intel-corridor-flow {
          display: flex;
          align-items: stretch;
          gap: 0;
        }
        .sw-intel-corridor-node {
          display: flex;
          align-items: center;
          gap: 0;
          flex: 1;
        }
        .sw-intel-corridor-arrow {
          font-size: 16px;
          color: #7a8aaa;
          padding: 0 8px;
          flex-shrink: 0;
        }
        .sw-intel-corridor-card {
          flex: 1;
          padding: 10px 12px;
          background: #1a1e2b;
          border-radius: 3px;
          border-top: 2px solid #2a2f40;
        }
        .sw-intel-corridor-node[data-role="ORIGIN"] .sw-intel-corridor-card { border-top-color: #ff6b6b; }
        .sw-intel-corridor-node[data-role="PASS_THROUGH"] .sw-intel-corridor-card { border-top-color: #ff9e4a; }
        .sw-intel-corridor-node[data-role="RECEIVER"] .sw-intel-corridor-card { border-top-color: #ffd700; }
        .sw-intel-corridor-role {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.12em;
          color: #7a8aaa;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .sw-intel-corridor-domain {
          font-size: 13px;
          color: #ccd6f6;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .sw-intel-corridor-desc {
          font-size: 11px;
          color: #9aa0bc;
          line-height: 1.4;
          margin-bottom: 4px;
        }
        .sw-intel-corridor-grounding {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          color: #7a8aaa;
          letter-spacing: 0.06em;
        }
        .sw-intel-corridor-grounding[data-grounding="Q-00"] { color: #64ffda; }

        /* Coordination spines */
        .sw-intel-spine-list { display: flex; flex-direction: column; gap: 4px; }
        .sw-intel-spine-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 6px 10px;
          background: #1a1e2b;
          border-radius: 3px;
        }
        .sw-intel-spine-rank {
          font-size: 10px;
          font-family: 'Courier New', monospace;
          color: #4a9eff;
          min-width: 24px;
          padding-top: 2px;
        }
        .sw-intel-spine-body { flex: 1; min-width: 0; }
        .sw-intel-spine-path {
          font-size: 11px;
          color: #ccd6f6;
          font-family: 'Courier New', monospace;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sw-intel-spine-role { margin-top: 2px; }
        .sw-intel-spine-role-tag {
          font-size: 9px;
          color: #7a8aaa;
          padding: 1px 6px;
          background: rgba(122,138,170,0.08);
          border-radius: 2px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.06em;
        }
        .sw-intel-spine-role-tag[data-role="hub"] { color: #ff9e4a; background: rgba(255,158,74,0.08); }
        .sw-intel-spine-role-tag[data-role="spine"] { color: #4a9eff; background: rgba(74,158,255,0.08); }
        .sw-intel-spine-role-tag[data-role="bridge"] { color: #ffd700; background: rgba(255,215,0,0.08); }
        .sw-intel-spine-metrics {
          display: flex;
          gap: 10px;
          margin-top: 2px;
          font-size: 10px;
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
        }

        /* Validation posture */
        .sw-intel-validation-grid { display: flex; flex-direction: column; gap: 8px; }
        .sw-intel-validation-coverage-bar {
          height: 6px;
          background: #1a1e2b;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 4px;
        }
        .sw-intel-validation-coverage-fill {
          height: 100%;
          background: #4a9eff;
          border-radius: 3px;
          transition: width 0.3s;
        }
        .sw-intel-validation-coverage-label {
          font-size: 11px;
          color: #9aa0bc;
        }
        .sw-intel-validation-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 11px;
        }
        .sw-intel-validation-key {
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          letter-spacing: 0.06em;
        }
        .sw-intel-validation-value { color: #ccd6f6; }

        /* Deployment risk */
        .sw-intel-risk-level {
          font-size: 10px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.12em;
          font-weight: 600;
          margin-left: auto;
        }
        .sw-intel-risk-level[data-level="LOW"] { color: #64ffda; }
        .sw-intel-risk-level[data-level="MODERATE"] { color: #ffd700; }
        .sw-intel-risk-level[data-level="ELEVATED"] { color: #ff6b6b; }
        .sw-intel-risk-statement {
          font-size: 12px;
          color: #ccd6f6;
          line-height: 1.5;
          margin-bottom: 4px;
        }
        .sw-intel-risk-detail {
          font-size: 10px;
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
        }

        /* Qualification cognition */
        .sw-intel-qual-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }
        .sw-intel-qual-level {
          font-size: 18px;
          font-weight: 700;
          color: #ccd6f6;
          font-family: 'Courier New', monospace;
        }
        .sw-intel-qual-ceiling {
          font-size: 10px;
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.06em;
        }
        .sw-intel-qual-eligible {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.12em;
          padding: 2px 8px;
          border-radius: 2px;
          margin-left: auto;
        }
        .sw-intel-qual-eligible[data-eligible="true"] { color: #64ffda; background: rgba(100,255,218,0.08); }
        .sw-intel-qual-eligible[data-eligible="false"] { color: #ff6b6b; background: rgba(255,107,107,0.08); }
        .sw-intel-qual-statement {
          font-size: 12px;
          color: #9aa0bc;
          line-height: 1.5;
        }
        .sw-intel-qual-meta {
          font-size: 10px;
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
          margin-top: 4px;
        }

        /* Topology roles */
        .sw-intel-role-grid { display: flex; flex-direction: column; gap: 6px; }
        .sw-intel-role-item { }
        .sw-intel-role-bar-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 2px;
        }
        .sw-intel-role-name {
          font-size: 11px;
          color: #ccd6f6;
        }
        .sw-intel-role-count {
          font-size: 10px;
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
        }
        .sw-intel-role-bar {
          height: 4px;
          background: #1a1e2b;
          border-radius: 2px;
          overflow: hidden;
        }
        .sw-intel-role-bar-fill {
          height: 100%;
          background: #4a9eff;
          border-radius: 2px;
        }

        /* Domain role abstractions */
        .sw-intel-domain-summary {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }
        .sw-intel-domain-chip {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 2px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.06em;
        }
        .sw-intel-domain-chip--anchor { color: #ffd700; background: rgba(255,215,0,0.08); }
        .sw-intel-domain-chip--backed { color: #64ffda; background: rgba(100,255,218,0.08); }
        .sw-intel-domain-chip--semantic { color: #7a8aaa; background: rgba(122,138,170,0.08); }
        .sw-intel-domain-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 4px 8px;
          border-radius: 2px;
          font-size: 11px;
        }
        .sw-intel-domain-row:nth-child(odd) { background: rgba(26,30,43,0.5); }
        .sw-intel-domain-name { color: #ccd6f6; font-weight: 500; }
        .sw-intel-domain-role { color: #7a8aaa; font-size: 10px; }
        .sw-intel-domain-row[data-backing="SEMANTIC_ONLY"] .sw-intel-domain-name { color: #7a8aaa; }
        .sw-intel-domain-toggle {
          display: block;
          width: 100%;
          padding: 6px;
          margin-top: 6px;
          background: none;
          border: 1px solid #1e2330;
          border-radius: 3px;
          color: #7a8aaa;
          font-size: 10px;
          font-family: 'Courier New', monospace;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .sw-intel-domain-toggle:hover { border-color: #4a9eff; color: #ccd6f6; }

        /* Evidence footer */
        .sw-intel-evidence-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          margin-top: 8px;
          border-top: 1px solid #1e2330;
          font-size: 9px;
          font-family: 'Courier New', monospace;
          color: #7a8aaa;
          letter-spacing: 0.06em;
        }
        .sw-intel-evidence-sep { color: #2a2f40; }

        /* Qualification Context Strip — ambient one-line */
        .sw-intel-context-strip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          margin-bottom: 10px;
          background: rgba(20,23,31,0.7);
          border: 1px solid #1e2330;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          flex-wrap: wrap;
        }
        .sw-intel-context-axis {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .sw-intel-context-label {
          color: #7a8aaa;
          text-transform: uppercase;
        }
        .sw-intel-context-value {
          font-weight: 600;
        }
        .sw-intel-context-sep {
          display: inline-block;
          width: 1px;
          height: 10px;
          background: #2a2f40;
          margin: 0 2px;
        }
        .sw-intel-context-qclass {
          color: #ffd700;
          font-weight: 600;
        }
        .sw-intel-context-slevel {
          color: #4a9eff;
          font-weight: 600;
        }

        /* Guided Action Flow — orchestrated LENS→SQO coordination */
        .sw-intel-guided-flow {
          margin-top: 14px;
          border: 1px solid #1e2330;
          border-radius: 4px;
          background: #12151f;
          overflow: hidden;
        }
        .sw-intel-guided-flow-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-bottom: 1px solid #1e2330;
          background: rgba(20,23,31,0.5);
        }
        .sw-intel-guided-flow-title {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: 600;
          color: #ccd6f6;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .sw-intel-guided-flow-count {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #7a8aaa;
          letter-spacing: 0.04em;
        }
        .sw-intel-guided-flow-high {
          color: #ff6b6b;
          font-weight: 600;
        }
        .sw-intel-guided-flow-list {
          display: flex;
          flex-direction: column;
        }
        .sw-intel-guided-flow-staged-summary {
          padding: 8px 14px;
          border-top: 1px solid #1e2330;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #ffd700;
          letter-spacing: 0.04em;
          background: rgba(255,215,0,0.03);
        }

        /* Guided Action Card */
        .sw-intel-guided-action {
          border-bottom: 1px solid #1e2330;
        }
        .sw-intel-guided-action:last-child {
          border-bottom: none;
        }
        .sw-intel-guided-action-header {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          width: 100%;
          padding: 10px 14px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.12s;
        }
        .sw-intel-guided-action-header:hover {
          background: rgba(74,158,255,0.03);
        }
        .sw-intel-guided-action-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-top: 4px;
          flex-shrink: 0;
          background: #4a5570;
        }
        .sw-intel-guided-action-dot[data-priority="HIGH"] { background: #ff6b6b; }
        .sw-intel-guided-action-dot[data-priority="MEDIUM"] { background: #ffd700; }
        .sw-intel-guided-action-dot[data-priority="LOW"] { background: #64ffda; }
        .sw-intel-guided-action-titles {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .sw-intel-guided-action-title {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #ccd6f6;
          font-weight: 500;
        }
        .sw-intel-guided-action-target {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #7a8aaa;
          letter-spacing: 0.03em;
        }
        .sw-intel-guided-action-mode {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: #4a9eff;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          flex-shrink: 0;
          padding: 2px 6px;
          border: 1px solid rgba(74,158,255,0.2);
          border-radius: 2px;
          background: rgba(74,158,255,0.04);
        }
        .sw-intel-guided-action-status {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: #7a8aaa;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }
        .sw-intel-guided-action-status[data-status="staged"] { color: #ffd700; }
        .sw-intel-guided-action-status[data-status="completed"] { color: #64ffda; }
        .sw-intel-guided-action-caret {
          font-size: 10px;
          color: #7a8aaa;
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Guided Action Card — expanded body */
        .sw-intel-guided-action-body {
          padding: 0 14px 14px 28px;
        }
        .sw-intel-guided-action-meaning {
          font-family: -apple-system, "system-ui", sans-serif;
          font-size: 12px;
          color: #9aa0bc;
          line-height: 1.5;
          margin-bottom: 12px;
        }
        .sw-intel-guided-action-section-label {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: #7a8aaa;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .sw-intel-guided-action-evidence {
          margin-bottom: 12px;
        }
        .sw-intel-guided-action-evidence-grid {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .sw-intel-guided-action-evidence-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          padding: 2px 0;
        }
        .sw-intel-guided-action-evidence-key {
          color: #7a8aaa;
          min-width: 100px;
          flex-shrink: 0;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .sw-intel-guided-action-evidence-val {
          color: #ccd6f6;
        }
        .sw-intel-guided-action-evidence-row[data-type="ok"] .sw-intel-guided-action-evidence-val { color: #64ffda; }
        .sw-intel-guided-action-evidence-row[data-type="warn"] .sw-intel-guided-action-evidence-val { color: #ff6b6b; }
        .sw-intel-guided-action-evidence-row[data-type="dim"] .sw-intel-guided-action-evidence-val { color: #7a8aaa; }
        .sw-intel-guided-action-evidence-detail {
          color: #7a8aaa;
          font-size: 10px;
        }
        .sw-intel-guided-action-workflow {
          margin-bottom: 12px;
        }
        .sw-intel-guided-action-steps {
          margin: 0;
          padding-left: 18px;
          font-family: -apple-system, "system-ui", sans-serif;
          font-size: 11px;
          color: #7a8aaa;
          line-height: 1.7;
          list-style: decimal;
        }
        .sw-intel-guided-action-steps li:last-child {
          color: #4a9eff;
        }

        /* Guided Action Card — operator decisions */
        .sw-intel-guided-action-decisions {
          margin-bottom: 12px;
        }
        .sw-intel-guided-action-decision-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .sw-intel-guided-action-decision-btn {
          padding: 5px 12px;
          background: rgba(74,158,255,0.06);
          border: 1px solid rgba(74,158,255,0.2);
          border-radius: 3px;
          color: #ccd6f6;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          cursor: pointer;
          transition: background 0.12s, border-color 0.12s;
        }
        .sw-intel-guided-action-decision-btn:hover {
          background: rgba(74,158,255,0.12);
          border-color: #4a9eff;
        }

        /* Guided Action Card — staged notice */
        .sw-intel-guided-action-staged-notice {
          padding: 8px 12px;
          margin-bottom: 10px;
          background: rgba(255,215,0,0.04);
          border: 1px solid rgba(255,215,0,0.15);
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #ffd700;
          letter-spacing: 0.03em;
        }

        /* Guided Action Card — footer */
        .sw-intel-guided-action-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-top: 8px;
          border-top: 1px solid #1e2330;
        }
        .sw-intel-guided-action-stage-btn {
          padding: 5px 14px;
          background: rgba(74,158,255,0.08);
          border: 1px solid rgba(74,158,255,0.3);
          border-radius: 3px;
          color: #4a9eff;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          cursor: pointer;
          transition: background 0.12s, border-color 0.12s;
        }
        .sw-intel-guided-action-stage-btn:hover {
          background: rgba(74,158,255,0.15);
          border-color: #4a9eff;
        }
        .sw-intel-guided-action-exec-path {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: #7a8aaa;
          letter-spacing: 0.04em;
          margin-left: auto;
        }

        /* SQO orchestration execution UI */
        .sw-intel-guided-action-sqo-exec {
          padding: 8px 0 4px;
          border-top: 1px solid #1e2330;
        }
        .sw-intel-sqo-targets {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sw-intel-sqo-target {
          border: 1px solid #1e2330;
          border-radius: 4px;
          overflow: hidden;
          transition: border-color 0.12s;
        }
        .sw-intel-sqo-target--selected {
          border-color: #4a9eff;
        }
        .sw-intel-sqo-target-select {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 6px 10px;
          background: transparent;
          border: none;
          color: #ccd6f6;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          cursor: pointer;
          text-align: left;
        }
        .sw-intel-sqo-target-select:hover {
          background: rgba(74,158,255,0.06);
        }
        .sw-intel-sqo-target-label {
          color: #ccd6f6;
        }
        .sw-intel-sqo-target-status {
          color: #7a8aaa;
          font-size: 10px;
        }
        .sw-intel-sqo-target-actions {
          display: flex;
          gap: 6px;
          padding: 4px 10px 8px;
          flex-wrap: wrap;
        }
        .sw-intel-sqo-target-props {
          padding: 0 10px 8px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .sw-intel-sqo-prop {
          display: flex;
          align-items: baseline;
          gap: 8px;
          font-size: 10px;
        }
        .sw-intel-sqo-prop-text {
          color: #7a8aaa;
          flex: 1;
        }
        .sw-intel-sqo-prop-conf {
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
          font-size: 9px;
        }
        .sw-intel-sqo-exec-btn {
          padding: 4px 10px;
          background: rgba(74,158,255,0.08);
          border: 1px solid #2a2f40;
          border-radius: 3px;
          color: #4a9eff;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: background 0.12s, border-color 0.12s;
        }
        .sw-intel-sqo-exec-btn:hover:not(:disabled) {
          background: rgba(74,158,255,0.15);
          border-color: #4a9eff;
        }
        .sw-intel-sqo-exec-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .sw-intel-sqo-exec-btn--primary {
          background: rgba(74,158,255,0.12);
          border-color: #4a9eff;
        }
        .sw-intel-sqo-exec-btn[data-action="review_accept"] { color: #64ffda; border-color: rgba(100,255,218,0.2); }
        .sw-intel-sqo-exec-btn[data-action="review_reject"] { color: #ff6b6b; border-color: rgba(255,107,107,0.2); }
        .sw-intel-sqo-exec-btn[data-action="review_contest"] { color: #ffd700; border-color: rgba(255,215,0,0.2); }
        .sw-intel-sqo-exec-btn[data-action="promotion_approve"] { color: #64ffda; border-color: rgba(100,255,218,0.3); }
        .sw-intel-sqo-exec-btn[data-action="promotion_deny"] { color: #ff6b6b; border-color: rgba(255,107,107,0.2); }
        .sw-intel-sqo-confirm {
          display: flex;
          gap: 8px;
          padding: 4px 0;
        }
        .sw-intel-sqo-justification {
          padding: 6px 0;
        }
        .sw-intel-sqo-justification-input {
          width: 100%;
          padding: 6px 8px;
          background: #12151f;
          border: 1px solid #2a2f40;
          border-radius: 3px;
          color: #ccd6f6;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          resize: vertical;
          margin-top: 4px;
        }
        .sw-intel-sqo-justification-input:focus {
          outline: none;
          border-color: #4a9eff;
        }
        .sw-intel-sqo-result {
          padding: 6px 10px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          margin-top: 6px;
        }
        .sw-intel-sqo-result--ok {
          background: rgba(100,255,218,0.08);
          border: 1px solid rgba(100,255,218,0.2);
          color: #64ffda;
        }
        .sw-intel-sqo-result--error {
          background: rgba(255,107,107,0.08);
          border: 1px solid rgba(255,107,107,0.2);
          color: #ff6b6b;
        }
        .sw-intel-guided-flow-posture {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px 6px;
          font-family: 'Courier New', monospace;
          font-size: 10px;
        }
        .sw-intel-guided-flow-posture-level {
          color: #4a9eff;
          font-weight: 600;
        }
        .sw-intel-guided-flow-posture-sep {
          color: #2a2f40;
        }
        .sw-intel-guided-flow-posture-label {
          color: #7a8aaa;
        }
        .sw-intel-guided-flow-sqo {
          color: #4a9eff;
        }
        .sw-intel-guided-action-learning {
          padding: 8px 12px;
          margin: 0 0 4px;
          border-left: 2px solid rgba(74,158,255,0.25);
          background: rgba(74,158,255,0.04);
        }
        .sw-intel-guided-action-learning-summary {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #7a8aaa;
          line-height: 1.4;
        }
        .sw-intel-guided-action-learning-detail {
          display: flex;
          gap: 12px;
          margin-top: 4px;
          font-family: 'Courier New', monospace;
          font-size: 10px;
        }
        .sw-intel-guided-action-learning-detail span[data-type="ok"] { color: #64ffda; }
        .sw-intel-guided-action-learning-detail span[data-type="warn"] { color: #ffd700; }
        .sw-intel-guided-action-learning-detail span[data-type="dim"] { color: #7a8aaa; }
        .sw-intel-guided-action[data-status="completed"] {
          opacity: 0.5;
        }

        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        /* Domain Cognition State — active reasoning contract */
        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

        /* Left panel — cognition state interpretation */
        .intel-interp--cognition-state {
          border-left: 2px solid rgba(74,158,255,0.25);
        }
        .intel-interp--cognition-state[data-severity="HIGH"] {
          border-left-color: rgba(255,107,107,0.4);
        }
        .intel-interp--cognition-state[data-severity="ELEVATED"] {
          border-left-color: rgba(255,158,74,0.4);
        }
        .intel-interp--cognition-state[data-severity="MODERATE"] {
          border-left-color: rgba(255,215,0,0.35);
        }

        .cognition-operational-meaning {
          font-size: 13px;
          line-height: 1.65;
          color: #c5cce3;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .cognition-implications {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cognition-implication-item {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 5px 8px;
          background: rgba(10,12,18,0.4);
          border-radius: 2px;
          border-left: 2px solid #2a2f40;
        }
        .cognition-implication-item[data-priority="HIGH"] {
          border-left-color: #ff6b6b;
        }
        .cognition-implication-item[data-priority="MEDIUM"] {
          border-left-color: #ffd700;
        }
        .cognition-implication-item[data-priority="LOW"] {
          border-left-color: #64ffda;
        }
        .cognition-implication-priority {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #7a8aaa;
          flex-shrink: 0;
          min-width: 42px;
        }
        .cognition-implication-item[data-priority="HIGH"] .cognition-implication-priority { color: #ff6b6b; }
        .cognition-implication-item[data-priority="MEDIUM"] .cognition-implication-priority { color: #ffd700; }
        .cognition-implication-text {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 11.5px;
          color: #9aa0bc;
          line-height: 1.45;
        }

        .cognition-qualification {
          padding: 8px 10px;
          background: rgba(10,12,18,0.4);
          border-left: 2px solid rgba(255,215,0,0.25);
          border-radius: 0 2px 2px 0;
        }
        .cognition-qualification-text {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 11.5px;
          color: #9aa0bc;
          line-height: 1.5;
        }

        .cognition-gaps {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cognition-gap-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 6px 0;
          border-bottom: 1px solid rgba(30,35,48,0.3);
        }
        .cognition-gap-item:last-child { border-bottom: none; }
        .cognition-gap-label {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #ccd6f6;
          line-height: 1.4;
        }
        .cognition-gap-impact {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #ff9e4a;
          line-height: 1.4;
        }

        .cognition-progression {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cognition-progression-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 6px 0;
          border-bottom: 1px solid rgba(30,35,48,0.4);
        }
        .cognition-progression-item:last-child { border-bottom: none; }
        .cognition-progression-step {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 11.5px;
          color: #ccd6f6;
          line-height: 1.4;
        }
        .cognition-progression-effect {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #64ffda;
          line-height: 1.4;
        }

        /* Left panel — cognition query answer overlay */
        .intel-interp--cognition-query {
          border-left: 2px solid rgba(74,158,255,0.4);
        }

        /* Right panel — cognition queries block */
        .support-block--cognition-queries {
          padding-top: 18px;
          border-top: 1px solid #1a2030;
        }
        .support-block--cognition-queries .support-paths-list {
          gap: 3px;
        }
        .support-block--cognition-queries .support-path-item {
          border-left-color: rgba(74,158,255,0.2);
        }
        .support-block--cognition-queries .support-path-item[data-active="true"] {
          border-left-color: #4a9eff;
          background: rgba(74,158,255,0.06);
        }

        .cognition-actions-summary {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(30,35,48,0.5);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .cognition-action-item {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 3px 0;
        }
        .cognition-action-priority {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #7a8aaa;
          flex-shrink: 0;
          min-width: 42px;
        }
        .cognition-action-item[data-priority="HIGH"] .cognition-action-priority { color: #ff6b6b; }
        .cognition-action-item[data-priority="MEDIUM"] .cognition-action-priority { color: #ffd700; }
        .cognition-action-item[data-priority="LOW"] .cognition-action-priority { color: #64ffda; }
        .cognition-action-text {
          font-size: 11px;
          color: #9aa0bc;
          line-height: 1.4;
        }

        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        /* Layer 2 — Orchestration Guidance Runtime           */
        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        .orch-guidance-runtime {
          margin-top: 14px;
          border: 1px solid #1e2330;
          border-radius: 4px;
          background: #12151f;
          overflow: hidden;
        }
        .orch-guidance-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-bottom: 1px solid #1e2330;
          background: rgba(20,23,31,0.5);
        }
        .orch-guidance-title {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: 600;
          color: #ccd6f6;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .orch-guidance-count {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #7a8aaa;
          letter-spacing: 0.04em;
        }
        .orch-guidance-critical { color: #ff6b6b; font-weight: 600; }
        .orch-guidance-high { color: #ff6b6b; font-weight: 600; }
        .orch-guidance-governed { color: #4a9eff; }
        .orch-guidance-list {
          display: flex;
          flex-direction: column;
        }
        .orch-guidance-staged-summary {
          padding: 8px 14px;
          border-top: 1px solid #1e2330;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #ffd700;
          letter-spacing: 0.04em;
          background: rgba(255,215,0,0.03);
        }
        .orch-guidance-posture {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px 6px;
          font-family: 'Courier New', monospace;
          font-size: 10px;
        }
        .orch-guidance-posture-level { color: #4a9eff; font-weight: 600; }
        .orch-guidance-posture-sep { color: #2a2f40; }
        .orch-guidance-posture-label { color: #7a8aaa; }
        .orch-guided-action {
          border-bottom: 1px solid #1e2330;
        }
        .orch-guided-action:last-child { border-bottom: none; }
        .orch-guided-action-header {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          width: 100%;
          padding: 10px 14px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.12s;
        }
        .orch-guided-action-header:hover { background: rgba(74,158,255,0.03); }
        .orch-guided-action-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-top: 4px;
          flex-shrink: 0;
          background: #4a5570;
        }
        .orch-guided-action-dot[data-priority="CRITICAL"] { background: #ff6b6b; }
        .orch-guided-action-dot[data-priority="HIGH"] { background: #ff6b6b; }
        .orch-guided-action-dot[data-priority="MEDIUM"] { background: #ffd700; }
        .orch-guided-action-dot[data-priority="LOW"] { background: #64ffda; }
        .orch-guided-action-titles {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .orch-guided-action-title {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: #ccd6f6;
          font-weight: 500;
        }
        .orch-guided-action-target {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #7a8aaa;
          letter-spacing: 0.03em;
        }
        .orch-guided-action-mode {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: #4a9eff;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          flex-shrink: 0;
          padding: 2px 6px;
          border: 1px solid rgba(74,158,255,0.2);
          border-radius: 2px;
          background: rgba(74,158,255,0.04);
        }
        .orch-guided-action-status {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: #7a8aaa;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }
        .orch-guided-action-status[data-status="staged"] { color: #ffd700; }
        .orch-guided-action-status[data-status="completed"] { color: #64ffda; }
        .orch-guided-action-caret {
          font-size: 10px;
          color: #7a8aaa;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .orch-guided-action-body {
          padding: 0 14px 14px 28px;
        }
        .orch-guided-action-meaning {
          font-family: -apple-system, "system-ui", sans-serif;
          font-size: 12px;
          color: #9aa0bc;
          line-height: 1.5;
          margin-bottom: 12px;
        }
        .orch-guided-action-section-label {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: #7a8aaa;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .orch-guided-action-evidence { margin-bottom: 12px; }
        .orch-guided-action-evidence-grid {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .orch-guided-action-evidence-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          padding: 2px 0;
        }
        .orch-guided-action-evidence-key {
          color: #7a8aaa;
          min-width: 100px;
          flex-shrink: 0;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .orch-guided-action-evidence-val { color: #ccd6f6; }
        .orch-guided-action-evidence-row[data-type="ok"] .orch-guided-action-evidence-val { color: #64ffda; }
        .orch-guided-action-evidence-row[data-type="warn"] .orch-guided-action-evidence-val { color: #ff6b6b; }
        .orch-guided-action-evidence-row[data-type="dim"] .orch-guided-action-evidence-val { color: #7a8aaa; }
        .orch-guided-action-evidence-detail {
          color: #7a8aaa;
          font-size: 10px;
        }
        .orch-guided-action-workflow { margin-bottom: 12px; }
        .orch-guided-action-steps {
          margin: 0;
          padding-left: 18px;
          font-family: -apple-system, "system-ui", sans-serif;
          font-size: 11px;
          color: #7a8aaa;
          line-height: 1.7;
          list-style: decimal;
        }
        .orch-guided-action-steps li:last-child { color: #4a9eff; }
        .orch-guided-action-decisions { margin-bottom: 12px; }
        .orch-guided-action-decision-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .orch-guided-action-decision-btn {
          padding: 5px 12px;
          background: rgba(74,158,255,0.06);
          border: 1px solid rgba(74,158,255,0.2);
          border-radius: 3px;
          color: #ccd6f6;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          cursor: pointer;
          transition: background 0.12s, border-color 0.12s;
        }
        .orch-guided-action-decision-btn:hover {
          background: rgba(74,158,255,0.12);
          border-color: #4a9eff;
        }
        .orch-guided-action-staged-notice {
          padding: 8px 12px;
          margin-bottom: 10px;
          background: rgba(255,215,0,0.04);
          border: 1px solid rgba(255,215,0,0.15);
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          color: #ffd700;
          letter-spacing: 0.03em;
        }
        .orch-guided-action-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-top: 8px;
          border-top: 1px solid #1e2330;
        }
        .orch-guided-action-stage-btn {
          padding: 5px 14px;
          background: rgba(74,158,255,0.08);
          border: 1px solid rgba(74,158,255,0.3);
          border-radius: 3px;
          color: #4a9eff;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          cursor: pointer;
          transition: background 0.12s, border-color 0.12s;
        }
        .orch-guided-action-stage-btn:hover {
          background: rgba(74,158,255,0.15);
          border-color: #4a9eff;
        }
        .orch-guided-action-exec-path {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          color: #7a8aaa;
          letter-spacing: 0.04em;
          margin-left: auto;
        }
        .orch-guided-action-sqo-exec {
          padding: 8px 0 4px;
          border-top: 1px solid #1e2330;
        }
        .orch-sqo-targets {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .orch-sqo-target {
          border: 1px solid #1e2330;
          border-radius: 4px;
          overflow: hidden;
          transition: border-color 0.12s;
        }
        .orch-sqo-target--selected { border-color: #4a9eff; }
        .orch-sqo-target-select {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 6px 10px;
          background: transparent;
          border: none;
          color: #ccd6f6;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          cursor: pointer;
          text-align: left;
        }
        .orch-sqo-target-select:hover { background: rgba(74,158,255,0.06); }
        .orch-sqo-target-label { color: #ccd6f6; }
        .orch-sqo-target-status { color: #7a8aaa; font-size: 10px; }
        .orch-sqo-target-actions {
          display: flex;
          gap: 6px;
          padding: 4px 10px 8px;
          flex-wrap: wrap;
        }
        .orch-sqo-target-props {
          padding: 0 10px 8px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .orch-sqo-prop {
          display: flex;
          align-items: baseline;
          gap: 8px;
          font-size: 10px;
        }
        .orch-sqo-prop-text { color: #7a8aaa; flex: 1; }
        .orch-sqo-prop-conf {
          color: #7a8aaa;
          font-family: 'Courier New', monospace;
          font-size: 9px;
        }
        .orch-sqo-exec-btn {
          padding: 4px 10px;
          background: rgba(74,158,255,0.08);
          border: 1px solid #2a2f40;
          border-radius: 3px;
          color: #4a9eff;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: background 0.12s, border-color 0.12s;
        }
        .orch-sqo-exec-btn:hover:not(:disabled) {
          background: rgba(74,158,255,0.15);
          border-color: #4a9eff;
        }
        .orch-sqo-exec-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .orch-sqo-exec-btn--primary {
          background: rgba(74,158,255,0.12);
          border-color: #4a9eff;
        }
        .orch-sqo-exec-btn[data-action="review_accept"] { color: #64ffda; border-color: rgba(100,255,218,0.2); }
        .orch-sqo-exec-btn[data-action="review_reject"] { color: #ff6b6b; border-color: rgba(255,107,107,0.2); }
        .orch-sqo-exec-btn[data-action="review_contest"] { color: #ffd700; border-color: rgba(255,215,0,0.2); }
        .orch-sqo-exec-btn[data-action="promotion_approve"] { color: #64ffda; border-color: rgba(100,255,218,0.3); }
        .orch-sqo-exec-btn[data-action="promotion_deny"] { color: #ff6b6b; border-color: rgba(255,107,107,0.2); }
        .orch-sqo-confirm {
          display: flex;
          gap: 8px;
          padding: 4px 0;
        }
        .orch-sqo-justification { padding: 6px 0; }
        .orch-sqo-justification-input {
          width: 100%;
          padding: 6px 8px;
          background: #12151f;
          border: 1px solid #2a2f40;
          border-radius: 3px;
          color: #ccd6f6;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          resize: vertical;
          margin-top: 4px;
        }
        .orch-sqo-justification-input:focus { outline: none; border-color: #4a9eff; }
        .orch-sqo-result {
          padding: 6px 10px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          margin-top: 6px;
        }
        .orch-sqo-result--ok {
          background: rgba(100,255,218,0.08);
          border: 1px solid rgba(100,255,218,0.2);
          color: #64ffda;
        }
        .orch-sqo-result--error {
          background: rgba(255,107,107,0.08);
          border: 1px solid rgba(255,107,107,0.2);
          color: #ff6b6b;
        }
        .orch-guided-action-learning {
          padding: 8px 12px;
          margin: 0 0 4px;
          border-left: 2px solid rgba(74,158,255,0.25);
          background: rgba(74,158,255,0.04);
        }
        .orch-guided-action-learning-summary {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #7a8aaa;
          line-height: 1.4;
        }
        .orch-guided-action-learning-detail {
          display: flex;
          gap: 12px;
          margin-top: 4px;
          font-family: 'Courier New', monospace;
          font-size: 10px;
        }
        .orch-guided-action-learning-detail span[data-type="ok"] { color: #64ffda; }
        .orch-guided-action-learning-detail span[data-type="warn"] { color: #ffd700; }
        .orch-guided-action-learning-detail span[data-type="dim"] { color: #7a8aaa; }
        .orch-guided-action[data-status="completed"] { opacity: 0.5; }

        /* Legacy decomposition — removed from component tree */
        .sw-intel-panel--decomposition {
          border-left-color: #4a9eff;
        }
        .sw-intel-decomp-axes {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px 0 14px;
        }
        .sw-intel-axis-bar {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .sw-intel-axis-bar-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .sw-intel-axis-bar-label {
          font-size: 10px;
          font-family: 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .sw-intel-axis-bar-level {
          font-size: 10px;
          font-family: 'Courier New', monospace;
          font-weight: 600;
          letter-spacing: 0.06em;
        }
        .sw-intel-axis-bar-track {
          height: 4px;
          background: #1a1e2b;
          border-radius: 2px;
          overflow: hidden;
        }
        .sw-intel-axis-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        .sw-intel-axis-bar-count {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          color: #7a8aaa;
        }
        .sw-intel-axis-qclass {
          color: #7a8aaa;
        }

        /* Decomposition detail grid */
        .sw-intel-decomp-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding: 12px 0;
          border-top: 1px solid #1e2330;
        }
        .sw-intel-decomp-column-title {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }
        .sw-intel-decomp-item {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          padding: 3px 0;
          font-size: 10px;
          font-family: 'Courier New', monospace;
        }
        .sw-intel-decomp-item[data-present="false"] {
          opacity: 0.4;
        }
        .sw-intel-decomp-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          margin-top: 3px;
          flex-shrink: 0;
        }
        .sw-intel-decomp-item-name {
          color: #ccd6f6;
        }
        .sw-intel-decomp-item[data-present="false"] .sw-intel-decomp-item-name {
          color: #7a8aaa;
        }
        .sw-intel-decomp-item-detail {
          color: #7a8aaa;
          margin-left: auto;
          text-align: right;
          white-space: nowrap;
        }

        /* Reconciliation section */
        .sw-intel-decomp-reconciliation {
          padding: 8px 0;
          border-top: 1px solid #1e2330;
        }
        .sw-intel-decomp-reconciliation--absent {
          opacity: 0.5;
        }
        .sw-intel-decomp-reconciliation-header {
          display: flex;
          align-items: baseline;
          gap: 10px;
          font-size: 10px;
          font-family: 'Courier New', monospace;
        }
        .sw-intel-decomp-reconciliation-label {
          color: #7a8aaa;
          font-size: 10px;
          font-family: 'Courier New', monospace;
        }
        .sw-intel-decomp-reconciliation-ratio {
          color: #ccd6f6;
          font-weight: 600;
        }
        .sw-intel-decomp-reconciliation-confidence {
          color: #7a8aaa;
        }
        .sw-intel-decomp-reconciliation-qlabel {
          font-size: 10px;
          font-family: 'Courier New', monospace;
          color: #7a8aaa;
          margin-top: 4px;
          line-height: 1.4;
        }

        /* Condition-driven guidance */
        .sw-intel-decomp-guidance {
          padding: 10px 0 4px;
          border-top: 1px solid #1e2330;
        }
        .sw-intel-decomp-guidance-title {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }
        .sw-intel-decomp-guidance-item {
          padding: 6px 0;
          border-bottom: 1px solid #12151f;
        }
        .sw-intel-decomp-guidance-item:last-child {
          border-bottom: none;
        }
        .sw-intel-decomp-guidance-header {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 3px;
        }
        .sw-intel-decomp-guidance-priority {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          font-weight: 600;
          letter-spacing: 0.06em;
          flex-shrink: 0;
        }
        .sw-intel-decomp-guidance-condition {
          font-size: 10px;
          font-family: 'Courier New', monospace;
          color: #ccd6f6;
        }
        .sw-intel-decomp-guidance-axis {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          color: #7a8aaa;
          margin-left: auto;
          text-transform: lowercase;
          white-space: nowrap;
        }
        .sw-intel-decomp-guidance-action {
          font-size: 10px;
          font-family: 'Courier New', monospace;
          color: #7a8aaa;
          line-height: 1.5;
          padding-left: 2px;
        }

        /* Compact decomposition (boardroom/balanced) */
        .sw-intel-decomp-compact {
          padding: 8px 0;
          margin-bottom: 8px;
          border-bottom: 1px solid #1e2330;
        }
        .sw-intel-decomp-compact-axes {
          display: flex;
          align-items: baseline;
          gap: 6px;
          flex-wrap: wrap;
        }
        .sw-intel-decomp-compact-axis {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .sw-intel-decomp-compact-label {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          color: #7a8aaa;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .sw-intel-decomp-compact-value {
          font-size: 10px;
          font-family: 'Courier New', monospace;
          font-weight: 600;
        }
        .sw-intel-decomp-compact-sep {
          color: #2a2f40;
          font-size: 10px;
        }
        .sw-intel-decomp-compact-guidance {
          margin-top: 6px;
        }
        .sw-intel-decomp-compact-guidance-item {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          color: #ff9e4a;
          line-height: 1.4;
          padding: 2px 0;
        }

        /* Balanced guidance items */
        .sw-intel-balanced-guidance-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 4px 0;
          font-size: 11px;
          font-family: 'Courier New', monospace;
        }
        .sw-intel-balanced-guidance-priority {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.06em;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .sw-intel-balanced-guidance-text {
          color: #7a8aaa;
          line-height: 1.5;
        }

        /* Fallback button */
        .sw-intel-fallback-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 14px;
          margin-bottom: 12px;
          background: none;
          border: 1px solid #2a2f40;
          border-radius: 3px;
          color: #7a8aaa;
          font-size: 11px;
          font-family: 'Courier New', monospace;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .sw-intel-fallback-btn:hover { border-color: #4a9eff; color: #ccd6f6; }

        /* Boardroom summary */
        .sw-intel-boardroom-summary {
          padding: 16px;
          margin-top: 16px;
          border: 1px solid #1e2330;
          border-radius: 4px;
          background: #141720;
        }
        .sw-intel-boardroom-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .sw-intel-boardroom-module-tag {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.14em;
          color: #4a9eff;
          padding: 2px 8px;
          background: rgba(74,158,255,0.06);
          border-radius: 2px;
        }
        .sw-intel-boardroom-state {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.1em;
          color: #7a8aaa;
        }
        .sw-intel-boardroom-risk {
          padding: 10px 14px;
          background: #1a1e2b;
          border-radius: 3px;
          margin-bottom: 10px;
          border-left: 3px solid #4a5570;
        }
        .sw-intel-boardroom-risk[data-level="ELEVATED"] { border-left-color: #ff6b6b; }
        .sw-intel-boardroom-risk[data-level="MODERATE"] { border-left-color: #ffd700; }
        .sw-intel-boardroom-risk[data-level="LOW"] { border-left-color: #64ffda; }
        .sw-intel-boardroom-risk-label {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.1em;
          color: #7a8aaa;
          text-transform: uppercase;
        }
        .sw-intel-boardroom-risk-level {
          font-size: 14px;
          font-weight: 700;
          color: #ccd6f6;
          margin-left: 8px;
          font-family: 'Courier New', monospace;
        }
        .sw-intel-boardroom-risk-desc {
          font-size: 12px;
          color: #9aa0bc;
          margin-top: 4px;
          line-height: 1.5;
        }
        .sw-intel-boardroom-qual {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding: 8px 14px;
          background: #1a1e2b;
          border-radius: 3px;
          margin-bottom: 10px;
        }
        .sw-intel-boardroom-qual-level {
          font-size: 16px;
          font-weight: 700;
          color: #ccd6f6;
          font-family: 'Courier New', monospace;
        }
        .sw-intel-boardroom-qual-desc {
          font-size: 12px;
          color: #9aa0bc;
          line-height: 1.4;
        }
        .sw-intel-boardroom-attention { display: flex; flex-direction: column; gap: 6px; }
        .sw-intel-boardroom-attention-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 3px;
          background: #1a1e2b;
        }
        .sw-intel-boardroom-attention-sev {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          font-weight: 600;
          letter-spacing: 0.1em;
          min-width: 56px;
        }
        .sw-intel-boardroom-attention-item[data-severity="HIGH"] .sw-intel-boardroom-attention-sev { color: #ff6b6b; }
        .sw-intel-boardroom-attention-item[data-severity="ELEVATED"] .sw-intel-boardroom-attention-sev { color: #ff9e4a; }
        .sw-intel-boardroom-attention-desc {
          font-size: 12px;
          color: #9aa0bc;
          line-height: 1.4;
        }

        /* Balanced narrative */
        .sw-intel-balanced-narrative {
          padding: 16px;
          margin-top: 16px;
          border: 1px solid #1e2330;
          border-radius: 4px;
          background: #141720;
        }
        .sw-intel-balanced-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }
        .sw-intel-balanced-module-tag {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.14em;
          color: #4a9eff;
          padding: 2px 8px;
          background: rgba(74,158,255,0.06);
          border-radius: 2px;
        }
        .sw-intel-balanced-state {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.1em;
          color: #7a8aaa;
        }
        .sw-intel-balanced-causal-narrative {
          font-size: 12.5px;
          color: #ccd6f6;
          line-height: 1.6;
          padding: 10px 12px;
          margin-bottom: 14px;
          background: rgba(74, 158, 255, 0.04);
          border-left: 2px solid #4a9eff;
          border-radius: 0 2px 2px 0;
        }
        .sw-intel-balanced-section {
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #1e2330;
        }
        .sw-intel-balanced-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .sw-intel-balanced-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.1em;
          color: #7a8aaa;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .sw-intel-balanced-section-body {
          font-size: 13px;
          color: #ccd6f6;
          line-height: 1.6;
        }
        .sw-intel-balanced-corridor {
          display: flex;
          gap: 10px;
          padding: 4px 0;
          font-size: 12px;
        }
        .sw-intel-balanced-corridor-role {
          font-size: 9px;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.08em;
          color: #7a8aaa;
          min-width: 80px;
          text-transform: uppercase;
        }
        .sw-intel-balanced-corridor-desc { color: #9aa0bc; }
        .sw-intel-balanced-attention {
          padding: 6px 10px;
          margin-bottom: 4px;
          border-radius: 3px;
          background: #1a1e2b;
          font-size: 12px;
          color: #9aa0bc;
          line-height: 1.5;
          border-left: 3px solid #4a5570;
        }
        .sw-intel-balanced-attention[data-severity="HIGH"] { border-left-color: #ff6b6b; }
        .sw-intel-balanced-attention[data-severity="ELEVATED"] { border-left-color: #ff9e4a; }
      `}</style>
    </>
  )
}
