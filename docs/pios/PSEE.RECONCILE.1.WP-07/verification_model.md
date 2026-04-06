# Verification Authority Model

**Document:** verification_model.md
**Stream ID:** PSEE.RECONCILE.1.WP-07
**Status:** CANONICAL
**Layer:** PSEE → PiOS Verification Authority

---

## 1. Purpose

This document defines the canonical verification authority model for the PSEE to PiOS handoff.

Verification is the act of producing an honest account of what is known, what is partially known, and what is unknown about a handoff package — so that a PiOS consumer can make a governed intake decision under any degree of evidence completeness.

Verification does not mean "everything was checked." Verification means "exactly what was checked is stated, and nothing is claimed beyond what was checked."

The model defines:
- the outcome states that verification may produce
- the five domains that verification must evaluate
- the decision logic that maps domain results to outcomes
- the structure that a verification statement (verification.log) must follow
- the consumption permissions that PiOS derives from each outcome
- the conditions under which partial knowledge remains admissible

---

## 2. Governing Principle

**Incompleteness is allowed. Misrepresentation is forbidden.**

A verifier that cannot check a domain MUST declare that domain unverified. A verifier that declares a domain verified when it was not is in violation of this model regardless of outcome.

Incomplete verification produces a bounded outcome (PASS_PARTIAL). Deceptive verification — claiming scope that was not exercised — produces a structural failure (FAIL_STRUCTURAL).

This principle is not advisory. It is the foundation from which all outcome rules derive.

---

## 3. Verification Outcome Model

Verification MUST produce exactly one of the following outcomes. No other outcome is permitted.

| Outcome | Short definition |
|---|---|
| PASS_FULL | All five domains verified and passed with no blocking contradictions |
| PASS_PARTIAL | Verification completed with incomplete domain coverage and no deception; no blocking contradiction in verified scope |
| FAIL_STRUCTURAL | One or more blocking conditions present; package is structurally inadmissible or verification is deceptive |

PASS_FULL and PASS_PARTIAL are both admissible outcomes. FAIL_STRUCTURAL is not admissible.

---

## 4. Semantic Definitions

### 4.1 PASS_FULL

**Meaning:** All five verification domains were evaluated, all evaluation criteria were met, and no blocking contradiction was detected in any domain.

**Consumption permission:** PiOS MAY consume the handoff package as authoritative. All artifact values, DIM states, score components, and traceability claims may be treated as fully verified.

**Boundary conditions:**
- All five domains must report verified PASS.
- No domain may be declared Unverified or Inferred.
- No blocking contradiction may be present in any domain.
- The verification statement must carry no Unverified Scope or Inferred Scope entries.
- If any domain cannot be evaluated, outcome degrades to PASS_PARTIAL.
- If any blocking contradiction is detected, outcome degrades to FAIL_STRUCTURAL.

---

### 4.2 PASS_PARTIAL

**Meaning:** Verification was completed with incomplete domain coverage. Some domains were evaluated and passed; others were not evaluated and are declared unverified or inferred. No blocking contradiction was detected in the verified scope. No domain was declared verified when it was not.

**Consumption permission:** PiOS MAY consume the handoff package as bounded intelligence. Verified artifact values and domain states may be treated as authoritative within their stated scope. Unverified values and domain states must be treated as unconfirmed by verification — they may still be present in the package and traceable to PSEE, but verification did not confirm them.

**Boundary conditions:**
- At least one domain must be verified and have passed.
- At least one domain must be declared Unverified or Inferred.
- No blocking contradiction may be present in the verified scope.
- Contradictions in the Unverified Scope may be recorded but do not trigger FAIL_STRUCTURAL unless they are provably structural.
- PiOS MUST NOT upgrade PASS_PARTIAL to PASS_FULL based on the contents of the package.
- PiOS MUST NOT treat the unverified scope as if it were verified.
- PiOS MUST carry the uncertainty of PASS_PARTIAL forward into any downstream output that depends on the unverified scope.

---

### 4.3 FAIL_STRUCTURAL

