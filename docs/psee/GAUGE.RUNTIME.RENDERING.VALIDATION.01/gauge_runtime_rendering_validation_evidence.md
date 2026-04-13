GAUGE RUNTIME RENDERING VALIDATION — EVIDENCE
Contract ID: GAUGE.RUNTIME.RENDERING.VALIDATION.01
Evidence type: Static analysis of runtime code + adapter execution output
Execution: Post-implementation validation (GAUGE.RUNTIME.LABEL.CONSUMPTION.01 applied)

---

## EVIDENCE METHOD

Live screen capture was not available. Equivalent inspection output was produced by:
1. Direct read of `app/execlens-demo/components/TopologyPanel.js` — rendering logic traced at all label render sites
2. Execution of `app/execlens-demo/lib/gauge/envelope_adapter.py` — actual node records extracted with bound label fields
3. Adapter output field values used as authoritative ground truth for visible rendered strings

This produces exact rendered strings because:
- `EnvelopeTopology` renders only from `data.nodes`, `data.roots`, `data.orphans`, `data.containment_tree`, `data.overlap_edges`
- All topology label text is produced exclusively by `node.display_label` — the governed bound field
- The adapter is deterministic (same envelope → same output)
- Render sites reference `node.display_label` directly without intermediate transformation

---

## EVIDENCE SECTION 1 — NODES

### 1.1 Label render sites in TopologyPanel.js (post-implementation)

```
Line 109 — ComponentFooter primary name:
  <span className="gauge-component-name">{node.display_label}</span>

Line 118 — ComponentFooter overlap cross-ref:
  → {other.display_label}

Line 130 — ComponentFooter expanded detail id (click-gated):
  <span className="gauge-detail-id">{node.secondary_label}</span>

Line 187 — RegionCard region header:
  <span className="gauge-region-name">{rootNode.display_label}</span>

Line 200 — RegionCard surface item title attr (hover, not primary/secondary text):
  title={s.secondary_label}

Line 202 — RegionCard surface item text:
  {s.display_label}

Line 204 — RegionCard surface item expanded state (click-gated):
  <span className="gauge-surface-id"> {s.secondary_label}</span>

Line 270 — StandaloneSection item title attr (hover, not primary/secondary text):
  title={n.secondary_label}

Line 272 — StandaloneSection item text:
  {n.display_label}

Line 274 — StandaloneSection item expanded state (click-gated):
  <span className="gauge-standalone-id"> ({n.secondary_label})</span>

Line 330 — DiagnosticsPanel overlap from label:
  {fromNode ? fromNode.display_label : e.from_node}

Line 332 — DiagnosticsPanel overlap to label:
  {toNode ? toNode.display_label : e.to_node}
```

No `humanize(node.label)` calls remain at any topology node identity label render site.

### 1.2 Remaining humanize() occurrences

```
Line 36 — function definition only (not a call site):
  function humanize(label) { ... }

Line 262 — type group display label fallback:
  {STANDALONE_TYPE_LABELS[type] || humanize(type)}
```

Line 262 applies to the `type` key string (a B-01 canonical type string: `binding_context`, `capability_surface`, `component_entity`), not to structural node identity labels. This is a rendering-layer display label for group headers. Out of scope per PSEE.STRUCTURAL.LABEL.RESOLUTION.01 Section 6.5.

### 1.3 Bound label field values — adapter execution output

Full 45-node set. Format: `node_id | display_label | resolved_label | secondary_label | raw_label`:

