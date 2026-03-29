# Investor Layer — Index

Stream: I.2 — Investor Layer Packaging
Authority: [[canonical/canonical-layer-model]], [[program_intelligence_stack]], [[pios_investor_narrative]], B.1 demo truth registry
Date: 2026-03-29

---

## Purpose

This folder is the investor communication layer for Krayu — Program Intelligence. All content here is derived from canonical architecture artifacts and B.1 demo truth extraction. No claim in this folder exceeds the authority of those sources.

**Layer classification:** L7 (Narrative Packaging) governed by L8 (Governance / Validation).
**Constraint:** Claims in this layer may not exceed the canonical truth boundary defined in [[01_truth_boundary]].
**Modification rule:** This folder may only be updated by a governed stream. Canonical files in `../canonical/` must not be modified.

---

## Files

| File | Contents |
|------|----------|
| [[01_truth_boundary]] | What the system IS / IS NOT / NOT PRESENT — three-zone truth map |
| [[02_claim_matrix]] | Every investor claim classified: DEMO-TRUE / ARCH-TRUE / THESIS-ALLOWED / FORBIDDEN |
| [[03_language_guardrails]] | Forbidden phrases, allowed patterns, rewriting examples |
| [[04_positioning_core]] | What Krayu is, the problem it solves, why it is different (architecture-based) |
| [[05_narrative_stack]] | Four-layer narrative: System Reality → Category Meaning → Product Boundary → [FUTURE] Expansion |

---

## Navigation to Canonical Sources

| Document | Role |
|----------|------|
| [[../canonical/canonical-layer-model]] | PRIMARY — L0-L8 definitions, governing principles, cross-layer rules |
| [[../pios_architecture_whitepaper]] | Architecture root navigation node |
| [[../program_intelligence_stack]] | Discipline / PiOS / Signäl / Lens hierarchy articulation |
| [[../pios_investor_narrative]] | Investor-oriented discipline and system narrative |
| [[../../pios/B.1/demo_truth_registry]] | Demo truth extraction — 18 truths, 7 categories |
| [[../../pios/B.1/claim_boundary_matrix]] | Demo claim boundaries |
| [[../../pios/51.CLOSE/closure]] | 51.x demo surface governed closure |
| [[../../governance_master_capsule]] | GC-01..GC-11 governing constraints |

---

## How to Use This Folder

### For investor communication preparation

1. Start with [[01_truth_boundary]] to understand what zone each intended claim falls into.
2. Check [[02_claim_matrix]] to find the classification and allowed wording for specific claims.
3. Apply [[03_language_guardrails]] to rewrite any draft language before use.
4. Use [[04_positioning_core]] for precise, architecture-grounded positioning statements.
5. Use [[05_narrative_stack]] for layered explanation — start at Layer 1 (System Reality) and add layers as audience sophistication increases.

### For claim validation

Every claim in investor materials should map to a row in [[02_claim_matrix]]. If a claim does not appear in the matrix:
- Check [[01_truth_boundary]] — does it fall in a defined zone?
- If it falls in Zone 3 (NOT PRESENT) or cannot be placed in any zone, it must not be made.
- New claims require a governed update to this folder via a new I.x stream.

---

## Truth Boundary Summary

| Zone | Description |
|------|-------------|
| DEMONSTRATED | Observable in ExecLens demo; evidenced by B.1 against commit df3eaf6 |
| ARCHITECTURAL | Defined in canonical governance; implementation PROVISIONAL where noted |
| NOT PRESENT | Absent, provisional/mis-layered, or not in canonical record — must not be stated |

**Notable NOT PRESENT items:**
- SSZ/SSI as canonical governed signals (provisional, mis-layered at L6)
- Executive interpretation as formally governed L4 output (L4 spec absent)
- Full L0→L7 pipeline as currently production-complete
- AI/ML, prediction, or adaptive behavior of any kind

---

## Integrity Statement

This folder was produced by Stream I.2 on 2026-03-29, working strictly from canonical architecture artifacts and B.1 demo truth extraction. No canonical files were modified. No claims exceed the authority of the source artifacts cited. The [[02_claim_matrix]] FORBIDDEN column documents claims that must not appear regardless of investor context or communication pressure.

*Investor layer index: 2026-03-29 | Stream: I.2 | Source commit: df3eaf6 (demo) | Canonical authority: Stream 00.2*
