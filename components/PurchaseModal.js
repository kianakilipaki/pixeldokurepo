import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { isTablet } from "../utils/gameStyles";
import CoinShop from "./CoinShop";
import gameStyles from "../utils/gameStyles";
import { Dimensions } from "react-native";
import ModalTemplate from "./ModalTemplate";
import { usePlayerData } from "../utils/playerDataContext";

const { width } = Dimensions.get("window");

const PurchaseModal = ({ theme, setIsModalVisible, isModalVisible }) => {
  const { coins, removeCoins, unlockTheme } = usePlayerData();

  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [isCoinShopVisible, setIsCoinShopVisible] = useState(false);

  const purchaseTheme = async () => {
    if (coins < 500) {
      setIsWarningVisible(true);
      return;
    } else {
      setIsWarningVisible(false);
      await removeCoins(500);
      await unlockTheme(theme.themeKey);
      setIsModalVisible(false);
    }
  };

  const modalBody = () => {
    return (
      <>
        <Text style={styles.modalText}>Purchase {theme.title} theme?</Text>

        <View style={styles.wrapper}>
          <View style={styles.thumbnail}>
            <Image source={theme.source} style={styles.spriteImage} />
          </View>

          <View style={styles.coinContainer}>
            <Image
              source={require("../assets/icons/coin.png")}
              style={gameStyles.icons.iconSizeSmall}
            />
            <Text style={styles.coinText}>-500</Text>
          </View>
        </View>
        {isWarningVisible && (
          <>
            <Text
              style={{
                color: gameStyles.colors.red,
                marginBottom: 5,
                fontSize: gameStyles.fonts.regularFontSize,
              }}
            >
              Insufficent Funds
            </Text>
            <TouchableOpacity
              accessibilityLabel={`Go to Coin Shop`}
              accessibilityRole="button"
              style={styles.warningButton}
              onPress={() => {
                setIsModalVisible(false); // Hide purchase modal first
                setTimeout(() => setIsCoinShopVisible(true), 300); // Then show coin shop
              }}
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
    justifyContent: "space-between",
    marginVertical: 10,
  },
  thumbnail: {
    width: isTablet ? width * 0.12 : width * 0.2,
    height: isTablet ? width * 0.12 : width * 0.2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20, // Add spacing between the thumbnail and text
  },
  spriteImage: {
    width: isTablet ? width * 0.12 : width * 0.2,
    height: isTablet ? width * 0.12 : width * 0.2,
    resizeMode: "contain",
  },
  modalText: {
    fontSize: gameStyles.fonts.largeFontSize,
    textAlign: "center",
    marginBottom: 10,
  },
  coinContainer: {
    backgroundColor: gameStyles.colors.gray1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    shadowColor: gameStyles.colors.gray3,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  coinText: {
    marginBottom: 2,
    fontSize: gameStyles.fonts.regularFontSize,
    fontFamily: gameStyles.fonts.fontFamily,
    marginLeft: 5,
  },
  warningButton: {
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: gameStyles.colors.gold,
    fontSize: gameStyles.fonts.regularFontSize,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  buyButtonText: {
    fontFamily: gameStyles.fonts.fontFamily,
  },
});

export default PurchaseModal;
