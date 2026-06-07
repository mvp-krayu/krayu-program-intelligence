# PiOS Discovery Governance Doctrine

**Status:** CONSTITUTIONAL — LOCKED  
**Authority:** PIOS.DISCOVERY-GOVERNANCE-DOCTRINE.01  
**Effective:** 2026-06-07  

This doctrine defines how Program Intelligence identifies, qualifies, records, matures, and propagates constitutional discoveries. It removes dependency on the operator to manually declare "this is a discovery."

---

## 1. Definition

A constitutional discovery is a finding that changes how Program Intelligence is allowed to think, qualify, project, suppress, explain, govern, or consume intelligence.

Constitutional discoveries are not design decisions. Design decisions can be reversed. Constitutional discoveries become part of the intellectual property and operating model of Program Intelligence. They bind all future implementation.

---

## 2. Discovery Candidate Triggers

A finding becomes a discovery candidate when it affects one or more of:

- State model (S-axis: qualification progression)
- Evidence capability model (E-axis: what intelligence exists)
- Projection authority model (P-axis: what PiOS is allowed to say)
- Evidence lineage (how evidence proves authority claims)
- Topology doctrine (constitutional projection substrate)
- Measurement model (constitutional objects underlying conditions)
- Condition taxonomy (which conditions are measurements vs interpretive projections)
- Consequence formation (how conditions become consequences)
- Persona contracts (depth gating, audience calibration, isolation rules)
- Consumer contracts (LENS, THORR, EIR consumption boundaries)
- Qualification gates (SQO state transitions, authority ceilings)
- Violation rules (projection violation detection, suppression governance)
- PiOS operating semantics (kernel behavior, authority computation)
- Vault doctrine (AMOps lifecycle, terminology locks, canonical state)

A single trigger is sufficient. Multiple triggers strengthen the candidate.

---

## 3. Non-Discovery Exclusions

The following are explicitly excluded from discovery candidacy unless they reveal a constitutional contradiction:

- Local bug fixes (e.g., case-sensitive string matching)
- UI wording changes (e.g., label text adjustments)
- Implementation refactors (e.g., extracting helper functions)
- One-specimen observations not validated on a second specimen or architectural principle
- Temporary workarounds (e.g., backfill bridges)
- Performance improvements
- Consumer-specific rendering adjustments (e.g., CSS, layout)
- Test additions that validate existing doctrine without revealing new doctrine

**Exception:** If a bug fix, refactor, or workaround reveals that the underlying model is constitutionally inconsistent, the inconsistency is a discovery candidate even though the fix is not.

Example: Fixing "0 domains" in a fragility query (bug fix, not a discovery) revealed that conditions make operational claims from structural evidence (constitutional discovery → Doctrine B).

---

## 4. Discovery Lifecycle

| Stage | Definition | Gate |
|-------|-----------|------|
| OBSERVED | A surprising or contradictory behavior is detected during implementation, testing, or audit. | Behavior deviates from expectation or doctrine. |
| CANDIDATE | The behavior appears to affect one or more doctrine areas from Section 2. | At least one trigger matches. |
| VALIDATED | The finding is confirmed across multiple evidence sources: second specimen, architectural reasoning, implementation trace, or cross-consumer verification. | Cannot be explained as specimen-specific, implementation-specific, or transient. |
| PROVEN | The finding is implemented in code, tested, and/or documented in a governance artifact. | Implementation exists. Tests pass. Both specimens confirm (where applicable). |
| LOCKED | The finding becomes constitutional doctrine. It binds all future implementation. Reversal requires explicit governance stream. | Documented in a governance artifact (contract, doctrine, or registry). |
| PROPAGATED | The finding is moved into the vault through a G1 stream with full AMOps lifecycle. | G1 stream completed. Vault updated. Canonical state reflects discovery. |

Lifecycle is monotonic within a stream. A discovery does not regress stages within its originating stream. A subsequent stream may challenge and supersede a discovery through its own governance process.

---

## 5. Discovery Record Contract

Each discovery record must include:

