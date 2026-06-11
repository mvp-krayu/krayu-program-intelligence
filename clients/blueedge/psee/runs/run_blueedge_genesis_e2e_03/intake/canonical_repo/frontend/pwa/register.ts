/**
 * PWA Service Worker Registration
 *
 * Registers sw.js, detects updates, manages lifecycle transitions.
 * Fires custom events for offline/online/update states.
 */

interface RegistrationConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

export function registerServiceWorker(config?: RegistrationConfig): void {
  if (!('serviceWorker' in navigator)) {
    console.log('[PWA] Service Workers not supported');
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = '/sw.js';

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('[PWA] Service Worker registered, scope:', registration.scope);

        // Check for updates periodically (every 60 minutes)
        setInterval(() => {
          registration.update().catch(() => {});
        }, 60 * 60 * 1000);

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content available — prompt user to refresh
                console.log('[PWA] New content available; will prompt user');
                config?.onUpdate?.(registration);
                window.dispatchEvent(new CustomEvent('sw-update-available', { detail: { registration } }));
              } else {
                // Content cached for the first time — offline ready
                console.log('[PWA] Content cached for offline use');
                config?.onSuccess?.(registration);
                window.dispatchEvent(new CustomEvent('sw-cache-ready'));
              }
            }
          };
        };
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });

    // Listen for controller change (new SW took over)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        // Don't auto-reload — let UpdatePrompt handle it
        console.log('[PWA] New service worker activated');
      }
    });
  });

  // ── Online/Offline Events ─────────────────────────────────
  window.addEventListener('online', () => {
    console.log('[PWA] Device online');
    config?.onOnline?.();
    window.dispatchEvent(new CustomEvent('pwa-online'));
  });

  window.addEventListener('offline', () => {
    console.log('[PWA] Device offline');
    config?.onOffline?.();
    window.dispatchEvent(new CustomEvent('pwa-offline'));
  });
}

/**
 * Request the waiting SW to skip waiting and take control.
 */
export async function applyUpdate(): Promise<void> {
  const registration = await navigator.serviceWorker?.getRegistration();
  if (registration?.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
  // Reload after a brief delay to let the new SW activate
  setTimeout(() => window.location.reload(), 300);
}

/**
 * Check if the app can be installed (A2HS)
 */
let deferredInstallPrompt: any = null;

window.addEventListener('beforeinstallprompt', (e: Event) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  window.dispatchEvent(new CustomEvent('pwa-install-available'));
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  window.dispatchEvent(new CustomEvent('pwa-installed'));
  console.log('[PWA] App installed successfully');
});

export function canInstall(): boolean {
  return deferredInstallPrompt !== null;
}

export async function promptInstall(): Promise<boolean> {
  if (!deferredInstallPrompt) return false;
  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  return outcome === 'accepted';
}

export function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as any).standalone === true
    || document.referrer.includes('android-app://');
}
