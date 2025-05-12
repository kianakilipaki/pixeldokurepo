import { createContext, useContext, useEffect, useState } from "react";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";

// Replace with your own Firebase config from the console
const firebaseConfig = {
  apiKey: "AIzaSyCkn34-E5PlJ8cboQvBlt8c-8T2LhIrO5A",
  authDomain: "pixeldoku-cloud-458622.firebaseapp.com",
  projectId: "pixeldoku-cloud-458622",
  storageBucket: "pixeldoku-cloud-458622.firebasestorage.app",
  messagingSenderId: "692361959163",
  appId: "1:692361959163:android:1ea5e7f131ce4c2006825e",
};

// Initialize Firebase app
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth initialization
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore init
const db = getFirestore(app);

export { app, auth, db };

// Create a context for authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "692361959163-lv80ktosr455kecjrepgh3pektun4q0t.apps.googleusercontent.com",
    androidClientId:
      "692361959163-sgf0uesiaaqjgmss0oovr104j6ulk60b.apps.googleusercontent.com",
    webClientId:
      "692361959163-hrko3jlf9pu4el34rc35chjnvr1npvhi.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  // Check if the user is already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsub;
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch(console.error);
    }
  }, [response]);

  const signIn = async () => {
    if (promptAsync) {
      console.log("[Pixeldokulogs] Prompting Google sign-in...");
      await promptAsync();
    } else {
      console.warn("Google sign-in not ready yet.");
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      console.log("[Pixeldokulogs] Signed out.");
    } catch (err) {
      console.error("[Pixeldokulogs] Sign-out error:", err.message);
    }
  };

  const deleteAccountData = async () => {
    try {
      await auth.currentUser.delete();
      setUser(null);
      console.log("[Pixeldokulogs] Account deleted.");
    } catch (err) {
      console.error("[Pixeldokulogs] Account deletion error:", err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ request, user, signIn, signOut, deleteAccountData, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useGoogleAuth = () => useContext(AuthContext);
