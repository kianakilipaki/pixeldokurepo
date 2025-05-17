import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import themeStyles from "../utils/themeStyles";

const { width } = Dimensions.get("window");

const ModalTemplate = ({
  modalTitle,
  modalBody,
  confirmAction,
  modalVisible,
  setModalVisible,
}) => {
  const toggleModal = () => setModalVisible(!modalVisible);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={toggleModal}
      accessible={true}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/gradient.png")}
            style={styles.header}
            accessibilityRole="header"
          >
            <Text style={styles.headerText}>{modalTitle}</Text>
          </ImageBackground>

          <View style={styles.body}>{modalBody}</View>

          <View style={styles.buttons}>
            {confirmAction && (
              <TouchableOpacity
                style={themeStyles.buttons.button}
                onPress={confirmAction}
                accessibilityLabel="Confirm action"
                accessibilityRole="button"
              >
                <Text style={themeStyles.buttons.buttonText}>Confirm</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={themeStyles.buttons.button}
              onPress={toggleModal}
              accessibilityLabel="Close the modal"
              accessibilityRole="button"
            >
              <Text style={themeStyles.buttons.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    width: width * 0.8,
    maxWidth: 400,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: themeStyles.colors.black1,
    borderRadius: 11,
  },
  header: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    fontFamily: themeStyles.fonts.fontFamily,
    fontSize: themeStyles.fonts.largeFontSize,
    color: "white",
  },
  body: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
});

export default ModalTemplate;
