# Template Model
# PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01

- Version: 1.0
- Stream: PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01
- Date: 2026-04-15

---

## SECTION 1 — ARCHITECTURE

The builder uses three layers:

```
VaultModel (data)
  ↓
Generator functions (VaultModel → str)
  ↓
File output (str → .md files)
```

No template engine dependency. All templates are Python f-strings.

---

## SECTION 2 — VaultModel

`VaultModel` is a Python dataclass built from source artifacts. It holds all values needed to generate vault content. Template functions receive only a `VaultModel` — no raw artifact dicts.

Key properties:
- `structure_verdict` — derived from coverage_percent + reconstruction_state
- `complexity_verdict` — derived from canonical_cross_domain_overlaps
- `execution_verdict` — derived from execution_status
- `executive_verdict_str` — formatted three-axis string
- `signal_by_id(sig_id)` — returns SignalData or None

---

## SECTION 3 — CLAIM GENERATOR PATTERN

Each claim has a dedicated generator function `gen_clm_XX(m: VaultModel) -> str`.

All 27 generators follow this structure:

```
frontmatter (node_class, claim_id, claim_label, claim_type, exposure, lens_admissible)
## Explanation       ← parametrized narrative pulling values from m
## Authoritative Value  ← computed value from m
## Source Fields     ← fixed field paths to source JSON
## Upstream Artifacts   ← wikilinks to ART-XX nodes
## Transformation Chain ← stage + command
## Exposure          ← zone + LENS admissibility + reason
## Traceability      ← status + caveats
## Why It Matters    ← present for CLM-09, 10, 12, 20, 21, 22, 25
## Surfaces          ← GAUGE product surface references
```

Signal claims (CLM-20..24) use a shared `_gen_signal_claim()` helper that accepts a `SignalData` object.

---

## SECTION 4 — FRONTMATTER HELPER

```python
def fm(**kwargs) -> str:
    lines = ["---"]
    for k, v in kwargs.items():
        lines.append(f"{k}: {v}")
    lines.append("---\n")
    return "\n".join(lines)
```

All node frontmatter is generated via `fm()`. Field order is preserved.

---

## SECTION 5 — WIKILINK CONVENTION

All internal links use exact filename (without extension), matching Obsidian wikilink resolution:

```
[[CLM-09 Proven Structural Score]]       ← correct
[[CLM-09]]                               ← will NOT resolve in Obsidian
```

The `wl(*titles)` helper formats multiple wikilinks as space-separated inline links.

---

## SECTION 6 — DERIVED VALUES

Three verdicts are computed by `VaultModel` properties:

| verdict | derivation rule |
|---------|----------------|
| `structure_verdict` | coverage_percent==100 AND reconstruction_state==PASS → STRONG; coverage>=90 AND PASS → MODERATE; else WEAK |
| `complexity_verdict` | canonical_cross_domain_overlaps==0 → LOW; <=2 → MODERATE; else HIGH |
| `execution_verdict` | execution_status==NOT_EVALUATED → UNKNOWN; else VERIFIED |

These are the authoritative values for CLM-25 and the executive verdict display.

---

## SECTION 7 — EXTENSION POINTS

To add a new client or run:
1. Ensure source artifacts are present in `clients/<client>/psee/runs/<run_id>/package/`
2. Run the builder with `--client` and `--run` flags
3. No code changes required unless the gauge_state.json schema changes materially

To add a new claim:
1. Add entry to `CLAIM_DEFS` list
2. Add generator function `gen_clm_XX(m)`
3. Add entry to `CLAIM_GENERATORS` dict
4. The claim index and entity navigation will update automatically

**Authority:** PRODUCTIZE.EVIDENCE.VAULT.BUILDER.01
