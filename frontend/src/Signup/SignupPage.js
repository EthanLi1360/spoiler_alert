import React, { useState } from "react";
import styles from "./SignupPage.module.css"; // CSS for styling the component
import axios from "axios";
// Integrating with Ethan's database username/password storage instead of Firebase
// sorry!!!! we can (and maybe should) pivot back later
// TODO check for duplicate username
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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

    await axios
      .post("http://127.0.0.1:5000/add_credentials", {
        username: username,
        password: password,
      })
      .then((response) => {
        setSuccessMessage("Signup successful! Welcome, " + username);
        setErrorMessage("");
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setSuccessMessage("");
      });
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
        <button type="submit" className={styles.submit}>
          Signup
        </button>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
      </form>
    </div>
  );
}

export default SignupPage;
