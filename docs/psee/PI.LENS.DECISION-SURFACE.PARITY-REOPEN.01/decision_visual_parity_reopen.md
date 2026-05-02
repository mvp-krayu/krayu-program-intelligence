# Decision Visual Parity Reopen
## PI.LENS.DECISION-SURFACE.PARITY-REOPEN.01

**Date:** 2026-05-02
**Branch:** work/psee-runtime

---

## Observation

Human visual comparison found that the wrapper-generated Decision Surface is missing sections present in the canonical reference.

---

## File Comparison

| Attribute | Canonical | Generated |
|-----------|-----------|-----------|
| Path | `reports/decision/lens_decision_surface.html` | `reports/lens_decision_surface.html` |
| Size | 15,169 bytes / 159 lines | 11,797 bytes / 138 lines |
| Size delta | — | −3,372 bytes / −21 lines |

---

## Missing Sections (Generated vs Canonical)

| Section | Canonical | Generated |
|---------|-----------|-----------|
| WHERE PRESSURE EXISTS (`ds-epb` block) | PRESENT | ABSENT |
| Structural Pressure Signals card | PRESENT | ABSENT |
| Graph visualization (canvas + script) | PRESENT | ABSENT |
| Pressure pattern synthesis | PRESENT | ABSENT |
| Truth text 3rd sentence ("A single structural pressure pattern appears across the system.") | PRESENT | ABSENT |
| Gap item: "2 structural signals not activated" | PRESENT | ABSENT |
| Gap item: "Blind spot coverage active…" | PRESENT | ABSENT |

## Present in Both

| Section | Match |
|---------|-------|
| INFERENCE_PROHIBITION | YES |
| INVESTIGATE posture | YES |
| Score 60 / CONDITIONAL | YES |
| Hero rationale | YES |
| STRUCTURE: STABLE / EVIDENCE: PARTIAL / RISK: MODERATE badges | YES |
| Navigation links | YES (run-id differs — volatile metadata) |

---

## Byte Comparison

- Canonical sha256: `36886d0841fdcfc2143d7016d619cafbfcb6b69c660e11c3116be6a78cf2bc06`
- Generated sha256: differs
- This is NOT the same volatile-metadata-only diff previously classified — it is a structural content diff
