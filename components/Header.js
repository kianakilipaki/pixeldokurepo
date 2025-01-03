import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Coins from "./Coins";
import themeStyles from "../styles/theme";

const Header = ({ title, onBackPress }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Back Arrow */}
      <TouchableOpacity onPress={onBackPress} style={styles.backArrow}>
        <Image
          source={require("../assets/backArrow.png")}
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.titleText}>{title}</Text>

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
    backgroundColor: themeStyles.colors.blue1,
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
