'use client';

import React from 'react';

/**
 * ReportContainerErrorBoundary
 * PI.LENS.NEXTGEN-REPORTS.CORE-REPORT-CONTAINER.01
 *
 * React error boundary for CoreReportContainer.
 * Catches unhandled render errors and displays an explicit error state.
 * Never suppresses errors silently.
 */
export default class ReportContainerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          data-module="container-error-boundary"
          role="alert"
          aria-live="assertive"
        >
          <div data-field="error-headline">Report Container Error</div>
          <div data-field="error-detail">{this.state.errorMessage}</div>
        </div>
      );
    }

    return this.props.children;
  }
}
