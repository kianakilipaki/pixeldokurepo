import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { useCoins } from '../utils/coinContext';

const Coins = () => {
    const { coins } = useCoins();
    return (
        <View style={styles.coinContainer}>
            <Image
            source={require('../assets/coin.png')}
            style={{ width: 16, height: 16, marginRight: 5 }}
            />
            <Text style={styles.coinText}> {coins}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    coinContainer: {
        position: 'absolute',
        top: 1,
        right: 1,
        backgroundColor: 'var(--bgcolor3)',
        padding: 3,
        borderRadius: 8,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
      },
      coinText: {
        fontSize: 16,
        color: 'gold',
        fontFamily: 'var(--fontFamily)',
      },
});

export default Coins;
