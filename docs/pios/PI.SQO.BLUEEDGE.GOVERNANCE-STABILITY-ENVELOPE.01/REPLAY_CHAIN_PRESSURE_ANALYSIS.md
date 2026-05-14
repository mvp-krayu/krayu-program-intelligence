# Replay Chain Pressure Analysis

**Stream:** PI.SQO.BLUEEDGE.GOVERNANCE-STABILITY-ENVELOPE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Wave:** W5 — Advanced Governance

---

## 1. Purpose

Characterize how replay chain integrity and clarity degrade under
increasing orchestration pressure — deeper chains, more verifications,
dependency-driven intermediate states, and reconstruction complexity.

---

## 2. Replay Chain Architecture (From Upstream)

The replay model uses 6 inputs (from SANDBOX_REPLAY_RECONSTRUCTION_MODEL):

| Input | Role |
|-------|------|
| I-1: Substrate version | Immutable structural foundation |
| I-2: Qualification baseline | Pre-overlay qualification state |
| I-3: Overlay package set | SEP artifacts at specific versions |
| I-4: Activation profile | Which packages ACTIVATED, in what order |
| I-5: Evaluation framework version | Q-class, S-state gate definitions |
| I-6: Sandbox manifest | Namespace identity, creation time |

Each replay verification computes sha256 of composite state and
compares to stored snapshot.

---

## 3. Replay Chain Depth Scaling

### 3.1 Chain Depth by Overlay Count

For a full activate-then-revoke lifecycle:

| Overlays | States | Replay Snapshots | Verifications | Cross-Snapshot Checks |
|----------|--------|-----------------|---------------|----------------------|
| 1 | 3 (baseline + activate + revoke) | 3 | 3 | 1 (T0=T2) |
| 2 | 5 | 5 | 5 | 2 |
| 3 | 7 | 7 | 7 | 3 (proven) |
| 5 | 11 | 11 | 11 | 5 |
| 7 | 15 | 15 | 15 | 7 |
| 10 | 21 | 21 | 21 | 10 |

### 3.2 Chain Depth Formula

```
total_states = 2N + 1
  where N = overlay count
  (1 baseline + N activations + N revocations)

replay_verifications = 2N + 1
cross_snapshot_checks = N (each revocation matches a prior activation state)
```

### 3.3 With Version Upgrades (Additional Complexity)

If overlays have version upgrades within a lifecycle:

```
total_states = 2N + V + 1
  where V = total version upgrade count across all packages

Each version upgrade adds 1 additional state and 1 replay verification.
```

---

## 4. Replay Pressure Dimensions

### 4.1 Verification Time Pressure

Each replay verification requires:
1. Load 6 inputs (hash verify each)
2. Apply overlays in deterministic order
3. Compute composite state
4. Compute sha256 of composite
5. Compare to stored snapshot

| Overlays | Entries (est.) | Verification Computation | Cumulative (full chain) |
|----------|---------------|-------------------------|------------------------|
| 3 | 3 | O(3) per verification | O(21) for 7 verifications |
| 5 | 10 | O(10) per verification | O(110) for 11 verifications |
| 7 | 21 | O(21) per verification | O(315) for 15 verifications |
| 10 | 50 | O(50) per verification | O(1050) for 21 verifications |

**Replay verification computation grows as O(N * E * (2N+1))** where
N = overlays, E = average entries per overlay. This is approximately
cubic in overlay count when entries scale with overlays.

### 4.2 Reconstruction Input Complexity

The overlay package set (I-3) grows linearly, but its hash computation
depends on the content of ALL activated packages at each state:

| State | Active Packages | Package Set Hash Inputs |
|-------|----------------|------------------------|
| T0 | 0 | Empty set |
| T1 | 1 | [SEP-001] |
| T2 | 2 | [SEP-001, SEP-002] |
| T3 | 3 | [SEP-001, SEP-002, SEP-003] |
| ... | ... | ... |
| TN | N | [SEP-001 through SEP-N] |

The hash computation for input I-3 at state TN includes content
from all N packages — O(N*E) data to hash.

### 4.3 Snapshot Storage Pressure

Each replay snapshot stores:
- 6 input hashes
- Composite hash
- Composite summary (S-state, Q-class, backed_count, overlay_count)
- Verification result
- Cross-snapshot references (for revocation states)

| Overlays | Snapshots | Estimated Storage | Growth |
|----------|-----------|-------------------|--------|
| 3 | 7 | ~7 KB | Baseline |
| 5 | 11 | ~11 KB | Linear |
| 7 | 15 | ~15 KB | Linear |
| 10 | 21 | ~21 KB | Linear |

