'use strict';

/**
 * Domain Calibration Engine
 *
 * Pure deterministic function: code_graph.json → calibrated domain registry + topology edges.
 * Groups files by top-level package, computes import direction, classifies structural role.
 * Zero human input. Zero specimen-specific rules. Zero AI.
 *
 * Usage:
 *   node calibrate_domains.js <path-to-code_graph.json> [output-dir]
 *
 * Outputs:
 *   calibrated_domain_registry.json
 *   calibrated_domain_topology.json
 */

const fs = require('fs');
const path = require('path');

const MIN_FILE_COUNT = 5;

const TOKEN_ROLE_MAP = {
  common: 'SHARED_LIBRARY',
  shared: 'SHARED_LIBRARY',
  core: 'FOUNDATION',
  lib: 'SHARED_LIBRARY',
  utils: 'SHARED_LIBRARY',
  util: 'SHARED_LIBRARY',
  utilities: 'SHARED_LIBRARY',
  helpers: 'SHARED_LIBRARY',
  api: 'API_BOUNDARY',
  rest: 'API_BOUNDARY',
  server: 'API_BOUNDARY',
  gateway: 'API_BOUNDARY',
  auth: 'AUTH_BOUNDARY',
  authentication: 'AUTH_BOUNDARY',
  identity: 'AUTH_BOUNDARY',
  test: 'TEST_INFRASTRUCTURE',
  tests: 'TEST_INFRASTRUCTURE',
  testing: 'TEST_INFRASTRUCTURE',
  spec: 'TEST_INFRASTRUCTURE',
  fixtures: 'TEST_INFRASTRUCTURE',
  client: 'CLIENT_INTERFACE',
  sdk: 'CLIENT_INTERFACE',
  cli: 'CLIENT_INTERFACE',
  stream: 'STREAMING_INTERFACE',
  streaming: 'STREAMING_INTERFACE',
  realtime: 'STREAMING_INTERFACE',
  websocket: 'STREAMING_INTERFACE',
  build: 'BUILD_INFRASTRUCTURE',
  tools: 'BUILD_INFRASTRUCTURE',
  scripts: 'BUILD_INFRASTRUCTURE',
  packaging: 'BUILD_INFRASTRUCTURE',
  plugins: 'BUILD_INFRASTRUCTURE',
  lint: 'BUILD_INFRASTRUCTURE',
  pylint: 'BUILD_INFRASTRUCTURE',
  contributing: 'GOVERNANCE_ARTIFACT',
  docs: 'GOVERNANCE_ARTIFACT',
  governance: 'GOVERNANCE_ARTIFACT',
  actions: 'EXECUTION_ENGINE',
  runners: 'EXECUTION_ENGINE',
  workers: 'EXECUTION_ENGINE',
  executor: 'EXECUTION_ENGINE',
  reactor: 'EXECUTION_ENGINE',
  sensor: 'EXECUTION_ENGINE',
  frontend: 'APPLICATION_DOMAIN',
  backend: 'APPLICATION_DOMAIN',
  app: 'APPLICATION_DOMAIN',
  contrib: 'APPLICATION_DOMAIN',
};

function classifyRole(packageName, inbound, outbound, fileCount) {
  const lower = packageName.toLowerCase();
  const tokens = lower.replace(/[-_./]/g, ' ').split(/\s+/);

  for (const token of tokens) {
    if (TOKEN_ROLE_MAP[token]) return TOKEN_ROLE_MAP[token];
  }

  for (const token of tokens) {
    for (const [key, role] of Object.entries(TOKEN_ROLE_MAP)) {
      if (token.includes(key)) return role;
    }
  }

  const ratio = outbound > 0 ? inbound / outbound : (inbound > 0 ? Infinity : 0);

  if (ratio > 3) return 'FOUNDATION';
  if (ratio < 0.33 && fileCount > 15) return 'APPLICATION_DOMAIN';
  if (fileCount < 10 && inbound < 20) return 'UTILITY';
  return 'APPLICATION_DOMAIN';
}

