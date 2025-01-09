import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Lock from "../assets/icons/lock.svg";

const LockOverlay = ({ onPress }) => {
  return (
    <View style={styles.overlay}>
      <TouchableOpacity onPress={onPress}>
        <Lock width="20px" height="20px" style={styles.lockIcon} />
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
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LockOverlay;
