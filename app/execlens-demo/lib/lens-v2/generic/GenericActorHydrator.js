/**
 * GenericActorHydrator
 * PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
 *
 * Re-export of the existing 15-actor hydrator. The underlying
 * `SemanticActorHydrator` is already client/run-agnostic — it accepts
 * substrate data via inputs and contains no client-name branching. We
 * re-expose it under the `generic/` namespace so the productized API
 * is stable independent of the legacy module path.
 */

'use strict';

const {
  hydrateActors,
  deriveQualifierClass,
  deriveRenderState,
  extractDecisionPosture,
} = require('../SemanticActorHydrator');

module.exports = {
  hydrateActors,
  deriveQualifierClass,
  deriveRenderState,
  extractDecisionPosture,
};
