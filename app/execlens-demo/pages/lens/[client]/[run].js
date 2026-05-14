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
  const result = resolveFlagshipBinding({
    query: (context && context.query) || {},
    res: (context && context.res) || null,
  })
  return { props: result.props }
}

export default LensV2FlagshipPage
