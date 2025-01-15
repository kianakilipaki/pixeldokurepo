import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useCoins } from "../utils/coinContext";
import themeStyle from "../utils/themeStyles";
import ModalTemplate from "./ModalTemplate";

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

  const modalBody = () => {
    return (
      <>
        {coinOptions.map((option, index) => (
          <View style={styles.coinContainer} key={index}>
            <Image
              source={require("../assets/icons/coin.png")}
              style={{ width: 30, height: 30 }}
            />
            <Text style={styles.coinText}>{option.coins} Coins</Text>
            <Text style={styles.costText}>{option.cost}</Text>
            <TouchableOpacity
              onPress={() => buyCoins(option.coins, option.cost)}
              style={styles.buyButton}
            >
              {option.cost == "AD" ? (
                <Text style={styles.buyButtonText}>Free</Text>
              ) : (
                <Text style={styles.buyButtonText}>Buy</Text>
              )}
            </TouchableOpacity>
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
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
    color: "#333",
  },
  costText: {
    fontSize: 16,
    color: "#555",
    marginHorizontal: 10,
    textAlign: "center",
  },
  buyButton: {
    backgroundColor: themeStyle.colors.blue,
    width: 70,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buyButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CoinShop;
