"use client";

import { useState } from "react";
import Link from "next/link";
import { useRecipes } from "../app/recipe/context/RecipesContext";

export default function Home() {
  const { recipes, addRecipe } = useRecipes();
  const [newRecipeTitle, setNewRecipeTitle] = useState("");

  const handleAddRecipe = () => {
    if (!newRecipeTitle.trim()) return; // Prevent adding recipes with empty titles

    const newRecipe = {
      id: Date.now(),
      title: newRecipeTitle.trim(),
      coverPhoto: null,
      steps: [],
    };

    addRecipe(newRecipe);
    setNewRecipeTitle("");
  };

  return (
    <main>
      <header>
        <h1>Recipe Tracker</h1>
        <p>Welcome to your online cookbook! See all of your favorite recipes in one place!</p>
      </header>

      <section aria-label="Add recipe section">
        <div>
        <h3>Add a New Recipe</h3>
        </div>
        <input
          type="text"
          placeholder="Recipe Title"
          value={newRecipeTitle}
          onChange={(e) => setNewRecipeTitle(e.target.value)}
          aria-label="Recipe title input"
        />
        <button onClick={handleAddRecipe}>Add Recipe</button>
      </section>

      <section aria-label="Recipe display section" className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <Link href={`/recipe/${recipe.id}?title=${encodeURIComponent(recipe.title)}`}>
                <div className="recipe-card-content">
                  {recipe.coverPhoto ? (
                    <img
                      src={recipe.coverPhoto}
                      alt={`${recipe.title} cover photo`}
                      className="recipe-cover-photo"
                    />
                  ) : (
                    <div className="placeholder-image" aria-label="No cover photo added for this recipe yet">No Cover Photo</div>
                  )}
                  <h3>{recipe.title}</h3>
                </div>
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}
