import React from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './Cell';
import { getCellBorderStyles } from '../utils/helper';

const Board = ({ board, initialBoard, selectedCell, onCellSelect }) => {
  return (
    <View style={styles.board}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((value, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              currentCell={[rowIndex, colIndex, value]}
              selectedCell={selectedCell}
              isEditable={initialBoard[rowIndex][colIndex] === 0}
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
