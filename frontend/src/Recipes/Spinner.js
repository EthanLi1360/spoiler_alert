import React, { useState, useEffect, useRef } from "react";
import styles from "./Spinner.module.css";
import axios from "axios";

const Spinner = ({ setCurrentFridge }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const [centerOffset, setCenterOffset] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [newFridgeName, setNewFridgeName] = useState("");
  const username = localStorage.getItem("username");
  const [Fridges, setFridges] = useState([{name: "Loading..."}])

  const refreshFridges = () => {
    const username = localStorage.getItem('username');
    axios.get("http://127.0.0.1:5000/get_fridges?username="+username)
    .then((response) => {
      console.log("AAAA")
      console.log(response)
        if (response.data.success) {
          setFridges(response.data.fridges);
        }
    });
  }

  useEffect(() => {
    const fetchFridges = async () => {
      try {
          refreshFridges();
      } catch (error) {
          console.error("Error fetching fridges:", error);
      }
    };
    fetchFridges();

    if (!sliderRef.current) return;

    const sliderWindow = sliderRef.current;
    const sliderWindowHeight = sliderWindow.offsetHeight;
    setCenterOffset(sliderWindowHeight / 2);
  }, [sliderRef]);



  const handleClick = (itemIndex) => {
    setCurrentIndex(itemIndex)
  }

  const createFridge = (newFridge) => {
     axios.post("http://127.0.0.1:5000/add_fridge", {
      username: localStorage.getItem("username"),
      name: newFridge
    })
      .then((response) => {
        if (response.data.success) {
          refreshFridges();
        }
      })
    // setFridges([...Fridges, newFridge])
  }

  const toggleIsCreating = () => setIsCreating((prev) => !prev)

  const calculateOffset = () => {
    if (!sliderRef.current) return 0;
    const sliderItems = sliderRef.current.children;
    let offset = 0;
  
    for (let i = 0; i < currentIndex; i++) {
      offset += sliderItems[i].offsetHeight;
      offset += 10 //include gap
    }
  
    return offset;
  };

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderWindow}>
        <div
          className={styles.sliderTrack}
          ref={sliderRef}
          style={{
            transform: `translateY(calc(${centerOffset}px - ${calculateOffset()}px))`,
          }}
        >
          {Fridges.length > 0 ? Fridges.map((item, index) => (
            <div
              key={index}
              className={styles.sliderItem}
              style={{
                transform: `scale(${
                  1 - Math.abs(currentIndex - index) * 0.15
                })`,
                opacity: Math.max(1 - Math.abs(currentIndex - index) * 0.2, 0),
              }}
              onClick={() => handleClick(index)}
            >
              {item.name}
            </div>
          )) : <>
            <p style={{color: "#aaa", fontSize: "15px"}}>You have no fridges</p>
          </>}
        </div>
      </div> 
      {
        !isCreating ? (
          <>
            <div className={styles.createFridge} onClick={toggleIsCreating}>
              Create New Fridge
            </div>
            <div className={styles.createFridge} onClick={() => {
              if (Fridges.length > 0) {
                setCurrentFridge(Fridges[currentIndex]);
              }
            }}>
              Select Current Fridge
            </div>
          </>
        ) : (
          <>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="textInput"
                placeholder="Name"
                value={newFridgeName}
                onChange={(e) => setNewFridgeName(e.target.value)}
                className={styles.inputFridgeName}
              />
              <div style={{display: "flex", gap: "10px"}}>
                <button className={styles.inputFridgeButton} onClick={() =>{
                  createFridge(newFridgeName);
                  toggleIsCreating();
                  }}>Create</button>
                <button className={styles.inputFridgeButton} onClick={toggleIsCreating}>Cancel</button>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
};

export default Spinner;
