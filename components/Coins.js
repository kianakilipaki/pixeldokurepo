import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Image, Text } from "react-native";
import gameStyles from "../utils/gameStyles";
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
        style={gameStyles.icons.iconSizeSmall}
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
    backgroundColor: gameStyles.colors.gray1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: gameStyles.colors.black1,
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: gameStyles.colors.gray3,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  coinText: {
    marginBottom: 2,
    marginLeft: 4,
    fontSize: gameStyles.fonts.regularFontSize,
    color: gameStyles.colors.black1,
    fontFamily: gameStyles.fonts.fontFamily,
  },
});

export default Coins;
