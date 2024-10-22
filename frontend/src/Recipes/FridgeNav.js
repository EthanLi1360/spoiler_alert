import { useEffect, useState } from "react";
import { getFridge, getUserFridgeAccess } from "../Util";
import styles from "./FridgeNav.module.css";

function FridgeNav({setActiveFridge}) {
    const [accessableFridges, setAccessableFridges] = useState([]);
    useEffect(() => {
        let access = getUserFridgeAccess();
        let fridgeArray = [];
        access.forEach((val) => {
            fridgeArray.push(getFridge(val.fridgeID));
        });
        setAccessableFridges(fridgeArray);
    }, []);

    return (
        <ul className={styles.list}>
            {accessableFridges.map((element, index) => {
                return(
                    <li key={index} onClick={() => setActiveFridge(element)}><p>{element.name}</p></li>
                );
            })}
        </ul>
    );
}

export default FridgeNav;