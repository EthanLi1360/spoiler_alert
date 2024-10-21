//import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import RecipePage from './RecipePage';
import RecipeGenerationPage from './RecipeGenerationPage';

// This wrapper component is used to access the location state
function RecipeGenerationWrapper() {
    const location = useLocation();
    const selectedIngredients = location.state?.selectedIngredients || [];

    return <RecipeGenerationPage selectedIngredients={selectedIngredients} />;
}

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<RecipePage />} />
                    <Route path="/generate-recipes" element={<RecipeGenerationWrapper />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;