import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from './firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';

export function useMyRecipes() {
  const [user] = useAuthState(auth);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'recipes'),
      where('authorId', '==', user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const deleteRecipe = async (recipeId) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      setRecipes(prev => prev.filter(r => r.id !== recipeId));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return { recipes, deleteRecipe, loading };
}
