export default function QualifierMandate({ qualifierClass, qualifierLabel, qualifierNote, visible, visibilityLayerCompleteness }) {
  if (!visible || !qualifierClass) return null
  if (qualifierClass === 'Q-01' || qualifierClass === 'Q-04') return null
  if (qualifierClass === 'Q-00') return null
  const label = qualifierLabel
    || (qualifierClass === 'Q-02' ? 'Partial Grounding · Structural Continuity'
       : qualifierClass === 'Q-03' ? 'Semantic Continuity Only'
       : 'Partial Signal Grounding')

  const vlc = visibilityLayerCompleteness
  let note
  if (vlc && vlc.verdict_scope === 'SYSTEM_CONNECTIVITY' && vlc.completeness === 100) {
    note = `Static-import backing is partial. System visibility is complete — ${vlc.measured_count}/${vlc.required_count} connectivity layers measured for ${vlc.architecture_profile} profile.`
  } else if (vlc && vlc.qualifier_modifier === 'VISIBILITY_INCOMPLETE') {
    note = (qualifierNote || '') + ` ${vlc.measured_count}/${vlc.required_count} visibility layers measured — ${vlc.layers_missing.map(l => l.name).join(', ')} not yet assessed.`
  } else {
    note = qualifierNote
      || (qualifierClass === 'Q-02'
          ? 'Semantic continuity is validated. Some semantic domains lack structural backing; advisory confirmation is mandatory before executive commitment.'
          : qualifierClass === 'Q-03'
          ? 'Structural backing is absent. Only semantic continuity supports the projection. Executive caution mandatory.'
          : 'Signal grounding is partial. Advisory review is mandatory before executive commitment on qualified signals.')
  }

  return (
    <div className="qualifier-mandate" role="alert" aria-atomic="true">
      <div className="qualifier-mandate-left">
        <span className="qualifier-mandate-class">QUALIFIER {qualifierClass}</span>
        <span className="qualifier-mandate-sublabel">{label}</span>
      </div>
      <div className="qualifier-mandate-text">{note}</div>
    </div>
  )
}
