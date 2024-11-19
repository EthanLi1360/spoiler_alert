import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './Login/LoginPage';
import SignupPage from './Signup/SignupPage';
import FridgePage from './Fridge/FridgePage';
import Wishlist from './Wishlist/WishlistPage';
import Home from './Home/Home';
import Recipes from './Recipes/Recipes';
import AboutPage from './AboutPage/AboutPage';
import TeamPage from './TeamPage/TeamPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/fridge",
    element: <FridgePage />,
  },
  {
    path: "/wishlist",
    element: <Wishlist />,
  },
  {
    path: "/recipes",
    element: <Recipes />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/team",
    element: <TeamPage />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
