// gameDataService.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./auth";
import { defaultThemes } from "./assetsMap";

const STORAGE_KEY = "gameData";

// Helper function to validate game data
const validateGameData = (data) => {
  if (typeof data !== "object" || data === null) {
    throw new Error("Game data must be a valid object.");
  }

  const { coins, highscores, themes, tutorialSeen, lastUpdated } = data;

  if (!Number.isInteger(coins) || coins < 0) {
    throw new Error("Coins must be a positive integer.");
  }

  if (typeof highscores !== "object" || highscores === null) {
    console.error("[validateGameData] Invalid highscores:", highscores);
    throw new Error("HighScores must be a valid object.");
  }

  Object.entries(highscores).forEach(([theme, difficulties]) => {
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
          `HighScores for "${theme}" - "${difficulty}" must be a positive integer or null.`
        );
      }
    });
  });

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
        `Theme "${themeKey}" must have a valid "locked" boolean.`
      );
    }
  });

  if (typeof tutorialSeen !== "boolean") {
    console.error("[validateGameData] Invalid tutorialSeen:", tutorialSeen);
    throw new Error("TutorialSeen must be a boolean.");
  }

  if (typeof lastUpdated !== "string" || isNaN(Date.parse(lastUpdated))) {
    throw new Error("LastUpdated must be a valid ISO date string.");
  }

  console.log("[validateGameData] Validation successful.");
  return true;
};

// Save game data to AsyncStorage
export async function saveToLocal(update) {
  try {
    const prevData = await loadFromLocal();

    const newData =
      typeof update === "function"
        ? update(prevData)
        : { ...prevData, ...update };

    validateGameData(newData);

    const timestamp = new Date().toISOString();
    const dataWithTimestamp = { ...newData, lastUpdated: timestamp };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp));
    console.log("[saveToLocal] Game data saved locally:", dataWithTimestamp);
  } catch (error) {
    console.error("[saveToLocal] Error:", error.message);
  }
}

// Load game data from AsyncStorage
export async function loadFromLocal() {
  try {
    const localData = await AsyncStorage.getItem(STORAGE_KEY);
    if (localData) {
      const parsed = JSON.parse(localData);
      console.log("[loadFromLocal] Loaded local data:", parsed);
      return parsed;
    }
    console.log("[loadFromLocal] No local data found.");
    return null;
  } catch (error) {
    console.error("[loadFromLocal] Error:", error.message);
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
    console.log(
      "[saveToCloud] Game data saved to Firestore:",
      dataWithTimestamp
    );
  } catch (error) {
    console.error("[saveToCloud] Error:", error.message);
  }
}

// Load game data from Firestore
export async function loadFromCloud(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log("[loadFromCloud] Data from Firestore:", data);
      return data;
    }
    console.log("[loadFromCloud] No cloud data found.");
    return null;
  } catch (error) {
    console.error("[loadFromCloud] Error:", error.message);
    return null;
  }
}

// Sync cloud to local
export async function syncFromCloud(uid) {
  try {
    const cloudData = await loadFromCloud(uid);
    const localData = await loadFromLocal();

    if (cloudData) {
      if (!localData || cloudData.lastUpdated > localData.lastUpdated) {
        console.log("[syncFromCloud] Cloud data is newer. Saving locally.");
        await saveToLocal(cloudData);
        return cloudData;
      } else {
        console.log("[syncFromCloud] Local data is newer. Syncing to cloud.");
        await saveToCloud(uid, localData);
        return localData;
      }
    }

    console.log("[syncFromCloud] No cloud data to sync. Returning local.");
    return localData;
  } catch (error) {
    console.error("[syncFromCloud] Error:", error.message);
    return null;
  }
}

// Sync local to cloud
export async function syncToCloud(uid) {
  try {
    const localData = await loadFromLocal();
    if (localData) {
      await saveToCloud(uid, localData);
    } else {
      console.log("[syncToCloud] No local data found.");
    }
  } catch (error) {
    console.error("[syncToCloud] Error:", error.message);
  }
}

// Save to both local and cloud
export async function saveGameData(uid, data) {
  try {
    const defaultGameData = {
      coins: 0,
      highscores: {},
      themes: defaultThemes,
      tutorialSeen: false,
      lastUpdated: new Date().toISOString(),
    };

    const dataToSave = { ...defaultGameData, ...data };

    console.log("[saveGameData] Saving game data to both local and cloud...");

    await saveToLocal(dataToSave);
    await saveToCloud(uid, dataToSave);
  } catch (error) {
    console.error("[saveGameData] Error:", error.message);
  }
}

// Load and sync data
export async function loadGameData(uid) {
  try {
    console.log("[loadGameData] Loading game data with sync.");
    const syncedData = await syncFromCloud(uid);
    return syncedData || (await loadFromLocal());
  } catch (error) {
    console.error("[loadGameData] Error:", error.message);
    return null;
  }
}

// One-time migration to unified key
export async function migrateLocalGameData() {
  try {
    console.log("[migrateLocalGameData] Starting migration...");

    const existingGameData = await AsyncStorage.getItem(STORAGE_KEY);
    if (existingGameData) {
      console.log("[migrateLocalGameData] Data already migrated. Skipping.");
      return;
    }

    const [coins, themes, highscores, tutorialSeen] = await Promise.all([
      AsyncStorage.getItem("COINS"),
      AsyncStorage.getItem("themesStatus"),
      AsyncStorage.getItem("HighScore"),
      AsyncStorage.getItem("sudokuTutorialSeen"),
    ]);

    const parsedData = {
      coins: coins ? parseInt(coins) : 0,
      themes: themes ? JSON.parse(themes) : defaultThemes,
      highscores: highscores ? JSON.parse(highscores) : {},
      tutorialSeen: tutorialSeen ? true : false,
      lastUpdated: new Date().toISOString(),
    };

    console.log("[migrateLocalGameData] Parsed gameData:", parsedData);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
    await AsyncStorage.multiRemove([
      "COINS",
      "themesStatus",
      "HighScore",
      "sudokuTutorialSeen",
    ]);

    console.log("[migrateLocalGameData] Migration successful.");
  } catch (error) {
    console.error("[migrateLocalGameData] Failed:", error.message);
  }
}
