"use client";

import React, { createContext, useContext, useState } from "react";

type RecipeStep = {
  text: string;
};

type Recipe = {
  id: number;
  title: string;
  coverPhoto: string | null;
  steps: RecipeStep[];
};

type RecipesContextType = {
  recipes: Recipe[];
  addRecipe: (newRecipe: Recipe) => void;
  updateRecipe: (id: number, updatedRecipe: Recipe) => void;
};

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Function to add a new recipe
  const addRecipe = (newRecipe: Recipe) => {
    setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
  };

  // Function to update an existing recipe
  const updateRecipe = (recipeId: number, updatedRecipe: Recipe) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === recipeId ? { ...recipe, ...updatedRecipe } : recipe
      )
    );
  };

  return (
    <RecipesContext.Provider value={{ recipes, addRecipe, updateRecipe }}>
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipesProvider");
  }
  return context;
}
