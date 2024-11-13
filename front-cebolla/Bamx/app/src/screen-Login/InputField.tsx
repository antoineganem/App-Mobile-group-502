import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { styles } from "./stylesLogin";

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  onChangeText?: (text: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
  onChangeText,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordType = type === "password";

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <Icon
          name={isPasswordType ? "lock" : "user"}
          size={20}
          color="#777"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          secureTextEntry={isPasswordType && !isPasswordVisible}
          onChangeText={onChangeText}
        />
        {isPasswordType && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon
              name={isPasswordVisible ? "eye-slash" : "eye"}
              size={20}
              color="#777"
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default InputField;
