# GAUGE.STANDALONE.STRUCTURAL.METRICS.DERIVATION.01 — Validation

## Validation Identity

- Contract: GAUGE.STANDALONE.STRUCTURAL.METRICS.DERIVATION.01
- Mode: POST-COMPLETION DERIVATION VALIDATION
- Date: 2026-04-13
- Verdict: COMPLETE — PASS

---

## Validation Table

| Check | ID    | Description                                                                               | Result |
|-------|-------|-------------------------------------------------------------------------------------------|--------|
| V1    | GSD   | Domains value renders as non-empty derived count (not `—`)                               | PASS   |
| V2    | GSD   | Components value renders as non-empty derived count (not `—`)                            | PASS   |
| V3    | GSD   | Surfaces value renders as non-empty derived count (not `—`)                              | PASS   |
| V4    | GSD   | Derived counts sourced from `topoData.nodes[]` filtered by `node.type`                  | PASS   |
| V5    | GSD   | Values are not hardcoded — computed at runtime from live `topoData`                      | PASS   |
| V6    | GSD   | `/api/gauge` not modified — not used as structural-count source                          | PASS   |
| V7    | GSD   | `/api/topology` not modified                                                              | PASS   |
| V8    | GSD   | Unknown space logic unchanged — sourced from `cf.unknown_space_count`                    | PASS   |
| V9    | GSD   | ExecLens untouched                                                                        | PASS   |
| V10   | GSD   | Build/runtime sanity intact — no new imports, no new hooks, no new API calls             | PASS   |

---

## Derivation Trace

### Domains
```
topoData.nodes.filter(n => n.type === 'binding_context').length
```
Source: `/api/topology` → `buildRenderModel` → `annotatedNodes` (preserves original `type` field)

### Surfaces
```
topoData.nodes.filter(n => n.type === 'capability_surface').length
```
Source: same

### Components
```
topoData.nodes.filter(n => n.type === 'component_entity').length
```
Source: same

### Unknown Space (unchanged)
```
cf.unknown_space_count ?? 0
```
Source: `/api/topology` → `constraint_flags.unknown_space_count` (unchanged)

---

## Fail-Closed Verification

| Condition                        | Domains | Surfaces | Components | Correct? |
|----------------------------------|---------|----------|------------|----------|
| `topoData` = null (API error)    | `'—'`   | `'—'`    | `'—'`      | YES      |
| `topoData` present, nodes exist  | derived count | derived count | derived count | YES |
| `topoData` present, nodes = []   | `0`     | `0`      | `0`        | YES      |

---

## Failure Codes NOT Triggered

| Code   | Description                      |
|--------|----------------------------------|
| GSD-01 | Domains still renders as `—`     |
| GSD-02 | Components still renders as `—`  |
| GSD-03 | Surfaces still renders as `—`    |
| GSD-04 | Counts do not match topology data |
| GSD-05 | Values are hardcoded             |
| GSD-06 | `/api/topology` modified         |
| GSD-07 | Unknown-space logic altered      |
| GSD-08 | Unauthorized file modification   |

---

## Collateral Fix

`StructuralMetrics` component also referenced the non-existent `summary.overlap_structural_edges_count`.
Fixed to `summary.overlap_edges_count` — same topology source, correct key name.
This fix is within authorized scope (same file, same data source).

---

## Final Verdict

**COMPLETE — PASS**

All 10 validation checks PASS. No failure codes triggered.
Domains, Surfaces, Components derived at runtime from `nodes[]` type filtering.
No upstream data, API, or ontology changes. Fail-closed behavior preserved.
