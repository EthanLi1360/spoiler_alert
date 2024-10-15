import './ListRecipe.css';

function ListRecipes({savedRecipes, callback}) {
    return(
        <div id="menu">
                <ul>
                    {
                        savedRecipes.map((item, index) => {
                            return(
                                <li key={index} onClick={() => callback(item)}>{item.name}</li>
                            );
                        })
                    }
                </ul>
            </div>
    );
}

export default ListRecipes;