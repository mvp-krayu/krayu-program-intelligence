# Gravity Well Reassessment — BlueEdge

Stream: PI.RUNTIME-CONNECTIVITY-PROOF.01
Specimen: blueedge / run_blueedge_genesis_e2e_03
Date: 2026-06-05

---

## Static import gravity well: PRESERVED

**Platform Infrastructure and Data (DOMAIN-10)** remains the static import gravity well. This finding is not invalidated.

The static graph measured:
- Highest import concentration
- Hub dependency patterns (centrality)
- Pressure zone anchoring
- Delivery pressure concentration

These measurements are real. The code graph correctly identifies where file-level import dependencies concentrate.

## Event gravity well: NEWLY IDENTIFIED

With the event connectivity graph, two domains emerge as potential system-level gravity wells:

### DOMAIN-08: Real-Time Streaming and Gateway

- **Every WebSocket emission** passes through `FleetGateway`
- **Every event→frontend path** passes through `WebSocketBroadcastHandler → FleetGateway → Socket.IO`
- All 12+ real-time data streams originate from this domain
- All 6 frontend socket hooks consume from this domain
- This domain is the runtime coordination backbone

**If FleetGateway fails, all real-time data stops.** No alerts, no live positions, no telemetry, no driver sessions reach the frontend. This is a single point of failure that the static graph cannot see.

### DOMAIN-11: Event-Driven Architecture

- `FleetEventsModule` is `@Global()` — injected everywhere
- **All 53 domain events** are defined and routed through this domain
- **All 4 event handlers** are owned by this domain
- Cross-domain coordination depends entirely on `FleetEventEmitter`

**If FleetEventEmitter fails, all domain event processing stops.** Cache invalidation, audit logging, notifications, and WebSocket broadcast all cease. This is the architectural spine of the backend.

## Gravity well comparison

| Gravity Well | Evidence Layer | Domain | Nature | PI Visibility |
|---|---|---|---|---|
| Platform Infrastructure | STATIC_IMPORT | DOMAIN-10 | Import concentration, file-level dependency hub | MEASURED |
| Real-Time Streaming | WEBSOCKET_FLOW | DOMAIN-08 | Runtime coordination single point of failure | NOT MEASURED |
| Event-Driven Architecture | EVENT_FLOW + DI_INJECTION | DOMAIN-11 | Event bus backbone, global DI module | NOT MEASURED |

## What this means for the consequence posture

The existing posture — **Systemic Operational Fragility concentrated in Platform Infrastructure** — is correct for what was measured. But:

1. The fragility assessment is incomplete. Two additional gravity wells exist in the runtime layer that are structurally more critical for operational continuity than the import hub.

2. The "13 dark domains carry no coordination load" implicit conclusion was false. DOMAIN-03 (Fleet Core) alone emits events that trigger 4 handler groups. DOMAIN-04 (Fleet Verticals) carries safety-critical events (gas leak, cold chain breach, custody transfer) with notification and audit implications.

3. The combination consequences (AMPLIFIED_DEP_FRAG, STRUCT_GRAVITY_WELL) were computed from static evidence only. If event-flow edges were included, the combination patterns could differ — particularly the locus and scope of convergence.

## Assessment

The SYSTEM gravity well cannot be finalized until the SYSTEM_CONNECTIVITY_GRAPH is computed with all visibility layers weighted. The static finding stands as the CODE gravity well. The event findings stand as the RUNTIME gravity well. They are complementary, not contradictory.

The architectural correction is: gravity well assessment must state which visibility layer produced it.
