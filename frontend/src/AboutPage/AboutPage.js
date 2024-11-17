import styles from "./AboutPage.module.css";
import Footer from "../Footer/Footer"

export default function AboutPage() {
  return (
    <div className={styles.bg}>
      <div className={styles.container}>
        <h1>About The Project</h1>
    
        <div className={styles.aboutSection}>
          <h2>Objective</h2>
          <p>Our project, <strong>Spoiler Alert!</strong>, is a smart fridge platform that allows users to manage their groceries efficiently. Users can input foods and ingredients into a digital fridge, track expiration dates manually or via AI, and share their fridge with others. Additionally, the platform generates recipes based on available ingredients, prioritizing items nearing expiration.</p>
        </div>
    
        <div className={styles.aboutSection}>
          <h2>Tech Stack</h2>
          <ul>
            <li>Frontend: React with a CSS framework</li>
            <li>Backend: Flask with Axios for API requests</li>
            <li>AI: PyTorch model for processing requests</li>
            <li>Database: SQLite for lightweight storage or MongoDB for scalability</li>
          </ul>
        </div>
    
        <div className={styles.aboutSection}>
          <h2>Key Features</h2>
          <ul>
            <li>Track foods and their expiration dates</li>
            <li>Sort foods by name, type, and expiration date</li>
            <li>Share fridges with others via usernames or links</li>
            <li>AI-powered recipe generation using fridge contents</li>
            <li>Options for dietary constraints and nutritional goals</li>
            <li>Save favorite recipes for future use</li>
            <li>Shopping cart creation and integration with fridges</li>
          </ul>
        </div>
    
        <div className={styles.aboutSection}>
          <h2>How It Works</h2>
          <p>Users log in to the platform and create or access shared fridges. They can add food items, let the AI estimate expiration dates, and view recipes tailored to their fridge contents. Fridges can be shared with other users for collaborative food management.</p>
        </div>
    
        <div className={styles.aboutSection}>
          <h2>Resources</h2>
          <p>Check out our project repositories and resources:</p>
          <ul>
            <li><a href="https://github.com/EthanLi1360/spoiler_alert" target="_blank">GitHub Repository</a></li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>  
  )
}
