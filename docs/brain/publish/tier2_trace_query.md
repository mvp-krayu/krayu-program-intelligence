# Brain Node — Publish
# Tier-2 Evidence Interrogation Layer — Trace Graph and Query

**Authority:** TIER2.TRACE.QUERY.CONTRACT.01
**Brain:** PUBLISH
**Status:** PUBLISH-SAFE VARIANT REQUIRED
**Alignment date:** 2026-04-22
**Product link:** docs/brain/product/TIER2.TRACE.QUERY.CONTRACT.01.md

---

## PUBLISH SAFETY STATUS

**PUBLISH-SAFE VARIANT REQUIRED**

Query responses traverse client-specific node IDs and signal references. All externally visible outputs must apply the publish-safe obfuscation model.

---

## PUBLISH-SAFE RULES

### Node identifiers in responses

| Element | Internal | Publish-safe |
|---|---|---|
| Domain names | "BlueEdge Fleet Management Platform" | "Client Environment" |
| Domain names | "Fleet Core Operations" | "Core Operations" |
| Domain names | "Fleet Vertical Extensions" | "Vertical Extensions" |
| Domain IDs | `DOMAIN-{NN}` | MAY appear if no client name adjacent |
| Signal IDs | `SIG-{NNN}` | MUST NOT appear |
| Artifact IDs | `ART-{NNN}` | MUST NOT appear |
| Capability IDs | `CAP-{NN}` | MAY appear — no client-identifying context |
| Component IDs | `COMP-{NN}` | MAY appear — no client-identifying context |

### Response field constraints

```
structural_explanation:
  - Client-specific domain names must be replaced
  - Signal IDs must not appear
  - Zone conditions must use generic structural language

trace_paths:
  - node_chain may include DOMAIN-{NN} identifiers
  - Domain names in node labels must be obfuscated
  - inferred_declaration: present unchanged (not client-specific)

evidence_references:
  - artifact_ref: MUST NOT appear in publish output
    Replace with: "Evidence artifact" or omit artifact_ref field
  - signal_id: MUST NOT appear in publish output

uncertainty_declaration:
  - inference_prohibition: ACTIVE — present unchanged
  - unresolved_elements: generic language required
```

---

## SAFE / DRIFT CLASSIFICATIONS

| Element | Classification |
|---|---|
| `inference_prohibition: ACTIVE` | SAFE |
| Zone type vocabulary | SAFE |
| Domain IDs without names | SAFE |
| Generic structural explanations | SAFE |
| Obfuscated domain names | SAFE |
| Signal IDs (`SIG-{NNN}`) | VIOLATION if exposed |
| Artifact IDs or references | DRIFT RISK — omit or genericise |
| Client program names | VIOLATION if unobfuscated |
| Advisory language (forbidden anyway) | VIOLATION |

---

## PUBLISH GATE

Publish-safe query responses MUST NOT be served without:
1. All client-identifying domain names replaced per obfuscation rules
2. Signal IDs removed from all response fields
3. Artifact references omitted or genericised
4. `inference_prohibition: ACTIVE` present in uncertainty_declaration
5. No advisory language in any response field
