/**
 * pages/index.js
 * GAUGE.STANDALONE.PRODUCT.RESTORE.RICH.STATE.01
 *
 * Standalone Gauge product page — three-column rich layout.
 * Authoritative baseline: docs/pios/PSEE.UI/run_01_blueedge_surface/gauge_v2_product.html
 * Rich state: runtime intelligence / structural metrics / signal set / topology summary
 *
 * Governed by: PSEE.BLUEEDGE.GAUGE.HANDOFF.01
 */

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  useGaugeData,
  useTopologySummary,
  RuntimeIntelligence,
  StructuralMetrics,
  SignalSet,
  TopologySummaryPanel,
} from '../components/GaugeContextPanels'

const VALID_KEY = 'PIOS-DISCOVERY-DEMO'

function RightColumn({ gaugeResult, topoResult }) {
  const gaugeLoading = gaugeResult.loading
  const topoLoading  = topoResult.loading

  if (gaugeLoading && topoLoading) {
    return (
      <div className="panel">
        <div className="ri-loading">Loading intelligence data…</div>
      </div>
    )
  }

  const gaugeData = gaugeResult.data
  const topoData  = topoResult.data

  return (
    <>
      {/* Runtime Intelligence */}
      <div className="panel">
        <div className="panel-label">Runtime Intelligence</div>
        {gaugeResult.error ? (
          <div className="ri-error">Unavailable — {gaugeResult.error}</div>
        ) : !gaugeData ? (
          <div className="ri-loading">Loading…</div>
        ) : (
          <RuntimeIntelligence gaugeData={gaugeData} />
        )}
      </div>

      {/* Structural Metrics */}
      <div className="panel">
        <div className="panel-label">Structural Metrics</div>
        {gaugeResult.error && topoResult.error ? (
          <div className="ri-error">Unavailable</div>
        ) : (
          <StructuralMetrics gaugeData={gaugeData} topoData={topoData} />
        )}
      </div>

      {/* Signal Set */}
      <div className="panel">
        <div className="panel-label">Signal Set</div>
        {topoResult.error ? (
          <div className="ri-error">Unavailable — {topoResult.error}</div>
        ) : topoLoading ? (
          <div className="ri-loading">Loading…</div>
        ) : (
          <SignalSet topoData={topoData} />
        )}
      </div>

      {/* Topology Summary */}
      <div className="panel">
        <div className="panel-label">Topology Summary</div>
        {topoResult.error ? (
          <div className="ri-error">Unavailable — {topoResult.error}</div>
        ) : topoLoading ? (
          <div className="ri-loading">Loading…</div>
        ) : (
          <TopologySummaryPanel topoData={topoData} />
        )}
      </div>

      {/* Topology CTA */}
      <div className="panel">
        <div className="panel-label">Structural Topology</div>
        <Link href="/topology" className="tp-cta-link">
          View Structural Topology &#x2192;
        </Link>
        <div className="tp-cta-sub">
          Full node explorer · inspector · overlap graph
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function GaugeProduct() {
  const [discoveryEnabled, setDiscoveryEnabled] = useState(false)
  const [modalOpen,        setModalOpen]        = useState(false)
  const [accessKeyInput,   setAccessKeyInput]   = useState('')
  const [keyDenied,        setKeyDenied]        = useState('')

  const gaugeResult = useGaugeData()
  const topoResult  = useTopologySummary()
  const gaugeData   = gaugeResult.data

  const inputRef = useRef(null)

  useEffect(() => {
    if (modalOpen && inputRef.current) {
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50)
    }
  }, [modalOpen])

  function openModal() {
    if (discoveryEnabled) return
    setAccessKeyInput('')
    setKeyDenied('')
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setKeyDenied('')
  }

  function handleSubmit() {
    const key = accessKeyInput.trim()
    if (key.length === 0) {
      setKeyDenied('Access key required.')
      return
    }
    if (key === VALID_KEY) {
      setModalOpen(false)
      setDiscoveryEnabled(true)
      return
    }
    setKeyDenied('Access key not recognized. Contact your program coordinator to obtain PiOS Discovery access.')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') closeModal()
  }

  return (
    <>
      {/* ── ACCESS KEY MODAL ── */}
      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="modal-box">
            <div className="modal-title">Unlock PiOS Discovery</div>
            <div className="modal-truth">
              This intake has not been evaluated by the execution layer.
              Execution must be performed — this key activates the discovery session, not a cached result.
              Structural proof is already complete and does not require this key.
            </div>
            <div className="modal-sub">
              PiOS Discovery provides execution-layer activation, interactive structural query,
              signal propagation analysis, and provenance trace for this intake.
              Enter your access key to continue.
            </div>
            <input
              ref={inputRef}
              className="modal-input"
              type="password"
              placeholder="Access key"
              autoComplete="off"
              value={accessKeyInput}
              onChange={e => setAccessKeyInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {keyDenied && (
              <div className="modal-denied" style={{ display: 'block' }}>{keyDenied}</div>
            )}
            <div className="modal-actions">
              <button className="modal-cancel" onClick={closeModal}>Cancel</button>
              <button className="modal-submit" onClick={handleSubmit}>Activate</button>
            </div>
          </div>
        </div>
      )}

      {/* ── GAUGE SURFACE ── */}
      <div className="outer">

        {/* ══════════════════════════════════════════
            TOP BAR — run identity + score header
        ══════════════════════════════════════════ */}
        <div className="top-bar">
          <div className="header-top">
            <div>
              <div className="header-run">Run: {gaugeData?.run_id ?? 'run_01_authoritative'}</div>
              <div className="header-phase">Execution Phase: {gaugeData?.execution_status ?? 'PHASE_1_ACTIVE'}</div>
            </div>
            <div className="header-tag">gauge-v2-product</div>
          </div>

          <div className="score-grid">
            <div className="score-cell">
              <div className="sc-label">Canonical Score</div>
              <div className="sc-value">{gaugeData?.score?.canonical ?? 60}</div>
              <div className="sc-band">{gaugeData?.score?.band_label ?? 'CONDITIONAL'}</div>
              <div className="sc-sub">Verified structural state</div>
            </div>
            <div className="score-cell">
              <div className="sc-label">Projected Score</div>
              <div className="sc-value">{gaugeData?.projection?.value ?? 100}</div>
              <div className="sc-sub">If execution layer completes</div>
            </div>
            <div className="score-cell">
              <div className="sc-label">Confidence Band</div>
              <div className="sc-value" style={{ fontSize: '22px', paddingTop: '4px' }}>[{gaugeData?.confidence?.lower ?? 60} – {gaugeData?.confidence?.upper ?? 100}]</div>
              <div className="sc-sub">Lower = proven / Upper = achievable</div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            THREE-COLUMN BODY
        ══════════════════════════════════════════ */}
        <div className="cols">

          {/* ─────────── LEFT COLUMN ─────────── */}
          <div className="col-left">

            {/* Score Decomposition */}
            <div className="panel">
              <div className="panel-label">Score Decomposition ({gaugeData?.score?.canonical ?? 60} = {gaugeData?.score?.components?.completion_points ?? 0} + {gaugeData?.score?.components?.coverage_points ?? 35} + {gaugeData?.score?.components?.reconstruction_points ?? 25})</div>

              <div className="comp-block">
                <div className="comp-header">
                  <div className="comp-name">Completion / Execution Insight</div>
                  <div className="comp-pts" style={{ color: '#8b949e' }}>{gaugeData?.score?.components?.completion_points ?? 0} / 40 pts</div>
                </div>
                <div className="comp-bar-bg">
                  <div className="comp-bar-fill" style={{ width: `${Math.round((gaugeData?.score?.components?.completion_points ?? 0) / 40 * 100)}%`, background: '#8b949e' }}></div>
                </div>
                <div className="comp-status">NOT EVALUATED — execution layer not performed</div>
              </div>

              <div className="comp-block">
                <div className="comp-header">
                  <div className="comp-name">Coverage</div>
                  <div className="comp-pts" style={{ color: '#3fb950' }}>{gaugeData?.score?.components?.coverage_points ?? 35} / 35 pts</div>
                </div>
                <div className="comp-bar-bg">
                  <div className="comp-bar-fill" style={{ width: `${gaugeData?.dimensions?.['DIM-01']?.coverage_percent ?? 100}%`, background: '#3fb950' }}></div>
                </div>
                <div className="comp-status" style={{ color: '#3fb950' }}>{gaugeData?.dimensions?.['DIM-01']?.state ?? 'COMPUTED'} — {gaugeData?.dimensions?.['DIM-01']?.coverage_percent ?? 100}% structural coverage ({gaugeData?.dimensions?.['DIM-01']?.admissible_units ?? 30}/{gaugeData?.dimensions?.['DIM-01']?.required_units ?? 30} units)</div>
              </div>

              <div className="comp-block">
                <div className="comp-header">
                  <div className="comp-name">Reconstruction</div>
                  <div className="comp-pts" style={{ color: '#3fb950' }}>{gaugeData?.score?.components?.reconstruction_points ?? 25} / 25 pts</div>
                </div>
                <div className="comp-bar-bg">
                  <div className="comp-bar-fill" style={{ width: `${Math.round((gaugeData?.score?.components?.reconstruction_points ?? 25) / 25 * 100)}%`, background: '#3fb950' }}></div>
                </div>
                <div className="comp-status" style={{ color: '#3fb950' }}>{gaugeData?.dimensions?.['DIM-02']?.state ?? 'PASS'} — {Object.keys(gaugeData?.reconstruction?.axis_results ?? {}).length || 4}-axis structural validation ({gaugeData?.reconstruction?.validated_units ?? 30}/{gaugeData?.reconstruction?.total_units ?? 30} units)</div>
              </div>
            </div>

            {/* Component Detail */}
            <div className="panel">
              <div className="panel-label">Component Detail</div>

              {/* Completion — with CTA */}
              <div className="exp-block">
                <div className="exp-header">
                  <div className="exp-title">Completion / Execution Insight</div>
                  <div className="exp-badge badge-not-eval">NOT EVALUATED</div>
                </div>
                <div className="exp-row"><span className="ek">Contribution</span><span className="ev">{gaugeData?.score?.components?.completion_points ?? 0} of 40 points</span></div>
                <div className="exp-row"><span className="ek">Reason</span><span className="ev">The execution layer (PiOS engine) has not been run against this intake. Completion scoring requires terminal execution state — none exists for this run.</span></div>
                <div className="exp-row"><span className="ek">What this means</span><span className="ev">The gauge cannot determine whether execution succeeded, partially completed, or encountered terminal conditions. This component contributes 0 until execution runs.</span></div>

                <div className="cta-block">
                  <div className="cta-truth">
                    <strong>Structural proof is complete.</strong>{' '}
                    The {gaugeData?.confidence?.lower ?? 60}-point floor is verified without execution.
                    Execution insight is a separate evaluation that has not been performed —
                    this is not a data gap, it is an unevaluated layer.
                  </div>
                  <div className="cta-sep"></div>
                  <div className="cta-gate-label">PiOS Discovery — Commercially Gated Access</div>
                  {discoveryEnabled ? (
                    <span className="cta-btn-enabled">Discovery Access Enabled</span>
                  ) : (
                    <button className="cta-btn" onClick={openModal}>Unlock PiOS Discovery &#x2192;</button>
                  )}
                </div>
              </div>

              {/* Coverage */}
              <div className="exp-block">
                <div className="exp-header">
                  <div className="exp-title">Coverage</div>
                  <div className="exp-badge badge-computed">{gaugeData?.dimensions?.['DIM-01']?.state ?? 'COMPUTED'}</div>
                </div>
                <div className="exp-row"><span className="ek">Contribution</span><span className="ev">{gaugeData?.score?.components?.coverage_points ?? 35} of 35 points</span></div>
                <div className="exp-row"><span className="ek">Value</span><span className="ev">{(gaugeData?.dimensions?.['DIM-01']?.coverage_percent ?? 100).toFixed(1)}% — {gaugeData?.dimensions?.['DIM-01']?.admissible_units ?? 30}/{gaugeData?.dimensions?.['DIM-01']?.required_units ?? 30} admissible units</span></div>
                <div className="exp-row"><span className="ek">Method</span><span className="ev">Structural admissibility computation from IG.RUNTIME evidence boundary</span></div>
                <div className="exp-row"><span className="ek">What this means</span><span className="ev">All required structural units in the intake package were validated as admissible. No gaps in coverage. The structural package is complete.</span></div>
                <div className="exp-row"><span className="ek">Authority</span><span className="ev">PSEE-GAUGE.0 DP-5-02 / coverage_state.json</span></div>
              </div>

              {/* Reconstruction */}
              <div className="exp-block">
                <div className="exp-header">
                  <div className="exp-title">Reconstruction</div>
                  <div className="exp-badge badge-pass">{gaugeData?.dimensions?.['DIM-02']?.state ?? 'PASS'}</div>
                </div>
                <div className="exp-row"><span className="ek">Contribution</span><span className="ev">{gaugeData?.score?.components?.reconstruction_points ?? 25} of 25 points</span></div>
                <div className="exp-row"><span className="ek">Validated units</span><span className="ev">{gaugeData?.reconstruction?.validated_units ?? 30} / {gaugeData?.reconstruction?.total_units ?? 30}</span></div>
                <div className="exp-row"><span className="ek">Axes evaluated</span><span className="ev">Completeness · Structural Link · Referential Integrity · Layer Consistency</span></div>
                <div className="exp-row"><span className="ek">Violations</span><span className="ev">{gaugeData?.reconstruction?.violations?.length ?? 0}</span></div>
                <div className="exp-row"><span className="ek">What this means</span><span className="ev">The structural reconstruction of the intake is fully validated. All units are connected, all references resolve, all layer boundaries are consistent.</span></div>
                <div className="exp-row"><span className="ek">Authority</span><span className="ev">PSEE-GAUGE.0 DP-6-03 / reconstruction_state.json</span></div>
              </div>
            </div>

            {/* Capabilities Not Available */}
            <div className="panel">
              <div className="panel-label">Capabilities Not Available</div>

              <div className="cap-block">
                <div className="cap-na-badge">NOT EVALUATED</div>
                <div className="cap-title">Execution Validation</div>
                <div className="cap-row"><span className="ck">Why not available</span><span className="cv">PiOS execution layer has not been run. No terminal execution state exists for this intake.</span></div>
                <div className="cap-unlock">Unlock: run PiOS execution layer against this intake</div>
              </div>

              <div className="cap-block">
                <div className="cap-na-badge">NOT EVALUATED</div>
                <div className="cap-title">Signal Propagation Analysis</div>
                <div className="cap-row"><span className="ck">Why not available</span><span className="cv">Signal propagation requires execution-layer output. No execution has occurred.</span></div>
                <div className="cap-unlock">Unlock: complete execution layer; activate signal propagation stream</div>
              </div>

              <div className="cap-block">
                <div className="cap-na-badge">NOT EVALUATED</div>
                <div className="cap-title">Dynamic Failure Modeling</div>
                <div className="cap-row"><span className="ck">Why not available</span><span className="cv">Failure modeling requires observed execution outcomes. No execution outcomes exist for this run.</span></div>
                <div className="cap-unlock">Unlock: complete execution layer; provide failure evidence</div>
              </div>

              <div className="cap-block">
                <div className="cap-na-badge">NOT EVALUATED</div>
                <div className="cap-title">Completion Scoring (Runtime)</div>
                <div className="cap-row"><span className="ck">Why not available</span><span className="cv">Completion score requires terminal execution state (S-T1, S-T2, S-T3, S-13). Current state {gaugeData?.execution_status ?? 'PHASE_1_ACTIVE'} is in-flight — no terminal state reached.</span></div>
                <div className="cap-unlock">Unlock: advance to terminal execution state via PiOS execution layer</div>
              </div>
            </div>

            {/* Confidence Band */}
            <div className="panel">
              <div className="panel-label">Confidence Band [{gaugeData?.confidence?.lower ?? 60} – {gaugeData?.confidence?.upper ?? 100}]</div>

              <div className="conf-text">
                The <strong>lower bound ({gaugeData?.confidence?.lower ?? 60})</strong> represents the verified structural state of this intake.
                It is a hard floor derived only from what has been computed and validated without any assumptions.
                Coverage ({gaugeData?.score?.components?.coverage_points ?? 35} pts) and Reconstruction ({gaugeData?.score?.components?.reconstruction_points ?? 25} pts) are fully proven. Completion ({gaugeData?.score?.components?.completion_points ?? 0} pts) reflects the
                absence of execution-layer evaluation — not a failure.
              </div>
              <div className="conf-text">
                The <strong>upper bound ({gaugeData?.projection?.value ?? 100})</strong> represents the achievable score if the execution layer
                is performed and completes successfully to terminal state S-13. It assumes the already-proven
                structural dimensions (Coverage {gaugeData?.dimensions?.['DIM-01']?.coverage_percent ?? 100}%, Reconstruction {gaugeData?.dimensions?.['DIM-02']?.state ?? 'PASS'}) hold through execution.
                No new structural risks have been identified that would reduce this ceiling.
              </div>
              <div className="conf-text">
                The gap between {gaugeData?.confidence?.lower ?? 60} and {gaugeData?.confidence?.upper ?? 100} is fully explained by the missing execution evaluation.
                There are no open escalations, unknown-space records, or coverage gaps that would compress this band.
              </div>

              <div className="conf-bar-wrap">
                <div className="conf-bar-fill"></div>
                <div className="conf-lower-mark"></div>
              </div>
              <div className="conf-legend">
                <div className="conf-legend-item">
                  <div className="conf-legend-dot" style={{ background: '#8b949e' }}></div>
                  <span>Lower = {gaugeData?.confidence?.lower ?? 60} — verified structural state</span>
                </div>
                <div className="conf-legend-item">
                  <div className="conf-legend-dot" style={{ background: '#d29922' }}></div>
                  <span>Upper = {gaugeData?.confidence?.upper ?? 100} — achievable if execution layer completes</span>
                </div>
              </div>
            </div>

            {/* Operator Mode */}
            <div className="panel">
              <div className="panel-label">Operator Mode</div>

              <details className="op-details">
                <summary>Raw State Disclosure — gauge_state.json / coverage_state.json / reconstruction_state.json</summary>
                <div className="op-inner">

                  <div className="op-group-label">Execution State</div>
                  <table className="op-table">
                    <tbody>
                      <tr><td>execution_status</td><td>{gaugeData?.execution_status ?? 'PHASE_1_ACTIVE'}</td></tr>
                      <tr><td>psee_engine_invoked</td><td>{String(gaugeData?.state?.psee_engine_invoked ?? true)}</td></tr>
                      <tr><td>execution_mode</td><td>{gaugeData?.state?.execution_mode ?? 'FULL'}</td></tr>
                      <tr><td>run_id</td><td>{gaugeData?.run_id ?? 'run_01_authoritative'}</td></tr>
                      <tr><td>score.stream</td><td>{gaugeData?.stream ?? 'PSEE-RUNTIME.5'}</td></tr>
                    </tbody>
                  </table>

                  <div className="op-group-label">Score Components</div>
                  <table className="op-table">
                    <tbody>
                      <tr><td>canonical_score</td><td>{gaugeData?.score?.canonical ?? 60}</td></tr>
                      <tr><td>band_label</td><td>{gaugeData?.score?.band_label ?? 'CONDITIONAL'}</td></tr>
                      <tr><td>derivation</td><td>{gaugeData?.score?.derivation ?? '0 + 35 + 25 = 60'}</td></tr>
                      <tr><td>completion_points</td><td>{gaugeData?.score?.components?.completion_points ?? 0}</td></tr>
                      <tr><td>completion_basis</td><td>PHASE_1_ACTIVE — in-flight; UNDEFINED_STATE guard applied</td></tr>
                      <tr><td>coverage_points</td><td>{gaugeData?.score?.components?.coverage_points ?? 35}</td></tr>
                      <tr><td>coverage_basis</td><td>round(100.0 × 0.35) = 35</td></tr>
                      <tr><td>reconstruction_points</td><td>{gaugeData?.score?.components?.reconstruction_points ?? 25}</td></tr>
                      <tr><td>reconstruction_basis</td><td>DIM-02.state=PASS → 25 pts</td></tr>
                      <tr><td>projected_score</td><td>{gaugeData?.projection?.value ?? 100}</td></tr>
                      <tr><td>projection_rule</td><td>{gaugeData?.projection?.rule ?? 'PR-02'}</td></tr>
                      <tr><td>confidence_lower</td><td>{gaugeData?.confidence?.lower ?? 60}</td></tr>
                      <tr><td>confidence_upper</td><td>{gaugeData?.confidence?.upper ?? 100}</td></tr>
                      <tr><td>confidence_status</td><td>{gaugeData?.confidence?.status ?? 'COMPUTED'}</td></tr>
                      <tr><td>total_variance_reduction</td><td>0</td></tr>
                    </tbody>
                  </table>

                  <div className="op-group-label">DIM-01 — Coverage (coverage_state.json)</div>
                  <table className="op-table">
                    <tbody>
                      <tr><td>state</td><td>{gaugeData?.dimensions?.['DIM-01']?.state ?? 'COMPUTED'}</td></tr>
                      <tr><td>state_label</td><td>{gaugeData?.dimensions?.['DIM-01']?.state_label ?? 'FULL'}</td></tr>
                      <tr><td>coverage_percent</td><td>{(gaugeData?.dimensions?.['DIM-01']?.coverage_percent ?? 100).toFixed(1)}</td></tr>
                      <tr><td>required_units</td><td>{gaugeData?.dimensions?.['DIM-01']?.required_units ?? 30}</td></tr>
                      <tr><td>admissible_units</td><td>{gaugeData?.dimensions?.['DIM-01']?.admissible_units ?? 30}</td></tr>
                      <tr><td>method</td><td>IG.RUNTIME admissible coverage computation</td></tr>
                      <tr><td>authority</td><td>{gaugeData?.dimensions?.['DIM-01']?.authority ?? 'PSEE-GAUGE.0 DP-5-02'}</td></tr>
                      <tr><td>stream</td><td>{gaugeData?.coverage?.stream ?? 'PSEE-RUNTIME.5A'}</td></tr>
                    </tbody>
                  </table>

                  <div className="op-group-label">DIM-02 — Reconstruction (reconstruction_state.json)</div>
                  <table className="op-table">
                    <tbody>
                      <tr><td>state</td><td>{gaugeData?.dimensions?.['DIM-02']?.state ?? 'PASS'}</td></tr>
                      <tr><td>validated_units</td><td>{gaugeData?.reconstruction?.validated_units ?? 30}</td></tr>
                      <tr><td>total_units</td><td>{gaugeData?.reconstruction?.total_units ?? 30}</td></tr>
                      <tr><td>violations</td><td>{gaugeData?.reconstruction?.violations?.length ?? 0}</td></tr>
                      <tr><td>axis: COMPLETENESS</td><td>{gaugeData?.reconstruction?.axis_results?.COMPLETENESS ?? 'PASS'}</td></tr>
                      <tr><td>axis: STRUCTURAL_LINK</td><td>{gaugeData?.reconstruction?.axis_results?.STRUCTURAL_LINK ?? 'PASS'}</td></tr>
                      <tr><td>axis: REFERENTIAL_INTEGRITY</td><td>{gaugeData?.reconstruction?.axis_results?.REFERENTIAL_INTEGRITY ?? 'PASS'}</td></tr>
                      <tr><td>axis: LAYER_CONSISTENCY</td><td>{gaugeData?.reconstruction?.axis_results?.LAYER_CONSISTENCY ?? 'PASS'}</td></tr>
                      <tr><td>method</td><td>IG.RUNTIME structural reconstruction validation</td></tr>
                      <tr><td>authority</td><td>{gaugeData?.reconstruction?.authority ?? 'PSEE-GAUGE.0 DP-6-03'}</td></tr>
                      <tr><td>stream</td><td>{gaugeData?.reconstruction?.stream ?? 'PSEE-RUNTIME.6A'}</td></tr>
                    </tbody>
                  </table>

                  <div className="op-group-label">DIM-03 through DIM-06 (gauge_state.json)</div>
                  <table className="op-table">
                    <tbody>
                      <tr><td>DIM-03 Escalation Clearance</td><td>{gaugeData?.dimensions?.['DIM-03']?.value ?? 100} — {gaugeData?.dimensions?.['DIM-03']?.state_label ?? 'CLEAR'}</td></tr>
                      <tr><td>DIM-04 Unknown-Space</td><td>{gaugeData?.dimensions?.['DIM-04']?.total_count ?? 0} records — {gaugeData?.dimensions?.['DIM-04']?.state_label ?? 'NONE'}</td></tr>
                      <tr><td>DIM-05 Intake Completeness</td><td>{gaugeData?.dimensions?.['DIM-05']?.state ?? 'COMPLETE'}</td></tr>
                      <tr><td>DIM-06 Heuristic Compliance</td><td>{gaugeData?.dimensions?.['DIM-06']?.state ?? 'PASS'}</td></tr>
                    </tbody>
                  </table>

                  <div className="op-authority">
                    Authority refs: PSEE-GAUGE.0/gauge_score_model.md §G.2–G.4 ·
                    PSEE-GAUGE.0/dimension_projection_model.md §DIM-01..06 ·
                    PSEE-GAUGE.0/confidence_and_variance_model.md §Total Variance Computation ·
                    PSEE-GAUGE.0/projection_logic_spec.md §PR-02
                  </div>
                </div>
              </details>
            </div>

          </div>{/* /col-left */}

          {/* ─────────── CENTER COLUMN ─────────── */}
          <div className="col-center">

            {/* Structural Proof Summary */}
            <div className="panel">
              <div className="panel-label">Structural Proof</div>

              {discoveryEnabled && (
                <div className="discovery-success">
                  PiOS Discovery access enabled for structural exploration.
                  <div className="discovery-success-sub">Execution-layer scenarios remain unavailable until execution runs.</div>
                </div>
              )}

              <div className="si-bridge">
                <div className="si-bridge-title">
                  Structural Proof Summary{' '}
                  {discoveryEnabled && (
                    <span className="access-chip">ACCESS ENABLED</span>
                  )}
                </div>
                <div className="si-bridge-sub">
                  PSEE-validated reconstruction proof across 3 intake layers.
                  30 structural units validated. Provenance chain, layer integrity,
                  and case structure are governed artifacts for this run.
                  This is not yet the interactive PiOS Structural Insights surface.
                </div>

                <div className="si-bridge-metrics">
                  <div className="si-metric">
                    <div className="si-metric-val">{gaugeData?.reconstruction?.validated_units ?? 30}</div>
                    <div className="si-metric-lbl">PSEE Validated Units</div>
                  </div>
                  <div className="si-metric">
                    <div className="si-metric-val">{Object.keys(gaugeData?.reconstruction?.axis_results ?? {}).length || 4}</div>
                    <div className="si-metric-lbl">Reconstruction Axes</div>
                  </div>
                  <div className="si-metric">
                    <div className="si-metric-val">{gaugeData?.reconstruction?.violations?.length ?? 0}</div>
                    <div className="si-metric-lbl">Proof Violations</div>
                  </div>
                </div>

                {discoveryEnabled ? (
                  <span className="si-bridge-btn-enabled">Discovery Access Enabled</span>
                ) : (
                  <button className="si-bridge-btn" onClick={openModal}>
                    Unlock PiOS Discovery &#x2192;
                  </button>
                )}

                <div className="si-bridge-artifacts">
                  Governed artifacts in this run:<br/>
                  operator_case_view.md &middot; operator_integrity_view.md &middot;<br/>
                  operator_trace_view.md &middot; operator_unknown_space_view.md
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#8b949e', lineHeight: '1.6' }}>
                This panel reflects validated PSEE reconstruction state.<br/>
                Full PiOS Structural Insights mounting remains part of reconciliation.<br/>
                Interactive discovery requires PiOS Discovery access.
              </div>
            </div>

            {/* Discovery Queries */}
            <div className="panel">
              <div className="panel-label">Discovery Queries</div>

              {/* Structural queries — unlock with access key */}
              <div className={`query-block structural-query${discoveryEnabled ? ' unlocked' : ''}`}>
                <div className="query-text">&ldquo;Which structural units carry the highest referential integrity exposure?&rdquo;</div>
                <div className="query-lock-bar">
                  <div className="query-lock-reason">
                    {discoveryEnabled ? 'PiOS Discovery access enabled' : 'Requires PiOS Discovery · structural query'}
                  </div>
                  <div className="query-lock-badge">
                    {discoveryEnabled ? 'AVAILABLE' : 'LOCKED — Access Key'}
                  </div>
                </div>
              </div>

              <div className={`query-block structural-query${discoveryEnabled ? ' unlocked' : ''}`}>
                <div className="query-text">&ldquo;Trace provenance chain from IG.6 orchestration to terminal intake boundary.&rdquo;</div>
                <div className="query-lock-bar">
                  <div className="query-lock-reason">
                    {discoveryEnabled ? 'PiOS Discovery access enabled' : 'Requires PiOS Discovery · provenance trace'}
                  </div>
                  <div className="query-lock-badge">
                    {discoveryEnabled ? 'AVAILABLE' : 'LOCKED — Access Key'}
                  </div>
                </div>
              </div>

              <div className={`query-block structural-query${discoveryEnabled ? ' unlocked' : ''}`}>
                <div className="query-text">&ldquo;Show layer-by-layer structural linking across L40_2, L40_3, L40_4.&rdquo;</div>
                <div className="query-lock-bar">
                  <div className="query-lock-reason">
                    {discoveryEnabled ? 'PiOS Discovery access enabled' : 'Requires PiOS Discovery · layer analysis'}
                  </div>
                  <div className="query-lock-badge">
                    {discoveryEnabled ? 'AVAILABLE' : 'LOCKED — Access Key'}
                  </div>
                </div>
              </div>

              {/* Execution queries — remain locked regardless of access key */}
              <div className="query-block exec-locked">
                <div className="query-text">&ldquo;What are the execution failure scenarios for this intake under signal degradation?&rdquo;</div>
                <div className="query-lock-bar">
                  <div className="query-lock-reason">Execution Layer Required</div>
                  <div className="query-lock-badge">LOCKED — Execution Layer + Access Key</div>
                </div>
              </div>

              <div className="query-block exec-locked">
                <div className="query-text">&ldquo;Project signal propagation paths from coverage boundary to terminal state.&rdquo;</div>
                <div className="query-lock-bar">
                  <div className="query-lock-reason">Execution Layer Required</div>
                  <div className="query-lock-badge">LOCKED — Execution Layer + Access Key</div>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#333', marginTop: '12px', borderTop: '1px solid #1f2937', paddingTop: '10px', lineHeight: '1.7' }}>
                Structural queries unlock with PiOS Discovery access key only.<br/>
                Execution queries require the execution layer to have run, regardless of access key.
              </div>
            </div>

            {/* State Summary */}
            <div className="panel">
              <div className="panel-label">State Summary</div>

              <div className="state-row"><div className="state-dot" style={{ background: '#3fb950' }}></div><span>Structural proof: <strong>COMPLETE</strong></span></div>
              <div className="state-row"><div className="state-dot" style={{ background: '#3fb950' }}></div><span>Coverage: <strong>{gaugeData?.dimensions?.['DIM-01']?.coverage_percent ?? 100}% ({gaugeData?.dimensions?.['DIM-01']?.admissible_units ?? 30}/{gaugeData?.dimensions?.['DIM-01']?.required_units ?? 30} units)</strong></span></div>
              <div className="state-row"><div className="state-dot" style={{ background: '#3fb950' }}></div><span>Reconstruction: <strong>{gaugeData?.dimensions?.['DIM-02']?.state ?? 'PASS'} ({Object.keys(gaugeData?.reconstruction?.axis_results ?? {}).length || 4}-axis, {gaugeData?.reconstruction?.violations?.length ?? 0} violations)</strong></span></div>
              <div className="state-row"><div className="state-dot" style={{ background: '#d29922' }}></div><span>Score: <strong>{gaugeData?.score?.canonical ?? 60} {gaugeData?.score?.band_label ?? 'CONDITIONAL'}</strong> — proven floor</span></div>
              <div className="state-row"><div className="state-dot" style={{ background: '#8b949e' }}></div><span>Execution insight: <strong style={{ color: '#8b949e' }}>NOT EVALUATED</strong></span></div>
              <div className="state-row">
                <div className="state-dot" style={{ background: discoveryEnabled ? '#3fb950' : '#1b3a5c' }}></div>
                <span>Structural discovery:{' '}
                  {discoveryEnabled
                    ? <strong style={{ color: '#3fb950' }}>ACCESS ENABLED</strong>
                    : <strong style={{ color: '#444' }}>ACCESS KEY REQUIRED</strong>
                  }
                </span>
              </div>
              <div className="state-row"><div className="state-dot" style={{ background: '#1f2937' }}></div><span>Execution scenarios: <strong style={{ color: '#333' }}>EXECUTION LAYER REQUIRED</strong></span></div>
            </div>

          </div>{/* /col-center */}

          {/* ─────────── RIGHT COLUMN ─────────── */}
          <div className="col-right">
            <RightColumn gaugeResult={gaugeResult} topoResult={topoResult} />
          </div>{/* /col-right */}

        </div>{/* /cols */}

      </div>{/* /outer */}
    </>
  )
}
