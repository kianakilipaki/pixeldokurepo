import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useGame } from "../../utils/gameContext";
import gameStyles, { isTablet } from "../../utils/gameStyles";

const InputButtons = () => {
  const { theme, board, setSelectedCell, updateBoard } = useGame();
  const [clearedValues, setClearedValues] = useState([]);

  useEffect(() => {
    const countMap = new Map();

    // Count occurrences of each number on the board
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const value = board[row][col];
        if (typeof value === "number" && value !== 0) {
          countMap.set(value, (countMap.get(value) || 0) + 1);
        }
      }
    }

    // Find values with exactly 9 occurrences
    const newClearedValues = [];
    for (const [key, count] of countMap.entries()) {
      if (count === 9) {
        newClearedValues.push(parseInt(key, 10));
      }
    }

    setClearedValues(newClearedValues);
  }, [board]);

  return (
    <View style={styles.birdButtons}>
      {Array.from({ length: 9 }, (_, index) => {
        const value = index + 1;
        const isCleared = clearedValues.includes(value);
        return (
          <TouchableOpacity
            key={value}
            accessibilityLabel={`${theme.themeKey}${value}`}
            accessibilityRole="button"
            style={[styles.cellContainer, isCleared && styles.darken]}
            onPress={() => updateBoard(value)}
          >
            <Image
              source={theme.icons[index]}
              style={[styles.spriteImage, isCleared && styles.darken]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        accessibilityLabel="deselect cell"
        accessibilityRole="button"
        style={[styles.cellContainer, { padding: 8 }]}
        onPress={() => setSelectedCell(null)}
      >
        <Image
          source={require("../../assets/icons/clear.png")}
          style={styles.clearButton}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  birdButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: isTablet ? 30 : 20,
  },
  cellContainer: {
    flexBasis: `16%`,
    aspectRatio: 1,
    margin: 3,
    borderColor: gameStyles.colors.black1,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: gameStyles.colors.gray1,
    justifyContent: "center",
    alignItems: "center",
  },
  darken: {
    backgroundColor: gameStyles.colors.gray2,
    opacity: 0.3,
  },
  spriteImage: {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
  },
  clearButton: {
    width: "100%",
    height: "100%",
  },
});

export default InputButtons;
