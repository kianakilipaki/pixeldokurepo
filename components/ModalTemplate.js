import React from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
} from "react-native";
import themeStyle from "../utils/themeStyles";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const ModalTemplate = ({
  modalTitle,
  modalBody,
  confirmAction,
  modalVisible,
  setModalVisible,
}) => {
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={toggleModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ImageBackground
            source={require("../assets/gradient.png")}
            resizeMode="cover"
            style={styles.modalHeader}
          >
            <Text style={styles.modalHeaderText}>{modalTitle}</Text>
          </ImageBackground>
          <View style={styles.modalBody}>{modalBody}</View>
          <View style={styles.buttonContainer}>
            {confirmAction && (
              <View style={styles.buttonWrapper}>
                <Button title={"Confirm"} onPress={confirmAction} />
              </View>
            )}
            <View style={styles.buttonWrapper}>
              <Button title={"Cancel"} onPress={toggleModal} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: themeStyle.colors.black1,
    borderRadius: 10,
  },
  modalHeader: {
    width: width * 0.8,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalHeaderText: {
    fontFamily: themeStyle.fonts.fontFamily,
    fontSize: 20,
    color: "white",
  },
  modalBody: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  buttonWrapper: {
    flex: 1,
    paddingHorizontal: 5,
  },
});

export default ModalTemplate;
