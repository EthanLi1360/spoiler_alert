import styles from "./Navbar.module.css";

function Navbar() {
    return (
        <ul className={styles.navbar}>
            <li style={{float: "left"}}><a href="/"><b>SpoilerAlert</b></a></li>
            <li style={{float: "left"}}><a href="/fridge">Fridges</a></li>
            <li style={{float: "left"}}><a href="/recipes">Recipes</a></li>
            <li style={{float: "left"}}><a href="/wishlist">Wishlists</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/login">Signup</a></li>
        </ul>
    );
}

export default Navbar;