import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const iosAdUnitId = "ca-app-pub-6358927901907597/3374480639";
const androidAdUnitId = "ca-app-pub-6358927901907597/7024526588";

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === "android"
  ? androidAdUnitId
  : iosAdUnitId;
const MAX_ADS_PER_DAY = 5;
const STORAGE_KEY = "rewardedAdData";

export const useCoinShopRewardedAd = () => {
  const [loaded, setLoaded] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [adCount, setAdCount] = useState(0);
  const [rewarded, setRewarded] = useState(() =>
    RewardedAd.createForAdRequest(adUnitId, {
      keywords: ["gaming", "puzzle", "brain games"],
      maxAdContentRating: "PG",
    })
  );

  const setupListeners = (rewardedAd) => {
    try {
      rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        try {
          setLoaded(true);
        } catch (error) {
          console.log("[Pixeldokulogs] Error in LOADED event listener:", error);
        }
      });

      rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        async (reward) => {
          try {
            console.log("[Pixeldokulogs] User earned reward of ", reward);
            setRewardAmount(100);
            await incrementAdCount();
          } catch (error) {
            console.log(
              "[Pixeldokulogs] Error in EARNED_REWARD event listener:",
              error
            );
          }
        }
      );

      rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.log("Rewarded ad failed to load:", error);
      });
    } catch (error) {
      console.log("[Pixeldokulogs] Error setting up ad listeners:", error);
    }
  };

  const loadAd = () => {
    try {
      setLoaded(false);
      const newRewarded = RewardedAd.createForAdRequest(adUnitId, {
        keywords: ["gaming", "puzzle", "brain games"],
        maxAdContentRating: "PG",
      });
      setRewarded(newRewarded);
      setupListeners(newRewarded);
      newRewarded.load();
    } catch (error) {
      console.log("[Pixeldokulogs] Error in loadAd:", error);
    }
  };

  const incrementAdCount = async () => {
    const today = new Date().toDateString();
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    let data = stored ? JSON.parse(stored) : { date: today, count: 0 };

    if (data.date !== today) {
      data = { date: today, count: 0 };
    }

    data.count += 1;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setAdCount(data.count);
  };

  const checkAdLimit = async () => {
    const today = new Date().toDateString();
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    let data = stored ? JSON.parse(stored) : { date: today, count: 0 };

    if (data.date !== today) {
      data = { date: today, count: 0 };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    setAdCount(data.count);
    return data.count < MAX_ADS_PER_DAY;
  };

  useEffect(() => {
    setupListeners(rewarded);
    loadAd();
    checkAdLimit(); // Check on mount
  }, []);

  const watchAd = async () => {
    const canWatch = await checkAdLimit();
    if (!canWatch) {
      Alert.alert("Ad Limit Reached", "You can only watch 5 ads per day.");
      return;
    }

    if (loaded) {
      rewarded.show();
      setTimeout(loadAd, 3000);
    } else {
      Alert.alert("Ad not loaded, retrying...");
      setTimeout(loadAd, 2000);
    }
  };

  return { watchAd, rewardAmount, setRewardAmount, loaded, adCount };
};
