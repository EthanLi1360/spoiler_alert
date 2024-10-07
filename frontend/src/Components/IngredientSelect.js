function IngredientSelect({recipe, fridgeContents}) {
    const searchFridge = (itemID) => {
        let val = 0;
        fridgeContents.forEach(element => {
            if (element.itemID === itemID) {
                val += element.quantity;
            }
        });
        return val
    };
    const addToShoppingList = (item, needed) => {
        console.log("item: " + item);
        console.log("needed: " + needed);
    }
    if(recipe){
        return (
            <table>
                <thead>
                    <tr>
                        <th>Ingredient</th>
                        <th>Calls For</th>
                        <th>Have</th>
                        <th>Needed</th>
                        <th>Add to List?</th>
                    </tr>
                </thead>
                <tbody>
                    {recipe.ingredients.map((item, index) => {
                        const fridgeQuantity = searchFridge(item.itemID);
                        const needed = item.quantity - fridgeQuantity < 0 ? 0 : item.quantity - fridgeQuantity
                        return(
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.quantity} {item.unit}s</td>
                                <td>{fridgeQuantity}</td>
                                <td>{needed}</td>
                                <td><button onClick={() => addToShoppingList(item, needed)}>ADD</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

export default IngredientSelect;