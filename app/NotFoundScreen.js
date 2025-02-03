import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import themeStyles from "../utils/themeStyles";

const NotFoundScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>404 - Page Not Found</Text>
      <TouchableOpacity
        style={themeStyles.buttons.button}
        accessibilityLabel={`Go back Home`}
        accessibilityRole="button"
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={themeStyles.buttons.buttonText}>Go Home</Text>
      </TouchableOpacity>
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
});

export default NotFoundScreen;
