import React from "react";
import {
  View,
  Text,
  Modal,
  Button,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function TutorialModal({ visible, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>How to Play Sudoku</Text>
          <Image
            source={require("../assets/tutorialGrid.png")}
            style={styles.image}
          />
          <Text style={styles.text}>
            1. Fill the grid so that each row, column, and 3x3 box contains all
            unique images.
          </Text>
          <Text style={styles.text}>
            2. No image should repeat within the same row, column, or box.
          </Text>
          <Text style={styles.text}>3. Use logic, not guessing!</Text>
          <Button title="Got it!" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: width * 0.8,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});
