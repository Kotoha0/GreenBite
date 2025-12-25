import { useState } from 'react';
import { ImageWithFallback } from './ImageWithFallback';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, MessageCircle, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { RecipeDetail } from './RecipeDetail';
import { Input } from './ui/input';
import { Label } from './ui/label';

const wellnessData = [
  {
    id: 1,
    title: 'Morning Smoothie Bowl',
    category: 'home',
    image: 'https://images.unsplash.com/photo-1645652367526-a0ecb717650a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWVkaXRhdGlvbiUyMHdlbGxuZXNzfGVufDF8fHx8MTc2MTIyODQxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Start your day with this energizing smoothie bowl topped with fresh fruits, granola, and a drizzle of honey. Perfect for a quick and healthy breakfast!',
    likes: 234,
    tags: ['banana', 'spinach', 'almond milk', 'honey', 'granola', 'berries'],
    leftoverIngredients: ['banana', 'spinach'],
    ingredients: [
      { item: 'Banana', amount: '1', isLeftover: true },
      { item: 'Spinach', amount: '1 cup', isLeftover: true },
      { item: 'Almond Milk', amount: '1 cup', isLeftover: false },
      { item: 'Honey', amount: '1 tbsp', isLeftover: false },
      { item: 'Granola', amount: '1/4 cup', isLeftover: false },
      { item: 'Berries', amount: '1/2 cup', isLeftover: false }
    ],
    steps: [
      'Blend banana, spinach, almond milk, and honey until smooth.',
      'Pour the smoothie into a bowl.',
      'Top with granola and berries.',
      'Serve immediately.'
    ],
    comments: [
      { id: 1, user: 'Sarah', text: 'This looks amazing! Definitely trying this tomorrow morning.', time: '2 hours ago' },
      { id: 2, user: 'Mike', text: 'Made this today and it was delicious! Added some chia seeds too.', time: '5 hours ago' }
    ]
  },
  {
    id: 2,
    title: 'Mediterranean Buddha Bowl',
    category: 'recipes',
    image: 'https://images.unsplash.com/photo-1670164747721-d3500ef757a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMG51dHJpdGlvbnxlbnwxfHx8fDE3NjEyNTE2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'A colorful and nutritious bowl packed with quinoa, roasted vegetables, chickpeas, and tahini dressing. Ready in just 30 minutes!',
    likes: 567,
    tags: ['quinoa', 'chickpeas', 'zucchini', 'bell pepper', 'tahini', 'lemon', 'olive oil', 'cilantro'],
    leftoverIngredients: ['quinoa', 'chickpeas'],
    ingredients: [
      { item: 'Quinoa', amount: '1 cup', isLeftover: true },
      { item: 'Chickpeas', amount: '1 can (drained and rinsed)', isLeftover: true },
      { item: 'Zucchini', amount: '1 medium, sliced', isLeftover: false },
      { item: 'Bell Pepper', amount: '2, sliced', isLeftover: false },
      { item: 'Tahini', amount: '2 tbsp', isLeftover: false },
      { item: 'Lemon', amount: '1 tbsp juice', isLeftover: false },
      { item: 'Olive Oil', amount: '2 tbsp', isLeftover: false },
      { item: 'Cilantro', amount: 'for garnish', isLeftover: false }
    ],
    steps: [
      'Preheat oven to 400°F (200°C).',
      'Toss zucchini and bell peppers with olive oil, salt, and a pinch of paprika.',
      'Roast in the oven for 20-25 minutes until tender.',
      'Cook quinoa according to package instructions.',
      'In a small bowl, whisk together tahini, lemon juice, and a bit of water to make the dressing.',
      'Combine cooked quinoa, roasted vegetables, and chickpeas in a large bowl.',
      'Drizzle with tahini dressing and garnish with fresh cilantro.'
    ]
  },
  {
    id: 3,
    title: 'Protein Power Pasta',
    category: 'post',
    image: 'https://images.unsplash.com/photo-1634788699201-77bbb9428ab6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjB3b3Jrb3V0fGVufDF8fHx8MTc2MTIzMDE2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'High-protein pasta dish with grilled chicken, spinach, and a light garlic sauce. Perfect post-workout meal that tastes amazing!',
    likes: 423,
    tags: ['pasta', 'chicken', 'spinach', 'garlic', 'olive oil'],
    leftoverIngredients: ['pasta', 'chicken'],
    ingredients: [
      { item: 'Pasta', amount: '1 cup', isLeftover: true },
      { item: 'Chicken', amount: '2 breasts, sliced', isLeftover: true },
      { item: 'Spinach', amount: '1 bag', isLeftover: false },
      { item: 'Garlic', amount: '3 cloves, minced', isLeftover: false },
      { item: 'Olive Oil', amount: '2 tbsp', isLeftover: false }
    ],
    steps: [
      'Cook pasta according to package instructions.',
      'In a large skillet, heat olive oil over medium-high heat.',
      'Add minced garlic and sauté for 1 minute until fragrant.',
      'Add chicken slices and cook until browned and cooked through.',
      'Add spinach to the skillet and cook until wilted.',
      'Season with salt and black pepper to taste.',
      'Combine cooked pasta with the chicken and spinach mixture.',
      'Serve hot.'
    ]
  },
  {
    id: 4,
    title: 'Avocado Toast Deluxe',
    category: 'home',
    image: 'https://images.unsplash.com/photo-1716893917077-5b320c1ecfec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjByZWxheGF0aW9ufGVufDF8fHx8MTc2MTI0NjU5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Elevated avocado toast with poached eggs, cherry tomatoes, and microgreens. A brunch favorite that\'s ready in 10 minutes!',
    likes: 389,
    tags: ['avocado', 'egg', 'tomato', 'bread', 'microgreens'],
    leftoverIngredients: ['avocado', 'bread'],
    ingredients: [
      { item: 'Avocado', amount: '1', isLeftover: true },
      { item: 'Egg', amount: '2', isLeftover: false },
      { item: 'Tomato', amount: '1/2 cup cherry tomatoes', isLeftover: false },
      { item: 'Microgreens', amount: '1/4 cup', isLeftover: false },
      { item: 'Bread', amount: '2 slices', isLeftover: true }
    ],
    steps: [
      'Slice avocado and toast bread slices.',
      'In a small pot, bring water to a boil.',
      'Add eggs and poach for 3-4 minutes until whites are set.',
      'Drizzle avocado slices with a bit of olive oil.',
      'Top avocado toast with poached eggs, cherry tomatoes, and microgreens.',
      'Season with salt and black pepper to taste.',
      'Serve immediately.'
    ]
  },
  {
    id: 5,
    title: 'Green Detox Soup',
    category: 'home',
    image: 'https://images.unsplash.com/photo-1606579820984-1df8e02419a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBwZWFjZWZ1bCUyMHNjZW5lcnl8ZW58MXx8fHwxNzYxMjUxNDcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Nourishing green soup with kale, broccoli, and herbs. Light yet filling, perfect for a healthy lunch or dinner.',
    likes: 612,
    tags: ['kale', 'broccoli', 'carrot', 'celery', 'garlic', 'olive oil', 'vegetable broth'],
    leftoverIngredients: ['kale', 'broccoli', 'carrot'],
    ingredients: [
      { item: 'Kale', amount: '1 bunch', isLeftover: true },
      { item: 'Broccoli', amount: '1 head', isLeftover: true },
      { item: 'Carrot', amount: '2, sliced', isLeftover: true },
      { item: 'Celery', amount: '2 stalks, sliced', isLeftover: false },
      { item: 'Garlic', amount: '3 cloves, minced', isLeftover: false },
      { item: 'Olive Oil', amount: '2 tbsp', isLeftover: false },
      { item: 'Vegetable Broth', amount: '4 cups', isLeftover: false }
    ],
    steps: [
      'In a large pot, heat olive oil over medium heat.',
      'Add minced garlic and sauté for 1 minute until fragrant.',
      'Add kale, broccoli, carrots, and celery to the pot.',
      'Pour in vegetable broth and bring to a boil.',
      'Reduce heat and simmer for 20-25 minutes until vegetables are tender.',
      'Season with salt and black pepper to taste.',
      'Serve hot.'
    ]
  },
  {
    id: 6,
    title: 'Chocolate Energy Bites',
    category: 'like',
    image: 'https://images.unsplash.com/photo-1646208160263-b0feaf01a4cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5kZnVsbmVzcyUyMHBlYWNlfGVufDF8fHx8MTc2MTI4NDc0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'No-bake chocolate energy bites made with dates, nuts, and cacao. Perfect healthy snack that satisfies your sweet cravings!',
    likes: 445,
    tags: ['dates', 'almonds', 'cashews', 'cacao', 'vanilla', 'honey'],
    leftoverIngredients: ['dates', 'almonds'],
    ingredients: [
      { item: 'Dates', amount: '10, pitted', isLeftover: true },
      { item: 'Almonds', amount: '1/2 cup', isLeftover: true },
      { item: 'Cashews', amount: '1/2 cup', isLeftover: false },
      { item: 'Cacao', amount: '1/4 cup powder', isLeftover: false },
      { item: 'Vanilla', amount: '1 tsp extract', isLeftover: false },
      { item: 'Honey', amount: '2 tbsp', isLeftover: false }
    ],
    steps: [
      'In a food processor, combine dates, almonds, cashews, cacao powder, vanilla extract, and honey.',
      'Process until the mixture is smooth and sticky.',
      'Roll the mixture into small balls (about 1 inch in diameter).',
      'Place the balls on a baking sheet lined with parchment paper.',
      'Refrigerate for at least 30 minutes to set.',
      'Serve and enjoy!'
    ]
  }
];

