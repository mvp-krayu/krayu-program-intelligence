# Report Quality Findings
## PI.LENS.REPORT-GENERATOR.CLI-VALIDATION.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## Generation Quality Summary

| Surface | FastAPI | BlueEdge | Quality |
|---------|---------|---------|---------|
| Tier-1 Evidence Brief | GENERATED (484 lines) | GENERATED (514 lines) | STRUCTURALLY CONSISTENT |
| Tier-1 Narrative Brief | GENERATED (289 lines) | GENERATED (265 lines) | STRUCTURALLY CONSISTENT |
| Decision Surface | GENERATED (139 lines) | GENERATED (138 lines) | STRUCTURALLY CONSISTENT |
| Tier-2 Diagnostic | NOT GENERATED | GENERATED | BLOCKED — see phase8b_failure_analysis.md |

---

## FastAPI Report Content Spot Check

### Tier-1 Evidence Brief
- Client identity: `fastapi` (correct — no BlueEdge refs)
- Run ID: `run_02_oss_fastapi_pipeline` (correct)
- Signal data: 4 total signals, 3 active pressure (sourced from vault/signal_registry.json)
- Gauge score: 60 canonical / 100 projected (CONDITIONAL band)
- Domains: 9 (APPLICATION, CI_INFRA, CONFIGURATION, DEPENDENCY, DOCUMENTATION, GENERATED, INFRA, TESTING, TOOLING)
- 41.x data: LEGACY path (signal_projection.json from `41.x/` — not grounded path)
- BlueEdge contamination: **NONE** (0 matches for "BlueEdge", "blueedge", UUID, BlueEdge run IDs)

### Decision Surface
- Structurally similar to BlueEdge version (138 vs 139 lines)
- No graph_state.json available (Tier-2 not generated) — Decision Surface renders gracefully without it

### Publish-Safe Variants
- All Tier-1 and Decision surfaces produce dual variants: `*.html` (internal) + `*_pub.html` (publish-safe)
- Publish-safe variants redact client names to "Client Environment" per generator governance

---

## Cross-Client Structural Consistency

The report generator produces structurally identical HTML for both clients from the same templates:
- Same CSS/JS embedded
- Same section structure
- Different data values (signals, gauge score, domains)
- Line counts within 10% for comparable surfaces

| Surface | FastAPI Lines | BlueEdge Lines | Delta |
|---------|---------------|----------------|-------|
| Tier-1 Evidence Brief | 484 | 514 | +30 BE (more signal detail) |
| Tier-1 Narrative Brief | 289 | 265 | -24 FA (less zone data) |
| Decision Surface | 139 | 138 | -1 (negligible) |

Differences attributable to data volume variation (BlueEdge has more structural zones/signals).

---

## 41.x LEGACY Path Note

Both clients log: `[LEGACY] signal_projection.json → 41.x/signal_projection.json`

This is NOT an error. The generator tries `41.x/grounded/signal_projection.json` first (grounded path),
then falls back to `41.x/signal_projection.json` (legacy path). Both clients use the legacy path
because neither has a `41.x/grounded/` subdirectory. This is informational logging only.

---

## Report Generator Governance Compliance

Per script docstring:
- ✓ No vault files read directly (reads package dir / vault artifacts as configured)
- ✓ No claims invented or altered
- ✓ Zone=ZONE-2 governance enforced (when API path active; offline path uses vault directly)
- ✓ No forbidden identifiers (SIG-, COND-, DIAG-, INTEL-) exposed in report body
- ✓ FastAPI reports contain no BlueEdge UUID, BlueEdge name, or BlueEdge path contamination

---

## Product-Layer Compatibility Debt

The Tier-2 surface requires publishing vault artifacts to `app/gauge-product/public/vault/<client>/`
before CLI generation can succeed. This is a product-layer dependency — not a pipeline generation
requirement. Documented per contract NON-NEGOTIABLE FRAMING.

The FastAPI client was historically published under UUID `e65d2f0a-dfa7-4257-9333-fcbb583f0880`
in the app vault. For Tier-2 to work with the slug-based client alias `fastapi`, either:
1. Publish FastAPI vault to `app/gauge-product/public/vault/fastapi/<run_id>/` (slug-based), OR
2. Change Phase 8b to use `--client <uuid>` for app vault resolution, OR
3. Scope Phase 8b to `--deliverable tier1` to skip Tier-2 until vault is published

Option 3 is the minimal pipeline fix: prevents Phase 8b from failing on an app-layer dependency.
