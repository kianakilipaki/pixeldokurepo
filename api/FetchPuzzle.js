export const fetchPuzzleData = async (level) => {
    const response = await fetch(`https://sudoku-api.vercel.app/api/dosuku?level=${level}`);
    const data = await response.json();
    return data.newboard.grids[0];
  };
  