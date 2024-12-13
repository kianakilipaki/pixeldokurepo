import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, StyleSheet, Animated } from 'react-native';
import { spriteMap, themes } from '../utils/spriteMap';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Silkscreen_400Regular,
  Silkscreen_700Bold,
} from '@expo-google-fonts/silkscreen';

const HomeScreen = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    Silkscreen_400Regular,
    Silkscreen_700Bold,
  });

  const [expandedTheme, setExpandedTheme] = useState(null);

  const toggleTheme = (themeKey) => {
    setExpandedTheme(expandedTheme === themeKey ? null : themeKey);
  };

  const renderThemeItem = ({ item, themeKey }) => {
    const isExpanded = expandedTheme === themeKey;

    return (
      <View style={styles.themeContainer}>
        <ImageBackground source={item.bgSource} style={styles.themeBackground} resizeMode="cover">
          <TouchableOpacity onPress={() => toggleTheme(themeKey)} style={styles.themeHeader}>
            <View style={styles.thumbnail}>
              <Image source={item.source} style={[styles.spriteImage, spriteMap[1]]} />
            </View>
            <Text style={styles.themeTitle}>{item.title}</Text>
            <View style={styles.thumbnail}>
              <Image source={item.source} style={[styles.spriteImage, spriteMap[2]]} />
            </View>
          </TouchableOpacity>
          {item.difficulty && isExpanded && (
            <Animated.View style={styles.difficultyContainer}>
              {Object.entries(item.difficulty).map(([difficulty, stats]) => (
                <View key={difficulty}>
                  <TouchableOpacity
                    style={styles.difficultyButton}
                    onPress={() =>
                      navigation.navigate('SudokuScreen', {
                        theme: item,
                        difficulty,
                      })
                    }
                  >
                    <Text style={styles.difficultyText}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </Text>
                    <Text style={styles.statsText}>
                      Completed ({stats.wins} / {stats.loses + stats.wins})
                    </Text>
                  </TouchableOpacity>
                  <View style={difficulty !== 'hard' && styles.divider} />
                </View>
              ))}
            </Animated.View>
          )}
        </ImageBackground>
      </View>
    );
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground source={themes['birds'].bgSource} style={styles.background} resizeMode="cover">
      <Text style={styles.header}>PixelDoku</Text>
      <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Choose a Theme</Text>
      <FlatList
        data={Object.keys(themes).map((key) => ({ themeKey: key, ...themes[key] }))}
        renderItem={({ item }) => renderThemeItem({ item, themeKey: item.themeKey })}
        keyExtractor={(item) => item.themeKey}
        style={{ flex: 1, width: '100%' }}
      />
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
  themeContainer: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 10,
    overflow: 'hidden',
    elevation: 5,
    borderWidth: 1,
    borderColor: 'var(--forecolor1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
  },
  themeBackground: {
    width: '100%', 
    height:'100%', 
    resizeMode: 'cover', 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingBottom: 10,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  thumbnail: {
    width: 38, // Cell size
    height: 38,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spriteImage: {
    position: 'absolute',
    width: 105,
    height: 105,
  },
  themeTitle: {
    fontFamily: 'var(--fontFamily)',
    fontSize: 20,
    color: 'var(--forecolor1)',
  },
  difficultyContainer: {
    width: '80vw',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'var(--bgcolor1)',
  },
  difficultyButton: {
    paddingVertical: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyText: {
    textAlign: 'left',
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statsText: {
    textAlign: 'right',
    color: '#333',
    fontSize: 14,
    fontWeight: 'normal',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
});

export default HomeScreen;
