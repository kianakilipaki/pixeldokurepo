import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  deleteUser,
  signOut,
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

const app = initializeApp(firebaseConfig);
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
  const [loading, setLoading] = useState(true);

  // Google Sign-In setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "692361959163-lv80ktosr455kecjrepgh3pektun4q0t.apps.googleusercontent.com",
    androidClientId:
      "692361959163-sgf0uesiaaqjgmss0oovr104j6ulk60b.apps.googleusercontent.com",
    iosClientId: "692361959163-kkrurhne0igqfghph1idlog9bq0f0fhv.apps.googleusercontent.com"
  });

  // Handle login response
  useEffect(() => {
    if (response?.type === "success" && response.authentication?.idToken) {
      const { idToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential).catch(console.error);
    }
  }, [response]);

  // Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Exposed functions
  const login = () => promptAsync();
  const logout = () => signOut(auth);
  const removeUser = () => deleteUser(auth.currentUser);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useGoogleAuth = () => useContext(AuthContext);
