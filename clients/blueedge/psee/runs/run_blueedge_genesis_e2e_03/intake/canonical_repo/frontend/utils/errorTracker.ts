// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Error Tracking Service
// Lightweight error capture with breadcrumbs and context
// Sends to /api/v1/errors endpoint (or Sentry DSN)
// ══════════════════════════════════════════════════════════════

interface ErrorEvent {
  message: string;
  stack?: string;
  level: 'error' | 'warning' | 'info';
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string;
  context?: Record<string, any>;
  breadcrumbs: Breadcrumb[];
}

interface Breadcrumb {
  type: 'navigation' | 'click' | 'api' | 'console' | 'custom';
  message: string;
  timestamp: string;
  data?: Record<string, any>;
}

class ErrorTracker {
  private breadcrumbs: Breadcrumb[] = [];
  private maxBreadcrumbs = 50;
  private userId: string | null = null;
  private enabled = true;
  private endpoint: string;
  private queue: ErrorEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.endpoint = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/v1/errors`;
    this.setupGlobalHandlers();
    this.startFlushTimer();
  }

  // ── Configuration ─────────────────────────────────────────
  setUser(userId: string) { this.userId = userId; }
  clearUser() { this.userId = null; }
  enable() { this.enabled = true; }
  disable() { this.enabled = false; }

  // ── Breadcrumb Tracking ───────────────────────────────────
  addBreadcrumb(crumb: Omit<Breadcrumb, 'timestamp'>) {
    this.breadcrumbs.push({ ...crumb, timestamp: new Date().toISOString() });
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }
  }

  // ── Capture Methods ───────────────────────────────────────
  captureException(error: Error, context?: Record<string, any>) {
    if (!this.enabled) return;
    this.enqueue({
      message: error.message,
      stack: error.stack,
      level: 'error',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.userId || undefined,
      context,
      breadcrumbs: [...this.breadcrumbs],
    });
  }

  captureMessage(message: string, level: 'error' | 'warning' | 'info' = 'info', context?: Record<string, any>) {
    if (!this.enabled) return;
    this.enqueue({
      message,
      level,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.userId || undefined,
      context,
      breadcrumbs: [...this.breadcrumbs],
    });
  }

  // API error tracking helper
  captureApiError(endpoint: string, status: number, message: string) {
    this.addBreadcrumb({ type: 'api', message: `${status} ${endpoint}`, data: { status } });
    if (status >= 500) {
      this.captureMessage(`API ${status}: ${endpoint} — ${message}`, 'error', { endpoint, status });
    }
  }

  // ── Internal ──────────────────────────────────────────────
  private enqueue(event: ErrorEvent) {
    this.queue.push(event);
    // Flush immediately if queue gets large
    if (this.queue.length >= 10) this.flush();
  }

  private async flush() {
    if (this.queue.length === 0) return;
    const batch = [...this.queue];
    this.queue = [];

    try {
      const token = localStorage.getItem('be-token');
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ errors: batch }),
        keepalive: true, // Survive page unload
      });
    } catch {
      // Silently fail — don't cause more errors
      // Re-queue if less than 50 items
      if (batch.length < 50) {
        this.queue.push(...batch);
      }
    }
  }

  private startFlushTimer() {
    this.flushTimer = setInterval(() => this.flush(), 30000); // Every 30s
  }

  private setupGlobalHandlers() {
    // Unhandled errors
    window.addEventListener('error', (event) => {
      this.captureException(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason));
      this.captureException(error, { type: 'unhandledrejection' });
    });

    // Navigation breadcrumbs
    const pushState = history.pushState.bind(history);
    history.pushState = (...args) => {
      pushState(...args);
      this.addBreadcrumb({ type: 'navigation', message: `Navigate to ${args[2]}` });
    };

    // Click breadcrumbs
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName?.toLowerCase();
      const text = target.textContent?.slice(0, 50) || '';
      const id = target.id ? `#${target.id}` : '';
      this.addBreadcrumb({ type: 'click', message: `${tag}${id}: ${text}` });
    }, { capture: true, passive: true });

    // Console error breadcrumbs
    const origError = console.error.bind(console);
    console.error = (...args: any[]) => {
      this.addBreadcrumb({ type: 'console', message: args.map(String).join(' ').slice(0, 200) });
      origError(...args);
    };

    // Flush on page unload
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.flush();
    });
  }

  destroy() {
    if (this.flushTimer) clearInterval(this.flushTimer);
    this.flush();
  }
}

// ── Singleton ───────────────────────────────────────────────
export const errorTracker = new ErrorTracker();
export default errorTracker;
