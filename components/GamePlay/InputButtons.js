import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { spriteMapLG, cellSizeLG, isTablet } from "../../utils/assetsMap";
import { useGame } from "../../utils/gameContext";
import themeStyles from "../../utils/themeStyles";

const InputButtons = ({ onPress, deselect }) => {
  const { theme, board } = useGame();
  const [clearedValues, setClearedValues] = useState([]);

  useEffect(() => {
    const countMap = new Map();

    // Count occurrences of each number on the board
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const value = board[row][col];
        if (value !== 0) {
          // Ignore empty cells (assumed to be 0)
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

    setClearedValues(newClearedValues); // Reset state directly
  }, [board]);

  return (
    <View style={styles.birdButtons}>
      {Object.entries(spriteMapLG).map(([value, position]) => {
        const isCleared = clearedValues.includes(parseInt(value, 10));
        return (
          <TouchableOpacity
            accessibilityLabel={`${theme.themeKey}${value}`}
            accessibilityRole="button"
            key={value}
            style={[styles.cellContainer, isCleared && styles.darken]}
            onPress={() => onPress(parseInt(value, 10))}
          >
            <Image
              source={theme.source}
              style={[styles.spriteImage, position, isCleared && styles.darken]}
            />
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        accessibilityLabel={`deselect cell`}
        accessibilityRole="button"
        style={styles.cellContainer}
        onPress={deselect}
      >
        <Image
          source={require("../../assets/icons/clear.png")}
          style={styles.clearButton}
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
    width: cellSizeLG,
    height: cellSizeLG,
    padding: 10,
    margin: 5,
    borderColor: themeStyles.colors.black1,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: themeStyles.colors.gray1,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  darken: {
    backgroundColor: themeStyles.colors.gray2,
    opacity: 0.3,
  },
  spriteImage: {
    position: "absolute",
    width: cellSizeLG * 3,
    height: cellSizeLG * 3,
    opacity: 1, // Default opacity
  },
  clearButton: {
    width: "100%",
    height: "100%",
  },
});

export default InputButtons;
