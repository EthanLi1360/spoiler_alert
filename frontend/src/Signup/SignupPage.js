import React, { useState } from "react";
import styles from "./SignupPage.module.css"; // CSS for styling the component
import axios from "axios";
import { getCachedBackendUrl } from "../Util";
// Integrating with Ethan's database username/password storage instead of Firebase
// sorry!!!! we can (and maybe should) pivot back later
// TODO check for duplicate username
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";

function SignupPage() {
  // const auth = getAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      // Use dynamic backend URL discovery
      const backendUrl = await getCachedBackendUrl();
      
      const response = await axios.post(`${backendUrl}/add_credentials`, {
        username: username,
        password: password,
      });
      
      if (response.data.success) {
        setSuccessMessage("Signup successful! Welcome, " + username);
        setErrorMessage("");
      } else {
        setSuccessMessage("");
        setErrorMessage("Signup failed. Duplicate username");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSuccessMessage("");
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setErrorMessage("Unable to connect to server. Please make sure the backend is running.");
      } else {
        setErrorMessage(error.message || "An error occurred during signup.");
      }
    }
    // Firebase authentication - Create user with email and password
    // createUserWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     const user = userCredential.user;
    //     setSuccessMessage("Signup successful! Welcome, " + user.email);
    //     setErrorMessage("");
    //   })
    //   .catch((error) => {
    //     setErrorMessage(error.message);
    //     setSuccessMessage("");
    //   });
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.backgroundImages}></div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submit}>
            Signup
          </button>
          <Link to={"/"} style={{width: "100%", flex: 1}}><button className={styles.back}>Back</button></Link>
        </div>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
      </form>
    </div>
  );
}

export default SignupPage;
