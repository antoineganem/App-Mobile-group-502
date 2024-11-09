// src/Logo.tsx
import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';

interface LogoProps {
  style?: ViewStyle;
}

const Logo: React.FC<LogoProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <Image 
        source={require('./public/logo.png')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default Logo;
