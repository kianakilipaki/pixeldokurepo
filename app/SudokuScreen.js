import React, { useEffect, useCallback, useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import CompletionModal from "../components/GamePlay/CompletionModal";
import GameBoard from "../components/GamePlay/GameBoard";
import LoadingIndicator from "../components/loadingIcon";
import TopBar from "../components/GamePlay/TopBar";
import { useGame } from "../utils/gameContext";
import PlayOverlay from "../components/GamePlay/PlayOverlay";
import { Dimensions } from "react-native";
import { isTablet } from "../utils/assetsMap";
import { useMusic } from "../utils/musicContext";
import { removePencilMarks, updateCell } from "../utils/GeneratePuzzle";

const { width } = Dimensions.get("window");

const SudokuScreen = ({ route }) => {
  const {
    theme,
    setTheme,
    difficulty,
    setDifficulty,
    board,
    setBoard,
    initialBoard,
    saveProgress,
    resetProgress,
    isPencilIn,
  } = useGame();

  const { playBackgroundMusic } = useMusic();

  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const startNewGame = useCallback(
    (theme, difficulty) => {
      try {
        setTheme(theme);
        setDifficulty(difficulty);
        resetProgress(difficulty);
      } catch (error) {
        console.error("Error loading game:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [difficulty]
  );

  const updateBoard = (value) => {
    const [row, col] = selectedCell || [];

    if (row != null && col != null && initialBoard[row][col] === 0) {
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((r, i) => (i === row ? [...r] : r));

        // Update the selected cell using helper function
        newBoard[row][col] = updateCell(newBoard[row][col], value, isPencilIn);

        // If it's not in pencil mode, remove the value from other cells in the same row, column, and section
        if (!isPencilIn) {
          return removePencilMarks(newBoard, row, col, value);
        }

        saveProgress(newBoard);
        return newBoard;
      });

      setSelectedCell([row, col, value]);
    } else {
      setSelectedCell([null, null, value]);
    }
  };

  useEffect(() => {
    const { theme, difficulty, isNewGame } = route.params;
    if (isNewGame) {
      startNewGame(theme, difficulty);
      playBackgroundMusic(theme.bgSound);
    } else {
      setIsLoading(false);
      playBackgroundMusic(theme.bgSound);
    }
  }, [route.params]);

  if (isLoading || !theme) {
    return <LoadingIndicator />;
  }

  return (
    <ImageBackground
      source={theme.bgSource}
      resizeMode="cover"
      style={styles.image}
    >
      <View style={styles.container}>
        <TopBar isPaused={isPaused || isModalVisible} />
        {isPaused && <PlayOverlay onPress={() => setIsPaused(false)} />}
        <GameBoard
          selectedCell={selectedCell}
          onCellSelect={setSelectedCell}
          updateBoard={updateBoard}
          deselect={() => setSelectedCell(null)}
          onPause={() => setIsPaused(true)}
        />
        <CompletionModal
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
          onNextPuzzle={() => startNewGame(theme, difficulty)}
          onRetry={() => setBoard(initialBoard)}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: isTablet ? width * 0.1 : width * 0.04,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SudokuScreen;
