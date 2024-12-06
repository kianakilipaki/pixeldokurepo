import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';

const Timer = ({ isPaused }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer;
    if (!isPaused) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (isPaused && timer) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isPaused]);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Timer;
