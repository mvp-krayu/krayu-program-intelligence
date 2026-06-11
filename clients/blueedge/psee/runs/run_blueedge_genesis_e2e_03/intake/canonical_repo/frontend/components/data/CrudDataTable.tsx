// Extracted from dashboard.html — CrudDataTable
// Line 1300 | 231 lines

import React, { useState, useEffect, useMemo } from 'react';
import { usePagination, useI18n } from '@/hooks';
import Toggle from '@/components/ui/Toggle';
import Pagination from '@/components/data/Pagination';

export default function CrudDataTable({ columns, rows, emptyMsg, onRowClick, onEdit, onDelete, idKey = 'id', onBulkDelete, onBulkExport, tableId }: any) {
  const { t } = useI18n();
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [colFilters, setColFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [savedViews, setSavedViews] = useState(() => {
    try { return JSON.parse(localStorage.getItem('be-views-' + (tableId||'default')) || '[]'); } catch { return []; }
  });
  const [activeView, setActiveView] = useState(null);

  // Action column
  const actionCol = (onEdit || onDelete) ? [{
    label: '',
    render: (row: any) => (
      <div className="row-actions" style={{opacity:1}}>
        {onEdit && <button className="action-btn edit" onClick={e => { e.stopPropagation(); onEdit(row); }} title="Edit">✎</button>}
        {onDelete && <button className="action-btn delete" onClick={e => { e.stopPropagation(); onDelete(row); }} title="Delete">✕</button>}
      </div>
    )
  }] : [];
  const allCols = [...columns, ...actionCol];

  // Get unique values for column filter dropdowns
  const colUniqueValues = useMemo(() => {
    if (!rows) return {};
    const map = {};
    columns.forEach(c => {
      if (!c.key) return;
      const vals = new Set();
      rows.forEach(r => { const v = r[c.key]; if (v != null && v !== '') vals.add(String(v)); });
      if (vals.size > 0 && vals.size <= 20) map[c.key] = [...vals].sort();
    });
    return map;
  }, [rows, columns]);

  // Column filter handler
  const setColFilter = (key, value) => {
    setColFilters(prev => {
      const next = { ...prev };
      if (!value) delete next[key]; else next[key] = value;
      return next;
    });
  };
  const clearAllFilters = () => { setColFilters({}); setSearch(''); setActiveView(null); };
  const hasActiveFilters = Object.keys(colFilters).length > 0 || search.trim();

  // Save view
  const saveView = () => {
    const name = prompt('Name this view:');
    if (!name) return;
    const view = { name, filters: { ...colFilters }, search, sortCol, sortDir };
    const updated = [...savedViews, view];
    setSavedViews(updated);
    setActiveView(name);
    try { localStorage.setItem('be-views-' + (tableId||'default'), JSON.stringify(updated)); } catch {}
  };
  const loadView = (view: any) => {
    setColFilters(view.filters || {});
    setSearch(view.search || '');
    if (view.sortCol != null) { setSortCol(view.sortCol); setSortDir(view.sortDir || 'asc'); }
    setActiveView(view.name);
  };
  const removeView = (name, e) => {
    e.stopPropagation();
    const updated = savedViews.filter(v => v.name !== name);
    setSavedViews(updated);
    if (activeView === name) setActiveView(null);
    try { localStorage.setItem('be-views-' + (tableId||'default'), JSON.stringify(updated)); } catch {}
  };

  // Combined filter: search + column filters
  const filteredRows = useMemo(() => {
    if (!rows) return [];
    let result = rows;
    // Column filters
    Object.entries(colFilters).forEach(([key, val]) => {
      if (!val) return;
      result = result.filter(r => String(r[key] || '').toLowerCase().includes(val.toLowerCase()));
    });
    // Global search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(row =>
        allCols.some(c => {
          if (!c.key) return false;
          const val = row[c.key];
          return val != null && String(val).toLowerCase().includes(q);
        }) || JSON.stringify(row).toLowerCase().includes(q)
      );
    }
    return result;
  }, [rows, search, colFilters]);

  // Sort
  const handleSort = (colIdx: any) => {
    const col = allCols[colIdx];
    if (!col.key) return;
    if (sortCol === colIdx) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(colIdx); setSortDir('asc'); }
  };

  const sortedRows = useMemo(() => {
    if (!filteredRows || sortCol === null) return filteredRows;
    const col = allCols[sortCol];
    if (!col.key) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      let va = a[col.key], vb = b[col.key];
      if (va == null) va = '';
      if (vb == null) vb = '';
      const na = parseFloat(va), nb = parseFloat(vb);
      if (!isNaN(na) && !isNaN(nb)) return sortDir === 'asc' ? na - nb : nb - na;
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
  }, [filteredRows, sortCol, sortDir]);

  // Selection helpers
  const toggleRow = (id, e) => {
    e.stopPropagation();
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };
  const toggleAll = () => {
    if (!pg.paginatedRows) return;
    const pageIds = pg.paginatedRows.map(r => r[idKey] || pg.paginatedRows.indexOf(r));
    const allSel = pageIds.every(id => selected.has(id));
    if (allSel) setSelected(new Set()); else setSelected(new Set([...selected, ...pageIds]));
  };
  const clearSelection = () => setSelected(new Set());
  const selectedRows = useMemo(() => (rows || []).filter(r => selected.has(r[idKey] || rows.indexOf(r))), [rows, selected]);

  useEffect(() => { setSelected(new Set()); }, [search, colFilters]);

  if (!rows || rows.length === 0) return <div style={{padding:30,textAlign:'center',color:'var(--text-muted)',fontSize:'.8rem'}}>{emptyMsg || t('No data available')}<br/>{onEdit && <button className="btn btn-ghost btn-sm empty-action" style={{marginTop:12}} onClick={() => onEdit(null)}>+ Add First Record</button>}</div>;

  const pg = usePagination(sortedRows || filteredRows, 15);

  return (
    <>
    {/* Search Bar + Filter Toggle */}
    <div className="table-search-bar">
      <div className="table-search-wrap">
        <span className="table-search-icon">🔍</span>
        <input className="table-search-input" placeholder={`Search ${rows.length} records...`}
          value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button className="table-search-clear" onClick={() => setSearch('')} style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)'}}>✕</button>}
      </div>
      {search && <span className="table-search-count">{filteredRows.length}/{rows.length}</span>}
      <button className={`bulk-btn ${showFilters?'active':''}`} onClick={() => setShowFilters(f=>!f)} style={showFilters?{borderColor:'var(--cyan-dim)',color:'var(--cyan)'}:{}}>🔽 Filters</button>
      {hasActiveFilters && <button className="filter-clear-all" onClick={clearAllFilters}>✕ Clear all</button>}
    </div>

    {/* Saved Views Bar */}
    {(savedViews.length > 0 || hasActiveFilters) && (
      <div className="saved-views-bar">
        <span style={{fontSize:'.65rem',color:'var(--text-muted)',whiteSpace:'nowrap'}}>Views:</span>
        {savedViews.map(v => (
          <button key={v.name} className={`sv-chip ${activeView===v.name?'active':''}`} onClick={() => loadView(v)}>
            {v.name}
            <span className="sv-remove" onClick={e => removeView(v.name, e)}>✕</span>
          </button>
        ))}
        {hasActiveFilters && <button className="sv-save-btn" onClick={saveView}>💾 Save View</button>}
      </div>
    )}

    {/* Bulk Action Bar */}
    {selected.size > 0 && (
      <div className="bulk-bar">
        <span className="bulk-count">{selected.size} selected</span>
        <button className="bulk-btn" onClick={clearSelection}>✕ Clear</button>
        <div className="bulk-actions">
          {onBulkExport && <button className="bulk-btn" onClick={() => onBulkExport(selectedRows)}>📥 Export</button>}
          {onBulkDelete && <button className="bulk-btn danger" onClick={() => onBulkDelete(selectedRows)}>🗑 Delete ({selected.size})</button>}
        </div>
      </div>
    )}

    <table className="data-table">
      <thead>
        <tr>
          <th style={{width:36,padding:'8px 6px'}}><input type="checkbox" className="bulk-checkbox"
            checked={pg.paginatedRows.length > 0 && pg.paginatedRows.every(r => selected.has(r[idKey] || pg.paginatedRows.indexOf(r)))}
            onChange={toggleAll} /></th>
          {allCols.map((c,i) => {
            const isSortable = !!c.key;
            const isSorted = sortCol === i;
            return <th key={i} className={`${isSortable ? 'sortable' : ''} ${isSorted ? 'sorted' : ''}`}
              onClick={() => isSortable && handleSort(i)}>
              {c.label}
              {isSortable && <span className="sort-icon">{isSorted ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</span>}
            </th>;
          })}
        </tr>
        {/* Column Filter Row */}
        {showFilters && (
          <tr className="col-filter-row">
            <td></td>
            {allCols.map((c,i) => (
              <td key={i}>{c.key ? (
                colUniqueValues[c.key] ? (
                  <select className={`col-filter-input ${colFilters[c.key]?'col-filter-active':''}`}
                    value={colFilters[c.key]||''} onChange={e => setColFilter(c.key, e.target.value)}>
                    <option value="">All</option>
                    {colUniqueValues[c.key].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                ) : (
                  <input className={`col-filter-input ${colFilters[c.key]?'col-filter-active':''}`}
                    placeholder="Filter..." value={colFilters[c.key]||''} onChange={e => setColFilter(c.key, e.target.value)} />
                )
              ) : null}</td>
            ))}
          </tr>
        )}
      </thead>
      <tbody>{(pg.paginatedRows).map((row, ri) => {
        const rowId = row[idKey] || ri;
        const isSelected = selected.has(rowId);
        return (
          <tr key={rowId} className={`${onRowClick ? 'clickable-row' : ''} ${isSelected ? 'row-selected' : ''}`} onClick={() => onRowClick && onRowClick(row)}>
            <td style={{width:36,padding:'8px 6px'}}><input type="checkbox" className="bulk-checkbox" checked={isSelected} onChange={e => toggleRow(rowId, e)} /></td>
            {allCols.map((c,ci) => <td key={ci}>{c.render ? c.render(row) : row[c.key]}</td>)}
          </tr>
        );
      })}</tbody>
    </table>
    <Pagination pg={pg} />
    </>
  );
}
