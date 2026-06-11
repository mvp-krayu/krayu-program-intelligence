import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function ExportToolbar({ formats, onExport }: { formats: string[]; onExport?: (format: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '8px 0' }}>
      {formats.map(f => (
        <button key={f} onClick={() => onExport?.(f)} style={{
          padding: '6px 12px', fontSize: '0.75rem', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)',
          color: 'var(--text-secondary)', cursor: 'pointer',
        }}>📥 {f.toUpperCase()}</button>
      ))}
    </div>
  );
}

const meta: Meta<typeof ExportToolbar> = { title: 'UI/ExportToolbar', component: ExportToolbar, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ExportToolbar>;
export const Default: Story = { args: { formats: ['csv', 'xlsx', 'pdf'] } };
export const Minimal: Story = { args: { formats: ['csv'] } };
