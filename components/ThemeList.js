import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Animated,
} from "react-native";
import { useGameStat } from "../utils/gameStatContext";
import { spriteMap } from "../utils/helper";
import LockOverlay from "./LockOverlay";
import PurchaseModal from "./PurchaseModal";

const ThemeList = ({ item, themeKey, navigation }) => {
  const [expandedTheme, setExpandedTheme] = useState(null);
  const { gameStats } = useGameStat();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleTheme = (key) => {
    setExpandedTheme(expandedTheme === key ? null : key);
  };

  const isExpanded = expandedTheme === themeKey;
  const stats = gameStats[themeKey] || { Easy: 0, Medium: 0, Hard: 0 };

  const openModal = () => {
    setIsModalVisible(true);
  };

  return (
    <View style={styles.themeContainer}>
      <ImageBackground
        source={item.bgSource}
        style={styles.themeBackground}
        resizeMode="cover"
      >
        {item.locked && <LockOverlay onPress={openModal} />}
        <TouchableOpacity
          onPress={() => toggleTheme(themeKey)}
          style={styles.themeHeader}
        >
          <View style={styles.thumbnail}>
            <Image
              source={item.source}
              style={[styles.spriteImage, spriteMap[1]]}
            />
          </View>
          <Text style={styles.themeTitle}>{item.title}</Text>
          <View style={styles.thumbnail}>
            <Image
              source={item.source}
              style={[styles.spriteImage, spriteMap[2]]}
            />
          </View>
        </TouchableOpacity>

        {!item.locked && isExpanded && (
          <Animated.View style={styles.difficultyContainer}>
            {Object.entries(stats).map(([difficulty, completed]) => (
              <View key={difficulty}>
                <TouchableOpacity
                  style={styles.difficultyButton}
                  onPress={() =>
                    navigation.navigate("SudokuScreen", {
                      theme: item,
                      difficulty,
                    })
                  }
                >
                  <Text style={styles.difficultyText}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Text>
                  <Text style={styles.statsText}>Completed {completed}</Text>
                </TouchableOpacity>
                {difficulty !== "Hard" && <View style={styles.divider} />}
              </View>
            ))}
          </Animated.View>
        )}

        <PurchaseModal
          theme={item}
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  themeContainer: {
    width: "100%",
    alignSelf: "center",
    marginVertical: 10,
    overflow: "hidden",
    elevation: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "var(--forecolor1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
  },
  themeBackground: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  themeHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  thumbnail: {
    width: "10vw",
    height: "10vw",
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  spriteImage: {
    position: "absolute",
    width: "30vw",
    height: "30vw",
  },
  themeTitle: {
    fontFamily: "var(--fontFamily)",
    fontSize: 20,
    color: "var(--forecolor1)",
  },
  difficultyContainer: {
    borderRadius: 10,
    width: "80vw",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "var(--bgcolor1)",
  },
  difficultyButton: {
    padding: 10,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  difficultyText: {
    textAlign: "left",
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  statsText: {
    textAlign: "right",
    color: "#333",
    fontSize: 14,
    fontWeight: "normal",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 5,
  },
});

export default ThemeList;
