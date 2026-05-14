# Sandbox Isolation Boundaries

**Stream:** PI.SQO.BLUEEDGE.DYNAMIC-CEU.EXECUTION-SANDBOX.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation
**Wave:** 5 — Controlled Operationalization (Execution Isolation)

---

## 1. Purpose

This document defines the isolation boundaries that separate sandbox
execution from certified state — what the sandbox may read, what it
may write, what it may never touch, and how boundary enforcement works.

---

## 2. Boundary Classification

### 2.1 Read-Only Boundary (Certified → Sandbox)

The sandbox MAY READ the following certified artifacts:

| Artifact | Path Pattern | Purpose |
|----------|-------------|---------|
| Canonical topology | `artifacts/semantic/<client>/<run_id>/` | Substrate reference for overlay evaluation |
| DPSIG signal set | `artifacts/dpsig/<client>/<run_id>/` | Signal context (read, never modified) |
| Qualification baseline | `artifacts/sqo/<client>/<run_id>/*.json` (certified) | Baseline metrics for composite computation |
| Rendering metadata | `artifacts/reports/<client>/<run_id>/` | Q-class, S-state, gap inventory reference |
| Crosswalk | `artifacts/sqo/<client>/<run_id>/crosswalk*.json` | Continuity reference for overlay extension |

**Read mechanism:** Hash-verified reference. The sandbox stores the
expected hash of each certified artifact it reads. Before any read,
the artifact's current hash is verified against the stored hash.
Hash mismatch → SANDBOX HALT (the substrate has changed under it).

### 2.2 Write-Contained Boundary (Sandbox Internal)

The sandbox MAY WRITE ONLY to:

| Namespace | Path Pattern | Content |
|-----------|-------------|---------|
| Sandbox root | `artifacts/sqo/<client>/<run_id>/sandbox/` | All sandbox state |
| Overlay packages | `sandbox/packages/<package_id>/` | SEP artifacts (overlay-only) |
| Overlay registry | `sandbox/registry/` | Package status tracking |
| Overlay mount | `sandbox/mount/` | Mount registry, composite state |
| Activation state | `sandbox/activation/` | State machine, gate records |
| Replay artifacts | `sandbox/replay/` | Snapshots, reconstruction inputs |
| Audit trail | `sandbox/audit/` | Events, integrity chain |
| Recovery state | `sandbox/recovery/` | Rollback points, cleanup |

### 2.3 Forbidden Boundary (Never Touch)

The sandbox MUST NEVER WRITE to:

| Artifact Category | Path Pattern | Reason |
|-------------------|-------------|--------|
| Certified substrate | `artifacts/semantic/` | Immutable PATH A output |
| DPSIG signals | `artifacts/dpsig/` | Lane D sovereign |
| Certified reports | `artifacts/reports/` | Pipeline-certified output |
| Vault | `vault/` | Source material (L0 boundary) |
| Pipeline configuration | `scripts/pios/` | Execution logic |
| PATH B artifacts | `artifacts/reports/*/rendering_metadata*` | Projection state |
| Certified SQO state | `artifacts/sqo/<client>/<run_id>/*.json` (non-sandbox) | Certified qualification |

---

## 3. Boundary Enforcement Model

### 3.1 Physical Namespace Isolation

All sandbox writes are physically constrained to the `sandbox/`
subdirectory. No sandbox operation constructs a write path outside
this namespace.

```
WRITE PATH VALIDATION:
  FOR EVERY write operation in sandbox execution:
    ASSERT path.startsWith("artifacts/sqo/<client>/<run_id>/sandbox/")
    IF assertion fails:
      HALT execution
      LOG boundary violation
      ESCALATE to governance
```

### 3.2 Hash-Verified Read References

Every certified artifact the sandbox reads is referenced by content hash:

