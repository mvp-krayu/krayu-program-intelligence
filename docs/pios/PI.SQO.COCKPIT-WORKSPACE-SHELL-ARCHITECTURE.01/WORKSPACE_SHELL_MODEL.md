# Workspace Shell Model

## Architecture

The SQO Cockpit is a persistent operational workspace shell.
Navigation switches panels inside a stable shell rather than
performing full page transitions.

## Shell Structure

```
SQOWorkspaceShell
├── SQONavigation (persistent sidebar, onNavigate callback)
├── <main> sqo-cockpit__content
│   ├── degradedNotice (if any)
│   ├── [overview] OperationalAttentionLayout → SQOCognitiveLayoutShell
│   └── [section]  SQOWorkspacePanel → section-specific panel component
└── </main>
```

## Persistent Elements

The following remain mounted across all panel transitions:
- Navigation sidebar (SQONavigation)
- Cockpit chromatic class (visual state palette)
- Degradation notice (if applicable)
- Client/run identity context

## Panel Switching

Panel switching is state-driven via React `useState`:
- `activeSection` state determines which panel renders
- `navigateSection(sectionId)` updates state and URL
- URL updates use Next.js `router.push(path, undefined, { shallow: true })`
- No `getServerSideProps` re-execution on in-shell transitions

## Data Model

`SQOWorkspaceDataResolver.resolveWorkspaceData(client, runId, initialSection)`
loads ALL section data in a single call:
- Overview resolvers (journey, visual state, attention, workflow, deferred)
- All 6 section formatters (debt, continuity, maturity, progression, evidence, handoff)
- Navigation items
- Degradation state

This eliminates redundant `loadAllCockpitArtifacts` calls across pages.
