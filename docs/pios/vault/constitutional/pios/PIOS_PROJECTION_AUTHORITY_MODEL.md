# PiOS Projection Authority Model

**Status:** LOCKED  
**Discovery:** PCD-002  
**Origin:** PI.STATE-ENGINE-AND-PROJECTION-GOVERNANCE.01  
**Propagated:** 2026-06-07  

---

## Doctrine

Program Intelligence governs projection through three independent axes. These were previously conflated as a single qualification-to-projection path. They are not the same thing.

### Qualification State (S-Axis)

Measures governance maturity through SQO progression. Describes what governance ceremonies have been exercised, not what intelligence exists.

| S0 | Unqualified | S1 | Structurally Qualified | S2 | Semantically Qualified | S3 | Governed |

### Evidence Capability (E-Axis)

Describes what intelligence substrate actually exists, independent of whether it has been qualified.

| E-STRUCTURAL | Topology + code graph + structural enrichment |
| E-RUNTIME | E-STRUCTURAL + runtime connectivity signals |
| E-SEMANTIC | E-STRUCTURAL + signal registry + reconciliation |
| E-GOVERNED | E-SEMANTIC + governance lifecycle |

Evidence capability is determined by artifact presence, not by qualification state. A specimen may possess E-RUNTIME at S1.

### Projection Authority (P-Axis)

Governs what PiOS is constitutionally allowed to project. Derived from Evidence Capability, not from Qualification State directly.

| P0 | Topology Only | P1 | Structural Observation | P2 | Runtime Interpretation | P3 | Semantic Cognition | P4 | Narrative Authority |

### Authority Flow

```
Qualification (S) → gates → Evidence Capability (E) → grants → Projection Authority (P)
```

The P-axis is the governing authority for what consumers may render. Not the S-axis.

## Constitutional Rules

1. No projection may exceed the authority granted by proven evidence capability.
2. No evidence capability may be claimed without artifact presence.
3. Violations are first-class governance concerns, not rendering preferences.
4. All consumers (LENS, THORR, EIR, SW-INTEL) depend on the same authority computation.

## Discovery Lineage

| | |
|---|---|
| **Trigger** | StackStorm S1 projecting "Execution Fragility" while state says "We only know structure" |
| **Observed** | Qualification, evidence capability, and projection authority were treated as one concept |
| **Validation** | ProjectionAuthorityKernel.js — 32 tests, both specimens. StackStorm P2, BlueEdge P4. |
| **Implementation** | `app/execlens-demo/lib/lens-v2/ProjectionAuthorityKernel.js`, PI_STATE_MACHINE_CONTRACT.md Sections 1-3 |

## Reference

- `docs/governance/runtime/PI_STATE_MACHINE_CONTRACT.md` Sections 1-3, 5
- `docs/governance/runtime/PIOS_CONSTITUTIONAL_DISCOVERY_REGISTRY.md` PCD-002
- `app/execlens-demo/lib/lens-v2/ProjectionAuthorityKernel.js`
