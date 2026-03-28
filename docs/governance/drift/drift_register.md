# Drift Register

Program: Krayu — Program Intelligence Discipline
Governance Authority: Stream 00.2 — Canonical Layer Model Restoration
Date: 2026-03-28

---

## Register

| ID | Name | Type | Status | Reference |
|---|---|---|---|---|
| DRIFT-001 | SSI / SSZ Boundary Violation | Layer Boundary Collapse (L3–L4–L6) | Resolved (Governance Reinforced) | [cases/ssi-ssz-postmortem.md](cases/ssi-ssz-postmortem.md) |

---

## DRIFT-001 Detail

**ID:** DRIFT-001
**Name:** SSI / SSZ Boundary Violation
**Type:** Layer Boundary Collapse (L3–L4–L6)
**Status:** Resolved (Governance Reinforced)
**Reference:** cases/ssi-ssz-postmortem.md

**Summary:** SSZ (Structural Stress Zone) and SSI (Structural Stress Index) were implemented at L6 (ExecLens runtime, utils/ssz.js) performing derivation computation that belongs at L3. This constitutes a layer boundary violation where the Runtime Experience Layer absorbed Derivation Layer ownership. The violation was identified, classified, and formally governed by Stream 00.2 (drift D1) and remediation was allocated by Streams 40.12–40.17. Governance is reinforced; L3 derivation specification stream remains pending.

**Layer model authority:** SSZ and SSI belong canonically at L3 (Derivation Layer) per canonical-layer-model.md Section 4 L3 Placement Rule and Section 7 construct classification.
