import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { AuthProvider } from './contextAPI/AuthContext';
import { RatingsProvider } from './contextAPI/RatingsContext';
import { FavoritesProvider } from './contextAPI/FavoritesContext';
import { WatchlistProvider } from './contextAPI/WatchlistContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>

    <RatingsProvider>
      <FavoritesProvider>
        <WatchlistProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </WatchlistProvider>
      </FavoritesProvider>
    </RatingsProvider>

  </React.StrictMode>
);


