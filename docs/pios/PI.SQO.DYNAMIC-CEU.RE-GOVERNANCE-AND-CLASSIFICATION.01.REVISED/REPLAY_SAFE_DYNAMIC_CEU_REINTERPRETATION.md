# Replay-Safe Dynamic CEU Reinterpretation

**Stream:** PI.SQO.DYNAMIC-CEU.RE-GOVERNANCE-AND-CLASSIFICATION.01.REVISED
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Dependency:** HISTORICAL_AUTHORITY_LOAD_REPORT.md (complete)

---

## 1. Purpose

This document traces the evolution of replay safety concepts across all eras
and establishes the canonical replay-safe interpretation of Dynamic CEU.
Replay safety is a NON-NEGOTIABLE property of Dynamic CEU — any enrichment
that cannot be replayed deterministically is governance-invalid.

---

## 2. Replay Safety Evolution

### 2.1 Early Era — Implicit Replay Concern

**Authority:** GROUNDING_DESIGN_SPECIFICATION.md

In the early era, replay safety was implicit rather than formalized.
The 11-step mapping algorithm was deterministic (same input → same output),
but this was a property of the ALGORITHM, not a governance requirement.

**Replay-relevant properties:**
- Deterministic mapping algorithm
- Contamination prevention (prevents non-deterministic source contamination)
- Pipeline-position-aware execution (ordering is fixed)

**Gap:** No formal replay guarantee. No hash verification. No versioning.
No explicit replay verification process.

### 2.2 Early Era — Governance Exploration Phases 6–8

**Authority:** SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md

Phases 6–8 of the governance exploration specifically addressed replay:
- Phase 6: Replayability
- Phase 7: Replay Determinism
- Phase 8: Deterministic Replay Instrumentation

These phases established that replay was not just desirable but REQUIRED.
The exploration concluded that any enrichment direction must be replay-safe.

### 2.3 Mid Era — Formal Replay-Safe Enrichment Model

**Authority:** REPLAY_SAFE_ENRICHMENT_MODEL.md

The mid era formalized replay safety into 5 guarantees:

| Guarantee | Definition | Enforcement Mechanism |
|-----------|-----------|----------------------|
| R1 | Deterministic derivation — same input produces same enrichment | Enrichment algorithm must be pure function |
| R2 | Additive-only persistence — enrichment is layered, never overwrites | Overlay persistence model |
| R3 | Source immutability — source material cannot be modified after enrichment | Source material hashing |
| R4 | Hash-anchored provenance — every enrichment anchored to source hash | Provenance record with hash |
| R5 | Operation versioning — enrichment operations are versioned | Operation version registry |

**Overlay rules (OV-01 through OV-06):**
- OV-01: Overlay never modifies substrate
- OV-02: Overlay is independently removable
- OV-03: Removal restores pre-overlay state
- OV-04: Overlay ordering is deterministic
- OV-05: Overlay conflicts are detectable
- OV-06: Overlay provenance is verifiable

### 2.4 Current Era — SEP Overlay Architecture

**Authority:** REPLAY_SAFE_OVERLAY_ARCHITECTURE.md, OVERLAY_VERSIONING_AND_ROLLBACK.md

The current era extends the mid-era model with:

| Extension | Description | Extends |
|-----------|-------------|---------|
| Package-level hashing | Entire SEP package hash, not just per-entry | R4 |
| Deterministic ordered application | Packages applied in monotonic version order | R1, OV-04 |
| Conflict resolution rules | Later wins, higher confidence overrides, contradictions escalated | OV-05 |
| Composite state construction algorithm | Explicit algorithm for Static + Dynamic composition | R1 |
| Replay verification process | Formal process to verify replay correctness | All |
| Monotonic integer versioning | Package versions are monotonically increasing integers | R5 |
| Revocation with state restoration | Revocation triggers recomputation without revoked package | OV-02, OV-03 |
| Version lineage tracking | Full version history preserved | R5 |
| Retention policy: no physical deletion | Revoked packages are retained for audit | R3 |

---

## 3. Canonical Replay-Safe Interpretation

Dynamic CEU is replay-safe if and only if ALL of the following hold:

### 3.1 Package Integrity

```
HASH(package_at_activation) == HASH(package_at_replay)
```

The SEP package hash computed at activation must match the hash computed
at replay. Any modification to the package between activation and replay
constitutes a replay failure.

