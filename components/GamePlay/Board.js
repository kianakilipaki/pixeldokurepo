import React, { useEffect, useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { getCellBorderStyles } from "../../utils/generatePuzzle";
import { useGame } from "../../utils/gameContext";
import PopupCell from "./PopupCell";
import Cell from "./Cell";

const Board = () => {
  const { board, initialBoard, setSelectedCell, selectedCell } = useGame();
  const [heldCell, setHeldCell] = useState(null); // Track the currently held cell

  useEffect(() => {
    if (selectedCell === null) {
      setHeldCell(null);
    }
  }, [selectedCell]);

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
                onSelect={() => setSelectedCell(currentCell)}
                style={getCellBorderStyles(rowIndex, colIndex)}
                onHold={() => setHeldCell(currentCell)}
              />
            );
          })}
        </View>
      ))}
      {/* RENDER POPUP ON TOP */}
      {heldCell && Array.isArray(heldCell[2]) && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setHeldCell(null)}
        >
          <PopupCell cell={heldCell} />
        </Pressable>
      )}
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
