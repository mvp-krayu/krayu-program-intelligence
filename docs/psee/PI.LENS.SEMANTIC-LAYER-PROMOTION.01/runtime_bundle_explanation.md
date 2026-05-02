# Runtime Bundle Explanation
## PI.LENS.SEMANTIC-LAYER-PROMOTION.01

**Generated:** 2026-05-02

---

## What the Semantic Bundle Is

The semantic bundle at `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/` is the first-class runtime semantic context package for the BlueEdge canonical report run.

Prior to this contract, the semantic layer existed only as scattered process artifacts across evidence streams from different contracts, with no single governed location. This bundle makes the semantic layer explicit, locatable, and consumable.

---

## Relationship to Vault Package

| Component | Path | Role |
|-----------|------|------|
| Vault | clients/blueedge/psee/runs/run_blueedge_productized_01/vault/ | Structural evidence: canonical_topology.json (13 groups), gauge_state.json, signal_registry.json, binding_envelope.json |
| Semantic bundle | clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/ | Semantic overlay: crosswalk, topology model (MISSING), lineage annotations, graph state, validation context |

The vault package provides structural evidence. The semantic bundle provides the semantic interpretation layer that translates structural DOM identifiers (DOM-04) to business display labels ("Platform Infrastructure and Data") and enriches count cards with semantic topology data.

They are separate inputs. The report renderer requires BOTH to produce canonical output.

---

## Relationship to Report Renderer

The renderer (`scripts/pios/lens_report_generator.py`) consumes the semantic bundle via two CLI flags:

```
--crosswalk-path   → bundle/crosswalk/semantic_continuity_crosswalk.json  (SEM-001)
--semantic-topology-dir → bundle/topology/                                  (SEM-004, SEM-005 — MISSING)
```

Internal wiring:
- `_load_semantic_crosswalk()` reads SEM-001 → `_SEMANTIC_CROSSWALK` global
- `_load_semantic_topology()` reads SEM-004 + SEM-005 → `_SEMANTIC_TOPOLOGY_MODEL` + `_SEMANTIC_TOPOLOGY_LAYOUT` globals
- `_resolve_domain_display_label()` uses crosswalk as fallback when topology model absent
- `_build_semantic_report_context()` uses topology model for count cards

With this bundle, the canonical invocation becomes:

```bash
python3 scripts/pios/lens_report_generator.py \
  --client blueedge \
  --package-dir clients/blueedge/psee/runs/run_blueedge_productized_01/vault \
  --crosswalk-path clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/crosswalk/semantic_continuity_crosswalk.json \
  --semantic-topology-dir clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/semantic/topology \
  --output-root <lens_root>/runs/<run_id>
```

Note: `--semantic-topology-dir` will not activate until SEM-004 and SEM-005 are present.

---

## Relationship to Canonical Reports

The canonical reports at `clients/blueedge/psee/runs/run_blueedge_productized_01_fixed/reports/` were produced with the semantic layer active. The semantic bundle contains the inputs that made those reports canonical:

- SEM-001 (crosswalk) → zone labels "Platform Infrastructure and Data" in tier1 narrative, tier2, decision
- SEM-004 (topology model, MISSING) → "17 Semantic Domains / 5 Backed" count cards in tier1 evidence
- SEM-007 (graph_state) → structural graph visualization in tier2 section 01C
- SEM-008 through SEM-013 → validation records proving canonical content alignment

---

## Relationship to LENS Runtime

The semantic bundle is a static, pre-computed context package. LENS serves canonical reports via the FastAPI layer; the semantic bundle is an input to the report generation step, not to LENS serving itself.

When LENS needs to regenerate a client's reports with semantic labels, it should pass:
- `--crosswalk-path` pointing to `semantic/crosswalk/semantic_continuity_crosswalk.json`
- `--semantic-topology-dir` pointing to `semantic/topology/` (once SEM-004 and SEM-005 are present)

The bundle is co-located with the canonical reports under `run_blueedge_productized_01_fixed/` so that the semantic context and the reports it produced are governed together.

---

## Bundle Completeness

| Category | Status |
|----------|--------|
| Crosswalk | PRESENT (SEM-001) |
| Semantic topology model | MISSING (SEM-004) |
| Semantic topology layout | MISSING (SEM-005) |
| Canonical topology (41.1 full hierarchy) | PRESENT (SEM-006) |
| Canonical topology with lineage | PRESENT (SEM-002) |
| Graph state | PRESENT (SEM-007) |
| Tier1 validation | PRESENT (SEM-008) |
| Tier2 generation + validation | PRESENT (SEM-009, SEM-010) |
| Decision generation + validation | PRESENT (SEM-011, SEM-012, SEM-013) |
| Reproducibility proof | PRESENT (SEM-014) |
| Semantic validation rules | PRESENT (SEM-015, SEM-016) |

**14 of 16 artifacts present. 2 blocking artifacts missing.**
