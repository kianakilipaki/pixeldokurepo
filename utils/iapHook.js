import * as RNIap from "react-native-iap";
import { useState, useEffect } from "react";
import { Alert } from "react-native";

// List of in-app purchase product IDs
const itemSkus = ["500_coins", "1000_coins", "2000_coins", "4000_coins"];

// Initialize IAP connection
const initIAP = async () => {
  try {
    await RNIap.initConnection();
    console.log("✅ IAP Connection Initialized");

    const isBillingSupported = await RNIap.isBillingSupported();
    console.log(`💳 Billing Supported: ${isBillingSupported}`);

    const availableProducts = await RNIap.getProducts(itemSkus);
    console.log("🛍️ Available Products:", availableProducts);

    if (availableProducts.length === 0) {
      console.error(
        "🚨 No products returned. Double-check Play Console setup."
      );
    }

    setProducts(availableProducts);
  } catch (error) {
    console.error("❌ IAP Initialization Error:", error);
  }
};

export const initiatePurchase = async (sku) => {
  try {
    console.log(`🛒 Attempting purchase: ${sku}`);
    await RNIap.requestPurchase(sku);
    console.log(`✅ Purchase started for: ${sku}`);
  } catch (error) {
    console.error("❌ Purchase Error:", error);
  }
};

// Finish the purchase transaction
const finalizePurchase = async (purchase, onSuccess) => {
  try {
    if (purchase.transactionReceipt) {
      onSuccess(purchase.productId);
      await RNIap.finishTransaction(purchase, false);
    }
  } catch (err) {
    console.warn("finishTransaction error", err);
  }
};

// End the IAP connection (call when component unmounts)
export const endIAP = () => {
  RNIap.endConnection();
};

// Custom Hook for Managing IAP
const useIAP = (addCoins, setIsCoinShopVisible) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const setupIAP = async () => {
      const items = await initIAP();
      setProducts(items);
    };

    setupIAP();

    // Listener for purchase updates
    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase) => {
        finalizePurchase(purchase, (productId) => {
          const coinAmounts = {
            "500_coins": 500,
            "1000_coins": 1000,
            "2000_coins": 2000,
            "4000_coins": 4000,
          };

          if (coinAmounts[productId]) {
            addCoins(coinAmounts[productId]);
            setIsCoinShopVisible(false);
          }
        });
      }
    );

    // Listener for purchase errors
    const purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      console.warn("Purchase error", error);
      Alert.alert("Purchase error", error.message);
    });

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
      RNIap.endConnection();
    };
  }, []);

  return { products };
};

export default useIAP;
