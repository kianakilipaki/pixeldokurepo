import React, { useRef, useState } from "react";
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
import { usePlayerData } from "../utils/playerDataContext";

const ThemeListContainer = ({ heightAnimation, navigation, toggle }) => {
  const { themes } = usePlayerData();
  const [expandedTheme, setExpandedTheme] = useState(null); // Track the expanded theme key
  const scrollToRef = useRef(null);

  const toggleTheme = (key, index) => {
    const newExpanded = expandedTheme === key ? null : key;
    setExpandedTheme(newExpanded);

    if (newExpanded && scrollToRef.current) {
      scrollToRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5, // Center the expanded theme
      });
    }
  };

  if (!themes) {
    return <LoadingIndicator />;
  }

  return (
    <Animated.View
      style={[
        styles.themeContainer,
        {
          height: heightAnimation,
          overflow: "hidden", // important!
        },
      ]}
    >
      {/* Header with Touchable */}
      <TouchableOpacity
        accessibilityLabel={`Choose a Theme`}
        accessibilityRole="button"
        onPress={toggle}
      >
        <Text style={styles.header}>Choose a Theme</Text>
      </TouchableOpacity>

      {Object.keys(themes).length > 0 ? (
        <FlatList
          ref={scrollToRef}
          data={Object.keys(themes).map((key, index) => ({
            themeKey: key,
            index,
            ...themes[key],
          }))}
          renderItem={({ item, index }) => (
            <ThemeList
              item={item}
              themeKey={item.themeKey}
              expandedTheme={expandedTheme}
              toggleTheme={() => toggleTheme(item.themeKey, index)}
              navigation={navigation}
            />
          )}
          keyExtractor={(item) => item.themeKey}
          getItemLayout={(data, index) => ({
            length: 150, // Approximate item height
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
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: themeStyles.fonts.headerFontSize,
    textAlign: "center",
    color: themeStyles.colors.black1,
    marginBottom: 10,
  },
});

export default ThemeListContainer;
