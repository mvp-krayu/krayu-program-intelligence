// Extracted from dashboard.html — FormField
// Line 1264 | 20 lines

export default function FormField({ label, type = 'text', value, onChange, options, placeholder, hint, error, required, fullWidth, readOnly, rows }: any) {
  const cls = fullWidth ? 'field full-width' : 'field';
  return (
    <div className={cls}>
      <label>{label}{required && <span style={{color:'var(--red)'}}> *</span>}</label>
      {type === 'select' ? (
        <select value={value || ''} onChange={e => onChange(e.target.value)} disabled={readOnly}>
          <option value="">{placeholder || `Select ${label.toLowerCase()}...`}</option>
          {(options || []).map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows || 3} readOnly={readOnly} />
      ) : (
        <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} readOnly={readOnly} />
      )}
      {error && <div className="field-error">{error}</div>}
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}
