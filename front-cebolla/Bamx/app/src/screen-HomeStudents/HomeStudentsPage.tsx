// HomeStudents.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderIcons from './HeaderIcons';
import SearchBar from './SearchBar';
import CategoryButtons from './CategoryButtons';
import Sidebar from './Sidebar';
import styles from './stylesHomeStudents';

const HomeStudentsPage: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <View style={styles.container}>
      <HeaderIcons onMenuPress={toggleSidebar} />
      <SearchBar />
      <Text style={styles.sectionTitle}>Donaciones</Text>
      <CategoryButtons />
      <Text style={styles.activitiesTitle}>Actividades</Text>

      {/* Sidebar */}
      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />

      {/* Icono de Casa en el Centro y Abajo */}
      <TouchableOpacity style={styles.homeIconContainer}>
        <Icon name="home-outline" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeStudentsPage;
