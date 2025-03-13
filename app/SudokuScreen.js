import React, { useEffect, useCallback, useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import CompletionModal from "../components/GamePlay/CompletionModal";
import LoadingIndicator from "../components/loadingIcon";
import TopBar from "../components/GamePlay/TopBar";
import { useGame } from "../utils/gameContext";
import PlayOverlay from "../components/GamePlay/PlayOverlay";
import { Dimensions } from "react-native";
import { isTablet } from "../utils/assetsMap";
import { useMusic } from "../utils/musicContext";
import Board from "../components/GamePlay/Board";
import ActionButtons from "../components/GamePlay/ActionButtons";
import InputButtons from "../components/GamePlay/InputButtons";

const { width } = Dimensions.get("window");

const SudokuScreen = ({ route }) => {
  const {
    theme,
    setTheme,
    difficulty,
    setDifficulty,
    setBoard,
    initialBoard,
    resetProgress,
  } = useGame();

  const { playBackgroundMusic } = useMusic();

  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
        <Board />
        <ActionButtons onPause={() => setIsPaused(true)} />
        <InputButtons />
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
