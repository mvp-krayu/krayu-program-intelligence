# Execution Fossils

> **Artifacts of prior execution patterns that no longer apply but document system evolution.**

---

## Pre-CLOSURE.md Era (40.x)

**Fossil:** Early 40.x streams have no CLOSURE.md. Commits serve as the only closure record.

**Example:** Stream 40.2 → commit a6f8d68 "lock PiOS 40.2 governed execution boundary" is the closure.

**What it tells us:** Closure discipline was emergent, not mandated from inception.

## 51.x Repair Density

**Fossil:** 6 repair streams out of 18 total in the 51.x range:
- 51.1R (repair)
- 51.5R (repair)
- 51.6R (repair) — spawned 4 sub-repairs (51.6R.1 → 51.6R.4)
- 51.8R (repair) — 10 amendment runs

**What it tells us:** Panel-based guided choreography was brittle. Each persona/navigation change cascaded through the system. This density of repairs motivated the move to independent SQO Cockpit sections.

## WOW Rendering

**Fossil:** Stream 51.1-51.2C references "WOW rendering" — a presentation model for demo impact.

**What it tells us:** The system went through a phase of prioritizing visual impact. This was later disciplined into the LENS v2 aesthetic doctrine ("cinematic executive experience" rather than "WOW").

## CONTROL Shadow

**Fossil:** Commit 4525ab3 "implement CONTROL shadow — pure function mirror of 51.9 runtime authority"

**What it tells us:** A pattern where governance creates a "shadow" implementation to validate runtime behavior. This pattern was not extended beyond 51.9 but represents an interesting validation approach.

## ENL (Executive Narrative Layer)

**Fossil:** Multiple ENL references (ENL-001 → ENL-005, ENL-010). ENL was the intermediate name between ExecLens and LENS v2.

**What it tells us:** The runtime surface went through three naming phases: ExecLens → ENL → LENS v2. ENL was primarily a persona/narrative rendering layer.

## Numeric Stream Naming

**Fossil:** 40.x, 41.x, 42.x, 43.x, 44.x, 51.x stream numbers.

**What it tells us:** The original 00-60 stream architecture (from governance_master_capsule.md) was later extended to 75.x and eventually replaced by PI.*.*.01 naming.

## Cross-References

- [[HISTORICAL_SNAPSHOT_INDEX]] — snapshots
- [[SUPERSEDED_CONCEPTS]] — what was replaced
- [[FAILED_ARCHITECTURAL_PATHS]] — what didn't work
