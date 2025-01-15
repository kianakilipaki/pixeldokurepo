import React, { useEffect, useCallback, useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import CompletionModal from "../components/CompletionModal";
import GameBoard from "../components/GameBoard";
import LoadingIndicator from "../components/loadingIcon";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import { useGame } from "../utils/gameContext";
import PlayOverlay from "../components/PlayOverlay";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const SudokuScreen = ({ route, navigation }) => {
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
  } = useGame();

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
      const newBoard = board.map((r, i) => (i === row ? [...r] : r));
      newBoard[row][col] = value;
      setBoard(newBoard);
      saveProgress(newBoard);
      setSelectedCell([row, col, value]);
    } else {
      const x = selectedCell ? selectedCell[0] : null;
      const y = selectedCell ? selectedCell[1] : null;
      setSelectedCell([x, y, value]);
    }
  };

  useEffect(() => {
    const { theme, difficulty, isNewGame } = route.params;
    if (isNewGame) {
      startNewGame(theme, difficulty);
    } else {
      setIsLoading(false);
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
      <Header
        title={theme.title}
        onBackPress={() => navigation.navigate("Home")}
      />
      <View style={styles.container}>
        <TopBar isPaused={isPaused || isModalVisible} />
        {isPaused && <PlayOverlay onPress={() => setIsPaused(false)} />}
        <GameBoard
          selectedCell={selectedCell}
          onCellSelect={setSelectedCell}
          updateBoard={updateBoard}
          deselect={() => setSelectedCell(null)}
          onReset={() => setBoard(initialBoard)}
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
    padding: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SudokuScreen;
