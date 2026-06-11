// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet Platform — API Versioning Configuration
// ══════════════════════════════════════════════════════════════

import { VersioningType } from '@nestjs/common';

export const CURRENT_VERSION = '2';
export const DEPRECATED_VERSIONS = ['1'];
export const SUPPORTED_VERSIONS = ['1', '2'];
export const DEFAULT_VERSION = '1';

// Deprecation date for v1
export const V1_SUNSET_DATE = '2027-01-01';
export const V1_DEPRECATION_DATE = '2026-06-01';

export const versioningConfig = {
  type: VersioningType.URI as const,
  defaultVersion: DEFAULT_VERSION,
  prefix: 'api/v',
};

// Version change log for documentation
export const versionChanges = {
  '2': {
    released: '2026-02-12',
    description: 'Enhanced response envelopes, cursor pagination, streaming telemetry',
    breaking: [
      'All responses wrapped in { data, meta, links } envelope',
      'Pagination changed from page/limit to cursor-based',
      'Vehicle telemetry returns ISO 8601 timestamps',
      'Alert severity enum changed: info→low, warning→medium, error→high, critical→critical',
    ],
    additions: [
      'HATEOAS links in all responses',
      'Cursor-based pagination with next/prev links',
      'Streaming telemetry via SSE endpoint',
      'Bulk operations (POST /vehicles/bulk, DELETE /vehicles/bulk)',
      'Partial responses with ?fields= parameter',
      'Rate limit headers on all responses',
      'ETag support for conditional requests',
    ],
  },
  '1': {
    released: '2026-01-15',
    deprecated: V1_DEPRECATION_DATE,
    sunset: V1_SUNSET_DATE,
    description: 'Original API release with full fleet management capabilities',
  },
};
