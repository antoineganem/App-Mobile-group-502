import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import styles from "./stylesHomeStudents";

interface HeaderProps {
  onMenuPress: () => void;
  onCartPress: () => void; // New prop for cart icon
}

const HeaderIcons: React.FC<HeaderProps> = ({ onMenuPress, onCartPress }) => {
  return (
    <View style={styles.iconsContainer}>
      <TouchableOpacity onPress={onMenuPress}>
        <Icon name="menu" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onCartPress}>
        <Icon name="cart-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderIcons;
