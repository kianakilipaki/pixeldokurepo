import React from "react";
import ActionButtons from "./ActionButtons";
import Board from "./Board";
import InputButtons from "./InputButtons";

const GameBoard = ({
  selectedCell,
  onCellSelect,
  updateBoard,
  onPause,
  deselect,
}) => (
  <>
    <Board selectedCell={selectedCell} onCellSelect={onCellSelect} />
    <ActionButtons
      onCellSelect={onCellSelect}
      selectedCell={selectedCell}
      onPause={onPause}
    />
    <InputButtons onPress={updateBoard} deselect={deselect} />
  </>
);

export default GameBoard;
