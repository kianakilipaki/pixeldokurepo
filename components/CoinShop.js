import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import ModalTemplate from "./ModalTemplate";
import { useCoins } from "../utils/coinContext";
import { useRewardedAd } from "./Ad";
import themeStyles from "../utils/themeStyles";

// Conditionally import useIAP only in production
let useIAP;
if (!__DEV__) {
  useIAP = require("../utils/useIAP").default;
}

const CoinShop = ({ isCoinShopVisible, setIsCoinShopVisible }) => {
  const { addCoins } = useCoins();
  const { watchAd, rewardAmount, setRewardAmount, loaded } = useRewardedAd();

  useEffect(() => {
    if (rewardAmount > 0) {
      console.log("Reward received:", rewardAmount);
      addCoins(rewardAmount);
      setIsCoinShopVisible(false);
      setRewardAmount(0);
    }
  }, [rewardAmount]);

  const handlePurchaseSuccess = (productId) => {
    console.log(`PixelDokuLogs: Adding coins for: ${productId}`);
    const coinsToAdd = parseInt(productId.split("_")[0], 10) || 0;
    if (coinsToAdd > 0) {
      addCoins(coinsToAdd);
      setIsCoinShopVisible(false);
    }
  };

  // Initialize IAP only in production
  const iapProps = !__DEV__ && useIAP ? useIAP(handlePurchaseSuccess) : {};

  const { buyProduct, products, errorMsg } = iapProps || {};

  const modalBody = () => (
    <>
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      <View style={styles.coinContainer}>
        <Image
          source={require("../assets/icons/coin.png")}
          style={themeStyles.icons.iconSizeMedium}
        />
        <Text style={styles.coinText}>100 Coins</Text>
        <Text style={styles.costText}>AD</Text>
        <TouchableOpacity
          onPress={watchAd}
          style={[styles.buyButton, !loaded && styles.disabledButton]}
          disabled={!loaded}
        >
          {loaded ? (
            <Text style={styles.buyButtonText}>Free</Text>
          ) : (
            <ActivityIndicator size="small" color="white" />
          )}
        </TouchableOpacity>
      </View>
      {!__DEV__ &&
        products?.map((product) => (
          <View style={styles.coinContainer} key={product.productId}>
            <Image
              source={require("../assets/icons/coin.png")}
              style={themeStyles.icons.iconSizeMedium}
            />
            <Text style={styles.coinText}>
              {product.title.replace("(PixelDoku)", "")}
            </Text>
            <Text style={styles.costText}>{product.price}</Text>
            <TouchableOpacity
              onPress={() => buyProduct(product.productId)}
              style={styles.buyButton}
            >
              <Text style={styles.buyButtonText}>Buy</Text>
            </TouchableOpacity>
          </View>
        ))}
    </>
  );

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
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeStyles.colors.blue,
    width: 80,
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
  errorText: {
    fontSize: 12,
    color: themeStyles.colors.red,
    marginHorizontal: 10,
    textAlign: "center",
  },
});

export default CoinShop;
