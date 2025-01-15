import React, { useState } from "react";
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
import { spriteMap } from "../utils/assetsMap";
import CoinShop from "./CoinShop";
import themeStyle from "../styles/themeStyles";
import { Dimensions } from "react-native";
import { useThemes } from "../utils/themeContext";

const { width } = Dimensions.get("window");

const PurchaseModal = ({ theme, setIsModalVisible, isModalVisible }) => {
  const { coins, removeCoins } = useCoins();
  const { unlockTheme } = useThemes();

  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [isCoinShopVisible, setIsCoinShopVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
  };
  const purchaseTheme = () => {
    if (coins < 500) {
      setIsWarningVisible(true);
      return;
    } else {
      setIsWarningVisible(false);
      removeCoins(500);
      unlockTheme(theme.themeKey);
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
                  source={require("../assets/icons/coin.png")}
                  style={{ width: 16, height: 16 }}
                />
                <Text style={styles.coinText}>500</Text>
              </View>
            </View>
            {isWarningVisible && (
              <>
                <Text style={{ color: themeStyle.colors.red, marginBottom: 5 }}>
                  Insufficent Funds
                </Text>
                <TouchableOpacity
                  style={styles.warningButton}
                  onPress={openShop}
                >
                  <Text style={styles.buyButtonText}>Buy Coins</Text>
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
    width: width * 0.8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: themeStyle.colors.forecolor1,
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
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  thumbnail: {
    width: width * 0.2,
    height: width * 0.2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5, // Add spacing between the thumbnail and text
    marginLeft: 30,
  },
  spriteImage: {
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: "contain",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeStyle.colors.bgcolor1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    marginLeft: "auto",
    shadowColor: themeStyle.colors.bgcolor3,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  coinText: {
    fontSize: 16,
    fontFamily: themeStyle.fonts.fontFamily,
    marginLeft: 5,
  },
  warningButton: {
    backgroundColor: themeStyle.colors.gold,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
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
  buyButtonText: {
    fontFamily: themeStyle.fonts.fontFamily,
  },
});

export default PurchaseModal;
