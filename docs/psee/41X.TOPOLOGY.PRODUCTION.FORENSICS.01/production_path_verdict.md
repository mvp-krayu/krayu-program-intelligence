# Production Path Verdict
# 41X.TOPOLOGY.PRODUCTION.FORENSICS.01 — Deliverable 4

## Identity

- Contract: 41X.TOPOLOGY.PRODUCTION.FORENSICS.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT FORENSICS — NO CODE CHANGES

---

## Mandatory Forensic Questions — Answers

### Q1: What exact code or process created the 41.2 PIE vault files?

**Answer:** No script in the repository generates vault files from structured data. `scripts/pios/41.2/build_pie_vault.py` copies the vault, not generates it. The vault was assembled directly as MD during the 41.2 execution (authoring process), drawing content from 41.1 artifacts.

**Evidence:** Searching all scripts under `scripts/pios/` found zero vault file writers. `build_pie_vault.py` is a `shutil.copy2()` operation against `docs/pios/41.2/pie_vault/` as canonical source.

---

### Q2: Was there a structured topology representation before MD?

**Answer: YES for 41.1. PARTIALLY for 41.2 (via 41.1 MD as intermediate).**

For 41.1: `scripts/pios/41.1/build_semantic_layer.py` contains embedded `DOMAINS` (17), `CAPABILITIES` (42), `COMPONENTS` (89) Python dicts — complete topology as structured objects. These dicts encode the full domain→capability→component hierarchy.

For 41.2: No structured object (dict/JSON/graph) was found for vault generation. The 41.1 MD artifacts served as the intermediate from which vault content was derived verbatim.

---

### Q3: If yes — what is its shape, where is it constructed, and does it still exist?

**Shape:**
```
DOMAINS = [{"id": "DOMAIN-NN", "name": str, "type": str, "grounding": str}, ...] × 17
CAPABILITIES = [{"id": "CAP-NN", "name": str, "domain": "DOMAIN-NN", "type": str, "weak": bool}, ...] × 42
COMPONENTS = [{"id": "COMP-NN", "name": str, "cap": "CAP-NN", "weak": bool, "cross": str|None}, ...] × 89
```

**Where constructed:** `scripts/pios/41.1/build_semantic_layer.py` — module-level constants (lines 39–196)

**Does it still exist?** YES — the dicts are present in the script file today.

**Lifecycle:** PERSISTED in script source (not transient). NOT serialized to JSON separately.

---

### Q4: If no structured representation — how are domains/capabilities/components assembled?

**Applies to 41.2 vault specifically:**

Domains, capabilities, and components were assembled by directly authoring 148 MD files. Content was taken verbatim from `docs/pios/41.1/` artifacts:
- Domain descriptions from `semantic_domain_model.md`
- Capability descriptions from `capability_map.md`
- Component traceability from `semantic_traceability_map.md`
- Navigation links assembled per-file referencing other vault files

---

### Q5: Is topology truth originally structured → rendered to MD, OR directly written as MD?

**For 41.1:** STRUCTURED → rendered to MD.
Evidence: `build_semantic_layer.py` generator functions iterate over dicts and produce MD.

**For 41.2 vault:** **DIRECT_MD_ASSEMBLY** — no generation script.
Evidence: No vault generator exists. build_pie_vault.py confirms vault is canonical source.

**Combined answer:** Topology truth is defined in the DOMAINS/CAPABILITIES/COMPONENTS dicts (41.1 level). The 41.1 MD artifacts were rendered from these dicts. The 41.2 vault was then assembled directly as MD from the 41.1 MD artifacts, not from the dicts.

---

### Q6: Is any intermediate JSON or machine-readable structure present anywhere in the generation path?

**Answer: NO.**

The only JSON in the 41.x chain is at 41.4 (signal layer) and 41.5 (query layer). No JSON intermediate exists between the `DOMAINS/CAPABILITIES/COMPONENTS` dicts and the 41.1 MD files, or between the 41.1 MD files and the 41.2 vault.

---

## Classification

### 41.1 Production Path: Classification A — STRUCTURED_PRODUCER

| criterion | evidence |
|-----------|---------|
| Topology assembled as structured object | YES — DOMAINS, CAPABILITIES, COMPONENTS Python dicts |
| MD generated from that object | YES — generator functions iterate over dicts and emit MD |
| Complete coverage | YES — all 148 nodes representable from the dicts |
| Object still present | YES — in build_semantic_layer.py |

**Classification: A (STRUCTURED_PRODUCER)**

---

