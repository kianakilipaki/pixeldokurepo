import React from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
} from "react-native";
import { Dimensions } from "react-native";
import themeStyles from "../../utils/themeStyles";
import { useGame } from "../../utils/gameContext";
import { formatTime } from "../../utils/generatePuzzle";

const { width } = Dimensions.get("window");

const PlayOverlay = ({ onPress }) => {
  const { theme, difficulty, timer } = useGame();
  return (
    <ImageBackground
      source={theme.bgSource}
      resizeMode="cover"
      style={styles.image}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>{theme.title}</Text>
        <Text style={styles.text}>Difficulty: {difficulty}</Text>
        <Text style={styles.text}>Time: {formatTime(timer)}</Text>
        <Image
          source={require("../../assets/sleeping-kitty.gif")}
          style={styles.gif}
        />
        <TouchableOpacity
          accessibilityLabel={`Resume game`}
          accessibilityRole="button"
          style={styles.playButton}
          onPress={onPress}
        >
          <Text style={styles.playText}>Resume</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  overlay: {
    padding: 20,
    backgroundColor: themeStyles.colors.gray1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  title: {
    fontFamily: themeStyles.fonts.fontFamily,
    color: themeStyles.colors.red,
    margin: 10,
    fontSize: themeStyles.fonts.headerFontSize,
  },
  text: {
    fontFamily: themeStyles.fonts.fontFamily,
    color: themeStyles.colors.black1,
    fontSize: themeStyles.fonts.regularFontSize,
  },
  playButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  gif: {
    width: 200,
    height: 200,
    margin: 20,
  },
  playText: {
    fontFamily: themeStyles.fonts.fontFamily,
    margin: 20,
    color: themeStyles.colors.black1,
    fontSize: themeStyles.fonts.headerFontSize,
  },
});

export default PlayOverlay;
