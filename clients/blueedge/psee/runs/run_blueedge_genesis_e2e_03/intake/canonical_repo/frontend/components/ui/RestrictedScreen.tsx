import { ROLE_PERMISSIONS } from '@/constants';
// Extracted from dashboard.html — RestrictedScreen
// Line 1146 | 10 lines

export default function RestrictedScreen({ pageId, userRole }: any) {
  const roleInfo = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.viewer;
  return (
    <div className="restricted-screen">
      <div className="lock-icon">🔒</div>
      <h3>Access Restricted</h3>
      <p>Your role <strong>({roleInfo.label})</strong> does not have permission to access this module. Contact your administrator to request access.</p>
    </div>
  );
}
