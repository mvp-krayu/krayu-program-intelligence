/**
 * PWA Hooks — Blue Edge Fleet Management Platform v3.20.0
 *
 * useServiceWorker    — SW registration, update detection, cache status
 * useInstallPrompt    — A2HS (Add to Home Screen) prompt management
 * usePushNotifications — Push subscription for DWVS/session/safety alerts
 * useOfflineSync      — Queue session blocks & insurance submissions for offline sync
 */
import { useState, useEffect, useCallback, useRef } from 'react';

// ── Types ────────────────────────────────────────────────────
export interface CacheStatus {
  version: string;
  static: number;
  api: number;
  sessions: number;
  pendingMutations: number;
  pendingSessionBlocks: number;
}

export interface SWState {
  registered: boolean;
  updateAvailable: boolean;
  offline: boolean;
  cacheStatus: CacheStatus | null;
}

// ── useServiceWorker ─────────────────────────────────────────
export function useServiceWorker() {
  const [state, setState] = useState<SWState>({
    registered: false,
    updateAvailable: false,
    offline: !navigator.onLine,
    cacheStatus: null,
  });
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Register SW
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => {
        registrationRef.current = reg;
        setState(s => ({ ...s, registered: true }));

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(s => ({ ...s, updateAvailable: true }));
            }
          });
        });
      })
      .catch(err => console.error('[PWA] SW registration failed:', err));

    // Listen for messages from SW
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, data } = event.data || {};
      if (type === 'CACHE_STATUS') {
        setState(s => ({ ...s, cacheStatus: data }));
      }
      if (type === 'SYNC_COMPLETE') {
        console.log(`[PWA] Sync complete: ${data?.store} — ${data?.count} items`);
      }
    });

    // Online/offline detection
    const onOnline = () => setState(s => ({ ...s, offline: false }));
    const onOffline = () => setState(s => ({ ...s, offline: true }));
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }, []);

  const requestCacheStatus = useCallback(() => {
    navigator.serviceWorker.controller?.postMessage({ type: 'GET_CACHE_STATUS' });
  }, []);

  const preCacheApiRoutes = useCallback(() => {
    navigator.serviceWorker.controller?.postMessage({ type: 'CACHE_API_ROUTES' });
  }, []);

  return { ...state, applyUpdate, requestCacheStatus, preCacheApiRoutes, registration: registrationRef };
}

// ── useInstallPrompt ─────────────────────────────────────────
export function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(false);
  const promptRef = useRef<any>(null);

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      promptRef.current = e;
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setCanInstall(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = useCallback(async () => {
    if (!promptRef.current) return false;
    promptRef.current.prompt();
    const result = await promptRef.current.userChoice;
    if (result.outcome === 'accepted') {
      setInstalled(true);
      setCanInstall(false);
    }
    promptRef.current = null;
    return result.outcome === 'accepted';
  }, []);

  return { canInstall, installed, install };
}

// ── usePushNotifications ─────────────────────────────────────
export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        setSubscribed(!!sub);
      });
    });
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'denied';
    const perm = await Notification.requestPermission();
    setPermission(perm);
    return perm;
  }, []);

  const subscribe = useCallback(async (vapidPublicKey: string) => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
      setSubscribed(true);
      return sub;
    } catch (err) {
      console.error('[PWA] Push subscription failed:', err);
      return null;
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        setSubscribed(false);
      }
    } catch (err) {
      console.error('[PWA] Unsubscribe failed:', err);
    }
  }, []);

  // Send a test notification (for development)
  const sendTestNotification = useCallback((category: 'session' | 'dwvs' | 'insurance' | 'safety' | 'alert' = 'general') => {
    const messages: Record<string, { title: string; body: string }> = {
      session: { title: '🚛 Session Started', body: 'Ahmed Al Mansouri authenticated on TK-0847 via FaceID+NFC' },
      dwvs: { title: '📊 DWVS Alert', body: 'Noura Al Hashemi DWVS exceeded 0.8 threshold on BUS-201' },
      insurance: { title: '🛡️ Premium Updated', body: 'TK-0847 premium adjusted: -12% based on latest session blocks' },
      safety: { title: '⚠️ Safety Event', body: 'Harsh braking detected on TX-5501 — -0.45g deceleration' },
      alert: { title: '🔔 Fleet Alert', body: 'Vehicle TK-0923 entered restricted zone: Jebel Ali Port' },
      general: { title: '📋 Blue Edge', body: 'You have 3 pending session blocks to review' },
    };
    const msg = messages[category] || messages.general;
    if (Notification.permission === 'granted') {
      new Notification(msg.title, { body: msg.body, icon: '/icons/icon-192.png', tag: `test-${category}` });
    }
  }, []);

  return { permission, subscribed, requestPermission, subscribe, unsubscribe, sendTestNotification };
}

// ── useOfflineSync ───────────────────────────────────────────
export function useOfflineSync() {
  const queueSessionBlock = useCallback((block: any) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'QUEUE_SESSION_BLOCK', payload: block });
      return true;
    }
    return false;
  }, []);

  const queueInsuranceSubmission = useCallback((submission: any) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'QUEUE_INSURANCE_SUBMISSION', payload: submission });
      return true;
    }
    return false;
  }, []);

  return { queueSessionBlock, queueInsuranceSubmission };
}

// ── Utility ──────────────────────────────────────────────────
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}
