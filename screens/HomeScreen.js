import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const navigateToGame = (difficulty) => {
    navigation.navigate('SudokuScreen', { difficulty });
  };

  return (
    <ImageBackground
      source={require('../assets/sprite_northWindShrineBG.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>PixelDoku</Text>
        <View style={styles.buttonsContainer}>
          <Button
            title="Easy"
            onPress={() => navigateToGame('easy')}
            color="#4CAF50"
          />
          <Button
            title="Medium"
            onPress={() => navigateToGame('medium')}
            color="#FFC107"
          />
          <Button
            title="Hard"
            onPress={() => navigateToGame('hard')}
            color="#F44336"
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonsContainer: {
    width: '80%',
    justifyContent: 'space-between',
    height: 150,
  },
});

export default HomeScreen;
