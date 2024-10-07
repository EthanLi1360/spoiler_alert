import React, { useState } from 'react';
import './App.css';
import { app } from './firebaseConfig';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import LoginPage from './LoginPage';

function App() {
  
  return (
    <div className="App">
      < LoginPage />
    </div>
  );
}

export default App;