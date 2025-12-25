import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { useEffect, useState } from 'react';

export function usePublishedRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'recipes'),
      where('published', '==', true) // Fetch only published recipes
    );

    const unsub = onSnapshot(q, (snap) => {
      setRecipes(
        snap.docs.map(d => ({ id: d.id, ...d.data() }))
      );
    });

    return () => unsub();
  }, []);

  return recipes;
}