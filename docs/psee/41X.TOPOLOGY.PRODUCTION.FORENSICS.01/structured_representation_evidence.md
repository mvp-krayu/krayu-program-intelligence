# Structured Representation Evidence
# 41X.TOPOLOGY.PRODUCTION.FORENSICS.01 — Deliverable 3

## Identity

- Contract: 41X.TOPOLOGY.PRODUCTION.FORENSICS.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT FORENSICS — NO CODE CHANGES

---

## Primary Question

Was there a structured topology representation (dict, list, graph, object) prior to MD generation?

---

## Evidence: Structured Object in 41.1 Production Script

### Location

**File:** `scripts/pios/41.1/build_semantic_layer.py`
**Contract label:** PIOS-41.1-ADDENDUM-SCRIPT-RECOVERY-v1
**First committed:** c6d69c9

### Structure Shape

The script contains three top-level Python list constants:

**DOMAINS** (lines 39–57) — 17 entries
```python
DOMAINS = [
    {"id": "DOMAIN-01", "name": "Edge Data Acquisition",                    "type": "FUNCTIONAL",     "grounding": "GROUNDED"},
    {"id": "DOMAIN-02", "name": "Telemetry Transport and Messaging",         "type": "INFRASTRUCTURE", "grounding": "WEAKLY GROUNDED"},
    # ... 15 more entries
    {"id": "DOMAIN-17", "name": "Extended Operations and Driver Services",   "type": "FUNCTIONAL",     "grounding": "GROUNDED"},
]
```

Schema per entry: `{id: str, name: str, type: str, grounding: str}`

**CAPABILITIES** (lines 60–103) — 42 entries
```python
CAPABILITIES = [
    {"id": "CAP-01", "name": "Vehicle Sensor Collection", "domain": "DOMAIN-01", "type": "CORE",    "weak": False},
    {"id": "CAP-02", "name": "Network Security Intelligence Collection", "domain": "DOMAIN-01", "type": "CORE", "weak": False},
    # ... 40 more entries
    {"id": "CAP-42", "name": "Customer and Ecosystem Services", "domain": "DOMAIN-17", "type": "SUPPORTING", "weak": False},
]
```

Schema per entry: `{id: str, name: str, domain: str, type: str, weak: bool}`

**COMPONENTS** (lines 106–196) — 89 entries
```python
COMPONENTS = [
    {"id": "COMP-01",  "name": "blueedge-platform (Monorepo)", "cap": "CAP-29", "weak": False, "cross": None},
    # ... 87 more entries
    {"id": "COMP-89",  "name": "Docker Compose Orchestration", "cap": "CAP-40", "weak": False, "cross": None},
]
```

Schema per entry: `{id: str, name: str, cap: str, weak: bool, cross: str|None}`

**DIRECTIVES** (lines 198–210) — 10 entries
```python
DIRECTIVES = [
    {"id": "SFD-01", "type": "WEAK_GROUNDING_ALERT", "priority": "HIGH", "affected": "..."},
    # ... 9 more entries
]
```

---

## Structural Hierarchy Expressed in the Dicts

The three lists encode the full topology hierarchy:

```
DOMAINS[N].id          (DOMAIN-01 … DOMAIN-17)
  └── CAPABILITIES[N].domain → DOMAINS[N].id    (capability → domain assignment)
        └── COMPONENTS[N].cap → CAPABILITIES[N].id   (component → capability assignment)
```

This is an explicit domain→capability→component hierarchy stored as Python dicts. The `_cap_domain()` helper function at line 216 traverses this:
```python
def _cap_domain(cap_id: str) -> str:
    return _cap_by_id[cap_id]["domain"]
```

And the generator functions iterate over these structures to produce MD:
```python
for dom in DOMAINS:
    # emit domain section
    caps_in_domain = [c for c in CAPABILITIES if c["domain"] == d_id]
    domain_comps: dict = {d["id"]: [] for d in DOMAINS}
    for comp in COMPONENTS:
        dom_id = _cap_domain(comp["cap"])
        domain_comps[dom_id].append(comp)
```

---

## Completeness Assessment

