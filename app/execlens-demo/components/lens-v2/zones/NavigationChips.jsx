import { useMemo } from 'react'

const ACTION_MAP = {
  executive: {
    implication: { label: 'Why it matters', icon: '→', targetMode: 'EXECUTIVE_BALANCED' },
    challenge: { label: 'Challenge this', icon: '?', targetMode: 'OPERATOR_DENSE' },
    adjacent: { label: 'What compounds', icon: '◇', targetMode: null },
    ascent: { label: 'Board view', icon: '↑', targetMode: null, boardroom: true },
  },
  operational: {
    challenge: { label: 'Prove it', icon: '?', targetMode: 'OPERATOR_DENSE' },
    descent: { label: 'Show evidence', icon: '↓', targetMode: 'OPERATOR_DENSE' },
    clarify: { label: 'Explain', icon: '⊙', targetMode: 'EXECUTIVE_DENSE' },
    adjacent: { label: 'What compounds', icon: '◇', targetMode: null },
    ascent: { label: 'Board view', icon: '↑', targetMode: null, boardroom: true },
  },
  structural: {
    clarify: { label: 'Explain', icon: '⊙', targetMode: 'EXECUTIVE_DENSE' },
    descent: { label: 'Show evidence', icon: '↓', targetMode: 'OPERATOR_DENSE' },
    adjacent: { label: 'What compounds', icon: '◇', targetMode: null },
    challenge: { label: 'Challenge this', icon: '?', targetMode: 'OPERATOR_DENSE' },
  },
}

const ACTION_FALLBACK = {
  implication: { label: 'Why it matters', icon: '→', targetMode: 'EXECUTIVE_BALANCED' },
  challenge: { label: 'Prove it', icon: '?', targetMode: 'OPERATOR_DENSE' },
  descent: { label: 'Show evidence', icon: '↓', targetMode: 'OPERATOR_DENSE' },
  adjacent: { label: 'What compounds', icon: '◇', targetMode: null },
  ascent: { label: 'Board view', icon: '↑', targetMode: null, boardroom: true },
  clarify: { label: 'Explain', icon: '⊙', targetMode: 'EXECUTIVE_DENSE' },
}

function resolveTargetZoneKey(continuation) {
  const reason = (continuation.reason || '').toLowerCase()
  const target = continuation.targetSurface
  if (reason.includes('diverge') || reason.includes('execution_center')) return 'interpret_runtime_divergence'
  if (reason.includes('rsig') || reason.includes('runtime signal')) return 'interpret_execution_blindness'
  if (reason.includes('propagation') || reason.includes('receiver')) return 'interpret_propagation_dynamics'
  if (reason.includes('theme') || reason.includes('posture')) return 'interpret_operational_posture'
  if (reason.includes('concentration') || reason.includes('domain_concentration')) return 'interpret_dependency_amplification'
  if (target === 'EXECUTION_BLINDNESS') return 'interpret_execution_blindness'
  if (target === 'PROPAGATION_RISK') return 'interpret_propagation_dynamics'
  if (target === 'GRAVITY_DIVERGENCE') return 'interpret_runtime_divergence'
  return 'interpret_primary_finding'
}

const TYPE_COLORS = {
  implication: '#ccd6f6',
  challenge: '#ff9e4a',
  descent: '#64ffda',
  adjacent: '#bb86fc',
  ascent: '#ffd700',
  clarify: '#4a9eff',
}

const QUAL_COLORS = {
  QUALIFIED: '#64ffda',
  PARTIALLY_QUALIFIED: '#e6b800',
  UNQUALIFIED: '#ff6b6b',
}

function resolveQualification(continuation, evidenceLayers) {
  const layers = evidenceLayers || []
  const layerSet = new Set(layers.map(l => typeof l === 'string' ? l : l.id))

  const te = continuation.targetEvidence
  if (!te) return { state: 'QUALIFIED', gap: null }

  const runtimeEvidence = ['RSIG', 'EVENT_FLOW', 'MQTT_TOPIC_FLOW', 'WEBSOCKET_FLOW']
  if (runtimeEvidence.includes(te)) {
    const hasRuntime = layerSet.has('EVENT_FLOW') || layerSet.has('MQTT_TOPIC_FLOW') || layerSet.has('WEBSOCKET_FLOW')
    if (!hasRuntime) return { state: 'UNQUALIFIED', gap: 'Runtime evidence not available' }
    return { state: 'QUALIFIED', gap: null }
  }

  if (te === 'centrality' || te === 'cognition_slices') {
    if (!layerSet.has('STATIC_IMPORT')) return { state: 'PARTIALLY_QUALIFIED', gap: 'Static enrichment limited' }
    return { state: 'QUALIFIED', gap: null }
  }

  return { state: 'QUALIFIED', gap: null }
}

function deriveChipsFromContinuations(crossDomainCognition, fullReport, projectionLevel, altitude) {
  try {
    const { deriveContinuations } = require('../../../lib/lens-v2/pios/CognitiveContinuations')
    const surfaceId = crossDomainCognition && crossDomainCognition.posture_label
      ? 'SYSTEMIC_OPERATIONAL_FRAGILITY' : 'STRUCTURAL_FRAGILITY'
    const ctx = {
      crossDomainCognition: crossDomainCognition || {},
      fullReport: fullReport || {},
    }
    return deriveContinuations(surfaceId, ctx, projectionLevel || 0, altitude || 'sovereign')
  } catch { return null }
}

