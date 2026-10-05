import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db, firebaseConfigured } from './firebase.js';
import { useAuth } from './contexts/AuthContext';

export function useMyRecipes() {
  const { currentUser } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured || !currentUser) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'recipes'),
      where('authorId', '==', currentUser.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(data);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  const deleteRecipe = async (recipeId) => {
    if (!currentUser || !db) return;
    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      setRecipes(prev => prev.filter(r => r.id !== recipeId));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return { recipes, deleteRecipe, loading };
}
