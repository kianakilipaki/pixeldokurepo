import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Image, Text } from "react-native";
import themeStyles from "../utils/themeStyles";
import CoinShop from "./CoinShop";
import { usePlayerData } from "../utils/playerDataContext";

const Coins = () => {
  const { coins } = usePlayerData();
  const [isCoinShopVisible, setIsCoinShopVisible] = useState(false);
  const openShop = () => {
    setIsCoinShopVisible(true);
  };
  return (
    <TouchableOpacity
      style={styles.coinContainer}
      accessibilityLabel={`Coins: ${coins}. Click to open coin shop.`}
      accessibilityRole="button"
      onPress={openShop}
    >
      <Image
        source={require("../assets/icons/coin.png")}
        style={themeStyles.icons.iconSizeSmall}
      />
      <Text style={styles.coinText}>{coins}</Text>
      <CoinShop
        isCoinShopVisible={isCoinShopVisible}
        setIsCoinShopVisible={setIsCoinShopVisible}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  coinContainer: {
    maxWidth: 100,
    backgroundColor: themeStyles.colors.gray1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themeStyles.colors.black1,
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
