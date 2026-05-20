# S1 Readiness Assessment — PI.NETBOX.CANONICAL-ONBOARDING-AND-DEMO-FOUNDATION.01

## Current State: S0 STRUCTURAL ONLY

NetBox has completed structural onboarding through PATH A substrate (Phases 1–3.7). The system is at S0 with structural artifacts produced but no semantic qualification data.

## What Is Confirmed (S0 Complete)

| Artifact | Status | Count/Detail |
|----------|--------|--------------|
| Source intake | COMPLETE | 2,169 files inventoried |
| Structural nodes (40.2) | COMPLETE | 2,540 nodes |
| Topology edges (40.3) | COMPLETE | 2,516 CONTAINS, 0 regex IMPORTS |
| Canonical clusters (40.4) | COMPLETE | 24 clusters |
| SRC classification (40.2r) | COMPLETE | 1,848 PRIMARY / 138 SUPPORT / 554 PERIPHERAL |
| Code-graph (40.3s) | COMPLETE | 1,155 files, 3,614 IMPORTS, 16,046 total relationships |
| Structural centrality (40.3c) | COMPLETE | 1,089 files ranked, 6/6 validation PASS |
| Client registration | COMPLETE | client.yaml + source_manifest.json |
| Manifest registration | COMPLETE | LENS manifest + REGISTRY entry |

## What Is Missing for S1

| Requirement | Status | Dependency |
|-------------|--------|------------|
| Semantic topology model | MISSING | Phase 3b (semantic derivation compiler) |
| DPSIG signal set | MISSING | Signal registry generation |
| SQO qualification state | MISSING | CEU grounding → SQO qualification engines |
| CEU grounding | MISSING | `ceu_model: static` with `ceu_count: 0` — no CEU definitions |
| DOM layer | MISSING | Depends on CEU grounding |
| Decision validation | MISSING | Depends on semantic topology |
| Reproducibility verdict | MISSING | Depends on full pipeline completion |
| Semantic continuity crosswalk | MISSING | Depends on semantic derivation |
| Promotion state | MISSING | Depends on SQO qualification |
| Report pack | MISSING | Depends on semantic derivation |

## Gap Analysis

### Gap 1: CEU Model

NetBox has `ceu_model: static` with `ceu_count: 0`. For S1 qualification, CEU definitions must be created. Options:

1. **Manual CEU definition** — domain expert defines CEUs for NetBox's 11 Django apps
2. **Dynamic CEU derivation** — automated CEU discovery from structural artifacts (PATH B generalization gap)
3. **Structural CEU projection** — derive CEUs from 40.3c centrality roles (not yet implemented)

### Gap 2: Semantic Derivation

Phase 3b (semantic derivation compiler) requires AI-assisted analysis of structural artifacts. This stream does NOT activate compiler authority — semantic derivation is a separate stream.

### Gap 3: LENS Manifest Completeness

Current LENS manifest is missing `semantic_topology_model` and `dpsig_signal_set` — both required by the manifest schema. LENS v2 rendering requires these artifacts. SQO cockpit can render without them (shows diagnostic view).

### Gap 4: SQO Artifact Path

SQO cockpit looks for artifacts at `artifacts/sqo/netbox/run_github_netbox_20260520_134600/` — this path does not exist. SQO artifacts require CEU grounding and qualification engine execution.

## S1 Progression Path

```
CURRENT                    REQUIRED FOR S1                     REQUIRED FOR S2
───────                    ───────────────                     ───────────────
S0 Structural              S1 Onboarding Required              S2 Semantic Qualification
✓ 40.2, 40.3, 40.4         CEU definitions                    Semantic derivation (3b)
✓ 40.2r, 40.3s, 40.3c      CEU grounding (Phase 4)            DOM layer
✓ Client registration       SQO qualification state            Decision validation
✓ Manifest registration     Promotion state bootstrap          Reproducibility verdict
                            SQO cockpit artifact binding        Evidence rebase
```

## Recommendation

NetBox structural onboarding is COMPLETE. The structural substrate is healthy — 3,614 import edges provide genuine structural intelligence. The next step toward S1 is CEU definition, which requires a domain-knowledge stream (not a pipeline automation stream).

This assessment is observational. No S2 promotion is attempted. No semantic remediation is applied.
