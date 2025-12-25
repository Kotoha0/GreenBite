import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './ImageWithFallback';
import { RecipeDetail } from './RecipeDetail';
import { Eye, EyeOff, Pencil } from 'lucide-react';
import { toast } from 'sonner';

export function Post({ recipes, onPublish, onUnpublish, onEdit }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const unpublishedRecipes = recipes.filter(r => !r.published);
  const publishedRecipes = recipes.filter(r => r.published);

  const handlePublish = (e, id) => {
    e.stopPropagation();
    onPublish(id);
    toast.success('Recipe published! 🎉 Now visible on Home feed.');
  };

  const handleUnpublish = (e, id) => {
    e.stopPropagation();
    onUnpublish(id);
    toast.success('Recipe unpublished. Moved to drafts.');
  };

  const handleEdit = (e, recipe) => {
    e.stopPropagation();
    onEdit(recipe);
  };

  // If viewing a recipe detail, show that
  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={{ ...selectedRecipe, category: 'my-recipes' }}
        isLiked={false}
        onToggleLike={() => {}}
        onBack={() => setSelectedRecipe(null)}
        hideInteractions={true}
        onEdit={(recipe) => {
          setSelectedRecipe(null);
          onEdit(recipe);
        }}
        backButtonText="Back"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Drafts Section */}
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
            {unpublishedRecipes.map((recipe) => (
              <Card 
                key={recipe.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 border-dashed border-gray-300"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 opacity-75"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-gray-600 text-white">
                      Draft
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 text-emerald-900">{recipe.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {recipe.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{recipe.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      size="sm"
                      onClick={(e) => handlePublish(e, recipe.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Publish
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => handleEdit(e, recipe)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Published Section */}
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
            {publishedRecipes.map((recipe) => (
              <Card 
                key={recipe.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 border-emerald-200"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-emerald-600">
                      Published
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 text-emerald-900">{recipe.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {recipe.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{recipe.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      size="sm"
                      onClick={(e) => handleUnpublish(e, recipe.id)}
                    >
                      <EyeOff className="w-4 h-4 mr-1" />
                      Unpublish
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => handleEdit(e, recipe)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}