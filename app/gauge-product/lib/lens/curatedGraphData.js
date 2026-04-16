/**
 * lib/lens/curatedGraphData.js
 * PRODUCTIZE.LENS.GRAPH.RENDER.01
 *
 * Curated client-safe graph projection data.
 *
 * GOVERNANCE:
 * - Domain names are the 17 canonical names from the safe admitted set.
 *   Source: canonical_topology.json (run_authoritative_recomputed_01).
 * - Node IDs are opaque client-safe identifiers (gn-NN) — NOT DOMAIN-XX.
 * - Status is derived from grounding: GROUNDED → "verified", WEAKLY GROUNDED → "conditional".
 * - Edge relations are from the governed vocabulary only (Section C of safe_node_edge_vocabulary.md).
 * - Component names are NOT present.
 * - Internal IDs (DOMAIN-XX, CAP-XX, COMP-XX) are NOT present anywhere.
 * - This is a curated projection. It is NOT a raw extraction from canonical_topology.json.
 * - Edge count: 12 (well within ≤25 inter-cluster limit per graph_leakage_prevention.md §4).
 *
 * Authority: PRODUCTIZE.LENS.GRAPH.PROJECTION.01
 */

// ---------------------------------------------------------------------------
// SVG LAYOUT CONSTANTS
// ViewBox: "0 0 860 475"
// ---------------------------------------------------------------------------

export const SVG_VIEWBOX = '0 0 860 475'

// ---------------------------------------------------------------------------
// CLUSTER DEFINITIONS
// Each cluster is a bounded thematic group. Names are business-grade.
// ---------------------------------------------------------------------------

export const CLUSTERS = [
  {
    id:      'c-ops-intel',
    label:   'Operational Intelligence',
    kind:    'domain_group',
    summary: 'Data acquisition, analytics, AI/ML, and security ingestion',
    // SVG rect
    x: 8,   y: 8,   w: 283, h: 205, rx: 9,
    accent: '#3fb950',   // green — these are signal-bearing verified domains
  },
  {
    id:      'c-fleet-ops',
    label:   'Fleet Operations',
    kind:    'domain_group',
    summary: 'Core fleet management, vertical extensions, and driver services',
    x: 322, y: 8,   w: 245, h: 205, rx: 9,
    accent: '#58a6ff',   // blue — core product
  },
  {
    id:      'c-emerging',
    label:   'Emerging Capabilities',
    kind:    'domain_group',
    summary: 'EV electrification and operational engineering',
    x: 602, y: 62,  w: 190, h: 125, rx: 9,
    accent: '#79c0ff',   // light blue — growth capabilities
  },
  {
    id:      'c-platform-infra',
    label:   'Platform Infrastructure',
    kind:    'domain_group',
    summary: 'Core infrastructure, messaging, streaming, and data layer',
    x: 8,   y: 248, w: 283, h: 215, rx: 9,
    accent: '#d29922',   // amber — includes weakly grounded domain
  },
  {
    id:      'c-platform-svc',
    label:   'Platform Services',
    kind:    'domain_group',
    summary: 'Access control, SaaS layer, integrations, and frontend',
    x: 322, y: 248, w: 295, h: 215, rx: 9,
    accent: '#a5d6ff',   // light cyan — supporting cross-cutting services
  },
]

// ---------------------------------------------------------------------------
// NODE DEFINITIONS
// Ordered by cluster for render grouping.
// svgLines: short 2-line label for SVG node circle display.
// fullName: full canonical domain name (for tooltip / title attribute).
// status: "verified" | "conditional" (derived from grounding).
// focus: true for the one emphasized focus domain.
// ---------------------------------------------------------------------------

