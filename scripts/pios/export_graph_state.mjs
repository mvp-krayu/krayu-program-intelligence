/**
 * scripts/pios/export_graph_state.mjs
 * TIER2.NARRATIVE.GRAPH.INTEGRATION.01 — workspace runtime position export
 *
 * Builds the overview graph topology in the same node/link insertion order as
 * VaultGraph.js buildGraph(isOverview=true), runs d3-force-3d with the exact
 * workspace simulation parameters, and persists the settled x/y positions to
 * clients/<client>/reports/tier2/graph_state.json.
 *
 * This script is the sole authoritative source of x/y for the report graph.
 * No Python layout math. No custom force reimplementation.
 *
 * Usage:
 *   node scripts/pios/export_graph_state.mjs
 *   node scripts/pios/export_graph_state.mjs --client <id> --run-id <run_id>
 *   node scripts/pios/export_graph_state.mjs --client <id> --run-id <run_id> --output <path>
 */

import { createRequire } from "module";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");

// Import d3-force-3d from the workspace node_modules (exact same library as VaultGraph.js)
const D3_SRC = join(REPO_ROOT, "app", "gauge-product", "node_modules", "d3-force-3d", "src", "index.js");
const { forceSimulation, forceManyBody, forceLink } = await import(D3_SRC);

// ---------------------------------------------------------------------------
// CLI args — defaults preserve BlueEdge backward-compatible invocation
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
let _client                 = "blueedge";
let _runId                  = "run_01_authoritative_generated";
let _outputOverride         = null;
let _vaultIndexPathOverride = null;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--client"           && argv[i + 1]) _client                 = argv[i + 1];
  if (argv[i] === "--run-id"           && argv[i + 1]) _runId                  = argv[i + 1];
  if (argv[i] === "--output"           && argv[i + 1]) _outputOverride         = argv[i + 1];
  if (argv[i] === "--vault-index-path" && argv[i + 1]) _vaultIndexPathOverride = argv[i + 1];
}

const VAULT_INDEX_PATH = _vaultIndexPathOverride
  ? resolve(_vaultIndexPathOverride)
  : join(REPO_ROOT, "app", "gauge-product", "public", "vault", _client, _runId, "vault_index.json");

const OUTPUT_PATH = _outputOverride
  ? resolve(_outputOverride)
  : join(REPO_ROOT, "clients", _client, "reports", "tier2", "graph_state.json");

// ---------------------------------------------------------------------------
// Node/link appearance — mirrors VaultGraph.js BRIGHT + LINK constants
// ---------------------------------------------------------------------------
const NODE_R   = { ZONE: 9, SIGNAL: 6, CLAIM: 5, ARTIFACT: 5 };
const NODE_COL = { ZONE: "#f0f0f0", SIGNAL: "#52d97e", CLAIM: "#e8b54a", ARTIFACT: "#6ab4e8" };
const LINK_COL = { ZONE_SIGNAL: "#3cac64", SIGNAL_CLAIM: "#4b82d2", ZONE_ARTIFACT: "#b29237" };
const LINK_W   = { ZONE_SIGNAL: 2.0, SIGNAL_CLAIM: 2.2, ZONE_ARTIFACT: 2.0 };

// Workspace simulation parameters (matches VaultGraph.js forceGraph config)
const CHARGE_STR  = -100;
const LINK_DIST   =  60;
const ALPHA_DECAY =  0.015;
const VEL_DECAY   =  0.4;

// Canvas dimensions for centroid offset
const CANVAS_WIDTH  = 880;
const CANVAS_HEIGHT = 380;

// ---------------------------------------------------------------------------
// Load vault index
// ---------------------------------------------------------------------------
if (!existsSync(VAULT_INDEX_PATH)) {
  console.error("[export_graph_state] ERROR: vault_index.json not found:", VAULT_INDEX_PATH);
  process.exit(1);
}
const vaultIndex = JSON.parse(readFileSync(VAULT_INDEX_PATH, "utf8"));

// ---------------------------------------------------------------------------
// Build topology in JSON insertion order — mirrors buildGraph(isOverview=true)
// VaultGraph.js order: hub → per-signal: signal, mapped-claim → per-artifact: artifact
// ---------------------------------------------------------------------------
const HUB_ID = "ZONE-01";

