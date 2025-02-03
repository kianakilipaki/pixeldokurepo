import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { spriteMap, cellSize } from "../../utils/assetsMap";
import themeStyles from "../../utils/themeStyles";

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
        accessibilityLabel={`${theme.themeKey}${currentCell[2]}`}
        accessibilityRole="button"
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
    width: cellSize * 1.2,
    height: cellSize * 1.2,
    backgroundColor: themeStyles.colors.gray1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    zIndex: 100,
    width: cellSize * 1.2,
    height: cellSize * 1.2,
    borderTopWidth: width * 0.01,
    borderLeftWidth: width * 0.01,
    borderBottomWidth: width * 0.01,
    borderRightWidth: width * 0.01,
    borderColor: "transparent", // Default to no border
    overflow: "hidden",
    position: "relative",
  },
  spriteImage: {
    aspectRatio: 1,
    position: "absolute",
    width: cellSize * 3,
    height: cellSize * 3,
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
