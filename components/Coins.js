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
        style={themeStyles.icons.iconSizeSmall}
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
    backgroundColor: themeStyles.colors.gray1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    shadowColor: themeStyles.colors.gray3,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  coinText: {
    marginBottom: 2,
    marginLeft: 4,
    fontSize: themeStyles.fonts.regularFontSize,
    color: themeStyles.colors.black1,
    fontFamily: themeStyles.fonts.fontFamily,
  },
});

export default Coins;
