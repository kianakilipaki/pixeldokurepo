import React, { Fragment } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  Pressable,
  Animated,
} from "react-native";
import gameStyles from "../../utils/gameStyles";
import { useGame } from "../../utils/gameContext";
import useMistakeAnimation from "../../utils/mistakeAnimationHook";
const { width } = Dimensions.get("window");

const Cell = ({ currentCell, isEditable, onSelect, style, onHold }) => {
  const { theme, selectedCell, errorCell } = useGame();

  const cellValue = currentCell[2];
  const cellRow = currentCell[0];
  const cellCol = currentCell[1];

  const isErrorCell =
    errorCell?.some(([row, col]) => row === cellRow && col === cellCol) ??
    false;

  const mistakeAnimation = useMistakeAnimation(isErrorCell);

  const isCellSelected =
    selectedCell &&
    selectedCell[0] === cellRow &&
    selectedCell[1] === cellCol &&
    !(selectedCell[0] === null);

  const isCellSame =
    selectedCell && selectedCell[2] !== 0 && selectedCell[2] === cellValue;

  const isCellHinted = () => {
    if (!selectedCell || selectedCell[0] === null) return null;
    const [selectedRow, selectedCol] = selectedCell;
    const sameRow = cellRow === selectedRow;
    const sameCol = cellCol === selectedCol;
    const sectionRowStart = Math.floor(selectedRow / 3) * 3;
    const sectionColStart = Math.floor(selectedCol / 3) * 3;
    const sameSection =
      cellRow >= sectionRowStart &&
      cellRow < sectionRowStart + 3 &&
      cellCol >= sectionColStart &&
      cellCol < sectionColStart + 3;

    return sameRow || sameCol || sameSection
      ? isEditable
        ? styles.hintedCell
        : styles.hintedCell2
      : null;
  };

  return (
    <Pressable
      style={[
        styles.cellContainer,
        style,
        !isEditable && styles.notEditable,
        isCellHinted(),
        isCellSelected && styles.selectedCell,
      ]}
      onLongPress={onHold}
    >
      <Animated.View
        accessibilityLabel={`${theme.themeKey}${cellValue}`}
        accessibilityRole="button"
        style={[
          isErrorCell && mistakeAnimation,
          styles.innerContainer,
          isCellSame && styles.highlightedCell,
        ]}
        onStartShouldSetResponder={onSelect}
      >
        {Array.isArray(cellValue) ? (
          cellValue.slice(0, 4).map((arrayValue, index) => (
            <View key={index} style={styles.miniInnerContainer}>
              {cellValue.length > 4 && index === 3 ? (
                <Text style={styles.plus}>+</Text>
              ) : (
                <Image
                  source={theme.icons[arrayValue - 1]}
                  style={styles.miniSpriteImage}
                  resizeMode="contain"
                />
              )}
            </View>
          ))
        ) : cellValue !== 0 ? (
          <Image
            source={theme.icons[cellValue - 1]}
            style={styles.spriteImage}
            resizeMode="contain"
          />
        ) : null}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    width: gameStyles.cellSize * 1.3,
    height: gameStyles.cellSize * 1.3,
    backgroundColor: gameStyles.colors.gray1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: gameStyles.cellSize * 1.3,
    height: gameStyles.cellSize * 1.3,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "transparent",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  spriteImage: {
    aspectRatio: 1,
    width: gameStyles.cellSize,
    height: gameStyles.cellSize,
  },
  miniInnerContainer: {
    width: gameStyles.miniCellSize,
    height: gameStyles.miniCellSize,
  },
  miniSpriteImage: {
    aspectRatio: 1,
    width: gameStyles.miniCellSize,
    height: gameStyles.miniCellSize,
  },
  plus: {
    fontSize: gameStyles.fonts.regularFontSize,
    position: "absolute",
    top: -3,
    right: 3,
  },
  enlargedCell: {
    backgroundColor: gameStyles.colors.white,
    position: "absolute",
    width: gameStyles.cellSize * 2.4,
    height: gameStyles.cellSize * 2.4,
    top: -gameStyles.cellSize * 0.6,
    left: -gameStyles.cellSize * 0.6,
    zIndex: 10,
    borderWidth: 2,
    borderColor: gameStyles.colors.blue,
  },
  hintedCell: { backgroundColor: gameStyles.colors.highlight2 },
  hintedCell2: { backgroundColor: gameStyles.colors.highlight3 },
  selectedCell: { backgroundColor: gameStyles.colors.highlight1 },
  notEditable: { backgroundColor: gameStyles.colors.gray2 },
  highlightedCell: { borderColor: gameStyles.colors.blue },
});

export default Cell;
