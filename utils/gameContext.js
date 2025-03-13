import React, { createContext, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  generateSudoku,
  removePencilMarks,
  updateCell,
} from "./GeneratePuzzle";

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
  const [selectedCell, setSelectedCell] = useState([]);

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
        setSelectedCell(null);
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
      setSelectedCell(null);
    } catch (error) {
      console.error("Error starting new game:", error);
    } finally {
      saveProgress();
    }
  };

  const updateBoard = (value) => {
    let row, col, newValue, pencilIn;

    if (Array.isArray(value)) {
      [row, col, newValue] = value;
      pencilIn = false;
    } else {
      [row, col] = selectedCell || [];
      newValue = value;
      pencilIn = isPencilIn;
    }

    if (row != null && col != null && initialBoard[row][col] === 0) {
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((r, i) => (i === row ? [...r] : r));

        // Update the selected cell using helper function
        newBoard[row][col] = updateCell(newBoard[row][col], newValue, pencilIn);

        // If it's not in pencil mode, remove the value from other cells in the same row, column, and section
        if (!pencilIn) {
          const removedBoard = removePencilMarks(newBoard, row, col, newValue);
          saveProgress(removedBoard);
          return removedBoard;
        } else {
          saveProgress(newBoard);
          return newBoard;
        }
      });

      setSelectedCell([row, col, newValue]);
    } else {
      setSelectedCell([null, null, newValue]);
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
        selectedCell,
        setSelectedCell,
        retryCounter,
        setRetryCounter,
        timer,
        setTimer,
        hints,
        setHints,
        isPencilIn,
        setIsPencilIn,
        updateBoard,
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
