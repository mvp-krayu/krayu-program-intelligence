# Replay-Safe Overlay Architecture

**Stream:** PI.SQO.SEMANTIC-EVIDENCE-PACKAGE-SPECIFICATION.01
**Date:** 2026-05-11
**Status:** SPECIFICATION — no runtime implementation

---

## 1. Replay Safety Requirement

Every overlay operation must be deterministically reproducible. Given:
- the same certified substrate
- the same set of ACTIVATED SEPs at the same versions
- the same overlay application order

The system MUST produce:
- the same composite semantic state
- the same qualification evaluation result
- the same debt inventory re-evaluation
- the same progression readiness score

Replay safety is non-negotiable because the certified substrate is
itself replay-safe (reproducibility_verdict = FULL_REPRODUCIBILITY),
and overlays must not break this guarantee.

---

## 2. Overlay Application Model

### 2.1 Layered Application

Overlays are applied as ordered layers above the certified substrate:

```
Layer 0:  Certified Substrate (Static CEU)
          ↓ immutable base
Layer 1:  SEP-001.v2 (ACTIVATED, created first)
          ↓ additive overlay
Layer 2:  SEP-002.v1 (ACTIVATED, created second)
          ↓ additive overlay
Layer N:  SEP-NNN.vM (ACTIVATED, created Nth)
          ↓ additive overlay
          ═══════════════════════
Result:   Composite Semantic State
```

### 2.2 Application Order

Overlays are applied in package creation order (by `package_id` sequence
number). Within a package, evidence entries are applied in entry order
(by `entry_id` sequence number).

This ordering is deterministic because:
- package IDs are monotonically sequenced
- entry IDs are monotonically sequenced within a package
- no concurrent modification is permitted

### 2.3 Conflict Resolution

If two evidence entries target the same domain and field:

**Rule 1: Later entry wins for same-version claims.**
If both entries propose the same claim type for the same target,
the later-sequenced entry takes precedence.

**Rule 2: Higher confidence basis wins for competing claims.**
If entries have different `confidence_basis` values:
```
DIRECT_CITATION > STRONG_INFERENCE > CONTEXTUAL_DERIVATION
```

**Rule 3: Conflict is recorded.**
Every conflict is logged in the composite semantic state with both
the winning and losing entries identified. No silent overwrite.

---

## 3. Overlay Integrity

### 3.1 Package Hash

Each SEP version is hashed at creation time:
```
package_hash = sha256(JSON.stringify(package, sorted_keys))
```

The hash is recorded in the package registry and verified at
activation time. If the stored hash does not match the loaded
artifact, activation is REJECTED.

### 3.2 Entry Provenance Chain

Each evidence entry carries:
- `evidence_basis`: reference to the specific source material passage
- `confidence_basis`: classification of derivation confidence
- `replay_safe: true`: attestation that the entry is deterministic

An entry without provenance linkage is REJECTED at package creation.

### 3.3 Substrate Isolation

The overlay layer MUST NOT write to:
- `artifacts/dpsig/`
- `artifacts/semantic/`
- `artifacts/reports/`
- `vault/`
- any file path owned by the PATH A or PATH B pipeline

The overlay layer writes ONLY to:
- `artifacts/sqo/<client>/<run_id>/semantic_evidence_packages/`

---

## 4. Composite State Construction

The composite semantic state is computed (never persisted as a
replacement for the substrate):

```
function computeCompositeState(substrate, activatedOverlays) {
  // Start with certified substrate
  composite = deepClone(substrate)
  composite.overlay_contributions = []

  // Apply each overlay in order
  for overlay in activatedOverlays (ordered by package_id):
    for entry in overlay.evidence_entries:
      if entry.semantic_class not authorized:
        skip (logged as REJECTED_UNAUTHORIZED)

      application = applyEntry(composite, entry)
      composite.overlay_contributions.push({
        package_id: overlay.package_id,
        entry_id: entry.entry_id,
        claim_type: entry.claim_type,
        target_domain: entry.target_domain,
        applied: application.success,
        conflict: application.conflict || null
      })

  // Compute composite metrics
  composite.static_backed_count = countCertifiedBacking(substrate)
  composite.overlay_backed_count = countOverlayBacking(composite.overlay_contributions)
  composite.composite_backed_count = composite.static_backed_count + composite.overlay_backed_count

  return composite
}
```

The composite state is:
- computed on demand (not persisted as a certified artifact)
- deterministic from its inputs
- attributable to specific overlay entries
- distinguishable from certified substrate at every field

---

## 5. Replay Verification

Replay safety is verified by:

1. **Input integrity check.** Hash the substrate + activated overlay set.
2. **Deterministic recomputation.** Compute composite state twice from
   the same inputs.
3. **Output hash comparison.** The two composite states must produce
   identical hashes.

This mirrors the existing `replay_verification` pattern used by the
debt engine and qualification state engine.

---

## 6. Overlay Removal Replay Safety

When an overlay is REVOKED:

1. The overlay is marked REVOKED in the package registry.
2. The composite state is recomputed WITHOUT the revoked overlay.
3. The resulting composite state must exactly match what the
   composite state would have been if the overlay had never existed.

This is the independently-removable guarantee: removing an overlay
is equivalent to never having applied it.

If removal would leave the composite state in an inconsistent state
(e.g., a later overlay depends on a claim from the revoked overlay),
the removal is BLOCKED and the dependency must be resolved first.
