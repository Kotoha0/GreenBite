import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './contexts/AuthContext'; // Correct path for AuthContext
import { db } from './firebase'; // Correct path for firebase
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import {
  Heart,
  LogOut,
  User,
} from 'lucide-react';
import Home from './components/Home'; // Correct path for Home
import { CreateRecipe } from './components/CreateRecipe';
import { Post } from './components/Post';
import { Like } from './components/Like';
import { UserProfile } from './components/UserProfile';
import { Login } from './components/Login';
import { useMyRecipes } from './useMyRecipes';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  
  const { currentUser, logout } = useAuth();
  const { recipes: myRecipes, deleteRecipe } = useMyRecipes();

  // Fetch all recipes from Firestore
  useEffect(() => {
    const recipesRef = collection(db, 'recipes');
    const unsubscribe = onSnapshot(recipesRef, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched recipes from Firestore:", fetched);
      setRecipes(fetched);
    });
    return () => unsubscribe();
  }, []);

  const handleEditFromPost = (recipe) => {
    setEditingRecipe(recipe);
    setActiveTab('recipes');
  };

  const handleLogout = () => {
    logout();
    setActiveTab('home');
  };

  // Filter recipes by current user
  const userRecipes = currentUser 
    ? recipes.filter(r => r.authorId === currentUser.uid)
    : [];
  
  // Recipes liked by the current user
  const likedRecipes = recipes.filter(
    r => r.published && r.likes?.includes(currentUser.uid)
  );

  const handleLoginSuccess = () => setActiveTab('home');

  const handlePublish = async (recipeId) => {
    try {
      const recipeRef = doc(db, "recipes", recipeId);
      await updateDoc(recipeRef, { published: true });
      console.log("Recipe published:", recipeId);
    } catch (err) {
      console.error("Error publishing recipe:", err);
    }
  };

  const handleUnpublish = async (recipeId) => {
    try {
      const recipeRef = doc(db, "recipes", recipeId);
      await updateDoc(recipeRef, { published: false });
      console.log("Recipe unpublished:", recipeId);
    } catch (err) {
      console.error("Error unpublishing recipe:", err);
    }
  };

  const handleEdit = (recipe) => {
    console.log('Editing recipe:', recipe);
    // Add your edit logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Heart className="w-8 h-8 text-emerald-600" />
            <h1 className="text-emerald-800">Recipe Hub</h1>
            <Heart className="w-8 h-8 text-emerald-600" />
          </div>
          {currentUser && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
                <User className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700">Welcome, {currentUser.username}</span>
              </div>
              <Button onClick={handleLogout} variant="outline" className="rounded-full">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          )}
        </header>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-16">
            <TabsList className="grid w-full max-w-3xl grid-cols-5 h-12">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="recipes">Recipes</TabsTrigger>
              <TabsTrigger value="post">Post</TabsTrigger>
              <TabsTrigger value="like">Like</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
          </div>

          {/* Home Tab */}
          <TabsContent value="home">
            <Home 
              category="home"
              userRecipes={recipes} // Pass all recipes for debugging
              currentUser={currentUser}
            />
          </TabsContent>

          {/* Recipes Tab */}
          <TabsContent value="recipes">
            {currentUser ? (
              <CreateRecipe
                editingRecipe={editingRecipe}
                onCancelEdit={() => setEditingRecipe(null)}
                userRecipes={userRecipes}
              />
            ) : (
              <Card className="max-w-2xl mx-auto text-center py-12">
                <CardContent className="py-12">
                  <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 text-lg mb-6">Please log in to create recipes</p>
                  <Button onClick={() => setActiveTab('login')} className="bg-emerald-600 hover:bg-emerald-700">Go to Login</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Post Tab */}
          <TabsContent value="post">
            {currentUser ? (
              <Post
                recipes={myRecipes}          // Pass the recipes
                onEdit={handleEditFromPost}  // Pass the edit handler
                onPublish={handlePublish}    // Pass the publish handler
                onUnpublish={handleUnpublish} // Pass the unpublish handler
                onDelete={deleteRecipe}      // Pass the delete handler
              />
            ) : (
              <Card className="max-w-2xl mx-auto text-center py-12">
                <CardContent className="py-12">
                  <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 text-lg mb-6">Please log in to manage your posts</p>
                  <Button onClick={() => setActiveTab('login')} className="bg-emerald-600 hover:bg-emerald-700">Go to Login</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Like Tab */}
          <TabsContent value="like">
            {currentUser ? (
              <Like userRecipes={likedRecipes} currentUser={currentUser} />
            ) : (
              <Card className="max-w-2xl mx-auto text-center py-12">
                <CardContent className="py-12">
                  <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 text-lg mb-6">Please log in to view your liked recipes</p>
                  <Button onClick={() => setActiveTab('login')} className="bg-emerald-600 hover:bg-emerald-700">Go to Login</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Login Tab */}
          <TabsContent value="login">
            {currentUser ? (
              <UserProfile userRecipes={userRecipes} likedRecipes={likedRecipes} />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
