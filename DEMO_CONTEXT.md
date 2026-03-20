# ExecLens — What This Is and What It Is Not
## PIOS-42.9-RUN01-CONTRACT-v1

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
and validated by 101 automated checks.

---

## What the Demo Shows

The ExecLens demo (run_01_blueedge) demonstrates Program Intelligence for the
**BlueEdge platform** — a real software delivery program.

The demonstration includes:

| Component | Source |
|-----------|--------|
| 4 structural metrics | Signal registry (SIG-002, SIG-003, SIG-004, SIG-005) |
| 4 domains, 5 capabilities, 9 components | PIE vault + drill-down co-occurrence |
| 10 intelligence queries | Query signal map + response templates |
| Signal confidence levels | Evidence mapping index |
| Evidence chains | Structural telemetry artifacts (ST-xxx) |
| Architecture deep links | PIE vault (docs/pios/41.2/pie_vault/) |

---

## The Execution Chain

```
Query
  → Signal Registry (41.4)        — which signals are relevant?
  → Evidence Index (41.4)         — what evidence supports each signal?
  → PIE Vault (41.2)              — which architecture notes are referenced?
  → Response Templates (41.5)     — how should the answer be structured?
  → ExecLens Adapter (42.4)       — what JSON does the browser receive?
  → ExecLens Surface (42.4–42.8)  — what does the CTO see?
```

Each step is deterministic. Same input → same output.
The same query run twice produces identical results.

---

## No Synthetic Data Guarantee

This guarantee is structural, not asserted:

1. The adapter chain has no random number generation
2. No values are assigned defaults on extraction failure
3. Every metric extraction rule is a regex or word-map — not a heuristic
4. The topology hierarchy is computed by co-occurrence frequency — not
   semantic inference or manual labelling
5. 101 automated validation checks verify these properties across the stack

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

ExecLens (run_01_blueedge) is the first operational demonstration of
the discipline applied to a real program.