export function Home({ category, userRecipes = [], likedItems: externalLikedItems, onToggleLike: externalToggleLike, currentUser }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [localLikedItems, setLocalLikedItems] = useState(new Set());
  const [selectedTagFilters, setSelectedTagFilters] = useState([]);
  const [customTagInput, setCustomTagInput] = useState('');

  // Use external liked items if provided, otherwise use local state
  const likedItems = externalLikedItems || localLikedItems;
  const toggleLike = externalToggleLike || ((id) => {
    setLocalLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  });

  // Convert user recipes to WellnessItem format
  const userRecipeItems = userRecipes.map(recipe => ({
    ...recipe,
    category: 'home', // User published recipes appear on home
  }));

  // Keep track of which recipes are user-created
  const userRecipeIds = new Set(userRecipes.map(r => r.id));

  // Combine user recipes with static data
  const allData = category === 'home' 
    ? [...userRecipeItems, ...wellnessData.filter(item => item.category === 'home')]
    : wellnessData.filter(item => item.category === category);

  // For "like" category, show only liked recipes from all available data
  const allAvailableData = [...userRecipeItems, ...wellnessData];

  // Get all unique ingredient tags from all recipes
  const allIngredientTags = [...new Set(
    allAvailableData.flatMap(recipe => recipe.tags || [])
  )].sort();

  // Common ingredients for quick selection
  const commonIngredientTags = ['rice', 'pasta', 'chicken', 'egg', 'carrot', 'spinach', 'tomato', 'cheese'];

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

  const clearAllFilters = () => {
    setSelectedTagFilters([]);
  };

  // Apply tag filters
  let filteredByCategory = category === 'like'
    ? allAvailableData.filter(item => likedItems.has(item.id))
    : category === 'all' 
      ? allAvailableData
      : allData;

  // Apply ingredient tag filters
  const filteredData = selectedTagFilters.length > 0
    ? filteredByCategory.filter(item => {
        // Recipe must contain ALL selected tags
        return selectedTagFilters.every(filterTag => 
          item.tags.some(recipeTag => recipeTag.toLowerCase().includes(filterTag.toLowerCase()))
        );
      })
    : filteredByCategory;

  const handleCardClick = (e, item) => {
    // Don't open detail if clicking the like button
    if (e.target.closest('button')) {
      return;
    }
    setSelectedItem(item);
  };

  const handleLikeClick = (e, id) => {
    e.stopPropagation();
    toggleLike(id);
  };

  // If a recipe is selected, show the detail page
  if (selectedItem) {
    return (
      <RecipeDetail
        recipe={selectedItem}
        isLiked={likedItems.has(selectedItem.id)}
        onToggleLike={toggleLike}
        onBack={() => setSelectedItem(null)}
      />
    );
  }

  // Otherwise show the gallery grid
  return (
    <div>
      {/* Ingredient Tag Search - Only show on home or like tabs */}
      {(category === 'home' || category === 'like') && (
        <Card className="mb-8 p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-lg">🥕 What's left in your fridge?</Label>
              <p className="text-sm text-gray-500 mt-1">
                Select ingredients to find recipes. Multiple tags = recipes with ALL ingredients.
              </p>
            </div>

            {/* Common ingredient tags */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Quick select:</p>
              <div className="flex flex-wrap gap-2">
                {commonIngredientTags.map(tag => (
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

            {/* Custom tag input */}
            <div className="flex gap-2">
              <Input
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                placeholder="Search for unique ingredients..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={addCustomTag}
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Selected filters */}
            {selectedTagFilters.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Searching for: ({selectedTagFilters.length} ingredient{selectedTagFilters.length > 1 ? 's' : ''})
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                  >
                    Clear all
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTagFilters.map(tag => (
                    <Badge key={tag} className="bg-emerald-600 py-2 px-4">
                      {tag}
                      <X
                        className="w-3 h-3 ml-2 cursor-pointer"
                        onClick={() => removeTagFilter(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Results count */}
            {selectedTagFilters.length > 0 && (
              <p className="text-sm text-gray-600">
                Found {filteredData.length} recipe{filteredData.length !== 1 ? 's' : ''} with {selectedTagFilters.length > 1 ? 'all' : 'this'} ingredient{selectedTagFilters.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </Card>
      )}

      {filteredData.length === 0 && category === 'like' && selectedTagFilters.length === 0 ? (
        <Card className="p-16 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h3 className="text-gray-600 mb-4">No Liked Recipes Yet</h3>
          <p className="text-gray-500 leading-relaxed">
            Start exploring recipes on the Home tab and like your favorites to see them here!
          </p>
        </Card>
      ) : filteredData.length === 0 ? (
        <Card className="p-16 text-center">
          <h3 className="text-gray-600 mb-4">No recipes found</h3>
          <p className="text-gray-500 leading-relaxed">
            Try selecting different ingredients or clear your filters
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {filteredData.map((item) => (
            <Card 
              key={item.id} 
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={(e) => handleCardClick(e, item)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {currentUser && userRecipeIds.has(item.id) && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-emerald-600">
                      Your Recipe
                    </Badge>
                  </div>
                )}
                {/* Show leftover count badge */}
                {item.leftoverIngredients && item.leftoverIngredients.length > 0 && (
                  <div className="absolute top-3 left-3" style={{ marginLeft: currentUser && userRecipeIds.has(item.id) ? '110px' : '0' }}>
                    <Badge className="bg-orange-500">
                      🥕 {item.leftoverIngredients.length} leftover{item.leftoverIngredients.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-8">
                <h3 className="mb-4">{item.title}</h3>
                <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.tags.slice(0, 5).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{item.tags.length - 5}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-6 text-gray-500">
                  <button
                    className="flex items-center gap-2 hover:text-red-500 transition-colors"
                    onClick={(e) => handleLikeClick(e, item.id)}
                  >
                    <Heart className={`w-4 h-4 ${likedItems.has(item.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="text-sm">{item.likes + (likedItems.has(item.id) ? 1 : 0)}</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{Math.floor(Math.random() * 50 + 10)}</span>
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