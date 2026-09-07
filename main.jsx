import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './src/AppRoutes.jsx';
import { LanguageProvider } from './src/i18n/LanguageProvider.jsx';
import ErrorBoundary from './src/components/ErrorBoundary.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ErrorBoundary>
        <BrowserRouter><AppRoutes /></BrowserRouter>
      </ErrorBoundary>
    </LanguageProvider>
  </React.StrictMode>,
);
