# VAULT SUBSTRATE VISUALIZATION MODEL

**Stream:** PI.LENS.V2.SEMANTIC-FIELD-TRANSITION.01
**Scope:** How LENS V2 visually implies vault-backed semantic generation — without yet implementing live binding.

---

## 1. The visual implication contract

The contract directs that LENS V2 must *visually imply* deep substrate hydration — making the surface feel computed rather than handcrafted — even before live vault binding is implemented.

This is delicate. The implication must be:

- **Honest** — not claiming binding that does not exist.
- **Evocative** — making the executive reader sense substrate-derived intelligence.
- **Restrained** — not faked-AI visual language.

---

## 2. The four visible signals of substrate hydration

After this stream, the LENS V2 surface visually implies vault hydration through four signals:

### Signal A — Lineage hash visibility (INVESTIGATION)

The Evidence Trace lineage actor surfaces:

- evidence_object_hash (`flagship001abc123def456...`)
- derivation_hash (`derivflagship111222333...`)
- baseline_anchor (`governed-baseline-v2`)
- run_id (`RUN-FLAGSHIP-001`)

These are monospace hash values rendered on a vertical descent chain. Their presence on the surface communicates: "this assessment has lineage; it was computed from a substrate."

The hashes are real — drawn from `trace_linkage` in the fixture. They are NOT invented.

### Signal B — Applied-rule chips (INVESTIGATION)

The Inference Prohibition actor surfaces:

- Qualifier rules: `Q-01`
- ALI rules: `ALI-01 · ALI-02 · ALI-03 · ALI-04`

These chips read in monospace typography, rendered with the visual grammar of governance metadata. Their presence communicates: "this assessment was processed through a rule-based substrate; specific rules applied."

The rules are real — drawn from `rendering_metadata` in the fixture. They are NOT invented.

### Signal C — Structural-backing vs semantic-only differentiation (DENSE)

The Semantic Topology + Structural Backing + Semantic-Only Exposure combined actor differentiates per-domain backing state via:

- Q-00 cells with blue-tinted top resonance and "structurally backed" caption.
- Q-01 cells with yellow-tinted top resonance, diagonal-hatch overlay, and "semantic-only · advisory" caption.

The differentiation communicates: "the substrate distinguishes structurally backed evidence from semantic-only exposure; this is not flat data."

### Signal D — Field gradient signature per mode

Each lens mode renders its own atmospheric field gradient. The gradient signatures imply substrate-derived presentation:

- BALANCED's three-zone confidence landscape implies posture-as-derived.
- DENSE's three pressure-tier glow centers imply structural cause-as-derived.
- INVESTIGATION's vertical descent gradient implies lineage-as-traversed-substrate.
- BOARDROOM's single central radial implies projection-as-distilled.

The field gradients are not arbitrary — they encode the cognitive register that a substrate-aware system would naturally produce per mode.

---

## 3. What the surface does NOT yet show

To remain honest, the surface does NOT yet show:

- Per-evidence-block timestamps (would imply real-time freshness).
- Per-signal lineage trails (would imply runtime tracing).
- Substrate health indicators (would imply backend liveness).
- Any "loading" / "hydrating" / "syncing" UI affordances (would imply live binding).
- Any per-client / per-run identifier in the surface chrome (would imply runtime selection).

These are reserved for the live binding stream (`PI.LENS.V2.LIVE-CLIENT-RUN-BINDING.01`, per `FUTURE_CLIENT_RUN_BINDING_CONTRACT.md`).

---

## 4. The honest substrate caption

The Report Pack support-rail block carries an explicit caption:

```
binding pending — live client/run integration not yet active
```

This caption preserves honesty even while the visual signals (A–D above) imply substrate hydration. The implication is *atmospheric*; the caption is *textual*; together they communicate "the surface is designed to read from a substrate, but the live binding is not yet here."

---

## 5. The future binding will hydrate these signals

When `/api/lens-payload` is implemented:

| Signal | Future hydration                                                                                  |
|--------|---------------------------------------------------------------------------------------------------|
| A      | Lineage hashes will be live per-run values from `trace_linkage` in the payload.                   |
| B      | Applied rules will be live per-run values from `rendering_metadata.qualifier_rules_applied` etc.   |
| C      | Per-domain backing state will be live per-run from `evidence_blocks[].grounding_status`.           |
| D      | Field gradient signatures stay constant (visual contract) — they do not depend on payload values. |

The visual surface does not need to change when binding lands. The signals already point at substrate-derived data.

---

## 6. The "alive, derived, hydrated" feel

The contract asks for the surface to feel "alive, derived, hydrated from substrate." After this stream:

- **Alive** — atmospheric layers (Layer 5 and Layer 7 in `SEMANTIC_ATMOSPHERIC_LAYERING.md`) give the field a sense of activity even when static.
- **Derived** — lineage hashes, applied rules, and backing-state differentiation visibly encode that the assessment is the *output* of computation.
- **Hydrated** — the field gradients and the rail-and-glow zone composition imply data emerging from substrate, not laid out by hand.

Together, these signals produce the desired affect without inventing fake AI behavior.

---

## 7. What is forbidden

To preserve honesty:

- No spinning loaders, "AI thinking" indicators, or fake processing animations.
- No "live" / "real-time" labels.
- No fictional client / run identifiers in the chrome.
- No fake confidence scores.
- No invented lineage hashes (the values shown are real fixture values).
- No invented applied rules (the rules are real `rendering_metadata` values).
- No fake "vault status" badges.

If a future contract proposes any of these, it violates the contract direction "do not implement live APIs yet" and must be rejected.

---

## 8. Authority

This visualization model is authoritative for substrate-implication semantics. Future contracts that touch the surface must preserve:

- The four signal types (lineage hashes, applied rules, backing-state differentiation, field gradients).
- The honest binding-pending caption.
- The forbidden patterns.

When live binding lands, the visualization model evolves but does not break. The signals remain; their values become live.

---

**End of vault substrate visualization model.**
