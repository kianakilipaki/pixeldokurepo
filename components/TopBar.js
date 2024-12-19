import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Timer from './Timer'; // Assuming you already have this component

const TopBar = ({ difficulty, retryCounter, isPaused, timer, setTimer }) => {
  return (
    <View style={styles.topBar}>
      {/* Retry Counter */}
      <View style={styles.retryContainer}>
        {Array.from({ length: retryCounter }, (_, i) => (
          <Image
            key={i}
            source={require('../assets/heart.png')}
            style={styles.heartIcon}
          />
          //<Icon key={i} name="heart" size={24} color="red" style={styles.heartIcon} />
        ))}
      </View>
      {difficulty && (
        <Text style={styles.difficultyText}>
          {difficulty.toUpperCase()}
        </Text>
      )}
      {/* Timer */}
      <View style={styles.timerContainer}>
        <Timer isPaused={isPaused} timer={timer} setTimer={setTimer}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  retryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  heartIcon: {
    marginHorizontal: 4,
    width: 24, 
    height: 24
  },
  timerContainer: {
    marginLeft: 20,
    alignItems: 'flex-end',
  },
  difficultyText: {
    fontSize: 18,
    color: 'var(--forecolor1)',
    marginTop: 3,
    fontFamily: 'var(--fontFamily)',
  },
});

export default TopBar;
