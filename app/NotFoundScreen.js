import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import themeStyles from "../utils/themeStyles";

const NotFoundScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>404 - Page Not Found</Text>
      <Button title="Go Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  text: {
    fontSize: themeStyles.fonts.headerFontSize,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default NotFoundScreen;
