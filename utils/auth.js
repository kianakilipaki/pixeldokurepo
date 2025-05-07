import { initializeApp } from "firebase/app";
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
import { useEffect, useState } from "react";

// Replace with your own Firebase config from the console
const firebaseConfig = {
  apiKey: "AIzaSyCkn34-E5PlJ8cboQvBlt8c-8T2LhIrO5A",
  authDomain: "pixeldoku-cloud-458622.firebaseapp.com",
  projectId: "pixeldoku-cloud-458622",
  storageBucket: "pixeldoku-cloud-458622.firebasestorage.app",
  appId: "1:692361959163:android:1ea5e7f131ce4c2006825e",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Use initializeAuth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

// Custom hook for Google Authentication
export function useGoogleAuth() {
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

  // Add signOut method
  const signOut = async (navigation) => {
    try {
      auth.signOut();
      setUser(null);
      navigation.navigate("Login");
      console.log("PixelDokuLogs: [useGoogleAuth] User signed out.");
    } catch (err) {
      console.error(
        "PixelDokuLogs: [useGoogleAuth] Sign-out error:",
        err.message
      );
    }
  };

  return {
    user,
    isLoading,
    promptAsync,
    request,
    signOut,
  };
}

export { app, auth, db };
