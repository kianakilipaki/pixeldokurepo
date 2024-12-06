import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ActionButtons = ({ onReset, onErase, onHint, onPause }) => {
  return (
    <View style={styles.buttonContainer}>
      {/* Reset Button */}
      <TouchableOpacity style={styles.button} onPress={onReset}>
        <Icon name="restart" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Erase Button */}
      <TouchableOpacity style={styles.button} onPress={onErase}>
        <Icon name="eraser" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Hint Button */}
      <TouchableOpacity style={styles.button} onPress={onHint}>
        <Icon name="lightbulb-outline" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Pause Button */}
      <TouchableOpacity style={styles.button} onPress={onPause}>
        <Icon name="pause" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  button: {
    padding: 10,
    backgroundColor: 'var(--blue)',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default ActionButtons;
