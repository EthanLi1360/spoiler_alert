import React, { useState } from "react";
import styles from "./LoginPage.module.css"
// import { app } from './firebaseConfig';
// import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useToken from "../Util";
import { Link } from "react-router-dom";

function LoginPage() {
  // let auth = getAuth();
  let navigate = useNavigate();
  const {token, setToken} = useToken();

  const routeChange = (path) => {
    navigate(path);
  };
  // let googleAuthProvider = new GoogleAuthProvider();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dummy login validation (Replace with actual validation logic)
    await axios
      .post("http://127.0.0.1:5000/try_login", {
        username: username,
        password: password,
      })
      .then((response) => {
        if (response.data.success) {
          setToken(username, response.data.token);
          navigate("/");
        } else {
          setErrorMessage("Invalid username or password");
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.backgroundImages}></div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {errorMessage && <p>{errorMessage}</p>}
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
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
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submit}>
            Login
          </button>
          <Link to={"/"} style={{width: "100%", flex: 1}}><button className={styles.back}>Back</button></Link>
        </div>
      </form>
    </div>
  );
}
export default LoginPage;