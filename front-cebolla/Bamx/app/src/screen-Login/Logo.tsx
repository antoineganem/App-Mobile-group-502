import React from 'react';
import { View, Image } from 'react-native';
import { styles } from './stylesLogin';
import { ViewStyle } from 'react-native';

interface LogoProps {
  style?: ViewStyle;
}

const Logo: React.FC<LogoProps> = ({ style }) => {
  return (
    <View style={[styles.logoContainer, style]}>
      <Image 
        source={require('../public/logo.png')}
        style={styles.image}
      />
    </View>
  );
};

export default Logo;
