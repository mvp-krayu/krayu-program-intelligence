import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';
import { PrefsProvider } from './contexts/PrefsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocketProvider } from './socket';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { registerServiceWorker } from './pwa';

// ── Styles (order matters: base → theme → mobile → rtl → perf)
import './styles/index.css';
import './styles/dashboard.css';
import './styles/light-theme.css';
import './styles/mobile-ux.css';
import './styles/rtl.css';
import './styles/performance.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary pageName="Application Root">
      <ThemeProvider>
        <I18nProvider>
          <PrefsProvider>
            <AuthProvider>
              <SocketProvider>
                <App />
              </SocketProvider>
            </AuthProvider>
          </PrefsProvider>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// ── Register Service Worker for PWA ─────────────────────────
registerServiceWorker({
  onSuccess: () => console.log('[PWA] Content cached for offline use'),
  onUpdate: () => {
    // UpdatePrompt in App.tsx will handle this via a custom event
    window.dispatchEvent(new CustomEvent('sw-update-available'));
  },
  onOffline: () => console.log('[PWA] Device went offline'),
  onOnline: () => console.log('[PWA] Device back online'),
});
