import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const ActionButtons = ({ solvePuzzle, resetBoard }) => {
    return (
        <View style={styles.buttons}>
        <Button title="Solve Puzzle" onPress={solvePuzzle} />
        <Button title="Reset Board" onPress={resetBoard} />
      </View>
    );
};

const styles = StyleSheet.create({
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
      },
});

export default ActionButtons;
