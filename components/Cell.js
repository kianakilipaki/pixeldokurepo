import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Cell = ({ value, isEditable, isHighlighted, onValueChange, onSelect }) => {
  return (
      <TextInput
        style={[
          styles.cell,
          isHighlighted ? styles.highlightedCell : {},
          !isEditable ? styles.disabledCell : {},
        ]}
        value={value !== 0 ? String(value) : ''}
        keyboardType="numeric"
        maxLength={1}
        editable={isEditable}
        onChangeText={onValueChange}
        onFocus={onSelect}
      />
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 35,
    height: 35,
    borderWidth: 1,
    borderColor: '#000',
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#fff',
  },
  highlightedCell: {
    backgroundColor: '#ffe4b2',
  },
  disabledCell: {
    backgroundColor: '#ddd',
  },
});

export default Cell;
