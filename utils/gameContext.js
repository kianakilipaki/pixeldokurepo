import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  generateSudoku,
  removePencilMarks,
  updateCell,
} from "./generatePuzzle";

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
  const [errorCell, setErrorCell] = useState([]);

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
      console.log("[PixelDokuLogs] Progress saved:", progress);
    } catch (error) {
      console.error("[PixelDokuLogs] Error saving progress:", error);
    }
  };

  // Load progress function
  const loadProgress = async () => {
    try {
      const stringProgress = await AsyncStorage.getItem("gameProgress");
      const progress = stringProgress ? JSON.parse(stringProgress) : null;
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
        console.log("[PixelDokuLogs] Progress loaded:", progress);
      }
      return progress;
    } catch (error) {
      console.error("[PixelDokuLogs] Error loading progress:", error);
    }
  };

  // Reset progress
  const resetProgress = async (theme, difficulty, sameBoard = false) => {
    try {
      if (theme) {
        setTheme(theme);
        setDifficulty(difficulty);
        if (!sameBoard) {
          // reset progress with new board
          console.log("[PixelDokuLogs] Preparing new board...");
          const { puzzle, solution } = generateSudoku(difficulty);
          setBoard(puzzle);
          setInitialBoard(puzzle);
          setSolutionBoard(solution);
        } else {
          // reset progress with same board
          console.log("[PixelDokuLogs] Resetting board...");
          setBoard(initialBoard);
          setInitialBoard(initialBoard);
          setSolutionBoard(solutionBoard);
        }
      } else {
        // reset progress with no board
        console.log("[PixelDokuLogs] Clearing board...");
        setTheme("birds");
        setDifficulty(null);
        setBoard([]);
        setInitialBoard([]);
        setSolutionBoard([]);
      }
      // Reset other game states
      setTimer(0);
      setMistakeCounter(3);
      setHints(3);
      setIsPencilIn(false);
      setSelectedCell(null);
      setErrorCell([]);
    } catch (error) {
      console.error("[PixelDokuLogs] Error starting new game:", error);
    }
  };

  // Update board on cell changes
  const updateBoard = (value) => {
    try {
      let row, col, newValue, pencilIn;

      if (Array.isArray(value)) {
        [row, col, newValue] = value;
        pencilIn = false;
      } else {
        [row, col] = selectedCell || [];
        newValue = value;
        pencilIn = isPencilIn;
      }

      if (
        row < 0 ||
        row >= board.length ||
        col < 0 ||
        col >= board[0].length ||
        typeof newValue !== "number"
      ) {
        console.error("[PixelDokuLogs] Invalid input for updateBoard:", {
          row,
          col,
          newValue,
        });
        return;
      }

      if (row != null && col != null && initialBoard[row][col] === 0) {
        setBoard((prevBoard) => {
          const newBoard = JSON.parse(JSON.stringify(prevBoard));
          newBoard[row][col] = updateCell(
            newBoard[row][col],
            newValue,
            pencilIn
          );

          if (!pencilIn) {
            return removePencilMarks(newBoard, row, col, newValue);
          }
          return newBoard;
        });

        if (!pencilIn) {
          if (newValue !== solutionBoard[row][col] && newValue !== 0) {
            setErrorCell((prev) => [...prev, [row, col, newValue]]);
            setMistakeCounter((prev) => Math.max(prev - 1, 0));
          } else {
            setErrorCell((prev) =>
              prev?.filter(([r, c, v]) => !(r === row && c === col))
            );
          }
        }
        setSelectedCell([row, col, newValue]);
      } else {
        setSelectedCell([null, null, newValue]);
      }
    } catch (error) {
      console.error("[PixelDokuLogs] Error updating board:", error);
    }
  };

  useEffect(() => {
    saveProgress(board);
  }, [board, mistakeCounter, errorCell]);

  const contextValue = useMemo(
    () => ({
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
      loadProgress,
      resetProgress,
    }),
    [
      theme,
      difficulty,
      board,
      initialBoard,
      solutionBoard,
      selectedCell,
      mistakeCounter,
      timer,
      hints,
      isPencilIn,
      errorCell,
    ]
  );

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

// Custom hook to use the GameContext
export const useGame = () => useContext(GameContext);
