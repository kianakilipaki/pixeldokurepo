import { useState, useRef } from "react";
import { Animated, Dimensions } from "react-native";

const useThemeAnimation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const heightAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(1)).current;

  const toggleExpansion = () => {
    const toHeight = isExpanded ? 0 : 1;
    const toFade = isExpanded ? 1 : 0;

    Animated.parallel([
      Animated.timing(heightAnimation, {
        toValue: toHeight,
        duration: 500,
        useNativeDriver: false, // height can't be animated with native driver
      }),
      Animated.timing(fadeAnimation, {
        toValue: toFade,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setIsExpanded(!isExpanded));
  };

  const interpolatedHeight = heightAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Dimensions.get("window").height * 0.9],
  });

  return {
    heightAnimation: interpolatedHeight,
    fadeAnimation,
    isExpanded,
    toggleExpansion,
  };
};

export default useThemeAnimation;
