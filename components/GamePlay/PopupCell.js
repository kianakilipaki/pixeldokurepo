import React from "react";
import { View, Image, StyleSheet } from "react-native";
import gameStyles from "../../utils/gameStyles";
import { useGame } from "../../utils/gameContext";

const PopupCell = ({ cell, position }) => {
  const { theme } = useGame();

  const [row, col, value] = cell;
  const sprite = Array.isArray(value) ? value : [value];

  const top = row * gameStyles.cellSize;
  const left = col * gameStyles.cellSize;

  return (
    <View style={[styles.popupCell, { top, left }]}>
      {sprite.map((val, i) => (
        <Image
          key={i}
          source={theme.icons[val - 1]}
          style={styles.popupImage}
          resizeMode="contain"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  popupCell: {
    position: "absolute",
    width: gameStyles.cellSize * 3.4,
    height: gameStyles.cellSize * 3.4,
    backgroundColor: gameStyles.colors.white,
    zIndex: 100,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: gameStyles.colors.blue,
  },
  popupImage: {
    width: gameStyles.cellSize,
    height: gameStyles.cellSize,
  },
});

export default PopupCell;
