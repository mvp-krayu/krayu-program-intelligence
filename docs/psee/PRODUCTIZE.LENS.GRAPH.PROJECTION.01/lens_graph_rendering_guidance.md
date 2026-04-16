# LENS Graph Rendering Guidance
# PRODUCTIZE.LENS.GRAPH.PROJECTION.01

- Version: 1.0
- Stream: PRODUCTIZE.LENS.GRAPH.PROJECTION.01
- Date: 2026-04-16
- Authority: PRODUCTIZE.LENS.GRAPH.PROJECTION.01

---

## SECTION 1 — DESIGN INTENT

The graph in LENS must communicate three things simultaneously:
1. **We understand this system** — the client recognises their own domains reflected accurately
2. **Our assessment is grounded** — the graph is not decorative; it is derived from evidence
3. **There is more to see** — the client understands that what is shown is a curated view, not an exhaustive map

The graph must feel:
- **Premium** — not a developer tool, not a debug view, not a force-directed mess
- **Curated** — every visible element was placed intentionally
- **Authoritative** — the style communicates governance, not interactivity
- **Legible** — a non-technical executive can orient themselves immediately

The graph must NOT feel like:
- A raw Obsidian graph (node web, unstructured, organic)
- A network diagram from an infrastructure tool
- A dependency map for engineers
- A force-directed simulation

---

## SECTION 2 — OBSIDIAN-INSPIRED BUT NOT RAW OBSIDIAN

The visual aesthetic is informed by Obsidian's dark-mode graph view — dark background, glowing nodes, subtle edges — but executed at a significantly higher abstraction level.

| Obsidian graph | LENS graph |
|----------------|------------|
| All nodes visible | Curated domain-level nodes only |
| Force-directed organic layout | Structured, intentional layout |
| Wikilink edges (all connections) | Governed edge vocabulary (5 classes) |
| Node IDs in labels | Business domain names |
| Dense (hundreds of nodes) | Sparse (≤ 17 nodes in full-map mode) |
| Interactive (zoom/pan by default) | Optional interaction; static is acceptable |
| Reveals vault structure | Reveals only what is safe to show |

The shared aesthetic elements:
- Dark background (`#0b0f14` or similar)
- Glowing node rings (color from evidence status)
- Subtle edge lines (low opacity, not dominant)
- Monospace or geometric font for labels
- Minimal chrome — no decorative border frames around the graph itself

---

## SECTION 3 — RECOMMENDED RENDERING MODES

### MODE 1: Clustered Capability Map (Full-Platform View)

**When to use:** Default LENS view; communicates platform breadth.
**What it shows:** 17 domains grouped into 4–5 thematic clusters.
**Node count:** 17 domain nodes + 4–5 cluster labels
**Edge count:** Cluster-to-cluster edges only (≤ 8); intra-cluster edges suppressed or shown as bundle

**Cluster groupings (suggested — must be grounded, not invented):**

| cluster | domains | basis |
|---------|---------|-------|
| Operational Intelligence | Edge Data Acquisition, Analytics and Intelligence, AI/ML Intelligence Layer, Sensor and Security Ingestion | Signal-bearing domains |
| Platform Infrastructure | Platform Infrastructure and Data, Telemetry Transport and Messaging, Event-Driven Architecture, Real-Time Streaming and Gateway | Infrastructure backbone |
| Fleet Operations | Fleet Core Operations, Fleet Vertical Extensions, Extended Operations and Driver Services | Core fleet product |
| Platform Services | Access Control and Identity, SaaS Platform Layer, External Integration, Frontend Application | Cross-cutting services |
| Emerging Capabilities | EV and Electrification, Operational Engineering | Growth/operational domains |

**Visual hierarchy:**
- Cluster labels: large, low opacity, background text
- Domain nodes: medium circles, colored by evidence status
- Cluster boundary: subtle enclosure (rounded rectangle, low opacity border) — not a hard box
- Edges between clusters: thin lines, no arrowheads unless directional meaning is essential

**Evidence status coloring:**
- VERIFIED domains: `#3fb950` (green glow)
- CONDITIONAL domains: `#d29922` (amber glow)
- PARTIAL domains: `#e07a30` (orange glow)
- PENDING / UNKNOWN: `#8b949e` (grey, no glow)

**"More depth available" treatment:**
- Small indicator below graph: "17 domains shown. Capability and component detail available in governed access."
- No interactive drill-down in Mode 1 unless explicitly implemented in a future stream.

---

### MODE 2: Focus-Domain Mini-Network

**When to use:** Focus domain panel (FocusDomainPanel.js); communicates signal-domain relationships.
**What it shows:** 1 focus area + 2–4 related domains + selected capability nodes (if safe)
**Node count:** ≤ 8
**Edge count:** ≤ 10

**Layout:** Hub-and-spoke. Focus area node at center. Related domain nodes at fixed radial positions. No force-directed layout.

**Visual emphasis on focus node:**
- Larger circle than peer nodes
- Brighter glow ring (outer pulse or glow layer)
- Label rendered in white (not grey)