**Meaning:** The package contains a blocking condition that prevents admissible consumption, or the verification itself is deceptive.

**Consumption permission:** PiOS MUST NOT consume the handoff package. Consumption on the basis of a FAIL_STRUCTURAL outcome constitutes a boundary violation regardless of the apparent content of the package.

**Boundary conditions:**
- Any blocking contradiction in any domain triggers FAIL_STRUCTURAL.
- Any deceptive authority claim (scope claimed as verified when it was not exercised) triggers FAIL_STRUCTURAL regardless of whether the actual content would have passed.
- A missing mandatory artifact triggers FAIL_STRUCTURAL.
- A run_id inconsistency across package artifacts triggers FAIL_STRUCTURAL.
- FAIL_STRUCTURAL is permanent for the package in its current state. The same package MUST NOT be re-verified in expectation of a different outcome.

---

## 5. Verification Domains

Verification MUST evaluate five domains. For each domain, the verifier MUST report one of: **VERIFIED_PASS**, **VERIFIED_FAIL**, **UNVERIFIED**, or **INFERRED**.

**VERIFIED_PASS:** The domain was actively evaluated and all criteria were met.
**VERIFIED_FAIL:** The domain was actively evaluated and one or more criteria were not met. Produces FAIL_STRUCTURAL.
**UNVERIFIED:** The domain was not evaluated. The verifier makes no claim about this domain. Contributes to PASS_PARTIAL.
**INFERRED:** The domain state was inferred from indirect evidence without active evaluation. Contributes to PASS_PARTIAL. Inferred states MUST be explicitly labelled; they may not be presented as directly verified.

---

### Domain 1 — Artifact Completeness

**Definition:** All artifacts required by the handoff contract are present, belong to the same run_id, and are in a non-null state.

**Evaluation criteria:**
- All required handoff artifacts are present in the package
- All artifacts share a consistent run_id
- No required mandatory field is null where a non-null value is required

**Possible domain states:** VERIFIED_PASS / VERIFIED_FAIL / UNVERIFIED / INFERRED

**Impact on final outcome:**
- VERIFIED_PASS: required contribution to PASS_FULL; does not block PASS_PARTIAL
- VERIFIED_FAIL: triggers FAIL_STRUCTURAL (missing artifacts or run_id inconsistency are blocking)
- UNVERIFIED: outcome degrades to PASS_PARTIAL
- INFERRED: outcome degrades to PASS_PARTIAL; inference basis must be stated

---

### Domain 2 — State Admissibility

**Definition:** The execution state values recorded in the handoff package are within the governed state space and are mutually consistent.

**Evaluation criteria:**
- `execution_status` is in the defined lifecycle phase set
- `psee_engine_invoked` is `true`
- `coverage_state.json.state` is in {COMPUTED}
- `reconstruction_state.json.state` is in {PASS, PARTIAL, FAIL}
- `confidence.status` is COMPUTED
- No governed state field contains a value outside its defined enumeration

**Possible domain states:** VERIFIED_PASS / VERIFIED_FAIL / UNVERIFIED / INFERRED

**Impact on final outcome:**
- VERIFIED_PASS: required contribution to PASS_FULL; does not block PASS_PARTIAL
- VERIFIED_FAIL: triggers FAIL_STRUCTURAL (invalid lifecycle state is blocking)
- UNVERIFIED: outcome degrades to PASS_PARTIAL
- INFERRED: outcome degrades to PASS_PARTIAL; inference basis must be stated

---

### Domain 3 — Traceability Integrity

**Definition:** Every score component, DIM state, projection value, and confidence band in the handoff package is traceable to an explicit governance document and section.

**Evaluation criteria:**
- Each score component `_basis` field is present and references a named governance document
- `traceability.authority_refs` references all governing documents used
- `traceability.source_files` lists all input artifacts used in score production
- `projection.rule` references a defined PR-rule
- `coverage_state.json.authority` and `reconstruction_state.json.authority` reference PSEE-GAUGE.0 documents
- No traceability field is absent, null, or empty

