import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

function Pagination({ total, pageSize, page, onChange }: {
  total: number; pageSize: number; page: number; onChange: (p: number) => void;
}) {
  const pages = Math.ceil(total / pageSize);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0', fontSize: '0.8rem' }}>
      <span style={{ color: 'var(--text-muted)' }}>Showing {(page-1)*pageSize+1}–{Math.min(page*pageSize, total)} of {total}</span>
      <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
        <button onClick={() => onChange(Math.max(1, page-1))} disabled={page === 1}
          style={{ padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>←</button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)}
            style={{ padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: p === page ? 'var(--cyan)' : 'var(--bg-secondary)', color: p === page ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: p === page ? 600 : 400 }}>{p}</button>
        ))}
        <button onClick={() => onChange(Math.min(pages, page+1))} disabled={page === pages}
          style={{ padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', cursor: page === pages ? 'not-allowed' : 'pointer', opacity: page === pages ? 0.5 : 1 }}>→</button>
      </div>
    </div>
  );
}

function PaginationDemo() {
  const [page, setPage] = useState(1);
  return <Pagination total={342} pageSize={25} page={page} onChange={setPage} />;
}

const meta: Meta<typeof PaginationDemo> = { title: 'Data/Pagination', component: PaginationDemo, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof PaginationDemo>;
export const Default: Story = {};
