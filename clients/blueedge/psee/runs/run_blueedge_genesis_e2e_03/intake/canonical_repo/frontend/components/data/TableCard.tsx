// Extracted from dashboard.html — TableCard
// Line 1099 | 12 lines

import { useI18n } from '@/hooks';

export default function TableCard({ title, count, children }: any) {
  const { t } = useI18n();
  return (
    <div className="table-card">
      <div className="table-header">
        <h3>{t(title)}</h3>
        {count != null && <span className="table-count">{count} {t('records')}</span>}
      </div>
      {children}
    </div>
  );
}