**Possible domain states:** VERIFIED_PASS / VERIFIED_FAIL / UNVERIFIED / INFERRED

**Impact on final outcome:**
- VERIFIED_PASS: required contribution to PASS_FULL; does not block PASS_PARTIAL
- VERIFIED_FAIL: triggers FAIL_STRUCTURAL
- UNVERIFIED: outcome degrades to PASS_PARTIAL
- INFERRED: outcome degrades to PASS_PARTIAL

---

### Domain 4 — Cross-Artifact Consistency

**Definition:** The values that appear in multiple artifacts within the handoff package are consistent with one another and do not contradict.

**Evaluation criteria:**
- `engine_state.json.execution_status` matches the rendering state recorded in `gauge_view.json`
- `gauge_state.json.score.canonical` is consistent with the score display in `gauge_view.json`
- `gauge_state.json` DIM-01 state is consistent with `coverage_state.json.state`
- `gauge_state.json` DIM-02 state is consistent with `reconstruction_state.json.state`
- `run_id` is consistent across all evaluated artifacts
- `schema_version` is consistent between `gauge_state.json` and `gauge_view.json` where both declare a version

**Possible domain states:** VERIFIED_PASS / VERIFIED_FAIL / UNVERIFIED / INFERRED

**Impact on final outcome:**
- VERIFIED_PASS: required contribution to PASS_FULL; does not block PASS_PARTIAL
- VERIFIED_FAIL: triggers FAIL_STRUCTURAL (cross-artifact contradiction is blocking)
- UNVERIFIED: outcome degrades to PASS_PARTIAL
- INFERRED: outcome degrades to PASS_PARTIAL

---

### Domain 5 — Authority Honesty

**Definition:** The verification statement itself is honest about the scope it exercised. Every claim of verification corresponds to an active evaluation. No domain is declared verified when it was not evaluated.

**Evaluation criteria:**
- Every domain declared VERIFIED_PASS or VERIFIED_FAIL was actively evaluated
- No domain declared VERIFIED_PASS was skipped, assumed, or inferred without active evaluation
- Every Unverified Scope entry correctly identifies domains not evaluated
- No active contradiction exists between the Verified Scope and Inferred Scope declarations
- The verification.log Blocking Contradictions field accurately records all detected failures

**Possible domain states:** VERIFIED_PASS / VERIFIED_FAIL

**Authority Honesty may not be UNVERIFIED.** A verifier that does not know whether its own scope is accurate has not produced a valid verification statement.

**Impact on final outcome:**
- **VERIFIED_PASS:** no impact; verification statement is honest
- **VERIFIED_FAIL: triggers FAIL_STRUCTURAL unconditionally.** A verification statement that misrepresents its own scope is a deceptive authority claim. Deceptive authority overrides all other domain results. A package backed by deceptive verification is structurally inadmissible regardless of the content of the other four domains.

**Authority Honesty is dominant.** An honest PASS_PARTIAL with three unverified domains is preferable to a dishonest PASS_FULL that conceals them.

---

## 6. Decision Logic

The following rules determine the final outcome from domain states. Rules are applied in order. The first matching rule governs.

---

**Rule V-01 — Deceptive Authority (FAIL_STRUCTURAL)**

If Domain 5 (Authority Honesty) is VERIFIED_FAIL, the outcome is FAIL_STRUCTURAL.

This rule is unconditional. The state of all other domains is irrelevant. A verification statement that misrepresents its scope cannot produce any admissible outcome.

---

**Rule V-02 — Structural Blocking Failure (FAIL_STRUCTURAL)**

If any of the following conditions is true, the outcome is FAIL_STRUCTURAL:

- Domain 1 (Artifact Completeness) is VERIFIED_FAIL
- Domain 2 (State Admissibility) is VERIFIED_FAIL
- Domain 3 (Traceability Integrity) is VERIFIED_FAIL
- Domain 4 (Cross-Artifact Consistency) is VERIFIED_FAIL
- A mandatory artifact is absent from the package (triggers before domain evaluation)
- run_id is inconsistent across package artifacts (triggers before domain evaluation)

