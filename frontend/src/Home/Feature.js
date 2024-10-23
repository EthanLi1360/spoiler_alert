import { useEffect, useState } from "react";
import styles from "./Feature.module.css";

import fridge_image from "./fridge_image.png"
import cart_image from "./cart_image.png"
import kitchen_image from "./kitchen_image.png"

function Feature() {
    const dataList = [
        {
            imageURL: fridge_image,
            title: "Personalized Fridges, Effortlessly Organized",
            description: "Organize your ingredients effortlessly by creating personalized fridges. Add food items with key details like expiration dates, quantities, and categories. Filter your inventory to find what you need, exactly when you need it."
        },
        {
            imageURL: cart_image,
            title: "Smart Shopping Lists for Seamless Planning",
            description: "Plan your meals efficiently with custom shopping lists. Track what’s running low and never miss an item while shopping. Link your fridge inventory directly to your shopping list for a seamless grocery experience."
        },
        {
            imageURL: kitchen_image,
            title: "Recipe Recommendations For Your Fridge",
            description: "Turn what you have into something delicious. Generate recipes based on your fridge’s contents and dietary preferences. Prioritize recipes using ingredients close to their expiry date and minimize waste, all while cooking like a pro."
        },
    ]

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener('resize', () => {
            setWidth(window.innerWidth);
        })
    }, []);

    const FeatureImage = (data) => ( 
        <div className={styles.image}>
            <img src={data.imageURL} alt="" />
        </div>
    )
    
    const FeatureDesc = (data) => (
        <div className={styles.descdiv}>
            <div className={styles.description}>
                <h3>{data.title}</h3>
                <p>{data.description}</p>
            </div>
        </div>
    )

    return width > 1000 ? (
        <div className={styles.padding}>
            { dataList.map((data, i) => {
                if (i % 2 === 0) {
                    return <div className={styles.container} key={i}>
                        {FeatureImage(data)}
                        {FeatureDesc(data)}
                    </div>;
                }
                return <div className={styles.container} key={i}>
                    {FeatureDesc(data)}
                    {FeatureImage(data)}
                </div>;
            }) }
        </div>
    ) : 
    (
        <div className={styles.padding}>
            { dataList.map((data, i) => <>
                <div className={styles.container} key={i}>
                    {FeatureDesc(data)}
                </div>
                <div className={styles.container} key={i}>
                    {FeatureImage(data)}
                </div>
            </>)}
        </div>
    );
}

export default Feature;