Storage is NOT a pressure concern. Storage grows linearly.

---

## 5. Replay Clarity Degradation

### 5.1 Operator Comprehension Thresholds

An operator reviewing a replay chain must understand:
- The full sequence of states
- What changed at each state
- Why each verification produced MATCH
- The cross-snapshot relationships (revocation matches)

| Chain Length | Operator Comprehension | Assessment |
|-------------|----------------------|------------|
| 3 states | Trivially comprehensible | SAFE |
| 7 states | Fully comprehensible (proven) | SAFE |
| 11 states | Comprehensible with effort | PRESSURE |
| 15 states | Requires summary tooling | PRESSURE |
| 21 states | Impractical without tooling | RISK |

### 5.2 Cross-Snapshot Verification Clarity

Cross-snapshot verification proves independent removability:
"Revoking overlay X returns state to the same state as before
overlay X was activated."

| Cross Checks | Clarity | Assessment |
|-------------|---------|------------|
| 1–3 | Each check individually reviewable | SAFE |
| 4–5 | Reviewable but requires concentration | PRESSURE |
| 6–7 | Pattern verification (operator trusts structure) | PRESSURE |
| 8–10 | Requires automated summary | RISK |

---

## 6. Replay Pressure Thresholds

### 6.1 Determinism Threshold

Replay determinism is **never at risk** under overlay scaling alone.
The 6-input model with hash verification ensures deterministic
reconstruction regardless of chain depth. Determinism is a structural
property, not a scaling property.

**Replay determinism degrades ONLY under:**
- Framework version changes (I-5 mutation between verifications)
- Substrate changes (I-1 mutation — baseline drift)
- Concurrent sandbox operations (serialization violation)
- Implementation bugs (not architectural)

### 6.2 Clarity Threshold

| Dimension | SAFE | PRESSURE | RISK |
|-----------|------|----------|------|
| Chain depth (states) | ≤ 11 | 12–15 | > 15 |
| Verifications per lifecycle | ≤ 11 | 12–15 | > 15 |
| Cross-snapshot checks | ≤ 5 | 6–7 | > 7 |
| Intermediate states per activation | 1 | 2–3 (with deps) | > 3 |

### 6.3 Integrity Threshold

| Dimension | SAFE | PRESSURE | RISK |
|-----------|------|----------|------|
| Computation per verification | O(50) entries | O(100) | O(200) |
| Cumulative computation | O(550) | O(1500) | O(4000+) |
| Input hash verifications | ≤ 66 (11x6) | 67–90 | > 90 |

---

## 7. Dependency-Driven Replay Complexity

### 7.1 Without Dependencies (Current Proven Model)

Each activation produces exactly 1 intermediate state.
Replay chain is linear and predictable.

### 7.2 With Dependencies (Untested)

When overlay B depends on overlay A:
- Activating B requires verifying A is ACTIVATED
- Revoking A requires first revoking B (cascade)
- Replay at any state must resolve dependency ordering

This introduces **dependency-aware replay ordering**:

```
Without deps: Apply in package_id order (simple, deterministic)
With deps:    Apply in topological dependency order
              If circular dependency: HALT (undefined behavior)
```

| Dependency Depth | Additional States | Replay Complexity | Assessment |
|-----------------|-------------------|-------------------|------------|
| 0 | 0 | Linear | SAFE (proven) |
| 1 | 0 (but ordering constrained) | Linear + ordering check | SAFE |
| 2 | 0–1 (cascade intermediates) | Linear + cascade verification | PRESSURE |
| 3+ | 1+ per cascade level | Non-linear cascade expansion | RISK |

---

## 8. Replay Failure Scenarios Under Pressure

| Scenario | Detection | Severity | Recovery |
|----------|-----------|----------|----------|
| Divergence at high chain depth | Hash mismatch at snapshot N | CRITICAL | Freeze sandbox, investigate |
| Input integrity failure at depth | Hash mismatch on input I-3 | CRITICAL | Identify changed package |
| Cross-snapshot mismatch (revocation) | Revoked state ≠ prior matching state | CRITICAL | Governance escalation |
| Framework version drift | I-5 hash differs between verifications | HIGH | Lock framework version |
| Computation timeout at depth | Verification exceeds time limit | MEDIUM | Optimize or reduce chain |

---

## 9. Governance

- Replay determinism is structurally guaranteed and does not degrade under scaling
- Replay CLARITY degrades at chain depth > 15 (operator comprehension limit)
- Replay computation grows approximately cubically with overlay count
- Dependency-driven replay adds ordering complexity but not determinism risk
- Storage is NOT a pressure concern (linear growth)
- The 6-input hash-verified model is resilient to all tested pressure scenarios
