/**
 * pages/lens/[client]/[run].js
 * PI.LENS.V2.PHASE3.URL-SEPARATION.01
 *
 * Canonical executive LENS v2 route.
 * Audience: Executive — consequence-first operational intelligence.
 *
 * Consumes the same binding as the legacy /lens-v2-flagship route.
 * Client and run are path parameters, not query parameters.
 *
 * Governance:
 *   - no fixture fallback
 *   - no synthetic semantics
 *   - no AI inference
 *   - surfaces do not compute
 */

import LensV2FlagshipPage from '../../lens-v2-flagship'

export async function getServerSideProps(context) {
  const { resolveFlagshipBinding } = require('../../../lib/lens-v2/flagshipBinding')
  const { loadJSON } = require('../../../lib/lens-v2/SemanticArtifactLoader')
  const result = resolveFlagshipBinding({
    query: (context && context.query) || {},
    res: (context && context.res) || null,
  })
  const query = (context && context.query) || {}
  const client = query.client || ''
  const run = query.run || ''
  const corrPath = `artifacts/sqo/${client}/${run}/reconciliation_correspondence.enriched.v1.json`
  const corrResult = loadJSON(corrPath)
  const correspondenceData = corrResult.ok ? corrResult.data : null
  const intakePath = `artifacts/sqo/${client}/${run}/semantic_evidence_intake.v1.json`
  const intakeResult = loadJSON(intakePath)
  const evidenceIntakeData = intakeResult.ok ? intakeResult.data : null
  const debtPath = `artifacts/sqo/${client}/${run}/semantic_debt_index.v1.json`
  const debtResult = loadJSON(debtPath)
  const debtIndexData = debtResult.ok ? debtResult.data : null
  const progPath = `artifacts/sqo/${client}/${run}/progression_readiness.v1.json`
  const progResult = loadJSON(progPath)
  const progressionData = progResult.ok ? progResult.data : null
  const matPath = `artifacts/sqo/${client}/${run}/maturity_dimension_breakdown.v1.json`
  const matResult = loadJSON(matPath)
  const maturityData = matResult.ok ? matResult.data : null
  const tempAnalPath = `artifacts/sqo/${client}/${run}/reconciliation_temporal_analytics.v1.json`
  const tempAnalResult = loadJSON(tempAnalPath)
  const temporalAnalyticsData = tempAnalResult.ok ? tempAnalResult.data : null
  const tempLifePath = `artifacts/sqo/${client}/${run}/reconciliation_lifecycle.v1.json`
  const tempLifeResult = loadJSON(tempLifePath)
  const temporalLifecycleData = tempLifeResult.ok ? tempLifeResult.data : null

  let sqoAuthorityWorkspace = null
  try {
    const { resolveAuthorityWorkspace } = require('../../../lib/sqo-cockpit/server/OperatorWorkflowResolver.server')
    const workspace = resolveAuthorityWorkspace(client, run)
    if (workspace && workspace.available) {
      sqoAuthorityWorkspace = JSON.parse(JSON.stringify(workspace, (_, v) => v === undefined ? null : v))
    }
  } catch (_) { /* SQO workspace unavailable — graceful */ }

  let runtimeConnectivityEdges = null
  let visibilityLayerCompleteness = null
  try {
    const rcPath = `clients/${client}/psee/runs/${run}/structure/runtime_connectivity/system_connectivity_graph.json`
    const rcResult = loadJSON(rcPath)
    if (rcResult.ok && rcResult.data && rcResult.data.edges) {
      runtimeConnectivityEdges = rcResult.data.edges
    }

    const vlcPath = `clients/${client}/psee/runs/${run}/structure/runtime_connectivity/visibility_layer_completeness.json`
    const vlcResult = loadJSON(vlcPath)
    if (vlcResult.ok && vlcResult.data) {
      visibilityLayerCompleteness = vlcResult.data
    }

    if (!visibilityLayerCompleteness) {
      const { resolveVisibilityLayerCompleteness } = require('../../../lib/copilot/PIKnowledgeGraphAccess')
      const specimen = result.props && result.props.livePayload
      if (specimen) {
        const vlc = resolveVisibilityLayerCompleteness(specimen, client, run)
        if (vlc) {
          visibilityLayerCompleteness = vlc

          const { resolveAllowedPath } = require('../../../lib/lens-v2/SemanticArtifactLoader')
          try {
            const fs = require('fs')
            const path = require('path')
            const rcDir = path.dirname(resolveAllowedPath(vlcPath))
            if (!fs.existsSync(rcDir)) fs.mkdirSync(rcDir, { recursive: true })
            fs.writeFileSync(resolveAllowedPath(vlcPath), JSON.stringify({ ...vlc, persisted_at: new Date().toISOString(), specimen: client, run_id: run }, null, 2))
          } catch (_) { /* write failed */ }
        }
      }
    }
  } catch (_) { /* runtime connectivity not available */ }

  let runtimeGraphs = null
  try {
    const { loadRuntimeGraphs, deriveRuntimeSignals } = require('../../../lib/lens-v2/RuntimeSignalDerivation')
    const { resolveAllowedPath } = require('../../../lib/lens-v2/SemanticArtifactLoader')
    const path = require('path')
    const repoRoot = path.dirname(resolveAllowedPath('clients'))
    const graphs = loadRuntimeGraphs(client, run, repoRoot)
    const hasAnyGraph = graphs && Object.values(graphs).some(v => v !== null)
    if (hasAnyGraph) {
      const derivedSignals = deriveRuntimeSignals(graphs)
      runtimeGraphs = { _derived_signals: derivedSignals }
    }
  } catch (_) { /* runtime graphs not available */ }

  return { props: { ...result.props, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData, sqoAuthorityWorkspace, sqoBinding: { client, runId: run }, runtimeConnectivityEdges, visibilityLayerCompleteness, runtimeGraphs } }
}

export default LensV2FlagshipPage
