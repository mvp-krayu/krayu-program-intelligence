# Guided Demo Choreography — 51.8

Stream: 51.8 — Guided Demo Choreography
Date: 2026-03-26
Branch: feature/51-8-guided-demo-choreography
Baseline: 8edaec6 (stream 51.7)

---

## Sequence

### Pre-demo (free explore)

1. User lands on page
2. PersonaPanel is open by default (`useState(['persona'])`)
3. Hero shows two-step guide:
   - Step 1: Select your lens persona (active until persona selected)
   - Step 2: Start Lens Demo (inactive until persona selected)
4. User selects persona in PersonaPanel → `setEnlPersona(personaId)` lifted to parent
5. Step 1 shows ✓ + persona label; Step 2 becomes active
6. Start Lens Demo button becomes enabled (`disabled={!enlPersona}` → false)
7. All panels toggleable freely (max 2 open)

### Demo start

1. User clicks Start Lens Demo
2. `handleStartDemo()` fires
3. Hard gate: `if (!enlPersona) return` — blocked if persona null [51.7 preserved]
4. `activeFlow` derived: `selectedFlow || PERSONA_DEFAULT_FLOW[enlPersona]`
5. Traversal mode activated: `setSelectedFlow(activeFlow)`
6. First traversal panel opened: `setOpenPanels([panels[0]])`
7. `setDemoActive(true)` — guided mode begins

### Guided demo (traversal mode)

1. Panel reveals controlled by `handleDemoNext` only
2. `handleToggle` returns early: `if (demoActive) return` — manual panel toggle disabled
3. Each Next advance: `setOpenPanels([panels[nextIndex]])` — single-focus-node [51.6]
4. Reveal order determined by persona-selected flow (PERSONA_DEFAULT_FLOW)
5. DemoController TraversalBar shows node position

### Demo exit

1. User clicks Exit or traversal reaches final node
2. `handleDemoExit()`: `setDemoActive(false)`, `setSelectedFlow(null)`, resets indexes
3. `handleToggle` resumes normal toggle behavior
4. Free explore mode restored

---

## Panel Reveal Order by Persona

| Persona   | Flow               | Traversal path                              |
|-----------|--------------------|--------------------------------------------|
| EXECUTIVE | executive_insight  | Defined by getFlowPanels('executive_insight') |
| CTO       | structural_analysis | Defined by getFlowPanels('structural_analysis') |
| ANALYST   | evidence_audit     | Defined by getFlowPanels('evidence_audit') |

---

## Invariants

- No panel toggle during guided demo
- Persona hard gate: demo cannot start without persona [51.7]
- No empty evidence states at any point [51.7]
- Free explore toggle unaffected when !demoActive
- Guided and free explore modes never share state

## Contract Authority

PIOS-51.8-RUN01-CONTRACT-v1
