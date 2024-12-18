import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Coins from './Coins';

const Header = ({ title, difficulty, onBackPress }) => {

  return (
    <View style={styles.headerContainer}>
      {/* Back Arrow */}
      <TouchableOpacity onPress={onBackPress} style={styles.backArrow}>
        <Image
          source={require('../assets/backArrow.png')} // Add a back-arrow image in assets
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>

      {/* Title */}
        <Text style={styles.titleText}>{title}</Text>

      {/* Coins */}
      <Coins />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'var(--blue1)',
    borderBottomColor: 'var(--forecolor1)',
    borderBottomWidth: 2,
  },
  backArrow: {
    padding: 5,
  },
  titleText: {
    fontSize: 20,
    color: 'var(--forecolor1)',
    fontFamily: 'var(--fontFamily)',
  },
});

export default Header;
