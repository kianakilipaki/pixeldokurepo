import React from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { useCoins } from "../utils/coinContext";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const CoinShop = ({ isCoinShopVisible, setIsCoinShopVisible }) => {
  const { addCoins } = useCoins();

  const coinOptions = [
    { coins: 100, cost: "AD" },
    { coins: 500, cost: "$1.99" },
    { coins: 1000, cost: "$2.99" },
    { coins: 2000, cost: "$3.99" },
    { coins: 4000, cost: "$4.99" },
  ];

  const closeModal = () => {
    setIsCoinShopVisible(false);
  };

  const buyCoins = (coins, cost) => {
    addCoins(coins);
    closeModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isCoinShopVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ImageBackground
            source={require("../assets/gradient.png")}
            resizeMode="cover"
            style={styles.modalHeader}
          >
            <Text style={styles.modalHeaderText}>Coin Shop</Text>
          </ImageBackground>

          <View style={styles.modalBody}>
            {coinOptions.map((option, index) => (
              <View style={styles.coinContainer} key={index}>
                <Image
                  source={require("../assets/coin.png")}
                  style={{ width: 24, height: 24, marginRight: 10 }}
                />
                <Text style={styles.coinText}>{option.coins} Coins</Text>
                <Text style={styles.costText}>{option.cost}</Text>
                <TouchableOpacity
                  onPress={() => buyCoins(option.coins, option.cost)}
                  style={styles.buyButton}
                >
                  <Text style={styles.buyButtonText}>Buy</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },
  modalHeader: {
    width: width * 0.9,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  modalBody: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  coinText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  costText: {
    fontSize: 16,
    color: "#555",
    marginHorizontal: 10,
  },
  buyButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});

export default CoinShop;
