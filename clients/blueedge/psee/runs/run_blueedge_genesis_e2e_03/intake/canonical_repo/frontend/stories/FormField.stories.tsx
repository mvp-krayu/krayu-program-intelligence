import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

function FormField({ label, type = 'text', placeholder, required, error, helpText, value: initialValue, options }: {
  label: string; type?: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'password';
  placeholder?: string; required?: boolean; error?: string; helpText?: string;
  value?: string; options?: { value: string; label: string }[];
}) {
  const [value, setValue] = useState(initialValue || '');
  const id = label.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="form-field" style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{
        display: 'block', fontSize: '0.8rem', fontWeight: 600,
        color: 'var(--text-secondary)', marginBottom: 6,
      }}>
        {label} {required && <span style={{ color: 'var(--red)' }}>*</span>}
      </label>
      {type === 'select' ? (
        <select id={id} value={value} onChange={e => setValue(e.target.value)} style={{
          width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)',
          border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
          background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.85rem',
        }}>
          <option value="">Select...</option>
          {options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={id} value={value} onChange={e => setValue(e.target.value)}
          placeholder={placeholder} rows={4} style={{
            width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)',
            border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
            background: 'var(--bg-card)', color: 'var(--text-primary)',
            fontSize: '0.85rem', resize: 'vertical', fontFamily: 'var(--font)',
          }}
        />
      ) : (
        <input id={id} type={type} value={value} onChange={e => setValue(e.target.value)}
          placeholder={placeholder} style={{
            width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)',
            border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
            background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.85rem',
          }}
        />
      )}
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--red)', marginTop: 4, display: 'block' }}>{error}</span>}
      {helpText && !error && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>{helpText}</span>}
    </div>
  );
}

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof FormField>;

export const TextInput: Story = {
  args: { label: 'Vehicle Name', placeholder: 'Enter vehicle name', required: true },
};

export const EmailInput: Story = {
  args: { label: 'Email Address', type: 'email', placeholder: 'driver@blueedge.ae' },
};

export const NumberInput: Story = {
  args: { label: 'Fuel Capacity (L)', type: 'number', placeholder: '0', helpText: 'Enter capacity in litres' },
};

export const WithError: Story = {
  args: { label: 'License Plate', required: true, error: 'License plate is required' },
};

export const Select: Story = {
  args: {
    label: 'Vehicle Type', type: 'select',
    options: [
      { value: 'tanker', label: 'Tanker' },
      { value: 'bus', label: 'Bus' },
      { value: 'taxi', label: 'Taxi' },
      { value: 'truck', label: 'Truck' },
    ],
  },
};

export const Textarea: Story = {
  args: { label: 'Notes', type: 'textarea', placeholder: 'Add notes about this vehicle...' },
};

export const CompleteForm: Story = {
  render: () => (
    <div style={{ maxWidth: 480, background: 'var(--bg-card)', padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Add Vehicle</h3>
      <FormField label="License Plate" placeholder="DXB-0000" required />
      <FormField label="Vehicle Type" type="select" options={[
        { value: 'tanker', label: 'Tanker' },
        { value: 'bus', label: 'Bus' },
        { value: 'taxi', label: 'Taxi' },
      ]} required />
      <FormField label="Driver Email" type="email" placeholder="driver@blueedge.ae" />
      <FormField label="Fuel Capacity (L)" type="number" helpText="Enter capacity in litres" />
      <FormField label="Notes" type="textarea" placeholder="Additional notes..." />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-cyan">Save Vehicle</button>
      </div>
    </div>
  ),
};
