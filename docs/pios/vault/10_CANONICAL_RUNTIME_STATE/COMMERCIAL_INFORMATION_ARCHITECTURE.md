# Commercial Information Architecture

> **Established:** 2026-06-02
> **Authority:** Architectural decision — commercial documentation organized by consumer purpose, not governance stream origin.

---

## The Decision

Commercial artifacts are organized for commercial consumption, not for governance-history navigation. Nobody outside the governance journey should ever need to know which `PI.PRODUCT-MANAGEMENT.*` stream produced a document in order to find it.

**Two trees, two purposes:**

| Tree | Purpose | Authority |
|------|---------|-----------|
| `docs/pios/PI.PRODUCT-MANAGEMENT.SIGNAL-GTM-AND-EXECUTION.01/` | Governance execution record — stream closure, execution reports, validation logs | Historical authority — the record of how decisions were made |
| `docs/commercial/` | Commercial working tree — what salespeople, operators, and partners use | Operational authority — the current state of commercial assets |

If a document exists in both locations, the governance stream is the historical record. The commercial tree is the operational working location. Updates to commercial documents are governed by normal stream discipline — the commercial tree is not ungoverned.

---

## Structure

```
docs/commercial/
├── COMMERCIAL_AUTHORITY.md              ← Entry point: what is Signäl, what are the offers, where is everything
├── offers/                              ← "How do I sell [SKU]?"
│   ├── SA_PACKAGING.md                  ← Structural Assessment — primary wedge
│   ├── SA_DD_PACKAGING.md              ← Structural Due Diligence — PE/M&A variant
│   ├── (SC_PACKAGING.md)               ← Continuous Intelligence — future (P1)
│   └── (SE_PACKAGING.md)               ← Enterprise Intelligence — future (P2)
├── delivery/                            ← "How do I deliver to a customer?"
│   ├── EVIDENCE_INTAKE_CHECKLIST.md     ← Hand to customer
│   ├── ENGAGEMENT_LETTER_TEMPLATE.md   ← Sign with customer
│   └── DELIVERABLE_HANDOFF_PROCESS.md  ← Internal end-to-end process
├── reference/                           ← "What are our product definitions?"
│   ├── SKU_MODEL.md                     ← Internal: what each SKU contains
│   ├── OFFER_CATALOG.md                ← Internal: all offers in one view
│   ├── PRODUCT_LANGUAGE_DECISIONS.md   ← Correct vs incorrect product language
│   ├── (PRICING_STRATEGY.md)           ← Future
│   └── (CHANNEL_STRATEGY.md)           ← Future
├── investor/                            ← "Materials for investor/partner conversations"
│   ├── KRAYU_EXECUTIVE_OVERVIEW_V1.md
│   ├── BLUEEDGE_EXECUTIVE_INTELLIGENCE_REPORT.md
│   ├── KRAYU_ARCHITECTURE_OVERVIEW_V1.md
│   ├── PACKAGE_GLOSSARY.md
│   └── COMMERCIAL_CONTRAST.md
└── archive/                             ← Pre-stream legacy material (not current)
```

---

## Organizing Principle

The axis is **who consumes the document**, not which stream produced it:

| Folder | Consumer | Question |
|--------|----------|----------|
| `offers/` | Salesperson preparing a proposal | "How do I sell SA-DD?" |
| `delivery/` | Operator executing a customer engagement | "What do I hand to the customer?" |
| `reference/` | Product team maintaining definitions | "What language do we use?" |
| `investor/` | Executive in a strategic conversation | "What do I show to Helge?" |
| `archive/` | Nobody (retained for historical reference) | — |

---

## Rules

1. **`COMMERCIAL_AUTHORITY.md` is the entry point.** Every new commercial folder or document must be indexed there. Without it, the tree degrades into the same scatter it replaced.

2. **`offers/` contains offers, not SKU definitions.** SKU_MODEL.md defines the packaging. The offers are the sellable things. One file per SKU.

3. **`delivery/` contains customer-delivery artifacts.** Intake, engagement, handoff. Not "operations" — that word is too generic and collides with SQO operations.

4. **`reference/` contains internal product definitions.** Not customer-facing. Product team and governance use only.

5. **Governance stream originals are preserved.** `docs/pios/PI.PRODUCT-MANAGEMENT.SIGNAL-GTM-AND-EXECUTION.01/` retains the governance record. The commercial tree is the working location.

6. **No commercial document without an offer or delivery purpose.** If a document doesn't answer "how do I sell this" or "how do I deliver this" or "what are our product definitions," it probably belongs in the governance stream, not the commercial tree.

---

## Relationship to Vault

This vault page records the architectural decision. The commercial tree itself is NOT part of the vault — it is a working tree for commercial consumption. The vault records WHY the tree exists and HOW it is structured, so that future sessions do not reorganize it or scatter documents back into governance stream folders.

---

## Cross-References

- [[CURRENT_CANONICAL_PATHS]] — includes commercial tree paths
- [[../00_START_HERE/PIOS_CURRENT_CANONICAL_STATE]] — system-level canonical state
