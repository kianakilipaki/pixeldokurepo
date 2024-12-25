import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { useCoins } from "../utils/coinContext";
import { spriteMap } from "../utils/helper";
import CoinShop from "./CoinShop";
import theme from "../styles/theme";

const PurchaseModal = ({ theme, setIsModalVisible, isModalVisible }) => {
  const { coins, removeCoins } = useCoins();

  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [isCoinShopVisible, setIsCoinShopVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
  };
  const purchaseTheme = () => {
    if (coins < 1000) {
      setIsWarningVisible(true);
      return;
    } else {
      setIsWarningVisible(false);
      removeCoins(1000);
      closeModal();
    }
  };

  const openShop = () => {
    setIsCoinShopVisible(true);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ImageBackground
            source={require("../assets/gradient.png")}
            resizeMode="cover"
            style={styles.modalHeader}
          >
            <Text style={styles.modalHeaderText}>Confirm Purchase</Text>
          </ImageBackground>

          <View style={styles.modalBody}>
            <Text style={styles.modalText}>Purchase {theme.title} theme?</Text>

            <View style={styles.wrapper}>
              <View style={styles.thumbnail}>
                <Image
                  source={theme.source}
                  style={[styles.spriteImage, spriteMap[2]]}
                />
              </View>

              <View style={styles.coinContainer}>
                <Image
                  source={require("../assets/coin.png")}
                  style={{ width: 16, height: 16, marginRight: 5 }}
                />
                <Text style={styles.coinText}>500</Text>
              </View>
            </View>
            {isWarningVisible && (
              <>
                <Text style={{ color: theme.colors.red, marginBottom: 5 }}>
                  Insufficent Funds
                </Text>
                <TouchableOpacity
                  style={styles.warningButton}
                  onPress={openShop}
                >
                  Buy Coins
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button title={"Confirm"} onPress={purchaseTheme} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title={"Cancel"} onPress={closeModal} />
            </View>
          </View>
        </View>
      </View>
      <CoinShop
        isCoinShopVisible={isCoinShopVisible}
        setIsCoinShopVisible={setIsCoinShopVisible}
      />
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
    width: "80vw",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: theme.colors.forecolor1,
    borderRadius: 10,
  },
  modalHeader: {
    width: "80vw",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalHeaderText: {
    fontFamily: theme.fonts.fontFamily,
    fontSize: 20,
    color: "white",
  },
  modalBody: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    width: "20vw",
    height: "20vw",
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  spriteImage: {
    position: "absolute",
    width: "40vw",
    height: "60vw",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  buttonWrapper: {
    flex: 1,
    padding: 10,
    width: "30%",
    marginHorizontal: 5,
  },
  coinContainer: {
    backgroundColor: theme.colors.bgcolor1,
    padding: 5,
    marginLeft: 20,
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid gray",
    boxShadow: "inset 0 0 5px theme.colors.bgcolor3",
  },
  coinText: {
    fontSize: 16,
    fontFamily: theme.fonts.fontFamily,
  },
  warningButton: {
    backgroundColor: theme.colors.gold,
    fontFamily: theme.fonts.fontFamily,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default PurchaseModal;
