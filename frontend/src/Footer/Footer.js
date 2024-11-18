import styles from "./Footer.module.css";
import useToken from "../Util";

function Footer() {
  const {token, setToken} = useToken();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <a href="/">Home</a>
        {
          (token != null ? <>
            <a href="/fridge">Fridges</a>
            <a href="/recipes">Recipes</a>
            <a href="/wishlist">Wishlist</a>
          </> : null)
        }
        <a href="/about">About</a>
        <a href="/team">Meet the Team</a>
      </div>
    </footer>
  )    
}

export default Footer;