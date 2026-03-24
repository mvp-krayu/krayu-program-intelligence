# Persona Drill-Down Specification
## Stream 42.16 — Persona-Based Evidence Views

**contract_id:** PIOS-42.16-RUN01-CONTRACT-v1
**run_reference:** run_01_enl_ui_exposure
**date:** 2026-03-21

---

## 1. Purpose

This document defines the default drill-down expansion behavior per persona,
the drill-down depth rules, and how evidence chain visibility differs by persona.

Drill-down behavior uses the `lens_drilldown_v1` session model (from 42.15).
Persona depth defaults control the starting expansion — they do not limit
maximum accessible depth.

---

## 2. Default Drill-Down Depth Per Persona

| Persona | Default depth | Layers shown by default |
|---|---|---|
| EXECUTIVE | 1 | INTEL only |
| CTO | 3 | INTEL + SIG-41 + SIG-40 |
| ANALYST | 4 | Full chain (INTEL + SIG-41 + SIG-40 + EVID) |

"Default depth" means the depth used when the persona view is rendered without
an explicit `--depth` override. The full chain is always accessible regardless
of default depth.

---

## 3. Drill-Down Behavior Definitions

### EXECUTIVE — Depth 1

By default, only the INTEL layer node is shown. The signal title and source
reference are visible. The deeper chain is not rendered in the default view.

```
[PERSONA: EXECUTIVE]  GQ-003

  Signal: SIG-003 — Dependency Load
  ──────────────────────────────────────────────────

  [INTEL]  INTEL-GQ003-001
    title:      Blast radius if a core platform component fails or is changed
    source_ref: docs/pios/41.5/query_response_templates.md#GQ-003
    status:     validated

    [chain: 3 more layers — use --depth 4 for full chain]
```

### CTO — Depth 3

INTEL → SIG-41 → SIG-40 are shown by default. The EVID terminal is reachable
but not rendered in the default view.

```
[PERSONA: CTO]  GQ-003

  Signal: SIG-003 — Dependency Load
  ──────────────────────────────────────────────────

  [INTEL]  INTEL-GQ003-001
    ...

  ↓

  [SIG-41]  SIG41-SIG003-001
    ...

  ↓

  [SIG-40]  SIG40-SIG003-001
    source_ref: docs/pios/41.4/evidence_mapping_index.json#SIG-003
    derived_from: EVID-ST007-001
    ...

    [chain: 1 more layer — use --depth 4 for EVID]
```

### ANALYST — Depth 4 (full)

All four layers are shown by default: INTEL → SIG-41 → SIG-40 → EVID.
chain_status and breadcrumbs are shown in the default view.

---

## 4. Evidence Chain Visibility Per Persona

### ENL Graph Mode

When an ENL graph is available (GQ-003 / SIG-003):

| Persona | ENL layers rendered | Breadcrumbs |
|---|---|---|
| EXECUTIVE | INTEL only | Not shown |
| CTO | INTEL + SIG-41 + SIG-40 | Not shown |
| ANALYST | All 4 layers | Shown |

### Evidence Mapping Mode

When operating from evidence_mapping_index.json (SIG-001, SIG-002, SIG-004, SIG-005):

| Persona | Sections rendered | Supporting objects |
|---|---|---|
| EXECUTIVE | INTEL-REF only | Not shown |
| CTO | INTEL-REF + SUPPORTING | Shown (compact) |
| ANALYST | INTEL-REF + SUPPORTING + EVIDENCE | Full verbatim |

---

## 5. Drill-Down Override

A consumer may override the persona default depth with `--depth N`:

```bash
python3 scripts/pios/42.16/persona_view_map.py --persona EXECUTIVE --query GQ-003 --depth 4
```

This overrides the EXECUTIVE default of 1 and shows the full chain.
The persona identity and all other display rules (ordering, emphasis) remain in effect.

The `--depth` flag accepts the same values as in 42.15:
- `--depth 1` → INTEL only
- `--depth 2` → INTEL + SIG-41
- `--depth 3` → INTEL + SIG-41 + SIG-40
- `--depth 4` → full chain

---

## 6. Persona Drill-Down Rules

### PD-01 — Default Depth Is Not a Ceiling

The default depth controls what is rendered without explicit instruction.
It does not restrict what is accessible. All personas have access to the full chain.

### PD-02 — Depth Override Preserves Persona Identity

When `--depth` is used to override the default, the persona's ordering and
emphasis rules still apply. EXECUTIVE view with `--depth 4` still places
business_impact before evidence and uses EXECUTIVE signal ordering.

### PD-03 — Depth Remaining Label

When the default depth does not reach EVID, a label is shown indicating
remaining layers:

```
[chain: N more layers — use --depth 4 for full chain]
```

This label is informational. It does not constitute interpretation.

### PD-04 — Incomplete Chains

When an ENL chain is `incomplete_terminal` (does not reach EVID):
- All personas receive the same `chain_status: incomplete_terminal` label
- ANALYST shows it prominently
- CTO shows it prominently
- EXECUTIVE shows it if the chain itself is shorter than their default depth

### PD-05 — Evidence Mapping Mode Depth Analog

In evidence mapping mode, depth maps to:
- Depth 1 → INTEL-REF section only
- Depth 2 → INTEL-REF + SUPPORTING
- Depth 3+ → INTEL-REF + SUPPORTING + EVIDENCE (full)

---

## 7. Deterministic Drill-Down

Drill-down output is deterministic: same persona + same query + same depth → same output.

The `lens_drilldown_v1` session model is stateless per invocation. No state is
carried between calls. No adaptive depth logic.
