import React from "react";
import { View, StyleSheet, Image } from "react-native";
import gameStyles from "../utils/gameStyles";

export default function LoadingIndicator() {
  return (
    <View style={styles.container} testID="loading-indicator">
      <Image source={require("../assets/fox_running.gif")} style={styles.gif} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: gameStyles.colors.white,
  },
  gif: {
    width: 192, // Adjust size as needed
    height: 128,
  },
});
