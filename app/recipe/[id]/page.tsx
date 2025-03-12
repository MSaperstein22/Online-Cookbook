"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRecipes } from "../context/RecipesContext";

export default function RecipeDetails({ params }: { params: { id: string } }) {
  const { recipes, updateRecipe } = useRecipes();
  const searchParams = useSearchParams();
  const recipeId = Number(params.id);
  const [newRecipeStep, setNewRecipeStep] = useState("");
  const [editStepIndex, setEditStepIndex] = useState<number | null>(null);
  const [editStepText, setEditStepText] = useState("");
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);

  const recipe = recipes.find((r) => r.id === recipeId);
  const recipeTitle = recipe?.title || searchParams.get("title") || "Recipe Details";
  const recipeSteps = recipe?.steps || [];

  const initialCoverPhoto = recipe?.coverPhoto || null;

  const currentCoverPhoto = coverPhoto || initialCoverPhoto;

  const handleCoverPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result as string);
        if (recipe) {
          updateRecipe(recipe.id, { ...recipe, coverPhoto: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStep = () => {
    if (!newRecipeStep.trim()) return;

    const newStep = { text: newRecipeStep.trim() };

    const updatedRecipe = {
      id: recipeId,
      title: recipe?.title || "Untitled Recipe",
      coverPhoto: currentCoverPhoto,
      steps: [...recipeSteps, newStep],
    };

    updateRecipe(recipeId, updatedRecipe);
    setNewRecipeStep("");
  };

  const handleDeleteStep = (stepIndex: number) => {
    if (!recipe) return;

    const updatedSteps = recipeSteps.filter((_, index) => index !== stepIndex);
    const updatedRecipe = { ...recipe, steps: updatedSteps };

    if (recipe.id) {
      updateRecipe(recipe.id, updatedRecipe);
    }
  };

  const toggleStepCompletion = (index: number) => {
    const updatedCompletedSteps = new Set(completedSteps);
    if (updatedCompletedSteps.has(index)) {
      updatedCompletedSteps.delete(index);
    } else {
      updatedCompletedSteps.add(index);
    }
    setCompletedSteps(updatedCompletedSteps);
  };

  const handleEditStep = (stepIndex: number) => {
    setEditStepIndex(stepIndex);
    setEditStepText(recipeSteps[stepIndex].text);
  };

  const handleSaveEdit = () => {
    if (editStepIndex === null || !recipe) return;

    const updatedSteps = [...recipeSteps];
    updatedSteps[editStepIndex].text = editStepText;

    const updatedRecipe = {
      ...recipe,
      steps: updatedSteps,
    };

    if (recipe.id) {
      updateRecipe(recipe.id, updatedRecipe);
    }

    setEditStepIndex(null);
    setEditStepText("");
  };

  return (
    <main>
      <header>
        <h1>{recipeTitle}</h1>
      </header>

      {/* Cover Photo Section */}
      <div className="cover-photo-container">
        <div className="file-upload-wrapper">
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverPhotoUpload}
            id="cover-photo-input"
            className="file-upload-input"
          />
          <label htmlFor="cover-photo-input" className="file-upload-label">
            {currentCoverPhoto ? "Modify Cover Photo" : "File Upload for Cover Photo"}
          </label>
        </div>
        
        {(currentCoverPhoto) && (
          <img
            src={currentCoverPhoto || undefined}
            alt="Recipe cover photo"
            style={{ maxWidth: "100%", marginTop: "10px", padding: "0 16px" }}
          />
        )}
      </div>

      {/* Add a Step Section */}
      <section aria-label="Add recipe steps section">
        <div><h3>Add Steps to the Recipe</h3></div>
        <input
          type="text"
          placeholder="Step Description"
          value={newRecipeStep}
          onChange={(e) => setNewRecipeStep(e.target.value)}
        />
        <button onClick={handleAddStep}>Add Step</button>
      </section>

      {/* Display Recipe Steps */}
      <section aria-label="Recipe step display" style={{ paddingLeft: "10px", paddingRight: "10px" }}>
      <div><h3>Steps</h3></div>
        {recipeSteps.length > 0 ? (
          <ol className="step-list">
            {recipeSteps.map((step, index) => (
              <li className="step-list-item" key={index} style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={completedSteps.has(index)}
                  onChange={() => toggleStepCompletion(index)}
                  style={{ marginRight: "10px" }}
                />
                {editStepIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editStepText}
                      onChange={(e) => setEditStepText(e.target.value)}
                      className="edit-step-input"
                      style={{ marginRight: "10px" }}
                    />
                    <button aria-label="Save edits to recipe step" className="edit-button" onClick={handleSaveEdit} style={{ marginRight: "10px" }}>Save</button>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        textDecoration: completedSteps.has(index) ? "line-through" : "none",
                        marginRight: "10px",
                      }}
                    >
                      {step.text}
                    </span>
                    <button aria-label="Edit recipe step"  className="edit-button" onClick={() => handleEditStep(index)}
                    style={{ marginRight: "10px" }}
                    >Edit</button>
                    <button aria-label="Remove recipe step" className="remove-step-button-style"
                      onClick={() => handleDeleteStep(index)}
                    >
                      ✖️
                    </button>
                  </>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p>No steps added yet.</p>
        )}
      </section>

      {/* Back button to main recipe page */}
      <nav aria-label="Back navigation" style={{ paddingLeft: "10px", paddingRight: "10px" }}>
        <Link href="/">
          <button>Back to Home Page</button>
        </Link>
      </nav>
    </main>
  );
}
