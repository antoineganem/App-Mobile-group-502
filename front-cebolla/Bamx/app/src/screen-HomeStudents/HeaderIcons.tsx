// Header.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './stylesHomeStudents';

interface HeaderProps {
  onMenuPress: () => void;
}

const HeaderIcons: React.FC<HeaderProps> = ({ onMenuPress }) => {
  return (
    <View style={styles.iconsContainer}>
      <TouchableOpacity onPress={onMenuPress}>
        <Icon name="menu" size={24} color="black" />
      </TouchableOpacity>
      <Icon name="cart-outline" size={24} color="black" />
    </View>
  );
};

export default HeaderIcons;