```
DOM-01 | Documentation Root | Documentation Root | DOM-01 | documentation_root
DOM-02 | Extraction Analysis | Extraction Analysis | DOM-02 | extraction_analysis
DOM-03 | Backend Isolated | Backend Isolated | DOM-03 | backend_isolated
DOM-04 | Frontend Isolated | Frontend Isolated | DOM-04 | frontend_isolated
DOM-05 | Platform Monorepo | Platform Monorepo | DOM-05 | platform_monorepo
DOM-03-A | Backend Infra | Backend Infra | DOM-03-A | backend_infra
DOM-03-B | Backend Src Common | Backend Src Common | DOM-03-B | backend_src_common
DOM-03-C | Backend Src Config | Backend Src Config | DOM-03-C | backend_src_config
DOM-03-D | Backend Src Database | Backend Src Database | DOM-03-D | backend_src_database
DOM-03-E | Backend Src Events | Backend Src Events | DOM-03-E | backend_src_events
DOM-03-F | Backend Src Gateways | Backend Src Gateways | DOM-03-F | backend_src_gateways
DOM-03-G | Backend Src Health | Backend Src Health | DOM-03-G | backend_src_health
DOM-03-H | Backend Src Migrations | Backend Src Migrations | DOM-03-H | backend_src_migrations
DOM-03-I | Backend Src Modules | Backend Src Modules | DOM-03-I | backend_src_modules
DOM-03-J | Backend Src Test | Backend Src Test | DOM-03-J | backend_src_test
DOM-04-A | Frontend Infra | Frontend Infra | DOM-04-A | frontend_infra
DOM-04-B | Frontend API | Frontend API | DOM-04-B | frontend_api
DOM-04-C | Frontend Components | Frontend Components | DOM-04-C | frontend_components
DOM-04-D | Frontend Pages | Frontend Pages | DOM-04-D | frontend_pages
DOM-04-E | Frontend Contexts | Frontend Contexts | DOM-04-E | frontend_contexts
DOM-04-F | Frontend Hooks | Frontend Hooks | DOM-04-F | frontend_hooks
DOM-04-G | Frontend Router Socket | Frontend Router Socket | DOM-04-G | frontend_router_socket
DOM-04-H | Frontend Utils Types Constants | Frontend Utils Types Constants | DOM-04-H | frontend_utils_types_constants
DOM-04-I | Frontend Pwa | Frontend Pwa | DOM-04-I | frontend_pwa
DOM-04-J | Frontend Styles | Frontend Styles | DOM-04-J | frontend_styles
DOM-04-K | Frontend Test | Frontend Test | DOM-04-K | frontend_test
DOM-04-L | Frontend Storybook | Frontend Storybook | DOM-04-L | frontend_storybook
DOM-04-M | Frontend Src | Frontend Src | DOM-04-M | frontend_src
DOM-05-A | Platform Root | Platform Root | DOM-05-A | platform_root
DOM-05-B | Platform Cicd | Platform Cicd | DOM-05-B | platform_cicd
DOM-05-C | Platform Backend Embedded | Platform Backend Embedded | DOM-05-C | platform_backend_embedded
DOM-05-D | Platform Frontend Embedded | Platform Frontend Embedded | DOM-05-D | platform_frontend_embedded
DOM-05-E | Platform Svg Agents | Platform Svg Agents | DOM-05-E | platform_svg_agents
DOM-05-F | Platform Monitoring | Platform Monitoring | DOM-05-F | platform_monitoring
DOM-05-G | Platform Load Tests | Platform Load Tests | DOM-05-G | platform_load_tests
NODE-001 | CEU 01 | CEU 01 | NODE-001 | CEU-01
NODE-002 | CEU 02 | CEU 02 | NODE-002 | CEU-02
NODE-003 | CEU 03 | CEU 03 | NODE-003 | CEU-03
NODE-004 | CEU 04 | CEU 04 | NODE-004 | CEU-04
NODE-005 | CEU 05 | CEU 05 | NODE-005 | CEU-05
NODE-006 | CEU 06 | CEU 06 | NODE-006 | CEU-06
NODE-007 | CEU 07 | CEU 07 | NODE-007 | CEU-07
NODE-008 | CEU 08 | CEU 08 | NODE-008 | CEU-08
NODE-009 | CEU 09 | CEU 09 | NODE-009 | CEU-09
NODE-010 | CEU 10 | CEU 10 | NODE-010 | CEU-10
```

**Equality check results from adapter execution:**
- `display_label == resolved_label`: 45/45
- `secondary_label == node_id`: 45/45

