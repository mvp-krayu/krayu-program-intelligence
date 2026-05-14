export default function QualifierMandate({ qualifierClass, qualifierLabel, qualifierNote, visible }) {
  if (!visible || !qualifierClass) return null
  if (qualifierClass === 'Q-01' || qualifierClass === 'Q-04') return null
  if (qualifierClass === 'Q-00') return null
  const label = qualifierLabel
    || (qualifierClass === 'Q-02' ? 'Partial Grounding · Structural Continuity'
       : qualifierClass === 'Q-03' ? 'Semantic Continuity Only'
       : 'Partial Signal Grounding')
  const note = qualifierNote
    || (qualifierClass === 'Q-02'
        ? 'Semantic continuity is validated. Some semantic domains lack structural backing; advisory confirmation is mandatory before executive commitment.'
        : qualifierClass === 'Q-03'
        ? 'Structural backing is absent. Only semantic continuity supports the projection. Executive caution mandatory.'
        : 'Signal grounding is partial. Advisory review is mandatory before executive commitment on qualified signals.')
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
