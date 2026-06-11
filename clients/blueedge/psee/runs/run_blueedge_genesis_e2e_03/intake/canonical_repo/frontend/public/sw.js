// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Enhanced Service Worker v3.20.0
// Session 33: Driver sessions, insurance, DWVS push notifications
// Cache-first for static, network-first for API, background sync
// ══════════════════════════════════════════════════════════════

const CACHE_VERSION = 'blueedge-v3.20.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const SESSION_CACHE = `${CACHE_VERSION}-sessions`;

const PRECACHE_URLS = ['/', '/index.html', '/manifest.json', '/offline.html'];

const OFFLINE_API_ROUTES = [
  '/api/v1/vehicles', '/api/v1/drivers', '/api/v1/fleets',
  '/api/v1/driver-sessions/active', '/api/v1/insurance/policies',
  '/api/v1/insurance/analytics',
];

// ── IndexedDB for Offline Queue ─────────────────────────────
const DB_NAME = 'blueedge-offline';
const DB_VERSION = 2;
const STORES = { MUTATIONS: 'pending-mutations', SESSION_BLOCKS: 'pending-session-blocks', INSURANCE_SUBS: 'pending-insurance-submissions' };

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      for (const name of Object.values(STORES)) {
        if (!db.objectStoreNames.contains(name)) {
          const store = db.createObjectStore(name, { keyPath: 'id', autoIncrement: true });
          if (name === STORES.SESSION_BLOCKS) { store.createIndex('vehicleId', 'vehicleId'); store.createIndex('status', 'status'); }
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function addToStore(storeName, data) {
  const db = await openDB();
  return new Promise((resolve, reject) => { const tx = db.transaction(storeName, 'readwrite'); tx.objectStore(storeName).add({ ...data, id: Date.now() + Math.random() }); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); });
}
async function getAllFromStore(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => { const tx = db.transaction(storeName, 'readonly'); const req = tx.objectStore(storeName).getAll(); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); });
}
async function clearStore(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => { const tx = db.transaction(storeName, 'readwrite'); tx.objectStore(storeName).clear(); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); });
}

// ── Install ─────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then(cache => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

// ── Activate — clean old caches ─────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('blueedge-') && !k.startsWith(CACHE_VERSION)).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
  );
});

// ── Fetch Strategy ──────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET') {
    if (!navigator.onLine && ['POST','PUT','DELETE','PATCH'].includes(request.method)) { event.respondWith(queueMutation(request)); }
    return;
  }
  if (url.protocol === 'ws:' || url.protocol === 'wss:' || url.protocol === 'chrome-extension:') return;
  if (url.pathname.includes('/driver-sessions') || url.pathname.includes('/insurance')) { event.respondWith(networkFirst(request, SESSION_CACHE, 8000)); return; }
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/health/')) { event.respondWith(networkFirst(request, API_CACHE, 5000)); return; }
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) { event.respondWith(cacheFirst(request, IMAGE_CACHE)); return; }
  if (url.pathname.match(/\.(js|css|woff2?|ttf|eot)$/) || url.pathname.startsWith('/assets/')) { event.respondWith(cacheFirst(request, STATIC_CACHE)); return; }
  if (request.mode === 'navigate' || request.destination === 'document') { event.respondWith(networkFirst(request, STATIC_CACHE, 3000)); return; }
  event.respondWith(networkFirst(request, STATIC_CACHE, 5000));
});

// ── Cache Strategies ────────────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) { fetchAndCache(request, cacheName).catch(() => {}); return cached; }
  return fetchAndCache(request, cacheName);
}
async function networkFirst(request, cacheName, timeout = 5000) {
  try {
    const response = await Promise.race([fetch(request), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), timeout))]);
    if (response.ok) { const cache = await caches.open(cacheName); cache.put(request, response.clone()); }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') { const shell = await caches.match('/index.html'); if (shell) return shell; }
    return new Response(JSON.stringify({ success: false, error: 'offline', message: 'You are offline. Data will sync when connection is restored.' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  }
}
async function fetchAndCache(request, cacheName) {
  const response = await fetch(request);
  if (response.ok) { const cache = await caches.open(cacheName); cache.put(request, response.clone()); }
  return response;
}

// ── Offline Mutation Queue ──────────────────────────────────
async function queueMutation(request) {
  try {
    const body = await request.clone().text();
    await addToStore(STORES.MUTATIONS, { url: request.url, method: request.method, headers: Object.fromEntries(request.headers.entries()), body, timestamp: Date.now() });
    if (self.registration.sync) await self.registration.sync.register('sync-fleet-data');
    return new Response(JSON.stringify({ success: true, queued: true, message: 'Queued for sync.' }), { status: 202, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// ── Background Sync ─────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-fleet-data') event.waitUntil(syncPendingMutations());
  if (event.tag === 'sync-session-blocks') event.waitUntil(syncStore(STORES.SESSION_BLOCKS, '/api/v1/driver-sessions/bulk-close'));
  if (event.tag === 'sync-insurance-submissions') event.waitUntil(syncStore(STORES.INSURANCE_SUBS, '/api/v1/insurance/submit-blocks'));
});

async function syncPendingMutations() {
  const mutations = await getAllFromStore(STORES.MUTATIONS);
  for (const m of mutations) { try { await fetch(m.url, { method: m.method, headers: m.headers, body: m.body }); } catch { return; } }
  await clearStore(STORES.MUTATIONS);
  const clients = await self.clients.matchAll();
  clients.forEach(c => c.postMessage({ type: 'SYNC_COMPLETE', store: 'mutations', count: mutations.length }));
}

async function syncStore(storeName, endpoint) {
  const items = await getAllFromStore(storeName);
  if (items.length === 0) return;
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) });
  if (res.ok) await clearStore(storeName);
}

