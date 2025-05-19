import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Timer from "./Timer";
import { useGame } from "../../utils/gameContext";
import gameStyles from "../../utils/gameStyles";
import { isTablet } from "../../utils/gameStyles";

const TopBar = ({ isPaused }) => {
  const { difficulty, mistakeCounter } = useGame();

  return (
    <View style={styles.topBar}>
      {/* Retry Counter */}
      <View style={styles.retryContainer}>
        {Array.from({ length: mistakeCounter }, (_, i) => (
          <Image
            source={require("../../assets/icons/heart.png")}
            key={i}
            style={[gameStyles.icons.iconSizeMedium, { marginRight: 4 }]}
          />
        ))}
      </View>
      {difficulty && <Text style={styles.difficultyText}>{difficulty}</Text>}
      {/* Timer */}
      <View style={styles.timerContainer}>
        <Timer isPaused={isPaused} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    width: gameStyles.cellSize * 1.3 * 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: gameStyles.colors.gray1,
    padding: 5,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: gameStyles.colors.black1,
  },
  retryContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexShrink: 0, // Prevent shrinking when other elements change
    width: 80, // Set a fixed width to avoid movement
  },
  difficultyText: {
    fontFamily: gameStyles.fonts.fontFamily,
    fontSize: gameStyles.fonts.largeFontSize,
    color: gameStyles.colors.black1,
    textAlign: "center",
    flexShrink: 0, // Prevent resizing
    width: 100, // Set a fixed width so it doesn't move
  },
  timerContainer: {
    alignItems: "flex-end",
    flexShrink: 0, // Prevent resizing
    width: 80, // Set a fixed width
  },
});

export default TopBar;
