import React from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './Cell';
import { getCellBorderStyles } from '../utils/helper';

const Board = ({ board, initialBoard, selectedCell, onCellSelect }) => {
  const getCellHighlight = (rowIndex, colIndex, value) => {
    return (
      selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
    ) || value === selectedCell;
  };

  const isCellHinted = (rowIndex, colIndex) => {
    if (!selectedCell) return false;
    
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
    <View style={styles.board}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((value, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={value}
              isEditable={initialBoard[rowIndex][colIndex] === 0}
              isHighlighted={getCellHighlight(rowIndex, colIndex, value)}
              isHinted={isCellHinted(rowIndex, colIndex)} // Pass hint prop
              onSelect={() => onCellSelect([rowIndex, colIndex, value])}
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
