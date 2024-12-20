import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import CompletionModal from '../components/Modal';
import GameBoard from '../components/GameBoard';
import LoadingIndicator from '../components/loadingIcon';
import TopBar from '../components/TopBar';
import Header from '../components/Header';
import { saveGameProgress, fetchSudokuPuzzle } from '../utils/helper';
import { generateSudoku } from '../components/GeneratePuzzle';
import PlayOverlay from '../components/PlayOverlay';

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

   const loadGame = useCallback(async () => {
       setIsLoading(true);
       try {
           if (savedGame) {
               setBoard(savedGame.board);
               setInitialBoard(savedGame.initialBoard);
               setSolutionBoard(savedGame.solutionBoard);
               setTimer(savedGame.timer || 0);
           } else {
               const { puzzle, solution } = await fetchSudokuPuzzle(difficulty, generateSudoku);
               setBoard(puzzle);
               setInitialBoard(puzzle);
               setSolutionBoard(solution);
               saveGameProgress({ theme, difficulty, board: puzzle, initialBoard: puzzle, solutionBoard: solution, timer });
           }
       } catch (error) {
           console.error("Error loading game:", error);
       } finally {
           setIsLoading(false);
       }
   }, [difficulty]);

   const updateBoard = (value) => {
    const [row, col] = selectedCell || [];
      if (row != null && col != null && initialBoard[row][col] === 0) {
          const newBoard = board.map((r, i) => (i === row ? [...r] : r));
          newBoard[row][col] = value;
          setBoard(newBoard);
          saveGameProgress({ theme, difficulty, board: newBoard, initialBoard, solutionBoard, timer });
      }
    };

   useEffect(() => {
       loadGame();
   }, [loadGame]);

   return (
       <ImageBackground source={theme.bgSource} resizeMode="cover" style={styles.image}>
           <Header title={theme.title} onBackPress={() => navigation.navigate('Home')} />
           <View style={styles.container}>
               {isLoading ? (
                   <LoadingIndicator />
               ) : (
                   <>
                       <TopBar
                           difficulty={difficulty}
                           retryCounter={retryCounter}
                           isPaused={isPaused || isModalVisible}
                           timer={timer}
                           setTimer={setTimer}
                       />
                       {isPaused && <PlayOverlay onPress={() => setIsPaused(false)} />}
                       <GameBoard
                           theme={theme}
                           board={board}
                           initialBoard={initialBoard}
                           solutionBoard={solutionBoard}
                           selectedCell={selectedCell}
                           setBoard={setBoard}
                           onCellSelect={setSelectedCell}
                           updateBoard={updateBoard}
                           onReset={() => setBoard(initialBoard)}
                           onPause={() => setIsPaused(true)}
                       />
                   </>
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
                   onNextPuzzle={async () => {
                       setRetryCounter(3);
                       await loadGame();
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
       padding: '5vw',
       justifyContent: 'center',
       alignItems: 'center',
   },
});

export default SudokuScreen;
