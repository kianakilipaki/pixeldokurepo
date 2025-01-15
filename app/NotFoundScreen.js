import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default NotFoundScreen;
