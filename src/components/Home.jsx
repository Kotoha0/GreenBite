import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, MessageCircle, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { RecipeDetail } from './RecipeDetail';
import { ImageWithFallback } from './ImageWithFallback';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home({ category, userRecipes, currentUser }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTagFilters, setSelectedTagFilters] = useState([]);
  const [customTagInput, setCustomTagInput] = useState('');


  // Toggle like
  const toggleLikeFirebase = async (recipeId) => {
    if (!currentUser) return;
    const recipeRef = doc(db, 'recipes', recipeId);
    const recipe = userRecipes.find(r => r.id === recipeId);
    const liked = recipe.likes?.includes(currentUser.uid);
    await updateDoc(recipeRef, {
      likes: liked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
    });
  };

  const effectiveLikedItems = new Set(
    userRecipes.filter(r => r.likes?.includes(currentUser?.uid)).map(r => r.id)
  );

  // ONLY show published recipes on Home / Like
	const publishedRecipes = userRecipes.filter(
  (recipe) => recipe.published === true
	);

  console.log("Published recipes:", publishedRecipes);

  const filteredData =
    selectedTagFilters.length > 0
      ? publishedRecipes.filter(item =>
          selectedTagFilters.every(tag =>
            item.tags?.some(t =>
              t.toLowerCase().includes(tag.toLowerCase())
            )
          )
        )
      : publishedRecipes;

  const handleCardClick = (e, item) => {
    if (e.target.closest('button')) return;
    setSelectedItem(item);
  };

  const handleLikeClick = (e, id) => {
    e.stopPropagation();
    toggleLikeFirebase(id);
  };

  const toggleTagFilter = (tag) => {
    setSelectedTagFilters(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const trimmed = customTagInput.trim().toLowerCase();
    if (trimmed && !selectedTagFilters.includes(trimmed)) {
      setSelectedTagFilters([...selectedTagFilters, trimmed]);
      setCustomTagInput('');
    }
  };

  const removeTagFilter = (tag) => {
    setSelectedTagFilters(selectedTagFilters.filter(t => t !== tag));
  };

  const clearAllFilters = () => setSelectedTagFilters([]);

  // Show recipe detail if a card is selected
  if (selectedItem) {
    return (
      <RecipeDetail
        recipe={selectedItem}
        currentUser={currentUser} // <--- add this
        isLiked={effectiveLikedItems.has(selectedItem.id)}
        onToggleLike={() => toggleLikeFirebase(selectedItem.id)}
        onBack={() => setSelectedItem(null)}
      />
    );
  }

  return (
    <div>
      {(category === 'home' || category === 'like') && (
        <Card className="mb-8 p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-lg">🥕 What's left in your fridge?</Label>
              <p className="text-sm text-gray-500 mt-1">
                Select ingredients to filter recipes. Multiple tags = recipes with ALL ingredients.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Quick select:</p>
              <div className="flex flex-wrap gap-2">
                {['rice','pasta','chicken','egg','carrot','spinach','tomato','cheese'].map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTagFilters.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer py-2 px-4"
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                placeholder="Search for unique ingredients..."
                onKeyDown={(e) => { if(e.key==='Enter'){ e.preventDefault(); addCustomTag(); } }}
              />
              <Button type="button" onClick={addCustomTag} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {selectedTagFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTagFilters.map(tag => (
                  <Badge key={tag} className="bg-emerald-600 py-2 px-4">
                    {tag} <X className="w-3 h-3 ml-2 cursor-pointer" onClick={() => removeTagFilter(tag)} />
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>Clear all</Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {filteredData.length === 0 ? (
        <Card className="p-16 text-center">
          <h3 className="text-gray-600 mb-4">No recipes found</h3>
          <p className="text-gray-500 leading-relaxed">
            Try selecting different ingredients or clear your filters
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {filteredData.map(item => (
            <Card
              key={item.id}
              className={`overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 ${
                item.authorId === currentUser?.uid
                  ? 'border-2 border-emerald-500'
                  : ''
              }`}
              onClick={(e) => handleCardClick(e, item)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={item.imageUrl || item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />

                {item.authorId === currentUser?.uid && (
                  <Badge className="absolute top-3 left-3 bg-emerald-600 text-white">
                    My Recipe
                  </Badge>
                )}
              </div>
              <CardContent className="p-8">
                <h3 className="mb-4">{item.title}</h3>
                <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.tags?.slice(0,5).map((tag,index)=> <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>)}
                  {item.tags?.length > 5 && <Badge variant="secondary" className="text-xs">+{item.tags.length-5}</Badge>}
                </div>
                <div className="flex items-center gap-6 text-gray-500">
                  <button className="flex items-center gap-2 hover:text-red-500 transition-colors" onClick={(e)=>handleLikeClick(e,item.id)}>
                    <Heart className={`w-4 h-4 ${effectiveLikedItems.has(item.id)? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="text-sm">{item.likes?.length || 0}</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4"/>
                    <span className="text-sm">{item.comments?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
