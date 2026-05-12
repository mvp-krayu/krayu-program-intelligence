'use strict';

const path = require('path');
const crypto = require('crypto');
const { loadJSON, artifactExists, REPO_ROOT } = require('../../lens-v2/SemanticArtifactLoader');
const { isClientRunAllowed } = require('../../lens-v2/manifests');
const fs = require('fs');

const CLIENT = 'blueedge';
const RUN = 'run_blueedge_productized_01_fixed';
const REGISTRY_PATH = path.join(
  'artifacts', 'sqo', CLIENT, RUN, 'evidence-ingestion', 'evidence_registry.v1.json'
);

function verifyEvidenceHash(item) {
  if (!item || !item.source_path) return { verified: false, reason: 'NO_SOURCE_PATH' };

  const abs = path.resolve(REPO_ROOT, item.source_path);
  if (!abs.startsWith(REPO_ROOT)) return { verified: false, reason: 'PATH_OUTSIDE_REPO' };
  if (!fs.existsSync(abs)) return { verified: false, reason: 'FILE_NOT_FOUND' };

  const content = fs.readFileSync(abs);
  const computed = crypto.createHash('sha256').update(content).digest('hex');
  return {
    verified: computed === item.evidence_hash,
    computed_hash: computed,
    expected_hash: item.evidence_hash,
  };
}

function loadEvidenceIngestionData() {
  if (!isClientRunAllowed(CLIENT, RUN)) {
    return { ok: false, error: 'CLIENT_RUN_NOT_REGISTERED' };
  }

  const registry = loadJSON(REGISTRY_PATH);
  if (!registry || !registry.ok) {
    return { ok: false, error: 'EVIDENCE_REGISTRY_NOT_FOUND', registry };
  }

  const items = registry.data.evidence_items || [];
  const verifications = items.map(item => ({
    evidence_id: item.evidence_id,
    ...verifyEvidenceHash(item),
  }));

  return {
    ok: true,
    client: CLIENT,
    run_id: RUN,
    registry: registry.data,
    verifications,
    item_count: items.length,
    all_verified: verifications.every(v => v.verified),
  };
}

module.exports = { loadEvidenceIngestionData, CLIENT, RUN };
