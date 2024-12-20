import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { spriteMapLG } from "../utils/spriteMap";
import { useGame } from "../utils/gameContext";

const InputButtons = ({ onPress }) => {
  const { theme } = useGame();
  return (
    <View style={styles.birdButtons}>
      {Object.entries(spriteMapLG).map(([value, position]) => (
        <TouchableOpacity
          key={value}
          style={styles.cellContainer}
          onPress={() => {
            onPress(parseInt(value, 10));
          }}
        >
          <Image source={theme.source} style={[styles.spriteImage, position]} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  birdButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 20,
  },
  cellContainer: {
    width: 50,
    height: 50,
    padding: 10,
    margin: 5,
    border: "1px solid var(--forecolor1)",
    borderRadius: 10,
    backgroundColor: "var(--bgcolor1)",
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  spriteImage: {
    position: "absolute",
    width: 144,
    height: 144,
  },
});

export default InputButtons;
