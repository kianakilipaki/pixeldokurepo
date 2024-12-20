import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Animated,
} from 'react-native';
import { spriteMap } from '../utils/spriteMap';

const ThemeList = ({ item, themeKey, navigation }) => {
  const [expandedTheme, setExpandedTheme] = useState(null);

  const toggleTheme = (key) => {
    setExpandedTheme(expandedTheme === key ? null : key);
  };

  const isExpanded = expandedTheme === themeKey;

  return (
    <View style={styles.themeContainer}>
      <ImageBackground
        source={item.bgSource}
        style={styles.themeBackground}
        resizeMode="cover"
      >
        <TouchableOpacity
          onPress={() => toggleTheme(themeKey)}
          style={styles.themeHeader}
        >
          <View style={styles.thumbnail}>
            <Image
              source={item.source}
              style={[styles.spriteImage, spriteMap[1]]}
            />
          </View>
          <Text style={styles.themeTitle}>{item.title}</Text>
          <View style={styles.thumbnail}>
            <Image
              source={item.source}
              style={[styles.spriteImage, spriteMap[2]]}
            />
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
                    Completed {stats}
                  </Text>
                </TouchableOpacity>
                {difficulty !== 'hard' && <View style={styles.divider} />}
              </View>
            ))}
          </Animated.View>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
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
        width: '10vw', // Cell size
        height: '10vw',
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
      },
      spriteImage: {
        position: 'absolute',
        width: '30vw',
        height: '30vw',
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

export default ThemeList;
