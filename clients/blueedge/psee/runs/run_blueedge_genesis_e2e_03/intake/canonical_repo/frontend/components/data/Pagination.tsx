// Extracted from dashboard.html — Pagination
// Line 1071 | 27 lines

export default function Pagination({ pg }: any) {
  if (pg.total <= 10) return null; // Don't show for small datasets
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, pg.page - Math.floor(maxVisible / 2));
  let endPage = Math.min(pg.totalPages, startPage + maxVisible - 1);
  if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="table-pagination">
      <div className="pg-info">
        {pg.start}–{pg.end} of {pg.total}
      </div>
      <div className="pg-controls">
        <select className="pg-size-select" value={pg.pageSize} onChange={e => pg.setPageSize(Number(e.target.value))}>
          <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option>
        </select>
        <button className="pg-btn" onClick={pg.prev} disabled={!pg.hasPrev}>◀</button>
        {startPage > 1 && <><button className="pg-btn" onClick={() => pg.setPage(1)}>1</button><span style={{color:'var(--text-muted)'}}>…</span></>}
        {pages.map(p => <button key={p} className={`pg-btn ${p === pg.page ? 'active' : ''}`} onClick={() => pg.setPage(p)}>{p}</button>)}
        {endPage < pg.totalPages && <><span style={{color:'var(--text-muted)'}}>…</span><button className="pg-btn" onClick={() => pg.setPage(pg.totalPages)}>{pg.totalPages}</button></>}
        <button className="pg-btn" onClick={pg.next} disabled={!pg.hasNext}>▶</button>
      </div>
    </div>
  );
}
