import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HighScoreContext = createContext();

export const HighScoreProvider = ({ children }) => {
  const [HighScore, setHighScore] = useState({});

  // Load Scores from AsyncStorage when the provider is mounted
  useEffect(() => {
    const loadScores = async () => {
      try {
        const ScoresJSON = await AsyncStorage.getItem("HighScore");
        const Scores = ScoresJSON ? JSON.parse(ScoresJSON) : {};
        setHighScore(Scores);
      } catch (error) {
        console.error("Error loading game Scores:", error);
      }
    };

    loadScores();
  }, []);

  // Save game Scores function
  const saveHighScore = async (themeKey, difficulty, time) => {
    try {
      // Clone the current high scores
      const updatedScores = { ...HighScore };

      // If no scores exist for the themeKey, initialize it
      if (!updatedScores[themeKey]) {
        updatedScores[themeKey] = { Easy: null, Medium: null, Hard: null };
      }

      // Get the current high score for the difficulty
      const currentHighScore = updatedScores[themeKey][difficulty];

      // Update the score only if the new time is faster (or no score exists)
      if (currentHighScore === null || time < currentHighScore) {
        updatedScores[themeKey][difficulty] = time;
        setHighScore(updatedScores);

        // Save to AsyncStorage
        await AsyncStorage.setItem("HighScore", JSON.stringify(updatedScores));
        console.log("New High Score:", updatedScores);
      } else {
        console.log("Time not fast enough to update high score.");
      }
    } catch (error) {
      console.error("Error saving game Scores:", error);
    }
  };

  return (
    <HighScoreContext.Provider value={{ HighScore, saveHighScore }}>
      {children}
    </HighScoreContext.Provider>
  );
};

// Custom hook to use the HighScoreContext
export const useHighScore = () => useContext(HighScoreContext);
