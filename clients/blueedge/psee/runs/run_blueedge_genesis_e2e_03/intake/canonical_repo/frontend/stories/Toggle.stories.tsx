import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

function Toggle({ checked, onChange, label, disabled }: {
  checked: boolean; onChange: (val: boolean) => void; label?: string; disabled?: boolean;
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
      <div onClick={() => !disabled && onChange(!checked)} style={{
        width: 44, height: 24, borderRadius: 12, background: checked ? 'var(--cyan)' : 'var(--border-active)',
        position: 'relative', transition: 'background 0.2s',
      }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: '#fff',
          position: 'absolute', top: 3, left: checked ? 23 : 3, transition: 'left 0.2s' }} />
      </div>
      {label && <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{label}</span>}
    </label>
  );
}

function ToggleDemo() {
  const [val, setVal] = useState(false);
  return <Toggle checked={val} onChange={setVal} label="Enable real-time tracking" />;
}

const meta: Meta<typeof ToggleDemo> = { title: 'UI/Toggle', component: ToggleDemo, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ToggleDemo>;
export const Default: Story = {};