A VERIFIED_FAIL in any domain (other than Domain 5, which is covered by V-01) means the package has a confirmed defect in that domain. Confirmed defects are blocking.

---

**Rule V-03 — Full Verification Pass (PASS_FULL)**

If all five domains are VERIFIED_PASS and no blocking contradiction exists in any domain, the outcome is PASS_FULL.

This rule requires active evaluation of all five domains. If any domain is UNVERIFIED or INFERRED, this rule cannot apply.

---

**Rule V-04 — Partial Verification Pass (PASS_PARTIAL)**

If Rules V-01 and V-02 do not apply, and at least one domain is UNVERIFIED or INFERRED, the outcome is PASS_PARTIAL.

Incompleteness alone does not trigger FAIL_STRUCTURAL. A verifier that honestly declares its scope — verified and unverified — produces a valid PASS_PARTIAL.

PASS_PARTIAL requires:
- Domain 5 is VERIFIED_PASS (Authority Honesty confirmed)
- No domain that was actively evaluated returned VERIFIED_FAIL
- At least one domain is UNVERIFIED or INFERRED

---

**Rule V-05 — No Other Outcomes**

No outcome other than PASS_FULL, PASS_PARTIAL, or FAIL_STRUCTURAL is valid. Outcomes such as "INCONCLUSIVE", "UNKNOWN", "PENDING", or "PARTIAL_PASS" are not part of this model and must not be produced.

---

## 7. Verification Statement Structure

The `verification.log` artifact is redefined as a structured authority statement. It MUST contain the following fields. A `verification.log` that omits any field is incomplete and the outcome it declares is not authoritative.

---

**Field: Outcome**
One of: PASS_FULL / PASS_PARTIAL / FAIL_STRUCTURAL
No other value is permitted.

---

**Field: Verified Scope**
An enumeration of every domain evaluated by this verification, each with its domain state (VERIFIED_PASS or VERIFIED_FAIL), and the specific artifacts and fields examined. Domains listed here must have been actively evaluated.

---

**Field: Unverified Scope**
An enumeration of every domain NOT evaluated by this verification. For each unverified domain, the entry must state the domain name and the reason it was not evaluated. If all five domains were evaluated, this field must be explicitly empty with the statement "None — all domains evaluated."

**Prohibition:** This field MUST NOT be omitted. A `verification.log` that has no Unverified Scope declaration is not a valid verification statement under this model.

---

**Field: Inferred Scope**
An enumeration of any domain states that were inferred rather than directly evaluated, with the inference basis. If no inferences were made, this field must be explicitly empty with the statement "None — no inferences."

---

**Field: Blocking Contradictions**
An enumeration of all blocking conditions detected during evaluation, with the artifact, field, and specific contradiction. If no blocking conditions were detected, this field must contain "None detected in evaluated scope."

---

**Field: Consumption Permission**
Exactly one of:
- "CONSUME AS AUTHORITATIVE" — valid only when Outcome is PASS_FULL
- "CONSUME AS BOUNDED INTELLIGENCE — unverified scope not confirmed" — valid only when Outcome is PASS_PARTIAL
- "DO NOT CONSUME — structural failure" — valid only when Outcome is FAIL_STRUCTURAL

Consumption Permission must match Outcome. A mismatch is a deceptive authority claim (Domain 5 VERIFIED_FAIL → FAIL_STRUCTURAL under Rule V-01).

---

**Field: Evidence Basis**
A statement of what was evaluated to produce each domain state in the Verified Scope: which files were read, which fields were checked, and what values were observed.

---

**Prohibition on binary-only certification**

A `verification.log` that contains only a binary result (e.g., "VERIFICATION_COMPLETE", "PASS: N FAIL: 0", or equivalent) without Verified Scope, Unverified Scope, and Consumption Permission fields does not conform to this model. Binary-only certification is prohibited because it conceals the scope boundary and prevents PiOS from making a governed consumption decision.

---

## 8. PiOS Consumption Semantics

