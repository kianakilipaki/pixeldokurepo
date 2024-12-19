// TitleAndButtons.js
import React from 'react';
import { Animated, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Title = ({ fadeAnimation, savedGame, onContinue, onToggleExpansion }) => (
  <Animated.View style={[styles.centerContainer, { opacity: fadeAnimation }]}>
    <Text style={styles.header}>Welcome to</Text>
    <Text style={styles.title}>PixelDoku</Text>
    {savedGame && (
      <TouchableOpacity style={[styles.button, styles.continueButton]} onPress={onContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    )}
    <TouchableOpacity style={[styles.button, styles.newGameButton]} onPress={onToggleExpansion}>
      <Text style={styles.buttonText}>New Game</Text>
    </TouchableOpacity>
  </Animated.View>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontFamily: 'var(--fontFamily)',
    fontSize: 36,
    textAlign: 'center',
    color: 'var(--forecolor1)',
  },
  title: {
    fontFamily: 'var(--fontFamily)',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'var(--red)',
    transform: [{skewX: '-10deg'}, {scaleY: 2}],
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5
  },
  button: {
    width: '60%',
    paddingVertical: 20,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderCollapse: 'collapsed',
  },
  continueButton: {
    backgroundColor: 'var(--forecolor1)',
  },
  newGameButton: {
    backgroundColor: 'var(--blue)',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'var(--fontFamily)',
    fontSize: 23,
  },
});

export default Title;
