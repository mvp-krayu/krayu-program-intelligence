/**
 * Generic mappers index
 * PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
 *
 * Re-exports the existing reusable, client-agnostic mappers from
 * `app/execlens-demo/lib/lens-v2/`. These mappers operate on substrate
 * data only; they have never contained client-specific logic.
 */

'use strict';

const dpsig = require('../../DPSIGSignalMapper');
const crosswalk = require('../../SemanticCrosswalkMapper');

module.exports = {
  // DPSIG signal-set projection (TAXONOMY-01 preserving)
  projectDPSIGSignal: dpsig.projectDPSIGSignal,
  projectDPSIGSignalSet: dpsig.projectDPSIGSignalSet,
  projectPSIGSignals: dpsig.projectPSIGSignals,

  // Semantic continuity crosswalk (DOM-XX → business label)
  buildCrosswalkIndex: crosswalk.buildCrosswalkIndex,
  resolveDisplayLabel: crosswalk.resolveDisplayLabel,
  buildDisplayMap: crosswalk.buildDisplayMap,
  resolveCanonicalCluster: crosswalk.resolveCanonicalCluster,
};
