import React, { useState, useEffect } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Ensure you use this library for Picker
import Board from '../components/Board';
import { fetchPuzzleData } from '../api/FetchPuzzle';

const SudokuScreen = () => {
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [solutionBoard, setSolutionBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null); // For hint functionality
  const [difficulty, setDifficulty] = useState('medium');

  // Fetch a new puzzle from the API
  const fetchPuzzle = async (level = 'medium') => {
    try {
      const data = await fetchPuzzleData(level);
      setBoard(data.value); // Editable board
      setInitialBoard(JSON.parse(JSON.stringify(data.value))); // Deep clone for immutability
      setSolutionBoard(data.solution); // Solution for validation
    } catch (error) {
      console.error('Error fetching puzzle:', error);
      Alert.alert('Error', 'Failed to fetch a new puzzle.');
    }
  };

  // Reset board to initial state
  const resetBoard = () => {
    setBoard(JSON.parse(JSON.stringify(initialBoard))); // Reset to initial board
    setSelectedCell(null); // Clear selected cell
  };

  // Check if the puzzle is solved correctly
  const solvePuzzle = () => {
    const flattenedBoard = board.flat();
    const flattenedSolution = solutionBoard.flat();

    const isSolved = flattenedSolution.every(
      (num, index) => num === flattenedBoard[index]
    );

    if (isSolved) {
      Alert('Congratulations!', 'The puzzle is solved correctly.');
    } else {
      Alert('Try Again', 'Some entries are incorrect.');
    }
  };

  // Update the board state on user input
  const updateBoard = (value, rowIndex, colIndex) => {
    setBoard((prevBoard) => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard)); // Clone to prevent mutation
      newBoard[rowIndex][colIndex] = value ? parseInt(value, 10) : 0; // Update cell
      return newBoard;
    });
  };

  // Fetch a new puzzle when the difficulty changes
  useEffect(() => {
    fetchPuzzle(difficulty);
  }, [difficulty]);

  return (
    <View style={styles.container}>
      {/* Difficulty Picker */}
      <Picker
        selectedValue={difficulty}
        onValueChange={(value) => setDifficulty(value)}
        style={styles.picker}
      >
        <Picker.Item label="Easy" value="easy" />
        <Picker.Item label="Medium" value="medium" />
        <Picker.Item label="Hard" value="hard" />
      </Picker>

      {/* Sudoku Board */}
      <Board
        board={board}
        initialBoard={initialBoard}
        onCellValueChange={updateBoard}
        selectedCell={selectedCell}
        onCellSelect={setSelectedCell}
      />

      {/* Action Buttons */}
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
    backgroundColor: '#f5f5f5',
  },
  picker: {
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
});

export default SudokuScreen;
