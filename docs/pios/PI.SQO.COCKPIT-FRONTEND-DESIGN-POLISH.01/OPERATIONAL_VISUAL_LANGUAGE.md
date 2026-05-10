# Operational Visual Language

## Visual Hierarchy

| Level | Element | Treatment |
|-------|---------|-----------|
| 1 (Dominant) | S-state identifier | 44px bold, accent color |
| 2 (Primary) | Blockage cards | Inset severity lane, background tint |
| 3 (Secondary) | Section titles | 13px uppercase, letter-spaced |
| 4 (Operational) | Data values | Monospace, standard text color |
| 5 (Supporting) | Descriptions | Sans-serif, dim text color |
| 6 (Deferred) | Collapse zones | Quieter title, reduced weight |
| 7 (Contextual) | Governance footer | 10px, muted, centered |

## Typography Roles

| Role | Font | Size | Weight |
|------|------|------|--------|
| S-state | mono | 44px | 700 |
| Section title | mono | 13px | 700 |
| Data label | mono | 9-10px | 700 |
| Data value | mono | 11-13px | 400 |
| Description | sans | 12px | 400 |
| Narrative | sans | 12px | italic |
| Action guidance | sans | 11px | 400 |

## Depth Layering

| Surface | Background | Shadow | Border |
|---------|------------|--------|--------|
| Shell | --bg | none | none |
| Panel | --bg-panel | none | border-dim bottom |
| Card | --bg-card | 0 1px 4px | border-dim |
| Card elevated | --bg-card | 0 2px 8px | border (hover) |
| Recessed | --bg-card-deep | none | border-dim |
| Tinted context | rgba overlay | none | border-radius |

## Interaction States

| Element | Default | Hover | Focus |
|---------|---------|-------|-------|
| Nav item | transparent | accent-bg 4% | focus-visible outline |
| Blocker card | shadow-sm | shadow-md | outline |
| Collapse trigger | bg-card | bg-card-deep | outline |
| Forensic link | transparent border | accent border/bg | outline |
| Gate item | transparent | tinted bg | outline |

## Severity Visual Language

| Severity | Color | Shadow Lane | Background |
|----------|-------|-------------|------------|
| Projection | --red | inset 3px red | 6% red |
| Expansion | --accent | inset 3px blue | 4% blue |
| Remediation | --orange | inset 3px orange | 4% orange |
| Clear | --green | none | transparent |
