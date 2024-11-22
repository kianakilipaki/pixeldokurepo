import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const birdImages = {
  1: { top: 0, left: 0 },
  2: { top: 0, left: -35 },
  3: { top: 0, left: -70 },
  4: { top: -35, left: 0 },
  5: { top: -35, left: -35 },
  6: { top: -35, left: -70 },
  7: { top: -70, left: 0 },
  8: { top: -70, left: -35 },
  9: { top: -70, left: -70 },
};

const Cell = ({ value, isEditable, isHighlighted, style }) => {
  const birdPosition = birdImages[value];

  return (
    <View
      style={[
        styles.cellContainer,
        style, // Borders are passed in here
        isHighlighted && styles.highlightedCell,
      ]}
    >
      {value !== 0 && (
        <Image
          source={require('../assets/Winter-Birds.png')}
          style={[
            styles.birdImage,
            birdPosition
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    width: 38, // Cell size
    height: 38,
    backgroundColor: '#fff', // Background for consistent borders
    overflow: 'hidden',
    position: 'relative',
  },
  birdImage: {
    position: 'absolute',
    width: 105, // Full sprite sheet width
    height: 105, // Full sprite sheet height
  },
  highlightedCell: {
    backgroundColor: '#ffe4b2', // Highlighting for the selected cell
  },
});

export default Cell;
