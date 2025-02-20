import themeStyles from "./themeStyles";

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

const countSolutions = (board) => {
  const cloneBoard = board.map((row) => [...row]); // Create a copy of the board
  let solutionCount = 0;

  const solve = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num;
              solve(grid);
              grid[row][col] = 0; // Backtrack

              if (solutionCount >= 3) return; // Stop early if more than 3 solutions exist
            }
          }
          return;
        }
      }
    }
    solutionCount++;
  };

  solve(cloneBoard);
  return solutionCount;
};

const removeCells = (board, difficulty) => {
  const difficultyMap = { Easy: 30, Medium: 40, Hard: 50 };
  const targetRemovals = difficultyMap[difficulty] || 30;
  let removedCells = 0;

  let positions = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }
  shuffleArray(positions); // Shuffle to randomize cell removals

  for (const [row, col] of positions) {
    if (removedCells >= targetRemovals) break;

    const backup = board[row][col];
    board[row][col] = 0; // Temporarily remove the number

    if (countSolutions(board) === 1) {
      removedCells++; // Only keep removal if uniqueness is preserved
    } else {
      board[row][col] = backup; // Restore if more than one solution exists
    }
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
    borderColor: themeStyles.colors.black1,
    zIndex: 2,
  };
};

// format time
export const formatTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const remainingSeconds = secs % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

// Get the 3×3 box indices for a given cell
export const getBoxIndices = (row, col) => {
  const boxRowStart = Math.floor(row / 3) * 3;
  const boxColStart = Math.floor(col / 3) * 3;
  const boxIndices = [];

  for (let i = 0; i < 9; i++) {
    const boxRow = boxRowStart + Math.floor(i / 3);
    const boxCol = boxColStart + (i % 3);
    boxIndices.push([boxRow, boxCol]);
  }

  return boxIndices;
};

// Helper to remove a value from pencil marks in the same row, col, and section
export const removePencilMarks = (board, row, col, value) => {
  const updatedBoard = board.map((r) =>
    r.map((cell) => (Array.isArray(cell) ? [...cell] : cell))
  );

  for (let i = 0; i < 9; i++) {
    // Remove from row
    if (Array.isArray(updatedBoard[row][i])) {
      updatedBoard[row][i] = updatedBoard[row][i].filter((v) => v !== value);
      if (updatedBoard[row][i].length === 0) updatedBoard[row][i] = 0;
    }

    // Remove from column
    if (Array.isArray(updatedBoard[i][col])) {
      updatedBoard[i][col] = updatedBoard[i][col].filter((v) => v !== value);
      if (updatedBoard[i][col].length === 0) updatedBoard[i][col] = 0;
    }
  }

  // Remove from the 3×3 section
  const boxIndices = getBoxIndices(row, col);
  boxIndices.forEach(([boxRow, boxCol]) => {
    if (Array.isArray(updatedBoard[boxRow][boxCol])) {
      updatedBoard[boxRow][boxCol] = updatedBoard[boxRow][boxCol].filter(
        (v) => v !== value
      );
      if (updatedBoard[boxRow][boxCol].length === 0)
        updatedBoard[boxRow][boxCol] = 0;
    }
  });

  return updatedBoard;
};

// Helper to update a cell with pencil-in logic
export const updateCell = (cell, value, isPencilIn) => {
  if (isPencilIn) {
    if (cell === 0) {
      return [value]; // Convert 0 to an array with the value
    } else if (Array.isArray(cell)) {
      return cell.includes(value)
        ? cell.filter((v) => v !== value) // Remove value if present
        : [...cell, value]; // Add value if absent
    } else {
      return [value]; // Convert single value to pencil marks
    }
  }

  return value; // Return single value for normal mode
};