export const NODES = [
  // ── Cluster: Operational Intelligence ─────────────────────────────────────
  {
    id:       'gn-01',
    fullName: 'Edge Data Acquisition',
    svgLines: ['Edge Data', 'Acquisition'],
    cluster:  'c-ops-intel',
    status:   'verified',
    focus:    true,      // Primary focus domain — SIG-001 grounded
    cx: 88,  cy: 72,  r: 30,
  },
  {
    id:       'gn-02',
    fullName: 'Sensor and Security Ingestion',
    svgLines: ['Sensor &', 'Security'],
    cluster:  'c-ops-intel',
    status:   'verified',
    focus:    false,
    cx: 218, cy: 72,  r: 22,
  },
  {
    id:       'gn-03',
    fullName: 'Analytics and Intelligence',
    svgLines: ['Analytics &', 'Intelligence'],
    cluster:  'c-ops-intel',
    status:   'verified',
    focus:    false,
    cx: 88,  cy: 170, r: 22,
  },
  {
    id:       'gn-04',
    fullName: 'AI/ML Intelligence Layer',
    svgLines: ['AI/ML', 'Intelligence'],
    cluster:  'c-ops-intel',
    status:   'verified',
    focus:    false,
    cx: 218, cy: 170, r: 22,
  },

  // ── Cluster: Fleet Operations ──────────────────────────────────────────────
  {
    id:       'gn-05',
    fullName: 'Fleet Core Operations',
    svgLines: ['Fleet Core', 'Operations'],
    cluster:  'c-fleet-ops',
    status:   'verified',
    focus:    false,
    cx: 404, cy: 78,  r: 26,
  },
  {
    id:       'gn-06',
    fullName: 'Fleet Vertical Extensions',
    svgLines: ['Fleet Vertical', 'Extensions'],
    cluster:  'c-fleet-ops',
    status:   'verified',
    focus:    false,
    cx: 508, cy: 98,  r: 20,
  },
  {
    id:       'gn-07',
    fullName: 'Extended Operations and Driver Services',
    svgLines: ['Extended', 'Operations'],
    cluster:  'c-fleet-ops',
    status:   'verified',
    focus:    false,
    cx: 435, cy: 172, r: 20,
  },

  // ── Cluster: Emerging Capabilities ────────────────────────────────────────
  {
    id:       'gn-08',
    fullName: 'EV and Electrification',
    svgLines: ['EV &', 'Electrification'],
    cluster:  'c-emerging',
    status:   'verified',
    focus:    false,
    cx: 648, cy: 105, r: 20,
  },
  {
    id:       'gn-09',
    fullName: 'Operational Engineering',
    svgLines: ['Operational', 'Engineering'],
    cluster:  'c-emerging',
    status:   'verified',
    focus:    false,
    cx: 755, cy: 122, r: 20,
  },

  // ── Cluster: Platform Infrastructure ──────────────────────────────────────
  {
    id:       'gn-10',
    fullName: 'Platform Infrastructure and Data',
    svgLines: ['Platform', 'Infrastructure'],
    cluster:  'c-platform-infra',
    status:   'conditional',   // WEAKLY GROUNDED → 7 unknown runtime dimensions (SIG-002)
    focus:    false,
    cx: 88,  cy: 322, r: 26,
  },
  {
    id:       'gn-11',
    fullName: 'Telemetry Transport and Messaging',
    svgLines: ['Telemetry', 'Transport'],
    cluster:  'c-platform-infra',
    status:   'conditional',   // WEAKLY GROUNDED
    focus:    false,
    cx: 218, cy: 322, r: 20,
  },
  {
    id:       'gn-12',
    fullName: 'Event-Driven Architecture',
    svgLines: ['Event-Driven', 'Architecture'],
    cluster:  'c-platform-infra',
    status:   'verified',
    focus:    false,
    cx: 88,  cy: 418, r: 20,
  },
  {
    id:       'gn-13',
    fullName: 'Real-Time Streaming and Gateway',
    svgLines: ['Real-Time', 'Streaming'],
    cluster:  'c-platform-infra',
    status:   'verified',
    focus:    false,
    cx: 218, cy: 418, r: 20,
  },

  // ── Cluster: Platform Services ─────────────────────────────────────────────
  {
    id:       'gn-14',
    fullName: 'Access Control and Identity',
    svgLines: ['Access Control', '& Identity'],
    cluster:  'c-platform-svc',
    status:   'verified',
    focus:    false,
    cx: 398, cy: 322, r: 22,
  },
  {
    id:       'gn-15',
    fullName: 'SaaS Platform Layer',
    svgLines: ['SaaS', 'Platform'],
    cluster:  'c-platform-svc',
    status:   'verified',
    focus:    false,
    cx: 540, cy: 322, r: 20,
  },
  {
    id:       'gn-16',
    fullName: 'External Integration',
    svgLines: ['External', 'Integration'],
    cluster:  'c-platform-svc',
    status:   'verified',
    focus:    false,
    cx: 398, cy: 418, r: 20,
  },
  {
    id:       'gn-17',
    fullName: 'Frontend Application',
    svgLines: ['Frontend', 'Application'],
    cluster:  'c-platform-svc',
    status:   'verified',
    focus:    false,
    cx: 540, cy: 418, r: 20,
  },
]

