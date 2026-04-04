# Telemetry Normalization Specification
run_id: run_05_bootstrap_pipeline
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-IG3-BOOTSTRAP
upstream_contract: PIOS-40.3-RUN02-IG3-BOOTSTRAP
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.3 bootstrap pipeline run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; github.mode=ENABLED; jira.mode=CAPSULE; launched via bootstrap_launcher.sh

---

## Purpose

Defines how telemetry is represented across 40.4 canonical artifacts. Normalization covers naming, typing, encoding, grouping, and completeness marking. No structural modification is performed; normalization applies to representation only.

---

## Naming Conventions

### Dimension ID Scheme

```
DIM-{GROUP}-{SEQ}

Groups:
  PR  — Process Resource
  CP  — Cache Performance
  ET  — Event Throughput
  VP  — Vehicle Position
  VT  — Vehicle Telemetry
  TK  — Tank Telemetry (fleet type conditional)
  DE  — Domain Event payload field
  CS  — Connection State
  PC  — Poll Cycle

Examples:
  DIM-PR-001  blueedge_process_heap_bytes
  DIM-VP-003  vehicle.position.speed
  DIM-TK-001  vehicle.tank.compartment.levelPercent
```

### Temporal Series ID Scheme

```
TMP-{SEQ}

Classes:
  FI  — Fixed Interval
  RI  — Random Interval
  PC  — Poll Cycle
  SI  — Scrape Interval
  ED  — Event-Driven
  CD  — Config-Defined

Examples:
  TMP-001  2s fixed — fleet:positions broadcast
  TMP-009  30s configurable — HASI bridge poll
  TMP-010  event-driven — domain events
```

### Telemetry Surface ID Scheme

```
TS-{SEQ}

Classes:
  TS-ME  — Metrics endpoint
  TS-BE  — Broadcast emission
  TS-DE  — Domain event
  TS-ST  — Scrape target
  TS-HE  — Health endpoint
  TS-RL  — Request log
  TS-PC  — Poll cycle
  TS-PF  — Performance collector
```

---

## Type Normalization

| Source type | 40.4 normalized type | Notes |
|-------------|---------------------|-------|
| TypeScript `number` (integer) | integer | exact |
| TypeScript `number` (float) | float | exact |
| TypeScript `boolean` | boolean | exact |
| TypeScript string enum | enum:{value1,value2,...} | values listed from source |
| TypeScript `string` (ISO date) | timestamp_iso8601 | format from BaseFleetEvent.timestamp |
| TypeScript `Record<string, any>` | object_untyped | structure not further specified |
| Prometheus gauge | gauge | OpenMetrics type |
| Prometheus counter (semantics) | gauge_counter | gauge type but counter semantics |

---

## Unit Normalization

| Dimension | Source unit | Normalized |
|-----------|------------|-----------|
| DIM-PR-001..003 | bytes | bytes |
| DIM-PR-004 | seconds | seconds |
| DIM-VP-001, DIM-VP-002 | decimal degrees | WGS84 decimal degrees |
| DIM-VP-003, DIM-VT-005 | km/h | km/h |
| DIM-VT-002 | °C (Celsius) | Celsius |
| DIM-VT-003 | kPa | kPa |
| DIM-VT-004 | L/h | litres per hour |
| DIM-VT-006 | km | km |
| DIM-VT-007 | V (volts) | V |
| DIM-TK-001 | % (0–100) | percent |
| DIM-TK-002 | °C | Celsius |
| DIM-TK-003 | mbar | mbar |
| DIM-DE-001 | minutes | minutes |
| DIM-DE-002 | km | km |
| DIM-DE-003, DIM-DE-010 | L (litres) | litres |
| DIM-DE-006..005 | dimensionless | dimensionless |
| DIM-DE-008 | % (0–100) | percent |
| DIM-DE-009 | °C | Celsius |
| DIM-PC-001 | seconds | seconds |
| DIM-PC-002 | record count | count |
| TMP-001..002 | milliseconds | milliseconds |
| TMP-004..009 | seconds | seconds |

---

## Completeness Markers

All telemetry positions carry one of the following completeness markers:

| Marker | Meaning |
|--------|---------|
| COMPLETE | All fields/values evidenced; no gaps |
| PARTIAL | Some fields/values evidenced; explicit gap declared |
| INDIRECT | Telemetry observable via secondary surface (exporter, proxy) |
| NONE | No evidence of telemetry surface |
| CONFIG | Configuration-level observable; not runtime-emitted value |

---

## Evidence Reference Format

All telemetry claims in 40.4 artifacts carry an evidence reference in the format:

```
evidence: CEU-{id} :: {file_path_relative_to_source_root}
```

This mirrors the structural traceability notation from 40.3.

Example:
```
evidence: CEU-08 :: src/gateways/fleet.gateway.ts — positionInterval = setInterval(..., 2000)
```

---

## Grouping Model

Telemetry is organized in this hierarchy throughout 40.4 artifacts:

```
Level 1: Entity tier (CE, SA, INF, BM, FE, DS)
  Level 2: Specific entity (CE-001, BM-062, ...)
    Level 3: Telemetry surface (TS-001 through TS-017)
      Level 4: Dimension (DIM-PR-001 through DIM-PC-002)
        Level 5: Temporal anchor (TMP-001 through TMP-012)
```

---

## Fleet-Type Conditional Telemetry

Several telemetry dimensions are conditional on vehicle fleet type:

| Dimension | Condition | Evidence |
|-----------|-----------|---------|
| DIM-TK-001, TMP-TK-002, DIM-TK-003 | fleetType = 'tanker' only | CEU-08 :: fleet.gateway.ts — if (v.fleetType === 'tanker') |
| fleet:positions with tanker compartment data | fleetType = 'tanker' | fleet.gateway.ts |
| EV-specific events (DIM-DE-008) | EV-registered vehicles (BM-022) | fleet-events.ts EvEvent |
| Cold chain temperature (DIM-DE-009) | coldchain-registered vehicles (BM-021) | fleet-events.ts ColdChainEvent |

---

## Auth-Scoped Telemetry

Domain events carry auth context via BaseFleetEvent fields:

| Field | Meaning | Evidence |
|-------|---------|---------|
| source | emitting module name | fleet-events.ts BaseFleetEvent.source |
| correlationId | request trace identifier | fleet-events.ts BaseFleetEvent.correlationId |
| userId | triggering user | fleet-events.ts BaseFleetEvent.userId |
| orgId | tenant/org scope | fleet-events.ts BaseFleetEvent.orgId |

These fields allow telemetry to be scoped to user, organization, and request context.

---

## Prometheus Export Format

The /health/prometheus endpoint exports in OpenMetrics text format (v0.0.4). Observed structure from source:

```
# TYPE {metric_name} gauge
{metric_name} {value}
```

Content-Type: `text/plain; version=0.0.4; charset=utf-8`
Evidence: CEU-08 :: health/health.controller.ts — @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')

Full export format implementation is in PrometheusService (not read beyond getStats()/setGauge()/export() method signatures).

---

## Unknown-Space — Normalization

| ID | Description |
|----|-------------|
| TNRM-01 | PrometheusService.export() format implementation not read — exact OpenMetrics line format not confirmed beyond Content-Type header |
| TNRM-02 | PerformanceMiddleware.getMetrics() return schema not confirmed — endpoint-level metric object structure unknown |
| TNRM-03 | Winston log format (JSON vs text) not confirmed — log structure unspecified beyond nest-winston dependency |

---

## Status

normalization_spec_complete: PARTIAL
all_normalization_evidence_backed: TRUE
inference_applied: NONE
structure_modified: FALSE
