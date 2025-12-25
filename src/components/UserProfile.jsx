import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User, Heart, ChefHat } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function UserProfile({ userRecipes, likedRecipes, onViewRecipe }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg leading-relaxed">
              Please log in to view your profile
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* User Info Card */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <User className="w-12 h-12 text-emerald-600" />
          </div>
          <CardTitle className="text-emerald-800 mb-3">{currentUser.username}</CardTitle>
          <p className="text-gray-600 leading-relaxed">{currentUser.email}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-emerald-50 p-6 rounded-lg text-center">
              <ChefHat className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
              <div className="text-gray-700">{userRecipes.length}</div>
              <div className="text-gray-600 text-sm">Recipes Created</div>
            </div>
            <div className="bg-pink-50 p-6 rounded-lg text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-pink-600" />
              <div className="text-gray-700">{likedRecipes.length}</div>
              <div className="text-gray-600 text-sm">Liked Recipes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}