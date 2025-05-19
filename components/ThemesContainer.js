import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import ThemeList from "./ThemeList";
import gameStyles from "../utils/gameStyles";
import { usePlayerData } from "../utils/playerDataContext";
import { themeAssets } from "../utils/themeAssets";

const ThemeListContainer = ({ heightAnimation, navigation, toggle }) => {
  const { unlockedThemes } = usePlayerData();
  const [expandedTheme, setExpandedTheme] = useState(null);
  const scrollToRef = useRef(null);

  const toggleTheme = (key, index) => {
    const newExpanded = expandedTheme === key ? null : key;
    setExpandedTheme(newExpanded);

    if (newExpanded && scrollToRef.current) {
      scrollToRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  const themeKeys = Object.keys(unlockedThemes).filter(
    (key) => key in themeAssets
  );

  return (
    <Animated.View
      style={[
        styles.themeContainer,
        {
          height: heightAnimation,
          overflow: "hidden",
        },
      ]}
    >
      <TouchableOpacity
        accessibilityLabel="Choose a Theme"
        accessibilityRole="button"
        onPress={toggle}
      >
        <Text style={styles.header}>Choose a Theme</Text>
      </TouchableOpacity>

      {themeKeys.length > 0 ? (
        <FlatList
          ref={scrollToRef}
          data={themeKeys.map((key, index) => ({
            themeKey: key,
            index,
            ...themeAssets[key],
            locked: unlockedThemes[key]?.locked ?? true,
          }))}
          renderItem={({ item, index }) => (
            <ThemeList
              theme={item}
              expandedTheme={expandedTheme}
              toggleTheme={() => toggleTheme(item.themeKey, index)}
              navigation={navigation}
            />
          )}
          keyExtractor={(item) => item.themeKey}
          getItemLayout={(data, index) => ({
            length: 150,
            offset: 150 * index,
            index,
          })}
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
    fontFamily: gameStyles.fonts.fontFamily,
    fontSize: gameStyles.fonts.headerFontSize,
    textAlign: "center",
    color: gameStyles.colors.black1,
    marginBottom: 10,
  },
});

export default ThemeListContainer;