### 3.2 Source Immutability

```
HASH(source_material_at_ingestion) == stored_source_hash
```

Every evidence entry's source hash must match the hash recorded in the
provenance chain. Source material modification invalidates all entries
derived from that source.

### 3.3 Deterministic Application Order

```
FOR EACH activated_package IN activation_order:
    APPLY overlay_entries IN entry_order
```

Packages are applied in monotonic version order. Entries within a package
are applied in declared order. The application sequence is fully deterministic.

### 3.4 Deterministic Conflict Resolution

```
IF conflict(entry_A, entry_B):
    IF entry_A.package_version > entry_B.package_version:
        entry_A wins
    ELIF entry_A.confidence > entry_B.confidence:
        entry_A wins
    ELIF contradiction(entry_A, entry_B):
        ESCALATE to governance review
```

Conflict resolution is deterministic: version order → confidence order →
escalation. The same conflict always produces the same resolution.

### 3.5 Composite State Determinism

```
composite_state = EVALUATE(
    static_ceu = certified_substrate,
    dynamic_ceu = APPLY(activated_packages_in_order),
    formula = Q_CLASS_FORMULA  // immutable
)
```

The composite evaluation of Static + Dynamic CEU is deterministic.
Same certified substrate + same activated packages + same Q-class formula
always produces the same qualification state.

### 3.6 Removal Replay Safety

```
composite_after_removal = EVALUATE(
    static_ceu = certified_substrate,
    dynamic_ceu = APPLY(activated_packages_in_order - revoked_package)
)

// Guarantee: composite_after_removal is independent of revoked_package
```

Removing (revoking) any package produces a composite state that is exactly
the state that would exist if the package had never been activated. This
is the independent removability guarantee.

---

## 4. Replay Verification Process (Canonical)

```
1. LOAD all activated SEPs for (client, run_id)
2. FOR EACH package:
   a. VERIFY package hash matches stored hash
   b. VERIFY all entry source hashes match stored hashes
   c. VERIFY provenance chain completeness
3. APPLY packages in deterministic order
4. COMPUTE composite state
5. COMPARE with stored composite state
6. IF match → REPLAY VERIFIED
   IF mismatch → REPLAY FAILURE → ESCALATE
```

---

## 5. How R1–R5 Map to Current Architecture

| Guarantee | Current Implementation | Verification |
|-----------|----------------------|-------------|
| R1 (deterministic derivation) | Deterministic application order, deterministic conflict resolution, deterministic composite evaluation | PRESERVED — extended with package-level ordering |
| R2 (additive-only persistence) | Overlay layer sits above substrate; never modifies certified artifacts | PRESERVED — unchanged |
| R3 (source immutability) | Source hash in provenance chain; no physical deletion policy | PRESERVED — extended with retention policy |
| R4 (hash-anchored provenance) | Package-level hash + per-entry source hash + provenance chain | PRESERVED — extended with package-level hashing |
| R5 (operation versioning) | Monotonic integer versioning; version lineage tracking | PRESERVED — extended with lineage tracking |

---

## 6. Replay Safety Boundaries

### 6.1 What Replay Safety Guarantees

- Same packages + same substrate → same composite state
- Removing a package restores pre-package composite state
- Hash verification detects any modification
- Conflict resolution is deterministic and reproducible
- Audit trail is complete and verifiable

### 6.2 What Replay Safety Does NOT Guarantee

- It does not guarantee that the evidence in a package is CORRECT
- It does not guarantee that the source material is AUTHORITATIVE
- It does not guarantee that the composite evaluation will advance S-state
- It does not guarantee that packages will be conflict-free

These are governance concerns addressed by other architecture elements
(provenance requirements, semantic class authorization, qualification
re-evaluation, multi-package cohabitation rules).

---

## 7. Replay Safety as Non-Negotiable Property

Dynamic CEU without replay safety is NOT Dynamic CEU. It is ungovened
semantic mutation. The replay-safe property is what distinguishes Dynamic
CEU from the semantic activation authority that was intentionally blocked
in the early era.

If replay safety is compromised:
1. The enrichment becomes non-deterministic
2. The overlay becomes a substrate modification
3. The evaluation becomes non-reproducible
4. The governance model collapses

Replay safety is not a feature of Dynamic CEU. It is a CONSTITUTIONAL
PROPERTY that defines what Dynamic CEU is.
