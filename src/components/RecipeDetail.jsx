import { useState } from 'react';
import { ImageWithFallback } from './ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Heart, MessageCircle, ArrowLeft, Send, Edit, Info } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

export function RecipeDetail({ recipe, isLiked, onToggleLike, onBack, hideInteractions, onEdit, backButtonText }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(recipe.comments || []);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        user: 'You',
        text: newComment,
        time: 'Just now'
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  // Check if recipe has leftover ingredients
  const hasLeftovers = recipe.leftoverIngredients && recipe.leftoverIngredients.length > 0;
  const leftoverCount = hasLeftovers ? recipe.leftoverIngredients.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          {backButtonText || 'Back to home'}
        </Button>

        {/* Recipe Title */}
        <h1 className="text-emerald-800 mb-4">{recipe.title}</h1>

        {/* Recipe Image */}
        <div className="relative aspect-video overflow-hidden rounded-lg mb-6">
          <ImageWithFallback
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Leftover Info Card - Under the picture */}
        {hasLeftovers && (
          <Card className="bg-orange-50 border-orange-200 shadow-sm mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🥕</span>
                </div>
                <div>
                  <p className="text-sm text-orange-900 mb-2">
                    <span className="font-semibold">{leftoverCount} leftover ingredient{leftoverCount > 1 ? 's' : ''} used</span>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {recipe.leftoverIngredients.map((ingredient, idx) => (
                      <span key={idx} className="text-sm text-orange-800">
                        {ingredient}{idx < recipe.leftoverIngredients.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description */}
        <p className="text-gray-700 mb-6 text-lg">
          {recipe.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {recipe.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Likes & Comments */}
        {!hideInteractions && (
          <div className="flex items-center gap-3 mb-8 pb-6 border-b">
            <Button
              variant={isLiked ? "default" : "outline"}
              className="flex items-center gap-2"
              onClick={() => onToggleLike(recipe.id)}
            >
              <Heart 
                className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`}
              />
              <span>{recipe.likes + (isLiked ? 1 : 0)} Likes</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowComments(true)}>
              <MessageCircle className="w-5 h-5" />
              <span>{comments.length} Comments</span>
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ingredients Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-emerald-700">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">{ingredient.item}</span>
                      {ingredient.isLeftover && (
                        <Badge className="bg-orange-500 text-xs">
                          leftover
                        </Badge>
                      )}
                    </div>
                    <span className="text-gray-600">{ingredient.amount}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Cooking Steps Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-emerald-700">How to Cook</h2>
              <ol className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Edit Button */}
        {onEdit && (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => onEdit(recipe)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Recipe
          </Button>
        )}

        {/* Comments Modal */}
        <Dialog open={showComments} onOpenChange={setShowComments}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Comments ({comments.length})</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{comment.user}</p>
                          <p className="text-sm text-gray-500">{comment.time}</p>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </ScrollArea>
            <div className="mt-4 pt-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 resize-none"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
              </div>
              <Button
                variant="default"
                className="mt-2 w-full"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}