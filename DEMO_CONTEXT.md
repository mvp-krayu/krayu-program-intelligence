<!--
DEMO LOCK — PIOS 51.8R / RUN05 + RUN06A

Locked baseline:
- RUN05 = final control/render/runtime baseline
- RUN06A = final demo documentation alignment baseline

Locked truths:
- Guided mode behavior accepted
- FREE / OPERATOR mode accepted
- ENTRY vs FREE separation accepted
- explicit operator indicator accepted
- evidence panel behavior in FREE accepted
- exit / CTRL-K semantics accepted
- explicit re-entry semantics accepted
- demo docs aligned to actual runtime truth

Rule:
No further changes to control logic, mode semantics, or demo documentation unless a new concrete defect is observed in runtime truth.

Phase:
30-Day WOW Demo — LOCKED BASELINE
-->

# ExecLens — What This Is and What It Is Not
## PIOS-51.8R-RUN05-CONTRACT-v1
### (supersedes PIOS-42.9-RUN01-CONTRACT-v1)

---

## What ExecLens Is

**ExecLens** is a program intelligence execution surface.

It takes a governed set of structural questions about a program and answers
them by traversing locked architecture artifacts — signal registries, evidence
indexes, capability vaults, and response templates — through a deterministic
execution chain.

Every displayed value is:
- extracted from a declared source artifact
- bound to a specific signal with a declared confidence level
- traced through an explicit evidence chain
- resolvable to an architecture note in the PIE vault

The system does not summarize. It does not estimate. It does not infer.
It traverses, binds, and renders.

---

## What ExecLens Is Not

| Common Assumption | Reality |
|-------------------|---------|
| It's a dashboard | No. Dashboards display data you already have. ExecLens extracts intelligence from artifacts you already possess. |
| It's an AI analysis tool | No. The execution chain is entirely deterministic. No language model is involved in signal extraction or evidence binding. |
| The data is synthetic | No. Every signal in this demonstration was extracted from real BlueEdge program artifacts. |
| The values are estimated | No. Every metric value is extracted via an explicit, inspectable rule. If extraction fails, the value is null — not a default. |
| It requires a live system | No. ExecLens operates on locked artifacts. It produces intelligence about structural state, not runtime telemetry. |
| It works for any program | No. ExecLens is calibrated to a specific program's artifact set. The signal registry and evidence index are program-specific. |

---

## The Evidence-First Principle

ExecLens is built on a single governing principle — the evidence-first rule:

**No value may be displayed without a traceable evidence source.**

This means:

- Every gauge metric shows its source signal ID
- Every signal shows its evidence chain
- Every navigation link either resolves to a vault note or is marked ⚠ UNRESOLVED
- Every extraction rule is explicit and inspectable in the adapter source
- Extraction failure → null, not a default value

This principle is enforced at every layer of the execution chain (42.1–42.7)
and validated by 101 automated adapter checks. The demo surface itself is
governed by an additional 431 checks (PIOS 51.x validation suite).

---

## Demo Control Model

The Lens surface operates in five distinct states:

| State | Trigger | Description |
|-------|---------|-------------|
| ENTRY | Initial load | Situation panel open. Persona selection required to unlock query. Guided start pending. |
| READY | Persona + query both selected | Transient. Auto-start fires immediately. |
| GUIDED | Auto-start or CTA | Active persona-specific walkthrough. Step-driven panel control. Situation pinned. |
| COMPLETE | Final guided step reached | Persona cleared. Panels locked pending re-selection. Demo bar hidden. |
| FREE / OPERATOR | Exit button or CTRL-K | Durable operator exploration mode. All panels browsable. Explicit re-entry required. |

**ENTRY and FREE are not the same state.** ENTRY is a pre-demo shell — no
guided sequence has been executed. FREE is a post-exit operator surface — the
guided sequence has run and the user has explicitly exited.

---

## Guided Flows by Persona

ExecLens surfaces intelligence differently per audience. Persona selection
binds a specific evidence traversal sequence:

| Persona | Steps | Sequence | Emphasis |
|---------|-------|----------|----------|
| EXECUTIVE | 3 | Answer → Signal → Evidence | Start with the conclusion; show evidence on demand |
| CTO | 3 | Signal → Evidence → Answer | Lead with signals; walk to answer through evidence |
| ANALYST | 4 | Evidence → Signal → Answer → Raw | Evidence-first; raw artifact access at step 4 |

Each step opens its associated panel alongside the pinned Situation panel.
Step transitions are explicit (Next →). The last step shows "Try another
perspective" — pressing it closes the loop and returns to COMPLETE state.

---

## What the Demo Shows

ExecLens (run_02_governed) demonstrates Program Intelligence for the
**BlueEdge platform** — a real software delivery program.

The demonstration includes:

| Component | Source |
|-----------|--------|
| 4 structural metrics | Signal registry (SIG-002, SIG-003, SIG-004, SIG-005) |
| 4 domains, 5 capabilities, 9 components | PIE vault + drill-down co-occurrence |
| 10 intelligence queries (GQ-001 to GQ-010) | Query signal map + response templates |
| 3 persona lenses (EXECUTIVE, CTO, ANALYST) | PERSONA_GUIDED_FLOWS static binding |
| Signal confidence levels | Evidence mapping index |
| Evidence chains with source artifacts | Structural telemetry artifacts (ST-xxx) |
| Architecture navigation (in Situation panel) | PIE vault (docs/pios/41.2/pie_vault/) |

---

## The Execution Chain

```
Query + Persona
  → Signal Registry (41.4)        — which signals are relevant?
  → Evidence Index (41.4)         — what evidence supports each signal?
  → PIE Vault (41.2)              — which architecture notes are referenced?
  → Response Templates (41.5)     — how should the answer be structured?
  → ExecLens Adapter (42.4)       — what JSON does the browser receive?
  → Lens Surface (PIOS 51.8R)     — what does the persona see?
```

Each step is deterministic. Same input → same output.
The same query + persona combination run twice produces identical results.

---

## No Synthetic Data Guarantee

This guarantee is structural, not asserted:

1. The adapter chain has no random number generation
2. No values are assigned defaults on extraction failure
3. Every metric extraction rule is a regex or word-map — not a heuristic
4. The topology hierarchy is computed by co-occurrence frequency — not
   semantic inference or manual labelling
5. 101 automated validation checks verify these properties across the adapter stack

If any value could not be extracted from governed sources, it would not appear.

---

## Program Intelligence Discipline Context

ExecLens is a demonstration of the **Program Intelligence** discipline —
a systematic approach to translating observable execution evidence into
structured intelligence about program delivery state.

The discipline is documented in:
- `docs/program-intelligence-discipline/`
- `docs/program-intelligence-framework/`
- `docs/signal-science/`

ExecLens (run_02_governed) is the operational demonstration of the discipline
applied to a real program, with persona-driven evidence traversal.
