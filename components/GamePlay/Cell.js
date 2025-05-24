import React, { Fragment } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  Animated,
} from "react-native";
import gameStyles, { isTablet } from "../../utils/gameStyles";
import { useGame } from "../../utils/gameContext";
import useMistakeAnimation from "../../utils/mistakeAnimationHook";

const Cell = ({ currentCell, isEditable, onSelect, gridLines, onHold }) => {
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
        !isEditable && styles.notEditable,
        isCellHinted(),
        isCellSelected && styles.selectedCell,
        gridLines,
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
          <View style={styles.miniFlexContainer}>
            {cellValue.slice(0, 4).map((arrayValue, index) => (
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
            ))}
          </View>
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
    backgroundColor: gameStyles.colors.gray1,
    width: gameStyles.cellSize,
    height: gameStyles.cellSize,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  innerContainer: {
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "transparent",
    width: gameStyles.cellSize - 1,
    height: gameStyles.cellSize - 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  spriteImage: {
    width: gameStyles.spriteSize,
    height: gameStyles.spriteSize,
    aspectRatio: 1,
  },
  miniFlexContainer: {
    width: gameStyles.spriteSize,
    height: gameStyles.spriteSize,
    padding: isTablet ? 2 : 0,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  miniInnerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: isTablet ? gameStyles.miniCellSize - 3 : gameStyles.miniCellSize,
    height: isTablet ? gameStyles.miniCellSize - 3 : gameStyles.miniCellSize,
  },
  miniSpriteImage: {
    aspectRatio: 1,
    width: gameStyles.miniCellSize,
    height: gameStyles.miniCellSize,
  },
  plus: {
    lineHeight: isTablet
      ? gameStyles.fonts.largeFontSize
      : gameStyles.fonts.regularFontSize,
    fontSize: isTablet
      ? gameStyles.fonts.largeFontSize
      : gameStyles.fonts.regularFontSize,
    textAlign: "center",
  },
  hintedCell: { backgroundColor: gameStyles.colors.highlight2 },
  hintedCell2: { backgroundColor: gameStyles.colors.highlight3 },
  selectedCell: { backgroundColor: gameStyles.colors.highlight1 },
  notEditable: { backgroundColor: gameStyles.colors.gray2 },
  highlightedCell: { borderColor: gameStyles.colors.blue },
});

export default Cell;
