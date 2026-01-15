import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Heart, MessageCircle, Edit } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'sonner';

export function RecipeDetail({
  recipe,
  currentUser,
  recipeLiked, 
  handleRecipeLike, 
  returnToPrevious,
  hideInteractions,
  handleEditRecipe, 
  backButtonLabel 
}) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (recipe?.id) {
      const q = query(collection(db, 'comments'), where('recipeId', '==', recipe.id));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(fetchedComments);
      });
      return () => unsubscribe();
    }
  }, [recipe?.id]);

  const addNewComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      await addDoc(collection(db, 'comments'), {
        text: newComment.trim(),
        authorId: currentUser.uid,
        authorName: currentUser.username || currentUser.email,
        recipeId: recipe.id,
        createdAt: new Date()
      });
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    handleRecipeLike(); 
  };

  const containsLeftovers = recipe.leftoverIngredients && recipe.leftoverIngredients.length > 0;
  const leftoverCount = recipe.leftoverIngredients?.length || 0;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <div className="relative">
          <div className="relative aspect-[16/9] overflow-hidden">
            <ImageWithFallback
              src={recipe.image || recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={returnToPrevious} 
              className="absolute top-4 left-4 bg-white/80 hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backButtonLabel || 'Back'} {/* Updated from backButtonText */}
            </Button>

            {handleEditRecipe && currentUser && recipe.authorId === currentUser.uid && ( 
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditRecipe(recipe)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-emerald-800 mb-6">{recipe.title}</h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">{recipe.description}</p>

          {containsLeftovers && (
            <div className="mb-6 p-4 bg-emerald-50 rounded-lg">
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                Uses {leftoverCount} leftover ingredient{leftoverCount !== 1 ? 's' : ''}
              </h3>
              <div className="flex flex-wrap gap-2">
                {recipe.leftoverIngredients.map((ingredient, index) => (
                  <Badge key={index} className="bg-emerald-600">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  <span className="font-medium">{ingredient.amount}</span>
                  <span>{ingredient.item}</span>
                  {ingredient.isLeftover && (
                    <Badge className="bg-emerald-600 text-xs">Leftover</Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">Instructions</h3>
            <ol className="space-y-4">
              {recipe.steps?.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {!hideInteractions && (
            <div className="border-t pt-6">
              <div className="flex items-center gap-6 mb-6">
                <button
                  onClick={handleLikeClick}
                  className="flex items-center gap-2 hover:text-red-500 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${recipeLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} /> {/* Updated from isLiked */}
                  <span className="text-sm font-medium">{recipe.likes?.length || 0} likes</span>
                </button>
                
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{comments.length} comments</span>
                </button>
              </div>

              {showComments && (
                <div className="space-y-4">
                  {currentUser && (
                    <form onSubmit={addNewComment} className="flex gap-3">
                      <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!newComment.trim()}>
                        Post
                      </Button>
                    </form>
                  )}

                  <div className="space-y-3">
                    {comments.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm">{comment.authorName}</span>
                            <span className="text-xs text-gray-500">
                              {comment.createdAt?.toDate?.()?.toLocaleString() || 'Just now'}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
