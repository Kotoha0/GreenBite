import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export const signUp = async (email, password) => {
  try {
    console.log("Attempting to sign up user with email:", email, "and password:", password);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up successfully:", userCredential.user);
    return userCredential.user; // Return the user object
  } catch (error) {
    console.error("Error during signup:", error.message);
    throw error; // Ensure errors are propagated
  }
};