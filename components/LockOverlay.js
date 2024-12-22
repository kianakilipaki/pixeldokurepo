import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

const LockOverlay = ({ onPress }) => {
  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.playButton} onPress={onPress}>
        <Image
          source={require("../assets/lock.png")}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  playButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LockOverlay;
