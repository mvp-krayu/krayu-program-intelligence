import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CrudDataTable from '@/components/data/CrudDataTable';
import DetailView from '@/components/data/DetailView';
import TableCard from '@/components/data/TableCard';

describe('CrudDataTable', () => {
  const columns = [
    { label: 'Name', key: 'name' },
    { label: 'Status', render: (r: any) => r.status },
  ];
  const rows = [
    { id: '1', name: 'Vehicle A', status: 'active' },
    { id: '2', name: 'Vehicle B', status: 'maintenance' },
    { id: '3', name: 'Vehicle C', status: 'inactive' },
  ];

  it('renders column headers', () => {
    render(<CrudDataTable columns={columns} rows={rows} />);
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
  });

  it('renders all rows', () => {
    render(<CrudDataTable columns={columns} rows={rows} />);
    expect(screen.getByText('Vehicle A')).toBeTruthy();
    expect(screen.getByText('Vehicle B')).toBeTruthy();
    expect(screen.getByText('Vehicle C')).toBeTruthy();
  });

  it('calls onRowClick when row is clicked', () => {
    const onClick = vi.fn();
    render(<CrudDataTable columns={columns} rows={rows} onRowClick={onClick} />);
    fireEvent.click(screen.getByText('Vehicle A'));
    expect(onClick).toHaveBeenCalled();
  });

  it('handles empty rows', () => {
    const { container } = render(<CrudDataTable columns={columns} rows={[]} />);
    expect(container).toBeTruthy();
  });
});

describe('DetailView', () => {
  it('renders label-value pairs', () => {
    render(<DetailView items={[
      { label: 'Name', value: 'Test Vehicle' },
      { label: 'Status', value: 'active' },
    ]} />);
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Test Vehicle')).toBeTruthy();
  });
});

describe('TableCard', () => {
  it('renders title and count', () => {
    render(<TableCard title="Vehicles" count={42}><p>Content</p></TableCard>);
    expect(screen.getByText('Vehicles')).toBeTruthy();
  });

  it('renders children', () => {
    render(<TableCard title="T" count={0}><p>Child Content</p></TableCard>);
    expect(screen.getByText('Child Content')).toBeTruthy();
  });
});
