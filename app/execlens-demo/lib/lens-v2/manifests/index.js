/**
 * Manifest registry
 * PI.LENS.V2.GENERIC-SEMANTIC-PAYLOAD-RESOLVER.01
 *
 * Central allow-list mapping (client, run_id) → manifest filename.
 * Adding a new client/run is a one-line registry change plus a manifest
 * file. There is NO client-name branching anywhere in the resolver
 * — manifests are configuration, not code.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const { validateClientRunManifest } = require('../generic/ClientRunManifestSchema');

const MANIFESTS_REPO_RELATIVE = 'app/execlens-demo/lib/lens-v2/manifests';

const REGISTRY = {
  blueedge: {
    run_blueedge_productized_01_fixed: 'blueedge.run_blueedge_productized_01_fixed.json',
  },
};

function resolveRepoRoot() {
  if (process.env.REPO_ROOT && fs.existsSync(process.env.REPO_ROOT)) {
    return path.resolve(process.env.REPO_ROOT);
  }
  // Walk up from this file to find the repo root (presence of `.git` or
  // `package.json` at the top of `app/execlens-demo`). This survives
  // webpack-bundled environments where __dirname may be shifted.
  let cur = __dirname;
  for (let i = 0; i < 8; i += 1) {
    if (fs.existsSync(path.join(cur, '.git'))) return cur;
    const parent = path.dirname(cur);
    if (parent === cur) break;
    cur = parent;
  }
  // Fall back to the conventional 4-up path from this module's source
  // location. This matches the development tree.
  return path.resolve(__dirname, '..', '..', '..', '..');
}

function resolveManifestPath(filename) {
  const repoRoot = resolveRepoRoot();
  // Prefer the manifests directory beside this module (works in
  // standard Node and Jest contexts).
  const beside = path.join(__dirname, filename);
  if (fs.existsSync(beside)) return beside;
  // Fall back to the canonical, REPO_ROOT-anchored path. This survives
  // webpack-bundled API routes where __dirname is virtualised.
  return path.join(repoRoot, MANIFESTS_REPO_RELATIVE, filename);
}

function listKnownPairs() {
  const out = [];
  for (const c of Object.keys(REGISTRY)) {
    for (const r of Object.keys(REGISTRY[c])) {
      out.push({ client: c, run: r });
    }
  }
  return out;
}

function isAllowedPair(client, runId) {
  return !!(REGISTRY[client] && REGISTRY[client][runId]);
}

/**
 * Load a validated manifest from the local manifests directory.
 *
 * @returns {{ ok: boolean, error?: string, detail?: any, manifest?: object, manifestPath?: string }}
 */
function loadManifest(client, runId) {
  if (!isAllowedPair(client, runId)) {
    if (!REGISTRY[client]) return { ok: false, error: 'CLIENT_NOT_ALLOWED', client };
    return { ok: false, error: 'RUN_NOT_ALLOWED', client, run: runId };
  }
  const filename = REGISTRY[client][runId];
  const manifestPath = resolveManifestPath(filename);
  let raw;
  try {
    raw = fs.readFileSync(manifestPath, 'utf8');
  } catch (e) {
    return { ok: false, error: 'MANIFEST_READ_FAILED', detail: e.message, manifestPath };
  }
  let manifest;
  try {
    manifest = JSON.parse(raw);
  } catch (e) {
    return { ok: false, error: 'MANIFEST_PARSE_FAILED', detail: e.message, manifestPath };
  }
  const v = validateClientRunManifest(manifest);
  if (!v.ok) {
    return { ok: false, error: 'MANIFEST_INVALID', detail: v.errors, manifestPath };
  }
  // Cross-check: registry pair must equal manifest's declared identity.
  if (manifest.client !== client || manifest.run_id !== runId) {
    return {
      ok: false,
      error: 'MANIFEST_IDENTITY_MISMATCH',
      detail: { expected: { client, runId }, declared: { client: manifest.client, run_id: manifest.run_id } },
      manifestPath,
    };
  }
  return { ok: true, manifest, manifestPath };
}

/**
 * Public, contract-named API (PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-
 * REGISTRY-UNIFICATION.01). These are aliases of the existing helpers,
 * exposed under the names the contract requires so both the runtime
 * page and the rendering_metadata writer consume a single source of
 * truth for allow-list behaviour.
 */

function listAllowedClientRuns() {
  return listKnownPairs();
}

function isClientRunAllowed(client, runId) {
  return isAllowedPair(client, runId);
}

function resolveClientRunManifest(client, runId) {
  return loadManifest(client, runId);
}

module.exports = {
  REGISTRY,
  // Legacy named exports — preserved for backward-compat consumers
  listKnownPairs,
  isAllowedPair,
  loadManifest,
  // Contract-named aliases (single source of truth for allow-list)
  listAllowedClientRuns,
  isClientRunAllowed,
  resolveClientRunManifest,
};
