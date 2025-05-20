import { View, StyleSheet, Text, Image } from "react-native";
import { useGame } from "../../utils/gameContext";
import gameStyles from "../../utils/gameStyles";
import { formatTime } from "../../utils/generatePuzzle";

const TopBar = () => {
  const { difficulty, mistakeCounter, timer } = useGame();

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
        <Text style={styles.timerText}>{formatTime(timer)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    width: gameStyles.cellSize * 9,
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
    minWidth: 100,
  },
  difficultyText: {
    fontFamily: gameStyles.fonts.fontFamily,
    fontSize: gameStyles.fonts.largeFontSize,
    color: gameStyles.colors.black1,
    textAlign: "center",
    flexShrink: 0, // Prevent resizing
  },
  timerContainer: {
    alignItems: "flex-end",
    flexShrink: 0, // Prevent resizing
    minWidth: 100,
  },
  timerText: {
    fontSize: gameStyles.fonts.largeFontSize,
    fontFamily: gameStyles.fonts.fontFamily,
    color: gameStyles.colors.black1,
  },
});

export default TopBar;
