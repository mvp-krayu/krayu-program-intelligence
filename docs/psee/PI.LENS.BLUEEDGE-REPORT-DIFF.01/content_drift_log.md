# Content Drift Log
## PI.LENS.BLUEEDGE-REPORT-DIFF.01

**Generated:** 2026-05-01

---

## TIER1_NARRATIVE — Content Drift

### Absent in Generated

The PZ-001 focus block is present in canonical but absent/minimal in generated:
```html
<!-- CANONICAL — present -->
<div class="focus-block">
  <div class="focus-block-label">PZ-001 — Platform Infrastructure and Data</div>
  <div class="focus-block-name" ...>DOM backing: DOM-04 / backend_app_root</div>
  <div class="focus-block-name">Multiple structural pressures acting together ...</div>
  <div class="focus-block-sub">PSIG-001 · PSIG-002 · PSIG-004</div>
  ...PZ-001 is a Primary pressure anchor for 3 co-present conditions...
</div>

<!-- GENERATED — focus-block count reduced from 10 to 4, PZ-001 block absent -->
```

### Changed Text

```
CANONICAL: "Propagation is localized within a single structural domain (DOM-04)."
GENERATED: "Propagation is localized within a single structural domain ()."
```

DOM-04 anchor is empty in generated — binding_envelope/pressure_zone_projection does not carry DOM anchor.

---

## TIER1_EVIDENCE — Content Drift

### Count Card Schema Change

```
CANONICAL count cards:         GENERATED count cards:
17  Semantic Domains            13  Domains
 5  Structurally Backed          0  Capabilities
12  Semantic-Only               35  Components
                                35  Total Nodes
```

The canonical presents a semantic domain layer schema (17 semantic domains, 5 backed).
The generated presents a structural component schema (13 groups, 35 nodes).

### Topology Diagram

Canonical includes a detailed SVG topology diagram with:
- Domain group rectangles (5 groups with color-coded boundaries)
- Inter-domain edge lines with directional arrows
- Domain labels (OPERATIONAL INTELLIGENCE, FLEET OPERATIONS, EMERGING CAPABILITIES, etc.)

Generated has different topology structure (not SVG with domain groups in same arrangement).

### Domain Coverage Note

```
CANONICAL:
"5 of 17 semantic domains have current structural backing. 
12 remain semantic-only and are shown as projection-layer coverage."

GENERATED: [line absent]
```

---

## TIER2_DIAGNOSTIC — Content Drift

### Coverage Text

```
CANONICAL:
"13 of 13 structural evidence groups are fully grounded. 
5 of 17 semantic domains have structural backing — 12 remain semantic-only.
Runtime-dependent dimensions cannot be resolved from static evidence alone."

GENERATED:
"13 of 13 structural evidence groups are fully grounded.
Runtime-dependent dimensions cannot be resolved from static evidence alone."
```

Semantic domain sentence absent in generated.

### Diagnostic Zone Counts

```
CANONICAL: "1 of 1 diagnostic zone(s) have bound signal coverage (3 active signals)"
GENERATED: "0 of 0 diagnostic zone(s) have bound signal coverage (0 active signals)"
```

### Cell Value Table

| Cell | Canonical | Generated |
|------|-----------|-----------|
| Pressure count | 1 | 0 |
| Semantic Domains Backed / Domains Grounded | 5 / 17 | 13 / 13 |
| Zone coverage | 1 / 1 | 0 / 0 |

### Section 01A Absent

Canonical has section `01A — Semantic Domain Topology` with legend and domain grid.
Generated: section absent.

Canonical file size 71,008 bytes vs generated 33,579 bytes — ~37KB of content absent in generated.

---

## DECISION_SURFACE — Content Drift

### Hero Rationale

```
CANONICAL:
"Structural evidence layer complete — 5/17 semantic domains backed. 
Execution evidence is incomplete."

GENERATED:
"13 of 13 structural evidence groups are grounded. 
Structural grounding complete within evidence scope. 
Execution evidence is incomplete."
```

### Status Badge

```
CANONICAL: "STRUCTURE: STABLE"
GENERATED: "STRUCTURE: STABLE within structural evidence scope"
```

### Truth Text

```
CANONICAL:
"Structural evidence is complete for the current evidence layer. 
Semantic domain coverage: 5/17 domains have structural backing. 
12 semantic domains remain projection-only.
The active pressure pattern is centered on Platform Infrastructure and Data, 
backed by backend_app_root (DOM-04).
A single structural pressure pattern appears across the system."

GENERATED:
"13 of 13 structural evidence groups are grounded. 
Structural grounding complete within evidence scope.
Active structural signals: PSIG-001 · PSIG-002 · PSIG-004.
Baseline signal: PSIG-006 — theoretical baseline condition, not an activated pressure signal."
```

### Gap Items

```
CANONICAL: "2 structural signals not activated"
GENERATED: "Not-activated signals: PSIG-003 · PSIG-005"
```

Note: functionally equivalent (PSIG-003 and PSIG-005 are the 2 not-activated signals) but text format differs.

---

## Root Cause Assessment

All content drift is consistent with a single root cause:

The `binding_envelope.json` at `run_be_orchestrated_fixup_01/binding/binding_envelope.json` and/or the `pressure_zone_projection.json` at `run_be_orchestrated_fixup_01/41.x/pressure_zone_projection.json` contain a **different schema** than what was used to generate the canonical reports.

Canonical data schema: semantic domain layer (17 semantic domains, 5 backed, PZ-001 pressure zone, DOM-04 anchor)
Generated data schema: structural group schema (13 groups, no pressure zones, no semantic domain backing layer)

No code changes are required. The correct data source must be identified.
