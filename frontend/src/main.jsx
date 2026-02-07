import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import ErrorBoundary from './components/common/ErrorBoundary'

// Global error handlers to surface non-React runtime errors (e.g. unhandledrejection)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (evt) => {
    // Log; the ErrorBoundary will catch render errors, but this helps for others
    // eslint-disable-next-line no-console
    console.error('Global error captured:', evt.error || evt.message);
  });

  window.addEventListener('unhandledrejection', (evt) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled promise rejection:', evt.reason);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
