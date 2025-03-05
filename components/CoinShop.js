import React, { useEffect } from "react";
import { View, Text, Button, Platform } from "react-native";
import {
  useIAP,
  initConnection,
  getAvailablePurchases,
  requestPurchase,
} from "react-native-iap";

const App = () => {
  const {
    connected,
    products,
    currentPurchase,
    currentPurchaseError,
    getProducts,
  } = useIAP();

  const handlePurchase = async (sku) => {
    try {
      console.log("Attempting to purchase:", sku);
      if (Platform.OS === "ios") {
        await requestPurchase({ sku });
      } else if (Platform.OS === "android") {
        await requestPurchase({ skus: [sku] });
      }
    } catch (error) {
      console.error("Purchase request failed:", error);
    }
  };

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

  useEffect(() => {
    const checkUnfinishedPurchases = async () => {
      if (!connected) {
        console.warn("IAP not connected, skipping unfinished purchases check.");
        return;
      }
      try {
        console.log("Checking for unfinished purchases...");
        const purchases = await getAvailablePurchases();
        console.log("Unfinished purchases processed:", purchases);
      } catch (error) {
        console.error("Error processing unfinished purchases:", error);
      }
    };
    checkUnfinishedPurchases();
  }, [connected]);

  useEffect(() => {
    if (currentPurchaseError) {
      console.error("Purchase Error:", currentPurchaseError);
    }
  }, [currentPurchaseError]);

  useEffect(() => {
    if (currentPurchase) {
      console.log("Purchase successful:", currentPurchase);
    }
  }, [currentPurchase]);

  return (
    <View>
      <Button
        title="Get the products"
        onPress={() =>
          getProducts({
            skus: ["500_coins", "1000_coins", "2000_coins", "4000_coins"],
          })
        }
      />

      {products.map((product) => (
        <View key={product.productId}>
          <Text>{product.productId}</Text>
          <Button
            title="Buy"
            onPress={() => handlePurchase(product.productId)}
          />
        </View>
      ))}
    </View>
  );
};

export default App;
