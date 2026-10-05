import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, firebaseConfigured, serverTimestamp } from "../firebase"; 
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();
const firebaseSetupMessage = "Firebase is not configured. Add the REACT_APP_FIREBASE_* values from your Firebase project to a .env file.";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      setCurrentUser({
        uid: user.uid,
        email: user.email,
        ...userDoc.data(),
      });

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, username) => {
    if (!firebaseConfigured) throw new Error(firebaseSetupMessage);
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", cred.user.uid), {
      username,
      email,
      createdAt: serverTimestamp(),
    });

    return cred.user;
  };

  const login = async (email, password) => {
    if (!firebaseConfigured) throw new Error(firebaseSetupMessage);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const logout = async () => {
    if (auth) await signOut(auth);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
