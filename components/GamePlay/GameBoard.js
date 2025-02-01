import React from "react";
import ActionButtons from "./ActionButtons";
import Board from "./Board";
import InputButtons from "./InputButtons";

const GameBoard = ({
  selectedCell,
  onCellSelect,
  updateBoard,
  onReset,
  onPause,
  deselect,
}) => (
  <>
    <Board selectedCell={selectedCell} onCellSelect={onCellSelect} />
    <ActionButtons
      onCellSelect={onCellSelect}
      selectedCell={selectedCell}
      onReset={onReset}
      onPause={onPause}
    />
    <InputButtons onPress={updateBoard} deselect={deselect} />
  </>
);

export default GameBoard;