// ---------------------------------------------------------------------------
// EDGE DEFINITIONS
// 12 curated inter-cluster edges. All within ≤25 limit.
// source / target reference gn-XX node IDs.
// No intra-cluster edges (suppressed per Mode 1 rendering guidance).
// visible_reason is bounded (≤120 chars) with no internal IDs.
// ---------------------------------------------------------------------------

export const EDGES = [
  // C1 → C2
  {
    source: 'gn-01', target: 'gn-05',
    relation: 'informs',
    visible_reason: 'Primary edge data feeds fleet operational intelligence',
  },
  {
    source: 'gn-03', target: 'gn-05',
    relation: 'informs',
    visible_reason: 'Analytics layer informs fleet core decision context',
  },
  // C1 → C3
  {
    source: 'gn-01', target: 'gn-10',
    relation: 'supports',
    visible_reason: 'Acquired edge data sustains the infrastructure data layer',
  },
  {
    source: 'gn-02', target: 'gn-10',
    relation: 'supports',
    visible_reason: 'Security ingestion supports infrastructure data integrity',
  },
  // C2 → C4
  {
    source: 'gn-05', target: 'gn-14',
    relation: 'depends_on',
    visible_reason: 'Fleet operations depend on access control for service authorisation',
  },
  // C2 → C5
  {
    source: 'gn-05', target: 'gn-09',
    relation: 'depends_on',
    visible_reason: 'Fleet core operations inform engineering and maintenance functions',
  },
  {
    source: 'gn-06', target: 'gn-08',
    relation: 'connects_to',
    visible_reason: 'Fleet vertical extensions connect to EV electrification capabilities',
  },
  // C3 → C1
  {
    source: 'gn-11', target: 'gn-03',
    relation: 'supports',
    visible_reason: 'Telemetry transport delivers data for analytics processing',
  },
  // C3 → C2
  {
    source: 'gn-10', target: 'gn-05',
    relation: 'supports',
    visible_reason: 'Infrastructure and data layer underpins fleet operations',
  },
  // C3 → C4
  {
    source: 'gn-10', target: 'gn-15',
    relation: 'supports',
    visible_reason: 'Platform infrastructure supports SaaS layer service delivery',
  },
  // C3 → C5
  {
    source: 'gn-10', target: 'gn-09',
    relation: 'supports',
    visible_reason: 'Infrastructure layer supports operational engineering workflows',
  },
  // C4 → C2
  {
    source: 'gn-14', target: 'gn-05',
    relation: 'supports',
    visible_reason: 'Identity and access control enforces fleet operational boundaries',
  },
]

// ---------------------------------------------------------------------------
// EDGE RELATION VISUAL STYLE
// Maps relation class → stroke color and dash pattern.
// ---------------------------------------------------------------------------

export const EDGE_STYLE = {
  informs:     { stroke: '#58a6ff', opacity: 0.40, dash: null },
  supports:    { stroke: '#3fb950', opacity: 0.35, dash: null },
  depends_on:  { stroke: '#d29922', opacity: 0.35, dash: '5,4' },
  connects_to: { stroke: '#8b949e', opacity: 0.30, dash: '3,3' },
  part_of:     { stroke: '#8b949e', opacity: 0.25, dash: '2,4' },
}

// ---------------------------------------------------------------------------
// NODE STATUS VISUAL STYLE
// Maps status → fill, stroke, glow colors.
// ---------------------------------------------------------------------------

export const NODE_STYLE = {
  verified: {
    fill:   '#0d2e1a',
    stroke: '#3fb950',
    glow:   'rgba(63,185,80,0.22)',
    label:  '#c9d1d9',
  },
  conditional: {
    fill:   '#1a1600',
    stroke: '#d29922',
    glow:   'rgba(210,153,34,0.22)',
    label:  '#c9d1d9',
  },
  focus: {
    fill:   '#0d2e1a',
    stroke: '#3fb950',
    glow:   'rgba(63,185,80,0.35)',
    label:  '#e6edf3',
  },
}

// ---------------------------------------------------------------------------
// LEGEND ENTRIES
// ---------------------------------------------------------------------------