| Field | Required | Description |
|-------|----------|-------------|
| discovery_id | YES | Unique identifier (e.g., PCD-001) |
| name | YES | Short constitutional name (e.g., "Topology-First Doctrine") |
| origin_stream | YES | Stream ID that produced the discovery |
| trigger | YES | What behavior or contradiction triggered the investigation |
| observed_contradiction | YES | What was inconsistent, surprising, or doctrinally invalid |
| doctrine_affected | YES | Which doctrine areas from Section 2 are affected |
| discovery_statement | YES | One-paragraph statement of the constitutional finding |
| evidence_basis | YES | How the finding was validated (specimens, tests, architectural trace) |
| affected_components | YES | Which code, contracts, or systems are impacted |
| implementation_impact | YES | What changes in implementation behavior |
| intended_vault_destination | YES | Target path in `docs/pios/vault/constitutional/` |
| maturity_state | YES | Current lifecycle stage from Section 4 |
| propagation_requirements | CONDITIONAL | What G1 stream or governance action is needed for vault propagation (required at LOCKED or above) |

Optional fields:

| Field | Description |
|-------|-------------|
| key_commits | Git commits that implement or document the discovery |
| supersedes | Previous doctrine or discovery that this finding replaces |
| related_discoveries | Cross-references to other discoveries in the registry |

---

## 6. Operator Independence Rule

Claude/PiOS must propose discovery capture when the candidate triggers from Section 2 are met. The operator should not need to say "this is a discovery."

**Procedure:**

1. During or after any stream that modifies governance, architecture, or projection behavior, Claude evaluates whether any finding matches the trigger list in Section 2.
2. If a trigger matches, Claude proposes: "Discovery candidate detected: [brief description]. Trigger: [which doctrine area]. Should this be registered?"
3. The operator confirms, redirects, or declines.
4. If confirmed, Claude creates or updates the registry entry with the full record contract from Section 5.

**Constraint:** Claude must not silently absorb constitutional findings into implementation without proposing registration. Implementation may proceed, but the finding must be surfaced as a candidate.

---

## 7. Discovery Review Rule

At closure of any G1 or constitutional stream, Claude must perform a Discovery Review.

**Review questions:**

1. What findings emerged during this stream?
2. Which are implementation-only (bug fixes, refactors, rendering)?
3. Which are discovery candidates (match Section 2 triggers)?
4. Which existing registry entries need maturity state updates?
5. Which discoveries are now PROVEN and should be marked LOCKED?
6. Which LOCKED discoveries have sufficient maturity for vault propagation?

**Output:** A brief Discovery Review summary appended to the stream's execution or included in terminal output. Not a separate document — a review pass within the stream closure.

**Trigger:** This review is mandatory for G1 streams and any stream that produces or references `PI_STATE_MACHINE_CONTRACT.md`, `ProjectionAuthorityKernel.js`, vault doctrine, or the discovery registry.

---

## 8. Registry / Vault Separation

| | Registry | Vault |
|---|---|---|
| **Location** | `docs/governance/runtime/PIOS_CONSTITUTIONAL_DISCOVERY_REGISTRY.md` | `docs/pios/vault/constitutional/pios/` |
| **Purpose** | Staging area for discovery capture and maturation | Permanent constitutional memory |
| **Mutation authority** | Authorized governance territory (`main` branch) | G1 lifecycle required (`feature/pios-core`) |
| **Lifecycle stages** | OBSERVED through LOCKED | PROPAGATED only |
| **Durability** | Operational — may be restructured | Constitutional — locked once propagated |

**Rule:** A discovery enters the registry as early as OBSERVED. It enters the vault only at PROPAGATED, after a G1 stream exercises the full AMOps lifecycle (branch authorization, canonical state load, terminology check, mutation delta, closure propagation).

**Rule:** The registry is not a temporary note. It is the authoritative staging ground. Discoveries in the registry at LOCKED status have constitutional force even before vault propagation — they bind implementation. Vault propagation adds permanence and cross-session discoverability, not authority.

---

## 9. Doctrine Application

This doctrine is self-hosting. It governs its own creation: this document is discovery PCD-000, originated from the observation that constitutional findings were being lost in conversation context and git commits without formal capture.

All existing entries in `PIOS_CONSTITUTIONAL_DISCOVERY_REGISTRY.md` are governed under this doctrine as of its effective date. Their maturity states are as recorded. Their propagation requirements apply.

Future streams that produce constitutional findings must follow this doctrine. The operator independence rule (Section 6) and discovery review rule (Section 7) are immediately effective.
