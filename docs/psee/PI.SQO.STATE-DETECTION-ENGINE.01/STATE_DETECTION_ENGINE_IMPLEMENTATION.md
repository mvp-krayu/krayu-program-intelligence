# State Detection Engine Implementation

**Stream:** PI.SQO.STATE-DETECTION-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Overview

The SQO State Detection Engine is the first operational SQO primitive. It implements deterministic S-state detection for all registered client/run combinations, transforming the architecture doctrine (PI.SEMANTIC-QUALIFICATION-LOOP.ROADMAP-AND-ARCHITECTURE.01) into executable infrastructure.

---

## 2. Module architecture

Four modules under `app/execlens-demo/lib/lens-v2/sqo/`:

### QualificationStateEngine.js

Core detection engine. Exports:

- `detectQualificationState({ client, run, manifest, loadResult, payload })` — pure deterministic function implementing the S-state detection algorithm
- `classifyAuthorizationFromSState(sState)` — maps S-state to authorization tier/boardroom readiness/projection permission
- `normalizeQualificationState(detection)` — combines detection result with authorization mapping and governance disclosures
- `runFullDetection(client, runId)` — end-to-end detection that loads manifest, loads artifacts, resolves payload, and detects state

**Detection algorithm:**
1. No manifest or no `semantic_topology_model` declared → S0
2. Required artifacts missing (loader fails) → S1
3. Payload resolver returns not-ok → S1
4. Q-01 → S3
5. Q-02 or Q-03 → S2
6. Q-04 → S1
7. Unknown condition → S1 (fail-closed)

**No client-name branching.** The engine consumes the manifest registry and existing resolver without any client-specific logic.

### QualificationStateArtifact.js

Artifact builder and emitter. Exports:

- `buildQualificationStateArtifact(detectionResult)` — constructs the `qualification_state.v1.json` artifact with schema, evidence, governance, and provenance blocks
- `emitQualificationState(detectionResult)` — writes the artifact to `artifacts/sqo/<client>/<run_id>/`
- `computeHash(data)` — sha256 hash of JSON-serialized data
- `getSourceCommit()` — reads current git commit from `.git/HEAD`

### QualificationHistory.js

Append-only history mechanism. Exports:

- `classifyTransition(priorState, currentState)` — classifies as INITIAL, FORWARD, DOWNGRADE, or STABLE
- `emitQualificationHistory(detectionResult)` — loads existing history (if any), appends new entry, writes to `qualification_history.v1.json`

History entries are never overwritten. Each emission appends a new entry with timestamp, state, transition type, cause, evidence snapshot, and provenance.

### ReplayVerifier.js

Replay verification. Exports:

- `runReplayVerification(client, runId, artifact)` — runs all three verification checks
- `verifyInputHashes(artifact, currentDetection)` — verifies input artifact presence matches stored hashes
- `verifyDeterministicRecomputation(artifact, currentDetection)` — verifies same S-state produced on re-run
- `verifyOutputHash(artifact)` — verifies artifact self-hash integrity

---

## 3. Data flow

```
Manifest Registry (read-only)
    │
    ▼
loadManifest(client, runId) → manifest
    │
    ▼
loadArtifacts(manifest) → loadResult
    │
    ▼
resolveSemanticPayload(manifest) → payload (if loadResult.ok)
    │
    ▼
detectQualificationState({...}) → { s_state, state_label, state_reason }
    │
    ▼
normalizeQualificationState(detection) → + authorization + governance
    │
    ▼
buildQualificationStateArtifact(result) → qualification_state.v1.json
emitQualificationHistory(result) → qualification_history.v1.json
runReplayVerification(client, run, artifact) → replay_verification.v1.json
```

**Read-only inputs:** manifest registry, Lane A artifacts, Lane D artifacts, semantic pipeline artifacts. **Write-only outputs:** `artifacts/sqo/<client>/<run_id>/`.

---

## 4. Governance compliance

| Rule | Status |
|------|--------|
| No Lane A mutation | PASS — reads only |
| No Lane D mutation | PASS — reads only |
| No PATH B resolver modification | PASS — consumes resolver output, never modifies |
| No Q-class resolution modification | PASS — reads Q-class, never overrides |
| No runtime rendering changes | PASS — no page/API modifications |
| No pipeline rerun | PASS — reads existing artifacts |
| No semantic fabrication | PASS — all assertions evidence-derived |
| No client-name branching | PASS — verified by test (no 'blueedge'/'fastapi' strings in SQO modules) |
| Deterministic and replay-safe | PASS — verified by replay verification |
| Writes only to SQO namespace | PASS — all writes under `artifacts/sqo/` |
