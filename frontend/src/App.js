import React, { useState } from 'react';
import './App.css';
import { app } from './firebaseConfig';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import LoginPage from './LoginPage';
import FridgePage from './FridgePage'; // Import the fridge page
import Wishlist from './Wishlist'

function App() {
  
  return (
    <div className="App">
      <LoginPage />
      <FridgePage />
      <Wishlist userID={1} />
    </div>
  );
}

export default App;