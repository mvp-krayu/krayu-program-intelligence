# PiOS Projection Violation Doctrine

**Status:** LOCKED  
**Discovery:** PCD-003  
**Origin:** PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01  
**Propagated:** 2026-06-07  

---

## Doctrine

A projection violation exists whenever PiOS emits intelligence whose authority level exceeds the specimen's proven evidence capability. Projection violations are first-class governance concerns — not UI bugs, not rendering preferences, not error states. They are constitutional breaches of evidence authority.

Intelligence may exist in the evidence layer but be legally unprojectable.

## Violation Classes

The ProjectionAuthorityKernel detects three independent failure classes:

| Class | Meaning | Example |
|---|---|---|
| SPECIMEN_AUTHORITY | The specimen's P-level does not authorize this condition type | P1 specimen projecting P2 condition |
| EVIDENCE_LINEAGE | The condition's evidence does not prove its authority claim | Structural enrichment claiming "execution" authority |
| BOTH | Neither specimen nor evidence authorizes the projection | P1 specimen + structural evidence claiming P3 condition |

## Constitutional Rules

1. Evidence is never deleted by authority validation. Only projection is constrained.
2. Suppressed conditions remain in the evidence layer for audit and future qualification.
3. Violations must be reported as first-class output, not hidden diagnostics.
4. A consumer may surface "Suppressed Intelligence" as a governance feature: "N conditions suppressed. Reason: Projection authority exceeded."

## Evidence-Governed Projection (Doctrine B)

Each condition must independently prove its authority from its own evidence lineage. Specimen-level capability does not automatically authorize conditions.

`evidence_mode` maps to proven authority:

| Evidence Mode | Proven Authority |
|---|---|
| STRUCTURAL_ENRICHMENT_DERIVED | P1 |
| TOPOLOGY_DRIVEN | P1 |
| RUNTIME_EVIDENCE | P2 |
| SIGNAL_DRIVEN | P3 |

**The constitutional test:** Even at P4, structural evidence cannot prove P2 execution claims.

Authorization requires BOTH: specimen authorizes AND lineage proves. Either failing independently produces a typed violation.

## Discovery Lineage

| | |
|---|---|
| **Trigger (PCD-003)** | Audit revealed StackStorm projecting 20 "operational conditions" at S1 structural qualification |
| **Trigger (PCD-004)** | Challenge: "Should authority be granted by specimen capability alone, or should every condition prove its own lineage?" |
| **Observed** | PiOS had no concept of constitutionally invalid projection. All intelligence that existed was projected. |
| **Validation** | StackStorm P2: 12/26 authorized under Doctrine B, 14 EVIDENCE_LINEAGE violations. BlueEdge P4: 17/21 authorized, 4 EVIDENCE_LINEAGE violations. |
| **Implementation** | `ProjectionAuthorityKernel.authorizeConditions()`, `resolveProvenAuthority()` |

## Reference

- `docs/governance/runtime/PI_STATE_MACHINE_CONTRACT.md` Section 3.2
- `docs/governance/runtime/PIOS_CONSTITUTIONAL_DISCOVERY_REGISTRY.md` PCD-003, PCD-004
- `app/execlens-demo/lib/lens-v2/ProjectionAuthorityKernel.js`
