import React, { createContext, useContext, useState, useEffect } from "react";
import { loadFromLocal, saveToLocal } from "./playerDataService";
import { defaultThemes } from "./assetsMap";

const PlayerDataContext = createContext();

export const PlayerDataProvider = ({ children }) => {
  const [coins, setCoins] = useState(0);
  const [highscores, setHighscores] = useState({});
  const [themes, setThemes] = useState({});
  const [showTutorial, setShowTutorial] = useState(false);

  // Centralized save helper to avoid overwrites
  const savePlayerData = async (partial) => {
    await saveToLocal((prev) => ({ ...prev, ...partial }));
  };

  // Load everything from AsyncStorage once
  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        const data = await loadFromLocal();

        setCoins(data.coins || 0);
        setHighscores(data.highscores || {});
        setThemes(await mergeThemes(data.themes));
        setShowTutorial(!data.tutorialSeen);
      } catch (error) {
        console.error("Error loading player data:", error);
      }
    };

    loadPlayerData();
  }, []);

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

  return (
    <PlayerDataContext.Provider
      value={{
        coins,
        addCoins,
        removeCoins,
        highscores,
        saveHighScore,
        themes,
        unlockTheme,
        showTutorial,
        completeTutorial,
      }}
    >
      {children}
    </PlayerDataContext.Provider>
  );
};

// Custom hook
export const usePlayerData = () => useContext(PlayerDataContext);
