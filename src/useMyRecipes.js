import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from './firebase';
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

    // Match the field you actually use in Firestore
    const q = query(
      collection(db, 'recipes'),
      where('authorId', '==', user.uid) // Ensure this matches your Firestore field
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("useMyRecipes fetched:", data);
      setRecipes(data); // No need to filter again
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
