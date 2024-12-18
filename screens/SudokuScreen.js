import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { View, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import CompletionModal from '../components/Modal';
import IconActionButtons from '../components/ActionButtons';
import TopBar from '../components/TopBar';
import { generateSudoku } from '../components/GeneratePuzzle';
import PlayOverlay from '../components/PlayOverlay';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Board = lazy(() => import('../components/Board'));
const InputButtons = lazy(() => import('../components/InputButtons'));

const SudokuScreen = ({ route, navigation }) => {
  const { savedGame, theme, difficulty } = route.params;

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
      setTimer(0);
    } catch (error) {
      console.error("Error fetching puzzle:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProgress = useCallback(async (updatedBoard) => {
    try {
      const gameData = {
        theme,
        difficulty,
        board: updatedBoard || board, // Use updatedBoard if provided
        initialBoard,
        solutionBoard,
        timer,
      };
      await AsyncStorage.setItem('SAVED_GAME', JSON.stringify(gameData));
    } catch (error) {
      console.error("Error saving game progress:", error);
    }
  }, [theme, difficulty, initialBoard, solutionBoard, timer]);

  const loadSavedGame = useCallback(async () => {
    try {
      setIsLoading(true);
      if (savedGame) {
        setBoard(savedGame.board);
        setInitialBoard(savedGame.initialBoard);
        setSolutionBoard(savedGame.solutionBoard);
        setTimer(savedGame.timer || 0);
        console.log("Loaded saved game:", savedGame);
      } else {
        await fetchPuzzle(difficulty);
      }
    } catch (error) {
      console.error("Error loading saved game:", error);
      await fetchPuzzle(difficulty);
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, fetchPuzzle]);

  const updateBoard = (value) => {
    if (selectedCell) {
      const [rowIndex, colIndex] = selectedCell;
  
      if (initialBoard[rowIndex][colIndex] !== 0) return;
  
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => [...row]);
        newBoard[rowIndex][colIndex] = value;
  
        // Save progress with the updated board
        saveProgress(newBoard);
  
        return newBoard;
      });
    }
  };

  useEffect(() => {
    const initializeGame = async () => {
      await loadSavedGame();
    };
    initializeGame();
  }, [loadSavedGame]);

  return (
    <ImageBackground source={theme.bgSource} resizeMode="cover" style={styles.image}>
      <Header title={theme.title} onBackPress={() => navigation.navigate('Home')} />
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
            <TopBar
              difficulty={difficulty}
              retryCounter={retryCounter}
              isPaused={isPaused || isModalVisible}
              timer={timer}
              setTimer={setTimer}
            />
            {isPaused && <PlayOverlay onPress={() => setIsPaused(false)} />}
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
              onReset={() => setBoard(initialBoard)}
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
          onRetry={() => setBoard(initialBoard)}
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
