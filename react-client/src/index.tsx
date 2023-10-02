import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { AuthProvider } from './contextAPI/AuthContext';
import { RatingsProvider } from './contextAPI/RatingsContext';
import { FavoritesProvider } from './contextAPI/FavoritesContext';
import { WatchlistProvider } from './contextAPI/WatchlistContext';
import { ProfileProvider } from './contextAPI/ProfileContext';
import SnackbarProvider from './contextAPI/SnackBarAlertContext';
import { PostProvider } from './contextAPI/PostContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>

    <SnackbarProvider>
      <RatingsProvider>
        <PostProvider>
          <FavoritesProvider>
            <WatchlistProvider>
              <AuthProvider>
                <ProfileProvider>
                  <App />
                </ProfileProvider>
              </AuthProvider>
            </WatchlistProvider>
          </FavoritesProvider>
        </PostProvider>
      </RatingsProvider>
    </SnackbarProvider>

  </React.StrictMode>
);


