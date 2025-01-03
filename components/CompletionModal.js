import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { useCoins } from "../utils/coinContext";
import { useGame } from "../utils/gameContext";
import { useGameStat } from "../utils/gameStatContext";
import themeStyles from "../styles/theme";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const CompletionModal = ({
  onNextPuzzle,
  onRetry,
  setIsModalVisible,
  isModalVisible,
}) => {
  const {
    theme,
    difficulty,
    board,
    solutionBoard,
    timer,
    retryCounter,
    setRetryCounter,
  } = useGame();
  const { saveGameStat } = useGameStat();

  const { addCoins } = useCoins();
  const [modalType, setModalType] = useState(null);
  const [coinsAwarded, setCoinsAwarded] = useState(null);

  const modalContent = {
    success: {
      title: "Congrats!",
      message: `You completed the puzzle in ${timer} seconds!`,
      buttons: [
        { title: "Restart", onPress: onRetry },
        { title: "Next Puzzle", onPress: onNextPuzzle },
      ],
    },
    retry: {
      title: "Try Again",
      message: `Some cells are incorrect. Would you like to retry?`,
      buttons: [
        { title: "Retry", onPress: onRetry },
        { title: "New Puzzle", onPress: onNextPuzzle },
      ],
    },
    failure: {
      title: "Game Over!",
      message: "You have exceeded the retry limit. Try a new puzzle?",
      buttons: [{ title: "New Puzzle", onPress: onNextPuzzle }],
    },
  };

  const handleComplete = () => {
    const coinReward =
      {
        easy: 10,
        medium: 20,
        hard: 30,
      }[difficulty.toLowerCase()] || 0;
    const totalCoins = coinReward + retryCounter * 2;
    setCoinsAwarded(totalCoins);
    addCoins(totalCoins);
    saveGameStat(theme.themeKey, difficulty);
  };

  useEffect(() => {
    if (!board || board.length === 0 || !solutionBoard) return;

    const isComplete = board.flat().every((cell) => cell !== 0);
    if (!isComplete) return;

    const isCorrect = board
      .flat()
      .every((num, idx) => num === solutionBoard.flat()[idx]);

    if (isCorrect) {
      setModalType("success");
      handleComplete();
    } else if (retryCounter > 1) {
      setRetryCounter((prev) => Math.max(prev - 1, 0));
      setModalType("retry");
      setCoinsAwarded(null);
    } else if (retryCounter === 1) {
      setModalType("failure");
      setCoinsAwarded(null);
    }

    setIsModalVisible(true);
  }, [board]);

  const { title, message, buttons } = modalContent[modalType] || {};
  const star = require("../assets/star.png");
  const grayStar = require("../assets/gray-star.png");

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
          <View style={styles.starContainer}>
            <Image
              source={retryCounter >= 1 ? star : grayStar}
              style={styles.star1}
            />
            <Image
              source={retryCounter >= 2 ? star : grayStar}
              style={styles.star2}
            />
            <Image
              source={retryCounter == 3 ? star : grayStar}
              style={styles.star3}
            />
          </View>

          <ImageBackground
            source={require("../assets/gradient.png")}
            resizeMode="cover"
            style={styles.modalHeader}
          >
            <Text style={styles.modalHeaderText}>{title}</Text>
          </ImageBackground>

          {/* Body Section */}
          <View style={styles.modalBody}>
            <Text style={styles.modalText}>{message}</Text>

            {/* Award Section */}
            {coinsAwarded && (
              <View style={styles.coinContainer}>
                <Text style={styles.coinText}> +{coinsAwarded}</Text>
                <Image
                  source={require("../assets/coin.png")}
                  style={{
                    width: 16,
                    height: 16,
                    marginLeft: 5,
                  }}
                />
              </View>
            )}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: themeStyles.colors.forecolor1,
    borderRadius: 10,
  },
  modalHeader: {
    width: width * 0.8,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalHeaderText: {
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: 24,
    color: "white",
  },
  modalBody: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  starContainer: {
    position: "absolute",
    top: 10,
    left: width * 0.13,
    flex: 1,
    flexDirection: "row",
    zIndex: 10,
  },
  star1: {
    width: 50,
    height: 50,
    marginRight: 20,
    transform: [{ rotate: "-15deg" }, { translateY: -40 }],
  },
  star2: {
    width: 60,
    height: 60,
    marginRight: 20,
    transform: [{ translateY: -50 }],
  },
  star3: {
    width: 50,
    height: 50,
    transform: [{ rotate: "15deg" }, { translateY: -40 }],
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeStyles.colors.bgcolor1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    shadowColor: themeStyles.colors.bgcolor3,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginTop: 10,
  },
  coinText: {
    fontSize: 16,
    fontFamily: themeStyles.fonts.fontFamily,
    marginRight: 5,
  },
});

export default CompletionModal;
