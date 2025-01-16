import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Animated,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Coins from "../components/Coins";
import ThemeListContainer from "../components/ThemesContainer";
import useThemeAnimation from "../utils/animationHook";
import { useGame } from "../utils/gameContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingIndicator from "../components/loadingIcon";
import { useThemes } from "../utils/themeContext";
import themeStyles from "../utils/themeStyles";

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
      const game = loadProgress();
      navigation.navigate("SudokuScreen", {
        theme: game.theme,
        difficulty: game.difficulty,
        isNewGame: false,
      });
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
      {/* Coins */}
      <Coins />

      {/* Title Page */}
      <Animated.View
        style={[styles.centerContainer, { opacity: fadeAnimation }]}
      >
        <Image source={require("../assets/icon.png")} style={styles.icon} />
        <Text style={styles.header}>Welcome to</Text>
        <Text style={styles.title}>PixelDoku</Text>
        {savedGame && (
          <TouchableOpacity
            style={[styles.button, styles.continueButton]}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.newGameButton]}
          onPress={toggleExpansion}
        >
          <Text style={styles.buttonText}>New Game</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Themes list */}
      <ThemeListContainer
        slideAnimation={slideAnimation}
        toggle={toggleExpansion}
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 200,
    height: 200,
  },
  header: {
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: 36,
    textAlign: "center",
    color: themeStyles.colors.black1,
  },
  title: {
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: 48,
    marginBottom: 20,
    color: themeStyles.colors.red,
    transform: [{ scaleY: 2 }],
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  button: {
    width: "60%",
    paddingVertical: 20,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
    borderCollapse: "collapsed",
  },
  continueButton: {
    backgroundColor: themeStyles.colors.black1,
  },
  newGameButton: {
    backgroundColor: themeStyles.colors.blue,
  },
  buttonText: {
    color: "white",
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: 23,
  },
});

export default HomeScreen;
