import React from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import ThemeList from "./ThemeList";
import themeStyles from "../utils/themeStyles";
import LoadingIndicator from "./loadingIcon";
import { useThemes } from "../utils/themeContext";

const ThemeListContainer = ({ slideAnimation, navigation, toggle }) => {
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
      {/* Header with Touchable */}
      <TouchableOpacity onPress={toggle}>
        <Text style={styles.header}>Choose a Theme</Text>
      </TouchableOpacity>

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
    fontSize: themeStyles.fonts.headerFontSize,
    textAlign: "center",
    color: themeStyles.colors.black1,
    marginBottom: 10,
  },
});

export default ThemeListContainer;
