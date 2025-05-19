import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./authContext";
import { themeAssets } from "./themeAssets";

const STORAGE_KEY = "gameData";

// Helper function to validate game data
const validateGameData = (data) => {
  if (typeof data !== "object" || data === null) {
    throw new Error("Game data must be a valid object.");
  }

  const { coins, highscores, unlockedThemes, tutorialSeen, lastUpdated } = data;

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

  if (typeof unlockedThemes !== "object" || unlockedThemes === null) {
    throw new Error("UnlockedThemes must be a valid object.");
  }

  Object.entries(unlockedThemes).forEach(([themeKey, themeData]) => {
    if (typeof themeData !== "object" || themeData === null) {
      throw new Error(`Theme data for "${themeKey}" must be a valid object.`);
    }
    const { locked } = themeData;
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

  console.log("[Pixeldokulogs] [validateGameData] Validation successful.");
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

    delete newData.themes; // Remove themes from the newData object
    // Validate the new data before saving
    validateGameData(newData);

    const timestamp = new Date().toISOString();
    const dataWithTimestamp = { ...newData, lastUpdated: timestamp };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp));
    console.log(
      "[Pixeldokulogs] [saveToLocal] Game data saved locally:",
      JSON.stringify(dataWithTimestamp)
    );

    // Optional: Also save to cloud if uid is passed
    if (uid) {
      await saveToCloud(uid, dataWithTimestamp);
    }
  } catch (error) {
    console.error("[Pixeldokulogs] [saveToLocal] Error:", error.message);
  }
}

// Load game data from AsyncStorage
export async function loadFromLocal() {
  try {
    const localData = await AsyncStorage.getItem(STORAGE_KEY);
    if (localData) {
      const parsed = JSON.parse(localData);
      console.log(
        "[Pixeldokulogs] [loadFromLocal] Loaded local data:",
        localData
      );
      return parsed;
    }
    console.log("[Pixeldokulogs] [loadFromLocal] No local data found.");
    return null;
  } catch (error) {
    console.error("[Pixeldokulogs] [loadFromLocal] Error:", error.message);
    return null;
  }
}

// Save game data to Firestore
export async function saveToCloud(uid, data) {
  try {
    await setDoc(doc(db, "users", uid), data, { merge: true });
    console.log(
      "[Pixeldokulogs] [saveToCloud] Game data saved to Firestore:",
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("[Pixeldokulogs] [saveToCloud] Error:", error.message);
  }
}

// Load game data from Firestore
export async function loadFromCloud(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log(
        "[Pixeldokulogs] [loadFromCloud] Data from Firestore:",
        JSON.stringify(data)
      );
      return data;
    }
    console.log("[Pixeldokulogs] [loadFromCloud] No cloud data found.");
    return null;
  } catch (error) {
    console.error("[Pixeldokulogs] [loadFromCloud] Error:", error.message);
    return null;
  }
}

// Sync cloud to local
export async function syncFromCloud(uid) {
  try {
    console.log("[Pixeldokulogs] Syncing game data for user...");
    const cloudData = await loadFromCloud(uid);

    // Cloud data get priority
    if (cloudData) {
      console.log(
        "[Pixeldokulogs] [syncFromCloud] Cloud data found. Overwriting local data."
      );
      await saveToLocal(cloudData);
      return cloudData;
    }

    const localData = await loadFromLocal();

    // No cloud data, but local exists (first-time login or new device)
    if (!cloudData && localData && uid) {
      console.log(
        "[Pixeldokulogs] [syncFromCloud] No cloud data, using local and saving to cloud."
      );
      await saveToCloud(uid, localData);
      return localData;
    }

    // No data at all
    console.log(
      "[Pixeldokulogs] [syncFromCloud] No cloud or local data to sync."
    );
    return null;
  } catch (error) {
    console.error("[Pixeldokulogs] [syncFromCloud] Error:", error.message);
    return null;
  }
}