PiOS MUST derive its consumption behavior from the Outcome field of the `verification.log` exactly as specified below. No other interpretation is permitted.

---

**PASS_FULL → Consume as authoritative**

PiOS MAY treat all artifact values, DIM states, score components, and traceability references as fully verified. PiOS MAY use these values in downstream processing without qualification.

---

**PASS_PARTIAL → Consume as bounded intelligence**

PiOS MAY use verified artifact values and domain states as authoritative within the Verified Scope declared in the verification.log. PiOS MUST NOT treat unverified values as verified. PiOS MUST NOT upgrade a PASS_PARTIAL to PASS_FULL based on the apparent completeness of the package content. PiOS MUST carry the uncertainty of the Unverified Scope into any downstream output that depends on fields from that scope. Uncertainty must be propagated, not suppressed.

---

**FAIL_STRUCTURAL → Reject**

PiOS MUST NOT consume the handoff package. PiOS MUST NOT perform partial intake of a FAIL_STRUCTURAL package. PiOS MUST NOT override or negotiate the FAIL_STRUCTURAL outcome. The correct action is to log the rejection and return the package to PSEE.

---

**Upgrade prohibition**

PiOS MUST NOT upgrade a PASS_PARTIAL outcome to PASS_FULL on any basis — including visual inspection of the package, prior run history, operator instruction, or apparent completeness of the artifact set. Only a re-verification that produces a fresh PASS_FULL outcome authorizes full consumption.

---

**Uncertainty propagation requirement**

PiOS MUST NOT hide uncertainty downstream. If PiOS produces any output derived from fields in the Unverified Scope of a PASS_PARTIAL package, that output MUST be labelled as derived from unverified evidence. Silent propagation of unverified values as if they were verified is a boundary violation.

---

## 9. Admissibility Under Uncertainty

Real-world handoff packages will frequently be partially verifiable. Verification tools may cover some artifact domains and not others. Evidence may be available for some fields and absent for others. This is expected.

The model formalizes how partial packages remain usable without sacrificing truthfulness:

**Partial packages are admissible when:**
1. The verification statement is honest about its scope
2. No blocking contradiction was detected in the verified scope
3. The Unverified Scope is explicitly declared
4. The Consumption Permission reflects the actual outcome (PASS_PARTIAL, not PASS_FULL)
5. PiOS propagates uncertainty from the Unverified Scope forward

**Partial packages are not admissible when:**
- The verification statement claims scope it did not exercise (deceptive authority)
- A blocking contradiction exists in the verified scope
- A mandatory artifact is absent
- The verification.log declares PASS_FULL when domains were unverified

**The purpose of this admissibility model is not to lower the standard. It is to prevent false certification from concealing real gaps.** A PASS_PARTIAL with an explicit Unverified Scope is more useful and more trustworthy than a binary PASS that hides what was not checked.

---

## 10. Canonical Constraints

This document is self-contained. It does not depend on prior workpackage content to be operative.

The following constraints apply to this document and to any artifact that claims conformance with it:

1. **Normative language is binding.** "MUST", "MUST NOT", "MAY" carry their exact meanings as used throughout this document.

2. **Outcome states are closed.** No outcome state may be added, merged, or renamed. PASS_FULL, PASS_PARTIAL, and FAIL_STRUCTURAL are the complete and exhaustive set.

3. **Domain set is closed.** The five verification domains are the complete and exhaustive set. No domain may be added, removed, renamed, or merged.

4. **Authority Honesty is unconditionally dominant.** No rule, override, flag, or governance instruction may demote or bypass Domain 5.

5. **Binary certification is permanently prohibited.** No `verification.log` that omits Verified Scope, Unverified Scope, and Consumption Permission fields satisfies this model, regardless of the pass/fail count it reports.

6. **This model does not prescribe implementation.** It defines what a conforming verification statement must contain and what outcomes are valid. How verification is performed is outside the scope of this document.

7. **This model does not alter WP-02 handoff contract structure, WP-04 gate logic, or any WP-05 violation classification.** It operates as a supplementary authority model for the verification.log artifact within the existing boundary framework.
