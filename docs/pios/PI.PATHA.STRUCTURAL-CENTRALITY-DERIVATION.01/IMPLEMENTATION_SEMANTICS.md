# Implementation Semantics — PI.PATHA.STRUCTURAL-CENTRALITY-DERIVATION.01

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|---|---|---|---|
| `compute_degree_metrics` | structural_centrality.py | Compute per-file in/out degree from IMPORTS edges | Reusable — any 40.3s consumer |
| `normalize_metrics` | structural_centrality.py | Degree centrality normalization (N-1 denominator) | Reusable |
| `classify_structural_role` | structural_centrality.py | First-match-wins role classification | Reusable — same 7-role taxonomy |
| `detect_false_positives` | structural_centrality.py | False-positive risk detection and per-file flagging | Reusable |
| `compute_ranking` | structural_centrality.py | Multi-key sort producing unique centrality ranks | Reusable |
| `build_artifact` | structural_centrality.py | 40.3c artifact assembly | Reusable pattern |

## 2. Input Contracts

| Input | Schema | Consumed Fields |
|---|---|---|
| 40.3s/code_graph.json | artifact_class="40.3s" | relationships[].source_path, target_path, relation_type, source_node_id, target_node_id; file_count; relationship_summary; client_id; run_id |

## 3. Output Contracts

| Output | Location | Schema |
|---|---|---|
| 40.3c/structural_centrality.json | `structure/40.3c/` | See artifact schema in execution_report.md |

## 4. Calibration Assumptions

| Parameter | Value | Status |
|---|---|---|
| threshold_high | max(3, ceil(file_count * 0.20)) | TUNED — validated on Flask (24 files, threshold=5). May need adjustment for projects >500 files. |
| RE_EXPORT_HUB out_degree minimum | 3 | TUNED — prevents false classification of small __init__.py files |
| structural_throughput_proxy formula | (in * out) / max(in * out) | HEURISTIC — captures throughput nodes but is NOT true graph betweenness |
| Normalization denominator | N - 1 | GOVERNED — standard graph-theoretic degree centrality |

## 5. Extension Points

| Extension | Mechanism |
|---|---|
| Additional relationship types | Add to `compute_degree_metrics` counter extraction; role classifier uses only IMPORTS for centrality |
| Cross-project comparison | Add percentile normalization over a population of projects (not implemented) |
| Richer centrality metrics | Replace structural_throughput_proxy with true betweenness if graph library added |
| Role taxonomy expansion | Add roles before VALIDATION_SUPPORT in first-match-wins chain |
| Multi-indexer centrality | Consume 40.3s from different indexers; normalization is indexer-neutral |

## 6. Module Responsibility Map

| File | Concern |
|---|---|
| structural_centrality.py | Centrality computation, role classification, false-positive detection, 40.3c artifact production |
| run_client_pipeline.py | Phase 3.7 orchestration — existence check, idempotency, 40.3s dependency, graceful degradation |
