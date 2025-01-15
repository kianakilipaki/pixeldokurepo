import { useState, useRef } from "react";
import { Animated } from "react-native";

const useThemeAnimation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(1)).current;

  const toggleExpansion = () => {
    const toSlideValue = isExpanded ? 0 : 1; // Toggle slide position
    const toFadeValue = isExpanded ? 1 : 0; // Toggle fade opacity

    // Run both animations in parallel
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: toSlideValue,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: toFadeValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setIsExpanded(!isExpanded));
  };

  return { slideAnimation, fadeAnimation, isExpanded, toggleExpansion };
};

export default useThemeAnimation;
