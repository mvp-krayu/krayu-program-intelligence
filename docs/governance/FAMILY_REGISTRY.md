# FAMILY_REGISTRY

**Authority:** EX.0 — Execution Operating Model Hardening
**Date established:** 2026-04-04
**Status:** ACTIVE

---

## PURPOSE

This is the authoritative index of governed stream families in the Krayu Program Intelligence model.

A family must be registered here before:
- compressed contracts can reference it
- validate_stream.py can load its profiles
- SKILLS.md RESOLVE_FAMILY can confirm it
- any stream can claim governed execution status

An unknown family must trigger FAMILY_DISCOVERY mode, not normal execution.

---

## REGISTRATION RULES

1. Each family has exactly one entry in this file.
2. Each family has exactly one definition file at `docs/governance/families/<ID>.md`.
3. Each family has exactly one machine-readable profile file at `docs/governance/families/<ID>.json`.
4. Status must be one of: `REGISTERED` | `CANDIDATE` | `DEPRECATED`.
5. Only `REGISTERED` families may use compressed contract execution.
6. `CANDIDATE` families must use FAMILY_DISCOVERY mode and cannot be compressed.
7. `DEPRECATED` families may be referenced for historical continuity only — no new streams.

---

## REGISTERED FAMILIES

| Family ID | Purpose summary | Definition file | Profile file | Status | Registered |
|---|---|---|---|---|---|
| EX | Execution binding, verification, bridge, trace, debug | families/EX.md | families/EX.json | REGISTERED | 2026-04-04 |
| 40 | PiOS core deterministic runtime (signals → intelligence) | families/40.md | families/40.json | REGISTERED | 2026-04-04 |
| 42 | Consumption, query, narrative, delivery, demo exposure | families/42.md | families/42.json | REGISTERED | 2026-04-04 |
| 51 | Runtime layer: UI, API, scenario execution | families/51.md | families/51.json | REGISTERED | 2026-04-04 |
| GOV | Canonical governance, registry, authority enforcement | families/GOV.md | families/GOV.json | REGISTERED | 2026-04-04 |
| CAT | Category authority, construct positioning | families/CAT.md | families/CAT.json | REGISTERED | 2026-04-04 |
| WEB | Publishing, crawl, mirror, SEO, route surface | families/WEB.md | families/WEB.json | REGISTERED | 2026-04-04 |

---

## CANDIDATE FAMILIES

None currently registered. Candidates created via FAMILY_DISCOVERY.

---

## DEPRECATED FAMILIES

None currently deprecated.

---

## ADDING A NEW FAMILY

To register a new family:

1. Run `FAMILY_DISCOVERY <candidate>` — produces candidate assessment
2. Create `docs/governance/families/<ID>.md` — definition file
3. Create `docs/governance/families/<ID>.json` — machine-readable profile file
4. Add entry to this registry with status `CANDIDATE`
5. Run `VALIDATION_DISCOVERY <family> <stream_type>` — verify validation coverage
6. If coverage is sufficient, upgrade status to `REGISTERED`
7. Until `REGISTERED`, contracts for this family must not use compressed execution

---

## RESOLUTION BEHAVIOR

| Condition | Behavior |
|---|---|
| Family in registry, status REGISTERED | Load family definition; proceed with compressed execution |
| Family in registry, status CANDIDATE | Switch to FAMILY_DISCOVERY mode; no compressed execution |
| Family in registry, status DEPRECATED | Warn; allow read-only reference only |
| Family not in registry | FAIL_SAFE_STOP — invoke FAMILY_DISCOVERY |
| Family file missing despite registry entry | FAIL_SAFE_STOP — file integrity violation |

---

## RELATION TO CONTEXT_REGISTRY.md

`docs/governance/CONTEXT_REGISTRY.md` is a legacy summary document retained for historical reference. It is **not** the authority for family definitions as of EX.0. The authoritative sources are:
- This file (FAMILY_REGISTRY.md) — index and registration status
- `docs/governance/families/<ID>.md` — family governance definition
- `docs/governance/families/<ID>.json` — machine-readable validation profiles
