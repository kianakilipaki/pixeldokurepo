import { createContext, useContext, useState, useEffect } from "react";
import {
  loadFromLocal,
  migrateLocalGameData,
  saveToLocal,
  syncFromCloud,
} from "./playerDataService";
import { defaultThemes } from "./assetsMap";
import { useGoogleAuth } from "./authContext";
import isEqual from "lodash.isequal";

const PlayerDataContext = createContext();

export const PlayerDataProvider = ({ children }) => {
  const { user } = useGoogleAuth();
  const [coins, setCoins] = useState(0);
  const [highscores, setHighscores] = useState({});
  const [themes, setThemes] = useState({});
  const [showTutorial, setShowTutorial] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    const initializePlayerData = async () => {
      if (user) {
        try {
          console.log(
            "[Pixeldokulogs] User found. Initializing player data..."
          );
          await migrateLocalGameData(user.uid);
          await syncFromCloud(user.uid);
          await loadPlayerData();
        } catch (error) {
          console.error(
            "[Pixeldokulogs] Error syncing game data:",
            error.message
          );
        }
      }
    };

    initializePlayerData();
  }, [user]);

  // Centralized save helper to avoid overwrites
  const savePlayerData = async (partial) => {
    await saveToLocal((prev) => ({ ...prev, ...partial }), user?.uid);
  };

  // Load everything from AsyncStorage once
  const loadPlayerData = async () => {
    try {
      console.log("[Pixeldokulogs] Loading player data...");
      const data = await loadFromLocal();

      setCoins(data?.coins || 0);
      setHighscores(data?.highscores || {});
      setThemes((await mergeThemes(data?.themes)) || defaultThemes);
      setShowTutorial(!data?.tutorialSeen || false);
      setSoundOn(data?.soundOn);
    } catch (error) {
      console.error("[Pixeldokulogs] Error loading player data:", error);
    }
  };

  // Merge stored themes with defaults
  const mergeThemes = async (storedThemes) => {
    const merged = Object.keys(defaultThemes).reduce((acc, key) => {
      acc[key] = {
        ...defaultThemes[key],
        locked: storedThemes?.[key]?.locked ?? defaultThemes[key].locked,
      };
      return acc;
    }, {});

    if (!isEqual(storedThemes, merged)) {
      console.log("[Pixeldokulogs] Merging themes...");

      await savePlayerData({ themes: merged });
    }

    return merged;
  };

  // --- COIN METHODS ---
  const addCoins = async (amount) => {
    const newCoins = coins + amount;
    setCoins(newCoins);
    await savePlayerData({ coins: newCoins });
  };

  const removeCoins = async (amount) => {
    const newCoins = Math.max(coins - amount, 0);
    setCoins(newCoins);
    await savePlayerData({ coins: newCoins });
  };

  // --- HIGHSCORE METHODS ---
  const saveHighScore = async (themeKey, difficulty, time) => {
    const updatedScores = { ...highscores };

    if (!updatedScores[themeKey]) {
      updatedScores[themeKey] = { Easy: null, Medium: null, Hard: null };
    }

    const current = updatedScores[themeKey][difficulty];
    if (current === null || time < current) {
      updatedScores[themeKey][difficulty] = time;
      setHighscores(updatedScores);
      await savePlayerData({ highscores: updatedScores });
    }
  };

  // --- THEME METHODS ---
  const unlockTheme = async (themeKey) => {
    const updatedThemes = { ...themes };
    const theme = updatedThemes[themeKey];

    if (theme && theme.locked) {
      theme.locked = false;
      setThemes(updatedThemes);
      await savePlayerData({ themes: updatedThemes });
    }
  };

  // --- TUTORIAL ---
  const completeTutorial = async () => {
    setShowTutorial(false);
    await savePlayerData({ tutorialSeen: true });
  };

  // --- SOUND TOGGLE ---
  const toggleSound = async () => {
    const updatedSound = !soundOn;
    setSoundOn(updatedSound);
    await savePlayerData({ soundOn: updatedSound });
  };

  return (
    <PlayerDataContext.Provider
      value={{
        loadPlayerData,
        coins,
        addCoins,
        removeCoins,
        highscores,
        saveHighScore,
        themes,
        unlockTheme,
        showTutorial,
        completeTutorial,
        soundOn,
        toggleSound,
      }}
    >
      {children}
    </PlayerDataContext.Provider>
  );
};

export const usePlayerData = () => useContext(PlayerDataContext);
