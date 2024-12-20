import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import {
  useFonts,
  Silkscreen_400Regular,
  Silkscreen_700Bold,
} from "@expo-google-fonts/silkscreen";
import Coins from "../components/Coins";
import TitleAndButtons from "../components/Title";
import ThemeListContainer from "../components/ThemesContainer";
import useThemeAnimation from "../utils/animationHook";
import { useGame } from "../utils/gameContext";
import { themes } from "../utils/helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingIndicator from "../components/loadingIcon";

const HomeScreen = ({ navigation }) => {
  const { loadProgress } = useGame();

  const [fontsLoaded] = useFonts({
    Silkscreen_400Regular,
    Silkscreen_700Bold,
  });

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

  if (!fontsLoaded) {
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
    width: "100vw",
    height: "100vh",
  },
});

export default HomeScreen;
