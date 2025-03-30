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
import {
  spriteMap,
  cellSize,
  miniSpriteMap,
  miniCellSize,
} from "../../utils/assetsMap";
import themeStyles from "../../utils/themeStyles";
import { useGame } from "../../utils/gameContext";
import useMistakeAnimation from "../../utils/mistakeAnimationHook";

const { width } = Dimensions.get("window");

const Cell = ({
  currentCell,
  isEditable,
  onSelect,
  style,
  onHold,
  heldCell,
}) => {
  const { theme, selectedCell, errorCell } = useGame();

  const cellValue = currentCell[2];
  const cellRow = currentCell[0];
  const cellCol = currentCell[1];

  // State checks
  const isHeld =
    selectedCell &&
    heldCell &&
    heldCell[0] === cellRow &&
    heldCell[1] === cellCol;

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
        cellValue && isHeld && styles.enlargedCell,
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
          cellValue &&
            (Array.isArray(cellValue)
              ? isHeld && styles.enlargedInnerContainer
              : isHeld && styles.single),
        ]}
        onStartShouldSetResponder={onSelect}
      >
        {Array.isArray(cellValue) ? (
          cellValue.map((arrayValue, index) => (
            <Fragment key={index}>
              <View style={styles.miniInnerContainer}>
                {!isHeld && cellValue.length > 4 && index === 3 ? (
                  <Text style={styles.plus}>+</Text>
                ) : (
                  <Image
                    source={theme.source}
                    style={[styles.miniSpriteImage, miniSpriteMap[arrayValue]]}
                  />
                )}
              </View>
            </Fragment>
          ))
        ) : cellValue !== 0 ? (
          <Image
            source={theme.source}
            style={[styles.spriteImage, spriteMap[cellValue]]}
          />
        ) : null}
      </Animated.View>
    </Pressable>
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
    width: cellSize * 1.2 - 2,
    height: cellSize * 1.2 - 2,
    borderTopWidth: width * 0.007,
    borderLeftWidth: width * 0.007,
    borderBottomWidth: width * 0.007,
    borderRightWidth: width * 0.007,
    borderColor: "transparent",
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
    position: "relative",
  },
  spriteImage: {
    aspectRatio: 1,
    position: "absolute",
    width: cellSize * 3,
    height: cellSize * 3,
  },
  miniInnerContainer: {
    width: miniCellSize,
    height: miniCellSize,
    overflow: "hidden",
  },
  miniSpriteImage: {
    aspectRatio: 1,
    position: "absolute",
    width: miniCellSize * 3,
    height: miniCellSize * 3,
  },
  plus: {
    fontSize: themeStyles.fonts.regularFontSize,
    position: "absolute",
    top: -3,
    right: 3,
  },
  hintedCell: { backgroundColor: themeStyles.colors.highlight2 },
  hintedCell2: { backgroundColor: themeStyles.colors.highlight3 },
  selectedCell: { backgroundColor: themeStyles.colors.highlight1 },
  highlightedCell: { borderColor: themeStyles.colors.blue },
  notEditable: { backgroundColor: themeStyles.colors.gray2 },
  enlargedCell: { transform: [{ scale: 2 }], zIndex: 200 },
  enlargedInnerContainer: {
    transform: [{ scale: 1.3 }],
    backgroundColor: themeStyles.colors.white,
    width: cellSize * 1.6,
    height: cellSize * 1.6,
  },
  single: {
    transform: [{ scale: 1.3 }],
    backgroundColor: themeStyles.colors.white,
  },
});

export default Cell;
