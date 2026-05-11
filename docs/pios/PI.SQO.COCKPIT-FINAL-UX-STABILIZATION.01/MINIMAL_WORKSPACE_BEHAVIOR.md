# Minimal Workspace Behavior

## Definition

For this contract, "workspace" means:

1. Left navigation rail remains visually persistent
2. Qualification context remains visually persistent
3. Navigation between sections feels contextual
4. Operator never feels lost in detached pages
5. Overview remains the operational anchor
6. Detail pages feel subordinate to the main cockpit
7. User can move between sections without browser-back

## Implementation

| Behavior | Implementation |
|----------|---------------|
| Persistent nav rail | SQONavigation rendered outside content area, sticky position |
| Persistent context | CLIENT/RUN identity always visible in rail header |
| Contextual navigation | onNavigate callback + shallow routing (no full page reload) |
| Orientation preserved | Active section highlighted, back-to-overview in detail panels |
| Overview anchor | First nav item, always accessible, explicit back button |
| Subordinate details | Contextual headers classify sections as "forensic detail" or "operational guidance" |
| No browser-back dependency | In-shell navigation via state-driven panel switching |

## Not Implemented (by design)

- SPA rewrite
- React state orchestration system
- Dockable windows
- Complex panel managers
- Real-time orchestration engine
