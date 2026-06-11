import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function DesignTokens() {
  const colors = [
    { name: '--bg-primary', label: 'Background Primary' },
    { name: '--bg-card', label: 'Card Background' },
    { name: '--bg-card-hover', label: 'Card Hover' },
    { name: '--bg-secondary', label: 'Secondary Background' },
    { name: '--cyan', label: 'Cyan (Brand)' },
    { name: '--cyan-dim', label: 'Cyan Dim' },
    { name: '--text-primary', label: 'Text Primary' },
    { name: '--text-secondary', label: 'Text Secondary' },
    { name: '--text-muted', label: 'Text Muted' },
    { name: '--border', label: 'Border' },
    { name: '--green', label: 'Green (Success)' },
    { name: '--amber', label: 'Amber (Warning)' },
    { name: '--red', label: 'Red (Error)' },
    { name: '--blue', label: 'Blue (Info)' },
    { name: '--purple', label: 'Purple (Accent)' },
  ];

  const typography = [
    { size: '2rem', weight: 700, label: 'Heading 1', text: 'Fleet Management' },
    { size: '1.5rem', weight: 600, label: 'Heading 2', text: 'Dashboard Overview' },
    { size: '1.1rem', weight: 600, label: 'Heading 3', text: 'Active Vehicles' },
    { size: '0.9rem', weight: 400, label: 'Body', text: 'The quick brown fox jumps over the lazy dog' },
    { size: '0.8rem', weight: 400, label: 'Small', text: 'Last updated 2 minutes ago' },
    { size: '0.75rem', weight: 600, label: 'Label', text: 'TOTAL VEHICLES' },
    { size: '0.85rem', weight: 500, label: 'Mono', text: 'DXB-7291', font: 'var(--mono)' },
  ];

  const spacing = [4, 8, 12, 16, 20, 24, 32, 48, 64];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Colors */}
      <section>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
          🎨 Color Tokens
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {colors.map(c => (
            <div key={c.name} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: 10, borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)', background: 'var(--bg-card)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                background: `var(${c.name})`, border: '1px solid var(--border)',
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{c.label}</div>
                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>{c.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
          📝 Typography
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {typography.map(t => (
            <div key={t.label} style={{
              display: 'flex', alignItems: 'baseline', gap: 16,
              padding: '8px 12px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)', background: 'var(--bg-card)',
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', width: 80, flexShrink: 0 }}>
                {t.label}
              </span>
              <span style={{
                fontSize: t.size, fontWeight: t.weight,
                color: 'var(--text-primary)',
                fontFamily: (t as any).font || 'var(--font)',
              }}>
                {t.text}
              </span>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--mono)', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                {t.size} / {t.weight}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing */}
      <section>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
          📏 Spacing Scale
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {spacing.map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono)', color: 'var(--text-muted)', width: 40, textAlign: 'right' }}>
                {s}px
              </span>
              <div style={{
                width: s, height: 16,
                background: 'var(--cyan)', borderRadius: 2, opacity: 0.7,
              }} />
            </div>
          ))}
        </div>
      </section>

      {/* Border Radius */}
      <section>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
          ⬜ Border Radius
        </h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {[
            { label: '--radius-sm (6px)', radius: 'var(--radius-sm)' },
            { label: '--radius (10px)', radius: 'var(--radius)' },
            { label: '50%', radius: '50%' },
          ].map(r => (
            <div key={r.label} style={{ textAlign: 'center' }}>
              <div style={{
                width: 60, height: 60,
                background: 'var(--cyan-dim)', border: '2px solid var(--cyan)',
                borderRadius: r.radius, margin: '0 auto 8px',
              }} />
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>
                {r.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const meta: Meta<typeof DesignTokens> = {
  title: 'Design System/Tokens',
  component: DesignTokens,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof DesignTokens>;

export const AllTokens: Story = {};
