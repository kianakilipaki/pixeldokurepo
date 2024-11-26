import React from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './Cell';
import { getCellBorderStyles } from '../utils/helper';

const Board = ({ board, initialBoard, selectedCell, onCellSelect, highlightedValue }) => {
  const isCellHighlighted = (value) => value === highlightedValue;

  const getCellHighlight = (rowIndex, colIndex, value) => {
    return (
      selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex // Highlight selected cell
    ) || isCellHighlighted(value); // Highlight matching values
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
              isHighlighted={getCellHighlight(rowIndex, colIndex, cell)}
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
