---
title: Known Gaps
node_type: governance
stream_id: PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
---

# Known Gaps

Documented gaps, risks, and open conditions for run `run_authoritative_recomputed_01`.

### GAP-01 — CONCEPT-06 Semantic Gap

**Risk:** CONCEPT-06 predicate uses `PHASE_1_ACTIVE` and will NOT match Stream 10 schema where `execution_status = 'NOT_EVALUATED'`. The EXECUTION verdict in overview.js may render as VERIFIED rather than UNKNOWN for the recomputed run — which would be **incorrect**.

**Impact:** Before LENS can safely surface the EXECUTION verdict against any Stream-10-schema run, the concept predicate must be updated to include `NOT_EVALUATED`.

**Status:** OPEN — documented. Production risk on record.
### GAP-02 — Execution Layer Not Evaluated

**Risk:** Runtime execution assessment has not been run. All execution-dependent claims (CLM-13) are in NOT_EVALUATED state. Completion points = 0.

**Impact:** Score ceiling (100) is projected, not proven. Must accompany all score claims.

**Status:** KNOWN — by design. Run PSEE execution engine to resolve.


**Authority:** PRODUCTIZE.GAUGE.OBSIDIAN.EVIDENCE.VAULT.V3.01
