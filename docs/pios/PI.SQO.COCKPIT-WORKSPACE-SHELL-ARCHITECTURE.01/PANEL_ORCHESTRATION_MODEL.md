# Panel Orchestration Model

## Panel Types

### Primary (Overview)
Renders the full cognitive layout shell:
- QualificationStateRibbon
- QualificationHeroRegion
- BlockerDominanceLayer
- OperationalWorkflowSpine
- WorkflowStageCluster
- ProgressionRail
- DeferredDebtCollapseZone
- Forensic links

### Secondary (Detail Sections)
Each renders a single focused panel:
- `debt` → SemanticDebtPanel
- `continuity` → ContinuityAssessmentPanel
- `maturity` → MaturityProfilePanel
- `progression` → ProgressionReadinessPanel
- `evidence` → EvidenceReplayPanel
- `handoff` → HandoffReadinessPanel

## Dispatch Mechanism

`SQOWorkspacePanel.jsx` maps section identifiers to panel components:

```
SECTION_PANELS = {
  debt: SemanticDebtPanel,
  continuity: ContinuityAssessmentPanel,
  maturity: MaturityProfilePanel,
  progression: ProgressionReadinessPanel,
  evidence: EvidenceReplayPanel,
  handoff: HandoffReadinessPanel,
}
```

Each panel receives its pre-formatted data from `sectionData[section]`.
No panel component was modified — they receive the same props as before.

## Transition Animation

Section panels mount with `sqo-panel-enter` animation:
- 0.15s ease-out
- Fade from opacity 0 + translateY(4px)
- Supports cognition without distraction
