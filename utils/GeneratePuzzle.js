import themeStyles from "../utils/themeStyles";

// Utility to check if a number can be placed at a given position
const isValidPlacement = (board, row, col, num) => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
    const boxRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
    const boxCol = Math.floor(col / 3) * 3 + (i % 3);
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
};

// Recursive backtracking to generate a complete Sudoku board
const fillBoard = (board) => {
  const numbers = getRandomNumbers(); // Shuffle numbers for randomness

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (const num of numbers) {
          if (isValidPlacement(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = 0; // Backtrack
          }
        }
        return false; // No valid number found
      }
    }
  }
  return true; // Board successfully filled
};

const removeCells = (board, difficulty) => {
  const difficultyMap = { Easy: 30, Medium: 40, Hard: 50 }; // Numbers to remove
  const cellsToRemove = difficultyMap[difficulty] || 30;

  for (let i = 0; i < cellsToRemove; i++) {
    let row, col;
    do {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    } while (board[row][col] === 0); // Ensure we don't remove already empty cells
    board[row][col] = 0;
  }
  return board;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Randomly shuffle numbers 1-9
const getRandomNumbers = () => shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

const shuffleRowsAndColumns = (board) => {
  // Shuffle rows within each box
  for (let i = 0; i < 9; i += 3) {
    const rows = [i, i + 1, i + 2];
    const shuffledRows = shuffleArray(rows);
    for (let j = 0; j < 3; j++) {
      [board[i + j], board[shuffledRows[j]]] = [
        board[shuffledRows[j]],
        board[i + j],
      ];
    }
  }

  // Shuffle columns within each box
  for (let i = 0; i < 9; i++) {
    const boxStart = Math.floor(i / 3) * 3; // Identify the starting column of the 3x3 box
    const cols = [boxStart, boxStart + 1, boxStart + 2];
    const shuffledCols = shuffleArray(cols); // Shuffle the column indexes

    for (let row = 0; row < 9; row++) {
      const temp = [
        board[row][cols[0]],
        board[row][cols[1]],
        board[row][cols[2]],
      ];
      for (let j = 0; j < 3; j++) {
        board[row][cols[j]] = temp[shuffledCols.indexOf(cols[j])];
      }
    }
  }
};

export const generateSudoku = (difficulty = "Easy") => {
  // Create an empty board
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));

  // Fill the board with a valid solution
  fillBoard(board);

  // Shuffle rows, columns, and numbers
  shuffleRowsAndColumns(board);

  // Clone the solution for later use
  const solution = board.map((row) => [...row]);

  // Remove cells to create the puzzle
  const puzzle = removeCells(board, difficulty);

  return { puzzle, solution };
};

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
    borderColor: themeStyles.colors.forecolor1,
    zIndex: 2,
  };
};
