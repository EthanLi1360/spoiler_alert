import styles from "./Home.module.css";
import Navbar from "./Navbar";
import Title from "./Title";

function Home(){
    return(
        <div className={styles.container}>
            <Navbar />
            <Title />
        </div>
    )
}

export default Home;