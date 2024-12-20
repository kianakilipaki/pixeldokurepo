import React, { useEffect, useCallback, useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import CompletionModal from "../components/Modal";
import GameBoard from "../components/GameBoard";
import LoadingIndicator from "../components/loadingIcon";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import { useGame } from "../utils/gameContext";
import PlayOverlay from "../components/PlayOverlay";
import { generateSudoku } from "../utils/GeneratePuzzle";

const SudokuScreen = ({ route, navigation }) => {
  const {
    theme,
    setTheme,
    difficulty,
    setDifficulty,
    board,
    setBoard,
    initialBoard,
    solutionBoard,
    setInitialBoard,
    setSolutionBoard,
    timer,
    setTimer,
    retryCounter,
    setRetryCounter,
    saveProgress,
    hints,
    setHints,
  } = useGame();

  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const resetGame = useCallback(() => {
    try {
      const { puzzle, solution } = generateSudoku(difficulty);
      setBoard(puzzle);
      setInitialBoard(puzzle);
      setSolutionBoard(solution);
      setTimer(0);
      setRetryCounter(3);
      setHints(3);
    } catch (error) {
      console.error("Error loading game:", error);
    } finally {
      saveProgress();
      setIsLoading(false);
    }
  }, [difficulty]);

  const updateBoard = (value) => {
    const [row, col] = selectedCell || [];
    if (row != null && col != null && initialBoard[row][col] === 0) {
      const newBoard = board.map((r, i) => (i === row ? [...r] : r));
      newBoard[row][col] = value;
      setBoard(newBoard);
      saveProgress(newBoard);
    }
  };

  useEffect(() => {
    if (!theme) {
      const { theme, difficulty } = route.params;
      setTheme(theme);
      setDifficulty(difficulty);
      resetGame();
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
        <TopBar
          difficulty={difficulty}
          retryCounter={retryCounter}
          isPaused={isPaused || isModalVisible}
          timer={timer}
          setTimer={setTimer}
        />
        {isPaused && <PlayOverlay onPress={() => setIsPaused(false)} />}
        <GameBoard
          theme={theme}
          board={board}
          initialBoard={initialBoard}
          solutionBoard={solutionBoard}
          selectedCell={selectedCell}
          setBoard={setBoard}
          hints={hints}
          setHints={setHints}
          onCellSelect={setSelectedCell}
          updateBoard={updateBoard}
          onReset={() => setBoard(initialBoard)}
          onPause={() => setIsPaused(true)}
        />
        <CompletionModal
          difficulty={difficulty}
          board={board}
          solutionBoard={solutionBoard}
          retryCounter={retryCounter}
          setRetryCounter={setRetryCounter}
          timer={timer}
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
          onNextPuzzle={() => resetGame()}
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
    padding: "5vw",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SudokuScreen;
