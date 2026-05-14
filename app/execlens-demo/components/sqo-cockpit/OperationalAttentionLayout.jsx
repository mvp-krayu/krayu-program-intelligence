export default function OperationalAttentionLayout({ attentionHierarchy, children }) {
  if (!attentionHierarchy) {
    return <div className="sqo-attention-layout">{children}</div>;
  }

  const focusClass = `sqo-attention-layout--focus-${attentionHierarchy.primary_focus}`;
  const loadClass = `sqo-attention-layout--load-${attentionHierarchy.cognitive_load}`;

  return (
    <div className={`sqo-attention-layout ${focusClass} ${loadClass}`}>
      {children}
    </div>
  );
}
