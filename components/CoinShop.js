import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useCoins } from "../utils/coinContext";
import themeStyles from "../utils/themeStyles";
import ModalTemplate from "./ModalTemplate";
import { isTablet } from "../utils/assetsMap";
import { useRewardedAd } from "./Ad";
import {
  requestPurchase,
  useIAP,
  getAvailablePurchases,
  finishTransaction,
} from "react-native-iap";

const CoinShop = ({ isCoinShopVisible, setIsCoinShopVisible }) => {
  const { addCoins } = useCoins();
  const { watchAd, rewardAmount } = useRewardedAd();
  const {
    connected,
    products,
    currentPurchase,
    currentPurchaseError,
    getProducts,
  } = useIAP();

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const checkUnfinishedPurchases = async () => {
      try {
        console.log("Checking for unfinished purchases...");
        const purchases = await getAvailablePurchases();
        for (const purchase of purchases) {
          await finishTransaction({ purchase });
        }
        console.log("Unfinished purchases processed:", purchases);
      } catch (error) {
        console.error("Error processing unfinished purchases:", error);
        setIsError(true);
      }
    };

    checkUnfinishedPurchases();
  }, []);

  useEffect(() => {
    console.log("IAP connected:", connected);
    if (connected) {
      getProducts({
        skus: ["500_coins", "1000_coins", "2000_coins", "4000_coins"],
      })
        .then(() => console.log("Products retrieved successfully"))
        .catch((error) => {
          console.error("Error fetching products:", error);
          setIsError(true);
        });
    }
  }, [connected]);

  useEffect(() => {
    if (rewardAmount > 0) {
      console.log("Reward received:", rewardAmount);
      addCoins(rewardAmount);
      setIsCoinShopVisible(false);
    }
  }, [rewardAmount]);

  useEffect(() => {
    if (currentPurchaseError) {
      console.error("Purchase Error:", currentPurchaseError);
      Alert.alert(
        "Purchase Error",
        currentPurchaseError?.message || "Unknown error occurred."
      );
      setIsError(true);
    }
  }, [currentPurchaseError]);

  useEffect(() => {
    if (currentPurchase) {
      console.log("Purchase successful:", currentPurchase);
      addCoins(parseInt(currentPurchase.productId.replace("_coins", "")));
      setIsCoinShopVisible(false);
      setIsError(false);
    }
  }, [currentPurchase]);

  useEffect(() => {
    if (products.length === 0) {
      console.warn(
        "No products found! Ensure products are set up correctly in the store."
      );
    }
  }, [products]);

  const buyCoins = async (sku) => {
    if (!connected) {
      console.error("IAP not connected. Cannot proceed with purchase.");
      Alert.alert("Error", "In-app purchases are not available at the moment.");
      setIsError(true);

      return;
    }

    try {
      console.log("Attempting to purchase:", sku);
      await requestPurchase(sku);
    } catch (error) {
      console.error("Purchase request failed:", error);
      Alert.alert("Purchase Error", error.message || "Something went wrong.");
      setIsError(true);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const numA = parseInt(a.productId.replace("_coins", ""));
    const numB = parseInt(b.productId.replace("_coins", ""));
    return numA - numB;
  });

  const modalBody = () => (
    <>
      {isError ? (
        <Text style={styles.errorText}>
          Something went wrong. Please try again later.
        </Text>
      ) : (
        <></>
      )}
      <View style={styles.coinContainer}>
        <Image
          source={require("../assets/icons/coin.png")}
          style={themeStyles.icons.iconSizeMedium}
        />
        <Text style={styles.coinText}>100 Coins</Text>
        <Text style={styles.costText}>AD</Text>
        <TouchableOpacity onPress={watchAd} style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Free</Text>
        </TouchableOpacity>
      </View>
      {sortedProducts.map((product) => (
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
            onPress={() => buyCoins(product.productId)}
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
    width: isTablet ? 100 : 80,
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
