import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { View, Alert, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { fetchPuzzleData } from '../api/FetchPuzzle';
import ActionButtons from '../components/ActionButtons';
import { themes } from '../utils/spriteMap';

const Board = lazy(() => import('../components/Board'));
const InputButtons = lazy(() => import('../components/InputButtons'));

const SudokuScreen = ({ route }) => {
  const { difficulty } = route.params;

  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [solutionBoard, setSolutionBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);

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
  }, [initialBoard]);

  const solvePuzzle = useCallback(() => {
    const isSolved = solutionBoard.flat().every((num, idx) => num === board.flat()[idx]);
    console.log(isSolved ? 'You solved it!' : 'Try Again.');
  }, [board, solutionBoard]);

  const updateBoard = useCallback((value) => {
    if (selectedCell) {
      const [rowIndex, colIndex] = selectedCell;
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => [...row]);
        newBoard[rowIndex][colIndex] = value;
        return newBoard;
      });
    }
  }, [selectedCell]);

  useEffect(() => {
    fetchPuzzle(difficulty);
  }, [difficulty, fetchPuzzle]);

  return (
    <ImageBackground
      source={themes['birds'].bgSource}
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
          />
          <InputButtons
            onPress={(value) => {
              updateBoard(value);
            }}
          />
        </Suspense>
        <ActionButtons solvePuzzle={solvePuzzle} resetBoard={resetBoard}/>
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
});

export default SudokuScreen;