### 1.4 Notable resolved_label values (governance grammar evidence)

| canonical_id | raw_label | resolved_label | Rule applied | Change from prior humanize output |
|---|---|---|---|---|
| DOM-04-B | `frontend_api` | `Frontend API` | N-3: `api → API` from _ABBREVIATION_REGISTER | humanize produced `Frontend Api` (incorrect); resolution produces `Frontend API` |
| NODE-008 | `CEU-08` | `CEU 08` | T-2 kebab split; N-1 preserves `CEU` (cased form in corpus); hyphen → space | humanize produced `CEU-08` (no underscore, no change); resolution produces `CEU 08` |
| NODE-009 | `CEU-09` | `CEU 09` | Same as NODE-008 | humanize: `CEU-09`; resolution: `CEU 09` |
| NODE-010 | `CEU-10` | `CEU 10` | Same as NODE-008 | humanize: `CEU-10`; resolution: `CEU 10` |

Both differences are correct per PSEE.STRUCTURAL.LABEL.RESOLUTION.01.

---

## EVIDENCE SECTION 2 — CONTAINMENT

### 2.1 Containment render path (unchanged)

```javascript
TopologyPanel.js RegionCard (line 158–173):
  const surfaceIds = treeData.containmentTree[rootId] || []
  const surfaces   = surfaceIds.map(id => treeData.nodeIndex[id]).filter(Boolean)
  ...
  const componentIds = new Set()
  for (const sid of surfaceIds) {
    for (const cid of (treeData.containmentTree[sid] || [])) {
      componentIds.add(cid)
    }
  }
```

Containment traversal logic unchanged. Structural representation intact.

### 2.2 Containment tree data (from adapter execution)

```
DOM-03  → [DOM-03-A, DOM-03-B, DOM-03-C, DOM-03-D, DOM-03-E,
            DOM-03-F, DOM-03-G, DOM-03-H, DOM-03-I, DOM-03-J]   (10 children, depth 1)
DOM-04  → [DOM-04-A, DOM-04-B, DOM-04-C, DOM-04-D, DOM-04-E,
            DOM-04-F, DOM-04-G, DOM-04-H, DOM-04-I, DOM-04-J,
            DOM-04-K, DOM-04-L, DOM-04-M]                         (13 children, depth 1)
DOM-05  → [DOM-05-A, DOM-05-B, DOM-05-C, DOM-05-D, DOM-05-E,
            DOM-05-F, DOM-05-G]                                    (7 children, depth 1)
DOM-03-A → [NODE-008]                                             (1 child, depth 2)
```

### 2.3 Verified containment render instances

**Instance CT-1: DOM-03 (depth 0) → DOM-03-A (depth 1)**
- RegionCard renders for rootId = `DOM-03`
- `surfaceIds = containmentTree['DOM-03'] = ['DOM-03-A', ..., 'DOM-03-J']`
- `DOM-03-A` rendered at surface list item text: `s.display_label` = `Backend Infra`
- `s.secondary_label` = `DOM-03-A` (canonical_id, click-gated)

**Instance CT-2: DOM-03-A (depth 1) → NODE-008 (depth 2)**
- Inner loop: `containmentTree['DOM-03-A'] = ['NODE-008']`
- `NODE-008` added to `componentIds` → rendered as ComponentFooter
- `node.display_label` = `CEU 08` (primary label)
- `node.secondary_label` = `NODE-008` (click-gated detail)

**Instance CT-3: DOM-04 (depth 0) → DOM-04-B (depth 1)**
- RegionCard renders for rootId = `DOM-04`
- `DOM-04-B` rendered at surface list item text: `s.display_label` = `Frontend API`
- `s.secondary_label` = `DOM-04-B` (canonical_id, click-gated)

Nesting depths covered: 0 → 1 → 2 (three levels in CT-1 + CT-2 chain)

---

## EVIDENCE SECTION 3 — OVERLAPS

### 3.1 Overlap render locations

