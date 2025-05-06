import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Cell from "./Cell";
import { getCellBorderStyles } from "../../utils/generatePuzzle";
import { useGame } from "../../utils/gameContext";

const Board = () => {
  const { board, initialBoard, setSelectedCell } = useGame();
  const [heldCell, setHeldCell] = useState(null); // Track the currently held cell

  return (
    <View style={styles.board}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((value, colIndex) => {
            const currentCell = [rowIndex, colIndex, value];

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                currentCell={currentCell}
                isEditable={initialBoard[rowIndex][colIndex] === 0}
                onSelect={() => {
                  setSelectedCell(currentCell);
                  setHeldCell(null); // Reset held state when clicked
                }}
                style={getCellBorderStyles(rowIndex, colIndex)}
                onHold={() => {
                  setHeldCell(currentCell);
                }}
                heldCell={heldCell} // Track the held cell
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
});

export default Board;
