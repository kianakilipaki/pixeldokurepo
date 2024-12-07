import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const CompletionModal = ({ 
  board, 
  timer,
  solutionBoard, 
  retryCounter, 
  setRetryCounter, 
  onNextPuzzle, 
  onRetry,
  setIsModalVisible,
  isModalVisible, 
}) => {
  const [modalType, setModalType] = useState(null);

  const modalContent = {
    success: {
      message: `Congratulations! You completed the puzzle in ${timer} seconds!`,
      buttons: [{ title: 'Next Puzzle', onPress: onNextPuzzle }],
    },
    retry: {
      message: `Some cells are incorrect. Would you like to retry? You have ${retryCounter} tries left.`,
      buttons: [{ title: 'Retry', onPress: onRetry }],
    },
    failure: {
      message: 'You have exceeded the retry limit. Try a new puzzle?',
      buttons: [{ title: 'Next Puzzle', onPress: onNextPuzzle }],
    },
  };

  useEffect(() => {
    if (!board || board.length === 0 || !solutionBoard) return;
  
    const isComplete = board.flat().every((cell) => cell !== 0);
    if (!isComplete) return; // Only check for completion if board is full
  
    const isCorrect = board.flat().every((num, idx) => num === solutionBoard.flat()[idx]);
  
    if (isCorrect) {
      setModalType('success');
    } else if (retryCounter > 1) {
      setRetryCounter((prev) => Math.max(prev - 1, 0));
      setModalType('retry');
    } else if (retryCounter === 1) {
      setModalType('failure');
    }
  
    setIsModalVisible(true);
  }, [board]);

  const { message, buttons } = modalContent[modalType] || {};

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{message}</Text>
          {buttons &&
            buttons.map((button, index) => (
              <Button
                key={index}
                title={button.title}
                onPress={() => {
                  button.onPress();
                  setIsModalVisible(false);
                }}
              />
            ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default CompletionModal;
