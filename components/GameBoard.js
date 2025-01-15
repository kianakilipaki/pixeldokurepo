import React from "react";
import ActionButtons from "../components/ActionButtons";
import Board from "../components/Board";
import InputButtons from "../components/InputButtons";

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
      selectedCell={selectedCell}
      onReset={onReset}
      onPause={onPause}
    />
    <InputButtons onPress={updateBoard} deselect={deselect} />
  </>
);

export default GameBoard;
