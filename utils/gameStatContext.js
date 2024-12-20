import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GameStatContext = createContext();

export const GameStatProvider = ({ children }) => {
  const [gameStats, setGameStats] = useState({});

  // Load stats from AsyncStorage when the provider is mounted
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsJSON = await AsyncStorage.getItem("gameStats");
        const stats = statsJSON ? JSON.parse(statsJSON) : {};
        setGameStats(stats);
      } catch (error) {
        console.error("Error loading game stats:", error);
      }
    };

    loadStats();
  }, []);

  // Save game stats function
  const saveGameStat = async (themeKey, difficulty) => {
    try {
      // Update the local state
      const updatedStats = { ...gameStats };

      if (!updatedStats[themeKey]) {
        updatedStats[themeKey] = { Easy: 0, Medium: 0, Hard: 0 };
      }

      updatedStats[themeKey][difficulty] += 1;
      setGameStats(updatedStats);

      // Save to AsyncStorage
      await AsyncStorage.setItem("gameStats", JSON.stringify(updatedStats));
      console.log("Game Stats:", updatedStats);
    } catch (error) {
      console.error("Error saving game stats:", error);
    }
  };

  return (
    <GameStatContext.Provider value={{ gameStats, saveGameStat }}>
      {children}
    </GameStatContext.Provider>
  );
};

// Custom hook to use the GameStatContext
export const useGameStat = () => useContext(GameStatContext);
