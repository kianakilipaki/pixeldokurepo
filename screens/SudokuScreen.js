import React, { useState, useEffect } from 'react';
import { View, Button, Picker, Alert, StyleSheet } from 'react-native';
import Board from '../components/Board';
import { fetchPuzzleData } from '../api/FetchPuzzle';

const SudokuScreen = () => {
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [solutionBoard, setSolutionBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null); // For hint functionality
  const [difficulty, setDifficulty] = useState('medium');

  // Fetch a new puzzle
  const fetchPuzzle = async (level = 'medium') => {
    try {
      const data = await fetchPuzzleData(level);
      setBoard(data.value);
      setInitialBoard(data.value);
      setSolutionBoard(data.solution);
    } catch (error) {
      console.error('Error fetching puzzle:', error);
    }
  };

  const resetBoard = () => {
    setBoard([...initialBoard]);
    setSelectedCell(null); // Clear hints
  };

  const solvePuzzle = () => {
    const flattenedBoard = board.flat();
    const flattenedSolution = solutionBoard.flat();

    const isSolved = flattenedSolution.every(
      (num, index) => num === flattenedBoard[index]
    );

    if (isSolved) {
      Alert.alert('Congratulations!', 'The puzzle is solved correctly.');
    } else {
      Alert.alert('Try Again', 'Some entries are incorrect.');
    }
  };

  // Handle board updates
  const updateBoard = (value, rowIndex, colIndex) => {
    const updatedBoard = [...board];
    updatedBoard[rowIndex][colIndex] = value ? parseInt(value) : 0;
    setBoard(updatedBoard);
  };

  useEffect(() => {
    fetchPuzzle(difficulty);
  }, [difficulty]);

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={difficulty}
        onValueChange={(value) => setDifficulty(value)}
      >
        <Picker.Item label="Easy" value="easy" />
        <Picker.Item label="Medium" value="medium" />
        <Picker.Item label="Hard" value="hard" />
      </Picker>

      <Board
        board={board}
        initialBoard={initialBoard}
        onCellValueChange={updateBoard}
        selectedCell={selectedCell}
        onCellSelect={setSelectedCell}
      />

      <View style={styles.buttons}>
        <Button title="Solve Puzzle" onPress={solvePuzzle} />
        <Button title="Reset Board" onPress={resetBoard} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
});

export default SudokuScreen;
