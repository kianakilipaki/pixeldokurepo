import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { spriteMap } from '../utils/spriteMap';

const Cell = ({ theme, currentCell, selectedCell, isEditable, onSelect, style }) => {
  const isCellSelected = () => {
    if (!selectedCell) return false;
    return currentCell[0] === selectedCell[0] && currentCell[1] === selectedCell[1];
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

    return sameRow || sameCol || sameSection;
  };

  return (
    <View
      style={[
        styles.cellContainer,
        style,
        isCellHinted() && styles.hintedCell,
        isCellSelected() && styles.selectedCell,
        isCellSame() && styles.highlightedCell,
        !isEditable && styles.notEditable,
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
    width: 38, // Cell size
    height: 38,
    backgroundColor: 'var(--bgcolor1)',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spriteImage: {
    position: 'absolute',
    width: 105,
    height: 105,
  },
  hintedCell: {
    backgroundColor: 'var(--highlight2)',
  },
  selectedCell: {
    backgroundColor: 'var(--highlight1)',
  },
  highlightedCell: {
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: 'var(--blue)',
  },
  notEditable: {
    backgroundColor: 'var(--bgcolor2)',
  },
});


export default Cell;
