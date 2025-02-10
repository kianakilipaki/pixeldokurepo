import React, { createContext, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateSudoku } from "./GeneratePuzzle";

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
  const [isPencilIn, setIsPencilIn] = useState(false);

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
        return progress;
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  // Reset progress function
  const resetProgress = async (difficulty) => {
    try {
      const { puzzle, solution } = generateSudoku(difficulty);
      setBoard(puzzle);
      setInitialBoard(puzzle);
      setSolutionBoard(solution);
      setTimer(0);
      setRetryCounter(3);
      setHints(3);
      setIsPencilIn(false);
    } catch (error) {
      console.error("Error starting new game:", error);
    } finally {
      saveProgress();
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
        isPencilIn,
        setIsPencilIn,
        saveProgress,
        loadProgress,
        resetProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the GameContext
export const useGame = () => useContext(GameContext);
