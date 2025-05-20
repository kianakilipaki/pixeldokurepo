import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import gameStyles from "../../utils/gameStyles";
import { useGame } from "../../utils/gameContext";

const PopupCell = ({ cell }) => {
  const { theme } = useGame();

  const [row, col, value] = cell;
  const sprite = Array.isArray(value) ? value : [value];

  // Board and popup dimensions
  const boardSize = gameStyles.cellSize * 9;
  const popupSize = gameStyles.cellSize * 3.4;

  // Calculate initial position
  let top = row * gameStyles.cellSize;
  let left = col * gameStyles.cellSize;

  // Adjust if popup would overflow the board
  if (top + popupSize > boardSize) {
    top = boardSize - popupSize;
  }
  if (left + popupSize > boardSize) {
    left = boardSize - popupSize;
  }
  // Prevent negative positions
  top = Math.max(0, top);
  left = Math.max(0, left);

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
