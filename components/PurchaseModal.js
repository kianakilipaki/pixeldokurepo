import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useCoins } from "../utils/coinContext";
import { spriteMap } from "../utils/assetsMap";
import CoinShop from "./CoinShop";
import themeStyle from "../utils/themeStyles";
import { Dimensions } from "react-native";
import { useThemes } from "../utils/themeContext";
import ModalTemplate from "./ModalTemplate";

const { width } = Dimensions.get("window");

const PurchaseModal = ({ theme, setIsModalVisible, isModalVisible }) => {
  const { coins, removeCoins } = useCoins();
  const { unlockTheme } = useThemes();

  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [isCoinShopVisible, setIsCoinShopVisible] = useState(false);

  const purchaseTheme = () => {
    if (coins < 500) {
      setIsWarningVisible(true);
      return;
    } else {
      setIsWarningVisible(false);
      removeCoins(500);
      unlockTheme(theme.themeKey);
      setIsModalVisible(false);
    }
  };

  const modalBody = () => {
    return (
      <>
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
              onPress={() => setIsCoinShopVisible(true)}
            >
              <Text style={styles.buyButtonText}>Buy Coins</Text>
            </TouchableOpacity>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <ModalTemplate
        modalTitle="Confirm Purchase"
        modalBody={modalBody()}
        confirmAction={purchaseTheme}
        modalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
      />
      <CoinShop
        isCoinShopVisible={isCoinShopVisible}
        setIsCoinShopVisible={setIsCoinShopVisible}
      />
    </>
  );
};

const styles = StyleSheet.create({
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
  buyButtonText: {
    fontFamily: themeStyle.fonts.fontFamily,
  },
});

export default PurchaseModal;
