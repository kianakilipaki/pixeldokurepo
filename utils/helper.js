import AsyncStorage from '@react-native-async-storage/async-storage';

// Create sudoku grid lines
export const getCellBorderStyles = (rowIndex, colIndex) => {
    const isThickTop = rowIndex % 3 === 0;
    const isThickLeft = colIndex % 3 === 0;
    const isThickBottom = rowIndex === 8;
    const isThickRight = colIndex === 8;

    return {
      borderTopWidth: isThickTop ? 3 : 1,
      borderLeftWidth: isThickLeft ? 3 : 1,
      borderBottomWidth: isThickBottom ? 3 : 1,
      borderRightWidth: isThickRight ? 3 : 1,
      borderColor: 'var(--forecolor1)',
      zIndex: 2,
    };
  };

export const saveGameProgress = async (data) => {
  try {
      await AsyncStorage.setItem('SAVED_GAME', JSON.stringify(data));
  } catch (error) {
      console.error("Error saving game progress:", error);
  }
};

export const fetchSudokuPuzzle = async (level, generateSudoku) => {
  try {
      const { puzzle, solution } = generateSudoku(level);
      return { puzzle, solution };
  } catch (error) {
      console.error("Error generating puzzle:", error);
      throw error;
  }
};