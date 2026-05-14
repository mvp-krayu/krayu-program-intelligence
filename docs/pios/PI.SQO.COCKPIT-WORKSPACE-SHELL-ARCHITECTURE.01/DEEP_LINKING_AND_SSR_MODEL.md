# Deep-Linking and SSR Model

## Route Preservation

All cockpit routes remain functional for direct URL access:

| Route | Section | SSR | Shell |
|-------|---------|-----|-------|
| `/sqo/client/X/run/Y` | overview | YES | SQOWorkspaceShell |
| `/sqo/client/X/run/Y/debt` | debt | YES | SQOWorkspaceShell |
| `/sqo/client/X/run/Y/continuity` | continuity | YES | SQOWorkspaceShell |
| `/sqo/client/X/run/Y/maturity` | maturity | YES | SQOWorkspaceShell |
| `/sqo/client/X/run/Y/progression` | progression | YES | SQOWorkspaceShell |
| `/sqo/client/X/run/Y/evidence` | evidence | YES | SQOWorkspaceShell |
| `/sqo/client/X/run/Y/handoff` | handoff | YES | SQOWorkspaceShell |

## SSR Behavior

Every page route:
1. Calls `resolveWorkspaceData(client, run, sectionName)` server-side
2. Returns full workspace props including all section data
3. Renders `SQOWorkspaceShell` with `initialSection` set
4. SSR HTML contains the correct section active

## Shallow Routing Behavior

After initial SSR load:
1. In-shell navigation calls `router.push(path, undefined, { shallow: true })`
2. URL updates in the browser address bar
3. `getServerSideProps` does NOT re-execute
4. Panel content switches via React state
5. Browser history entries are created (back/forward works)

## Section Derivation

`deriveSectionFromPath(urlPath)` extracts the active section from any URL:
- Splits path by `/`, takes last segment
- If segment matches a known section name → returns it
- Otherwise → returns `'overview'`

This is used by the `routeChangeComplete` event handler to sync
`activeSection` state with browser navigation events.
