import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function Loading({ message, size }: { message?: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 20 : size === 'lg' ? 48 : 32;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 32 }}>
      <div style={{ width: s, height: s, border: `3px solid var(--border)`, borderTopColor: 'var(--cyan)',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      {message && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{message}</span>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const meta: Meta<typeof Loading> = { title: 'UI/Loading', component: Loading, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Loading>;

export const Default: Story = {};
export const WithMessage: Story = { args: { message: 'Loading fleet data...' } };
export const Small: Story = { args: { size: 'sm', message: 'Fetching...' } };
export const Large: Story = { args: { size: 'lg', message: 'Loading tanker operations dashboard...' } };
