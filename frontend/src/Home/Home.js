import "./Home.css";

function Home(){
    return(
        <div className="container">
            <ul className="navbar">
                <li style={{float: "left"}}><a href="/">SpoilerAlert</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/login">Signup</a></li>
            </ul>
            <div className="title">
                <h1>SPOILER ALERT</h1>
                <h3>Smart Fridge, Smarter Recipes</h3>
                <p>Track, Organize, and Cook with Ease</p>
            </div>
        </div>
    )
}

export default Home;