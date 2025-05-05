// gameDataService.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./auth";

const STORAGE_KEY = "gameData";

// Helper function to validate game data
const validateGameData = (data) => {
  if (typeof data !== "object" || data === null) {
    throw new Error("Game data must be a valid object.");
  }

  const { coins, highScores, themes, lastUpdated } = data;

  // Validate coins
  if (!Number.isInteger(coins) || coins < 0) {
    throw new Error("Coins must be a positive integer.");
  }

  // Validate highScores
  if (typeof highScores !== "object" || highScores === null) {
    throw new Error("HighScores must be a valid object.");
  }
  Object.entries(highScores).forEach(([theme, difficulties]) => {
    if (typeof difficulties !== "object" || difficulties === null) {
      throw new Error(
        `HighScores for theme "${theme}" must be a valid object.`
      );
    }
    ["Easy", "Medium", "Hard"].forEach((difficulty) => {
      if (
        difficulties[difficulty] !== null &&
        (!Number.isInteger(difficulties[difficulty]) ||
          difficulties[difficulty] < 0)
      ) {
        throw new Error(
          `HighScores for theme "${theme}" and difficulty "${difficulty}" must be a positive integer or null.`
        );
      }
    });
  });

  // Validate themes
  if (typeof themes !== "object" || themes === null) {
    throw new Error("Themes must be a valid object.");
  }
  Object.entries(themes).forEach(([themeKey, themeData]) => {
    if (typeof themeData !== "object" || themeData === null) {
      throw new Error(`Theme data for "${themeKey}" must be a valid object.`);
    }
    const { locked, title } = themeData;

    if (typeof title !== "string" || title.trim() === "") {
      throw new Error(`Theme "${themeKey}" must have a valid title.`);
    }
    if (locked !== true && locked !== false) {
      throw new Error(
        `Theme "${themeKey}" must have a valid "locked" property (true or false).`
      );
    }
  });

  // Validate lastUpdated
  if (typeof lastUpdated !== "string" || isNaN(Date.parse(lastUpdated))) {
    throw new Error("LastUpdated must be a valid ISO date string.");
  }

  return true;
};
// Save game data to AsyncStorage
export async function saveToLocal(data) {
  try {
    validateGameData(data);
    const timestamp = new Date().toISOString();
    const dataWithTimestamp = { ...data, lastUpdated: timestamp };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp));
    console.log("Game data saved locally.");
  } catch (error) {
    console.error("Error saving to local storage:", error.message);
  }
}

// Load game data from AsyncStorage
export async function loadFromLocal() {
  try {
    const localData = await AsyncStorage.getItem(STORAGE_KEY);
    if (localData) {
      return JSON.parse(localData);
    }
    console.log("No local data found.");
    return null;
  } catch (error) {
    console.error("Error loading from local storage:", error.message);
    return null;
  }
}

// Save game data to Firestore
export async function saveToCloud(uid, data) {
  try {
    validateGameData(data);
    const timestamp = new Date().toISOString();
    const dataWithTimestamp = { ...data, lastUpdated: timestamp };
    await setDoc(doc(db, "users", uid), dataWithTimestamp, { merge: true });
    console.log("Game data saved to Firestore.");
  } catch (error) {
    console.error("Error saving to Firestore:", error.message);
  }
}

// Load game data from Firestore
export async function loadFromCloud(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    console.log("No cloud data found.");
    return null;
  } catch (error) {
    console.error("Error loading from Firestore:", error.message);
    return null;
  }
}

// Sync data from Firestore to AsyncStorage
export async function syncFromCloud(uid) {
  try {
    const cloudData = await loadFromCloud(uid);
    const localData = await loadFromLocal();

    if (cloudData) {
      if (!localData || cloudData.lastUpdated > localData.lastUpdated) {
        console.log("Cloud data is newer. Syncing with local.");
        await saveToLocal(cloudData);
        return cloudData;
      } else {
        console.log("Local data is newer. Syncing with cloud.");
        await saveToCloud(uid, localData);
        return localData;
      }
    }

    console.log("No cloud data to sync.");
    return localData;
  } catch (error) {
    console.error("Error syncing from cloud:", error.message);
    return null;
  }
}

// Sync data from AsyncStorage to Firestore
export async function syncToCloud(uid) {
  try {
    const localData = await loadFromLocal();
    if (localData) {
      await saveToCloud(uid, localData);
    } else {
      console.log("No local data to sync.");
    }
  } catch (error) {
    console.error("Error syncing to cloud:", error.message);
  }
}

// Unified function to save game data (local + cloud)
export async function saveGameData(uid, data) {
  try {
    await saveToLocal(data);
    await saveToCloud(uid, data);
  } catch (error) {
    console.error("Error saving game data:", error.message);
  }
}

// Unified function to load game data (local + cloud sync)
export async function loadGameData(uid) {
  try {
    const syncedData = await syncFromCloud(uid);
    return syncedData || (await loadFromLocal());
  } catch (error) {
    console.error("Error loading game data:", error.message);
    return null;
  }
}
