import React from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './Cell';

const Board = ({ board, initialBoard, onCellValueChange, selectedCell, onCellSelect }) => {
  const getCellHighlight = (rowIndex, colIndex) => {
    if (!selectedCell) return false;
    const [selectedRow, selectedCol] = selectedCell;

    // Highlight same row, column, or 3x3 section
    const inSameRow = rowIndex === selectedRow;
    const inSameCol = colIndex === selectedCol;
    const inSameSection =
      Math.floor(rowIndex / 3) === Math.floor(selectedRow / 3) &&
      Math.floor(colIndex / 3) === Math.floor(selectedCol / 3);

    return inSameRow || inSameCol || inSameSection;
  };

  const getCellBorderStyles = (rowIndex, colIndex) => {
    const isThickTop = rowIndex % 3 === 0;
    const isThickLeft = colIndex % 3 === 0;
    const isThickBottom = rowIndex === 8;
    const isThickRight = colIndex === 8;
  
    return {
      borderTopWidth: isThickTop ? 3 : 1,
      borderLeftWidth: isThickLeft ? 3 : 1,
      borderBottomWidth: isThickBottom ? 3 : 1,
      borderRightWidth: isThickRight ? 3 : 1,
      borderColor: '#000', // Make sure borders are black
      zIndex: 2, // Elevate borders above the bird images
    };
  };

  return (
    <View style={styles.board}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              isEditable={initialBoard[rowIndex][colIndex] === 0}
              isHighlighted={getCellHighlight(rowIndex, colIndex)}
              onValueChange={(value) => onCellValueChange(value, rowIndex, colIndex)}
              onSelect={() => onCellSelect([rowIndex, colIndex])}
              style={getCellBorderStyles(rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
});

export default Board;
