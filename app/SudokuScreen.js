import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";
import CompletionModal from "../components/GamePlay/CompletionModal";
import LoadingIndicator from "../components/loadingIcon";
import TopBar from "../components/GamePlay/TopBar";
import { useGame } from "../utils/gameContext";
import PlayOverlay from "../components/GamePlay/PlayOverlay";
import { Dimensions } from "react-native";
import { isTablet } from "../utils/gameStyles";
import Board from "../components/GamePlay/Board";
import ActionButtons from "../components/GamePlay/ActionButtons";
import InputButtons from "../components/GamePlay/InputButtons";
import { useMusic } from "../utils/musicContext";

const { width } = Dimensions.get("window");

const SudokuScreen = ({ route, navigation }) => {
  const {
    theme,
    setTheme,
    difficulty,
    setDifficulty,
    resetProgress,
    setSelectedCell,
    isPaused,
    setIsPaused,
  } = useGame();
  const { playThemeMusic, stopMusic } = useMusic();

  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [openPlayOverlay, setOpenPlayOverlay] = useState(false);

  const startNewGame = useCallback(
    async (theme, difficulty) => {
      try {
        await resetProgress(theme, difficulty, false);
      } catch (error) {
        console.error("[Pixeldokulogs] Error loading game:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [difficulty]
  );

  const goHome = async () => {
    stopMusic();
    await resetProgress();
    navigation.navigate("Home");
  };

  useEffect(() => {
    const { theme, difficulty, isNewGame } = route.params;
    setTheme(theme);
    setDifficulty(difficulty);

    if (isNewGame) {
      console.log("[Pixeldokulogs] Starting new game...");
      startNewGame(theme, difficulty);
    } else {
      console.log("[Pixeldokulogs] Continuing saved game...");
      setIsLoading(false);
    }

    playThemeMusic(theme);
  }, [route.params]);

  if (isLoading || !theme.bgSource) {
    return <LoadingIndicator />;
  }

  return (
    <TouchableWithoutFeedback onPress={() => setSelectedCell(null)}>
      {isLoading || !theme.bgSource ? (
        <LoadingIndicator />
      ) : (
        <ImageBackground
          source={theme?.bgSource}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.container}>
            <TopBar />
            {openPlayOverlay && (
              <PlayOverlay
                onPress={() => {
                  setIsPaused(false);
                  setOpenPlayOverlay(false);
                }}
              />
            )}
            <Board />
            <ActionButtons
              onPause={() => {
                setIsPaused(true);
                setOpenPlayOverlay(true);
              }}
            />
            <InputButtons />
            <CompletionModal
              setIsModalVisible={setIsModalVisible}
              isModalVisible={isModalVisible}
              goHome={goHome}
              onNextPuzzle={() => startNewGame(theme, difficulty)}
              onRetry={async () => await resetProgress(theme, difficulty, true)}
            />
          </View>
        </ImageBackground>
      )}
    </TouchableWithoutFeedback>
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
    marginTop: 20,
  },
});

export default SudokuScreen;
