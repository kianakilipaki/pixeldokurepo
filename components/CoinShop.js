import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import { useIAP, requestPurchase, initConnection } from "react-native-iap";
import ModalTemplate from "./ModalTemplate";
import { useCoins } from "../utils/coinContext";
import { useRewardedAd } from "./Ad";
import themeStyles from "../utils/themeStyles";

const CoinShop = ({ isCoinShopVisible, setIsCoinShopVisible }) => {
  const { addCoins } = useCoins();
  const { watchAd, rewardAmount } = useRewardedAd();
  const {
    connected,
    products,
    getProducts,
    finishTransaction,
    currentPurchase,
    currentPurchaseError,
  } = useIAP();

  const [errorMsg, setErrorMsg] = useState("");

  const itemSKUs = Platform.select({
    android: ["500_coins", "1000_coins", "2000_coins", "4000_coins"],
  });

  // Fetch products from the store
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!connected) {
          await initConnection();
        }
        await getProducts({ skus: itemSKUs });
      } catch (error) {
        console.error("PixelDokuLogs: IAP Initialization Error:", error);
        setErrorMsg("IAP Initialization Error");
      }
    };

    fetchProducts();
  }, []);

  // Handle purchase updates
  useEffect(() => {
    const processPurchase = async (purchase) => {
      if (!purchase) return;

      console.log("PixelDokuLogs: Processing purchase:", purchase);
      const coinsToAdd = parseInt(purchase.productId.split("_")[0], 10) || 0;

      if (coinsToAdd > 0) {
        addCoins(coinsToAdd);
        setIsCoinShopVisible(false);
        console.log(`PixelDokuLogs: Added ${coinsToAdd} coins`);
      }

      try {
        await finishTransaction({ purchase, isConsumable: false });
      } catch (error) {
        console.error("PixelDokuLogs: Error finishing transaction:", error);
        setErrorMsg("Transaction error");
      }
    };

    if (currentPurchase) {
      processPurchase(currentPurchase);
    }
  }, [currentPurchase]);

  // Handle purchase errors
  useEffect(() => {
    if (currentPurchaseError) {
      console.error("PixelDokuLogs: Purchase Error:", currentPurchaseError);
      setErrorMsg("Purchase Error");
    }
  }, [currentPurchaseError]);

  // Handle rewarded ad rewards
  useEffect(() => {
    if (rewardAmount > 0) {
      console.log("Reward received:", rewardAmount);
      addCoins(rewardAmount);
      setIsCoinShopVisible(false);
    }
  }, [rewardAmount]);

  // Handle one-time product purchase
  const handlePurchase = async (sku) => {
    try {
      setErrorMsg("");

      const purchaseParams =
        Platform.OS === "android" ? { skus: [sku] } : { sku };

      console.log("PixelDokuLogs: Attempting to purchase:", sku);
      await requestPurchase(purchaseParams);
    } catch (error) {
      console.error("PixelDokuLogs: Purchase request failed:", error);
      setErrorMsg("Purchase request failed");
    }
  };

  // Sort products by coin amount (ascending)
  const sortedProducts = [...products].sort(
    (a, b) =>
      parseInt(a.productId.replace("_coins", "")) -
      parseInt(b.productId.replace("_coins", ""))
  );

  // Modal content
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
            onPress={() => handlePurchase(product.productId)}
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
