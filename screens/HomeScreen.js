import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  ImageBackground,
  FlatList,
  StyleSheet,
  Animated,
  TouchableOpacity ,
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

  const slideAnimation = useRef(new Animated.Value(0)).current; // Controls slide-up
  const fadeAnimation = useRef(new Animated.Value(1)).current;  // Controls fade-out for title/buttons

  const toggleExpansion = () => {
    if (!isExpanded) {
      // Expand Theme List
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Collapse Theme List
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
    setIsExpanded(!isExpanded);
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

      {/* Title and Buttons (Fade Out) */}
      <Animated.View style={[styles.centerContainer, { opacity: fadeAnimation }]}>
        <Text style={styles.header}>Welcome to <Text style={styles.title}>PixelDoku</Text></Text>
        {savedGame && (
          <TouchableOpacity style={[styles.button, {backgroundColor: 'var(--forecolor1)'}]} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue Last Game</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.button, {backgroundColor: 'var(--blue)'}]} onPress={toggleExpansion}>
          <Text style={styles.buttonText}>Start New Game</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Theme List (Slide Up) */}
      <Animated.View
        style={[
          styles.themeContainer,
          {
            transform: [
              {
                translateY: slideAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['100%', '0%'], // Slides up from the bottom
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.header}>Choose a Theme</Text>
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
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontFamily: 'var(--fontFamily)',
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 20,
    color: 'var(--forecolor1)',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'var(--red)',
  },
  button: {
    width: '60%',
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'var(--fontFamily)',
    fontSize: 16,
  },
  themeContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '90%',
    backgroundColor: 'var(--forecolor3)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
});

export default HomeScreen;
