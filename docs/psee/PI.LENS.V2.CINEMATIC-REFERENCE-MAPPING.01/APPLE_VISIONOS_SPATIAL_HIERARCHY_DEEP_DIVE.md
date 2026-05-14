# APPLE VISION PRO / visionOS — Spatial Hierarchy Deep Dive

**Stream:** PI.LENS.V2.CINEMATIC-REFERENCE-MAPPING.01
**Reference family:** Spatial Hierarchy
**Doctrine binding:** `VISUAL_DIRECTION_DOCTRINE.md` §5.4, §6

---

## 0. WHY THIS REFERENCE

Apple Vision Pro / visionOS is the modern reference for *restrained spatial layering and depth orchestration*. It demonstrates that:

- depth can communicate hierarchy without visual noise
- restraint is itself a signature
- motion can be slow, friction-heavy, and feel premium rather than slow
- the absence of decoration can read as confidence, not as plainness

LENS is a 2D surface, not a spatial OS. The borrow is *philosophical and atmospheric*, not literal.

---

## 1. CORE QUALITIES TO STUDY

### 1.1 Spatial hierarchy

visionOS surfaces sit at distinct depth tiers. The reader's eye orients by depth before it orients by content. Foreground commands attention, mid-ground holds context, background recedes.

### 1.2 Cinematic restraint

Animations are slow, friction-heavy, and never bouncy. The system feels considered. Nothing arrives by surprise; nothing leaves by surprise.

### 1.3 Depth orchestration

Multiple depth layers are simultaneously present and visually legible without producing clutter. Glass, shadow, and ambient light cooperate to maintain depth.

### 1.4 Atmospheric composure

The surface has *atmosphere* — a sense of environment. It is not flat. But the atmosphere is restrained: it is felt, not noticed.

---

## 2. WHAT LENS BORROWS

- **Depth-tier discipline.** LENS surfaces have at least three depth tiers (ground / surface / focal lift) and never collapse to flat.
- **Cinematic restraint of motion.** LENS hover transitions, descent transitions, and ambient drifts use friction-heavy easing in the 240–900 ms band, not bouncy quick transitions.
- **Atmospheric composure.** LENS surfaces have a subtle environmental gradient on the ground that suggests depth without being noticeable.
- **Restraint as signature.** LENS does not seek to "look like LENS" through novel visual flourishes. LENS is recognizable through its restraint.

---

## 3. WHAT LENS MUST AVOID

- **Floating gimmick UI.** visionOS is a 3D OS; floating panels are operationally meaningful in spatial computing. On a 2D LENS surface, floating mimicry reads as decoration.
- **Sci-fi fantasy effects.** Lens flares, holographic shimmers, particle systems, depth-of-field blurs — all forbidden.
- **Excessive translucency.** Glass is permitted only when it indicates depth or focal lift. Pervasive glass is a visionOS signature LENS does not borrow.
- **Translucent navigation chrome.** A frosted top bar is a visionOS aesthetic that has no operational meaning on LENS and is therefore decorative.

---

## 4. DEPTH MODEL FOR LENS (DERIVED FROM visionOS)

LENS surfaces use a constrained depth model:

| Tier | Role                                | Visual encoding                                   |
|------|-------------------------------------|---------------------------------------------------|
| 0    | Ground                              | Graphite, subtle environmental gradient           |
| 1    | Primary surface                     | Slightly lifted slate panel, soft multi-layer shadow|
| 2    | Focal anchor                        | Further lifted, restrained ambient illumination behind|
| 3    | Descent overlay                     | Distinct depth, glass permitted, focused          |

No tier 4. LENS does not stack arbitrary depth; the depth budget is fixed.

Glass is permitted only at tier 2 (anchor lift) and tier 3 (descent overlay), and only when it serves depth indication, not decoration.

---

## 5. MOTION READ

| Quality           | visionOS                                | LENS direction                                |
|-------------------|-----------------------------------------|-----------------------------------------------|
| Easing            | Friction-heavy, slow                    | Same                                          |
| Duration          | 250–800 ms                              | 240–900 ms                                    |
| Distance          | Small                                   | Small                                         |
| Bounce            | None                                    | None                                          |
| Ambient drift     | Subtle, environmental                   | Permitted, ≥ 1.6s, low amplitude              |
| Perceptual goal   | "Considered, never abrupt"              | Same                                          |

LENS adopts the visionOS motion philosophy almost completely. The only adjustment is duration band — LENS leans slightly slower for the executive register.

---

## 6. COLOR AND TONE READ

| Quality              | visionOS                          | LENS direction                          |
|----------------------|-----------------------------------|-----------------------------------------|
| Ground               | Environmental, real-world         | Graphite with subtle environmental gradient|
| Surface tone         | Glass-tinted, blurred              | Slate, lightly lifted                   |
| Accent               | iOS-style system tints             | Restrained steel blue                   |
| Saturation           | Restrained                         | Restrained                              |
| Use of glass         | Pervasive                          | Selective, depth-justified              |

LENS borrows visionOS's tonal restraint and rejects pervasive glass. LENS treats glass as a *depth tool*, not a *style*.

---

## 7. WHAT visionOS GETS WRONG FOR LENS

visionOS is calibrated for *consumer presence in spatial computing*. It is operationally light. Several visionOS choices are wrong for LENS:

- visionOS leans toward atmosphere over information density. LENS needs both.
- visionOS uses translucency liberally; LENS uses it sparingly.
- visionOS celebrates depth visually; LENS uses depth functionally.
- visionOS optimizes for emotional comfort; LENS optimizes for operational clarity.

LENS borrows the *quality of restraint* without inheriting the *consumer affect*.

---

## 8. INSPECTION CUES (FOR LENS REVIEW PASSES)

1. Are there at least three distinct depth tiers visible on the primary surface?
2. Is glass present? If yes — does each instance serve depth, focal lift, or descent? If not — remove.
3. Is motion friction-heavy and slow? Or has it drifted to elastic / bouncy?
4. Is there ambient drift? Is it sub-conscious (≥ 1.6s, low amplitude)?
5. Has the surface picked up any sci-fi flourish (particles, lens flares, holograms)? If yes — remove.

---

## 9. SUMMARY

visionOS's gift to LENS is one phrase: **"Restraint, depth, and slowness as the marks of seriousness."**

That phrase is borrowed entire.

The 3D-OS-specific affordances, the pervasive translucency, the consumer-comfort affect — none of those are borrowed.

---

**End of visionOS deep dive.**
