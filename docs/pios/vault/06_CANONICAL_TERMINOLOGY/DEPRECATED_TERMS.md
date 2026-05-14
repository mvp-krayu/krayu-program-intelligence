# Deprecated Terms

> **Terms that should not be used in current system context.**

---

## Deprecated Terminology

| Deprecated Term | Replaced By | Why |
|---|---|---|
| SSZ (Signal Significance Zone) | (removed — DRIFT-001 resolved) | Mis-layered L6 construct that belonged at L3. No longer in system. |
| SSI (Signal Significance Index) | (removed — DRIFT-001 resolved) | Same as SSZ. |
| ENL (Executive Narrative Layer) | LENS v2 | ENL was the intermediate name between ExecLens and LENS v2. |
| ExecLens (as current runtime) | LENS v2 + SQO Cockpit | ExecLens is historical. Directory name preserved. |
| Guided demo choreography | SQO Cockpit sections | Sequential panel progression replaced by independent sections. |
| Panel state machine | SQO S-state machine | Panel-based state replaced by data-driven state. |
| Domain A/B/C remediation | PI stream contracts | Remediation domains replaced by stream-scoped execution. |
| Numeric stream naming (40.x) | PI.*.*.01 naming | Numeric naming preserved for historical streams, not used for new. |
| governance_master_capsule.md (as authority) | CLAUDE.md | Capsule superseded by execution constitution. |
| WOW rendering | LENS v2 rendering | "WOW" was the ExecLens demo presentation model. |
| PSEE | DPSIG | PSEE namespace superseded by DPSIG (PSIG→DPSIG migration). |
| Obsidian vault links | (removed from runtime) | obsidian:// protocol links no longer in runtime code. |

## Still Valid Historical Terms

These are deprecated for NEW use but valid when referencing history:

| Term | Valid Context |
|---|---|
| ExecLens | Referring to the historical runtime surface (2026-03-21 → 2026-04-02) |
| PIE vault | Referring to Stream 41.2 semantic inventory |
| 40.x / 51.x | Referring to historical stream numbers |
| Panel | Referring to the ExecLens panel architecture |
| Persona (Exec/CTO/Analyst) | Referring to the ExecLens persona model |

## Cross-References

- [[TERMINOLOGY_LOCK]] — current authoritative definitions
- [[SEMANTIC_COLLISIONS]] — terms with multiple meanings
