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
import * as AppleAuthentication from "expo-apple-authentication";
import { AppleAuthProvider } from "firebase/auth";
import * as Crypto from "expo-crypto";

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

const generateNonce = async (length = 32) => {
  const charset =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._";
  let result = "";
  const randomValues = Crypto.getRandomBytes(length);
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  return result;
};

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
    iosClientId:
      "692361959163-kkrurhne0igqfghph1idlog9bq0f0fhv.apps.googleusercontent.com",
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

  // Apple login
  const appleLogin = async () => {
    try {
      const rawNonce = await generateNonce();
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { identityToken } = appleCredential;

      if (!identityToken) throw new Error("No identity token");

      const firebaseCredential = AppleAuthProvider.credential(
        identityToken,
        rawNonce
      );

      await signInWithCredential(auth, firebaseCredential);
    } catch (error) {
      console.error("Apple Sign-In error", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, removeUser, appleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useGoogleAuth = () => useContext(AuthContext);
