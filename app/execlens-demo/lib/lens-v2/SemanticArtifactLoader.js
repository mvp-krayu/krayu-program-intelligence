/**
 * SemanticArtifactLoader
 * PI.LENS.V2.BLUEEDGE-LIVE-BINDING.01
 *
 * Safely load JSON / HTML artifacts from allowed paths under REPO_ROOT.
 * Fail closed on missing required artifacts; expose explicit missing list.
 *
 * Governance: read-only against Lane A canonical client/run paths and Lane D
 * artifacts/dpsig output. No source mutation. No path traversal.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname, '..', '..', '..', '..');

/**
 * Resolve an artifact path under REPO_ROOT, rejecting any path traversal.
 * Returns absolute path or throws.
 */
function resolveAllowedPath(relPath) {
  if (typeof relPath !== 'string' || relPath.length === 0) {
    throw new Error('PATH_INVALID');
  }
  if (relPath.includes('..')) {
    throw new Error('PATH_TRAVERSAL_REJECTED');
  }
  const abs = path.resolve(REPO_ROOT, relPath);
  if (!abs.startsWith(REPO_ROOT)) {
    throw new Error('PATH_OUTSIDE_REPO_ROOT');
  }
  return abs;
}

/**
 * Safely load a JSON file. Returns { ok, data, missing, error, path }.
 * Never throws.
 */
function loadJSON(relPath) {
  let abs;
  try {
    abs = resolveAllowedPath(relPath);
  } catch (e) {
    return { ok: false, missing: false, error: e.message, path: relPath };
  }
  if (!fs.existsSync(abs)) {
    return { ok: false, missing: true, path: relPath };
  }
  try {
    const raw = fs.readFileSync(abs, 'utf8');
    const data = JSON.parse(raw);
    return { ok: true, data, path: relPath };
  } catch (e) {
    return { ok: false, missing: false, error: e.message, path: relPath };
  }
}

/**
 * Check whether an artifact file exists under REPO_ROOT.
 */
function artifactExists(relPath) {
  try {
    const abs = resolveAllowedPath(relPath);
    return fs.existsSync(abs);
  } catch (e) {
    return false;
  }
}

/**
 * Read an HTML file as text (for report-pack streaming).
 */
function loadText(relPath) {
  let abs;
  try {
    abs = resolveAllowedPath(relPath);
  } catch (e) {
    return { ok: false, missing: false, error: e.message, path: relPath };
  }
  if (!fs.existsSync(abs)) {
    return { ok: false, missing: true, path: relPath };
  }
  try {
    const text = fs.readFileSync(abs, 'utf8');
    return { ok: true, text, path: relPath };
  } catch (e) {
    return { ok: false, missing: false, error: e.message, path: relPath };
  }
}

module.exports = {
  REPO_ROOT,
  resolveAllowedPath,
  loadJSON,
  loadText,
  artifactExists,
};
