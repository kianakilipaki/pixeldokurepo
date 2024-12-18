import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet, ImageBackground } from 'react-native';
import { useCoins } from '../utils/coinContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CompletionModal = ({ 
  difficulty,
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
  const { addCoins } = useCoins();
  const [modalType, setModalType] = useState(null);

  const modalContent = {
    success: {
      title: "Congrats!",
      message: `You completed the puzzle in ${timer} seconds!`,
      buttons: [{title: 'Restart', onPress: onRetry }, { title: 'Next Puzzle', onPress: onNextPuzzle} ],
    },
    retry: {
      title: "Try Again",
      message: `Some cells are incorrect. Would you like to retry? You have ${retryCounter} tries left.`,
      buttons: [{ title: 'Retry', onPress: onRetry }, { title: 'New Puzzle', onPress: onNextPuzzle }],
    },
    failure: {
      title: "Game Over!",
      message: 'You have exceeded the retry limit. Try a new puzzle?',
      buttons: [{ title: 'New Puzzle', onPress: onNextPuzzle }],
    },
  };

  const handleComplete = async () => {
    await AsyncStorage.removeItem('SAVED_GAME'); // Clear saved progress
  };

  useEffect(() => {
    if (!board || board.length === 0 || !solutionBoard) return;
  
    const isComplete = board.flat().every((cell) => cell !== 0);
    if (!isComplete) return; // Only check for completion if board is full
  
    const isCorrect = board.flat().every((num, idx) => num === solutionBoard.flat()[idx]);
  
    if (isCorrect) {
      setModalType('success');

      const coinReward = {
        easy: 10,
        medium: 20,
        hard: 30,
      }[difficulty] || 0;
      handleComplete();
      addCoins(coinReward); // Add coins based on difficulty
    } else if (retryCounter > 1) {
      setRetryCounter((prev) => Math.max(prev - 1, 0));
      setModalType('retry');
    } else if (retryCounter === 1) {
      setModalType('failure');
    }
  
    setIsModalVisible(true);
  }, [board]);

  const { title, message, buttons } = modalContent[modalType] || {};

  return (
    <Modal
  animationType="slide"
  transparent={true}
  visible={isModalVisible}
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      {/* Header Section */}
      <ImageBackground
        source={require('../assets/gradient.png')}
        resizeMode="cover"
        style={styles.modalHeader}
      >
        <Text style={styles.modalHeaderText}>{title}</Text>
      </ImageBackground>

      {/* Body Section */}
      <View style={styles.modalBody}>
        <Text style={styles.modalText}>{message}</Text>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        {buttons &&
          buttons.map((button, index) => (
            <View style={styles.buttonWrapper} key={index}>
              <Button
                title={button.title}
                onPress={() => {
                  button.onPress();
                  setIsModalVisible(false);
                }}
              />
            </View>
          ))}
      </View>
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
    borderWidth: 1,
    borderColor: 'var(--forecolor1)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderText: {
    fontFamily: 'var(--fontFamily)',
    fontSize: 24,
    color: 'white',
  },
  modalBody: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default CompletionModal;
