import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './stylesHomeStudents';

const CategoryButtons: React.FC = () => {
  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity style={styles.categoryButton}>
        <Icon name="nutrition-outline" size={32} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.categoryButton}>
        <Icon name="shirt-outline" size={32} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.categoryButton}>
        <Icon name="cafe-outline" size={32} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.categoryButton}>
        <Icon name="grid-outline" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default CategoryButtons;
