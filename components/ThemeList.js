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
import { useHighScore } from "../utils/highscoreContext";
import { spriteMapLG, cellSizeLG } from "../utils/assetsMap";
import LockOverlay from "./LockOverlay";
import PurchaseModal from "./PurchaseModal";
import themeStyles from "../utils/themeStyles";
import { Dimensions } from "react-native";
import { formatTime } from "../utils/GeneratePuzzle";

const { width } = Dimensions.get("window");

const ThemeList = ({ item, themeKey, navigation }) => {
  const [expandedTheme, setExpandedTheme] = useState(null);
  const { HighScore } = useHighScore();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleTheme = (key) => {
    setExpandedTheme(expandedTheme === key ? null : key);
  };

  const isExpanded = expandedTheme === themeKey;
  const Scores = HighScore[themeKey] || { Easy: 0, Medium: 0, Hard: 0 };

  const openModal = () => {
    if (item.title == "Coming Soon") return;
    setIsModalVisible(true);
  };

  const navigateToSudoku = (difficulty) => {
    navigation.navigate("SudokuScreen", {
      theme: item,
      difficulty,
      isNewGame: true,
    });
  };

  return (
    <View style={styles.themeContainer}>
      <ImageBackground
        key={`bg-${themeKey}`} // Force re-render
        source={item.bgSource}
        style={styles.themeBackground}
        resizeMode="cover"
      >
        {item.locked && <LockOverlay onPress={openModal} />}
        <TouchableOpacity
          accessibilityLabel={`Choose ${item.title} theme`}
          accessibilityRole="button"
          key={`header-${themeKey}`} // Unique key
          onPress={() => toggleTheme(themeKey)}
          style={styles.themeHeader}
        >
          {item.source && (
            <View style={styles.thumbnail}>
              <Image
                source={item.source}
                style={[styles.spriteImage, spriteMapLG[1]]}
              />
            </View>
          )}
          <Text style={styles.themeTitle}>{item.title}</Text>
          {item.source && (
            <View style={styles.thumbnail}>
              <Image
                source={item.source}
                style={[styles.spriteImage, spriteMapLG[2]]}
              />
            </View>
          )}
        </TouchableOpacity>

        {!item.locked && isExpanded && (
          <Animated.View style={styles.difficultyContainer}>
            {Object.entries(Scores).map(([difficulty, time]) => (
              <View key={difficulty}>
                <TouchableOpacity
                  accessibilityLabel={`Difficulty: ${difficulty} Best Time: ${formatTime(
                    time
                  )}`}
                  accessibilityRole="button"
                  style={styles.difficultyButton}
                  onPress={() => navigateToSudoku(difficulty)}
                >
                  <Text style={styles.difficultyText}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Text>
                  <Text style={styles.ScoresText}>
                    Best time {formatTime(time)}
                  </Text>
                </TouchableOpacity>
                {difficulty !== "Hard" && <View style={styles.divider} />}
              </View>
            ))}
          </Animated.View>
        )}

        <PurchaseModal
          theme={item}
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
    borderColor: themeStyles.colors.black1,
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
    backgroundColor: themeStyles.colors.gray1,
  },
  thumbnail: {
    width: cellSizeLG,
    height: cellSizeLG,
    padding: 10,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  spriteImage: {
    position: "absolute",
    width: cellSizeLG * 3,
    height: cellSizeLG * 3,
    opacity: 1, // Default opacity
  },
  themeTitle: {
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: themeStyles.fonts.largeFontSize,
    color: "#000", // White text on buttons
  },
  difficultyContainer: {
    width: width * 0.8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: themeStyles.colors.gray1,
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
    color: "#333",
    fontWeight: "bold",
    fontSize: themeStyles.fonts.regularFontSize,
  },
  ScoresText: {
    textAlign: "right",
    color: "#333",
    fontSize: themeStyles.fonts.regularFontSize,
    fontWeight: "normal",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 5,
  },
});

export default ThemeList;
