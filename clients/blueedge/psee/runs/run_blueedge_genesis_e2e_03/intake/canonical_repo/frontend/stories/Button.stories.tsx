import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function Button({ variant = 'default', size = 'md', children, icon, disabled, onClick }: {
  variant?: 'default' | 'primary' | 'cyan' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const cls = [
    'btn',
    variant !== 'default' ? `btn-${variant}` : '',
    size === 'sm' ? 'btn-sm' : '',
  ].filter(Boolean).join(' ');

  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {icon && <span style={{ display: 'flex', marginRight: 6 }}>{icon}</span>}
      {children}
    </button>
  );
}

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'primary', 'cyan', 'ghost', 'danger'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: 'Button' } };
export const Primary: Story = { args: { children: 'Save Changes', variant: 'primary' } };
export const Cyan: Story = { args: { children: 'Export Report', variant: 'cyan' } };
export const Ghost: Story = { args: { children: 'Cancel', variant: 'ghost' } };
export const Danger: Story = { args: { children: 'Delete Vehicle', variant: 'danger' } };
export const Small: Story = { args: { children: 'Small', size: 'sm' } };
export const Disabled: Story = { args: { children: 'Disabled', disabled: true } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="cyan">Cyan</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button disabled>Disabled</Button>
      <Button variant="primary" size="sm">Small</Button>
    </div>
  ),
};
