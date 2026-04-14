# Executable Gap Register
# COMPUTABLE.CHAIN.TO.GAUGE.01 — Deliverable 3

## Identity

- Contract: COMPUTABLE.CHAIN.TO.GAUGE.01
- Date: 2026-04-14
- Mode: GAP IDENTIFICATION ONLY — NO REMEDIATION IN THIS STREAM

---

## Gap Register

| Gap ID | Stage | Missing Piece | Why Missing | Impact | Required To Close |
|--------|-------|--------------|-------------|--------|-------------------|
| GAP-01 | S4 | Computable `gauge_state.json` emission | No script exists that computes gauge_state.json from PSEE execution state (DIM-01..06 → score → confidence → projection → emission). Current gauge_state.json is a manually authored static artifact copied from run_01_authoritative. | GAUGE score, completion points, and confidence band are read-only references to a static artifact. They cannot be freshly computed from a new intake run. | Implement a `build_gauge_state.py` script that accepts PSEE execution state, computes DIM-01..DIM-06, applies the score model (PSEE-GAUGE.0/gauge_score_model.md), and emits gauge_state.json. |
| GAP-02 | S2 / S5 | Live runtime telemetry for 40.4 dimensions | BlueEdge backend is not running in static analysis context. Prometheus, Redis, Kafka, and live API surfaces are unavailable. 40.4 telemetry dimensions that require live scrape (TMP-004, INF-003, etc.) cannot be populated. | Approximately 60-70% of 40.5 signals are BLOCKED due to absent runtime telemetry. This cascades to block 40.6 conditions and 40.7 diagnoses. PiOS continuation (S5) cannot complete. | Live runtime access to BlueEdge Fleet Management Platform v3.23.0 or a governed synthetic telemetry bundle that covers all blocked DIM references. |
| GAP-03 | S3-41.4 | Formal semantic input bundle contract between 40.5 and 41.4 | 41.4 `signal_registry.json` is currently authored from structural analysis evidence, not from computed 40.5 signal values. No formal contract defines how 40.5 signal outputs flow into 41.4 signal registry construction. | 41.4 signal registry represents structural-evidence signals only. Runtime-computed signals from 40.5 cannot be incorporated into the registry without a defined contract. | Define and implement a contract governing how computed 40.5 signal values (once available from live telemetry) are incorporated into the 41.4 registry format. |
| GAP-04 | S2a | Deterministic grouping engine for PSEE stage S-06 | PSEE.1 state S-06 (Grouping) requires a semantic grouping computation. The `scripts/psee/run_end_to_end.py` stage 03 (structure) uses `emit_structure_manifest.py`, but whether semantic grouping is fully automated for all intake patterns is unverified for a new client (non-BlueEdge) run. | Non-BlueEdge intake runs may fail at PSEE stage S-06 without confirmed grouping automation. | Validate `emit_structure_manifest.py` grouping behavior against a new intake. Document the grouping policy and confirm it covers all required S-06 scenarios. |
| GAP-05 | S2a | Reproducibility contract for PSEE pipeline on a fresh BlueEdge run | `run_end_to_end.py` copies `gauge_state.json` and other artifacts from the demo `run_01_authoritative` package as reference. A fresh run for a new client UUID would not have this reference package. | The PSEE pipeline as currently wired assumes the existence of `clients/blueedge/psee/runs/run_01_authoritative/package/` as a pre-flight reference. A genuinely fresh run cannot replicate this without the static reference being present first. | Define a bootstrap protocol that allows a fresh client run to establish its own authoritative package without depending on an existing reference package. |
| GAP-06 | S3-41.4 | Executable script that produces fresh `signal_registry.json` from 40.5 outputs | `scripts/pios/41.4/build_signals.py` exists but its output is the same static registry currently committed to `docs/pios/41.4/`. It is not wired to consume fresh 40.5 signal computation outputs. | Signal registry is effectively frozen even though the script exists. A new intake would produce the same registry. | Wire `build_signals.py` to accept 40.5 computed signal outputs as input and produce a registry that reflects the actual computed state. |
| GAP-07 | S6 | Executable signal-to-structure binding (43.x) | `docs/pios/43.1/signal_to_structure_binding.md` defines the 43.x layer as "DEFINITION — ARCHITECTURAL / GOVERNANCE ONLY". No `bind_signals_to_structure.py` or equivalent script exists. | Signal-annotated topology (required for LENS) cannot be produced. S6 is blocked at the first step. | Implement `scripts/pios/43.x/bind_signals_to_structure.py` per the 43.1 architectural definition. |
| GAP-08 | S6 | Executable overlay projection (44.x) | `docs/pios/44.x/` contains definitions only. No `build_overlay_projection.py` or equivalent script exists. | LENS overlay rendering cannot be produced. S6 is blocked at the second step. | Implement projection execution scripts per the 44.x definitions. |
| GAP-09 | S4 | GAUGE completeness component (DIM-execution) not computable | DIM-execution (completion 0/40 pts) requires a terminal PSEE execution state (S-13 or S-T1/S-T2/S-T3). No execution has been run against this intake. | GAUGE cannot score completion. Confidence band is permanently anchored at [60–100] until execution runs. | Run PiOS execution layer against the BlueEdge intake to terminal state; emit execution state artifact consumed by `build_gauge_state.py` (see GAP-01). |
| GAP-10 | S1 | IG reproducibility for a new source revision | The current RHP (`docs/pios/IG.RUNTIME/run_01/`) was produced from `run_07_source_profiled_ingestion` with 30 admitted artifacts. A new source revision of BlueEdge or a different client would require a fresh IG run. Whether the full IG.5-IG.7 pipeline runs end-to-end for an arbitrary new source without manual intervention is not verified. | New intakes cannot assume the run_01 RHP is valid. | End-to-end IG pipeline test against a new source path. |
| GAP-11 | S3-41.2/41.3 | Reproducibility verification of 41.2-41.3 scripts | `build_pie_vault.py` and `build_link_normalization.py` exist but their exact inputs (whether they run cleanly from current S2 artifacts) have not been verified by a fresh execution in this session. | PIE vault and link normalization may produce stale or inconsistent outputs if upstream S2 artifacts change. | Fresh execution of `scripts/pios/41.2/build_pie_vault.py` and `scripts/pios/41.3/build_link_normalization.py` against current S2 artifacts; validate outputs against committed docs/pios/41.2/ and 41.3/. |

---

## Gap Impact Summary

| scope | gaps | aggregate impact |
|-------|------|-----------------|
| GAUGE reproducibility | GAP-01, GAP-05 | GAUGE cannot be freshly computed from a new intake — current baseline is static authoritative |
| PiOS S5 continuation | GAP-02, GAP-03, GAP-06, GAP-09 | Full signal intelligence is blocked pending live runtime telemetry |
| LENS / S6 | GAP-07, GAP-08 | LENS cannot be produced — binding and projection have no executable scripts |
| Pipeline robustness | GAP-04, GAP-10, GAP-11 | End-to-end chain untested for non-authoritative runs |

---

## Minimum Gap Set Required to Reach Fully Reproducible GAUGE

To make GAUGE fully computable from a fresh intake (not relying on static authoritative artifacts):

1. **GAP-01** — implement `build_gauge_state.py`
2. **GAP-05** — define fresh-run bootstrap protocol
3. **GAP-10** — verify IG pipeline end-to-end for fresh source

All other gaps (GAP-02 through GAP-09, GAP-11) are required for full S5/S6 intelligence, not for GAUGE.

## Minimum Gap Set Required to Reach LENS

All gaps listed above are required.
