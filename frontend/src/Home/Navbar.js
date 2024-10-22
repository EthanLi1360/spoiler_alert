import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <ul className={styles.navbar}>
      <li style={{ float: "left" }}>
        <a href="/">SpoilerAlert</a>
      </li>
      <li>
        <a href="/login">Login</a>
      </li>
      <li>
        <a href="/signup">Signup</a>
      </li>
    </ul>
  );
}

export default Navbar;
