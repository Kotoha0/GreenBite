import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Plus, Trash2, Upload, X, ArrowLeft, Check } from 'lucide-react';
import { toast } from "sonner";
import { ImageWithFallback } from './ImageWithFallback';
import { RecipeDetail } from './RecipeDetail';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from '../firebase';
import { serverTimestamp } from "firebase/firestore";

export function CreateRecipe({ onAddRecipe, onUpdateRecipe, editRecipe, onCancelEdit, myRecipes }) {
  const [step, setStep] = useState(1);
  const [leftoverIngredients, setLeftoverIngredients] = useState([]);
  const [newLeftoverInput, setNewLeftoverInput] = useState(''); 
  const [recipeTitle, setRecipeTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [ingredients, setIngredients] = useState([{ item: '', amount: '', isLeftover: false }]);
  const [steps, setSteps] = useState(['']);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [saving, setSaving] = useState(false);

  const commonLeftovers = [
    'rice', 'pasta', 'chicken', 'beef', 'pork', 'fish', 'salmon',
    'carrot', 'onion', 'garlic', 'tomato', 'potato', 'spinach',
    'broccoli', 'bell pepper', 'mushroom', 'zucchini', 'lettuce',
    'egg', 'cheese', 'milk', 'butter', 'bread', 'tofu',
    'beans', 'lentils', 'chickpeas', 'corn', 'peas'
  ];

  const selectLeftover = (ingredient) => { 
    setLeftoverIngredients((prev) =>
      prev.includes(ingredient) ? prev.filter((i) => i !== ingredient) : [...prev, ingredient]
    );
  };

  const addNewLeftover = () => {
    if (customLeftover.trim() && !leftoverIngredients.includes(customLeftover.trim().toLowerCase())) {
      setLeftoverIngredients([...leftoverIngredients, customLeftover.trim().toLowerCase()]);
      setCustomLeftover('');
    }
  };

  const goToRecipeEditor = () => { 
    if (leftoverIngredients.length === 0) {
      toast.error('Please select at least one leftover ingredient');
      return;
    }
    const leftoverIngredientsList = leftoverIngredients.map(item => ({
      item,
      amount: '',
      isLeftover: true
    }));
    setIngredients(leftoverIngredientsList);
    setStep(2);
  };

  const selectTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addNewIngredient = () => setIngredients([...ingredients, { item: '', amount: '', isLeftover: false }]); 
  const deleteIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addStep = () => setSteps([...steps, '']);
  const deleteStep = (index) => setSteps(steps.filter((_, i) => i !== index)); 
  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return imagePreview;
    const storage = getStorage();
    const storageRef = ref(storage, `recipes/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(storageRef);
  };

  const saveRecipe = async (e) => { 
    e.preventDefault();

    if (!auth.currentUser) {
      toast.error('You must be logged in to upload files.');
      return;
    }

    if (!recipeTitle || !description || (!imageFile && !imagePreview)) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (ingredients.some((ing) => !ing.item || !ing.amount)) {
      toast.error('Please complete all ingredient fields');
      return;
    }

    if (steps.some((step) => !step.trim())) {
      toast.error('Please complete all cooking steps');
      return;
    }

    const ingredientTags = ingredients.map((ing) =>
      ing.item.toLowerCase().trim()
    );
    const allTags = [...new Set([...ingredientTags, ...selectedTags])];

    const recipeData = {
      title: recipeTitle, 
      image: imagePreview,
      description,
      tags: allTags,
      ingredients,
      steps,
      published: false, 
      authorId: auth.currentUser.uid,
      leftoverIngredients: ingredients
        .filter((ing) => ing.isLeftover)
        .map((ing) => ing.item.toLowerCase()),
      updatedAt: serverTimestamp(),
    };

    try {
      const imageUrl = await uploadImage();
      recipeData.image = imageUrl;

      if (editRecipe) {
        await updateDoc(doc(db, 'recipes', editRecipe.id), recipeData);
        toast.success('Recipe updated successfully ');
        onCancelEdit();
      } else {
        recipeData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'recipes'), recipeData);
        toast.success('Recipe saved successfully ');
      }

      clearForm(); 
    } catch (error) {
      console.error(error);
      toast.error('Failed to save recipe. Try again.');
    }
  };

  const clearForm = () => {
    setStep(1);
    setLeftoverIngredients([]);
    setNewLeftoverInput('');
    setRecipeTitle(''); 
    setImageFile(null);
    setImagePreview('');
    setDescription('');
    setSelectedTags([]);
    setIngredients([{ item: '', amount: '', isLeftover: false }]);
    setSteps(['']);
  };

  const cancelEditing = () => {
    onCancelEdit();
    clearForm();
  };

  const returnToLeftoverStep = () => setStep(1); 

  useEffect(() => {
    if (editRecipe) {
      setStep(2);
      setLeftoverIngredients(editRecipe.leftoverIngredients || []);
      setRecipeTitle(editRecipe.title); 
      setImagePreview(editRecipe.image);
      setDescription(editRecipe.description);
      setSelectedTags(editRecipe.tags || []);
      setIngredients(editRecipe.ingredients || [{ item: '', amount: '', isLeftover: false }]);
      setSteps(editRecipe.steps);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [editRecipe]);

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={{ ...selectedRecipe, category: 'my-recipes' }}
        recipeLiked={false} 
        handleRecipeLike={() => {}} 
        returnToPrevious={() => setSelectedRecipe(null)} 
        hideInteractions={true}
        handleEditRecipe={(recipe) => setSelectedRecipe(null)}
        backButtonLabel="Back" 
      />
    );
  }

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-800 mb-4">What ingredients are you trying to save?</CardTitle>
            <p className="text-gray-600 leading-relaxed">
              Select leftover ingredients from your fridge. You'll need at least one to create a recipe.
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Common Leftovers */}
            <div className="space-y-3">
              <Label>Common Ingredients</Label>
              <div className="flex flex-wrap gap-2">
                {commonLeftovers.map((ingredient) => (
                  <Badge
                    key={ingredient}
                    variant={leftoverIngredients.includes(ingredient) ? 'default' : 'outline'}
                    className="cursor-pointer py-2 px-4 text-sm"
                    onClick={() => selectLeftover(ingredient)} 
                  >
                    {leftoverIngredients.includes(ingredient) && <Check className="w-3 h-3 mr-1" />}
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom Leftover Input */}
            <div className="space-y-3">
              <Label htmlFor="newLeftoverInput">Add Custom Ingredient</Label> {/* Updated id */}
              <div className="flex gap-2">
                <Input
                  id="newLeftoverInput" 
                  value={newLeftoverInput} 
                  onChange={(e) => setNewLeftoverInput(e.target.value)} 
                  placeholder="Enter ingredient name..."
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addNewLeftover(); } }} 
                />
                <Button type="button" onClick={addNewLeftover} variant="outline"> {/* Updated from addCustomLeftover */}
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Selected Leftovers */}
            {leftoverIngredients.length > 0 && (
              <div className="space-y-3">
                <Label>Selected Leftovers ({leftoverIngredients.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {leftoverIngredients.map((ingredient) => (
                    <Badge key={ingredient} className="bg-emerald-600 py-2 px-4 text-sm">
                      {ingredient}
                      <X className="w-3 h-3 ml-2 cursor-pointer" onClick={() => selectLeftover(ingredient)} /> {/* Updated from toggleLeftover */}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={goToRecipeEditor} className="w-full" size="lg" disabled={leftoverIngredients.length === 0}> {/* Updated from proceedToRecipeEditor */}
              Continue to Recipe Editor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Recipe Editor Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" onClick={returnToLeftoverStep}> {/* Updated from backToLeftoverSelection */}
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <CardTitle className="text-emerald-800 mb-4">{editRecipe ? 'Edit Recipe' : 'Create New Recipe'}</CardTitle>
          <p className="text-gray-600 leading-relaxed">{editRecipe ? 'Update your recipe details' : 'Share your delicious recipe with the community'}</p>
          
          <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm text-emerald-800 mb-2">🥕 Using these leftovers:</p>
            <div className="flex flex-wrap gap-2">
              {leftoverIngredients.map((ingredient) => (
                <Badge key={ingredient} className="bg-emerald-600">{ingredient}</Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveRecipe} className="space-y-8"> {/* Updated from handleSubmit */}
            {/* Title */}
            <div className="space-y-3">
              <Label htmlFor="recipeTitle">Recipe Title *</Label> {/* Updated id */}
              <Input
                id="recipeTitle" 
                value={recipeTitle} 
                onChange={(e) => setRecipeTitle(e.target.value)} 
                placeholder="e.g., Morning Smoothie Bowl"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <Label htmlFor="image">Image Upload *</Label>
              <div className="flex gap-3">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editRecipe && !imagePreview}
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              {imagePreview && (
                <div className="mt-4 relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => { setImageFile(null); setImagePreview(''); }}>
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your recipe..."
                rows={4}
                required
              />
            </div>

            {/* Ingredients */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label>Ingredients *</Label>
                  <p className="text-sm text-gray-500 mt-1">Add amounts for leftovers and additional ingredients. Tags auto-generated.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addNewIngredient}> {/* Updated from addIngredient */}
                  <Plus className="w-4 h-4 mr-2" /> Add More
                </Button>
              </div>
              <div className="space-y-4">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <Input placeholder="Ingredient name" value={ingredient.item} onChange={(e) => updateIngredient(index, 'item', e.target.value)} className="flex-1" disabled={ingredient.isLeftover} />
                    <Input placeholder="Amount" value={ingredient.amount} onChange={(e) => updateIngredient(index, 'amount', e.target.value)} className="w-32" />
                    {ingredient.isLeftover && <Badge className="bg-emerald-600 whitespace-nowrap">Leftover</Badge>}
                    {!ingredient.isLeftover && <Button type="button" variant="ghost" size="icon" onClick={() => deleteIngredient(index)}><Trash2 className="w-4 h-4 text-red-500" /></Button>} {/* Updated from removeIngredient */}
                  </div>
                ))}
              </div>
            </div>

            {/* Cooking Steps */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <Label>Cooking Steps *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addStep}>
                  <Plus className="w-4 h-4 mr-2" /> Add Step
                </Button>
              </div>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm mt-2">{index + 1}</div>
                    <Textarea placeholder={`Step ${index + 1}`} value={step} onChange={(e) => updateStep(index, e.target.value)} className="flex-1" rows={2} />
                    {steps.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => deleteStep(index)} className="mt-2"><Trash2 className="w-4 h-4 text-red-500" /></Button>} {/* Updated from removeStep */}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              {editRecipe && <Button type="button" variant="outline" className="flex-1" size="lg" onClick={cancelEditing}>Cancel</Button>} {/* Updated from handleCancelEdit */}
              <Button type="submit" className="flex-1" size="lg" disabled={saving}>
                {saving ? 'Saving...' : editRecipe ? 'Update Recipe' : 'Save as Draft'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
