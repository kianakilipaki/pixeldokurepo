import { useRef, useEffect } from "react";
import { Animated } from "react-native";
import themeStyles from "./themeStyles";
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
      outputRange: [themeStyles.colors.gray1, themeStyles.colors.red2],
    }),
  };
};

export default useMistakeAnimation;
