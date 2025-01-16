import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { spriteMap } from "../../utils/assetsMap";
import themeStyles from "../../utils/themeStyles";

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
    if (selectedCell[0] === null && selectedCell[1] === null) return false;
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
    if (selectedCell[0] === null && selectedCell[1] === null) return false;

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
        !isEditable && styles.notEditable,
        isCellHinted(),
        isCellSelected() && styles.selectedCell,
      ]}
    >
      <View
        style={[styles.innerContainer, isCellSame() && styles.highlightedCell]}
        onStartShouldSetResponder={onSelect}
      >
        {currentCell[2] !== 0 && (
          <Image
            source={theme.source}
            style={[styles.spriteImage, spriteMap[currentCell[2]]]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    width: width * 0.1,
    height: width * 0.1,
    backgroundColor: themeStyles.colors.gray1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    zIndex: 100,
    width: width * 0.1 - 2,
    height: width * 0.1 - 2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "transparent", // Default to no border
    overflow: "hidden",
    position: "relative",
  },
  spriteImage: {
    aspectRatio: 1,
    position: "absolute",
    width: width * 0.255,
    height: width * 0.255,
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
    borderColor: themeStyles.colors.red,
  },
  notEditable: {
    backgroundColor: themeStyles.colors.gray2,
  },
});

export default Cell;
