function ShoppingList({list, itemAdded, saveList}) {
    if(list.length > 0) {
        let recipes = [];
        let mutableList = [...list];
        list.forEach(element => {
            const category = recipes.find((e) => e === element.recipeName)
            if (category === undefined) {
                recipes.push(element.recipeName);
            }
        });
        return(
            <div>
                {
                    recipes.map((recipeName, i) => {
                        return(
                            <div key={i}>
                                <h2>{recipeName}</h2>
                                <ul>
                                    {
                                        mutableList.map((item, j) => {
                                            if(item.recipeName === recipeName) {
                                                mutableList = mutableList.filter(e => e !== item);
                                                return(
                                                    <li key={j}>
                                                        <p>{item.quantity}{item.unit === "item" ? " " : " " + item.unit + " "}{item.name}</p>
                                                        <button onClick={() => itemAdded(item)}>Add to Fridge</button>
                                                    </li>
                                                );
                                            }
                                            else {
                                                return "";
                                            }
                                        })
                                    }
                                </ul>
                            </div>
                        )
                    })
                }
                <button onClick={() => saveList()}>Save List</button>
            </div>
        );
    }
}

export default ShoppingList;