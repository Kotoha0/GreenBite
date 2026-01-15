import { useState, useEffect } from 'react'; 
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './ImageWithFallback';
import { RecipeDetail } from './RecipeDetail';
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';

export function Post({ recipes, onPublish, onUnpublish, onEdit, onDelete }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [open, setOpen] = useState(false);
  const [deletingRecipe, setDeletingRecipe] = useState(null); 

  useEffect(() => {
    console.log("Post component received recipes:", recipes);
    console.log("Unpublished Recipes:", unpublishedRecipes);
    console.log("Published Recipes:", publishedRecipes);
  }, [recipes]);

  const unpublishedRecipes = recipes.filter((r) => !r.published);
  const publishedRecipes = recipes.filter((r) => r.published);

  const publishRecipe = (e, id) => { 
    e.stopPropagation();
    onPublish(id);
    toast.success('Recipe published! Now visible on Home feed.');
  };

  const unpublishRecipe = (e, id) => {
    e.stopPropagation();
    onUnpublish(id);
    toast.success('Recipe unpublished. Moved to drafts.');
  };

  const handleEditClick = (e, recipe) => {
    e.stopPropagation();
    onEdit(recipe);
  };

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={{ ...selectedRecipe, category: 'my-recipes' }}
        recipeLiked={false} 
        handleRecipeLike={() => {}} 
        returnToPrevious={() => setSelectedRecipe(null)} 
        hideInteractions={true}
        handleEditRecipe={(recipe) => {
          setSelectedRecipe(null);
          onEdit(recipe);
        }}
        backButtonLabel="Back" 
      />
    );
  }

  const createRecipeCard = (recipe, showDraft = false) => ( 
    <Card
      key={recipe.id}
      className={`overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 ${
        showDraft ? 'border-2 border-dashed border-gray-300' : 'border-2 border-emerald-200' 
      }`}
      onClick={() => setSelectedRecipe(recipe)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={recipe.image || recipe.imageUrl || "https://via.placeholder.com/300"}
          alt={recipe.title || "Untitled Recipe"}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 opacity-75"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className={`${showDraft ? 'bg-gray-600 text-white' : 'bg-emerald-600'}`}> {/* Updated from isDraft */}
            {showDraft ? 'Draft' : 'Published'} {/* Updated from isDraft */}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 text-emerald-900">{recipe.title || "Untitled Recipe"}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description || "No description provided."}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {(recipe.tags || []).slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
          {(recipe.tags?.length > 3) && <Badge variant="secondary" className="text-xs">+{recipe.tags.length - 3}</Badge>}
        </div>

        {/* Timestamps */}
        <div className="text-xs text-gray-400 mb-2">
          <p>Created: {displayTimestamp(recipe.createdAt)}</p> {/* Updated from formatTimestamp */}
          <p>Updated: {displayTimestamp(recipe.updatedAt)}</p> {/* Updated from formatTimestamp */}
        </div>

        <div className="flex gap-2">
          {showDraft ? ( /* Updated from isDraft */
            <Button
              className="flex-1"
              size="sm"
              onClick={(e) => publishRecipe(e, recipe.id)} 
            >
              <Eye className="w-4 h-4 mr-1" />
              Publish
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex-1"
              size="sm"
              onClick={(e) => unpublishRecipe(e, recipe.id)} 
            >
              <EyeOff className="w-4 h-4 mr-1" />
              Unpublish
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={(e) => handleEditClick(e, recipe)}
          >
            <Pencil className="w-4 h-4" />
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeletingRecipe(recipe.id); 
              setOpen(true); 
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const displayTimestamp = (timestamp) => { 
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString(); 
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Drafts */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <EyeOff className="w-6 h-6 text-gray-500" />
          <h2 className="text-emerald-800">Drafts ({unpublishedRecipes.length})</h2>
        </div>
        {unpublishedRecipes.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No drafts yet. Create a recipe in the Recipes tab!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unpublishedRecipes.map(r => createRecipeCard(r, true))} {/* Updated from renderRecipeCard */}
          </div>
        )}
      </div>

      {/* Published */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-6 h-6 text-emerald-600" />
          <h2 className="text-emerald-800">Published ({publishedRecipes.length})</h2>
        </div>
        {publishedRecipes.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No published recipes yet. Publish a draft to share it on the Home feed!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedRecipes.map(r => createRecipeCard(r, false))} {/* Updated from renderRecipeCard */}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recipe?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your recipe.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(deletingRecipe);
                toast.success("Recipe deleted");
                setOpen(false); 
                setDeletingRecipe(null); 
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}