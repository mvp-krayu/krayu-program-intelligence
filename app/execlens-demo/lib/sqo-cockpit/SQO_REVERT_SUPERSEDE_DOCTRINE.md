# SQO Revert / Supersede Doctrine

**Classification:** Operational governance contract  
**Established:** 2026-05-26

## Doctrine

**No destructive revert. All corrections are compensating governed events.**

## Rules

### 1. Event Log Is Append-Only

`promotion_event_log.jsonl` uses `fs.appendFileSync`. There is no truncate, no delete, no overwrite. Every action produces exactly one event with monotonic EVT-xxx identifiers. The event log is the source of audit history.

### 2. Crash Rollback Is Atomicity, Not Revert

`SQOActionEngine.server.js` takes `deepClone` snapshots of `promotionState`, `reviewObligations`, and `qualificationBlockers` before mutation. If the apply function throws, snapshots are restored. This is transaction atomicity — ensuring a failed action leaves no partial state — not operator-initiated revert.

### 3. Corrections Are Compensating Events

- A rejected obligation is corrected by contest (REJECTED → CONTESTED) then re-review (CONTESTED → RESOLVED). Two new events, not deletion of the rejection.
- A denied promotion is corrected by a new `promotion_request` → new approval cycle.
- Each correction carries its own authority validation, event emission, and audit trail.

### 4. Irreversible Actions

- `insufficiency_permanent: true` — no compensating action defined. This is a terminal governance determination.
- `promotion_approve` — S-level advancement is recorded in `promotion_lineage.transitions` and is not reversible. A subsequent demotion would require a new governance action type (not currently defined).

### 5. Event Log Is Source of Audit History

The event log, not the current state artifacts, is the authoritative record of what happened. State artifacts represent current posture. The event log represents the full decision history that produced that posture.

## Implementation References

| Mechanism | File | Line |
|---|---|---|
| Pre-mutation snapshots | SQOActionEngine.server.js | 26-28 |
| Crash rollback | SQOActionEngine.server.js | 48-51 |
| Append-only event write | PromotionEventWriter.server.js | 77-82 |
| Event structure (prior/resulting state) | PromotionEventWriter.server.js | 40-75 |
| Replay validation | SQOActionEngine.server.js | 457-484 |
