# Cognitive Hierarchy Improvements

## Scanning Burden Reduction

### Before
- Uniform visual weight across zones
- Flat card styling (border-only)
- Same font family throughout
- Section titles at varying sizes without system

### After
- Graduated visual prominence: hero > blockers > operational > deferred > forensic
- Elevated cards with depth via box-shadow
- Split typography (mono data / sans prose)
- Systematic section title treatment (uppercase, letter-spaced, consistent size)

## State Cognition Within Seconds

### S-state Dominance
- 44px S-state identifier is the first visual anchor
- Chromatic palette immediately colors the entire shell
- Blockage card with inset severity lane communicates posture in <2 seconds

### Severity Differentiation
- Projection: red lane + red tint → urgency
- Expansion: blue lane + blue tint → stable constraint
- Remediation: orange lane + orange tint → active work required

## Attention Flow

### Intended Reading Order (top to bottom)
1. Ribbon (ambient state) → 0.5s
2. Hero S-state + label → 1s
3. Blockage card (if present) → 2s
4. Blocker items (if present) → scanning
5. Workflow spine + active stage → orientation
6. Progression rail → trajectory
7. Deferred zone → optional depth

### Visual Cues Supporting Flow
- Ribbon: compact, always visible, ambient information
- Hero: largest element, strongest visual weight
- Blockage: inset severity lane draws eye
- Blocker items: elevation separates from background
- Spine: continuous vertical line guides eye downward
- Deferred: deliberately quieter, collapsed by default

## FastAPI vs BlueEdge Cognitive Differentiation

### FastAPI (S1, Projection Blocked)
- Amber chromatic palette throughout
- Red blockage card: "QUALIFICATION INCOMPLETE"
- Red inset lane: immediate urgency signal
- Blocker items: red-accented, elevated
- Progression: 0% readiness, red gate verdict

### BlueEdge (S2, Expansion Constrained)
- Blue chromatic palette throughout
- Blue blockage card: "EXPANSION CONSTRAINED"
- Blue inset lane: controlled constraint signal
- Expansion gaps: blue-accented, elevated
- Progression: readiness progressing, expansion framing
