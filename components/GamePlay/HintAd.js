import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const androidAdUnitId = "ca-app-pub-6358927901907597/4751686655";
const iosAdUnitId = "ca-app-pub-6358927901907597/8062866382";

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === "android"
  ? androidAdUnitId
  : iosAdUnitId;
export const useHintRewardedAd = () => {
  const [loaded, setLoaded] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
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
      (reward) => {
        console.log("[Pixeldokulogs] User earned hint reward");
        setRewardAmount(reward.amount);
      }
    );
  };

  const loadAd = () => {
    setLoaded(false); // Reset state before loading
    const newRewarded = RewardedAd.createForAdRequest(adUnitId, {
      keywords: ["gaming", "puzzle", "brain games"],
      maxAdContentRating: "PG",
    });
    setRewarded(newRewarded);
    setupListeners(newRewarded);
    newRewarded.load();
  };

  useEffect(() => {
    setupListeners(rewarded);
    loadAd(); // Initial load
  }, []); // Runs once on mount

  const watchAd = () => {
    if (loaded) {
      rewarded.show();
      setTimeout(loadAd, 3000); // Ensure a small delay before reloading
    } else {
      Alert.alert("Ad not loaded, retrying...");
      setTimeout(loadAd, 2000); // Retry after 2 seconds
    }
  };

  return { watchAd, rewardAmount, setRewardAmount, loaded };
};
