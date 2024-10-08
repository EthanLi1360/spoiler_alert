import React, { useState } from 'react';
import './App.css';
import { app } from './firebaseConfig';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import LoginPage from './LoginPage';
import FridgePage from './FridgePage'; // Import the fridge page

function App() {
  
  return (
    <div className="App">
      <FridgePage />
      < LoginPage />
    </div>
  );
}

export default App;