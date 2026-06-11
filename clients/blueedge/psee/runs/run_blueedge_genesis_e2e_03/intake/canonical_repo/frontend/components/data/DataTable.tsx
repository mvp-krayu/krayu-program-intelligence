// Extracted from dashboard.html — DataTable
// Line 998 | 50 lines

import React, { useState, useMemo } from 'react';
import { usePagination, useI18n } from '@/hooks';
import Pagination from '@/components/data/Pagination';

export default function DataTable({ columns, rows, emptyMsg }: any) {
  const { t } = useI18n();
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  if (!rows || rows.length === 0) return <div style={{padding:30,textAlign:'center',color:'var(--text-muted)',fontSize:'.8rem'}}>{emptyMsg || t('No data available')}</div>;

  const handleSort = (colIdx: any) => {
    const col = columns[colIdx];
    if (!col.key) return; // Can't sort render-only columns
    if (sortCol === colIdx) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(colIdx); setSortDir('asc'); }
  };

  const sortedRows = useMemo(() => {
    if (sortCol === null) return rows;
    const col = columns[sortCol];
    if (!col.key) return rows;
    return [...rows].sort((a, b) => {
      let va = a[col.key], vb = b[col.key];
      if (va == null) va = '';
      if (vb == null) vb = '';
      // Numeric sort
      const na = parseFloat(va), nb = parseFloat(vb);
      if (!isNaN(na) && !isNaN(nb)) return sortDir === 'asc' ? na - nb : nb - na;
      // String sort
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [rows, sortCol, sortDir]);

  const pg = usePagination(sortedRows, 15);

  return (
    <>
    <table className="data-table">
      <thead><tr>{columns.map((c,i) => {
        const isSortable = !!c.key;
        const isSorted = sortCol === i;
        return <th key={i} className={`${isSortable ? 'sortable' : ''} ${isSorted ? 'sorted' : ''}`}
          onClick={() => isSortable && handleSort(i)}>
          {c.label}
          {isSortable && <span className="sort-icon">{isSorted ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</span>}
        </th>;
      })}</tr></thead>
      <tbody>{pg.paginatedRows.map((row, ri) => <tr key={ri}>{columns.map((c,ci) => <td key={ci}>{c.render ? c.render(row) : row[c.key]}</td>)}</tr>)}</tbody>
    </table>
    <Pagination pg={pg} />
    </>
  );
}
