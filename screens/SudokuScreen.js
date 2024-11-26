import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { View, Button, Alert, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { fetchPuzzleData } from '../api/FetchPuzzle';

const Board = lazy(() => import('../components/Board'));
const InputButtons = lazy(() => import('../components/Buttons'));

const SudokuScreen = ({ route }) => {
  const { difficulty } = route.params;

  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [solutionBoard, setSolutionBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [highlightedValue, setHighlightedValue] = useState(null);

  const fetchPuzzle = useCallback(async (level) => {
    try {
      const data = await fetchPuzzleData(level);
      setBoard(data.value);
      setInitialBoard(JSON.parse(JSON.stringify(data.value))); // Deep copy
      setSolutionBoard(data.solution);
    } catch (error) {
      console.error('Error fetching puzzle:', error);
      Alert.alert('Error', 'Failed to fetch a new puzzle.');
    }
  }, []);

  const resetBoard = useCallback(() => {
    setBoard(JSON.parse(JSON.stringify(initialBoard))); // Deep copy
    setSelectedCell(null);
    setHighlightedValue(null); // Reset highlights as well
  }, [initialBoard]);

  const solvePuzzle = useCallback(() => {
    const isSolved = solutionBoard.flat().every((num, idx) => num === board.flat()[idx]);
    Alert.alert(
      isSolved ? 'Congratulations!' : 'Try Again',
      isSolved
        ? 'The puzzle is solved correctly.'
        : 'Some entries are incorrect.',
      [{ text: 'OK', onPress: () => console.log('Alert dismissed') }]
    );
  }, [board, solutionBoard]);

  const updateBoard = useCallback((value) => {
    if (selectedCell) {
      const [rowIndex, colIndex] = selectedCell;
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => [...row]); // Create shallow copy of each row
        newBoard[rowIndex][colIndex] = value;
        return newBoard;
      });
    }
  }, [selectedCell]);

  const toggleHighlight = (value) => {
    setHighlightedValue((prev) => (prev === value ? null : value));
  };

  useEffect(() => {
    fetchPuzzle(difficulty);
  }, [difficulty, fetchPuzzle]);

  return (
    <ImageBackground
      source={require('../assets/sprite_northWindShrineBG.png')}
      resizeMode="cover"
      style={styles.image}
    >
      <View style={styles.container}>
        <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
          <Board
            board={board}
            initialBoard={initialBoard}
            selectedCell={selectedCell}
            onCellSelect={setSelectedCell}
            highlightedValue={highlightedValue}
          />
          <InputButtons
            onPress={(value) => {
              toggleHighlight(value);
              updateBoard(value);
            }}
            setHighlightedValue={toggleHighlight}
          />
        </Suspense>
        <View style={styles.buttons}>
          <Button title="Solve Puzzle" onPress={solvePuzzle} />
          <Button title="Reset Board" onPress={resetBoard} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
});

export default SudokuScreen;
