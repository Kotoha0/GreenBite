import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
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

    const q = query(
      collection(db, 'recipes'),
      where('uid', '==', user.uid) // FIXED: Changed from 'userId' to 'uid'
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRecipes(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  return { recipes, loading };
}
