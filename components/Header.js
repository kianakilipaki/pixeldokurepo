import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Coins from "./Coins";
import themeStyles from "../utils/themeStyles";
import MusicToggleButton from "./muteButton";
import { useMusic } from "../utils/musicContext";

const Header = ({ title, onBackPress }) => {
  const { stopMusic } = useMusic();

  return (
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
              style={themeStyles.icons.iconSizeMedium}
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
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 5,
    paddingHorizontal: 15,
    backgroundColor: themeStyles.colors.blue,
    borderBottomColor: themeStyles.colors.black1,
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
    fontSize: themeStyles.fonts.largeFontSize,
    color: themeStyles.colors.black1,
    fontFamily: themeStyles.fonts.fontFamily,
  },
});

export default Header;
