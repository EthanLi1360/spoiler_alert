import { useEffect, useState } from "react";
import { getFridges } from "../api/axios";
import styles from "./FridgeNav.module.css";

function FridgeNav({ setActiveFridge, username }) {
    const [fridges, setFridges] = useState([]);

    useEffect(() => {
        const fetchFridges = async () => {
            const response = await getFridges(username);
            if (response.success) {
                setFridges(response.fridgeIDs);
            }
        };
        fetchFridges();
    }, [username]);

    return (
        <ul className={styles.list}>
            {fridges.map((fridge, index) => (
                <li key={index} onClick={() => setActiveFridge(fridge)}>
                    <p>{fridge.name}</p>
                </li>
            ))}
        </ul>
    );
}

export default FridgeNav;