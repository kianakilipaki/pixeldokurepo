import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { spriteMap } from "../utils/assetsMap";
import themeStyles from "../utils/themeStyles";

import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const Cell = ({
  theme,
  currentCell,
  selectedCell,
  isEditable,
  onSelect,
  style,
}) => {
  const isCellSelected = () => {
    if (!selectedCell) return false;
    return (
      currentCell[0] === selectedCell[0] && currentCell[1] === selectedCell[1]
    );
  };

  const isCellSame = () => {
    if (!selectedCell) return false;
    if (selectedCell[2] === 0) return false;
    return currentCell[2] === selectedCell[2];
  };

  const isCellHinted = () => {
    if (!selectedCell) return false;

    const [rowIndex, colIndex] = currentCell;
    const [selectedRow, selectedCol] = selectedCell;
    const sameRow = rowIndex === selectedRow;
    const sameCol = colIndex === selectedCol;

    // Check if cell is in the same 3x3 section as the selected cell
    const sectionRowStart = Math.floor(selectedRow / 3) * 3;
    const sectionColStart = Math.floor(selectedCol / 3) * 3;
    const sameSection =
      rowIndex >= sectionRowStart &&
      rowIndex < sectionRowStart + 3 &&
      colIndex >= sectionColStart &&
      colIndex < sectionColStart + 3;

    const same = sameRow || sameCol || sameSection;
    return same && !isEditable
      ? styles.hintedCell2
      : same && isEditable
      ? styles.hintedCell
      : null;
  };

  return (
    <View
      style={[
        styles.cellContainer,
        style,
        isCellSame() && styles.highlightedCell,
        !isEditable && styles.notEditable,
        isCellHinted(),
        isCellSelected() && styles.selectedCell,
      ]}
      onStartShouldSetResponder={onSelect}
    >
      {currentCell[2] !== 0 && (
        <Image
          source={theme.source}
          style={[styles.spriteImage, spriteMap[currentCell[2]]]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    width: width * 0.105,
    height: width * 0.105,
    backgroundColor: themeStyles.colors.bgcolor1,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  spriteImage: {
    aspectRatio: 1,
    position: "absolute",
    width: width * 0.3,
    height: width * 0.3,
  },
  hintedCell: {
    backgroundColor: themeStyles.colors.highlight2,
  },
  hintedCell2: {
    backgroundColor: themeStyles.colors.highlight3,
  },
  selectedCell: {
    backgroundColor: themeStyles.colors.highlight1,
  },
  highlightedCell: {
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: themeStyles.colors.red,
  },
  notEditable: {
    backgroundColor: themeStyles.colors.bgcolor2,
  },
});

export default Cell;
