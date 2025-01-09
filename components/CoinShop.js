import React from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { useCoins } from "../utils/coinContext";

const { width, height } = Dimensions.get("window");

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
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Close" onPress={closeModal} color="#007BFF" />
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
    width: width * 0.85,
    maxHeight: height * 0.8,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
  },
  modalHeader: {
    width: "100%",
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  modalHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modalBody: {
    padding: 15,
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
    backgroundColor: "#007BFF",
    width: 70,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    alignItems: "center",
  },
});

export default CoinShop;
