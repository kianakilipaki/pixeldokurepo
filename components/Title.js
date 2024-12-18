// TitleAndButtons.js
import React from 'react';
import { Animated, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Title = ({ fadeAnimation, savedGame, onContinue, onToggleExpansion }) => (
  <Animated.View style={[styles.centerContainer, { opacity: fadeAnimation }]}>
    <Text style={styles.header}>
      Welcome to <Text style={styles.title}>PixelDoku</Text>
    </Text>
    {savedGame && (
      <TouchableOpacity style={[styles.button, styles.continueButton]} onPress={onContinue}>
        <Text style={styles.buttonText}>Continue Last Game</Text>
      </TouchableOpacity>
    )}
    <TouchableOpacity style={[styles.button, styles.newGameButton]} onPress={onToggleExpansion}>
      <Text style={styles.buttonText}>Start New Game</Text>
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
  continueButton: {
    backgroundColor: 'var(--forecolor1)',
  },
  newGameButton: {
    backgroundColor: 'var(--blue)',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'var(--fontFamily)',
    fontSize: 16,
  },
});

export default Title;
