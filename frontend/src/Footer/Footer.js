import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <a href="/">Home</a>
        <a href="/fridge">Fridges</a>
        <a href="/recipes">Recipes</a>
        <a href="/wishlist">WishList</a>
        <a href="/about">About</a>
        <a href="/team">Meet the Team</a>
      </div>
    </footer>
  )    
}

export default Footer;