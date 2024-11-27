import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { spriteMapLG, themes } from '../utils/spriteMap';

const InputButtons = ({ onPress }) => {
    return (
      <View style={styles.birdButtons}>
        {Object.entries(spriteMapLG).map(([value, position]) => (
          <TouchableOpacity
            key={value}
            style={styles.cellContainer}
            onPress={() => {
              onPress(parseInt(value, 10)); // Set value on the board
            }}
          >
            <Image
              source={themes['birds'].source}
              style={[styles.spriteImage, position]}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  

const styles = StyleSheet.create({
  birdButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  cellContainer: {
    width: 42, // Adjust for your sprite size
    height: 42,
    padding: 10,
    margin: 10,
    border: '1px solid #000',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
    position: 'relative',
  },
  spriteImage: {
    position: 'absolute',
    width: 120, // Total width of sprite sheet
    height: 120, // Total height of sprite sheet
  },
});

export default InputButtons;
