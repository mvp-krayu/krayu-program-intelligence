# RAYCAST — Command Surface Deep Dive

**Stream:** PI.LENS.V2.CINEMATIC-REFERENCE-MAPPING.01
**Reference family:** Command Surface
**Doctrine binding:** `VISUAL_DIRECTION_DOCTRINE.md` §5.5

---

## 0. WHY THIS REFERENCE

Raycast is the modern reference for *command-surface confidence*. It demonstrates that:

- a productivity surface can be powerful without scaffolding
- minimal chrome reads as competence, not as emptiness
- direct utility can feel premium when typography and motion are disciplined
- "I know exactly what this is for" can be communicated by absence

LENS borrows Raycast's *directness* and *minimal chrome* philosophy. LENS does not borrow Raycast's *consumer-utility register*.

---

## 1. CORE QUALITIES TO STUDY

### 1.1 Command confidence

Raycast does not ask the user what they want to do. It assumes the user knows. The surface is built around the user's intent, not around exposing the system's capabilities.

### 1.2 Restrained UI chrome

Almost no chrome. A search input, a list of results, a footer with action hints. That is the entire surface. There are no panels, sidebars, headers, tabs, breadcrumbs, or settings exposed at the primary level.

### 1.3 Premium utility feel

Despite being a command bar, Raycast feels premium. It does not feel like Spotlight. The premium feel comes from typography, motion timing, and total absence of unnecessary elements.

### 1.4 Speed as quality

Raycast is fast. The surface paints fast, the keyboard navigation is instant, the actions are immediate. Speed is part of the design, not separate from it.

---

## 2. WHAT LENS BORROWS

- **Minimal chrome.** LENS has almost no top bar, no sidebar, no breadcrumbs, no tabs. The surface is built around the executive's read, not around system navigation.
- **Direct utility.** LENS does not show capabilities — it shows answers. Tooling is in descent, not on the surface.
- **Premium through restraint.** Like Raycast, LENS earns its premium feel by removing, not by adding.
- **Speed as quality.** LENS performance budget is part of the design contract: declaration paint < 1.2s, no layout shift after first paint.

---

## 3. WHAT LENS MUST AVOID

- **Utility-tool flatness.** Raycast is a flat productivity surface; it works because the use case is brief and instrumental. LENS is a contemplative surface; flatness reads as analytics, not as institutional.
- **Developer-only ergonomics.** Raycast assumes keyboard-first interaction by power users. LENS does not.
- **Command-bar metaphor.** LENS is not a command bar. The metaphor is *executive briefing*, not *command surface*.
- **Per-user customization on the primary surface.** Raycast is configurable; LENS surfaces are determined by upstream truth, not by user preference.

---

## 4. CHROME READ

| Element              | Raycast                         | LENS direction                          |
|----------------------|---------------------------------|-----------------------------------------|
| Top bar              | Search input (single)           | Thin band: identity / state / time-of-truth|
| Sidebar              | None                            | None                                    |
| Tabs                 | None                            | None                                    |
| Breadcrumbs          | None                            | None                                    |
| Footer               | Action hints, contextual        | Permitted: subtle descent affordance hints|
| Settings affordance  | Hidden, command-driven          | Hidden, off-surface                     |

LENS borrows Raycast's chrome economy almost completely. The only addition is the thin identity / state / time-of-truth band — operationally required for executive surfaces.

---

## 5. TYPOGRAPHY READ

| Quality            | Raycast                              | LENS direction                                |
|--------------------|--------------------------------------|-----------------------------------------------|
| Family             | System sans                          | Editorial humanist sans                       |
| Body size          | Calibrated for command-bar reading   | Larger, executive reading distance            |
| Hierarchy          | Result name / metadata / shortcut    | Declaration / implication / metadata          |
| Tracking           | Tight                                | Tracked declaration, regular body             |

LENS borrows the principle of *strict hierarchy with no decoration* and recalibrates the type for executive reading.

---

## 6. COLOR READ

| Quality              | Raycast                                | LENS direction                          |
|----------------------|----------------------------------------|-----------------------------------------|
| Ground               | Near-black to graphite                 | Graphite                                |
| Primary text         | Off-white                              | Off-white, modulated by tier            |
| Accent               | Single brand red on focused state      | Restrained steel blue on focal lift     |
| Category color       | None                                   | None                                    |

Direct alignment.

---

## 7. MOTION READ

| Quality           | Raycast                                | LENS direction                                |
|-------------------|----------------------------------------|-----------------------------------------------|
| Easing            | Snappy, fast                           | Friction-heavy, slow                          |
| Duration          | 80–200 ms                              | 240–900 ms                                    |
| Bounce            | None                                   | None                                          |

LENS does **not** borrow Raycast's snappy motion. Raycast's snap reads as instrumental; LENS's slow ease reads as institutional. The two registers are different and must not mix.

---

## 8. INSPECTION CUES (FOR LENS REVIEW PASSES)

1. Has LENS achieved Raycast-grade chrome economy?
2. Is the surface built around the executive's read, or around system navigation? (Latter is FAIL)
3. Has LENS picked up Raycast's snappy motion? (FAIL — LENS is slower)
4. Has LENS reduced to flat utility (Raycast's signature register)? (FAIL — LENS retains atmosphere)
5. Does the surface feel direct without feeling instrumental?

---

## 9. THE RAYCAST RECALIBRATION

Raycast's signature is: **fast, flat, direct, useful**.

LENS's signature is: **calm, layered, considered, consequential**.

These are different registers. LENS borrows Raycast's *minimal chrome* and *direct construction* but specifically rejects:

- snappy motion
- flat surface
- instrumental affect

The result is a surface that has Raycast's minimalism but visionOS's depth and Linear's calm.

---

## 10. SUMMARY

Raycast's gift to LENS is one phrase: **"Build the surface around the read, not around the system."**

That phrase is borrowed entire.

Raycast's snap, flatness, and instrumental register are recalibrated to LENS's institutional register.

---

**End of Raycast deep dive.**
