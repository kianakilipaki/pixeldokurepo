import { useRef, useEffect } from "react";
import { Animated } from "react-native";
import gameStyles from "./gameStyles";
import { useMusic } from "./musicContext";

const useMistakeAnimation = (isErrorCell) => {
  const backgroundAnim = useRef(new Animated.Value(0)).current;
  const { playSoundEffect } = useMusic();

  useEffect(() => {
    if (isErrorCell) {
      playSoundEffect("error");

      Animated.sequence([
        Animated.timing(backgroundAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isErrorCell]);

  return {
    backgroundColor: backgroundAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [gameStyles.colors.gray1, gameStyles.colors.red2],
    }),
  };
};

export default useMistakeAnimation;
