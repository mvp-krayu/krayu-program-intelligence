# Responsive Workspace Behavior

## Desktop (>1200px)
- Full multi-pane workspace
- 220px navigation rail + fluid content
- Cognitive layout shell with spine rail (220px) + main lane

## Laptop (800-1200px)
- Compressed workspace
- Navigation rail maintained at 220px
- Content area adapts to remaining width
- Spine rail may compress slightly

## Tablet/Narrow (<800px)
- Navigation rail remains accessible
- Content stacks vertically
- No destructive collapse behavior

## Stability Guarantees
- Navigation rail never overlaps content
- Hero region text never overflows
- Panel transitions are layout-stable (no reflow)
- Workspace grid uses flex, not absolute positioning
- `min-width: 0` on content area prevents flex overflow
