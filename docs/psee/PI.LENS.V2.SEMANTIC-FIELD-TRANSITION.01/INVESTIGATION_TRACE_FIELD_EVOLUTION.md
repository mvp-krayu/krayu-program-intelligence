# INVESTIGATION TRACE FIELD EVOLUTION

**Stream:** PI.LENS.V2.SEMANTIC-FIELD-TRANSITION.01
**Scope:** What INVESTIGATION looks like after the field transition.

---

## 1. The transition

| Before                                                                | After                                                                  |
|-----------------------------------------------------------------------|------------------------------------------------------------------------|
| Three bordered actor cards (Lineage / Signal Stack / Inference Prohibition) | Three actor zones in a trace-depth corridor                          |
| Signal rows with `border: 1px solid #1a2030` per row                   | Rows have left tier-rail (blurred) + thin between-row resonance lines |
| Inference Prohibition bordered yellow card                            | Statement with rail + radial governance contour extending behind it    |
| "Evidence lens" label + uniform interpretation                        | "FORENSIC INTERPRETATION" — mode-reactive label with yellow accent     |

---

## 2. The composition

```
FORENSIC INTERPRETATION             [EVIDENCE LENS · ANALYST]
Executive Ready — Qualified           Z7 EVIDENCE TRACE · Z5 SIGNAL STACK · Z2 RESOLUTION BOUNDARY

[Evidence reading]                  ──────────────────────────
23 of 31 delivery clusters         [ET]  Evidence Trace · lineage
operating above threshold...
                                     ●  Evidence object hash
[What the evidence shows]            │  flagship001abc123def456...
Evidence across 23 of 31...          │
                                     ●  Derivation hash
[Structural lineage]                 │  derivflagship111222333...
Pressure originates in Primary…      │
                                     ●  Baseline anchor
                                     │  governed-baseline-v2
                                     │
                                     ●  Run id
                                        RUN-FLAGSHIP-001

                                    ──────────────────────────
                                    [SS]  Signal Stack · 4 active

                                    ┃ HIGH    Cluster Execution Pressure  PD
                                    ┃         23 of 31 delivery clusters...
                                    ┃         Confidence — Full Grounding
                                    ─────────────────────────────────  ← thin between-row resonance
                                    ┃ ELEVATED Delivery Capacity Signal  PD
                                    ┃ ...
                                    ─────────────────────────────────
                                    ┃ ELEVATED Coordination Throughput   CL
                                    ─────────────────────────────────
                                    ┃ MODERATE Secondary Throughput      SD
                                    ┃         (warm gradient overlay — Q-01)
                                    ┃         Confidence — Partial · advisory bound

                                    ──────────────────────────
                                    [IP]  Inference Prohibition

                                    ┃ Executive action on partially-grounded signals
                                    ┃ requires advisory confirmation. The system
                                    ┃ MUST NOT infer beyond evidence...
                                    (governance contour extends behind the statement)

                                    Qualifier rules: Q-01
                                    ALI rules: ALI-01 · ALI-02 · ALI-03 · ALI-04
```

The INVESTIGATION field is a top-down corridor: blue at the top fading to yellow at the bottom — the trace descends through evidence and ends at the qualified receiver state.

---

## 3. Field gradient signature

```css
.rep-field--investigation::after {
  background:
    linear-gradient(180deg, rgba(74,158,255,0.04) 0%, transparent 30%, rgba(230,184,0,0.04) 100%);
}
```

- Top blue tint → lineage descent register (evidence-side).
- Bottom yellow tint → qualified-receiver advisory register.

The field encodes "going deeper takes you toward partial grounding."

---

## 4. Zone-by-zone composition

### 4.1 Evidence Trace · lineage

- Vertical chain of 4 lineage steps:
  - Each step has a glow dot at the rail anchor.
  - Each step has a connecting gradient line to the next.
  - Each step shows the lineage-field label + monospace hash value.

The cells have no enclosing rectangle. The lineage descends through the field.

### 4.2 Signal Stack

- 4 individual signal rows (flattened from `evidence_blocks[].signal_cards`).
- Each row has:
  - Left tier rail (blurred, opacity 0.85).
  - Tier-color glow dot at the rail anchor.
  - Signal name + domain context + pressure label + evidence text + confidence row.
- Between rows: thin gradient resonance line (1px, faded).
- Q-01 partial-grounding rows carry an additional warm gradient overlay (`linear-gradient(90deg, rgba(230,184,0,0.06) 0%, ...)`) signaling advisory state.

### 4.3 Inference Prohibition

- Statement panel with left yellow rail.
- A broader yellow governance contour extends behind the statement (via `::after` pseudo element with negative inset and radial gradient).
- Below: applied rule chips in monospace.

The Inference Prohibition is now a **visible governance force** in the field, not just a yellow card.

---

## 5. Left interpretation in INVESTIGATION

```
FORENSIC INTERPRETATION         ← yellow-accented label
Executive Ready — Qualified

Evidence reading                 ← reframed section label
Critical delivery operations are…

What the evidence shows           ← reframed section label
Evidence across 23 of 31 monitored…

Structural lineage                ← reframed section label
Pressure originates in Primary Delivery...
```

Same content. Different framing. The forensic register makes the interpretation read as evidence-side analysis, not as executive briefing.

---

## 6. The five-second test

An unbriefed observer should be able to describe the INVESTIGATION canvas as:

> "I see a vertical lineage chain of hashes, four signals listed individually with tier rails and evidence text, and a governance contour around the inference prohibition statement. The field descends from blue at the top to yellow at the bottom."

Not as:

> "I see three sections with cards."

The captured screenshot confirms the trace corridor reading.

---

## 7. Authority

This evolution is authoritative for INVESTIGATION. Future contracts must preserve:

- The vertical blue→yellow corridor field gradient.
- The lineage chain composition (dots + edges + labels).
- The Signal Stack with tier rails and resonance lines.
- The Inference Prohibition with governance contour extending behind the statement.
- The mode-reactive forensic-toned interpretation.

---

**End of INVESTIGATION trace field evolution.**
