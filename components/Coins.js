import React, { useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { useCoins } from "../utils/coinContext";
import themeStyles from "../styles/theme";
import CoinShop from "./CoinShop";
import Coin from "../assets/icons/coin.svg";

const Coins = () => {
  const { coins } = useCoins();
  const [isCoinShopVisible, setIsCoinShopVisible] = useState(false);
  const openShop = () => {
    setIsCoinShopVisible(true);
  };
  return (
    <View style={styles.coinContainer}>
      <Coin width="16px" height="16px" />
      <Text style={styles.coinText} onPress={openShop}>
        {coins}
      </Text>
      <CoinShop
        isCoinShopVisible={isCoinShopVisible}
        setIsCoinShopVisible={setIsCoinShopVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  coinContainer: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: themeStyles.colors.bgcolor3,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  coinText: {
    marginLeft: 4,
    fontSize: 16,
    color: themeStyles.colors.gold,
    fontFamily: themeStyles.fonts.fontFamily,
  },
});

export default Coins;
