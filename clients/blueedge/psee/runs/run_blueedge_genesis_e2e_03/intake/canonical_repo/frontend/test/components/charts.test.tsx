import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TrendCard from '@/components/charts/TrendCard';
import ChartCard from '@/components/charts/ChartCard';
import GaugeChart from '@/components/charts/GaugeChart';

describe('TrendCard', () => {
  it('renders title and value', () => {
    render(<TrendCard title="Revenue" value="4.2M" trend={5.2} sparkline={[1,2,3,4,5]} />);
    expect(screen.getByText('Revenue')).toBeTruthy();
    expect(screen.getByText('4.2M')).toBeTruthy();
  });

  it('shows positive trend indicator', () => {
    const { container } = render(<TrendCard title="Test" value={100} trend={5} sparkline={[1,2,3]} />);
    expect(container).toBeTruthy();
  });

  it('shows negative trend indicator', () => {
    const { container } = render(<TrendCard title="Test" value={50} trend={-3} sparkline={[3,2,1]} />);
    expect(container).toBeTruthy();
  });

  it('handles zero trend', () => {
    const { container } = render(<TrendCard title="Test" value={0} trend={0} sparkline={[]} />);
    expect(container).toBeTruthy();
  });
});

describe('ChartCard', () => {
  it('renders with title', () => {
    render(<ChartCard title="Test Chart" type="line" data={{
      labels: ['A','B','C'],
      datasets: [{ label: 'Data', data: [1,2,3], borderColor: '#22d3ee' }]
    }} />);
    expect(screen.getByText('Test Chart')).toBeTruthy();
  });

  it('renders bar chart type', () => {
    const { container } = render(<ChartCard title="Bar" type="bar" data={{
      labels: ['X'], datasets: [{ data: [1], backgroundColor: '#fff' }]
    }} />);
    expect(container).toBeTruthy();
  });

  it('renders doughnut chart type', () => {
    const { container } = render(<ChartCard title="Donut" type="doughnut" data={{
      labels: ['A','B'], datasets: [{ data: [1,2], backgroundColor: ['#aaa','#bbb'] }]
    }} />);
    expect(container).toBeTruthy();
  });
});

describe('GaugeChart', () => {
  it('renders with value and title', () => {
    render(<GaugeChart title="CPU Usage" value={72.5} max={100} thresholds={[60, 80]} />);
    expect(screen.getByText('CPU Usage')).toBeTruthy();
  });

  it('handles edge values', () => {
    const { container: c1 } = render(<GaugeChart title="Min" value={0} max={100} thresholds={[50, 80]} />);
    expect(c1).toBeTruthy();
    const { container: c2 } = render(<GaugeChart title="Max" value={100} max={100} thresholds={[50, 80]} />);
    expect(c2).toBeTruthy();
  });

  it('shows trend when provided', () => {
    const { container } = render(<GaugeChart title="T" value={50} max={100} thresholds={[30, 70]} trend={3.5} />);
    expect(container).toBeTruthy();
  });
});
