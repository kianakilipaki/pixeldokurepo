import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useCoins } from "../utils/coinContext";
import themeStyles from "../utils/themeStyles";
import ModalTemplate from "./ModalTemplate";
import { isTablet } from "../utils/assetsMap";
import { useRewardedAd } from "./Ad";
import useIAP, { initiatePurchase } from "../utils/iapHook";

const CoinShop = ({ isCoinShopVisible, setIsCoinShopVisible }) => {
  const { addCoins } = useCoins();
  const { watchAd, rewardAmount } = useRewardedAd();
  const { products } = useIAP(addCoins, setIsCoinShopVisible);

  const coinOptions = [
    { coins: 100, cost: "AD", sku: null },
    { coins: 500, cost: "$1.99", sku: "500_coins" },
    { coins: 1000, cost: "$2.99", sku: "1000_coins" },
    { coins: 2000, cost: "$3.99", sku: "2000_coins" },
    { coins: 4000, cost: "$4.99", sku: "4000_coins" },
  ];

  useEffect(() => {
    if (rewardAmount > 0) {
      addCoins(100);
      setIsCoinShopVisible(false);
    }
  }, [rewardAmount]);

  const buyCoins = (coins, sku) => {
    if (sku) {
      initiatePurchase(sku);
    } else {
      addCoins(coins);
      setIsCoinShopVisible(false);
    }
  };
  useEffect(() => {
    const setupIAP = async () => {
      const items = await initIAP();
      console.log("Available IAP Products:", items);
    };
    setupIAP();
  }, []);

  const modalBody = () => {
    return (
      <>
        {coinOptions.map((option, index) => (
          <View style={styles.coinContainer} key={index}>
            <Image
              source={require("../assets/icons/coin.png")}
              style={themeStyles.icons.iconSizeMedium}
            />
            <Text style={styles.coinText}>{option.coins} Coins</Text>
            <Text style={styles.costText}>
              {option.sku
                ? products.find((p) => p.productId === option.sku)
                    ?.localizedPrice || option.cost
                : option.cost}
            </Text>

            {option.cost === "AD" ? (
              <TouchableOpacity onPress={watchAd} style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Free</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => buyCoins(option.coins, option.sku)}
                style={styles.buyButton}
              >
                <Text style={styles.buyButtonText}>Buy</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </>
    );
  };

  return (
    <ModalTemplate
      modalTitle="Coin Shop"
      modalBody={modalBody()}
      modalVisible={isCoinShopVisible}
      setModalVisible={setIsCoinShopVisible}
    />
  );
};

const styles = StyleSheet.create({
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  coinText: {
    marginLeft: 10,
    fontSize: themeStyles.fonts.regularFontSize,
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
    color: "#333",
  },
  costText: {
    fontSize: themeStyles.fonts.regularFontSize,
    color: "#555",
    marginHorizontal: 10,
    textAlign: "center",
  },
  buyButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeStyles.colors.blue,
    width: isTablet ? 100 : 80,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buyButtonText: {
    color: "white",
    fontSize: themeStyles.fonts.regularFontSize,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CoinShop;
