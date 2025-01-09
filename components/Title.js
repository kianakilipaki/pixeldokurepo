// TitleAndButtons.js
import React from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import themeStyles from "../styles/theme";

const Title = ({ fadeAnimation, savedGame, onContinue, onToggleExpansion }) => (
  <Animated.View style={[styles.centerContainer, { opacity: fadeAnimation }]}>
    <Image source={require("../assets/icon.png")} style={styles.icon} />
    <Text style={styles.header}>Welcome to</Text>
    <Text style={styles.title}>PixelDoku</Text>
    {savedGame && (
      <TouchableOpacity
        style={[styles.button, styles.continueButton]}
        onPress={onContinue}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    )}
    <TouchableOpacity
      style={[styles.button, styles.newGameButton]}
      onPress={onToggleExpansion}
    >
      <Text style={styles.buttonText}>New Game</Text>
    </TouchableOpacity>
  </Animated.View>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 200,
    height: 200,
  },
  header: {
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: 36,
    textAlign: "center",
    color: themeStyles.colors.forecolor1,
  },
  title: {
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: 48,
    marginBottom: 20,
    color: themeStyles.colors.red,
    transform: [{ scaleY: 2 }],
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  button: {
    width: "60%",
    paddingVertical: 20,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
    borderCollapse: "collapsed",
  },
  continueButton: {
    backgroundColor: themeStyles.colors.forecolor1,
  },
  newGameButton: {
    backgroundColor: themeStyles.colors.blue,
  },
  buttonText: {
    color: "white",
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: 23,
  },
});

export default Title;
