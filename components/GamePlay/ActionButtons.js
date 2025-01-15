import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image, Text } from "react-native";
import { useGame } from "../../utils/gameContext";
import themeStyles from "../../utils/themeStyles";
import ModalTemplate from "../ModalTemplate";

const ActionButtons = ({ selectedCell, onReset, onPause }) => {
  const {
    board,
    setBoard,
    initialBoard,
    solutionBoard,
    hints,
    setHints,
    saveProgress,
  } = useGame();

  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirm = () => {
    onReset();
    setModalVisible(false);
  };

  const onErase = () => {
    if (selectedCell) {
      const [rowIndex, colIndex] = selectedCell;
      if (initialBoard[rowIndex][colIndex] === 0) {
        setBoard((prevBoard) => {
          const newBoard = prevBoard.map((row) => [...row]);
          newBoard[rowIndex][colIndex] = 0;
          return newBoard;
        });
      }
    }
  };

  const onHint = () => {
    //if (hints <= 0) return; // Prevent using hints if there are none left
    const emptyCells = [];
    board.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 0) emptyCells.push([rowIndex, colIndex]);
      });
    });

    if (emptyCells.length > 0) {
      setHints((prevHints) => prevHints - 1); // Reduce hints count

      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const [rowIndex, colIndex] = randomCell;
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row) => [...row]);
        newBoard[rowIndex][colIndex] = solutionBoard[rowIndex][colIndex];
        saveProgress(newBoard);
        return newBoard;
      });
    }
  };

  return (
    <View style={styles.buttonContainer}>
      {/* Reset Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)} // Fixed incorrect invocation
      >
        <Image
          source={require("../../assets/icons/reset.png")}
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>

      {/* Erase Button */}
      <TouchableOpacity style={styles.button} onPress={onErase}>
        <Image
          source={require("../../assets/icons/erase.png")}
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>

      {/* Hint Button */}
      <TouchableOpacity style={styles.button} onPress={onHint}>
        <View style={styles.hintIndicator}>
          {hints > 0 && <Text style={styles.hintText}>{hints}</Text>}
          {hints === 0 && (
            <Image
              source={require("../../assets/icons/ad.png")}
              style={{ width: 16, height: 16 }}
            />
          )}
        </View>
        <Image
          source={require("../../assets/icons/hint.png")}
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>

      {/* Pause Button */}
      <TouchableOpacity style={styles.button} onPress={onPause}>
        <Image
          source={require("../../assets/icons/pause.png")}
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>

      <ModalTemplate
        modalTitle="Confirm Reset"
        modalBody={
          <Text style={styles.modalText}>
            Are you sure you want to reset your board?
          </Text>
        }
        confirmAction={handleConfirm}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  button: {
    padding: 10,
    backgroundColor: themeStyles.colors.blue,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  hintIndicator: {
    position: "absolute",
    top: -15,
    right: -12,
    paddingHorizontal: 3,
    paddingVertical: 2,
    backgroundColor: themeStyles.colors.gold,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: {
    fontSize: 16,
    fontFamily: themeStyles.fonts.fontFamily,
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default ActionButtons;
