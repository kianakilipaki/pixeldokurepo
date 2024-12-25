// ThemeListContainer.js
import React from "react";
import { Animated, FlatList, StyleSheet, Text } from "react-native";
import { themes } from "../utils/helper";
import ThemeList from "./ThemeList";
import theme from "../styles/theme";

const ThemeListContainer = ({ slideAnimation, isExpanded, navigation }) => {
  return (
    <Animated.View
      style={[
        styles.themeContainer,
        {
          transform: [
            {
              translateY: slideAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ["100%", "0%"], // Slides up from the bottom
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.header}>Choose a Theme</Text>
      <FlatList
        data={Object.keys(themes).map((key) => ({
          themeKey: key,
          ...themes[key],
        }))}
        renderItem={({ item }) => (
          <ThemeList
            item={item}
            themeKey={item.themeKey}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item.themeKey}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  themeContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "90%",
    backgroundColor: theme.colors.forecolor3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  header: {
    fontFamily: theme.fonts.fontFamily,
    fontSize: 24,
    textAlign: "center",
    color: theme.colors.forecolor1,
    marginBottom: 10,
  },
});

export default ThemeListContainer;
