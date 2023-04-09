import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider, UserProvider } from './contexts';
import './index.css'
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { ErrorBoundary } from 'react-error-boundary';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<>ERROR</>}>
    <UserProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </UserProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
