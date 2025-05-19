import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";
import { useGame } from "../../utils/gameContext";
import gameStyles from "../../utils/gameStyles";
import { useHintRewardedAd } from "./HintAd";
import { useMusic } from "../../utils/musicContext";

const ActionButtons = ({ onPause }) => {
  const {
    board,
    initialBoard,
    solutionBoard,
    selectedCell,
    updateBoard,
    hints,
    setHints,
    isPencilIn,
    setIsPencilIn,
  } = useGame();

  const { watchAd, rewardAmount, setRewardAmount, loaded } =
    useHintRewardedAd();
  const { playSoundEffect } = useMusic();

  const handlePencilIn = () => {
    setIsPencilIn(!isPencilIn);
  };

  const onErase = () => {
    if (selectedCell) {
      const [rowIndex, colIndex] = selectedCell;
      if (initialBoard[rowIndex][colIndex] === 0) {
        updateBoard(0);
      }
    }
  };

  const onHint = () => {
    const emptyCells = [];
    board.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 0) emptyCells.push([rowIndex, colIndex]);
      });
    });
    playSoundEffect("hint");

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const [rowIndex, colIndex] = randomCell;
      updateBoard([rowIndex, colIndex, solutionBoard[rowIndex][colIndex]]);
      setHints((prevHints) => prevHints - 1); // Reduce hints count
    }
  };

  useEffect(() => {
    if (rewardAmount > 0) {
      setTimeout(() => {
        onHint();
        setRewardAmount(0);
      }, 1000); // Delay to allow ad to finish
    }
  }, [rewardAmount]);

  return (
    <View style={styles.buttonContainer}>
      {/* Pencil In Button */}
      <TouchableOpacity
        accessibilityLabel={`Pencil In: ${isPencilIn}`}
        accessibilityRole="button"
        style={styles.button}
        onPress={handlePencilIn}
      >
        <Image
          source={
            isPencilIn
              ? require("../../assets/icons/pencilIn.png")
              : require("../../assets/icons/pencilOut.png")
          }
          style={gameStyles.icons.iconSizeMedium}
        />
      </TouchableOpacity>

      {/* Erase Button */}
      <TouchableOpacity
        accessibilityLabel={`Erase selected cell`}
        accessibilityRole="button"
        style={styles.button}
        onPress={onErase}
      >
        <Image
          source={require("../../assets/icons/erase.png")}
          style={gameStyles.icons.iconSizeMedium}
        />
      </TouchableOpacity>

      {/* Hint Button */}
      <TouchableOpacity
        accessibilityLabel={`Hint: Solve random cell`}
        accessibilityRole="button"
        style={styles.button}
        onPress={hints <= 0 ? watchAd : onHint}
      >
        <View style={styles.hintIndicator}>
          {hints > 0 && <Text style={styles.hintText}>{hints}</Text>}
          {hints <= 0 ? (
            loaded ? (
              <Image
                source={require("../../assets/icons/ad.png")}
                style={gameStyles.icons.iconSizeSmall}
              />
            ) : (
              <ActivityIndicator size="small" color="white" />
            )
          ) : null}
        </View>
        <Image
          source={require("../../assets/icons/hint.png")}
          style={gameStyles.icons.iconSizeMedium}
        />
      </TouchableOpacity>

      {/* Pause Button */}
      <TouchableOpacity
        accessibilityLabel={`Pause game`}
        accessibilityRole="button"
        style={styles.button}
        onPress={onPause}
      >
        <Image
          source={require("../../assets/icons/pause.png")}
          style={gameStyles.icons.iconSizeMedium}
        />
      </TouchableOpacity>
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
    backgroundColor: gameStyles.colors.blue,
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
    backgroundColor: gameStyles.colors.gold,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: {
    fontSize: gameStyles.fonts.regularFontSize,
    fontFamily: gameStyles.fonts.fontFamily,
  },
});

export default ActionButtons;