**Capability nodes (if shown):**
- Smaller than domain nodes
- Positioned as satellite to their parent domain
- Label in lighter grey
- Connected to parent by `part_of` edge (thinner, lower opacity)

**Evidence status coloring:** Same as Mode 1.

**Edge rendering:**
- `supports` edges: directed arrow, mid-opacity, evidence-status color of source node
- `informs` edges: directed arrow, lower opacity, lighter grey
- `part_of` edges: no arrowhead, dashed, lowest opacity

---

### MODE 3: Curated Connected-System View

**When to use:** ConnectedSystemView.js (existing) — the system intelligence overview graph.
**What it shows:** 5 assessment domains (CLM-25 hub + 4 satellites) — this is the current implementation.
**Scope:** Assessment intelligence view, not topology view. Does not attempt to show all 17 domains.
**Node count:** 5 (fixed)
**Edge count:** 6–8 (hub spokes + 2 peripheral cross-edges)

This mode is already implemented. It is correct for its purpose. It does NOT attempt to represent the full platform topology — it represents the LENS evidence assessment model.

**Distinction from Mode 1/2:**
- Mode 1/2 represent the CLIENT SYSTEM topology (domain map)
- Mode 3 represents the ASSESSMENT INTELLIGENCE structure (claim domains)
- These are different views and must not be conflated in the UI

---

## SECTION 4 — VISUAL HIERARCHY

**Priority order (what draws the eye first):**
1. Focus node (if in focus mode) — brightest, largest, most prominent glow
2. Status-colored domain nodes — evidence status communicated through color
3. Domain names — readable, monospace, white or near-white
4. Edge lines — visible but subordinate; must not dominate
5. Cluster labels — largest but lowest opacity; background framing
6. Legend — visible but peripheral
7. "More depth available" indicator — bottom of panel, subtle

---

## SECTION 5 — NODE EMPHASIS AND CLUSTER TREATMENT

### Focus node treatment
- Ring glow: colored by evidence status, outer radius 10px beyond node circle, opacity 0.35–0.5
- Label: font-weight 600, white (`#e6edf3`)
- Size: 1.5× the standard domain node radius

### Non-focus domain node treatment
- Ring glow: same color but narrower (6px), opacity 0.2
- Label: font-weight 400, light grey (`#c9d1d9`)
- Size: standard radius (28–36px in SVG coordinate space for a 560-wide viewBox)

### Pending/unknown domain node treatment
- Ring glow: none or very subtle grey
- Label: grey (`#8b949e`)
- Node fill: dark neutral (`#111318`)

### Cluster enclosure
- Rounded rectangle, 12px border radius
- Border: 1px solid, cluster's dominant evidence-status color at 25% opacity
- Fill: matching dark tint at 5% opacity
- No label box — cluster label is ambient text placed above the cluster

---

## SECTION 6 — SAFE LEGEND

The legend is always present and always readable. It does not explain internal concepts — it explains only the evidence status vocabulary.

**Required legend entries:**
- Verified — green (`#3fb950`)
- In Progress — amber (`#d29922`)
- Partial — orange (`#e07a30`)
- Pending Assessment — grey (`#8b949e`)

**Optional legend entry (when focus mode active):**
- Focus Domain — blue (`#58a6ff`)

**Legend placement:** Below the graph, left-aligned. Horizontal row. Small dots + labels. No borders or panel framing.

**Legend language must not use:**
- VERIFIED, CONDITIONAL, PARTIAL, BLOCKED (internal vocabulary)
- Evidence class codes
- Zone or depth references

---

## SECTION 7 — COMMUNICATING "MORE DEPTH AVAILABLE"

This is a critical UX pattern. The graph is deliberately curated — a client must understand that what they see is a governed selection, not everything.

### In full-map mode (Mode 1):
> "17 functional domains shown. Governed access provides capability-level detail, operational trace, and assessed cross-connections."

### In focus mode (Mode 2):
> "Focus domain view. Full capability structure and evidence basis available in governed detail access."

### Visual treatment:
- Bottom of graph panel, separated by a horizontal line
- Font size: 11px, color: `#8b949e`
- Optional: a faint "→" or "+" indicator near dense cluster areas suggesting expandability
- Must NOT use a disabled/greyed button — this communicates unavailability, not "available at higher access level"

---

## SECTION 8 — IMPLEMENTATION LIBRARY NOTE

**No library is mandated.** The current ConnectedSystemView.js implementation uses pure SVG — this is acceptable for Modes 2 and 3.

For Mode 1 (Clustered Capability Map with 17 domain nodes), pure SVG is feasible with a pre-computed static layout. Force-directed layout is explicitly discouraged — it produces non-deterministic, uncontrolled results that may violate density governance.

If a library is used in a future implementation stream, it must:
- Allow fixed/pre-computed node positions (no automatic force layout)
- Support edge strength suppression
- Not expose internal graph data in DOM attributes or console output
- Be bundleable without adding a large dependency footprint

**Authority: PRODUCTIZE.LENS.GRAPH.PROJECTION.01**
