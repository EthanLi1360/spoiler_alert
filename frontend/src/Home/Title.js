import styles from "./Title.module.css";

function Title() {
    return(
        <div className={styles.title}>
                <h1>SPOILER ALERT</h1>
                <h3>Smart Fridge, Smarter Recipes</h3>
                <p>Track, Organize, and Cook with Ease</p>
        </div>
    );
}

export default Title;