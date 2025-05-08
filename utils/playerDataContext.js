import React, { createContext, useContext, useState, useEffect } from "react";
import { loadFromLocal, saveToLocal } from "./playerDataService";
import { defaultThemes } from "./assetsMap";
import { useGoogleAuth } from "./auth";

const PlayerDataContext = createContext();

export const PlayerDataProvider = ({ children }) => {
  const { user } = useGoogleAuth();
  const [coins, setCoins] = useState(0);
  const [highscores, setHighscores] = useState({});
  const [themes, setThemes] = useState({});
  const [showTutorial, setShowTutorial] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Centralized save helper to avoid overwrites
  const savePlayerData = async (partial) => {
    await saveToLocal((prev) => ({ ...prev, ...partial }), user?.uid);
  };

  // Load everything from AsyncStorage once
  const loadPlayerData = async () => {
    try {
      console.log("[PixelDokuLogs] Loading player data...");
      const data = await loadFromLocal();

      setCoins(data?.coins || 0);
      setHighscores(data?.highscores || {});
      setThemes((await mergeThemes(data?.themes)) || defaultThemes);
      setShowTutorial(!data?.tutorialSeen || false);
      setSoundOn(data?.soundOn !== false || true);
    } catch (error) {
      console.error("[PixelDokuLogs] Error loading player data:", error);
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

    if (JSON.stringify(storedThemes) !== JSON.stringify(merged)) {
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
