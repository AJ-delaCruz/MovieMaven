import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { AuthProvider } from './contextAPI/AuthContext';
import { RatingsProvider } from './contextAPI/RatingsContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>

    <RatingsProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RatingsProvider>

  </React.StrictMode>
);


