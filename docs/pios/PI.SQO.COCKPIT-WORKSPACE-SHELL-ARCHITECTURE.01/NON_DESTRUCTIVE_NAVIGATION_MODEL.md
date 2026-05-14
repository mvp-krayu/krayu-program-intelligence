# Non-Destructive Navigation Model

## Mechanism

Navigation is now state-driven, not route-driven.

### SQONavigation Changes

- Accepts optional `onNavigate: (sectionId) => void` prop
- When `onNavigate` is provided: renders `<a>` with `onClick` + `preventDefault`
- When `onNavigate` is absent: falls back to Next.js `<Link>` (backward compatible)
- `activeSection` prop drives visual active state (state-driven, not prop-driven)

### URL Synchronization

- On panel switch: `router.push(targetPath, undefined, { shallow: true })`
- `shallow: true` updates the URL without triggering `getServerSideProps`
- Browser back/forward: `routeChangeComplete` event listener derives section from URL
- `deriveSectionFromPath(url)` maps URL segments to section identifiers

### Deep-Link Preservation

All 7 page files remain:
- `index.js` — overview (workspace entry point)
- `debt.js`, `continuity.js`, `maturity.js`, `progression.js`, `evidence.js`, `handoff.js`

Each page:
1. Calls `resolveWorkspaceData(client, run, sectionName)` in `getServerSideProps`
2. Renders `<SQOWorkspaceShell>` with `initialSection` set to its section
3. SSR produces the correct initial state for the section

Direct URL access to any section produces a fully-rendered workspace shell
with that section active — no redirect, no URL flicker.

## Browser Back/Forward

The workspace shell listens to Next.js `routeChangeComplete` events:
- Derives the section from the new URL path
- Updates `activeSection` state accordingly
- No page reload occurs (shallow routing preserved)
