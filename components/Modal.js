import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const CompletionModal = ({ 
  visible, 
  type, 
  onClose, 
  onNextPuzzle, 
  onRetry 
}) => {
  // Define messages and buttons based on the modal type
  const modalContent = {
    completion: {
      message: 'Congratulations! You completed the puzzle!',
      buttons: [{ title: 'Next Puzzle', onPress: onNextPuzzle }],
    },
    retry: {
      message: 'Some cells are incorrect. Would you like to retry?',
      buttons: [{ title: 'Retry', onPress: onRetry }],
    },
    failure: {
      message: 'You have exceeded the retry limit. Try a new puzzle?',
      buttons: [{ title: 'Next Puzzle', onPress: onNextPuzzle }],
    },
  };

  const { message, buttons } = modalContent[type] || {};

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{message}</Text>
          {buttons.map((button, index) => (
            <Button
              key={index}
              title={button.title}
              onPress={() => {
                button.onPress();
                onClose();
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
