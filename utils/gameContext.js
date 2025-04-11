import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  generateSudoku,
  removePencilMarks,
  updateCell,
} from "./GeneratePuzzle";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // Game State
  const [theme, setTheme] = useState("birds");
  const [difficulty, setDifficulty] = useState(null);
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [solutionBoard, setSolutionBoard] = useState([]);
  const [mistakeCounter, setMistakeCounter] = useState(3);
  const [hints, setHints] = useState(3);
  const [timer, setTimer] = useState(0);
  const [isPencilIn, setIsPencilIn] = useState(false);
  const [selectedCell, setSelectedCell] = useState([]);
  const [errorCell, setErrorCell] = useState(null);

  // Save progress function
  const saveProgress = async (newBoard) => {
    try {
      const progress = {
        theme,
        difficulty,
        board: newBoard || board,
        initialBoard,
        solutionBoard,
        mistakeCounter,
        errorCell,
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
  const loadProgress = async (progress) => {
    try {
      if (progress) {
        setTheme(progress.theme);
        setDifficulty(progress.difficulty);
        setBoard(progress.board);
        setInitialBoard(progress.initialBoard);
        setSolutionBoard(progress.solutionBoard);
        setMistakeCounter(progress.mistakeCounter);
        setTimer(progress.timer);
        setHints(progress.hints);
        setSelectedCell(null);
        setErrorCell(progress.errorCell);
        console.log("Progress loaded:", progress);
        return progress;
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  // Reset progress
  const resetProgress = async (theme, difficulty, sameBoard = false) => {
    try {
      const init = initialBoard;
      const solution = solutionBoard;

      clearProgress();

      if (theme) {
        setTheme(theme);
        setDifficulty(difficulty);
      }
      if (sameBoard) {
        // reset progress with same board
        setBoard(init);
        setInitialBoard(init);
        setSolutionBoard(solution);
      } else if (!sameBoard) {
        // reset progress with new board
        const { puzzle, solution } = generateSudoku(difficulty);
        setBoard(puzzle);
        setInitialBoard(puzzle);
        setSolutionBoard(solution);
      }
    } catch (error) {
      console.error("Error starting new game:", error);
    } finally {
      saveProgress();
    }
  };

  const clearProgress = () => {
    setTheme("birds");
    setDifficulty(null);
    setBoard([]);
    setInitialBoard([]);
    setSolutionBoard([]);
    setTimer(0);
    setMistakeCounter(3);
    setHints(3);
    setIsPencilIn(false);
    setSelectedCell(null);
    setErrorCell([]);
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
          return removedBoard;
        } else {
          return newBoard;
        }
      });

      // Check for mistake **after** updating the board
      if (!pencilIn) {
        if (newValue !== solutionBoard[row][col] && newValue !== 0) {
          // If incorrect, add to errorCell (ensure it doesn’t duplicate)
          setErrorCell((prev) => [...prev, [row, col, newValue]]);
          setMistakeCounter((prev) => Math.max(prev - 1, 0)); // Reduce mistake counter
        } else {
          // If correct, remove only the matching error, not all
          setErrorCell((prev) =>
            prev.filter(([r, c, v]) => !(r === row && c === col))
          );
        }
      }
      setSelectedCell([row, col, newValue]);
    } else {
      setSelectedCell([null, null, newValue]);
    }
  };

  useEffect(() => {
    saveProgress();
  }, [board, mistakeCounter, errorCell]);

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
        mistakeCounter,
        setMistakeCounter,
        timer,
        setTimer,
        hints,
        setHints,
        isPencilIn,
        setIsPencilIn,
        errorCell,
        setErrorCell,
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
