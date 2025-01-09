import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Timer from "./Timer";
import { useGame } from "../utils/gameContext";
import themeStyles from "../styles/theme";
import Heart from "../assets/icons/heart.svg";

const TopBar = ({ isPaused }) => {
  const { difficulty, retryCounter } = useGame();

  return (
    <View style={styles.topBar}>
      {/* Retry Counter */}
      <View style={styles.retryContainer}>
        {Array.from({ length: retryCounter }, (_, i) => (
          <Heart key={i} width="20px" height="20px" style={styles.heartIcon} />
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
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  retryContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  heartIcon: {
    marginRight: 4,
  },
  timerContainer: {
    alignItems: "flex-end",
  },
  difficultyText: {
    fontFamily: "Silkscreen-Regular",
    fontSize: 20,
    color: themeStyles.colors.forecolor1,
    marginTop: 3,
  },
});

export default TopBar;
