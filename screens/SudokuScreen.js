import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { View, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import CompletionModal from '../components/Modal';
import IconActionButtons from '../components/ActionButtons';
import TopBar from '../components/TopBar';
import { generateSudoku } from '../components/GeneratePuzzle';
import PlayOverlay from '../components/PlayOverlay';
import Header from '../components/Header';

const Board = lazy(() => import('../components/Board'));
const InputButtons = lazy(() => import('../components/InputButtons'));

const SudokuScreen = ({ route }) => {
  const { theme, difficulty } = route.params; 

  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [solutionBoard, setSolutionBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCounter, setRetryCounter] = useState(3);
  const [timer, setTimer] = useState(0);

  const fetchPuzzle = useCallback(async (level) => {
    setIsLoading(true);
    try {
      const { puzzle, solution } = generateSudoku(level);
      setBoard(puzzle);
      setInitialBoard(puzzle);
      setSolutionBoard(solution);
      setIsPaused(false);
      setTimer(0);
    } catch (error) {
      console.error("Error fetching puzzle:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetBoard = useCallback(() => {
    setBoard((initialBoard));
    setSelectedCell(null);
    setIsPaused(false)
    setTimer(0);
  }, [initialBoard]);

  const updateBoard = (value) => {
    if (selectedCell) {
      const [rowIndex, colIndex] = selectedCell;

      if (initialBoard[rowIndex][colIndex] !== 0) return;

      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => [...row]);
        newBoard[rowIndex][colIndex] = value;
        return newBoard;
      });
    }
  };

  useEffect(() => {
    fetchPuzzle(difficulty);
  }, [difficulty, fetchPuzzle]);

  return (
    <ImageBackground source={theme.bgSource} resizeMode="cover" style={styles.image}>
      {/* Header */}
      <Header
        title={theme.title}
        onBackPress={() => navigation.navigate('Home')}
      />
      <View style={styles.container}>
        <TopBar difficulty={difficulty} retryCounter={retryCounter} isPaused={isPaused || isModalVisible} timer={timer} setTimer={setTimer} />
        {isPaused && <PlayOverlay onPress={() => setIsPaused(false)} /> }

        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
            <Board
              theme={theme}
              board={board}
              initialBoard={initialBoard}
              selectedCell={selectedCell}
              onCellSelect={isPaused ? null : setSelectedCell}
            />
            <IconActionButtons
              board={board}
              initialBoard={initialBoard}
              solutionBoard={solutionBoard}
              selectedCell={selectedCell}
              setBoard={setBoard}
              onReset={resetBoard}
              onPause={() => setIsPaused(true)}
            />
            <InputButtons theme={theme} onPress={updateBoard} />
          </Suspense>
        )}

        <CompletionModal
          difficulty={difficulty}
          board={board}
          solutionBoard={solutionBoard}
          retryCounter={retryCounter}
          setRetryCounter={setRetryCounter}
          timer={timer}
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
          onNextPuzzle={() => {
            setRetryCounter(3);
            fetchPuzzle(difficulty);
          }}
          onRetry={() => {
            resetBoard();
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
