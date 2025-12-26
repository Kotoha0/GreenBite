import React, { useState } from 'react';
import { CreateRecipe } from './CreateRecipe';
import { useMyRecipes } from './useMyRecipes';
import { Spinner } from './ui/spinner'; // optional, for loading indicator

export function MyRecipesPage() {
  const { recipes, loading, addRecipe, updateRecipe, deleteRecipe } = useMyRecipes();
  const [editingRecipe, setEditingRecipe] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <CreateRecipe
        myRecipes={recipes}
        onAddRecipe={addRecipe}
        onUpdateRecipe={updateRecipe}
        editingRecipe={editingRecipe}
        onCancelEdit={() => setEditingRecipe(null)}
      />
    </div>
  );
}