import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Coins from "./Coins";
import themeStyles from "../utils/themeStyles";

const Header = ({ title, onBackPress }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Back Arrow */}
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} style={styles.backArrow}>
          <Image
            source={require("../assets/icons/backArrow.png")}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
      )}

      {/* Title */}
      {title && <Text style={styles.titleText}>{title}</Text>}

      {/* Coins */}
      <Coins />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingTop: 30,
    backgroundColor: themeStyles.colors.blue,
    borderBottomColor: themeStyles.colors.forecolor1,
    borderBottomWidth: 2,
  },
  backArrow: {
    padding: 5,
  },
  titleText: {
    fontSize: 20,
    color: themeStyles.colors.forecolor1,
    fontFamily: themeStyles.fonts.fontFamily,
  },
});

export default Header;
