import React from 'react';
import IconActionButtons from '../components/ActionButtons';
import Board from '../components/Board';
import InputButtons from '../components/InputButtons';

const GameBoard = ({
    theme, board, initialBoard, solutionBoard, selectedCell,
    setBoard, onCellSelect, updateBoard, onReset, onPause
}) => (
    <>
        <Board theme={theme} board={board} initialBoard={initialBoard} selectedCell={selectedCell} onCellSelect={onCellSelect} />
        <IconActionButtons board={board} initialBoard={initialBoard} solutionBoard={solutionBoard} selectedCell={selectedCell} setBoard={setBoard} onReset={onReset} onPause={onPause} />
        <InputButtons theme={theme} onPress={updateBoard} />
    </>
);

export default GameBoard;