# Operational Continuity Model

## Principle

The operator must feel continuous operational investigation,
not website traversal.

## Before

- Each section was a separate Next.js page
- Navigation used `<Link>` tags for route-based transitions
- Full page reload on every section switch
- `getServerSideProps` re-executed on every transition
- `loadAllCockpitArtifacts` called 7 times for 7 pages
- Operational context (visual state, chromatic palette) lost between pages
- Browser back/forward was the only navigation mechanism

## After

- All sections render inside a single persistent shell
- Navigation uses `onNavigate` callback for state-driven transitions
- No page reload on section switch
- `getServerSideProps` runs once on initial load (loads all data)
- `loadAllCockpitArtifacts` called once total
- Chromatic palette, visual state, and shell structure persist
- Panel content transitions with subtle 0.15s fade animation

## Transition Feel

Panel transitions are:
- Instant (no network round-trip)
- Contextual (shell remains stable)
- Embedded (content appears inline)
- Operational (not navigational)

Panel transitions are NOT:
- Page refreshes
- Navigation jumps
- Route resets
- Full re-renders
