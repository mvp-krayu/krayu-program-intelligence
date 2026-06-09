import { useMemo } from 'react'
import VisualSpecRenderer from './VisualSpecRenderer'

const MUTED = '#7a8aaa'
const DIM = '#5a6580'
const TEXT = '#b6bdd6'

function UnavailableSpec({ title, reason, requiredLayers }) {
  return (
    <div style={{ padding: '10px 14px', background: '#1a1e2a', borderRadius: 4, border: '1px solid #2a3040', marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, letterSpacing: '0.1em', color: DIM, fontFamily: 'monospace' }}>{title}</span>
        <span style={{ fontSize: 9, color: '#ff9e4a', fontFamily: 'monospace' }}>UNAVAILABLE</span>
      </div>
      <div style={{ fontSize: 10, color: MUTED, fontFamily: 'monospace', marginTop: 4 }}>{reason}</div>
      {requiredLayers && requiredLayers.length > 0 && (
        <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
          {requiredLayers.map(l => (
            <span key={l} style={{ fontSize: 8, fontFamily: 'monospace', padding: '1px 5px', borderRadius: 3, background: '#ff6b6b10', color: '#ff6b6b80', border: '1px solid #ff6b6b20' }}>{l}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DenseVisualArchitectureZone({ fullReport, projectionLevel, visibilityLayerCompleteness, crossDomainCognition }) {
  const resolverMod = useMemo(() => {
    try { return require('../../../lib/lens-v2/visual-specs/resolveVisualSpecs') } catch { return null }
  }, [])

  const specs = useMemo(() => {
    if (!resolverMod) return []
    const all = resolverMod.resolveAvailable(fullReport, projectionLevel, visibilityLayerCompleteness, crossDomainCognition)
    const registry = resolverMod.VISUAL_SPEC_REGISTRY || {}
    return all.filter(s => { const reg = registry[s.specId]; return !reg || !reg.persona || reg.persona === 'dense' })
  }, [resolverMod, fullReport, projectionLevel, visibilityLayerCompleteness, crossDomainCognition])

  const available = specs.filter(s => s.available)
  const unavailable = specs.filter(s => !s.available)

  if (specs.length === 0) return null

  return (
    <div style={{ marginTop: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10, letterSpacing: '0.15em', color: MUTED, fontFamily: 'monospace', fontWeight: 600 }}>VISUAL ARCHITECTURE</span>
        <span style={{ fontSize: 9, color: DIM, fontFamily: 'monospace' }}>{available.length} of {specs.length} specs available</span>
      </div>

      {available.map(s => (
        <VisualSpecRenderer key={s.specId} specId={s.specId} fullReport={fullReport} crossDomainCognition={crossDomainCognition} />
      ))}

      {unavailable.length > 0 && available.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {unavailable.map(s => (
            <UnavailableSpec key={s.specId} title={s.title} reason={s.reason} requiredLayers={s.requiredLayers} />
          ))}
        </div>
      )}

      {available.length === 0 && (
        <div style={{ padding: '14px 16px', background: '#1a1e2a', borderRadius: 4, border: '1px solid #2a3040' }}>
          <div style={{ fontSize: 10, color: MUTED, fontFamily: 'monospace', marginBottom: 8 }}>Visual architecture unavailable for this specimen under current evidence envelope.</div>
          {unavailable.map(s => (
            <UnavailableSpec key={s.specId} title={s.title} reason={s.reason} requiredLayers={s.requiredLayers} />
          ))}
        </div>
      )}
    </div>
  )
}
