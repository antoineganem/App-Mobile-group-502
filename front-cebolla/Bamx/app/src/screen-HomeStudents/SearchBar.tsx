// SearchBar.tsx
import React from 'react';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './stylesHomeStudents';

const SearchBar: React.FC = () => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar ..."
      />
      <Icon name="search" size={20} color="gray" style={styles.searchIcon} />
    </View>
  );
};

export default SearchBar;
