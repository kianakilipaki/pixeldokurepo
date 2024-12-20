import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // Game State
  const [theme, setTheme] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [solutionBoard, setSolutionBoard] = useState([]);
  const [retryCounter, setRetryCounter] = useState(3);
  const [hints, setHints] = useState(3);
  const [timer, setTimer] = useState(0);

  // Save progress function
  const saveProgress = async (newBoard) => {
    try {
      const progress = {
        theme,
        difficulty,
        board: newBoard || board,
        initialBoard,
        solutionBoard,
        retryCounter,
        timer,
        hints,
      };
      const progressString = JSON.stringify(progress);
      await AsyncStorage.setItem("gameProgress", progressString);
      console.log("Progress saved:", progress);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  // Load progress function
  const loadProgress = async () => {
    try {
      const progressString = await AsyncStorage.getItem("gameProgress");
      if (progressString) {
        const progress = JSON.parse(progressString);
        setTheme(progress.theme);
        setDifficulty(progress.difficulty);
        setBoard(progress.board);
        setInitialBoard(progress.initialBoard);
        setSolutionBoard(progress.solutionBoard);
        setRetryCounter(progress.retryCounter);
        setTimer(progress.timer);
        setHints(progress.hints);
        console.log("Progress loaded:", progress);
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  return (
    <GameContext.Provider
      value={{
        theme,
        setTheme,
        difficulty,
        setDifficulty,
        board,
        setBoard,
        initialBoard,
        setInitialBoard,
        solutionBoard,
        setSolutionBoard,
        retryCounter,
        setRetryCounter,
        timer,
        setTimer,
        hints,
        setHints,
        saveProgress,
        loadProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the GameContext
export const useGame = () => useContext(GameContext);
