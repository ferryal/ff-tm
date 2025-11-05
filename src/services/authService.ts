import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/config/firebase";
import { logEvent } from "@/services/analyticsService";

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocument(result.user);
    logEvent("sign_up", { method: "email" });
    return result.user;
  } catch (error) {
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    logEvent("login", { method: "email" });
    return result.user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserDocument(result.user);
    logEvent("login", { method: "google" });
    return result.user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    logEvent("logout");
  } catch (error) {
    throw error;
  }
};

const createUserDocument = async (user: User) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  try {
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error creating user document:", error);
  }
};
