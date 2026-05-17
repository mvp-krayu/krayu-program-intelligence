# Anti-Rediscovery Discipline

> **Rules preventing wasteful re-excavation of already-canonicalized operational knowledge.**

---

## 1. The Rediscovery Problem

Rediscovery occurs when a session spends context window investigating something that the vault already contains (or should contain). Every rediscovery cycle costs:

- Full context window for forensic investigation
- Risk of producing slightly different conclusions than the original discovery
- Opportunity cost (the session could have been building, not rediscovering)
- Risk of NOT reaching the same depth as the original investigation

The crosswalk/reconciliation gap is the canonical example: ReconciliationCorrespondenceCompiler was implemented, but the vault page said "NOT IMPLEMENTED." Future sessions loaded the stale vault page and rediscovered the compiler's existence — each time consuming a full context window.

## 2. The Anti-Rediscovery Protocol

| Step | Action | When |
|---|---|---|
| 1 | **G1 stream closures propagate to vault** | Every G1 closure (CLAUDE.md §16.4 — mandatory) |
| 2 | **Recovery stream findings propagate to vault** | Every recovery stream closure must include a "vault propagation" section |
| 3 | **Stale vault pages are fixed when detected** | Not deferred — staleness compounds |
| 4 | **Master operational document is maintained** | OPERATIONAL_ONTOLOGY.md is the first-load reference for operational understanding |
| 5 | **New capabilities are documented in vault when implemented** | Not when rediscovered — when implemented |
| 6 | **Vault pages carry "last verified" metadata** | Enables staleness detection via GIT_LINEAGE sections |

## 3. The Pre-Investigation Test

**Before starting bottom-up forensics, ask:**

> "Does a vault page, stream artifact, or governance document already answer this question?"

If YES → load it. If the answer is stale or insufficient, fix the vault page — do not produce a parallel recovery document.

If NO → perform forensics, then WRITE the answer into a vault page so the next session doesn't repeat the work.

## 4. When Bottom-Up Forensics IS Allowed

| Condition | Why Allowed |
|---|---|
| Initial client onboarding | No existing ontology to trace top-down from |
| Bug investigation | Runtime diverges from expected — bottom-up trace is correct diagnostic |
| New capability implementation | Understanding current code is necessary for building |
| Vault page creation for undocumented capability | Vault page is the OUTPUT of forensics, not the INPUT |
| Explicit contract authorization | Stream contract explicitly says "investigate X through artifact forensics" |

## 5. When Bottom-Up Forensics is NOT Allowed

| Condition | Why Not Allowed | What Instead |
|---|---|---|
| Understanding the operational ontology | Canonicalized in OPERATIONAL_ONTOLOGY.md | Load the vault page |
| Determining whether a capability exists | Vault records what exists | Check vault; if stale, update vault |
| Rediscovering architectural decisions | Recorded in stream closures and vault pages | Load the relevant closure or vault page |
| Understanding dual-path ontology | Canonicalized in OPERATIONAL_ONTOLOGY.md and CROSSWALK_AND_RECONCILIATION.md | Load the vault pages |

## 6. The Rediscovery Detection Test

If a session spends more than 30 minutes discovering something that should have been in vault, that is a rediscovery event. Response:

1. Complete the discovery (can't stop mid-investigation)
2. Write the finding into vault (fix the gap)
3. Record the rediscovery event in the stream's execution report
4. Assess why the vault was insufficient (staleness? missing page? missing concept?)
5. Fix the root cause

## 7. Stream Artifact vs Vault Cognition

**Stream artifacts** (in `docs/pios/<stream-id>/`) are evidence of what was discovered. They are NOT operational cognition.

**Vault pages** (in `docs/pios/vault/`) are live operational cognition. They are what sessions load to understand the system.

If a stream produces architectural understanding that the vault needs, that understanding MUST be extracted into vault pages. Otherwise, the vault remains ignorant and future streams rediscover the same things.

**The anti-hoarding rule:** Recovery stream findings that are not propagated to vault are wasted work.

## Cross-References

- [[../00_START_HERE/OPERATIONAL_ONTOLOGY]] — master operational document (anti-rediscovery reference)
- [[ONTOLOGY_DRIFT_DETECTION]] — detecting when vault diverges from runtime
- [[STREAM_CLOSURE_PROPAGATION]] — how stream findings reach vault
- [[VAULT_MUTATION_RULES]] — rules for vault updates

## GIT_LINEAGE

| Field | Value |
|---|---|
| Created by | PI.VAULT.OPERATIONAL-ONTOLOGY-CANONICALIZATION.01 |
| Creation commit | PENDING (this stream) |
| Derived from | PI.CANONICALIZATION.END-TO-END-LOCK.01 (FUTURE_GOVERNANCE_DISCIPLINE.md §4 — anti-rediscovery discipline) |
| Last verified | 2026-05-17 |
