// Extracted from dashboard.html — FileAttachments
// Line 5646 | 48 lines

import React, { useState, useRef } from 'react';

export default function FileAttachments({ files, onChange }: any) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const items = files || [];

  const addFiles = (newFiles: FileList | File[]) => {
    const mocked = Array.from(newFiles).map((f: File) => ({
      name: f.name || `file-${Date.now()}.pdf`,
      size: f.size ? `${(f.size/1024).toFixed(1)} KB` : '12.4 KB',
      type: f.type || 'application/pdf',
      id: Date.now() + Math.random(),
    }));
    onChange([...items, ...mocked]);
  };
  const removeFile = (id: any) => onChange(items.filter(f => f.id !== id));

  const onDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); };

  const typeIcons = { 'application/pdf':'📄', 'image/':'🖼', 'text/':'📝' };
  const getIcon = (type: any) => Object.entries(typeIcons).find(([k]) => type?.startsWith(k))?.[1] || '📎';

  return (
    <div>
      <div className={`attachment-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}>
        <input ref={fileInputRef} type="file" multiple style={{display:'none'}} onChange={e => { if (e.target.files.length) addFiles(e.target.files); e.target.value=''; }} />
        <div style={{fontSize:'1.2rem',marginBottom:4}}>📎</div>
        <div style={{fontSize:'.75rem',color:'var(--text-muted)'}}>Drop files here or click to upload</div>
        <div style={{fontSize:'.62rem',color:'var(--text-muted)',marginTop:2}}>PDF, images, documents — max 10 MB each</div>
      </div>
      {items.length > 0 && (
        <div className="attachment-list">
          {items.map(f => (
            <div key={f.id} className="attachment-chip">
              <span>{getIcon(f.type)}</span>
              <span>{f.name}</span>
              <span className="attachment-count">{f.size}</span>
              <span className="att-remove" onClick={() => removeFile(f.id)}>✕</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
