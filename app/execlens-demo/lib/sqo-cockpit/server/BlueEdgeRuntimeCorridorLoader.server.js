'use strict';

const path = require('path');
const { loadJSON } = require('../../lens-v2/SemanticArtifactLoader');
const { isClientRunAllowed } = require('../../lens-v2/manifests');

const CLIENT = 'blueedge';
const RUN = 'run_blueedge_productized_01_fixed';
const SANDBOX_ID = 'sandbox-multi-001';

const SANDBOX_BASE = path.join(
  'artifacts', 'sqo', CLIENT, RUN, SANDBOX_ID
);

function loadSandboxArtifact(relPath) {
  return loadJSON(path.join(SANDBOX_BASE, relPath));
}

function loadCorridorData() {
  if (!isClientRunAllowed(CLIENT, RUN)) {
    return { ok: false, error: 'CLIENT_RUN_NOT_REGISTERED' };
  }

  const manifest = loadSandboxArtifact('manifest.json');
  const compositeState = loadSandboxArtifact('mount/composite_state.json');
  const mountLog = loadSandboxArtifact('mount/mount_log.json');
  const replayVerification = loadSandboxArtifact('replay/verification_log.json');
  const reconstructionInputs = loadSandboxArtifact('replay/reconstruction_inputs.json');
  const coexistence = loadSandboxArtifact('coexistence/coexistence_report.json');
  const baselineRef = loadSandboxArtifact('baseline_reference.json');
  const packageRegistry = loadSandboxArtifact('registry/package_registry.json');

  const sep001Activation = loadSandboxArtifact('packages/SEP-multi-001/activation_record.json');
  const sep002Activation = loadSandboxArtifact('packages/SEP-multi-002/activation_record.json');
  const sep003Activation = loadSandboxArtifact('packages/SEP-multi-003/activation_record.json');

  const sep001Package = loadSandboxArtifact('packages/SEP-multi-001/package.json');
  const sep002Package = loadSandboxArtifact('packages/SEP-multi-002/package.json');
  const sep003Package = loadSandboxArtifact('packages/SEP-multi-003/package.json');

  const qualState = loadJSON(
    path.join('artifacts', 'sqo', CLIENT, RUN, 'qualification_state.v1.json')
  );

  const loadedCount = [
    manifest, compositeState, mountLog, replayVerification,
    reconstructionInputs, coexistence, baselineRef, packageRegistry,
    sep001Activation, sep002Activation, sep003Activation,
    sep001Package, sep002Package, sep003Package, qualState,
  ].filter(r => r && r.ok).length;

  return {
    ok: loadedCount > 0,
    client: CLIENT,
    run_id: RUN,
    sandbox_id: SANDBOX_ID,
    loaded_count: loadedCount,
    total_count: 15,
    artifacts: {
      manifest,
      composite_state: compositeState,
      mount_log: mountLog,
      replay_verification: replayVerification,
      reconstruction_inputs: reconstructionInputs,
      coexistence,
      baseline_reference: baselineRef,
      package_registry: packageRegistry,
      overlays: {
        'SEP-multi-001': { activation: sep001Activation, package: sep001Package },
        'SEP-multi-002': { activation: sep002Activation, package: sep002Package },
        'SEP-multi-003': { activation: sep003Activation, package: sep003Package },
      },
      qualification_state: qualState,
    },
  };
}

module.exports = { loadCorridorData, CLIENT, RUN, SANDBOX_ID };
