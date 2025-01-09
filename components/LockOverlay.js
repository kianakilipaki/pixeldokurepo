import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

const LockOverlay = ({ onPress }) => {
  return (
    <View style={styles.overlay}>
      <TouchableOpacity onPress={onPress}>
        <Image
          source={require("../assets/icons/lock.png")}
          style={styles.lockIcon}
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
  lockIcon: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LockOverlay;
