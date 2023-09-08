import React from 'react';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate
} from "react-router-dom";
import { useAuthContext } from "./contextAPI/AuthContext";
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import MovieDetails from './components/movie/MovieDetails';
import Profile from './components/profile/Profile';
import Homepage from './pages/Homepage/Homepage';

const App: React.FC = () => {

  // Define the type for children prop
  interface ProtectedRouteProps {
    children: React.ReactNode;
  }

  const Layout: React.FC = () => {
    return (

      <div>
        <Navbar />

        {/* nested routes inside root route */}
        <Outlet />

        <Footer />

      </div>

    );
  };


  //client-side auth
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

    const { currentUser } = useAuthContext();

    console.log(currentUser);
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return <>{children}</>;
  }

  //define the routes
  const router = createBrowserRouter([
    {
      //root route
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      //nested routes
      children: [
        {
          path: "/",
          element: <Homepage />,
        },
        // {
        //   path: "/movie/:tmdbId",
        //   element: <MovieDetails />,
        // },
        {
          path: "/profile",
          element: <Profile />,
        },

      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
