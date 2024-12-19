import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Silkscreen_400Regular,
  Silkscreen_700Bold,
} from '@expo-google-fonts/silkscreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Coins from '../components/Coins';
import TitleAndButtons from '../components/Title';
import ThemeListContainer from '../components/ThemesContainer';
import useThemeAnimation from '../utils/animationHook';
import { themes } from '../utils/spriteMap';

const HomeScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Silkscreen_400Regular,
    Silkscreen_700Bold,
  });

  const [savedGame, setSavedGame] = useState(null);
  const { slideAnimation, fadeAnimation, toggleExpansion } = useThemeAnimation();

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
      <TitleAndButtons
        fadeAnimation={fadeAnimation}
        savedGame={savedGame}
        onContinue={handleContinue}
        onToggleExpansion={toggleExpansion}
      />
      <ThemeListContainer
        slideAnimation={slideAnimation}
        isExpanded={toggleExpansion}
        navigation={navigation}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    overflow: 'hidden',
    top: 1,
    width: '100vw',
    height: '100vh',
  },
});

export default HomeScreen;
