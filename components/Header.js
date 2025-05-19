import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Coins from "./Coins";
import gameStyles from "../utils/gameStyles";
import MusicToggleButton from "./muteButton";
import { useMusic } from "../utils/musicContext";
import { SafeAreaView } from "react-native-safe-area-context";

const Header = ({ title, onBackPress }) => {
  const { stopMusic } = useMusic();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.group}>
          {/* Back Arrow */}
          {onBackPress && (
            <TouchableOpacity
              accessibilityLabel={`Go Back`}
              accessibilityRole="button"
              onPress={() => {
                onBackPress();
                stopMusic();
              }}
              style={styles.backArrow}
            >
              <Image
                source={require("../assets/icons/backArrow.png")}
                style={gameStyles.icons.iconSizeMedium}
              />
            </TouchableOpacity>
          )}

          {/* Title */}
          {title && <Text style={styles.titleText}>{title}</Text>}
        </View>
        <View style={styles.group}>
          {/* Mute button */}
          <MusicToggleButton />

          {/* Coins */}
          <Coins />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: gameStyles.colors.blue, // or match your app theme
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 5,
    paddingHorizontal: 15,
    backgroundColor: gameStyles.colors.blue,
    borderBottomColor: gameStyles.colors.black1,
    borderBottomWidth: 2,
  },
  group: {
    flexDirection: "row",
    alignItems: "center",
  },
  backArrow: {
    padding: 5,
  },
  titleText: {
    fontSize: gameStyles.fonts.largeFontSize,
    color: gameStyles.colors.black1,
    fontFamily: gameStyles.fonts.fontFamily,
  },
});

export default Header;
