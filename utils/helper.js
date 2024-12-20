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

export const saveGameStat = async (theme, difficulty) => {
  try {
    // Fetch existing stats
    const statsJSON = await AsyncStorage.getItem('gameStats');
    const stats = statsJSON ? JSON.parse(statsJSON) : {};

    // Update the specific theme and difficulty
    if (!stats[theme]) {
      stats[theme] = { Easy: 0, Medium: 0, Hard: 0 };
    }
    stats[theme][difficulty] += 1;

    // Save updated stats
    await AsyncStorage.setItem('gameStats', JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving game stats:', error);
  }
};