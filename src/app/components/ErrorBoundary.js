// src/app/components/ErrorBoundary.js

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // This method is called if an error is thrown in any child component
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // This method logs error details and displays fallback UI
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  // Reset error state if the user tries to reload or recover
  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI here
      return (
        <div style={{ padding: '20px', background: '#f8d7da', color: '#721c24' }}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error && this.state.error.toString()}</p>
          <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          <button onClick={this.handleRetry}>Try Again</button>
        </div>
      );
    }

    // If no error, render children components normally
    return this.props.children;
  }
}

export default ErrorBoundary;
