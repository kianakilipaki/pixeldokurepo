import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import {
  useIAP,
  initConnection,
  getAvailablePurchases,
  requestPurchase,
  useRef,
} from "react-native-iap";
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
    currentPurchase,
    currentPurchaseError,
    getProducts,
  } = useIAP();

  const [isError, setIsError] = useState(false);

  // Initialize In-App Purchases (IAP) on component mount
  useEffect(() => {
    const initializeIAP = async () => {
      try {
        console.log("Initializing IAP connection...");
        await initConnection();
        console.log("IAP connection initialized.");
      } catch (error) {
        console.error("IAP Initialization Error:", error);
      }
    };
    initializeIAP();
  }, []);

  // Fetch products and check for unfinished purchases when connected
  useEffect(() => {
    if (connected) {
      getProducts({
        skus: ["500_coins", "1000_coins", "2000_coins", "4000_coins"],
      })
        .then(() => console.log("Products retrieved successfully"))
        .catch((error) => {
          console.error("Error fetching products:", error);
          setIsError(true);
        });

      (async () => {
        try {
          console.log("Checking for unfinished purchases...");
          const purchases = await getAvailablePurchases();
          console.log("Unfinished purchases processed:", purchases);
        } catch (error) {
          console.error("Error processing unfinished purchases:", error);
        }
      })();
    }
  }, [connected]);

  // Handle purchase success and errors
  const processedPurchases = useRef(new Set()); // Store processed purchases

  useEffect(() => {
    if (currentPurchaseError) {
      console.error("Purchase Error:", currentPurchaseError);
      setIsError(true);
    }

    if (currentPurchase) {
      const { productId, purchaseToken } = currentPurchase;

      // Prevent duplicate processing of the same purchase
      if (processedPurchases.current.has(purchaseToken)) {
        console.log("Purchase already processed:", productId);
        return;
      }

      processedPurchases.current.add(purchaseToken); // Mark as processed

      const coinsToAdd = parseInt(productId.replace("_coins", ""), 10);
      addCoins(coinsToAdd);
      setIsCoinShopVisible(false);

      console.log("Purchase successful:", currentPurchase);
      console.log("Coins added:", coinsToAdd);

      setIsError(false);
    }
  }, [currentPurchaseError, currentPurchase]);

  // Reward user with coins if they watched an ad
  useEffect(() => {
    if (rewardAmount > 0) {
      console.log("Reward received:", rewardAmount);
      addCoins(rewardAmount);
      setIsCoinShopVisible(false);
    }
  }, [rewardAmount]);

  // Handles in-app purchase request
  const handlePurchase = async (sku) => {
    try {
      console.log("Attempting to purchase:", sku);
      const purchaseParams =
        Platform.OS === "android" ? { skus: [sku] } : { sku };
      await requestPurchase(purchaseParams);
    } catch (error) {
      console.error("Purchase request failed:", error);
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
      {isError && (
        <Text style={styles.errorText}>
          Something went wrong. Please try again later.
        </Text>
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
