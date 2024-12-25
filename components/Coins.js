import React, { useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { useCoins } from "../utils/coinContext";
import theme from "../styles/theme";
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
        source={require("../assets/coin.png")}
        style={{ width: 16, height: 16, marginRight: 5 }}
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
    backgroundColor: theme.colors.bgcolor3,
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
    fontSize: 16,
    color: theme.colors.gold,
    fontFamily: theme.fonts.fontFamily,
  },
});

export default Coins;
