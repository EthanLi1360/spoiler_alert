import styles from "./Navbar.module.css";
import useToken from "../Util";

function Navbar() {
    const {token, setToken} = useToken();
    
    return (
        <ul className={styles.navbar}>
            <li style={{float: "left"}}><a href="/"><b>SpoilerAlert</b></a></li>
            {
                (token != null) ? <>
                    <li style={{float: "left"}}><a href="/fridge">Fridges</a></li>
                    <li style={{float: "left"}}><a href="/recipes">Recipes</a></li>
                    <li style={{float: "left"}}><a href="/wishlist">Wishlists</a></li>
                </> : null
            }
            {
                (token == null) ? <>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/signup">Signup</a></li>
                </> : <>
                    <li><p className={styles.logout} onClick={() => {
                        setToken();
                    }}>Logout</p></li>
                    <li><p>Welcome, <b>{localStorage.getItem("username")}</b></p></li>
                </>
            }
        </ul>
    );
}

export default Navbar;