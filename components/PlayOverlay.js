import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const PlayOverlay = ({ onPress }) => {
    return (
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={onPress}
          >
            <Icon name="play" size={40} color="white" />
          </TouchableOpacity>
        </View> 
    );
};

const styles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    playButton: {
        backgroundColor: '#3498db',
        width: 80,       // Explicit width
        height: 80,      // Explicit height
        borderRadius: 40, // Half of width/height for a perfect circle
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PlayOverlay;
