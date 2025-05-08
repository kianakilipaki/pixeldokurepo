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
import { useEffect, useRef, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

// Replace with your own Firebase config from the console
const firebaseConfig = {
  apiKey: "AIzaSyCkn34-E5PlJ8cboQvBlt8c-8T2LhIrO5A",
  authDomain: "pixeldoku-cloud-458622.firebaseapp.com",
  projectId: "pixeldoku-cloud-458622",
  storageBucket: "pixeldoku-cloud-458622.firebasestorage.app",
  appId: "1:692361959163:android:1ea5e7f131ce4c2006825e",
};

// Initialize Firebase app
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Safe Auth initialization
let auth;
try {
  auth = getAuth(app);
} catch (e) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Firestore init
const db = getFirestore(app);

// Custom hook for Google Authentication
export function useGoogleAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const hasAttemptedLogin = useRef(false);
  const justReconnected = useRef(false);

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
    const unsubscribeNetInfo = NetInfo.addEventListener(async (state) => {
      if (state.isConnected && !user && !hasAttemptedLogin.current) {
        justReconnected.current = true;
        hasAttemptedLogin.current = true;

        // Attempt silent login again
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            console.log("[PixelDokuLogs] Auth resumed on reconnect.");
            setUser(firebaseUser);
          }
          setLoading(false);
        });

        return () => unsub();
      }
    });

    return () => unsubscribeNetInfo();
  }, [user]);

  useEffect(() => {
    const checkInitialConnection = async () => {
      const netInfo = await NetInfo.fetch();

      if (!netInfo.isConnected) {
        console.log("[PixelDokuLogs] Offline. Starting in guest mode.");
        setLoading(false);
        return;
      }

      const unsub = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });

      return unsub;
    };

    checkInitialConnection();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch(console.error);
    }
  }, [response]);

  const signOut = async (navigation) => {
    try {
      await auth.signOut();
      setUser(null);
      navigation.navigate("Login");
      console.log("[PixelDokuLogs] Signed out.");
    } catch (err) {
      console.error("[PixelDokuLogs] Sign-out error:", err.message);
    }
  };

  return {
    user,
    isLoading,
    promptAsync,
    request,
    signOut,
    justReconnected: justReconnected.current,
  };
}

export { app, auth, db };