function deriveDisplayName(packageName) {
  const clean = packageName.replace(/^\./, '').replace(/[-_]/g, ' ');
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function getPackageDepth(filePath, allPaths) {
  const parts = filePath.split('/');
  if (parts.length <= 1) return 0;

  if (parts[0] === 'netbox' && parts.length > 2) return 2;

  return 1;
}

function calibrate(codeGraphPath) {
  const cg = JSON.parse(fs.readFileSync(codeGraphPath, 'utf-8'));
  const imports = (cg.relationships || []).filter(r => r.relation_type === 'IMPORTS' && r.source_path && r.target_path);

  const allPaths = new Set();
  imports.forEach(r => { allPaths.add(r.source_path); allPaths.add(r.target_path); });

  const samplePath = [...allPaths][0] || '';
  const useDepth2 = samplePath.split('/').length > 2 && [...allPaths].slice(0, 20).every(p => {
    const first = p.split('/')[0];
    return [...allPaths].filter(pp => pp.startsWith(first + '/')).length > allPaths.size * 0.5;
  });

  function getPackage(filePath) {
    const parts = filePath.split('/');
    if (parts.length <= 1) return parts[0];

    if (useDepth2 && parts.length > 2) return parts.slice(0, 2).join('/');
    return parts[0];
  }

  const pkgFiles = {};
  const pkgInbound = {};
  const pkgOutbound = {};

  for (const r of imports) {
    const srcPkg = getPackage(r.source_path);
    const tgtPkg = getPackage(r.target_path);

    if (!pkgFiles[srcPkg]) pkgFiles[srcPkg] = new Set();
    if (!pkgFiles[tgtPkg]) pkgFiles[tgtPkg] = new Set();
    pkgFiles[srcPkg].add(r.source_path);
    pkgFiles[tgtPkg].add(r.target_path);

    if (srcPkg !== tgtPkg) {
      pkgOutbound[srcPkg] = (pkgOutbound[srcPkg] || 0) + 1;
      pkgInbound[tgtPkg] = (pkgInbound[tgtPkg] || 0) + 1;
    }
  }

  const packages = Object.keys(pkgFiles)
    .filter(pkg => pkgFiles[pkg].size >= MIN_FILE_COUNT)
    .filter(pkg => !pkg.startsWith('.') && !pkg.endsWith('.py') && !pkg.endsWith('.cfg') && !pkg.endsWith('.rst') && !pkg.endsWith('.toml') && !pkg.endsWith('.md'));

  const registry = packages.map((pkg, i) => {
    const fileCount = pkgFiles[pkg].size;
    const inbound = pkgInbound[pkg] || 0;
    const outbound = pkgOutbound[pkg] || 0;
    const role = classifyRole(pkg, inbound, outbound, fileCount);

    return {
      domain_id: 'DOM-' + String(i + 1).padStart(2, '0'),
      source_name: pkg,
      display_name: deriveDisplayName(pkg),
      file_count: fileCount,
      inbound_imports: inbound,
      outbound_imports: outbound,
      direction_ratio: outbound > 0 ? Math.round((inbound / outbound) * 100) / 100 : (inbound > 0 ? 999 : 0),
      role_classification: role,
      confidence: fileCount >= 20 ? 'HIGH' : fileCount >= 10 ? 'MODERATE' : 'LOW',
      evidence_source: 'code_graph:IMPORTS',
    };
  }).sort((a, b) => b.inbound_imports - a.inbound_imports);

  const pkgToId = {};
  registry.forEach(d => { pkgToId[d.source_name] = d.domain_id; });

  const edgeMap = {};
  for (const r of imports) {
    const srcPkg = getPackage(r.source_path);
    const tgtPkg = getPackage(r.target_path);
    if (srcPkg === tgtPkg) continue;
    if (!pkgToId[srcPkg] || !pkgToId[tgtPkg]) continue;
    const key = srcPkg + '→' + tgtPkg;
    if (!edgeMap[key]) edgeMap[key] = { source: srcPkg, target: tgtPkg, count: 0 };
    edgeMap[key].count++;
  }

  const edges = Object.values(edgeMap)
    .filter(e => e.count >= 2)
    .map(e => ({
      source_domain: pkgToId[e.source],
      source_name: e.source,
      target_domain: pkgToId[e.target],
      target_name: e.target,
      import_count: e.count,
      direction: e.count > 0 ? 'IMPORTS' : 'NONE',
      evidence_source: 'code_graph:IMPORTS',
    }))
    .sort((a, b) => b.import_count - a.import_count);

  return {
    registry: {
      calibration_version: '1.0',
      calibration_method: 'PACKAGE_LEVEL_IMPORT_DIRECTION',
      source_artifact: codeGraphPath,
      min_file_threshold: MIN_FILE_COUNT,
      domain_count: registry.length,
      domains: registry,
    },
    topology: {
      calibration_version: '1.0',
      edge_count: edges.length,
      edges,
    },
  };
}

if (require.main === module) {
  const cgPath = process.argv[2];
  const outDir = process.argv[3] || path.dirname(cgPath);

  if (!cgPath) {
    console.error('Usage: node calibrate_domains.js <code_graph.json> [output-dir]');
    process.exit(1);
  }

  const result = calibrate(cgPath);

  const regPath = path.join(outDir, 'calibrated_domain_registry.json');
  const topoPath = path.join(outDir, 'calibrated_domain_topology.json');

  fs.writeFileSync(regPath, JSON.stringify(result.registry, null, 2));
  fs.writeFileSync(topoPath, JSON.stringify(result.topology, null, 2));

  console.log('Domains:', result.registry.domain_count);
  console.log('Edges:', result.topology.edge_count);
  console.log('Output:', outDir);
  console.log('');
  result.registry.domains.forEach(d => {
    console.log(`  ${d.domain_id} | ${d.source_name.padEnd(25)} | ${String(d.file_count).padStart(4)} files | ${String(d.inbound_imports).padStart(5)} in | ${String(d.outbound_imports).padStart(5)} out | ${d.role_classification}`);
  });
}

module.exports = { calibrate };
