import React from "react";
import { Animated, FlatList, StyleSheet, Text, Dimensions } from "react-native";
import ThemeList from "./ThemeList";
import themeStyles from "../styles/theme";
import LoadingIndicator from "./loadingIcon";
import { useThemes } from "../utils/themeContext";

const ThemeListContainer = ({ slideAnimation, navigation }) => {
  const screenHeight = Dimensions.get("window").height;
  const { themes } = useThemes();

  if (!themes) {
    return <LoadingIndicator />;
  }

  return (
    <Animated.View
      style={[
        styles.themeContainer,
        {
          transform: [
            {
              translateY: slideAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [screenHeight, 0], // Numeric pixel values
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.header}>Choose a Theme</Text>
      {Object.keys(themes).length > 0 ? (
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
      ) : (
        <Text style={{ color: "red", textAlign: "center" }}>
          No themes available
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  themeContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "90%",
  },
  header: {
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: 24,
    textAlign: "center",
    color: themeStyles.colors.forecolor1,
    marginBottom: 10,
  },
});

export default ThemeListContainer;
