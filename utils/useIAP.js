import { useFocusEffect } from "@react-navigation/native";
import { useState, useRef, useCallback } from "react";
import { AppState, Platform } from "react-native";
import {
  initConnection,
  purchaseUpdatedListener,
  flushFailedPurchasesCachedAsPendingAndroid,
  finishTransaction,
  requestPurchase,
  getProducts,
  endConnection,
  clearTransactionIOS,
} from "react-native-iap";

const mockProducts = [
  {
    productId: "500_coins",
    title: "500 Coins",
    price: "$1.99",
    currency: "USD",
  },
  {
    productId: "1000_coins",
    title: "1000 Coins",
    price: "$2.99",
    currency: "USD",
  },
  {
    productId: "2000_coins",
    title: "2000 Coins",
    price: "$3.99",
    currency: "USD",
  },
  {
    productId: "4000_coins",
    title: "4000 Coins",
    price: "$4.99",
    currency: "USD",
  },
];

const useIAP = (onPurchaseSuccess) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const purchaseListenerRef = useRef(null);
  const connectionInitializedRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);
  const itemSKUs = ["500_coins", "1000_coins", "2000_coins", "4000_coins"];

  const setupPurchaseListener = () => {
    if (__DEV__) return; // Skip in development

    if (purchaseListenerRef.current) {
      purchaseListenerRef.current.remove();
    }

    purchaseListenerRef.current = purchaseUpdatedListener(async (purchase) => {
      if (purchase.transactionReceipt) {
        try {
          const result = await finishTransaction({
            purchase,
            isConsumable: true,
          });
          if (result) {
            console.log("[Pixeldokulogs] Completing transaction: ", result);
            onPurchaseSuccess(purchase.productId);
            setErrorMsg(null);
          } else {
            setErrorMsg("There was a problem completing purchase");
          }
        } catch (err) {
          return;
        } finally {
          setIsPurchasing(false); // <- here
        }
      }
    });
  };

  const loadProducts = async () => {
    try {
      if (__DEV__) {
        // Use mock products in development
        setProducts(mockProducts);
        return;
      }
      setIsLoading(true);
      const fetchedProducts = await getProducts({ skus: itemSKUs });
      const sortedProducts = [...fetchedProducts].sort((a, b) => {
        const aValue = parseInt(a.productId.replace("_coins", ""));
        const bValue = parseInt(b.productId.replace("_coins", ""));
        return aValue - bValue;
      });
      setProducts(sortedProducts);
      setErrorMsg(null);
      setIsLoading(false);
    } catch (err) {
      console.log("[Pixeldokulogs] Error fetching products:", err);
      if (!__DEV__) {
        setErrorMsg("Failed to load products");
      }
    }
  };

  const initializeIAP = async () => {
    try {
      if (!__DEV__) {
        const result = await initConnection();
        if (result) {
          connectionInitializedRef.current = true;

          if (Platform.OS === "android") {
            await flushFailedPurchasesCachedAsPendingAndroid();
          } else {
            await clearTransactionIOS();
          }

          setupPurchaseListener();
          await loadProducts();
          setErrorMsg(null);
        }
      } else {
        await loadProducts();
        setErrorMsg(null);
      }
    } catch (err) {
      console.log("[Pixeldokulogs] Error initializing IAP:", err);
      if (!__DEV__) {
        setErrorMsg(
          "You must be connected to the internet to access coin shop"
        );
        connectionInitializedRef.current = false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const handleAppStateChange = (nextAppState) => {
        if (
          appStateRef.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          initializeIAP();
        }
        appStateRef.current = nextAppState;
      };

      const appStateSubscription = AppState.addEventListener(
        "change",
        handleAppStateChange
      );

      // Initial setup
      if (appStateRef.current === "active") {
        initializeIAP();
      }

      return () => {
        if (!__DEV__ && purchaseListenerRef.current) {
          purchaseListenerRef.current.remove();
        }
        appStateSubscription.remove();
        if (!__DEV__) {
          endConnection();
        }
      };
    }, [])
  );

  const buyProduct = async (sku) => {
    if (isPurchasing) return; // Prevent multiple taps
    setIsPurchasing(true);
    try {
      if (__DEV__) {
        // Simulate successful purchase in development
        setTimeout(() => {
          onPurchaseSuccess(sku);
          setIsPurchasing(false);
        }, 500);
        return;
      }

      if (!connectionInitializedRef.current) {
        await initializeIAP();
      }

      const params =
        Platform.OS === "android"
          ? { skus: [sku] }
          : {
              sku,
              andDangerouslyFinishTransactionAutomaticallyIOS: false,
            };

      await requestPurchase(params);
    } catch (err) {
      if (err.code === "E_USER_CANCELLED") {
        console.log("[Pixeldokulogs] Purchase cancelled by user");
      } else {
        console.error("[Pixeldokulogs] Purchase request failed:", err);
        setErrorMsg("Purchase failed. Please try again.");
      }
      setIsPurchasing(false);
    }
  };

  return {
    buyProduct,
    products,
    isLoading,
    isPurchasing,
    errorMsg,
  };
};

export default useIAP;
