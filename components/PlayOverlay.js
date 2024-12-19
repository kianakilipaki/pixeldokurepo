import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';

const PlayOverlay = ({ onPress }) => {
    return (
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={onPress}
          >
            <Image
              source={require('../assets/play.png')}
              style={{ width: 45, height: 45 }}
              />
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
        paddingLeft: 8,
        width: 80,       // Explicit width
        height: 80,      // Explicit height
        borderRadius: 40, // Half of width/height for a perfect circle
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PlayOverlay;
