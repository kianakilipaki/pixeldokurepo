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