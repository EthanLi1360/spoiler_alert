import React, { useState } from 'react';
import './App.css';
import { app } from './firebaseConfig';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function App() {
  let auth = getAuth();
  let googleAuthProvider = new GoogleAuthProvider();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();


    // Dummy login validation (Replace with actual validation logic)
    if (username === 'admin' && password === 'password123') {
      alert('Login successful!');
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid username or password');
    }
  };

  const handleClick = () => {
    signInWithPopup(auth, googleAuthProvider)
    .then((response) => {
      console.log(response.user);
    })
    .catch((err) => {
      alert(err.message);
    })
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" class='submit'>Login</button>
        <button onClick={handleClick} class="google-login">Login with Google</button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
}

export default App;