const nodeOrder  = [];    // [{id, type}, ...]
const nodeIndex  = {};    // id → position in nodeOrder
const rawLinks   = [];    // [{sourceId, targetId, type}, ...]

function registerNode(id, type) {
  if (!(id in nodeIndex)) {
    nodeIndex[id] = nodeOrder.length;
    nodeOrder.push({ id, type });
  }
}

function registerLink(srcId, tgtId, ltype) {
  rawLinks.push({ sourceId: srcId, targetId: tgtId, type: ltype });
}

registerNode(HUB_ID, "ZONE");

for (const [sigId, clmId] of Object.entries(vaultIndex.signals || {})) {
  registerNode(sigId, "SIGNAL");
  registerLink(HUB_ID, sigId, "ZONE_SIGNAL");
  if (clmId) {
    registerNode(clmId, "CLAIM");
    registerLink(sigId, clmId, "SIGNAL_CLAIM");
  }
}

for (const artId of Object.keys(vaultIndex.artifacts || {})) {
  registerNode(artId, "ARTIFACT");
  registerLink(HUB_ID, artId, "ZONE_ARTIFACT");
}

// ---------------------------------------------------------------------------
// d3-force-3d simulation — exact workspace parameters, 2D projection
// Default golden-angle init at initialRadius=10 (d3-force-3d default, matches workspace)
// ---------------------------------------------------------------------------
const simNodes = nodeOrder.map((n, i) => ({ id: n.id, index: i }));
const simLinks = rawLinks.map(l => ({
  source: nodeIndex[l.sourceId],
  target: nodeIndex[l.targetId],
}));

const simulation = forceSimulation(simNodes, 2)
  .alphaDecay(ALPHA_DECAY)
  .velocityDecay(VEL_DECAY)
  .force("charge", forceManyBody().strength(CHARGE_STR))
  .force("link",   forceLink(simLinks).distance(LINK_DIST))
  .stop();

// Tick until convergence (same as workspace browser tick loop)
const alphaMin = simulation.alphaMin();
let ticks = 0;
while (simulation.alpha() >= alphaMin) {
  simulation.tick();
  ticks++;
}

// ---------------------------------------------------------------------------
// Offset positions so centroid sits at canvas center
// ---------------------------------------------------------------------------
const cx = CANVAS_WIDTH  / 2;
const cy = CANVAS_HEIGHT / 2;

const meanX = simNodes.reduce((s, n) => s + n.x, 0) / simNodes.length;
const meanY = simNodes.reduce((s, n) => s + n.y, 0) / simNodes.length;
const offX  = cx - meanX;
const offY  = cy - meanY;

// ---------------------------------------------------------------------------
// Assemble graph_state output
// ---------------------------------------------------------------------------
const nodesOut = nodeOrder.map((n, i) => ({
  id:    n.id,
  type:  n.type,
  x:     Math.round((simNodes[i].x + offX) * 100) / 100,
  y:     Math.round((simNodes[i].y + offY) * 100) / 100,
  r:     NODE_R[n.type]   ?? 5,
  color: NODE_COL[n.type] ?? "#909090",
  label: n.id,
}));

const linksOut = rawLinks.map(l => ({
  source: l.sourceId,
  target: l.targetId,
  color:  LINK_COL[l.type] ?? "#404048",
  width:  LINK_W[l.type]   ?? 1.5,
}));

const graphState = {
  run_id:         vaultIndex.run_id,
  graph_mode:     "overview",
  generated_from: "workspace_runtime_positions",
  canvas_width:   CANVAS_WIDTH,
  canvas_height:  CANVAS_HEIGHT,
  nodes:          nodesOut,
  links:          linksOut,
};

// ---------------------------------------------------------------------------
// Persist
// ---------------------------------------------------------------------------
mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify(graphState, null, 2), "utf8");

console.log(
  `[export_graph_state] wrote ${nodesOut.length} nodes, ` +
  `${linksOut.length} links (${ticks} ticks) → ${OUTPUT_PATH}`
);
