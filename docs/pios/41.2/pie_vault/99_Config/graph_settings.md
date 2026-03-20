# Graph Settings — PIE Render Configuration

**artifact_id:** PIOS-41.2-GRAPH-SETTINGS
**contract_id:** PIOS-41.2-RUN01-CONTRACT-v1
**manifest_ref:** PIE-MANIFEST-BLUEEDGE-v3.23-RUN03-R01
**mode:** PIE-RENDER-STRICT
**date:** 2026-03-20

---

## PIE Rendering Configuration

### Layout Settings

| Setting | Value | Rule Ref |
|---|---|---|
| Maximum render depth | 3 levels (DOMAIN → CAPABILITY → COMPONENT) | RR-01 |
| Default collapse level | CAPABILITY | RR-02 |
| Expand to component level | On user demand | RR-02 |
| Layout algorithm | Hierarchical top-down | — |
| Node spacing | 80px horizontal, 120px vertical | — |

---

## Node Type Definitions

| Node Type | Shape | Default Color | Border Style | Label |
|---|---|---|---|---|
| DOMAIN | Rectangle (large) | #1E40AF (dark blue) | Solid 2px | domain_name |
| CAPABILITY | Rectangle (medium) | #0369A1 (medium blue) | Solid 1px | capability_name |
| COMPONENT | Rectangle (small) | #0EA5E9 (light blue) | Solid 1px | component_name |
| WEAKLY GROUNDED node | Any | Same as type | Dashed 1px | name + [*] |
| CROSS-CUTTING domain | Rectangle (large) | #7C3AED (purple) | Solid 2px | domain_name |
| INTEGRATION domain | Rectangle (large) | #0891B2 (teal) | Solid 2px | domain_name |
| INFRASTRUCTURE domain | Rectangle (large) | #374151 (dark grey) | Solid 2px | domain_name |

---

## Link Type Definitions

| Link Type | Style | Color | Arrow |
|---|---|---|---|
| DOMAIN → CAPABILITY (parent) | Solid | #6B7280 | None (hierarchy) |
| CAPABILITY → COMPONENT (parent) | Solid | #6B7280 | None (hierarchy) |
| EMITS | Dashed | #10B981 (green) | Forward arrow |
| CALLS | Dashed | #3B82F6 (blue) | Forward arrow |
| BROADCASTS_TO | Dashed | #F59E0B (amber) | Forward arrow |
| PERSISTS_TO | Dashed | #EF4444 (red) | Forward arrow |
| AUTHENTICATES_VIA | Dashed | #8B5CF6 (violet) | Forward arrow |
| DEPENDS_ON | Dashed | #6B7280 (grey) | Forward arrow |
| SERVES | Dashed | #EC4899 (pink) | Forward arrow |
| CONSUMES | Dashed | #14B8A6 (teal) | Forward arrow |
| cross-domain annotation | Dotted | #F97316 (orange) | Bidirectional |

---

## Color and Weight Metadata for Rendering Engines

### Node Weight (for force-directed layout)

| Node Type | Weight |
|---|---|
| DOMAIN | 10 |
| CAPABILITY | 5 |
| COMPONENT | 1 |

### Link Weight (for edge thickness)

| Relationship Count | Line Weight |
|---|---|
| Composite (e.g., R-013: 63 modules) | 3px |
| Standard relationship | 1px |

### Grounding Status Visual Flags

| Status | Visual Indicator |
|---|---|
| GROUNDED | No modifier |
| WEAKLY GROUNDED | Dashed border + asterisk [*] in label |
| DIRECT_EVIDENCE component | Filled circle indicator |
| DERIVED component | Half-filled circle indicator |
| INFERRED component | Empty circle indicator |

---

## Collapse Rules

| Rule | Behaviour |
|---|---|
| RR-02 Default collapse | Explorer loads at CAPABILITY level; COMPONENT level hidden |
| RR-05 Single-component capabilities | Render eligible at COMPONENT level; do not collapse to DOMAIN without user action |
| RR-04 Cross-domain components | Render in primary domain; cross-domain annotation shown as overlay link |
| RR-06 Composite relationships | Display as single labelled aggregated link (e.g., "63 modules → AuthModule") |

---

## Execution Path Overlay Settings (RR-07)

| Execution Path | Color |
|---|---|
| EP-01 Sensor Telemetry Ingest | #10B981 (green) |
| EP-02 HASI Security Pipeline | #EF4444 (red) |
| EP-03 User Authentication | #8B5CF6 (violet) |
| EP-04 Fleet Data REST | #3B82F6 (blue) |
| EP-05 Domain Event Fan-Out | #F59E0B (amber) |
| EP-06 Predictive Maintenance AI | #06B6D4 (cyan) |
| EP-07 OTA Firmware Update | #F97316 (orange) |
| EP-08 Multi-Tenant Onboarding | #EC4899 (pink) |

Path overlay highlights: node fill brightened, traversal sequence numbered on nodes and edges.

---

## Manifest Compliance Declaration

| Check | Status |
|---|---|
| All 17 DOMAIN nodes from manifest rendered | VERIFIED |
| All 42 CAPABILITY nodes from manifest rendered | VERIFIED |
| All 89 COMPONENT nodes from manifest rendered | VERIFIED |
| All 148 nodes render_eligible: true | VERIFIED |
| All 48 links from manifest eligible | VERIFIED |
| WEAKLY GROUNDED nodes flagged (7 nodes) | VERIFIED |
| No nodes outside manifest | VERIFIED |
| No links outside manifest | VERIFIED |
| manifest_ref | PIE-MANIFEST-BLUEEDGE-v3.23-RUN03-R01 |

**manifest_compliance: VERIFIED**

---

## Navigation

- [← Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
- [PIE Index](../../pie_index.md)
