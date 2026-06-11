// SkeletonCard — shimmer loading placeholder for dashboards
// Session 26: mobile UX polish

import React from 'react';

interface SkeletonCardProps {
  variant?: 'stat' | 'chart' | 'table' | 'gauge';
  count?: number;
  className?: string;
}

function Shimmer({ width, height, radius }: { width?: string; height?: string; radius?: string }) {
  return (
    <div className="skeleton-shimmer" style={{
      width: width || '100%', height: height || '14px',
      borderRadius: radius || '6px',
    }} />
  );
}

function StatSkeleton() {
  return (
    <div className="stat-card skeleton-card">
      <Shimmer width="60%" height="10px" />
      <div style={{ height: 8 }} />
      <Shimmer width="45%" height="22px" />
      <div style={{ height: 6 }} />
      <Shimmer width="80%" height="8px" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="chart-card skeleton-card" style={{ minHeight: 260 }}>
      <Shimmer width="40%" height="14px" />
      <div style={{ height: 12 }} />
      <Shimmer height="200px" radius="8px" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="card skeleton-card" style={{ padding: 16 }}>
      <Shimmer width="30%" height="16px" />
      <div style={{ height: 16 }} />
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <Shimmer width="15%" height="12px" />
          <Shimmer width="25%" height="12px" />
          <Shimmer width="20%" height="12px" />
          <Shimmer width="15%" height="12px" />
          <Shimmer width="10%" height="12px" />
        </div>
      ))}
    </div>
  );
}

function GaugeSkeleton() {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div className="skeleton-shimmer" style={{ width: 100, height: 100, borderRadius: '50%' }} />
      <Shimmer width="60px" height="10px" />
    </div>
  );
}

export default function SkeletonCard({ variant = 'stat', count = 1, className = '' }: SkeletonCardProps) {
  const Component = variant === 'stat' ? StatSkeleton
    : variant === 'chart' ? ChartSkeleton
    : variant === 'table' ? TableSkeleton
    : GaugeSkeleton;

  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => <Component key={i} />)}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Shimmer width="200px" height="24px" />
        <div style={{ height: 6 }} />
        <Shimmer width="300px" height="12px" />
      </div>
      <div className="stats-grid">
        {[...Array(4)].map((_, i) => <StatSkeleton key={i} />)}
      </div>
      <div className="grid-2" style={{ marginTop: 14 }}>
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <div style={{ marginTop: 14 }}>
        <TableSkeleton />
      </div>
    </div>
  );
}
