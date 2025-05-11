import { useEffect, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";

const adUnitId = "ca-app-pub-6358927901907597/7024526588";
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
    rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () =>
      setLoaded(true)
    );

    rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async (reward) => {
        console.log("[Pixeldokulogs] User earned reward of ", reward);
        setRewardAmount(reward.amount);
        await incrementAdCount();
      }
    );
  };

  const loadAd = () => {
    setLoaded(false);
    const newRewarded = RewardedAd.createForAdRequest(adUnitId, {
      keywords: ["gaming", "puzzle", "brain games"],
      maxAdContentRating: "PG",
    });
    setRewarded(newRewarded);
    setupListeners(newRewarded);
    newRewarded.load();
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
