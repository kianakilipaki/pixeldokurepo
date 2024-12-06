import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { View, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import CompletionModal from '../components/Modal';
import IconActionButtons from '../components/ActionButtons';
import TopBar from '../components/TopBar'; // Import TopBar
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
  const [retryCounter, setRetryCounter] = useState(3);
  const [isRetryModalVisible, setIsRetryModalVisible] = useState(false);
  const [isFailureModalVisible, setIsFailureModalVisible] = useState(false);

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
    setIsRetryModalVisible(false);
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

  const checkBoardCorrectness = () => {
    const isIncorrect = board.flat().some((value, idx) => value !== solutionBoard.flat()[idx]);
    if (isIncorrect) {
      if (retryCounter > 1) {
      setRetryCounter((prev) => prev - 1);
      setIsRetryModalVisible(true);
    } else {
      setIsFailureModalVisible(true);
    }
    }
  };

  const updateBoard = (value) => {
    if (selectedCell && !isPaused) {
      const [rowIndex, colIndex] = selectedCell;

      if (initialBoard[rowIndex][colIndex] !== 0) return;

      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => [...row]);
        newBoard[rowIndex][colIndex] = value;

        const isSolved = solutionBoard.flat().every(
          (num, idx) => num === newBoard.flat()[idx]
        );

        if (isSolved) {
          setIsModalVisible(true);
        } else if (newBoard.flat().every((cell) => cell !== 0)) {
          checkBoardCorrectness();
        }

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
        <TopBar retryCounter={retryCounter} isPaused={isPaused || isModalVisible || isRetryModalVisible || isFailureModalVisible} />
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
          visible={isModalVisible || isRetryModalVisible || isFailureModalVisible}
          type={isModalVisible ? 'completion' : isRetryModalVisible ? 'retry' : 'failure'}
          onClose={() => {
            setIsModalVisible(false);
            setIsRetryModalVisible(false);
            setIsFailureModalVisible(false);
          }}
          onNextPuzzle={() => {
            setRetryCounter(3);
            fetchPuzzle(difficulty);
          }}
          onRetry={resetBoard}
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
