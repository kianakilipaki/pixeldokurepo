import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ActionButtons = ({ board, setBoard, solutionBoard, initialBoard, selectedCell, onReset, onPause }) => {
  const onErase = () => {
    if (selectedCell) {
      const [rowIndex, colIndex] = selectedCell;
      if (initialBoard[rowIndex][colIndex] === 0) {
        setBoard((prevBoard) => {
          const newBoard = prevBoard.map((row) => [...row]);
          newBoard[rowIndex][colIndex] = 0;
          return newBoard;
        });
      }
    }
  };

  const onHint = () => {
    const emptyCells = [];
    board.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 0) emptyCells.push([rowIndex, colIndex]);
      });
    });

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const [rowIndex, colIndex] = randomCell;
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => [...row]);
        newBoard[rowIndex][colIndex] = solutionBoard[rowIndex][colIndex];
        return newBoard;
      });
    }
  };
  
  return (
    <View style={styles.buttonContainer}>
      {/* Reset Button */}
      <TouchableOpacity style={styles.button} onPress={onReset}>
        <Image
          source={require('../assets/reset.png')}
          style={{ width: 20, height: 20 }}
          />
        {/* <Icon name="restart" size={20} color="#fff" /> */}
      </TouchableOpacity>

      {/* Erase Button */}
      <TouchableOpacity style={styles.button} onPress={onErase}>
        {/* <Icon name="eraser" size={20} color="#fff" /> */}
        <Image
          source={require('../assets/erase.png')}
          style={{ width: 20, height: 20 }}
          />
      </TouchableOpacity>

      {/* Hint Button */}
      <TouchableOpacity style={styles.button} onPress={onHint}>
        {/* <Icon name="lightbulb-outline" size={20} color="#fff" /> */}
        <Image
          source={require('../assets/hint.png')}
          style={{ width: 20, height: 20 }}
          />
      </TouchableOpacity>

      {/* Pause Button */}
      <TouchableOpacity style={styles.button} onPress={onPause}>
        {/* <Icon name="pause" size={20} color="#fff" /> */}
        <Image
          source={require('../assets/pause.png')}
          style={{ width: 20, height: 20 }}
          />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  button: {
    padding: 10,
    backgroundColor: 'var(--blue)',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default ActionButtons;
