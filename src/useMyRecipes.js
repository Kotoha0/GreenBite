import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

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

    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, where('uid', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addRecipe = async (recipe) => {
    if (!user) throw new Error('User not authenticated');
    const recipesRef = collection(db, 'recipes');
    await addDoc(recipesRef, { ...recipe, uid: user.uid });
  };

  const updateRecipe = async (recipe) => {
    if (!user) throw new Error('User not authenticated');
    const recipeRef = doc(db, 'recipes', recipe.id);
    await updateDoc(recipeRef, { ...recipe });
  };

  return { recipes, loading, addRecipe, updateRecipe };
}
