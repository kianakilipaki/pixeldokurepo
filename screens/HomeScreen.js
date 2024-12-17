import React, { useState, useRef } from 'react';
import {
  Text,
  ImageBackground,
  FlatList,
  StyleSheet,
  Animated,
  TouchableOpacity,
  View,
} from 'react-native';
import { themes } from '../utils/spriteMap';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Silkscreen_400Regular,
  Silkscreen_700Bold,
} from '@expo-google-fonts/silkscreen';
import ThemeList from '../components/ThemeList';
import Coins from '../components/Coins';

const HomeScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Silkscreen_400Regular,
    Silkscreen_700Bold,
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current;

  const toggleExpansion = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.timing(animationValue, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const animatedContainerStyle = {
    height: animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, '100vh'],
    }),
    opacity: animationValue,
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground
      source={themes['birds'].bgSource}
      style={styles.background}
      resizeMode="cover"
    >
      <Coins />
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>PixelDoku</Text>
      </View>

      {/* Expandable Theme List */}
      <TouchableOpacity onPress={toggleExpansion}>
        <Text style={styles.subHeader}>
          {isExpanded ? 'Hide Themes' : 'Choose a Theme'}
        </Text>
      </TouchableOpacity>
      <Animated.View style={[styles.themeContainer, animatedContainerStyle]}>
        <FlatList
          data={Object.keys(themes).map((key) => ({ themeKey: key, ...themes[key] }))}
          renderItem={({ item }) => (
            <ThemeList item={item} themeKey={item.themeKey} navigation={navigation} />
          )}
          keyExtractor={(item) => item.themeKey}
        />
      </Animated.View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    overflow: 'hidden',
    top: 1,
    height: '100vh',
    color: 'var(--forecolor1)',
  },
  header: {
    width: '100vw',
    fontFamily: 'var(--fontFamily)',
    color: 'var(--forecolor1)',
    fontSize: 28,
    textAlign: 'center',
    marginTop: 20,
    zIndex: 1,  
  },
  subHeader: {
    textAlign: 'center', 
    fontWeight: 'bold'
  },
});

export default HomeScreen;
