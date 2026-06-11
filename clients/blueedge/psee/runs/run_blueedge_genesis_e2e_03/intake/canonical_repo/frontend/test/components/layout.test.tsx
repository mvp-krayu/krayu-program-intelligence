import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PageHeader from '@/components/layout/PageHeader';
import TabBar from '@/components/ui/TabBar';

describe('PageHeader', () => {
  it('renders title and subtitle', () => {
    render(<PageHeader title="Fleet Dashboard" subtitle="Real-time fleet overview" breadcrumb="Dashboard" />);
    expect(screen.getByText('Fleet Dashboard')).toBeTruthy();
    expect(screen.getByText('Real-time fleet overview')).toBeTruthy();
  });

  it('renders right slot content', () => {
    render(<PageHeader title="Test" breadcrumb="T" right={<button>Action</button>} />);
    expect(screen.getByText('Action')).toBeTruthy();
  });
});

describe('TabBar', () => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    { id: 'analytics', label: 'Analytics' },
  ];

  it('renders all tabs', () => {
    render(<TabBar tabs={tabs} active="overview" onChange={vi.fn()} />);
    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Details')).toBeTruthy();
    expect(screen.getByText('Analytics')).toBeTruthy();
  });

  it('highlights active tab', () => {
    render(<TabBar tabs={tabs} active="details" onChange={vi.fn()} />);
    const btn = screen.getByText('Details');
    expect(btn).toBeTruthy();
  });

  it('calls onChange when tab clicked', () => {
    const onChange = vi.fn();
    render(<TabBar tabs={tabs} active="overview" onChange={onChange} />);
    fireEvent.click(screen.getByText('Analytics'));
    expect(onChange).toHaveBeenCalledWith('analytics');
  });
});
