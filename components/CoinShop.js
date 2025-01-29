import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useCoins } from "../utils/coinContext";
import themeStyles from "../utils/themeStyles";
import ModalTemplate from "./ModalTemplate";
import { isTablet } from "../utils/assetsMap";
import { useRewardedAd } from "./Ad";

const CoinShop = ({ isCoinShopVisible, setIsCoinShopVisible }) => {
  const { addCoins } = useCoins();

  const coinOptions = [
    { coins: 100, cost: "AD" },
    { coins: 500, cost: "$1.99" },
    { coins: 1000, cost: "$2.99" },
    { coins: 2000, cost: "$3.99" },
    { coins: 4000, cost: "$4.99" },
  ];

  const buyCoins = (coins, cost) => {
    addCoins(coins);
    setIsCoinShopVisible(false);
  };

  const watchAd = useRewardedAd(); // Destructure the returned values

  const handleWatchAd = () => {
    const reward = watchAd();
    console.log(reward);
    if (reward > 0) {
      buyCoins(100); // Add coins after watching the ad
    }
  };

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
            <Text style={styles.costText}>{option.cost}</Text>

            {option.cost == "AD" ? (
              <TouchableOpacity
                onPress={handleWatchAd}
                style={styles.buyButton}
              >
                <Text style={styles.buyButtonText}>Free</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => buyCoins(option.coins, option.cost)}
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