export const LEGEND = [
  { key: 'verified',    label: 'Verified',          color: '#3fb950' },
  { key: 'conditional', label: 'In Progress',        color: '#d29922' },
  { key: 'focus',       label: 'Focus Domain',       color: '#58a6ff' },
]

// ---------------------------------------------------------------------------
// SYSTEM INTELLIGENCE OVERVIEW — 6 curated domain cards
// Grounded in canonical_topology.json domain attributes and signal grounding.
// ---------------------------------------------------------------------------

export const OVERVIEW_DOMAINS = [
  {
    id:          'gn-01',
    name:        'Edge Data Acquisition',
    type:        'Operational Domain',
    status:      'verified',
    description: 'Primary collection surface for sensor, telemetry, and operational data from fleet edge nodes. The source of the security intelligence pathway.',
    metric:      { label: 'Structural Pathway', value: 'Verified' },
  },
  {
    id:          'gn-05',
    name:        'Fleet Core Operations',
    type:        'Operational Domain',
    status:      'verified',
    description: 'Core fleet management functions including entity tracking, route management, event processing, and service delivery orchestration.',
    metric:      { label: 'Assessment Status', value: 'Grounded' },
  },
  {
    id:          'gn-10',
    name:        'Platform Infrastructure and Data',
    type:        'Infrastructure Domain',
    status:      'conditional',
    description: 'Foundational data and infrastructure layer. Seven operational dimensions within this domain require runtime assessment to determine live state.',
    metric:      { label: 'Runtime Dimensions', value: '7 Pending' },
  },
  {
    id:          'gn-03',
    name:        'Analytics and Intelligence',
    type:        'Operational Domain',
    status:      'verified',
    description: 'Analytics pipeline transforming operational and telemetry data into platform intelligence, performance insights, and reporting outputs.',
    metric:      { label: 'Assessment Status', value: 'Grounded' },
  },
  {
    id:          'gn-04',
    name:        'AI/ML Intelligence Layer',
    type:        'Operational Domain',
    status:      'verified',
    description: 'Machine learning and AI capabilities supporting predictive analytics, intelligent scoring, and automated decision support across the platform.',
    metric:      { label: 'Assessment Status', value: 'Grounded' },
  },
  {
    id:          'gn-14',
    name:        'Access Control and Identity',
    type:        'Cross-Cutting Domain',
    status:      'verified',
    description: 'Cross-cutting identity and access management securing all platform access points and service authorisation boundaries across fleet operations.',
    metric:      { label: 'Coverage', value: 'Cross-Cutting' },
  },
]

// ---------------------------------------------------------------------------
// FOCUS DOMAIN DATA
// Grounded in: domain DOMAIN-01 (Edge Data Acquisition), SIG-001 (CLM-20),
// and structural assessment evidence from run_authoritative_recomputed_01.
// ---------------------------------------------------------------------------

export const FOCUS_DOMAIN = {
  name:        'Edge Data Acquisition',
  type:        'Operational Domain — FUNCTIONAL',
  tagline:     'The primary source of operational intelligence. Structurally verified. Live throughput confirmation is the remaining validation step.',
  rows: [
    {
      key:   'DOMAIN ROLE',
      value: 'Primary collection surface for sensor, telemetry, and edge data from fleet nodes. Everything that flows into the intelligence layer begins here.',
    },
    {
      key:   'WHAT IS VERIFIED',
      value: 'Structural pathway to the security intelligence layer is confirmed. Four capability surfaces and their architectural boundaries have been assessed.',
    },
    {
      key:   'WHAT REQUIRES VALIDATION',
      value: 'Live throughput performance of the sensor bridge pathway requires runtime confirmation. The structural ceiling is defined; operational measurement completes the picture.',
    },
    {
      key:   'ASSESSMENT STATUS',
      value: 'Structurally grounded. Contributes to the readiness score as a verified domain.',
    },
  ],
  connections: [
    { name: 'Platform Infrastructure and Data', note: 'Edge data sustains the infrastructure data layer' },
    { name: 'Sensor and Security Ingestion',    note: 'Co-domain in the security intelligence pathway' },
    { name: 'Analytics and Intelligence',        note: 'Analytics pipeline consumes edge acquisition output' },
    { name: 'Fleet Core Operations',             note: 'Edge intelligence informs fleet operational context' },
  ],
}
