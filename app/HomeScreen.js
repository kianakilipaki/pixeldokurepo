import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Animated,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  View,
} from "react-native";
import ThemeListContainer from "../components/ThemesContainer";
import useThemeAnimation from "../utils/animationHook";
import { useGame } from "../utils/gameContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingIndicator from "../components/loadingIcon";
import { useThemes } from "../utils/themeContext";
import themeStyles from "../utils/themeStyles";
import { useTutorial } from "../utils/useTutorial";
import TutorialModal from "../components/TutorialModal";
import Coins from "../components/Coins";

const HomeScreen = ({ navigation }) => {
  const { loadProgress } = useGame();
  const { themes } = useThemes();
  const [savedGame, setSavedGame] = useState(false);
  const { slideAnimation, fadeAnimation, toggleExpansion } =
    useThemeAnimation();
  const { showTutorial, completeTutorial } = useTutorial();

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

  const handleContinue = async () => {
    if (savedGame) {
      const game = await loadProgress();
      navigation.navigate("SudokuScreen", {
        theme: game.theme,
        difficulty: game.difficulty,
        isNewGame: false,
      });
    }
  };

  if (!themes) {
    return (
      <>
        <StatusBar
          barStyle="light-content" // Choose 'dark-content' or 'light-content'
          backgroundColor={themeStyles.colors.blue}
          translucent={false}
        />
        <View style={styles.coinContainer}>
          {/* Coins */}
          <Coins />
        </View>
        <LoadingIndicator />
      </>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/themes/MntForest-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content" // Choose 'dark-content' or 'light-content'
        backgroundColor={themeStyles.colors.blue}
        translucent={false}
      />
      <View style={styles.coinContainer}>
        {/* Coins */}
        <Coins />
      </View>
      {/* Title Page */}
      <Animated.View
        style={[styles.centerContainer, { opacity: fadeAnimation }]}
      >
        <Image source={require("../assets/icon-bg.png")} style={styles.icon} />
        <Text style={styles.header}>Welcome to</Text>
        <Text style={styles.title}>PixelDoku</Text>
        {savedGame && (
          <TouchableOpacity
            style={[styles.button, styles.continueButton]}
            accessibilityLabel={`Continue Previous Game`}
            accessibilityRole="button"
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.newGameButton]}
          accessibilityLabel={`Start New Game`}
          accessibilityRole="button"
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
      <TutorialModal visible={showTutorial} onClose={completeTutorial} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    overflow: "hidden",
    top: 0,
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
    textShadowColor: "#fff",
    textShadowRadius: 3,
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
    minHeight: 48,
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
    fontSize: themeStyles.fonts.headerFontSize,
  },
  coinContainer: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});

export default HomeScreen;
