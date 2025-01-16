import React, { useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { useCoins } from "../utils/coinContext";
import themeStyles from "../utils/themeStyles";
import CoinShop from "./CoinShop";

const Coins = () => {
  const { coins } = useCoins();
  const [isCoinShopVisible, setIsCoinShopVisible] = useState(false);
  const openShop = () => {
    setIsCoinShopVisible(true);
  };
  return (
    <View style={styles.coinContainer}>
      <Image
        source={require("../assets/icons/coin.png")}
        style={{ width: 16, height: 16 }}
      />
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
    top: 30,
    right: 10,
    backgroundColor: themeStyles.colors.gray3,
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
