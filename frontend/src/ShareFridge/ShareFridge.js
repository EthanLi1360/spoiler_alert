import { useState } from "react";
import buttonImage from "./share-svgrepo-com.svg";
import styles from "./ShareFridge.module.css";
import { addFridgeAccess } from "../Util";

function ShareFridge({activeFridgeID}) {
    const toggleModal = () => {
        if (modalActive) {
            setModalCSS(styles.modalBase + " " + styles.animateToHidden);
        } else {
            setModalCSS(styles.modalBase + " " + styles.animateToActive);
        }
        setModalActive(!modalActive);
    }

    const handleSharing = async () => {
        setButtonDisabled(true);
        let returnVal = await addFridgeAccess(username, activeFridgeID, "EDIT");
        if (returnVal == undefined || returnVal.success == false) {
            alert("There was an error sharing this fridge. Please try again or check the console for more details")
            setButtonDisabled(false);
            setUsername("");
        }
        else if (returnVal.success == true) {
            alert("Successfully shared!");
            setUsername("");
            setButtonDisabled(false);
            setModalActive(!modalActive);
            setModalCSS(styles.modalBase + " " + styles.animateToHidden);
        }
    }
    
    const[modalCSS, setModalCSS] = useState(styles.modalBase);
    const[modalActive, setModalActive] = useState(false);
    const[username, setUsername] = useState("");
    const[buttonDisabled, setButtonDisabled] = useState(false);


    return (
        <div className={styles.container}>
            <button onClick={toggleModal}><img src={buttonImage} /></button>
            <div className={modalCSS}>
                <div className={styles.modalContainer}>
                    <input type="text" placeholder="recipient username" className={styles.input} onChange={(e) => setUsername(e.target.value)} value={username} />
                    <button className={styles.submitButton} onClick={handleSharing} disabled={buttonDisabled}>{buttonDisabled ? "Sharing..." : "Share!"}</button>
                </div>
            </div>
        </div>
    );
}

export default ShareFridge;