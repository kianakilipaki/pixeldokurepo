import { useEffect, useState } from "react";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : "ca-app-pub-6358927901907597/2631763735";

export const useRewardedAd = () => {
  const [loaded, setLoaded] = useState(false);
  const [rewarded, setRewarded] = useState(() =>
    RewardedAd.createForAdRequest(adUnitId)
  );
  const [rewardAmount, setRewardAmount] = useState(0);

  useEffect(() => {
    const loadAd = () => {
      setLoaded(false); // Reset state before loading
      rewarded.load();
    };

    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => setLoaded(true)
    );

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("User earned reward of ", reward);
        setRewardAmount(reward.amount);
      }
    );

    // Load ad initially
    loadAd();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [rewarded]); // Re-run effect when rewarded ad instance changes

  const watchAd = () => {
    if (loaded) {
      rewarded.show();
    } else {
      console.log("Ad not loaded, reloading...");
      const newRewarded = RewardedAd.createForAdRequest(adUnitId);
      setRewarded(newRewarded);
      newRewarded.load(); // Try loading again
    }
  };

  return { watchAd, rewardAmount };
};
