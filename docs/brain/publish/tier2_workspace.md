# tier2_workspace — Publish Brain: Tier-2 Diagnostic Workspace

**Authority:** brain/publish  
**Stream:** TIER2.WORKSPACE.MODEL.01  
**Status:** PUBLISH-SAFE VARIANT  
**Publish boundary:** No client-identifying names. No internal IDs. No signal IDs. No system-specific terminology.

---

## Publish Statement

The Tier-2 Diagnostic Workspace is an evidence-bounded structural investigation surface. It is available to clients with Tier-2 access as part of a LENS Assessment engagement.

---

## What the Workspace Is (Publish-Safe)

The Diagnostic Workspace is the interactive layer of a LENS Assessment. Rather than presenting a fixed report, it allows the client and their technical counterparts to investigate structural conditions directly — within a governed, evidence-bounded environment.

The workspace organizes findings into **diagnostic zones**: bounded areas of structural concern derived from the assessment evidence. Each zone represents a domain where the structural state is unresolved, partially observable, or under concentrated pressure.

---

## What Users Can Do

**Browse the zone inventory:** all diagnostic zones are listed with their classification, severity, and evidence status. Users navigate by selecting a zone of interest.

**Examine a zone workspace:** each zone has a full structural view: what condition was identified, what structural patterns contribute to it, how structural effects propagate, what evidence exists, and what remains unresolved.

**Investigate using controlled modes:**

- **WHY** — understand why a zone was classified as it was. Output is a structural derivation rationale, not a causal claim.
- **TRACE** — explore structural propagation paths from the zone's anchor domain. Output is a path list bounded to the zone scope.
- **EVIDENCE** — see all evidence artifacts bound to the zone's signals, and what evidence is missing. Output surfaces facts, not recommendations.

---

## What the Workspace Does Not Do

The workspace is a structural investigation tool. It is not:

- **An advisory engine** — it does not recommend actions
- **A root cause tool** — it identifies structural conditions, not causes
- **A real-time dashboard** — findings are derived from the assessment evidence set, not live system telemetry
- **A predictive model** — no forward projections are made
- **A conversational interface** — investigation modes are parameterized, not free-form

---

## Export Relationship

The **Diagnostic** export (Tier-2 Diagnostic Narrative) is a static snapshot of the workspace at generation time. It preserves all zone findings but does not support interactive investigation modes.

The **Executive Brief** and **LENS Assessment** are Tier-1 exports — they do not include workspace content.

The workspace is always the primary surface. Exports are projections for sharing and record purposes.

---

## Inference Boundary (Publish-Safe)

All workspace outputs are bounded by the assessment evidence. The system does not produce claims beyond what the evidence directly supports. Unresolved conditions are declared as such — not resolved through inference.

`inference_prohibition: ACTIVE` applies to all workspace output.

---

## Access

Tier-2 Diagnostic Workspace access is part of the Tier-2 access tier of a LENS Assessment engagement. Availability and scope are defined in the engagement terms.
