

import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error:    null,
    };
  }

  // ── called when a child throws ─────────────────────────────────
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // ── log the error ──────────────────────────────────────────────
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error.message);
    console.error("Component stack:", info.componentStack);
  }

  // ── reset so user can retry ────────────────────────────────────
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // ── custom fallback if provided ──────────────────────────
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // ── default fallback UI ──────────────────────────────────
      return (
        <div className="w-full py-12 flex flex-col items-center justify-center text-center px-4">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {this.props.title || "Something went wrong"}
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            {this.props.message ||
              "This section failed to load. The rest of the page is still working."}
          </p>
          <button
            onClick={this.handleReset}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;