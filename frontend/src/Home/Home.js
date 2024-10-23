import styles from "./Home.module.css";
import Navbar from "../Navbar/Navbar";
import Title from "./Title";
import Features from "./Feature"

function Home(){
    return(
        <div className={styles.container}>
            <Navbar />
            <Title />
            <Features />
        </div>
    )
}

export default Home;