// ── Push Notifications (DWVS/Session/Insurance/Safety) ──────
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Blue Edge Fleet Alert';
  const category = data.category || 'general';
  const icons = { session: '/icons/icon-192.png', dwvs: '/icons/icon-192.png', insurance: '/icons/icon-192.png', safety: '/icons/icon-192.png', alert: '/icons/icon-192.png', general: '/icons/icon-192.png' };
  const actions = {
    session: [{ action: 'view-session', title: 'View Session' }, { action: 'view-vehicle', title: 'Vehicle' }],
    dwvs: [{ action: 'view-dwvs', title: 'DWVS Dashboard' }, { action: 'view-driver', title: 'Driver' }],
    insurance: [{ action: 'view-policy', title: 'Policy' }, { action: 'compute-premium', title: 'Recalculate' }],
    safety: [{ action: 'view-safety', title: 'View Event' }, { action: 'acknowledge', title: 'Acknowledge' }],
    general: [{ action: 'view', title: 'View' }, { action: 'dismiss', title: 'Dismiss' }],
  };
  const routes = { session: '/fleet-dwvs', dwvs: '/fleet-dwvs', insurance: '/insurance', safety: '/safety', alert: '/alerts', general: '/overview' };

  const options = {
    body: data.body || 'New fleet notification',
    icon: icons[category] || icons.general,
    badge: '/icons/icon-72.png',
    tag: data.tag || `fleet-${category}-${Date.now()}`,
    renotify: ['safety', 'dwvs'].includes(category),
    requireInteraction: data.severity === 'critical',
    data: { url: data.url || routes[category] || '/overview', category, metadata: data.metadata || {} },
    actions: actions[category] || actions.general,
    vibrate: data.severity === 'critical' ? [200, 100, 200, 100, 200] : [200, 100, 200],
    timestamp: data.timestamp ? new Date(data.timestamp).getTime() : Date.now(),
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const { url } = event.notification.data || {};
  const routes = { 'view-session': '/fleet-dwvs', 'view-vehicle': '/vehicles', 'view-dwvs': '/fleet-dwvs', 'view-driver': '/drivers', 'view-policy': '/insurance', 'compute-premium': '/insurance', 'view-safety': '/safety', acknowledge: '/alerts', view: url || '/overview' };
  const targetUrl = routes[event.action] || url || '/overview';
  if (event.action === 'dismiss') return;
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      const existing = clients.find(c => c.url.includes(targetUrl));
      if (existing) return existing.focus();
      return self.clients.openWindow(targetUrl);
    })
  );
});

// ── Client-SW Communication ─────────────────────────────────
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  switch (type) {
    case 'SKIP_WAITING': self.skipWaiting(); break;
    case 'CACHE_API_ROUTES': event.waitUntil(caches.open(API_CACHE).then(async (cache) => { for (const r of OFFLINE_API_ROUTES) { try { const res = await fetch(r); if (res.ok) await cache.put(r, res); } catch {} } })); break;
    case 'QUEUE_SESSION_BLOCK': event.waitUntil(addToStore(STORES.SESSION_BLOCKS, payload).then(() => self.registration.sync?.register('sync-session-blocks'))); break;
    case 'QUEUE_INSURANCE_SUBMISSION': event.waitUntil(addToStore(STORES.INSURANCE_SUBS, payload).then(() => self.registration.sync?.register('sync-insurance-submissions'))); break;
    case 'GET_CACHE_STATUS': event.waitUntil(
      Promise.all([caches.open(STATIC_CACHE).then(c => c.keys()), caches.open(API_CACHE).then(c => c.keys()), caches.open(SESSION_CACHE).then(c => c.keys()), getAllFromStore(STORES.MUTATIONS).catch(() => []), getAllFromStore(STORES.SESSION_BLOCKS).catch(() => [])])
      .then(([s, a, ss, m, b]) => { event.source.postMessage({ type: 'CACHE_STATUS', data: { version: CACHE_VERSION, static: s.length, api: a.length, sessions: ss.length, pendingMutations: m.length, pendingSessionBlocks: b.length } }); })
    ); break;
  }
});

// ── Periodic Sync ───────────────────────────────────────────
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'refresh-fleet-data') {
    event.waitUntil(caches.open(API_CACHE).then(async (cache) => { for (const r of OFFLINE_API_ROUTES) { try { const res = await fetch(r); if (res.ok) await cache.put(r, res); } catch {} } }));
  }
});
