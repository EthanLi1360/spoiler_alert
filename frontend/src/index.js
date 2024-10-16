import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './Login/LoginPage';
import FridgePage from './Fridge/FridgePage';
import Wishlist from './Wishlist/Wishlist';
import Home from './Home/Home';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
    element: <Wishlist userID={1} />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
