// ResponsivePageWrapper — Consistent mobile-first page structure
// Session 27: mobile UX polish
// Wraps page content with: PullToRefresh (mobile), time range selector, collapsible sections

import React from 'react';
import { useMediaQuery } from '@/hooks';
import PullToRefresh from '@/components/ui/PullToRefresh';
import PageHeader from '@/components/layout/PageHeader';

interface ResponsivePageWrapperProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  headerRight?: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
  children: React.ReactNode;
}

export default function ResponsivePageWrapper({
  title,
  subtitle,
  breadcrumb,
  headerRight,
  onRefresh,
  children,
}: ResponsivePageWrapperProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const content = (
    <div className="responsive-page">
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumb={breadcrumb || title}
        right={headerRight}
      />
      {children}
    </div>
  );

  if (isMobile && onRefresh) {
    return <PullToRefresh onRefresh={onRefresh}>{content}</PullToRefresh>;
  }

  return content;
}
