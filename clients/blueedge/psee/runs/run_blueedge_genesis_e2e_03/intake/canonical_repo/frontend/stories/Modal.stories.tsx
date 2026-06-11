import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

function Modal({ open, title, children, onClose }: {
  open: boolean; title: string; children?: React.ReactNode; onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: 24, minWidth: 400, maxWidth: '90vw', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>
        {children || <p style={{ color: 'var(--text-secondary)' }}>Modal content goes here</p>}
      </div>
    </div>
  );
}

function ModalDemo() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button onClick={() => setOpen(true)} style={{ padding: '8px 16px', background: 'var(--cyan)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}>Open Modal</button>
      <Modal open={open} title="Add Vehicle" onClose={() => setOpen(false)}>
        <p style={{ color: 'var(--text-secondary)' }}>Fill in vehicle details for the tanker fleet.</p>
      </Modal>
    </div>
  );
}

const meta: Meta<typeof ModalDemo> = { title: 'UI/Modal', component: ModalDemo, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ModalDemo>;
export const Default: Story = {};
