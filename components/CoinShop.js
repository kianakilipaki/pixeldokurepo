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

  console.log("PixelDokuLogs: Component rendered");

  // Reward user with coins if they watched an ad
  useEffect(() => {
    if (rewardAmount > 0) {
      console.log("PixelDokuLogs: Reward received:", rewardAmount);
      addCoins(rewardAmount);
      setIsCoinShopVisible(false);
    }
  }, [rewardAmount]);

  const itemSKUs = Platform.select({
    android: ["500_coins", "1000_coins", "2000_coins", "4000_coins"],
  });

  // Connect and Get products from play store.
  useEffect(() => {
    const fetchProducts = async () => {
      if (connected) {
        try {
          console.log("PixelDokuLogs: Getting products...");
          await getProducts({ skus: itemSKUs });
        } catch (error) {
          console.error("PixelDokuLogs: IAP Initialization Error:", error);
          setErrorMsg(`IAP Initialization Error: ${error.message}`);
        }
      } else {
        try {
          console.error("PixelDokuLogs: IAP Initializing...");
          await initConnection();
        } catch (error) {
          console.error("PixelDokuLogs: IAP Initialization Error:", error);
          setErrorMsg(`IAP Initialization Error: ${error.message}`);
        }
      }
      console.log("PixelDokuLogs: connected", connected);
      console.log("PixelDokuLogs: products", products);
    };

    fetchProducts();
  }, [connected]);

  // currentPurchase will change when the requestPurchase function is called. The purchase then needs to be checked and the purchase acknowledged so Google knows we have awarded the user the in-app product.
  useEffect(() => {
    const checkCurrentPurchase = async () => {
      if (!currentPurchase) return;

      const { transactionReceipt, productId } = currentPurchase;
      if (!transactionReceipt || !productId) return;

      const coinsToAdd = parseInt(productId.split("_")[0], 10) || 0;
      if (coinsToAdd > 0) {
        addCoins(coinsToAdd);
        setIsCoinShopVisible(false);
        console.log(`PixelDokuLogs: Added ${coinsToAdd} coins`);
      }

      try {
        await finishTransaction(currentPurchase, false);
        console.log("PixelDokuLogs: Transaction finished successfully.");
      } catch (ackErr) {
        console.error("PixelDokuLogs: ackError:", ackErr);
        setErrorMsg(`Transaction Error: ${ackErr.message}`);
      }
    };

    checkCurrentPurchase();
  }, [currentPurchase]);

  useEffect(() => {
    if (currentPurchaseError) {
      console.log("PixelDokuLogs: Purchase Error: ", currentPurchaseError);
      setErrorMsg(`Purchase request failed: ${error.message}`);
    }
  }, [currentPurchaseError]);

  // Handles in-app purchase request
  const handlePurchase = async (sku) => {
    try {
      if (!connected) {
        setErrorMsg("Please check your internet connection");
      }
      console.log("PixelDokuLogs: Attempting to purchase:", sku);
      const purchaseParams =
        Platform.OS === "android" ? { skus: [sku] } : { sku };
      await requestPurchase(purchaseParams).then((purchaseData) => {
        console.log(
          "PixelDokuLogs: Purchase Data:",
          JSON.stringify(purchaseData, null, 2)
        );
      });
    } catch (error) {
      setErrorMsg(`Purchase request failed: ${error.message}`);
    }
  };

  // Sort products based on coin amount (ascending order)
  const sortedProducts = [...products].sort(
    (a, b) =>
      parseInt(a.productId.replace("_coins", "")) -
      parseInt(b.productId.replace("_coins", ""))
  );

  // Modal content displaying available purchases
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
