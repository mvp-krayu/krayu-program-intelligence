import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function ConnectionStatus({ status }: { status: 'connected' | 'disconnected' | 'reconnecting' }) {
  const config = {
    connected: { color: 'var(--green)', label: 'Live', icon: '●' },
    disconnected: { color: 'var(--red)', label: 'Offline', icon: '○' },
    reconnecting: { color: 'var(--amber)', label: 'Reconnecting...', icon: '◌' },
  };
  const c = config[status];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: c.color }}>
      <span style={{ fontSize: '0.6rem' }}>{c.icon}</span> {c.label}
    </div>
  );
}

const meta: Meta<typeof ConnectionStatus> = { title: 'Realtime/ConnectionStatus', component: ConnectionStatus, tags: ['autodocs'],
  argTypes: { status: { control: 'select', options: ['connected', 'disconnected', 'reconnecting'] } } };
export default meta;
type Story = StoryObj<typeof ConnectionStatus>;

export const Connected: Story = { args: { status: 'connected' } };
export const Disconnected: Story = { args: { status: 'disconnected' } };
export const Reconnecting: Story = { args: { status: 'reconnecting' } };
