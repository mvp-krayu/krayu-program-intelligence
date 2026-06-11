import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav style={{ display: 'flex', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)', padding: '8px 0' }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: 'var(--border-active)' }}>/</span>}
          {item.href ? (
            <a href={item.href} style={{ color: 'var(--cyan)', textDecoration: 'none' }}>{item.label}</a>
          ) : (
            <span style={{ color: 'var(--text-primary)' }}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

const meta: Meta<typeof Breadcrumbs> = { title: 'Layout/Breadcrumbs', component: Breadcrumbs, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = { args: { items: [{ label: 'Home', href: '/' }, { label: 'Fleet', href: '/fleet' }, { label: 'Tanker Operations' }] } };
export const Deep: Story = { args: { items: [{ label: 'Home', href: '/' }, { label: 'Intelligence', href: '/intelligence' }, { label: 'Analytics', href: '/analytics' }, { label: 'Fuel Trends' }] } };
