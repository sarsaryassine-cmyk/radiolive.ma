import { Component } from 'react';

/**
 * Generic error boundary. Catches render-time exceptions in the children
 * subtree, logs them, and renders the `fallback` instead. Used to isolate
 * non-essential branches (3D scene, etc.) so they can never take down the app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    const tag = this.props.tag || 'unknown';
    console.error(`[ErrorBoundary:${tag}]`, error, info?.componentStack || '');
  }

  render() {
    if (this.state.hasError) {
      const fb = this.props.fallback;
      if (typeof fb === 'function') return fb(this.state.error);
      return fb ?? null;
    }
    return this.props.children;
  }
}
