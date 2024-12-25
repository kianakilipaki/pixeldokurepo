import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Timer from "./Timer";
import { useGame } from "../utils/gameContext";
import theme from "../styles/theme";

const TopBar = ({ isPaused }) => {
  const { difficulty, retryCounter } = useGame();

  return (
    <View style={styles.topBar}>
      {/* Retry Counter */}
      <View style={styles.retryContainer}>
        {Array.from({ length: retryCounter }, (_, i) => (
          <Image
            key={i}
            source={require("../assets/heart.png")}
            style={styles.heartIcon}
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
    margin: 4,
    width: 24,
    height: 24,
  },
  timerContainer: {
    marginLeft: 20,
    alignItems: "flex-end",
  },
  difficultyText: {
    fontFamily: "Silkscreen-Regular",
    fontSize: 18,
    color: theme.colors.forecolor1,
    marginTop: 3,
  },
});

export default TopBar;