### 41.2 Vault Production Path: Classification C — DIRECT_MD_ASSEMBLY

| criterion | evidence |
|-----------|---------|
| Topology assembled as structured object before vault | NO — no vault generator script |
| MD assembled directly | YES — vault MD files authored directly |
| Content source | 41.1 MD artifacts (verbatim copy per validation report) |
| Vault generation script | NOT FOUND |

**Classification: C (DIRECT_MD_ASSEMBLY)**

---

### Combined 41.x Production Path: Classification B — HYBRID_PRODUCER

The full 41.x chain used a hybrid approach:
- 41.1: structured dicts → 7 MD artifacts (STRUCTURED_PRODUCER)
- 41.2: 41.1 MD artifacts → 148 vault MD files (DIRECT_MD_ASSEMBLY)

The structured representation exists at the 41.1 level but was not carried forward as machine-readable structure into the vault. The vault was assembled directly from the 41.1 MD text.

**Classification: B (HYBRID_PRODUCER)**

**Confidence: HIGH**

Evidence base:
- Script analysis: `build_semantic_layer.py` source read, all dicts verified (lines 39–196)
- Script analysis: `build_pie_vault.py` source read — confirmed copy-only
- Full script search: no vault generator found in any `scripts/pios/` directory
- Validation report evidence: "All domain descriptions copied verbatim from semantic_domain_model.md" — confirms 41.1 MD as vault source
- Git history: vault first committed in `c36f4ea`; recovery scripts committed later in `c6d69c9`
- Pre-recovery baseline confirms vault existed before canonical placement

---

## Governing Conclusion

| dimension | conclusion |
|-----------|-----------|
| topology_production_classification | B — HYBRID_PRODUCER |
| structured_representation_existence | YES (for 41.1 level) / NO (standalone JSON) |
| producer_identification | scripts/pios/41.1/build_semantic_layer.py (for 41.1) / UNRESOLVED for 41.2 original generation |
| confidence_level | HIGH |
| governing_conclusion | STRUCTURED_SOURCE_EXISTS |

---

## FINAL VERDICT FORMAT

**1. Topology production classification:** B — HYBRID_PRODUCER

**2. Structured representation existence:** YES

The structured representation exists as embedded Python dicts in `scripts/pios/41.1/build_semantic_layer.py`:
- `DOMAINS` list (17 entries): domain_id, name, type, grounding
- `CAPABILITIES` list (42 entries): capability_id, name, domain assignment, type, weak flag
- `COMPONENTS` list (89 entries): component_id, name, capability assignment, weak flag, cross-domain
- Full 148-node topology hierarchy representable from these dicts
- Persisted in script file, NOT serialized to JSON

**3. Producer identification:**

| layer | producer |
|-------|---------|
| 41.1 artifacts | `scripts/pios/41.1/build_semantic_layer.py` (STRUCTURED_PRODUCER with embedded dicts) |
| 41.2 vault | UNRESOLVED — no generator script found; vault was DIRECT_MD_ASSEMBLY |
| 41.3 artifacts | Copy of canonical `docs/pios/41.3/` |
| 41.4 JSON | `scripts/pios/41.4/build_signals.py` (embedded SIGNALS dicts) |

**4. Confidence level:** HIGH

**5. Governing conclusion:** STRUCTURED_SOURCE_EXISTS

The topology truth resides in the `DOMAINS/CAPABILITIES/COMPONENTS` Python dicts embedded in `scripts/pios/41.1/build_semantic_layer.py`. This structured source can regenerate all 7 `docs/pios/41.1/` MD artifacts with structural equivalence. The 41.2 vault (148 files) has no equivalent generator — its content was assembled directly from the 41.1 MD artifacts. The structured source at 41.1 level is present, complete, and persisted. A GAUGE-consumable topology JSON representation does not exist anywhere in the repository but could be derived from the DOMAINS/CAPABILITIES/COMPONENTS dicts in `build_semantic_layer.py`.

---

## Implications for GAUGE (Informational Only — No Recommendations)

| fact | implication |
|------|-------------|
| DOMAINS/CAPABILITIES/COMPONENTS dicts exist in build_semantic_layer.py | A 148-node JSON topology is derivable from the existing structured source without parsing any MD |
| build_semantic_layer.py is a Python script with embedded dicts | The structured source is in a directly importable/readable form |
| No JSON topology exists today | GAUGE cannot consume topology without either (1) using the dicts or (2) parsing vault MD |
| The vault content was verified as verbatim copy of 41.1 MD | The dicts in build_semantic_layer.py and the vault are structurally equivalent |
