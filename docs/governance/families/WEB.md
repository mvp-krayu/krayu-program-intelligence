# Family: WEB — Publishing and Crawl Surface

**Status:** REGISTERED
**Registered:** 2026-04-04
**Authority:** EX.0

---

## PURPOSE

Publishing, crawl projection, route governance, mirror behavior, SEO surfaces, and externally consumable authority projection. WEB streams control what the outside world sees and ensure it reflects canonical authority without drift.

---

## STANDARD INVARIANTS

- Published surface must reflect canonical authority — no publishing of unresolved content
- Route and canonical mapping must remain explicit and documented
- No content drift between authority layer and projection layer
- Crawl surface must remain clean and indexable

---

## STATE VOCABULARIES

| Object | States |
|---|---|
| publish_state | READY \| PARTIAL \| BLOCKED |
| crawl_state | VALID \| DEGRADED \| BLOCKED |
| canonical_state | ALIGNED \| PARTIAL \| DRIFTED |

---

## STANDARD ARTIFACT SLOTS (7-PACK)

| Slot | Function |
|---|---|
| 1 | Route or surface map |
| 2 | Publishing spec |
| 3 | Projection definition |
| 4 | Crawl or exposure surface |
| 5 | Boundary contract |
| 6 | Validation report |
| 7 | Execution report |

---

## VALIDATION PROFILES

| Profile | Purpose |
|---|---|
| `mirror_publish` | Route presence and publish state |
| `crawl_surface` | Crawl state and indexability |
| `sitemap_integrity` | Sitemap completeness |
| `canonical_projection` | Canonical alignment on published surface |

---

## HANDOVER EXPECTATIONS

- Publishing outcome (what went live, what is blocked)
- Crawl/index readiness
- Canonical alignment state
- Remaining route issues

---

## KNOWN EXCLUSIONS

- No canonical source redefinition inside WEB
- No engine computation inside WEB

---

## COMPRESSION ELIGIBILITY

REGISTERED. Compressed contracts permitted.
