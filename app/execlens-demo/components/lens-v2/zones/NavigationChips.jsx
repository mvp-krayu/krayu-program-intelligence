import { useMemo } from 'react'

// ─── Chip State Machine ────────────────────────────────────────
// Three chip types:
//   Type 1 (SYNTHESIS): stay here, synthesize, update right panel
//   Type 2 (INVESTIGATION): navigate to evidence, create investigation
//   Type 3 (PROJECTION_SHIFT): change persona, carry context
//
// Intent is the primary object. Persona is the projection target.

const CHIP_TYPES = {
  SYNTHESIS: 'SYNTHESIS',
  INVESTIGATION: 'INVESTIGATION',
  PROJECTION_SHIFT: 'PROJECTION_SHIFT',
}

const PERSONA_CHIPS = {
  executive: [
    { label: 'What should we decide?', icon: '→', color: '#ccd6f6', chipType: CHIP_TYPES.SYNTHESIS, intent: 'governance_decision' },
    { label: 'How confident is this?', icon: '◈', color: '#64ffda', chipType: CHIP_TYPES.SYNTHESIS, intent: 'qualification_review' },
    { label: 'What else is affected?', icon: '◇', color: '#bb86fc', chipType: CHIP_TYPES.SYNTHESIS, intent: 'compounding_analysis' },
    { label: 'Show me the proof', icon: '↓', color: '#ff9e4a', chipType: CHIP_TYPES.INVESTIGATION, targetMode: 'OPERATOR_DENSE', continuationType: 'descent' },
  ],
  operational: [
    { label: 'What operations are affected?', icon: '→', color: '#ccd6f6', chipType: CHIP_TYPES.SYNTHESIS, intent: 'operational_impact' },
    { label: 'Prove it', icon: '?', color: '#ff9e4a', chipType: CHIP_TYPES.INVESTIGATION, targetMode: 'OPERATOR_DENSE', continuationType: 'challenge' },
    { label: 'Show the evidence', icon: '↓', color: '#64ffda', chipType: CHIP_TYPES.INVESTIGATION, targetMode: 'EXECUTIVE_DENSE', continuationType: 'descent' },
    { label: 'Board summary', icon: '↑', color: '#ffd700', chipType: CHIP_TYPES.PROJECTION_SHIFT, targetMode: 'BOARDROOM' },
  ],
  structural: [
    { label: 'Why does this happen?', icon: '⊙', color: '#4a9eff', chipType: CHIP_TYPES.SYNTHESIS, intent: 'structural_mechanism' },
    { label: 'What compounds?', icon: '◇', color: '#bb86fc', chipType: CHIP_TYPES.SYNTHESIS, intent: 'compounding_analysis' },
    { label: 'Verify the evidence', icon: '↓', color: '#64ffda', chipType: CHIP_TYPES.INVESTIGATION, targetMode: 'OPERATOR_DENSE', continuationType: 'descent' },
    { label: 'CTO view', icon: '↑', color: '#ffd700', chipType: CHIP_TYPES.PROJECTION_SHIFT, targetMode: 'EXECUTIVE_BALANCED' },
  ],
}

const TYPE_BADGES = {
  SYNTHESIS: null,
  INVESTIGATION: 'investigate',
  PROJECTION_SHIFT: null,
}

function buildInvestigationContext(crossDomainCognition, altitude, actionLabel) {
  const cdc = crossDomainCognition || {}
  const domConc = cdc.domain_concentration || []
  const themes = cdc.consequence_themes || []
  const primaryDomain = domConc.length > 0 ? domConc[0].domain : null
  const execCenter = cdc.execution_center || null
  const hasDivergence = execCenter && primaryDomain && execCenter.toLowerCase() !== primaryDomain.toLowerCase()
  const primaryTheme = themes.length > 0 ? themes[0] : null

  return {
    finding: hasDivergence ? 'structural_operational_divergence' : (primaryTheme ? primaryTheme.theme_label : cdc.posture_label || 'structural_assessment'),
    surface: hasDivergence ? 'GRAVITY_DIVERGENCE' : 'SYSTEMIC_OPERATIONAL_FRAGILITY',
    primaryDomain,
    executionCenter: execCenter,
    postureLabel: cdc.posture_label || null,
    fromAltitude: altitude,
    action: actionLabel,
    _crossDomainCognition: cdc,
  }
}

export default function NavigationChips({ crossDomainCognition, fullReport, projectionLevel, altitude, evidenceLayers, onModeTransition, onInlineSynthesis, onProjectionShift, compact }) {
  const chips = PERSONA_CHIPS[altitude] || []

  if (chips.length === 0) return null

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
      {chips.map(chip => {
        const badge = TYPE_BADGES[chip.chipType]
        return (
          <button
            key={chip.label}
            type="button"
            onClick={() => {
              if (chip.chipType === CHIP_TYPES.SYNTHESIS) {
                if (onInlineSynthesis) onInlineSynthesis(chip.intent, chip.label)
              } else if (chip.chipType === CHIP_TYPES.INVESTIGATION) {
                const ctx = buildInvestigationContext(crossDomainCognition, altitude, chip.label)
                ctx.continuationType = chip.continuationType
                if (onModeTransition) onModeTransition(chip.targetMode, null, null, ctx)
              } else if (chip.chipType === CHIP_TYPES.PROJECTION_SHIFT) {
                if (chip.targetMode === 'BOARDROOM') {
                  if (onProjectionShift) onProjectionShift('BOARDROOM')
                } else {
                  if (onProjectionShift) onProjectionShift(chip.targetMode)
                }
              }
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 4,
              background: chip.color + '08', border: `1px solid ${chip.color}30`,
              cursor: 'pointer', fontSize: 10, fontFamily: 'monospace',
              color: chip.color, transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = chip.color + '18'; e.currentTarget.style.borderColor = chip.color + '60' }}
            onMouseLeave={e => { e.currentTarget.style.background = chip.color + '08'; e.currentTarget.style.borderColor = chip.color + '30' }}
          >
            <span style={{ fontSize: 11 }}>{chip.icon}</span>
            <span>{chip.label}</span>
            {badge && (
              <span style={{ fontSize: 7, color: chip.color + '80', letterSpacing: '0.06em', marginLeft: 2 }}>{badge}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
