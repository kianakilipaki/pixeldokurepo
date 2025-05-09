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
import { spriteMapLG, cellSizeLG } from "../utils/assetsMap";
import LockOverlay from "./LockOverlay";
import PurchaseModal from "./PurchaseModal";
import themeStyles from "../utils/themeStyles";
import { Dimensions } from "react-native";
import { formatTime } from "../utils/generatePuzzle";
import { usePlayerData } from "../utils/playerDataContext";

const { width } = Dimensions.get("window");

const ThemeList = ({
  item,
  themeKey,
  expandedTheme,
  toggleTheme,
  navigation,
}) => {
  const { highscores } = usePlayerData();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const Scores = highscores
    ? highscores[themeKey] || { Easy: 0, Medium: 0, Hard: 0 }
    : { Easy: 0, Medium: 0, Hard: 0 };

  const openModal = () => {
    if (item.title === "Coming Soon") return;
    setIsModalVisible(true);
  };

  const navigateToSudoku = (difficulty) => {
    navigation.navigate("Sudoku", {
      theme: item,
      difficulty,
      isNewGame: true,
    });
  };

  const isExpanded = expandedTheme === themeKey;

  return (
    <View style={styles.themeContainer}>
      <ImageBackground
        key={`bg-${themeKey}`}
        source={item.bgSource}
        style={styles.themeBackground}
        resizeMode="cover"
      >
        {item.locked && <LockOverlay onPress={openModal} />}
        <TouchableOpacity
          accessibilityLabel={`Choose ${item.title} theme`}
          accessibilityRole="button"
          key={`header-${themeKey}`}
          onPress={() => toggleTheme(themeKey)} // Call toggleTheme on press
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
    color: themeStyles.colors.black1,
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: themeStyles.fonts.regularFontSize,
  },
  ScoresText: {
    textAlign: "right",
    color: themeStyles.colors.black1,
    fontSize: themeStyles.fonts.regularFontSize,
    fontWeight: "normal",
  },
  divider: {
    height: 1,
    backgroundColor: themeStyles.colors.black1,
    marginVertical: 5,
  },
});

export default ThemeList;
