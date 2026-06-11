import { printDashboard, exportCSV, autoExportCSV, exportJSON } from '@/utils';
// Extracted from dashboard.html — ExportToolbar
// Line 4838 | 20 lines

export default function ExportToolbar({ rows, columns, filename, title, compact }: any) {
  const hasData = rows && rows.length > 0;
  const doCSV = () => columns?.length ? exportCSV(rows, columns, filename) : autoExportCSV(rows, filename);
  if (compact) {
    return (
      <div className="export-toolbar">
        <button className="export-btn" onClick={doCSV} disabled={!hasData} title="Export CSV"><DownloadIcon /> CSV</button>
        <button className="export-btn" onClick={() => printDashboard(title || filename)} title="Print / PDF"><PrinterIcon /></button>
      </div>
    );
  }
  return (
    <div className="export-toolbar">
      <button className="export-btn primary" onClick={doCSV} disabled={!hasData}><DownloadIcon /> Export CSV</button>
      <button className="export-btn" onClick={() => exportJSON(rows, filename)} disabled={!hasData}><FileJsonIcon /> JSON</button>
      <div className="export-divider" />
      <button className="export-btn" onClick={() => printDashboard(title || filename)}><PrinterIcon /> Print / PDF</button>
    </div>
  );
}
