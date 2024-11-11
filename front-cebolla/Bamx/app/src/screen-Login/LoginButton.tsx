import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './stylesLogin';
import { ViewStyle } from 'react-native';
import { TextStyle } from 'react-native';

interface LoginButtonProps {
  text: string;
  onClick: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle; 
}

const LoginButton: React.FC<LoginButtonProps> = ({ text, onClick, style, textStyle }) => {
  const handleClick = () => {
    console.log('Button clicked');
    onClick();
  };

  return (
    <TouchableOpacity style={[styles.loginButton, style]} onPress={handleClick}>
      <Text style={[styles.loginButtonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default LoginButton;
