import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { useGame } from "../../utils/gameContext";
import gameStyles from "../../utils/gameStyles";
import { Dimensions } from "react-native";
import { formatTime } from "../../utils/generatePuzzle";
import { useMusic } from "../../utils/musicContext";
import { usePlayerData } from "../../utils/playerDataContext";

const { width } = Dimensions.get("window");

const CompletionModal = ({
  onNextPuzzle,
  onRetry,
  goHome,
  setIsModalVisible,
  isModalVisible,
}) => {
  const {
    theme,
    difficulty,
    board,
    solutionBoard,
    timer,
    mistakeCounter,
    setIsPaused,
  } = useGame();
  const { saveHighScore, highscores, addCoins } = usePlayerData();

  const [modalType, setModalType] = useState(null);
  const [coinsAwarded, setCoinsAwarded] = useState(null);
  const [newHighScore, setNewHighScore] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  const { playSoundEffect } = useMusic();

  const modalContent = {
    success: {
      title: "Congrats!",
      message: `You completed the puzzle in ${formatTime(timer)}! ${
        newHighScore ? "That's your best time yet!" : ""
      }`,
      buttons: [
        { title: "Home", onPress: goHome },
        { title: "Next", onPress: onNextPuzzle },
      ],
    },
    retry: {
      title: "Congrats!",
      message: `You finished in ${formatTime(timer)}. ${
        newHighScore ? "Best time yet! " : ""
      }Some mistakes were made. Retry for a better score?`,
      buttons: [
        { title: "Retry", onPress: onRetry },
        { title: "New Puzzle", onPress: onNextPuzzle },
      ],
    },
    failure: {
      title: "Game Over!",
      message: "You have exceeded the mistakes limit. Try a new puzzle?",
      buttons: [
        { title: "Home", onPress: goHome },
        { title: "New Puzzle", onPress: onNextPuzzle },
      ],
    },
  };

  const handleComplete = async () => {
    setIsPaused(true);
    const coinReward =
      {
        easy: 10,
        medium: 20,
        hard: 30,
      }[difficulty.toLowerCase()] || 0;
    const totalCoins = coinReward + mistakeCounter * 2;
    setCoinsAwarded(totalCoins);
    await addCoins(totalCoins);

    const highscore = highscores[theme.themeKey]
      ? highscores[theme.themeKey][difficulty]
      : 0;
    if (highscore === 0 || highscore === null || highscore > timer) {
      setNewHighScore(true);
      await saveHighScore(theme.themeKey, difficulty, timer);
    }
  };

  useEffect(() => {
    if (!board || board.length === 0 || !solutionBoard || hasShownModal) return;

    const isComplete = board
      .flat()
      .every((cell) => typeof cell === "number" && cell !== 0);
    if (!isComplete) return;

    const isCorrect = board
      .flat()
      .every((num, idx) => num === solutionBoard.flat()[idx]);

    if (isCorrect && mistakeCounter === 3) {
      setModalType("success");
      playSoundEffect("success");
      handleComplete();
    } else if (isCorrect && mistakeCounter < 3) {
      setModalType("retry");
      playSoundEffect("success");
      handleComplete();
    } else {
      setModalType("failure");
      setCoinsAwarded(null);
    }

    setHasShownModal(true); // prevents re-triggering
    setIsModalVisible(true);
  }, [board, mistakeCounter]);

  const { title, message, buttons } = modalContent[modalType] || {};
  const star = require("../../assets/icons/star.png");
  const grayStar = require("../../assets/icons/gray-star.png");

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        setHasShownModal(false);
        setIsModalVisible(false);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header Section */}
          <View style={styles.starContainer}>
            <Image
              source={mistakeCounter >= 1 ? star : grayStar}
              style={styles.star1}
            />
            <Image
              source={mistakeCounter >= 2 ? star : grayStar}
              style={styles.star2}
            />
            <Image
              source={mistakeCounter == 3 ? star : grayStar}
              style={styles.star3}
            />
          </View>

          <ImageBackground
            source={require("../../assets/gradient.png")}
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
                  source={require("../../assets/icons/coin.png")}
                  style={gameStyles.icons.iconSizeSmall}
                />
              </View>
            )}
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonContainer}>
            {buttons &&
              buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={gameStyles.buttons.button}
                  accessibilityLabel={`button.title`}
                  accessibilityRole="button"
                  onPress={() => {
                    button.onPress();
                    setIsModalVisible(false);
                    setHasShownModal(false);
                  }}
                >
                  <Text style={gameStyles.buttons.buttonText}>
                    {button.title}
                  </Text>
                </TouchableOpacity>
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
    maxWidth: "400px",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: gameStyles.colors.black1,
    borderRadius: 10,
  },
  modalHeader: {
    width: width * 0.8,
    maxWidth: "400px",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalHeaderText: {
    fontFamily: gameStyles.fonts.fontFamily,
    fontSize: gameStyles.fonts.headerFontSize,
    color: "white",
  },
  modalBody: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: gameStyles.fonts.largeFontSize,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  buttonWrapper: {
    fontSize: gameStyles.fonts.regularFontSize,
    flex: 1,
    marginHorizontal: 5,
  },
  starContainer: {
    position: "absolute",
    top: -30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  star1: {
    width: 64,
    height: 64,
    marginRight: 10,
    transform: [{ rotate: "-15deg" }, { translateY: -10 }],
  },
  star2: {
    width: 64,
    height: 64,
    transform: [{ translateY: -20 }],
  },
  star3: {
    width: 60,
    height: 60,
    marginLeft: 10,
    transform: [{ rotate: "15deg" }, { translateY: -10 }],
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: gameStyles.colors.gray1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    shadowColor: gameStyles.colors.gray3,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginTop: 10,
  },
  coinText: {
    marginBottom: 2,
    fontSize: gameStyles.fonts.regularFontSize,
    fontFamily: gameStyles.fonts.fontFamily,
    marginRight: 5,
  },
});

export default CompletionModal;
