// ══════════════════════════════════════════════════════════════
// Blue Edge — Global Error Boundary
// Catches render errors in child components, displays recovery UI
// Session 30: production-grade with error reporting + theme support
// ══════════════════════════════════════════════════════════════

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional fallback render */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Page name for error context */
  pageName?: string;
  /** Callback when error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Compact mode for inline boundaries */
  compact?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState(prev => ({
      errorInfo,
      errorCount: prev.errorCount + 1,
    }));

    // Report to external service (console for now, plug in Sentry/DataDog later)
    console.error('[ErrorBoundary] Caught error:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      page: this.props.pageName || 'unknown',
      count: this.state.errorCount + 1,
      timestamp: new Date().toISOString(),
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    // Navigate to overview by clearing hash/page state
    window.location.hash = '';
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Custom fallback
    if (this.props.fallback) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error!, this.handleReset);
      }
      return this.props.fallback;
    }

    const { error, errorCount } = this.state;
    const { compact, pageName } = this.props;
    const tooManyErrors = errorCount >= 3;

    // ── Compact inline error (for widget boundaries) ────────
    if (compact) {
      return (
        <div style={{
          padding: '16px 20px',
          background: 'var(--bg-card)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 8,
          color: 'var(--text-secondary)',
          fontSize: 13,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Component Error</span>
          </div>
          <p style={{ margin: '0 0 12px', lineHeight: 1.5, color: 'var(--text-muted)' }}>
            {error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '6px 16px',
              background: 'var(--cyan)',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    // ── Full page error screen ──────────────────────────────
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '40px 20px',
        textAlign: 'center',
      }}>
        {/* Error icon */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(239,68,68,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2 style={{
          color: 'var(--text-primary)',
          fontSize: 22,
          fontWeight: 700,
          margin: '0 0 8px',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          Something went wrong
        </h2>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: 14,
          lineHeight: 1.6,
          maxWidth: 440,
          margin: '0 0 8px',
        }}>
          {pageName ? `The "${pageName}" page` : 'This page'} encountered an unexpected error.
          {tooManyErrors
            ? ' This error has occurred multiple times. Try reloading the page.'
            : ' You can try again or navigate to another page.'}
        </p>

        {/* Error details (collapsible) */}
        <details style={{
          marginBottom: 24,
          maxWidth: 500,
          width: '100%',
          textAlign: 'left',
        }}>
          <summary style={{
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: 12,
            padding: '8px 0',
            userSelect: 'none',
          }}>
            Technical details
          </summary>
          <div style={{
            padding: 12,
            background: 'var(--bg-secondary)',
            borderRadius: 8,
            border: '1px solid var(--border)',
            fontSize: 11,
            fontFamily: 'monospace',
            color: 'var(--text-muted)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: 200,
            overflow: 'auto',
          }}>
            {error?.message}
            {error?.stack && '\n\n' + error.stack.split('\n').slice(0, 5).join('\n')}
          </div>
        </details>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {!tooManyErrors && (
            <button
              onClick={this.handleReset}
              style={{
                padding: '10px 24px',
                background: 'var(--cyan)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif',
                transition: 'opacity 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              Try Again
            </button>
          )}
          <button
            onClick={this.handleGoHome}
            style={{
              padding: '10px 24px',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif',
              transition: 'border-color 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--border-active)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            Go to Dashboard
          </button>
          <button
            onClick={this.handleReload}
            style={{
              padding: '10px 24px',
              background: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Reload Page
          </button>
        </div>

        {/* Error count indicator */}
        {errorCount > 1 && (
          <p style={{
            marginTop: 16,
            fontSize: 11,
            color: 'var(--text-muted)',
          }}>
            Error occurred {errorCount} times in this session
          </p>
        )}
      </div>
    );
  }
}

// ── Convenience wrapper for page-level boundaries ───────────
export function PageErrorBoundary({ pageName, children }: { pageName: string; children: ReactNode }) {
  return (
    <ErrorBoundary pageName={pageName}>
      {children}
    </ErrorBoundary>
  );
}

// ── Convenience wrapper for widget-level boundaries ─────────
export function WidgetErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary compact>
      {children}
    </ErrorBoundary>
  );
}
