import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You could send this to a logging endpoint
    // For now we keep it local so the UI can show details
    this.setState({ error, info });
    // Also log to console so the devtools show a stacktrace
    // eslint-disable-next-line no-console
    console.error('Unhandled React error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">A runtime error occurred while rendering the application. Details are shown below.</p>
            <details className="whitespace-pre-wrap text-xs text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-3 rounded">
              {this.state.error?.toString()}
              {this.state.info?.componentStack && ('\n\n' + this.state.info.componentStack)}
            </details>
            <div className="mt-4 flex justify-end">
              <button onClick={() => window.location.reload()} className="btn btn-primary">Reload</button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
