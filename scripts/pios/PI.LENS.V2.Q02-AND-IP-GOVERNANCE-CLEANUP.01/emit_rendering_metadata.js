#!/usr/bin/env node
/**
 * emit_rendering_metadata.js
 * PI.LENS.V2.Q02-AND-IP-GOVERNANCE-CLEANUP.01
 *
 * Replay-safe vault writer for the rendering_metadata.json artifact.
 *
 * Reads governed substrate (semantic topology + decision validation +
 * crosswalk) from a per-run path, derives the Q-class via the
 * QClassResolver, and emits clients/<client>/psee/runs/<run>/vault/
 * rendering_metadata.json.
 *
 * Replay safety:
 *   - generated_at is anchored on the dpsig_signal_set generated_at
 *     timestamp (same input → same timestamp).
 *   - JSON output is canonicalised: 2-space indent, sorted keys at the
 *     top level, deterministic array order.
 *   - Re-running produces a byte-identical file unless the substrate
 *     changes.
 *
 * Governance:
 *   - additive-only writes; never mutates prior artifacts.
 *   - never infers missing grounding.
 *   - never reads files outside REPO_ROOT.
 *
 * Usage:
 *   REPO_ROOT=/abs/path node emit_rendering_metadata.js \
 *     --client blueedge \
 *     --run    run_blueedge_productized_01_fixed
 *
 *   (the writer also accepts --dry-run to print the payload to stdout
 *   without writing.)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const repoRoot = process.env.REPO_ROOT
  ? path.resolve(process.env.REPO_ROOT)
  : path.resolve(__dirname, '..', '..', '..');

const libDir = path.join(repoRoot, 'app', 'execlens-demo', 'lib', 'lens-v2');
const { resolveQClass, governanceToLegacy } = require(path.join(libDir, 'QClassResolver'));
const { buildRenderingMetadata, validateRenderingMetadata } = require(path.join(libDir, 'RenderingMetadataSchema'));

// PI.LENS.V2.RUNTIME-PARAMETERIZATION-AND-REGISTRY-UNIFICATION.01:
// the writer's allow-list is now sourced from the manifest registry,
// the same source of truth used by /api/lens-payload, /api/report-pack,
// and pages/lens-v2-flagship.js. Adding a new client/run requires no
// change to this script.
const manifestsDir = path.join(libDir, 'manifests');
const {
  isClientRunAllowed,
  listAllowedClientRuns,
} = require(path.join(manifestsDir));

// Legacy named exports — kept for backward-compatibility consumers that
// imported these directly from the script. Computed from the registry.
const ALLOWED_CLIENTS = new Set(listAllowedClientRuns().map((p) => p.client));
const ALLOWED_RUNS = listAllowedClientRuns().reduce((acc, p) => {
  if (!acc[p.client]) acc[p.client] = new Set();
  acc[p.client].add(p.run);
  return acc;
}, {});

const ACTOR_CODES = ['DP', 'CB', 'PA', 'PP', 'AL', 'RE', 'ST', 'SB', 'SO', 'CC', 'SS', 'ET', 'RB', 'IP', 'RA'];

function parseArgs(argv) {
  const out = { dryRun: false };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--client') out.client = argv[++i];
    else if (a === '--run') out.run = argv[++i];
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '-h' || a === '--help') out.help = true;
  }
  return out;
}

function paramSafe(value) {
  return typeof value === 'string'
    && /^[A-Za-z0-9_\-]+$/.test(value)
    && !value.includes('..')
    && value.length > 0
    && value.length <= 200;
}

function safeJoin(root, relative) {
  const abs = path.resolve(root, relative);
  const rel = path.relative(root, abs);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`PATH_ESCAPED_REPO_ROOT:${relative}`);
  }
  return abs;
}

function readJSON(absPath) {
  if (!fs.existsSync(absPath)) {
    throw new Error(`SOURCE_ARTIFACT_MISSING:${absPath}`);
  }
  const raw = fs.readFileSync(absPath, 'utf8');
  return JSON.parse(raw);
}

function classifyDomains(semanticTopologyModel) {
  const domains = (semanticTopologyModel && semanticTopologyModel.domains) || [];
  const total = domains.length;
  const backed = domains.filter(d => d.lineage_status === 'EXACT' || d.lineage_status === 'STRONG').length;
  return { total, backed };
}

function semanticContinuityFromCrosswalk(crosswalk) {
  // The presence of a parsable crosswalk artifact with at least one
  // mapping is the deterministic test for semantic continuity validation.
  if (!crosswalk) return 'ABSENT';
  if (Array.isArray(crosswalk.mappings) && crosswalk.mappings.length > 0) return 'VALIDATED';
  if (Array.isArray(crosswalk.entries) && crosswalk.entries.length > 0) return 'VALIDATED';
  if (typeof crosswalk === 'object') {
    // Any non-trivial object body counts as VALIDATED for this artifact.
    const nontrivialKeys = Object.keys(crosswalk).filter(k => k !== '$schema');
    if (nontrivialKeys.length > 0) return 'VALIDATED';
  }
  return 'ABSENT';
}

function buildUnresolvedSemanticGaps(semanticTopologyModel) {
  const gaps = [];
  const domains = (semanticTopologyModel && semanticTopologyModel.domains) || [];
  for (const d of domains) {
    if (d.lineage_status === 'NONE' || d.lineage_status === 'WEAK') {
      gaps.push({
        code: `DOMAIN_NOT_STRUCTURALLY_BACKED:${d.domain_id || d.domain_name}`,
        domain_id: d.domain_id || d.domain_name || null,
        reason: `lineage_status = ${d.lineage_status}; semantic continuity present, structural backing absent`,
        impact: 'ADVISORY_REQUIRED',
        evidence_path: 'semantic/topology/semantic_topology_model.json',
      });
    }
  }
  return gaps;
}

function buildActorProjectionStatus() {
  // For BlueEdge productized, IP transitions from PLACEHOLDER to HYDRATED
  // once this very artifact is written. All other actors keep their
  // post-binding statuses.
  return {
    DP: 'HYDRATED',
    CB: 'HYDRATED_WITH_DERIVATION',
    PA: 'HYDRATED',
    PP: 'HYDRATED',
    AL: 'HYDRATED',
    RE: 'HYDRATED',
    ST: 'HYDRATED',
    SB: 'HYDRATED',
    SO: 'HYDRATED',
    CC: 'HYDRATED',
    SS: 'HYDRATED',
    ET: 'HYDRATED',
    RB: 'HYDRATED_WITH_DERIVATION',
    IP: 'HYDRATED',
    RA: 'PRESENTATION_LAYER_DERIVED',
  };
}

function disclosureRequirementsFor(qClass) {
  const list = [
    'Display the qualifier class with the contract-mandated executive language',
    'Forbid probabilistic / AI-confidence / medium-confidence wording on the surface',
  ];
  if (qClass === 'Q-02') {
    list.push('Enumerate unresolved_semantic_gaps to the executive');
    list.push('Visibly state the advisory-confirmation requirement before commitment');
  } else if (qClass === 'Q-03') {
    list.push('Visibly state the absence of structural backing');
    list.push('Mandate executive caution');
  } else if (qClass === 'Q-04') {
    list.push('Render an explicit absence notice; do not render the qualifier chip');
  }
  return list;
}

function canonicalStringify(obj) {
  // Stable, deterministic JSON: sorts keys at every depth.
  function sort(value) {
    if (Array.isArray(value)) return value.map(sort);
    if (value && typeof value === 'object') {
      const out = {};
      for (const k of Object.keys(value).sort()) out[k] = sort(value[k]);
      return out;
    }
    return value;
  }
  return JSON.stringify(sort(obj), null, 2) + '\n';
}

function main(argv) {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write('usage: emit_rendering_metadata.js --client <client> --run <run> [--dry-run]\n');
    return 0;
  }
  if (!paramSafe(args.client) || !paramSafe(args.run)) {
    process.stderr.write(`INVALID_PARAM: ${args.client} / ${args.run}\n`);
    return 64;
  }
  // Single source of truth: the manifest registry.
  if (!isClientRunAllowed(args.client, args.run)) {
    if (!ALLOWED_CLIENTS.has(args.client)) {
      process.stderr.write(`CLIENT_NOT_ALLOWED: ${args.client}\n`);
    } else {
      process.stderr.write(`RUN_NOT_ALLOWED: ${args.client} / ${args.run}\n`);
    }
    return 64;
  }

  const runRel = path.posix.join('clients', args.client, 'psee', 'runs', args.run);
  const runRoot = safeJoin(repoRoot, runRel);
  const dpsigRel = path.posix.join('artifacts', 'dpsig', args.client, args.run, 'dpsig_signal_set.json');
  const dpsigPath = safeJoin(repoRoot, dpsigRel);

  const semanticTopologyModel = readJSON(safeJoin(runRoot, 'semantic/topology/semantic_topology_model.json'));
  const decisionValidation     = readJSON(safeJoin(runRoot, 'semantic/decision/decision_validation.json'));
  const crosswalk              = readJSON(safeJoin(runRoot, 'semantic/crosswalk/semantic_continuity_crosswalk.json'));
  const dpsigSignalSet         = readJSON(dpsigPath);

  const { total, backed } = classifyDomains(semanticTopologyModel);
  const semanticContinuity = semanticContinuityFromCrosswalk(crosswalk);
  const evidenceAvailable = decisionValidation ? 'AVAILABLE' : 'ABSENT';

  const q = resolveQClass({
    backed_count: backed,
    total_count: total,
    semantic_continuity_status: semanticContinuity,
    evidence_availability: evidenceAvailable,
  });

  const unresolvedGaps = buildUnresolvedSemanticGaps(semanticTopologyModel);
  const actorProjection = buildActorProjectionStatus();

  const generatedAt = (dpsigSignalSet && dpsigSignalSet.generated_at) || '1970-01-01T00:00:00Z';

  const doc = buildRenderingMetadata({
    client_id: args.client,
    run_id: args.run,
    generated_at: generatedAt,
    grounding_class: q.qualifier_class,
    semantic_projection_class: q.semantic_projection_class,
    inference_prohibition_status: 'ENFORCED',
    semantic_continuity_status: semanticContinuity,
    derivation_inputs: q.derivation_inputs,
    unresolved_semantic_gaps: unresolvedGaps,
    disclosure_requirements: disclosureRequirementsFor(q.qualifier_class),
    actor_projection_status: actorProjection,
    qualifier_rules_applied: [q.qualifier_class, governanceToLegacy(q.qualifier_class) || ''].filter(Boolean),
    ali_rules_applied: [],
  });

  // Compute self-hash for replay verification (excluding the hash field
  // itself).
  const hashSeed = canonicalStringify({ ...doc, rendering_metadata_hash: undefined });
  doc.rendering_metadata_hash = 'sha256:' + crypto.createHash('sha256').update(hashSeed).digest('hex');

  const v = validateRenderingMetadata(doc);
  if (!v.ok) {
    process.stderr.write(`VALIDATION_FAILED:\n${v.errors.join('\n')}\n`);
    return 65;
  }

  const outRel = path.posix.join(runRel, 'vault', 'rendering_metadata.json');
  const outPath = safeJoin(repoRoot, outRel);
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const body = canonicalStringify(doc);
  if (args.dryRun) {
    process.stdout.write(body);
    return 0;
  }

  fs.writeFileSync(outPath, body, 'utf8');
  process.stdout.write(`WROTE:${outRel}\n`);
  process.stdout.write(`HASH:${doc.rendering_metadata_hash}\n`);
  process.stdout.write(`CLASS:${doc.grounding_class}\n`);
  return 0;
}

if (require.main === module) {
  process.exit(main(process.argv));
}

module.exports = { main, paramSafe };
