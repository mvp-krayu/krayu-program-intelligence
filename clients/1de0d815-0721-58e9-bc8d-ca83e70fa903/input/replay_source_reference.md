# BlueEdge Replay Source Reference

stream: PSEE.RECONCILE.1.WP-15.BLUEEDGE.REPLAY
date: 2026-04-06

---

## Baseline Evidence Source

| Artifact | Path |
|----------|------|
| Entity Catalog (40.3) | docs/pios/40.3/entity_catalog.md |
| Program Execution Graph (40.3) | docs/pios/40.3/program_execution_graph.md |
| Dependency Map (40.3) | docs/pios/40.3/dependency_map.md |
| Structural Telemetry (40.4) | docs/pios/40.4/structural_telemetry.md |
| Signal Computation Spec (40.5) | docs/pios/40.5/signal_computation_specification.md |
| Signal Traceability Map (40.5) | docs/pios/40.5/signal_traceability_map.md |
| Signal Output Set (40.5) | docs/pios/40.5/signal_output_set.md |
| Intelligence Signal Registry (41.4) | docs/pios/41.4/signal_registry.json |

---

## Topology Binding

### Domains (3)
- Application — CE-001 (Backend API), CE-002 (Frontend)
- Device — SA-001 (HASI Bridge), SA-002 (Sensor Collector)
- Infrastructure — INF-001..INF-005

### Nodes (9) — from entity_catalog.md
| Node ID | Entity | Domain |
|---------|--------|--------|
| N-B0506103 | Blue Edge Fleet Management API (CE-001) | Application |
| N-A707EA33 | Blue Edge Fleet Frontend (CE-002) | Application |
| N-62339513 | HASI Bridge Agent (SA-001) | Device |
| N-5D57CFB8 | Sensor Collector Agent (SA-002) | Device |
| N-7AAD8D87 | PostgreSQL+TimescaleDB (INF-001) | Infrastructure |
| N-53CF7041 | Redis (INF-002) | Infrastructure |
| N-61E8FB24 | Monitoring — Prometheus+Grafana (INF-003) | Infrastructure |
| N-1FFEB1AE | MQTT Broker (INF-004) | Infrastructure |
| N-80E533AB | HASI Security System (INF-005) | Infrastructure |

### Relationships (9) — from dependency_map.md
| From | To | Type | Source |
|------|----|------|--------|
| CE-002 | CE-001 | DEPENDS_ON | SD-001 REST API |
| CE-001 | INF-001 | DEPENDS_ON | SD-003 TypeORM |
| CE-001 | INF-002 | DEPENDS_ON | SD-004 Redis cache |
| SA-001 | INF-005 | DEPENDS_ON | SD-005 HASI SQLite |
| SA-001 | INF-004 | DEPENDS_ON | SD-006 MQTT primary |
| SA-001 | CE-001 | DEPENDS_ON | SD-007 REST fallback |
| INF-003 | CE-001 | COORDINATES_WITH | SD-008 Prometheus scrape |
| INF-003 | INF-001 | COORDINATES_WITH | SD-009 postgres-exporter |
| INF-003 | INF-002 | COORDINATES_WITH | SD-009 redis-exporter |

---

## Signal Binding

| Signal | Name (40.5) | Severity Basis | Bound Count Basis |
|--------|-------------|---------------|------------------|
| SIG-001 | Backend Process Heap Usage | CRITICAL — runtime state unknown, no health observable | 3 — CE-001, BM-061, Prometheus endpoint |
| SIG-002 | Cache Hit Efficiency | HIGH — performance degradation risk | 4 — CE-001, INF-002, 2 cache metrics |
| SIG-003 | Cache Connectivity State | CRITICAL — hard infrastructure dependency | 2 — CE-001, INF-002 |
| SIG-004 | Domain Event Emission Count | HIGH — event pipeline state unknown | 5 — CE-001/BM-063, 4 handler categories |
| SIG-005 | Fleet Active Connection Count | HIGH — fleet real-time state unknown | 3 — CE-001/BM-062, CE-002, fleet namespace |
| SIG-006 | Sensor Bridge Batch Throughput | MEDIUM — static known value (0.333 rec/sec) | 2 — DIM-PC-001, DIM-PC-002 (COMPLETE) |
| SIG-007 | Vehicle Alert Severity State | CRITICAL — safety/operational alerts unknown | 6 — CE-001/BM-005, 5 severity levels |
| SIG-008 | Driver Session Performance | HIGH — composite performance unknown | 5 — CE-001/BM-057+BM-043, 4 session dims |

---

## Computed BlueEdge Baseline Metrics

| Metric | Value | Derivation |
|--------|-------|-----------|
| structural_density | 3.0 | 9 nodes / 3 domains |
| dependency_load | 1.0 | 9 rels / 9 nodes |
| coordination_pressure | 0.88 | 7 HIGH/CRITICAL / 8 signals |
| visibility_deficit | 0.38 | 30 total_bound / 80 |

---

## Determinism Verification

Run 1 gauge_state.json sha256: `436a9ad5ad4f1e1b997fc6aa0aa2d9874feaaa1c771a384a73872a3f8cb5cd16`
Run 2 gauge_state.json sha256: `436a9ad5ad4f1e1b997fc6aa0aa2d9874feaaa1c771a384a73872a3f8cb5cd16`
Result: MATCH — DETERMINISM VERIFIED
