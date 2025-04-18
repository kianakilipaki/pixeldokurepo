import { useEffect, useState } from "react";
import { Platform } from "react-native";
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

const useIAP = (onPurchaseSuccess) => {
  const [products, setProducts] = useState([]);
  const itemSKUs = ["500_coins", "1000_coins", "2000_coins", "4000_coins"];

  const sortProducts = async () => {
    if (products.length === 0) {
      const fetchedProducts = await getProducts({ skus: itemSKUs });
      const sortedProducts = [...fetchedProducts].sort(
        (a, b) =>
          parseInt(a.productId.replace("_coins", "")) -
          parseInt(b.productId.replace("_coins", ""))
      );
      setProducts(sortedProducts);
    }
  };

  useEffect(() => {
    const initIAP = async () => {
      await initConnection()
        .then(() => {
          if (Platform.OS == "android") {
            flushFailedPurchasesCachedAsPendingAndroid();
          } else {
            clearTransactionIOS();
          }
          sortProducts();
        })
        .catch((error) => {
          console.log("PixelDokuLogs: Error initializing IAP: ", error);
        })
        .then(() => {
          const subscriptionListener = purchaseUpdatedListener(
            async (purchase) => {
              if (purchase.transactionReceipt) {
                await new Promise((res) => setTimeout(res, 300));
                await finishTransaction({
                  purchase,
                  isConsumable: true,
                  purchaseToken: purchase.purchaseToken,
                  productId: purchase.productId,
                })
                  .then(() => {
                    onPurchaseSuccess(purchase.productId);
                    return;
                  })
                  .catch((error) => {
                    console.log(
                      "PixelDokuLogs: Error finishing transaction: ",
                      error
                    );
                  });
              }
            }
          );
          return () => {
            subscriptionListener.remove();
          };
        });
    };

    initIAP();

    return () => {
      endConnection();
    };
  }, []);

  const buyProduct = async (sku) => {
    try {
      const params =
        Platform.OS === "android"
          ? { skus: [sku] }
          : { sku, andDangerouslyFinishTransactionAutomaticallyIOS: false };

      await requestPurchase(params);
    } catch (error) {
      console.error("PixelDokuLogs: Purchase request failed:", error);
    }
  };

  return { buyProduct, products };
};

export default useIAP;
