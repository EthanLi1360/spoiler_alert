import styles from "./TeamPage.module.css";
import el from "./el.jpg";
import e2 from "./e2.jpg";
import aa from "./aa.jpg";
import ej from "./ej.jpeg";
import jd from "./jd.jpg";
import ss from "./ss.jpg";
import yl from "./yl.jpg";
import k from "./picKaushik.jpg";
import r from "./picRoshan.jpg";
import tn from "./tn.jpg";
import Footer from "../Footer/Footer";


export default function TeamPage() {
  return (
    <div className={styles.teamContainer}>
      <h1> Meet The Team </h1>
      <div className={styles.person}>
        <a href="https://www.linkedin.com/in/ethan-li-2a1842206/">
          <img src={el} alt="Ethan Li" />
        </a>
        <h2>Ethan Li</h2>
        <p>Project Lead</p>
      </div>

      <div className={styles.person}>
        <a href="https://www.linkedin.com/in/ethan-yang-bb8a92247/">
          <img src={e2} alt="Ethan Yang" />
        </a>
        <h2>Ethan Yang</h2>
        <p>Project Co-lead</p>
      </div>

      <div className={styles.person}>
        <a href="https://www.linkedin.com/in/adarshsetty/">
          <img src={aa} alt="Adarsh Setty" />
        </a>
        <h2>Adarsh Setty</h2>
        <p>UI/UX Designer and Frontend</p>
      </div>

      <div className={styles.person}>
        <a href="https://www.linkedin.com/in/john-devoe-47aa23287/">
          <img src={jd} alt="John DeVoe" />
        </a>
        <h2>John DeVoe</h2>
        <p>Full-Stack Developer</p>
      </div>

      <div className={styles.person}>
        <a href="https://www.linkedin.com/in/surya-atmuri-7b9232292/">
          <img src={ss} alt="Surya Atmuri" />
        </a>
        <h2>Surya Atmuri</h2>
        <p>Frontend Developer</p>
      </div>

      <div className={styles.person}>
        <a href="https://www.linkedin.com/in/yiran-luo-29141a295/">
          <img src={yl} alt="Yiran Luo" />
        </a>
        <h2>Yiren Luo</h2>
        <p>Frontend Developer</p>
      </div>

      <div className={styles.person}>
        <a href="https://www.linkedin.com/in/eric-joseph16/">
          <img src={ej} alt="Eric Joseph" />
        </a>
        <h2>Eric Joseph</h2>
        <p>Frontend Developer</p>
      </div>

      <div className={styles.person}>
        <a href="https://www.linkedin.com/in/roshan-kolachina-736861272/">
          <img src={r} alt="Roshan Kolachina" />
        </a>
        <h2>Roshan Kolachina</h2>
        <p>Backend Developer</p>
      </div>

      <div className={styles.person}>
        <a href="https://www.linkedin.com/in/kaushik-vemulapalli-559769303/">
          <img src={k} alt="Kaushik Vemulapalli" />
        </a>
        <h2>Kaushik Vemulapalli</h2>
        <p>Backend Developer</p>
      </div>
      <div className={styles.person}>
        <a href="https://www.linkedin.com/in/hieu-tommy-nguyen/">
          <img src={tn} alt="Tommy Nguyen" />
        </a>
        <h2>Tommy Nguyen</h2>
        <p>Full-Stack Developer</p>
      </div>
      
      <Footer />
    </div>
    
  )
} 