// useThemeAnimation.js
import { useState, useRef } from 'react';
import { Animated } from 'react-native';

const useThemeAnimation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(1)).current;

  const toggleExpansion = () => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: isExpanded ? 0 : 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setIsExpanded(!isExpanded));
  };

  return { slideAnimation, fadeAnimation, isExpanded, toggleExpansion };
};

export default useThemeAnimation;
