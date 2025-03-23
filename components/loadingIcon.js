import React from "react";
import { View, StyleSheet, Image } from "react-native";

export default function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/fox_running.gif")} style={styles.gif} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  gif: {
    width: 100, // Adjust size as needed
    height: 70,
  },
});
