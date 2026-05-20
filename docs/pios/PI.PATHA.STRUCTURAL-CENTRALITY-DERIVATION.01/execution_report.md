# Execution Report — PI.PATHA.STRUCTURAL-CENTRALITY-DERIVATION.01

## Stream Identity

- **Stream ID:** PI.PATHA.STRUCTURAL-CENTRALITY-DERIVATION.01
- **Classification:** G1 — Architecture-Mutating
- **Branch:** feature/PI.PATHA.STRUCTURAL-CENTRALITY-DERIVATION.01
- **Contract:** PI.PATHA.STRUCTURAL-CENTRALITY-DERIVATION.01

## Pre-Flight

1. Contract loaded: docs/governance/runtime/git_structure_contract.md — YES
2. Current repository: krayu-program-intelligence (k-pi-core) — YES
3. Current branch: feature/PI.PATHA.STRUCTURAL-CENTRALITY-DERIVATION.01 — YES
4. Allowed scope: scripts/pios/ (L1 Ingestion), docs/pios/ (stream closure) — YES
5. Boundary violation planned: NO

### Architecture Memory Preflight

- Canonical state loaded: YES (PIOS_CURRENT_CANONICAL_STATE.md, 2026-05-20)
- Terminology loaded: YES (TERMINOLOGY_LOCK.md, 2026-05-20)
- Branch authorized: YES (feature branch from main)
- Concept-specific pages loaded: N/A

**Preflight result: PASS**

## Problem Statement

The pipeline produces 40.3s code-graph artifacts with 95 resolved IMPORTS edges for Flask, but raw in-degree is ephemeral (printed to console, not persisted) and lacks structural role context. "Most imported" is not automatically "most architecturally important" — `__init__.py` files inflate centrality through re-export, TYPE_CHECKING imports inflate in-degree, and circular dependencies mask bidirectional coupling.

## Mission

Derive structural centrality signals from 40.3s code-graph relationships and define a normalized centrality artifact (40.3c) with structural role classification that can later support evidence-ranked projection — without wiring centrality into any downstream consumer.

## Constraints

- No downstream authority
- No DOM weighting from 40.3c
- No pressure scoring from 40.3c
- No SQO promotion influence
- No semantic compiler consumption
- No CSR construction influence
- No S-state logic influence
- Projection readiness: NOT_EVALUATED (requires separate validation stream)

## Execution Summary

### Script Created: structural_centrality.py

Standalone centrality derivation script reading 40.3s → producing 40.3c:

- **Centrality metrics:** in_degree, out_degree, in_degree_normalized, out_degree_normalized, structural_throughput_proxy (heuristic, NOT graph betweenness)
- **Normalization:** degree / (N-1) — standard graph-theoretic degree centrality, project-size independent
- **Structural role classification:** 7-role first-match-wins taxonomy with adaptive threshold
- **False-positive detection:** 5 risk categories with per-file flagging
- **CREATE_ONLY protection:** aborts if output exists
- **--dry-run / --report-only modes**

### Structural Role Taxonomy

| Role | Rule |
|---|---|
| ENTRYPOINT | `__main__.py` or main indicator, zero inbound |
| RE_EXPORT_HUB | `__init__.py`, high out-degree, zero definitions |
| RUNTIME_SPINE | in_degree >= threshold_high, defines classes |
| UTILITY_HUB | in_degree >= threshold_high, functions or passive data provider |
| INTERFACE_BOUNDARY | defines symbols, rarely imported internally |
| ISOLATED_LEAF | zero in-degree, zero out-degree |
| VALIDATION_SUPPORT | fallback — moderate connectivity |

Threshold: `max(3, ceil(file_count * 0.20))`

### Flask Centrality Results

| Metric | Value |
|---|---|
| Files | 24 |
| Import edges | 95 |
| Graph density | 0.1721 |
| Role threshold | 5 |

**Top 5 by centrality:**

| Rank | File | In | Out | TP | Role |
|---|---|---|---|---|---|
| 1 | globals.py | 12 | 4 | 0.600 | RUNTIME_SPINE |
| 2 | wrappers.py | 9 | 4 | 0.450 | RUNTIME_SPINE |
| 3 | helpers.py | 9 | 3 | 0.338 | RUNTIME_SPINE |
| 4 | __init__.py | 8 | 10 | 1.000 | RE_EXPORT_HUB |
| 5 | sansio/app.py | 7 | 10 | 0.875 | RUNTIME_SPINE |

**Role distribution:**

| Role | Count |
|---|---|
| RUNTIME_SPINE | 7 |
| VALIDATION_SUPPORT | 11 |
| INTERFACE_BOUNDARY | 3 |
| RE_EXPORT_HUB | 1 |
| UTILITY_HUB | 1 |
| ENTRYPOINT | 1 |

### False-Positive Risks Detected

1. **FP-01 init_re_export_inflation:** `__init__.py` (in=8, 0 definitions) — correctly classified as RE_EXPORT_HUB
2. **FP-03 conditional_import_overcounting:** Known ast limitation (TYPE_CHECKING guards)
3. **FP-05 circular_dependency_masking:** 17 bidirectional import pairs detected

### Pipeline Integration: Phase 3.7

Added `phase_03_7_structural_centrality()` to `run_client_pipeline.py`:
- Script existence check → idempotent skip → 40.3s dependency check → subprocess execution → graceful degradation
- Phase list entry between Phase 3.6 and Phase 3b

### Phase Ordering

```
Phase 1    — Source Boundary
Phase 2    — Intake Verification
Phase 3    — 40.x Structural Verification
Phase 3.5  — Structural Relevance Classification (40.2r/40.3r)
Phase 3.6  — Code-Graph Structural Enrichment (40.3s)
Phase 3.7  — Structural Centrality Derivation (40.3c)     ← NEW
Phase 3b   — Semantic Derivation (optional)
Phase 4    — CEU Grounding Verification
Phase 5    — Build Binding Envelope
Phase 5b   — CSR Semantic Topology
Phase 6+7  — 75.x Activation + 41.x Projection
Phase 8a   — Vault Construction
Phase 8b   — Vault Readiness
Phase 9    — Selector Update
```

### Verification Results

| Check | Result |
|---|---|
| Flask 40.3c produced | PASS — 24 files ranked, 6 roles populated |
| Validation 6/6 PASS | PASS |
| CREATE_ONLY protection | PASS — exits code 1 on re-run |
| No downstream consumer changes | PASS |
| Pipeline Phase 3.7 ordering | PASS — between 3.6 and 3b |
| Next.js build clean | PASS |

## No-Authority Governance Statement

The 40.3c structural centrality artifact provides EVIDENCE-ONLY centrality metrics and structural role classifications derived from 40.3s code-graph relationships. It does NOT influence, modify, or feed into:
- DOM layer generation (dom_layer_generator.py)
- Pressure zone computation
- SQO promotion or qualification state
- Semantic derivation compiler
- Client Semantic Registry (CSR)
- S-state lifecycle logic
- CEU grounding
- Any 75.x activation or 41.x projection scripts
- Any cockpit or LENS rendering components

Projection readiness: NOT_EVALUATED. Evidence-ranked projection requires a separate validation stream.

## Reference

- Prerequisite streams: PI.PATHA.CODE-GRAPH-FEASIBILITY-AND-ARTIFACT-CONTRACT.01 (COMPLETE), PI.PATHA.CODE-GRAPH-PIPELINE-INTEGRATION.01 (COMPLETE)
- Modified files: `scripts/pios/run_client_pipeline.py`
- Created files: `scripts/pios/structural_centrality.py`
