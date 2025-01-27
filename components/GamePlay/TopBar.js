import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Timer from "./Timer";
import { useGame } from "../../utils/gameContext";
import themeStyles from "../../utils/themeStyles";
import { isTablet } from "../../utils/assetsMap";

const TopBar = ({ isPaused }) => {
  const { difficulty, retryCounter } = useGame();

  return (
    <View style={styles.topBar}>
      {/* Retry Counter */}
      <View style={styles.retryContainer}>
        {Array.from({ length: retryCounter }, (_, i) => (
          <Image
            source={require("../../assets/icons/heart.png")}
            key={i}
            style={[themeStyles.icons.iconSizeMedium, { marginRight: 4 }]}
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
    margin: isTablet ? 10 : 0,
  },
  retryContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  timerContainer: {
    alignItems: "flex-end",
  },
  difficultyText: {
    fontFamily: "Silkscreen-Regular",
    fontSize: themeStyles.fonts.largeFontSize,
    color: themeStyles.colors.black1,
    marginTop: 3,
  },
});

export default TopBar;
