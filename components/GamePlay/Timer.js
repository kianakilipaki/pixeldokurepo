import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, View } from "react-native";
import { useGame } from "../../utils/gameContext";
import themeStyles from "../../utils/themeStyles";
import { formatTime } from "../../utils/generatePuzzle";

const Timer = ({ isPaused }) => {
  const { timer, setTimer } = useGame();

  const intervalRef = useRef(null); // To store the interval ID

  useEffect(() => {
    if (!isPaused) {
      // Start the timer
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      // Clear the timer when paused
      clearInterval(intervalRef.current);
    }

    // Cleanup on component unmount or dependency change
    return () => clearInterval(intervalRef.current);
  }, [isPaused, setTimer]);

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{formatTime(timer)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    alignItems: "center",
  },
  timerText: {
    fontSize: themeStyles.fonts.largeFontSize,
    fontFamily: themeStyles.fonts.fontFamily,
    color: themeStyles.colors.black1,
  },
});

export default Timer;