// Reset and seed old game data for testing purposes
export async function resetAndSeedOldGameData() {
  try {
    // Clear migrated and user data
    await AsyncStorage.multiRemove([STORAGE_KEY, "user"]);

    // Seed old format keys
    await AsyncStorage.setItem("COINS", JSON.stringify(500));

    await AsyncStorage.setItem("themesStatus", JSON.stringify(themeAssets));

    await AsyncStorage.setItem(
      "HighScore",
      JSON.stringify({
        birds: { Easy: 120, Medium: null, Hard: null },
        cats: { Easy: 110, Medium: null, Hard: null },
      })
    );

    await AsyncStorage.setItem("sudokuTutorialSeen", JSON.stringify(true));
    const keys = await AsyncStorage.getAllKeys();

    console.log("[Pixeldokulogs] Reset and seeded old fake game data:", keys);
  } catch (error) {
    console.error("[Pixeldokulogs] Error during reset/seed:", error);
  }
}

// Merge themes with default values
export async function mergeThemes(themes) {
  try {
    // If themes is not an object, return all locked by default except 'birds'
    if (!themes || typeof themes !== "object") {
      return Object.keys(themeAssets).reduce((acc, key) => {
        acc[key] = { locked: key === "birds" ? false : true };
        return acc;
      }, {});
    }

    // Only keep the locked value for each theme key, but 'birds' is always unlocked
    const merged = Object.keys(themeAssets).reduce((acc, key) => {
      acc[key] = {
        locked:
          key === "birds"
            ? false
            : !!(themes[key] && themes[key].locked === false ? false : true),
      };
      return acc;
    }, {});

    console.log("[Pixeldokulogs] Merged themes:", merged);
    return merged;
  } catch (error) {
    console.error("[Pixeldokulogs] Error merging themes:", error.message);
    return {};
  }
}

// One-time migration to unified key
export async function migrateLocalGameData(uid) {
  try {
    console.log("[Pixeldokulogs] Starting migration...");
    if (uid) {
      const cloudData = await loadFromCloud(uid);
      if (cloudData && !cloudData.themes) {
        console.log("[Pixeldokulogs] Cloud data found. Skipping migration.");
        return;
      } else if (cloudData && cloudData.themes) {
        console.log(
          "[Pixeldokulogs] Cloud data found but not in the correct format."
        );
        await mergeThemes(cloudData.themes).then(async (fixThemes) => {
          delete cloudData.themes;
          await saveToCloud({ ...cloudData, unlockedThemes: fixThemes });
        });
        return;
      }
    }
    const localData = await loadFromLocal();
    if (localData && !localData.themes) {
      console.log("[Pixeldokulogs] Data already migrated. Skipping.");
      return;
    } else if (localData && localData.themes) {
      console.log(
        "[Pixeldokulogs] Local data found but not in the correct format."
      );
      await mergeThemes(localData.themes).then(async (fixThemes) => {
        delete localData.themes;
        await saveToLocal({ ...localData, unlockedThemes: fixThemes });
      });
      return;
    }

    const [coins, themes, highscores, tutorialSeen] = await Promise.all([
      AsyncStorage.getItem("COINS"),
      AsyncStorage.getItem("themesStatus"),
      AsyncStorage.getItem("HighScore"),
      AsyncStorage.getItem("sudokuTutorialSeen"),
    ]);

    const parsedThemes = themes ? JSON.parse(themes) : themeAssets;
    const unlockedThemes = await mergeThemes(parsedThemes);

    const parsedData = {
      coins: coins ? parseInt(coins) : 0,
      unlockedThemes,
      highscores: highscores ? JSON.parse(highscores) : {},
      tutorialSeen: tutorialSeen ? true : false,
      soundOn: true,
      facebookFollowed: false,
      lastUpdated: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
    await AsyncStorage.multiRemove([
      "COINS",
      "themesStatus",
      "HighScore",
      "sudokuTutorialSeen",
    ]);

    console.log("[Pixeldokulogs] Migration successful.");
  } catch (error) {
    console.error("[Pixeldokulogs] Migration Failed:", error.message);
  }
}
