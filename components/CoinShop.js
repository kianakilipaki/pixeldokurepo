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
import { useCoinShopRewardedAd } from "./CoinShopAd";
import gameStyles from "../utils/gameStyles";
import useIAP from "../utils/IAPContext";
import { usePlayerData } from "../utils/playerDataContext";
import { AntDesign } from "@expo/vector-icons";

const CoinShop = ({ isCoinShopVisible, setIsCoinShopVisible }) => {
  const { addCoins, handleFacebookFollow, facebookFollowed } = usePlayerData();
  const { watchAd, rewardAmount, setRewardAmount, loaded, adCount } =
    useCoinShopRewardedAd();
  useEffect(() => {
    if (rewardAmount > 0) {
      console.log("[Pixeldokulogs] Reward received:", rewardAmount);
      addCoins(rewardAmount);
      setIsCoinShopVisible(false);
      setRewardAmount(0);
    }
  }, [rewardAmount]);

  const handlePurchaseSuccess = (productId) => {
    console.log(`[Pixeldokulogs] Adding coins for: ${productId}`);
    const coinsToAdd = parseInt(productId.split("_")[0], 10) || 0;
    if (coinsToAdd > 0) {
      addCoins(coinsToAdd);
      setIsCoinShopVisible(false);
    }
  };

  const handleFacebookFollowLogged = async () => {
    handleFacebookFollow();
  };

  // Initialize IAP only in production
  const { buyProduct, products, isLoading, errorMsg, isPurchasing } =
    useIAP(handlePurchaseSuccess) || {};

  const modalBody = () => (
    <>
      {isLoading && <ActivityIndicator size="large" color="black" />}
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      <View style={styles.coinContainer}>
        <Image
          source={require("../assets/icons/coin.png")}
          style={gameStyles.icons.iconSizeMedium}
        />
        <Text style={styles.coinText}>100 Coins</Text>
        <Text style={styles.costText}>
          <AntDesign name="facebook-square" size={28} color="#1877F2" />
          &nbsp;Follow
        </Text>
        <TouchableOpacity
          onPress={handleFacebookFollowLogged}
          style={[styles.buyButton, facebookFollowed && styles.disabledButton]}
          disabled={facebookFollowed}
        >
          <Text style={styles.followButtonText}>Free</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.coinContainer}>
        <Image
          source={require("../assets/icons/coin.png")}
          style={gameStyles.icons.iconSizeMedium}
        />
        <Text style={styles.coinText}>100 Coins</Text>
        <Text style={styles.costText}>AD {adCount}/3</Text>
        <TouchableOpacity
          onPress={watchAd}
          style={[
            styles.buyButton,
            !loaded || (adCount >= 3 && styles.disabledButton),
          ]}
          disabled={!loaded || adCount >= 3}
        >
          {loaded ? (
            <Text style={styles.followButtonText}>Free</Text>
          ) : (
            <ActivityIndicator size="small" color="white" />
          )}
        </TouchableOpacity>
      </View> */}
      {products?.map((product) => (
        <View style={styles.coinContainer} key={product.productId}>
          <Image
            source={require("../assets/icons/coin.png")}
            style={gameStyles.icons.iconSizeMedium}
          />
          <Text style={styles.coinText}>
            {product.title.replace("(PixelDoku)", "")}
          </Text>
          <Text style={styles.costText}>{product.price}</Text>
          <TouchableOpacity
            onPress={() => buyProduct(product.productId)}
            style={[styles.buyButton, isPurchasing && styles.disabledButton]}
            disabled={isPurchasing}
          >
            {isPurchasing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buyButtonText}>Buy</Text>
            )}
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
    fontSize: gameStyles.fonts.regularFontSize,
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
    color: "#333",
  },
  costText: {
    fontSize: gameStyles.fonts.regularFontSize,
    color: "#555",
    marginHorizontal: 10,
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  buyButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: gameStyles.colors.blue,
    width: 80,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  followButtonText: {
    color: "white",
    fontSize: gameStyles.fonts.regularFontSize - 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  buyButtonText: {
    color: "white",
    fontSize: gameStyles.fonts.regularFontSize,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    fontSize: 12,
    color: gameStyles.colors.red,
    marginHorizontal: 10,
    textAlign: "center",
  },
});

export default CoinShop;
