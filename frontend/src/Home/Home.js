import styles from "./Home.module.css";
import Navbar from "../Navbar/Navbar";
import Title from "./Title";
import Features from "./Feature"
import Footer from "../Footer/Footer"

function Home(){
    return(
        <div className={styles.container}>
            <Navbar />
            <Title />
            <Features />
            <Footer />
        </div>
    )
}

export default Home;