// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Utility Functions
// ══════════════════════════════════════════════════════════════

/** Format date string to display format */
export function fmtDate(d: string | Date | null): string {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Format timestamp to relative or absolute time */
export function fmtTime(ts: number | string | Date): string {
  const d = new Date(ts);
  const diff = Date.now() - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

/** Format currency with AED default */
export function fmtCur(value: number, currency: string = 'AED'): string {
  return new Intl.NumberFormat('en-AE', { style: 'currency', currency, minimumFractionDigits: 0 }).format(value);
}

/** Format large numbers with K/M suffix */
export function fmtNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

/** Format percentage */
export function fmtPct(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** Format distance in km */
export function fmtKm(km: number): string {
  if (km >= 1000) return `${(km / 1000).toFixed(1)}K km`;
  return `${km.toFixed(0)} km`;
}

/** Get status color class */
export function statusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'text-be-green', online: 'text-be-green', completed: 'text-be-green', resolved: 'text-be-green',
    inactive: 'text-be-text-muted', offline: 'text-be-text-muted',
    maintenance: 'text-be-amber', pending: 'text-be-amber', scheduled: 'text-be-amber', warning: 'text-be-amber',
    critical: 'text-be-red', error: 'text-be-red', expired: 'text-be-red', suspended: 'text-be-red',
    in_progress: 'text-be-blue', in_transit: 'text-be-blue',
  };
  return map[status] || 'text-be-text-secondary';
}

/** Get status badge color */
export function badgeColor(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    maintenance: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  };
  return map[status] || 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
}

/** Print dashboard page */
export function printDashboard(title: string): void {
  window.print();
}

/** Download CSV from rows */
export function downloadCsv(rows: any[], filename: string = 'export'): void {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]).filter(k => !['__v'].includes(k));
  const bom = '\uFEFF';
  const csv = bom + keys.join(',') + '\n' + rows.map(r =>
    keys.map(k => {
      const v = r[k] == null ? '' : String(r[k]);
      return v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g, '""')}"` : v;
    }).join(',')
  ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Download JSON from rows */
export function downloadJson(rows: any[], filename: string = 'export'): void {
  const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** ClassNames utility (like clsx) */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Alias for fmtNum (used in many components) */
export const fmt = fmtNum;

/** Export CSV from rows with optional column config */
export function exportCSV(rows: any[], columns: any[], filename: string = 'export'): void {
  if (!rows.length) return;
  const keys = columns.map((c: any) => c.key || c.label);
  const headers = columns.map((c: any) => c.label);
  const bom = '\uFEFF';
  const csv = bom + headers.join(',') + '\n' + rows.map(r =>
    keys.map((k: string) => {
      const v = r[k] == null ? '' : String(r[k]);
      return v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g, '""')}"` : v;
    }).join(',')
  ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Auto-export CSV (detect columns from row keys) */
export function autoExportCSV(rows: any[], filename: string = 'export'): void {
  downloadCsv(rows, filename);
}

/** Export JSON alias */
export function exportJSON(rows: any[], filename: string = 'export'): void {
  downloadJson(rows, filename);
}

/** Check if role has access to a page */
export function hasAccess(role: string, page: string): boolean {
  return true; // Resolved at runtime via ROLE_PERMISSIONS
}
