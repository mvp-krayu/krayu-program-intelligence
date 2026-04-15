# Evidence Vault Builder Specification
# PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01

- Version: 1.0
- Stream: PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01
- Date: 2026-04-15

---

## SECTION 1 — PURPOSE

The evidence vault builder is a deterministic Python script that reads a client/run artifact set and produces a complete Obsidian evidence vault instance.

**One input set → one vault. Same input set → same vault.**

The builder exists so that vault instances can be generated programmatically for any client and any run without manual authoring, while preserving the evidence-first discipline of the hand-authored reference vault.

---

## SECTION 2 — GOVERNING CONSTRAINTS

1. **Determinism:** The same `--client`, `--run`, and artifact set must produce identical output on every invocation.
2. **Fails closed:** If any required artifact is missing, the builder exits with FAIL. No partial vaults are produced.
3. **No inference:** Every claim value is read from a source artifact field. No values are invented or estimated.
4. **Reference vault protection:** The builder refuses to write to `clients/<client>/vaults/run_01_authoritative/`. The reference vault is immutable.
5. **No hardcoded client logic:** Template functions receive a `VaultModel` — no BlueEdge-specific constants appear outside the data model build.

---

## SECTION 3 — SCRIPT LOCATION

```
scripts/psee/build_evidence_vault.py
```

---

## SECTION 4 — CLI

```
python3 scripts/psee/build_evidence_vault.py \
    --client <client_id> \
    --run <run_id> \
    --output-dir <path> \
    [--client-name <display_name>] \
    [--signal-registry <path>] \
    [--binding-envelope <path>] \
    [--repo-root <path>]
```

| argument | required | description |
|----------|----------|-------------|
| `--client` | YES | Client ID (e.g. `blueedge`) |
| `--run` | YES | Run ID (e.g. `run_authoritative_recomputed_01`) |
| `--output-dir` | YES | Output directory for generated vault |
| `--client-name` | NO | Display name (default: derived from client ID) |
| `--signal-registry` | NO | Override path to signal_registry.json (default: package dir) |
| `--binding-envelope` | NO | Path to binding_envelope.json |
| `--repo-root` | NO | Repository root (default: auto-detected from script location) |

---

## SECTION 5 — VAULT OUTPUT STRUCTURE

The builder generates **57 files** in the following structure:

```
<output-dir>/
  EVIDENCE VAULT V2.md              — root governance node
  VAULT ENTRY — <ClientName>.md     — product landing page

  00 — Meta/
    Claim Index.md
    Entity Index.md
    Vault Governance.md

  00 — Navigation/
    Top Claims.md
    Core Artifacts.md
    Value Creation Path.md

  claims/                           — 27 claim nodes (CLM-01..CLM-27)
  entities/                         — 5 entity nodes
  artifacts/                        — 7 artifact nodes (ART-01..ART-07)
  transformations/                  — 6 transformation nodes (TRN-01..TRN-06)
  client-lineage/                   — 1 evidence path node
  governance/                       — 3 governance nodes
```

---

## SECTION 6 — CLAIM COVERAGE

All 27 claims are generated. Each claim node includes:

- Frontmatter (node_class, claim_id, claim_label, claim_type, exposure, lens_admissible)
- Explanation (parametrized narrative from VaultModel)
- Authoritative Value (computed from source artifact fields)
- Source Fields (field paths in source JSON)
- Upstream Artifacts (wikilinks to ART-XX nodes)
- Transformation Chain (stage + command)
- Exposure (zone + LENS admissibility + reason)
- Traceability (status + caveats)
- Why It Matters (for CLM-09, CLM-10, CLM-12, CLM-20, CLM-21, CLM-22, CLM-25)
- Surfaces (where the claim appears in GAUGE product)

---

## SECTION 7 — LINK VALIDATION

Before writing any files, the builder:

1. Collects all `[[wikilinks]]` from all generated node contents
2. Resolves each link against the set of generated node titles (filename without extension)
3. Reports broken links with source file and link target
4. Exits with code 1 if broken links are found

This ensures every generated vault is internally consistent.

---

## SECTION 8 — EXECUTION STATUS

| invocation | result |
|-----------|--------|
| `--client blueedge --run run_authoritative_recomputed_01` | COMPLETE — 57 nodes, 0 broken links |

**Authority:** PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01
