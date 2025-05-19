import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Animated,
} from "react-native";
import LockOverlay from "./LockOverlay";
import PurchaseModal from "./PurchaseModal";
import gameStyles from "../utils/gameStyles";
import { Dimensions } from "react-native";
import { formatTime } from "../utils/generatePuzzle";
import { usePlayerData } from "../utils/playerDataContext";

const { width } = Dimensions.get("window");

const ThemeList = ({ theme, expandedTheme, toggleTheme, navigation }) => {
  const { highscores } = usePlayerData();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const Scores = highscores
    ? highscores[theme.themeKey] || { Easy: 0, Medium: 0, Hard: 0 }
    : { Easy: 0, Medium: 0, Hard: 0 };

  const openModal = () => {
    if (theme.title === "Coming Soon") return;
    setIsModalVisible(true);
  };

  const navigateToSudoku = (difficulty) => {
    navigation.navigate("Sudoku", {
      theme: theme,
      difficulty,
      isNewGame: true,
    });
  };

  const isExpanded = expandedTheme === theme.themeKey;

  return (
    <View style={styles.themeContainer}>
      <ImageBackground
        key={`bg-${theme.themeKey}`}
        source={theme.bgSource}
        style={styles.themeBackground}
        resizeMode="cover"
      >
        {theme.locked && <LockOverlay onPress={openModal} />}
        <TouchableOpacity
          accessibilityLabel={`Choose ${theme.title} theme`}
          accessibilityRole="button"
          key={`header-${theme.themeKey}`}
          onPress={() => toggleTheme(theme.themeKey)} // Call toggleTheme on press
          style={styles.themeHeader}
        >
          {theme && (
            <View style={styles.thumbnail}>
              <Image source={theme.icons[0]} style={[styles.spriteImage]} />
            </View>
          )}
          <Text style={styles.themeTitle}>{theme.title}</Text>
          {theme && (
            <View style={styles.thumbnail}>
              <Image source={theme.icons[1]} style={[styles.spriteImage]} />
            </View>
          )}
        </TouchableOpacity>

        {!theme.locked && isExpanded && (
          <Animated.View style={styles.difficultyContainer}>
            {["Easy", "Medium", "Hard"].map((difficulty) => {
              const time = Scores[difficulty] || 0;
              return (
                <View key={difficulty}>
                  <TouchableOpacity
                    accessibilityLabel={`Difficulty: ${difficulty} Best Time: ${formatTime(
                      time
                    )}`}
                    accessibilityRole="button"
                    style={styles.difficultyButton}
                    onPress={() => navigateToSudoku(difficulty)}
                  >
                    <Text style={styles.difficultyText}>{difficulty}</Text>
                    <Text style={styles.ScoresText}>
                      Best time {formatTime(time)}
                    </Text>
                  </TouchableOpacity>
                  {difficulty !== "Hard" && <View style={styles.divider} />}
                </View>
              );
            })}
          </Animated.View>
        )}

        <PurchaseModal
          theme={theme}
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  themeContainer: {
    width: "100%",
    width: width,
    minHeight: 120,
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: gameStyles.colors.black1,
  },
  themeBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  themeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: gameStyles.colors.gray1,
  },
  thumbnail: {
    width: gameStyles.cellSize * 1.5,
    height: gameStyles.cellSize * 1.5,
    padding: 10,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  spriteImage: {
    position: "absolute",
    width: gameStyles.cellSize * 1.5,
    height: gameStyles.cellSize * 1.5,
    opacity: 1, // Default opacity
  },
  themeTitle: {
    fontFamily: gameStyles.fonts.fontFamily,
    fontSize: gameStyles.fonts.largeFontSize,
    color: "#000", // White text on buttons
  },
  difficultyContainer: {
    width: width * 0.8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: gameStyles.colors.gray1,
    overflow: "hidden", // Prevent overflow
  },
  difficultyButton: {
    padding: 10,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  difficultyText: {
    textAlign: "left",
    color: gameStyles.colors.black1,
    fontFamily: gameStyles.fonts.fontFamily,
    fontSize: gameStyles.fonts.regularFontSize,
  },
  ScoresText: {
    textAlign: "right",
    color: gameStyles.colors.black1,
    fontSize: gameStyles.fonts.regularFontSize,
    fontWeight: "normal",
  },
  divider: {
    height: 1,
    backgroundColor: gameStyles.colors.black1,
    marginVertical: 5,
  },
});

export default ThemeList;
