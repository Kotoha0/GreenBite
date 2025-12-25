import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Heart, User, LogOut } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { Home, CreateRecipe, Post, Like, Login, UserProfile } from '.';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import React from "react";

function AppContent() {
  const [myRecipes, setMyRecipes] = useState(() => {
    const stored = localStorage.getItem('recipes');
    return stored ? JSON.parse(stored) : [];
  });
  const [activeTab, setActiveTab] = useState('home');
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [likedItems, setLikedItems] = useState(() => {
    const stored = localStorage.getItem('likedItems');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  const { currentUser, logout } = useAuth();

  const saveRecipes = (recipes) => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
    setMyRecipes(recipes);
  };

  const saveLikedItems = (items) => {
    localStorage.setItem('likedItems', JSON.stringify([...items]));
    setLikedItems(items);
  };

  const handleAddRecipe = (recipe) => {
    const newRecipe = {
      ...recipe,
      userId: currentUser?.id,
      username: currentUser?.username,
    };
    saveRecipes([newRecipe, ...myRecipes]);
  };

  const handleUpdateRecipe = (updatedRecipe) => {
    saveRecipes(myRecipes.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
  };

  const handlePublish = (id) => {
    saveRecipes(myRecipes.map(r => 
      r.id === id ? { ...r, published: true } : r
    ));
  };

  const handleUnpublish = (id) => {
    saveRecipes(myRecipes.map(r => 
      r.id === id ? { ...r, published: false } : r
    ));
  };

  const handleEditFromPost = (recipe) => {
    setEditingRecipe(recipe);
    setActiveTab('recipes');
  };

  const toggleLike = (id) => {
    const newSet = new Set(likedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    saveLikedItems(newSet);
  };

  const handleLoginSuccess = () => {
    setActiveTab('home');
  };

  const handleLogout = () => {
    logout();
    setActiveTab('home');
  };

  const userRecipes = currentUser 
    ? myRecipes.filter(r => r.userId === currentUser.id)
    : [];
  const publishedUserRecipes = userRecipes.filter(r => r.published);

  const allPublishedRecipes = myRecipes.filter(r => r.published);

  const likedRecipes = allPublishedRecipes.filter(r => likedItems.has(r.id));

  useEffect(() => {
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Heart className="w-8 h-8 text-emerald-600" />
            <h1 className="text-emerald-800">Recipe Hub</h1>
            <Heart className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg">
            Discover, share, and enjoy delicious recipes from our community
          </p>
          
          {currentUser && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
                <User className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700">Welcome, {currentUser.username}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="rounded-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-16">
            <TabsList className="grid w-full max-w-3xl grid-cols-5 h-12">
              <TabsTrigger value="home">
                Home
              </TabsTrigger>
              <TabsTrigger value="recipes">
                Recipes
              </TabsTrigger>
              <TabsTrigger value="post">
                Post
              </TabsTrigger>
              <TabsTrigger value="like">
                Like
              </TabsTrigger>
              <TabsTrigger value="login">
                Login
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="home">
            <Home 
              category="home" 
              userRecipes={allPublishedRecipes}
              likedItems={likedItems}
              onToggleLike={toggleLike}
              currentUser={currentUser}
            />
          </TabsContent>
          <TabsContent value="recipes">
            {currentUser ? (
              <CreateRecipe 
                onAddRecipe={handleAddRecipe}
                onUpdateRecipe={handleUpdateRecipe}
                editingRecipe={editingRecipe}
                onCancelEdit={() => setEditingRecipe(null)}
                myRecipes={userRecipes}
              />
            ) : (
              <div className="max-w-2xl mx-auto text-center py-12">
                <Card>
                  <CardContent className="py-12">
                    <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      Please log in to create recipes
                    </p>
                    <Button 
                      onClick={() => setActiveTab('login')}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Go to Login
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          <TabsContent value="post">
            {currentUser ? (
              <Post 
                recipes={userRecipes}
                onPublish={handlePublish}
                onUnpublish={handleUnpublish}
                onEdit={handleEditFromPost}
              />
            ) : (
              <div className="max-w-2xl mx-auto text-center py-12">
                <Card>
                  <CardContent className="py-12">
                    <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      Please log in to manage your posts
                    </p>
                    <Button 
                      onClick={() => setActiveTab('login')}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Go to Login
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          <TabsContent value="like">
            {currentUser ? (
              <Like 
                category="like"
                userRecipes={allPublishedRecipes}
                likedItems={likedItems}
                onToggleLike={toggleLike}
                currentUser={currentUser}
              />
            ) : (
              <div className="max-w-2xl mx-auto text-center py-12">
                <Card>
                  <CardContent className="py-12">
                    <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      Please log in to view your liked recipes
                    </p>
                    <Button 
                      onClick={() => setActiveTab('login')}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Go to Login
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          <TabsContent value="login">
            {currentUser ? (
              <UserProfile 
                userRecipes={userRecipes}
                likedRecipes={likedRecipes}
              />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}