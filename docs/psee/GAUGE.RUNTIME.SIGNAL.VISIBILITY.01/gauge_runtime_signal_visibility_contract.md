# GAUGE Runtime Signal Visibility Contract
# GAUGE.RUNTIME.SIGNAL.VISIBILITY.01 — Deliverable 1

## Identity

- Contract: GAUGE.RUNTIME.SIGNAL.VISIBILITY.01
- Date: 2026-04-14
- Branch: wip/gauge-psee-hygiene-snapshot
- Mode: STRICT UI + RUNTIME CONSUMPTION — NO SIGNAL DERIVATION

---

## Objective

Introduce a governed SIGNAL AVAILABILITY block into GAUGE, consuming structured signal JSON and exposing signal presence clearly before the Discovery Queries section.

---

## Signal Source

**Primary (gauge_state.signals):** NOT PRESENT — gauge_state.json has no `signals` field.

**Fallback (governed JSON artifact):** `docs/pios/41.4/signal_registry.json`
- registry_id: PIOS-41.4-RUN01-SIGNAL-REGISTRY
- contract_id: PIOS-41.4-RUN01-CONTRACT-v1
- run_reference: run_01_blueedge
- total_signals: 5

Signal data is consumed as-is. No derivation. No transformation. No inference from topology.

---

## Changes Made

### New file: `app/gauge-product/pages/api/signals.js`

API route reading `docs/pios/41.4/signal_registry.json` directly.
Returns: `{ signals, total, by_confidence, mounted, registry_id, run_reference, contract_id, source }`.
Aggregates count per `evidence_confidence` value — presentation only, no semantic transformation.
Null-safe: if file not found, returns `{ signals:[], total:0, mounted:false }`.

### Modified: `app/gauge-product/components/GaugeContextPanels.js`

- Added `useSignalsData()` hook → fetches `/api/signals`
- Added `SignalAvailability` component:
  - If `total > 0`: renders summary count + evidence_confidence distribution chips + compact signal list (max 5)
  - If `total === 0`: renders explicit empty-state message per R5

### Modified: `app/gauge-product/pages/index.js`

- Added `useSignalsData`, `SignalAvailability` to imports
- Added `const signalsResult = useSignalsData()` to component
- Inserted Signal Availability panel between Structural Proof and Discovery Queries

### Modified: `app/gauge-product/styles/gauge.css`

- Added `sa-` prefix CSS block (28 rules) for Signal Availability block styling

---

## Panel Placement

CENTER column order (final):
1. Structural Proof
2. **Signal Availability** ← NEW
3. Discovery Queries (LOCKED)
4. State Summary

---

## Signal Data (at execution time)

| signal_id | evidence_confidence | title (truncated) |
|-----------|--------------------|--------------------|
| SIG-001 | STRONG | Sensor Bridge Throughput Ceiling… |
| SIG-002 | STRONG | Platform Runtime State: Seven Core Dimensions… |
| SIG-003 | MODERATE | Dependency Load: 68% of Architectural Relationships… |
| SIG-004 | MODERATE | Structural Volatility: Edge-to-Node Density Exceeds Unity |
| SIG-005 | WEAK | Coordination Pressure: Static Interface Sharing at 87.5%… |

Distribution: STRONG: 2 · MODERATE: 2 · WEAK: 1

---

## No-Change Scope

| item | status |
|------|--------|
| signal ids | UNCHANGED |
| signal titles | UNCHANGED |
| evidence_confidence values | UNCHANGED |
| signal counts | UNCHANGED |
| Discovery Queries logic | UNCHANGED |
| topology API | UNCHANGED |
| canonical_topology.json | UNCHANGED |
| envelope_adapter.js | UNCHANGED |
| gauge_state.json | UNCHANGED |
| Any signal semantics | UNCHANGED |
