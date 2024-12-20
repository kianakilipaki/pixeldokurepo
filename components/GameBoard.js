import React from "react";
import ActionButtons from "../components/ActionButtons";
import Board from "../components/Board";
import InputButtons from "../components/InputButtons";

const GameBoard = ({
  theme,
  board,
  initialBoard,
  solutionBoard,
  selectedCell,
  setBoard,
  onCellSelect,
  updateBoard,
  onReset,
  onPause,
  hints,
  setHints,
}) => (
  <>
    <Board
      theme={theme}
      board={board}
      initialBoard={initialBoard}
      selectedCell={selectedCell}
      onCellSelect={onCellSelect}
    />
    <ActionButtons
      hints={hints}
      setHints={setHints}
      board={board}
      initialBoard={initialBoard}
      solutionBoard={solutionBoard}
      selectedCell={selectedCell}
      setBoard={setBoard}
      onReset={onReset}
      onPause={onPause}
    />
    <InputButtons theme={theme} onPress={updateBoard} />
  </>
);

export default GameBoard;
