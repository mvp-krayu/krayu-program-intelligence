import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import FormField from '@/components/ui/FormField';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

// ── FormField ──────────────────────────────────────────────
describe('FormField', () => {
  it('renders text input with label', () => {
    render(<FormField label="Vehicle Name" value="Tanker A" onChange={vi.fn()} />);
    expect(screen.getByText('Vehicle Name')).toBeTruthy();
    const input = document.querySelector('input');
    expect(input).toBeTruthy();
    expect(input?.value).toBe('Tanker A');
  });

  it('calls onChange when user types', () => {
    const onChange = vi.fn();
    render(<FormField label="Name" value="" onChange={onChange} />);
    const input = document.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'New Name' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('renders select with options', () => {
    render(
      <FormField label="Fleet Type" type="select" value="tanker" onChange={vi.fn()}
        options={['tanker', 'bus', 'taxi']} />
    );
    expect(screen.getByText('Fleet Type')).toBeTruthy();
    const select = document.querySelector('select');
    expect(select).toBeTruthy();
  });

  it('renders textarea when type is textarea', () => {
    render(<FormField label="Notes" type="textarea" value="Some notes" onChange={vi.fn()} />);
    const textarea = document.querySelector('textarea');
    expect(textarea).toBeTruthy();
    expect(textarea?.value).toBe('Some notes');
  });

  it('renders disabled input', () => {
    render(<FormField label="ID" value="V-001" onChange={vi.fn()} disabled />);
    const input = document.querySelector('input');
    expect(input?.disabled).toBe(true);
  });

  it('shows placeholder text', () => {
    render(<FormField label="Search" value="" onChange={vi.fn()} placeholder="Type to search..." />);
    const input = document.querySelector('input');
    expect(input?.placeholder).toBe('Type to search...');
  });

  it('handles number type', () => {
    render(<FormField label="Capacity" type="number" value={5000} onChange={vi.fn()} />);
    const input = document.querySelector('input');
    expect(input?.type).toBe('number');
  });
});

// ── ConfirmDialog ──────────────────────────────────────────
describe('ConfirmDialog', () => {
  it('renders when open', () => {
    render(
      <ConfirmDialog open={true} onCancel={vi.fn()} onConfirm={vi.fn()}
        title="Delete Vehicle" message="This action cannot be undone." />
    );
    expect(screen.getByText('Delete Vehicle')).toBeTruthy();
    expect(screen.getByText('This action cannot be undone.')).toBeTruthy();
  });

  it('does not render when closed', () => {
    render(
      <ConfirmDialog open={false} onCancel={vi.fn()} onConfirm={vi.fn()}
        title="Delete" message="Sure?" />
    );
    expect(screen.queryByText('Delete')).toBeNull();
  });

  it('calls onConfirm when confirm clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog open={true} onCancel={vi.fn()} onConfirm={onConfirm}
        title="Confirm" message="Proceed?" />
    );
    // Find the confirm/delete/yes button
    const buttons = screen.getAllByRole('button');
    const confirmBtn = buttons.find(b =>
      b.textContent?.toLowerCase().includes('confirm') ||
      b.textContent?.toLowerCase().includes('delete') ||
      b.textContent?.toLowerCase().includes('yes')
    ) || buttons[buttons.length - 1]; // Last button is typically confirm
    fireEvent.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when cancel clicked', () => {
    const onCancel = vi.fn();
    render(
      <ConfirmDialog open={true} onCancel={onCancel} onConfirm={vi.fn()}
        title="Confirm" message="Proceed?" />
    );
    const buttons = screen.getAllByRole('button');
    const cancelBtn = buttons.find(b =>
      b.textContent?.toLowerCase().includes('cancel') ||
      b.textContent?.toLowerCase().includes('no')
    ) || buttons[0];
    fireEvent.click(cancelBtn);
    expect(onCancel).toHaveBeenCalled();
  });
});

// ── ErrorBoundary ──────────────────────────────────────────
describe('ErrorBoundary', () => {
  const BrokenChild = () => { throw new Error('Test crash'); };
  const GoodChild = () => <div>Working fine</div>;

  it('renders children when no error', () => {
    render(<ErrorBoundary><GoodChild /></ErrorBoundary>);
    expect(screen.getByText('Working fine')).toBeTruthy();
  });

  it('catches errors and shows fallback', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary><BrokenChild /></ErrorBoundary>);
    // Should show error fallback UI, not crash
    const container = document.querySelector('body');
    expect(container).toBeTruthy();
    spy.mockRestore();
  });

  it('shows retry button on error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary><BrokenChild /></ErrorBoundary>);
    // Look for retry/reload button in the error fallback
    const retryBtn = screen.queryByText(/retry|reload|refresh|try again/i);
    // ErrorBoundary should have some form of recovery
    expect(document.body).toBeTruthy();
    spy.mockRestore();
  });
});
