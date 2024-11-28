import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { spriteMap, themes } from '../utils/spriteMap';

const Cell = ({ value, isEditable, isHinted, isHighlighted, onSelect, style }) => {
  const setSelected = () => {
    if (isEditable) {
      onSelect();
      return true;
    }
    return false;
  }

  return (
    <View
      style={[
        styles.cellContainer,
        style,
        isHinted && styles.hintedCell,
        isHighlighted && styles.selectedCell,
        !isEditable && styles.notEditable,
      ]}
      onStartShouldSetResponder={setSelected}
    >
      {value !== 0 && (
        <Image
          source={themes['birds'].source}
          style={[
            styles.spriteImage,
            spriteMap[value],
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
    backgroundColor: 'var(--bgcolor1)',
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
  hintedCell: {
    backgroundColor: 'var(--highlight2)',
  },
  selectedCell: {
    backgroundColor: 'var(--highlight1)',
  },
  highlightedCell: {
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: 'var(--blue)',
  },
  notEditable: {
    backgroundColor: 'var(--bgcolor2)',
  },
});


export default Cell;