**Location A: ComponentFooter inline cross-reference (always visible when overlap endpoint)**

```javascript
TopologyPanel.js lines 91–121:
  const overlapsWith = overlapEdges
    .filter(e => e.from_node === node.node_id || e.to_node === node.node_id)
    .map(e => {
      const otherId = e.from_node === node.node_id ? e.to_node : e.from_node
      return nodeIndex[otherId]
    })
    .filter(Boolean)
  ...
  {overlapsWith.map(other => (
    <span key={other.node_id} className="gauge-overlap-ref">
      → {other.display_label}
    </span>
  ))}
```

**Location B: DiagnosticsPanel overlap section (collapsible, default collapsed)**

```javascript
TopologyPanel.js lines 322–335:
  {overlapEdges.map(e => {
    const fromNode = nodeIndex[e.from_node]
    const toNode   = nodeIndex[e.to_node]
    return (
      <div key={e.edge_id} className="gauge-diag-overlap">
        <span>{fromNode ? fromNode.display_label : e.from_node}</span>
        <span className="gauge-diag-arrow">⟷</span>
        <span>{toNode ? toNode.display_label : e.to_node}</span>
        ...
      </div>
    )
  })}
```

### 3.2 Overlap edge data (from adapter execution)

```
REL-001: edge_type=OVERLAP_STRUCTURAL, from_node=NODE-008, to_node=NODE-010, temporal_classification=STATIC
REL-002: edge_type=OVERLAP_STRUCTURAL, from_node=NODE-009, to_node=NODE-010, temporal_classification=STATIC
```

### 3.3 Rendered overlap instances

**OV-1: ComponentFooter inline ref — NODE-008 view (always visible)**
- `overlapsWith` for NODE-008: REL-001 → `otherId = NODE-010`
- `other.display_label` = `CEU 10`
- Rendered: `→ CEU 10`
- Traceable: overlap_edges[] REL-001, NODE-010.display_label = NODE-010.resolved_label = `CEU 10`

**OV-2: ComponentFooter inline ref — NODE-009 view (always visible)**
- `overlapsWith` for NODE-009: REL-002 → `otherId = NODE-010`
- `other.display_label` = `CEU 10`
- Rendered: `→ CEU 10`
- Traceable: overlap_edges[] REL-002, NODE-010.display_label = `CEU 10`

**OV-3: ComponentFooter inline refs — NODE-010 view (always visible; 2 refs)**
- `overlapsWith` for NODE-010: REL-001 (other = NODE-008), REL-002 (other = NODE-009)
- Rendered: `→ CEU 08`, `→ CEU 09`
- Traceable: NODE-008.display_label = `CEU 08`, NODE-009.display_label = `CEU 09`

**OV-4: DiagnosticsPanel REL-001 (visible when expanded)**
- `fromNode = NODE-008`, `toNode = NODE-010`
- `fromNode.display_label` = `CEU 08`, `toNode.display_label` = `CEU 10`
- Rendered: `CEU 08 ⟷ CEU 10`
- Traceable: overlap_edges[] REL-001, display_label values from adapter

**OV-5: DiagnosticsPanel REL-002 (visible when expanded)**
- `fromNode = NODE-009`, `toNode = NODE-010`
- `fromNode.display_label` = `CEU 09`, `toNode.display_label` = `CEU 10`
- Rendered: `CEU 09 ⟷ CEU 10`
- Traceable: overlap_edges[] REL-002, display_label values from adapter

All five overlap render instances consume `node.display_label` directly. No fallback naming at any overlap site. No transformation.

### 3.4 Fallback path in DiagnosticsPanel (when node absent from index)

```javascript
{fromNode ? fromNode.display_label : e.from_node}
```

If `fromNode` is absent from `nodeIndex` (node lookup fails), raw `e.from_node` (canonical_id) is rendered. This is a structural safety fallback — not fallback naming. In the validated state, `fromNode` and `toNode` are both present for REL-001 and REL-002 (both endpoints exist in nodes[]). Fallback path not triggered.
