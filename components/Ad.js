import { useEffect, useState } from "react";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";

const rewarded = RewardedAd.createForAdRequest(adUnitId);

export const useRewardedAd = () => {
  const [loaded, setLoaded] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);

  const watchAd = () => {
    if (loaded) {
      rewarded.show();
      console.log("ad loaded");
      return rewardAmount;
    } else {
      rewarded.load();
      console.log("ad did not load, trying again ", loaded);
      rewarded.show();
      return rewardAmount;
    }
  };

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("User earned reward of ", reward);
        setRewardAmount(reward.amount);
      }
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  return watchAd;
};
