import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import themeStyles from "../utils/themeStyles";

const LockOverlay = ({ onPress }) => {
  return (
    <View style={styles.overlay}>
      <TouchableOpacity onPress={onPress}>
        <Image
          source={require("../assets/icons/lock.png")}
          style={themeStyles.icons.iconSizeMedium}
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
});

export default LockOverlay;
