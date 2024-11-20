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