| field | value |
|-------|-------|
| All 17 domains present | YES — DOMAIN-01 through DOMAIN-17 |
| All 42 capabilities present | YES — CAP-01 through CAP-42 |
| All 89 components present | YES — COMP-01 through COMP-89 |
| Hierarchy encoded (domain→capability) | YES — via CAPABILITIES[*].domain field |
| Hierarchy encoded (capability→component) | YES — via COMPONENTS[*].cap field |
| Cross-domain annotations | YES — COMPONENTS[*].cross (e.g., COMP-25 has "cross": "DOM-01") |
| Weak grounding flags | YES — DOMAINS[*].grounding, CAPABILITIES[*].weak, COMPONENTS[*].weak |
| Total nodes representable | 148 (17 + 42 + 89) |
| All 148 nodes present in dicts | YES |

---

## Lifecycle Assessment

| question | finding |
|----------|---------|
| Is the structured object in-memory only? | NO — persisted in script file as source code |
| Is there a JSON dump of this structure? | NOT FOUND anywhere in repository |
| Is there a serialized pickle or other format? | NOT FOUND |
| Was the structure persisted to disk during generation? | NOT FOUND — no intermediate JSON file exists |
| Is the structure present today? | YES — in `scripts/pios/41.1/build_semantic_layer.py` |
| Was it the original generation source or extracted after? | EVIDENCE INDICATES RECOVERY (script label "ADDENDUM-SCRIPT-RECOVERY-v1"; committed AFTER canonical artifacts) |

---

## Recovery vs. Original Generation Assessment

The script was committed in `c6d69c9` ("Recover and harden PiOS 41.1-41.5 deterministic scripts") on 2026-03-20 16:48 +0400.

The canonical 41.1 artifacts were committed in `e8fe19f` ("PIOS baseline: 40.3–40.11 pipeline + 41.1 semantic layer") — a SEPARATE, EARLIER commit.

**This means:** The recovery script encoding the dicts was written AFTER the canonical MD artifacts were committed. The dicts are a faithful representation of the canonical artifact content, not the pre-existing source that generated them.

However: The script's generator functions produce valid, structurally equivalent MD from these dicts. The parity check confirms structural equivalence (all IDs, headers, metadata present).

**Two possible interpretations:**
1. The original 41.1 execution also used embedded dicts (same pattern), and the recovery script recreated that pattern. In this case: the structured representation existed at time of original generation but is no longer the same script instance.
2. The dicts were extracted from the canonical MD files and embedded in the recovery script. In this case: the structured representation was a POST-GENERATION artifact.

**Evidence available to resolve:** The script label "ADDENDUM-SCRIPT-RECOVERY-v1" suggests (2). However, the generator functions in the recovery script produce MD structurally identical to what was committed — suggesting the structured data was available during original production.

**Forensic conclusion:** The dicts are present and complete today. Whether they were the original source or a recovery artifact, they represent the canonical structured topology. Their lifecycle is: **PERSISTED in script file, NOT a transient in-memory object.**

---

## Search for Intermediate Files

| search | result |
|--------|--------|
| `**/*.json` matching topology node pattern | No JSON topology files in docs/pios/41.x |
| Temp JSON at `/tmp/pios_41_*` | Not a repository artifact — not searchable |
| Any JSON with DOMAINS/CAPABILITIES keys | Not found |
| Any JSON with domain_id/capability_id hierarchy | Only 41.4/signal_registry.json (references domain_id but does not define topology) |
| Debug dump or serialized object files | NOT FOUND |

---

## 41.2 Vault Structured Representation Assessment

| question | finding |
|----------|---------|
| Does a structured object exist that was used to generate the vault? | NOT FOUND in repository |
| Does any script derive vault MD from DOMAINS/CAPABILITIES/COMPONENTS dicts? | NOT FOUND — build_pie_vault.py copies, does not generate |
| Was the vault generated from 41.1 artifacts as intermediate structure? | YES — content confirmed "copied verbatim" from semantic_domain_model.md and capability_map.md per validation report |
| Is the intermediate structure (41.1 MD content) still present? | YES — docs/pios/41.1/ artifacts are present and unchanged |

**41.2 conclusion:** The structured intermediate for vault generation was the 41.1 MD artifact set, not a JSON/dict object. The vault authors read `semantic_domain_model.md`, `capability_map.md`, and `semantic_traceability_map.md` and assembled vault files by directly transcribing/organizing that content into per-node MD files.