```json
{
  "baseline_references": {
    "substrate_topology": {
      "path": "artifacts/semantic/blueedge/run_blueedge_productized_01_fixed/topology.json",
      "expected_hash": "08480c17...",
      "verified_at": "<timestamp>"
    },
    "qualification_baseline": {
      "path": "artifacts/sqo/blueedge/run_blueedge_productized_01_fixed/qualification_state.json",
      "expected_hash": "<hash>",
      "verified_at": "<timestamp>"
    }
  }
}
```

**Pre-read verification:**
```
BEFORE reading certified artifact:
  current_hash = sha256(artifact_content)
  IF current_hash != expected_hash:
    HALT: "SUBSTRATE_CHANGED — sandbox baseline reference invalid"
    REQUIRE sandbox re-initialization
```

### 3.3 Composite State Non-Persistence

The composite state (certified + overlay contributions) is COMPUTED
inside the sandbox and cached in `sandbox/mount/composite_state.json`.
This file is:

- A cache, not a source of truth
- Recomputable from (certified_baseline + mounted_overlays)
- Never promoted to certified status
- Deleted on sandbox closure without loss

### 3.4 Overlay Origin Tagging

Every artifact inside the sandbox carries origin metadata:

```json
{
  "origin": "SANDBOX",
  "sandbox_id": "<id>",
  "source": "OVERLAY" | "COMPUTED" | "REFERENCE",
  "package_id": "<if from overlay>",
  "certified_equivalent": false
}
```

No sandbox artifact may omit origin metadata. Any artifact without
origin metadata inside the sandbox namespace is a boundary violation.

---

## 4. Boundary Violation Detection

### 4.1 Violation Types

| Violation | Severity | Response |
|-----------|----------|----------|
| Write outside sandbox namespace | CRITICAL | Immediate halt, governance escalation |
| Read hash mismatch (substrate changed) | CRITICAL | Sandbox halt, re-initialization required |
| Missing origin metadata | HIGH | Operation blocked until metadata added |
| Composite state promoted to certified | CRITICAL | Rollback, governance escalation |
| Certified artifact referenced by mutable handle | HIGH | Replace with hash reference |
| Cross-sandbox state leakage | CRITICAL | Both sandboxes halted |

### 4.2 Violation Response Protocol

```
ON boundary violation:
  1. HALT all sandbox operations immediately
  2. LOG violation with full context (path, operation, expected vs actual)
  3. FREEZE sandbox state (no further reads or writes)
  4. ESCALATE to governance review
  5. REQUIRE explicit governance authorization to resume or cleanup
```

---

## 5. BlueEdge-Specific Boundary Constraints

| Constraint | BlueEdge Verification |
|------------|----------------------|
| Topology immutability | Hash 08480c17... verified before every overlay computation |
| DPSIG sovereignty | No sandbox path references `artifacts/dpsig/blueedge/` for write |
| Rendering metadata immutability | Hash 869d49549f... verified at sandbox creation |
| Crosswalk immutability (certified entries) | 13 certified crosswalk entries verified by hash |
| Decision validation immutability | 14/14 PASS status verified at sandbox creation |
| Reproducibility verdict immutability | FULL_REPRODUCIBILITY verified at sandbox creation |

---

## 6. Isolation Guarantees

| Guarantee | Mechanism |
|-----------|----------|
| Certified substrate survives sandbox failure | Physical namespace separation |
| Certified qualification survives sandbox failure | No certified-path writes |
| Sandbox can be fully deleted | All sandbox state in `sandbox/` namespace |
| No implicit overlay persistence | All overlay state explicitly tracked |
| No substrate contamination | Hash-verified reads, namespace-constrained writes |
| No hidden activation leakage | Origin tagging on all sandbox artifacts |

---

## 7. Governance Rules

1. Sandbox writes are physically constrained to `sandbox/` namespace.
2. Certified reads are hash-verified before every access.
3. All sandbox artifacts carry origin metadata.
4. Boundary violations halt execution immediately.
5. No sandbox artifact may be promoted to certified status within the sandbox.
6. Cross-sandbox contamination is a critical governance event.
