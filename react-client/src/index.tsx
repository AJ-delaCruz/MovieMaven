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
import { LikeProvider } from './contextAPI/LikesContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>

    <SnackbarProvider>
      <PostProvider>
        <LikeProvider>
          <RatingsProvider>
            <FavoritesProvider>
              <WatchlistProvider>
                <AuthProvider>
                  <ProfileProvider>
                    <App />
                  </ProfileProvider>
                </AuthProvider>
              </WatchlistProvider>
            </FavoritesProvider>
          </RatingsProvider>
        </LikeProvider>
      </PostProvider>

    </SnackbarProvider>

  </React.StrictMode>
);


