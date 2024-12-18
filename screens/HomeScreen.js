import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  ImageBackground,
  FlatList,
  StyleSheet,
  Animated,
  Button,
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  // Load game fonts
  const [fontsLoaded] = useFonts({
    Silkscreen_400Regular,
    Silkscreen_700Bold,
  });

  // Load saved game progress
  const [savedGame, setSavedGame] = useState(null);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await AsyncStorage.getItem('SAVED_GAME');
        if (progress) {
          setSavedGame(JSON.parse(progress));
        }
      } catch (error) {
        console.error('Failed to load saved game progress:', error);
      }
    };

    loadProgress();
  }, []);

  const handleContinue = () => {
    if (savedGame) {
      navigation.navigate('SudokuScreen', { savedGame, theme: savedGame.theme, difficulty: savedGame.difficulty });
    }
  };

  // expand themes
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
        <Text style={styles.header}>Welcome to PixelDoku</Text>
      </View>

      {/* Continue Button if Game Progress Exists */}
      {savedGame && (
        <Button title="Continue Last Game" onPress={handleContinue} color="green" />
      )}

      {/* Expandable Theme List */}
      <Button style={styles.subHeader} title={isExpanded ? 'Choose a Theme' : 'Start New Game'} onPress={toggleExpansion} color="red"/>

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
