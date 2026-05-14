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
  return { props: { ...result.props, correspondenceData, evidenceIntakeData, debtIndexData, progressionData, maturityData, temporalAnalyticsData, temporalLifecycleData } }
}

export default LensV2FlagshipPage
