import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { View, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import CompletionModal from '../components/Modal';
import IconActionButtons from '../components/ActionButtons';
import Timer from '../components/Timer';
import { themes } from '../utils/spriteMap';
import { generateSudoku } from '../components/GeneratePuzzle';
import PlayOverlay from '../components/PlayOverlay';

const Board = lazy(() => import('../components/Board'));
const InputButtons = lazy(() => import('../components/InputButtons'));

const SudokuScreen = ({ route }) => {
  const { difficulty } = route.params;

  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [solutionBoard, setSolutionBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const fetchPuzzle = useCallback(async (level) => {
    const { puzzle, solution } = generateSudoku(level);
    setBoard(puzzle);
    setInitialBoard(puzzle);
    setSolutionBoard(solution);
  }, []);

  const resetBoard = useCallback(() => {
    if (isPaused) return;
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
    setSelectedCell(null);
  }, [initialBoard]);

  const eraseCell = () => {
    if (isPaused) return;
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

  const fillHint = () => {
    if (isPaused) return;
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

  const updateBoard = (value) => {
    if (selectedCell && !isPaused) {
      const [rowIndex, colIndex] = selectedCell;

      if (initialBoard[rowIndex][colIndex] !== 0) return;

      // Update the board and check completion
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => [...row]);
        newBoard[rowIndex][colIndex] = value;

        // Check completion immediately
        const isSolved = newBoard.every((row, rIdx) =>
          row.every((cell, cIdx) => cell === solutionBoard[rIdx][cIdx])
        );
        if (isSolved) setIsModalVisible(true);

        return newBoard;
      });
    }
  };

  useEffect(() => {
    fetchPuzzle(difficulty);
  }, [difficulty, fetchPuzzle]);

  return (
    <ImageBackground source={themes['birds'].bgSource} resizeMode="cover" style={styles.image}>
      <View style={styles.container}>
        {/* Timer */}
        <Timer isPaused={isPaused} />

        {/* Pause Overlay */}
        {isPaused && <PlayOverlay onPress={() => setIsPaused(false)} /> }

        <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
          <Board
            board={board}
            initialBoard={initialBoard}
            selectedCell={selectedCell}
            onCellSelect={isPaused ? null : setSelectedCell}
          />
          <IconActionButtons
            onReset={resetBoard}
            onErase={eraseCell}
            onHint={fillHint}
            onPause={() => setIsPaused((prev) => !prev)}
          />

          <InputButtons onPress={updateBoard} />
        </Suspense>

        <CompletionModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onNextPuzzle={() => {
            setIsModalVisible(false);
            fetchPuzzle(difficulty);
          }}
        />
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
