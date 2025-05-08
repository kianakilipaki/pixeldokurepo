// playerDataService.js

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
    throw new Error("TutorialSeen must be a boolean.");
  }

  if (typeof lastUpdated !== "string" || isNaN(Date.parse(lastUpdated))) {
    throw new Error("LastUpdated must be a valid ISO date string.");
  }

  console.log("[PixelDokuLogs] [validateGameData] Validation successful.");
  return true;
};

// Save game data to AsyncStorage
export async function saveToLocal(update, uid = null) {
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
    console.log(
      "[PixelDokuLogs] [saveToLocal] Game data saved locally:",
      JSON.stringify(dataWithTimestamp)
    );

    // Optional: Also save to cloud if uid is passed
    if (uid) {
      await saveToCloud(uid, dataWithTimestamp);
    }
  } catch (error) {
    console.error("[PixelDokuLogs] [saveToLocal] Error:", error.message);
  }
}

// Load game data from AsyncStorage
export async function loadFromLocal() {
  try {
    const localData = await AsyncStorage.getItem(STORAGE_KEY);
    if (localData) {
      const parsed = JSON.parse(localData);
      console.log(
        "[PixelDokuLogs] [loadFromLocal] Loaded local data:",
        localData
      );
      return parsed;
    }
    console.log("[PixelDokuLogs] [loadFromLocal] No local data found.");
    return null;
  } catch (error) {
    console.error("[PixelDokuLogs] [loadFromLocal] Error:", error.message);
    return null;
  }
}

// Save game data to Firestore
export async function saveToCloud(uid, data) {
  try {
    await setDoc(doc(db, "users", uid), data, { merge: true });
    console.log(
      "[PixelDokuLogs] [saveToCloud] Game data saved to Firestore:",
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("[PixelDokuLogs] [saveToCloud] Error:", error.message);
  }
}

// Load game data from Firestore
export async function loadFromCloud(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log(
        "[PixelDokuLogs] [loadFromCloud] Data from Firestore:",
        JSON.stringify(data)
      );
      return data;
    }
    console.log("[PixelDokuLogs] [loadFromCloud] No cloud data found.");
    return null;
  } catch (error) {
    console.error("[PixelDokuLogs] [loadFromCloud] Error:", error.message);
    return null;
  }
}

// Sync cloud to local
export async function syncFromCloud(uid) {
  try {
    const cloudData = await loadFromCloud(uid);
    const localData = await loadFromLocal();

    if (
      cloudData &&
      (!localData || cloudData.lastUpdated > localData.lastUpdated)
    ) {
      console.log(
        "[PixelDokuLogs] [syncFromCloud] Cloud data is newer. Saving locally."
      );
      await saveToLocal(cloudData);
      return cloudData;
    }

    if (
      cloudData &&
      localData &&
      cloudData.lastUpdated <= localData.lastUpdated
    ) {
      console.log(
        "[PixelDokuLogs] [syncFromCloud] Local data is newer. Syncing to cloud."
      );
      await saveToCloud(uid, localData);
      return localData;
    }

    if (!cloudData && localData && uid) {
      console.log(
        "[PixelDokuLogs] [syncFromCloud] No cloud data, but local exists. Saving to cloud."
      );
      await saveToCloud(uid, localData);
      return localData;
    }

    console.log(
      "[PixelDokuLogs] [syncFromCloud] No cloud or local data to sync."
    );
    return null;
  } catch (error) {
    console.error("[PixelDokuLogs] [syncFromCloud] Error:", error.message);
    return null;
  }
}

export async function resetAndSeedOldGameData() {
  try {
    // Clear migrated and user data
    await AsyncStorage.multiRemove([STORAGE_KEY, "user"]);

    // Seed old format keys
    await AsyncStorage.setItem("COINS", JSON.stringify(500));

    await AsyncStorage.setItem("themesStatus", JSON.stringify(defaultThemes));

    await AsyncStorage.setItem(
      "HighScore",
      JSON.stringify({
        birds: { Easy: 120, Medium: null, Hard: null },
        cats: { Easy: 110, Medium: null, Hard: null },
      })
    );

    await AsyncStorage.setItem("sudokuTutorialSeen", JSON.stringify(true));
    const keys = await AsyncStorage.getAllKeys();

    console.log("[PixelDokuLogs] Reset and seeded old fake game data:", keys);
  } catch (error) {
    console.error("[PixelDokuLogs] Error during reset/seed:", error);
  }
}

// One-time migration to unified key
export async function migrateLocalGameData(uid) {
  try {
    console.log("[PixelDokuLogs] [migrateLocalGameData] Starting migration...");
    if (uid) {
      const cloudData = await loadFromCloud(uid);
      if (cloudData) {
        console.log(
          "[PixelDokuLogs] [migrateLocalGameData] Cloud data found. Skipping migration."
        );
        return;
      }
    }
    const localData = await loadFromLocal();
    if (localData) {
      console.log(
        "[PixelDokuLogs] [migrateLocalGameData] Data already migrated. Skipping."
      );
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
      soundOn: true,
      lastUpdated: new Date().toISOString(),
    };

    console.log(
      "[PixelDokuLogs] [migrateLocalGameData] Parsed gameData:",
      JSON.stringify(parsedData)
    );

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
    await AsyncStorage.multiRemove([
      "COINS",
      "themesStatus",
      "HighScore",
      "sudokuTutorialSeen",
    ]);

    console.log("[PixelDokuLogs] [migrateLocalGameData] Migration successful.");
  } catch (error) {
    console.error(
      "[PixelDokuLogs] [migrateLocalGameData] Failed:",
      error.message
    );
  }
}
