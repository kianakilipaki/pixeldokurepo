import { useEffect, useRef, useState } from "react";
import {
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  flushFailedPurchasesCachedAsPendingAndroid,
  finishTransaction,
  requestPurchase,
  getProducts,
} from "react-native-iap";

const useIAP = (onPurchaseSuccess) => {
  const [products, setProducts] = useState([]);
  const lastOrderIdRef = useRef("");
  const itemSKUs = ["500_coins", "1000_coins", "2000_coins", "4000_coins"];

  useEffect(() => {
    let purchaseUpdateSubscription;
    let purchaseErrorSubscription;

    const initializeIAP = async () => {
      try {
        await initConnection();
        await flushFailedPurchasesCachedAsPendingAndroid().catch(() => {});

        // Fetch available products
        if (products.length === 0) {
          const fetchedProducts = await getProducts({ skus: itemSKUs });
          const sortedProducts = [...fetchedProducts].sort(
            (a, b) =>
              parseInt(a.productId.replace("_coins", "")) -
              parseInt(b.productId.replace("_coins", ""))
          );
          setProducts(sortedProducts);
        }
        purchaseUpdateSubscription = purchaseUpdatedListener(
          async (purchase) => {
            const orderId = purchase.transactionReceipt.orderId;

            if (orderId && orderId !== lastOrderIdRef.current) {
              lastOrderIdRef.current = orderId; // Store last receipt without re-rendering
              try {
                console.log("PixelDokuLogs: Purchase updated:", orderId);

                await finishTransaction({ purchase, isConsumable: true }); // Mark as complete
                // Callback to update app state
                onPurchaseSuccess(purchase.productId);
              } catch (error) {
                console.error(
                  "PixelDokuLogs: Error processing purchase:",
                  error
                );
              }
            }
          }
        );

        purchaseErrorSubscription = purchaseErrorListener((error) => {
          console.warn("PixelDokuLogs: Purchase error:", error);
        });
      } catch (error) {
        console.error("PixelDokuLogs: IAP initialization error:", error);
      }
    };

    initializeIAP();

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  }, [onPurchaseSuccess]);

  // Function to trigger a purchase
  const buyProduct = async (sku) => {
    try {
      console.log(`PixelDokuLogs: Attempting to purchase: ${sku}`);
      await requestPurchase({ skus: [sku] }); // For Android
    } catch (error) {
      console.error("PixelDokuLogs: Purchase request failed:", error);
    }
  };

  return { buyProduct, products };
};

export default useIAP;
