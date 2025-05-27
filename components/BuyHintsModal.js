import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import CoinShop from "./CoinShop";
import gameStyles, { isTablet } from "../utils/gameStyles";
import { Dimensions } from "react-native";
import ModalTemplate from "./ModalTemplate";
import { usePlayerData } from "../utils/playerDataContext";
import { useGame } from "../utils/gameContext";

const { width } = Dimensions.get("window");

const BuyHintsModal = ({ setIsModalVisible, isModalVisible }) => {
  const { coins, removeCoins } = usePlayerData();
  const { setHints } = useGame();
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [isCoinShopVisible, setIsCoinShopVisible] = useState(false);

  const purchaseHints = () => {
    if (coins < 100) {
      setIsWarningVisible(true);
      return;
    } else {
      setIsWarningVisible(false);
      removeCoins(100);
      setHints(3);
      setIsModalVisible(false);
    }
  };

  const modalBody = () => {
    return (
      <>
        <Text style={styles.modalText}>Purchase Hints?</Text>

        <View style={styles.wrapper}>
          <View style={styles.hintIcon}>
            <Image
              source={require("../assets/icons/hint.png")}
              style={gameStyles.icons.iconSizeMedium}
            />
          </View>

          <View style={styles.coinContainer}>
            <Image
              source={require("../assets/icons/coin.png")}
              style={gameStyles.icons.iconSizeSmall}
            />
            <Text style={styles.coinText}>-100</Text>
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
                setIsWarningVisible(false);
                setIsModalVisible(false);
                setTimeout(() => setIsCoinShopVisible(true), 300);
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
        confirmAction={purchaseHints}
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
  hintIcon: {
    marginRight: 30,
    backgroundColor: gameStyles.colors.blue,
    padding: 10,
    borderRadius: 100,
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

export default BuyHintsModal;