function resolveTargetZoneKeyFromContext(crossDomainCognition) {
  const cdc = crossDomainCognition || {}
  const domConc = cdc.domain_concentration || []
  const primaryDomain = domConc.length > 0 ? domConc[0].domain : null
  const execCenter = cdc.execution_center || null
  const hasDivergence = execCenter && primaryDomain && execCenter.toLowerCase() !== primaryDomain.toLowerCase()
  if (hasDivergence) return 'interpret_runtime_divergence'
  const themes = cdc.consequence_themes || []
  if (themes.length > 0 && (themes[0].severity === 'CRITICAL' || themes[0].severity === 'HIGH')) return 'interpret_primary_finding'
  if (cdc.posture_scope === 'SYSTEMIC') return 'interpret_operational_posture'
  return 'interpret_primary_finding'
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

export default function NavigationChips({ crossDomainCognition, fullReport, projectionLevel, altitude, evidenceLayers, onModeTransition, onNavigate, compact }) {
  const continuations = useMemo(() =>
    deriveChipsFromContinuations(crossDomainCognition, fullReport, projectionLevel, altitude),
    [crossDomainCognition, fullReport, projectionLevel, altitude]
  )

  const TRAVERSAL_PATHS = {
    executive: [
      { typeKey: 'implication', label: 'Why it matters', icon: '→', color: '#ccd6f6', targetMode: 'EXECUTIVE_BALANCED' },
    ],
    operational: [
      { typeKey: 'challenge', label: 'Prove it', icon: '?', color: '#ff9e4a', targetMode: 'OPERATOR_DENSE' },
      { typeKey: 'descent', label: 'Show evidence', icon: '↓', color: '#64ffda', targetMode: 'EXECUTIVE_DENSE' },
      { typeKey: 'ascent', label: 'Board view', icon: '↑', color: '#ffd700', targetMode: null, boardroom: true },
    ],
    structural: [
      { typeKey: 'clarify', label: 'Explain', icon: '⊙', color: '#4a9eff', targetMode: 'EXECUTIVE_DENSE' },
      { typeKey: 'descent', label: 'Show evidence', icon: '↓', color: '#64ffda', targetMode: 'OPERATOR_DENSE' },
    ],
  }

  const traversalPath = TRAVERSAL_PATHS[altitude] || []
  const continuationChips = []
  if (continuations && continuations.ranked) {
    const altitudeActions = ACTION_MAP[altitude] || ACTION_MAP.operational || {}
    const traversalLabels = new Set(traversalPath.map(t => t.label))
    const seen = new Set()
    for (const c of continuations.ranked.filter(c => c.available && altitudeActions[c.typeKey])) {
      const action = altitudeActions[c.typeKey]
      if (!action || seen.has(action.label) || traversalLabels.has(action.label)) continue
      seen.add(action.label)
      continuationChips.push(c)
      if (continuationChips.length >= 2) break
    }
  }

  if (traversalPath.length === 0 && continuationChips.length === 0) return null

  function renderChip(label, icon, color, onClick, qualState) {
    return (
      <button
        key={label}
        type="button"
        onClick={onClick}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 10px', borderRadius: 4,
          background: color + '08', border: `1px solid ${color}30`,
          cursor: 'pointer', fontSize: 10, fontFamily: 'monospace',
          color, transition: 'border-color 0.15s, background 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = color + '18'; e.currentTarget.style.borderColor = color + '60' }}
        onMouseLeave={e => { e.currentTarget.style.background = color + '08'; e.currentTarget.style.borderColor = color + '30' }}
      >
        <span style={{ fontSize: 11 }}>{icon}</span>
        <span>{label}</span>
        {qualState && qualState !== 'QUALIFIED' && (
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: QUAL_COLORS[qualState], flexShrink: 0 }} />
        )}
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
      {traversalPath.map(t => renderChip(t.label, t.icon, t.color, () => {
        const ctx = buildInvestigationContext(crossDomainCognition, altitude, t.label)
        ctx.continuationType = t.typeKey
        const zoneKey = t.targetMode === 'EXECUTIVE_BALANCED' ? resolveTargetZoneKeyFromContext(crossDomainCognition) : null
        if (t.boardroom && onModeTransition) onModeTransition('EXECUTIVE_DENSE', null, null, ctx)
        else if (t.targetMode && onModeTransition) onModeTransition(t.targetMode, null, zoneKey, ctx)
      }))}
      {continuationChips.map((c, i) => {
        const altActions = ACTION_MAP[altitude] || ACTION_MAP.operational || {}
        const action = altActions[c.typeKey]
        if (!action) return null
        const color = TYPE_COLORS[c.typeKey] || '#7a8aaa'
        const qual = resolveQualification(c, evidenceLayers)
        return renderChip(action.label, action.icon, color, () => {
          const ctx = buildInvestigationContext(crossDomainCognition, altitude, action.label)
          ctx.continuationType = c.typeKey
          if (action.targetMode && onModeTransition) {
            const zoneKey = action.targetMode === 'EXECUTIVE_BALANCED' ? resolveTargetZoneKey(c) : null
            onModeTransition(action.targetMode, null, zoneKey, ctx)
          }
          if (onNavigate) onNavigate(c)
        }, qual.state)
      })}
    </div>
  )
}
