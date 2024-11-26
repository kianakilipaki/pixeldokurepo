import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { spriteMap } from '../utils/spriteMap';

const Cell = ({ value, isEditable, isHighlighted, onSelect, style }) => {
  const spritePosition = spriteMap[value];

  return (
    <View
      style={[
        styles.cellContainer,
        style, // Border styles passed from the Board
        isHighlighted && styles.highlightedCell, // Highlight conditionally
      ]}
      onStartShouldSetResponder={() => {
        if (isEditable) {
          onSelect(); // Trigger selection for editable cells
          return true; // Allow responder system to proceed
        }
        return false; // Ignore touches for non-editable cells
      }}
    >
      {value !== 0 && (
        <Image
          source={require('../assets/Winter-Birds.png')}
          style={[
            styles.spriteImage,
            spritePosition,
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
  highlightedCell: {
    backgroundColor: 'rgba(255, 223, 186, 0.8)', // Light orange for highlighted cells
  },
});

export default Cell;
