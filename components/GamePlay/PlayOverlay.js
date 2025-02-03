import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const PlayOverlay = ({ onPress }) => {
  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        accessibilityLabel={`Resume game`}
        accessibilityRole="button"
        style={styles.playButton}
        onPress={onPress}
      >
        <Image
          source={require("../../assets/icons/play.png")}
          style={{ width: width * 0.2, height: width * 0.2 }}
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
    zIndex: 100,
  },
  playButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PlayOverlay;
