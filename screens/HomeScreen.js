import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import Coins from "../components/Coins";
import TitleAndButtons from "../components/Title";
import ThemeListContainer from "../components/ThemesContainer";
import useThemeAnimation from "../utils/animationHook";
import { useGame } from "../utils/gameContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingIndicator from "../components/loadingIcon";
import { useThemes } from "../utils/themeContext";

const HomeScreen = ({ navigation }) => {
  const { loadProgress } = useGame();
  const { themes } = useThemes();
  const [savedGame, setSavedGame] = useState(false);
  const { slideAnimation, fadeAnimation, toggleExpansion } =
    useThemeAnimation();

  useEffect(() => {
    const checkProgress = async () => {
      try {
        const stringProgress = await AsyncStorage.getItem("gameProgress");
        const progress = JSON.parse(stringProgress);
        if (progress?.difficulty) {
          setSavedGame(true);
        }
      } catch (error) {
        console.error("Failed to load saved game progress:", error);
      }
    };

    checkProgress();
  }, []);

  const handleContinue = () => {
    if (savedGame) {
      loadProgress();
      navigation.navigate("SudokuScreen");
    }
  };

  if (!themes) {
    return <LoadingIndicator />;
  }

  return (
    <ImageBackground
      source={themes["birds"].bgSource}
      style={styles.background}
      resizeMode="cover"
    >
      <Coins />
      <TitleAndButtons
        fadeAnimation={fadeAnimation}
        savedGame={savedGame}
        onContinue={handleContinue}
        onToggleExpansion={toggleExpansion}
      />
      <ThemeListContainer
        slideAnimation={slideAnimation}
        navigation={navigation}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    overflow: "hidden",
    top: 1,
    width: "100%",
    height: "100%",
  },
});

export default HomeScreen;
