import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './stylesHomeStudents'; 

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sidebarContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <View style={styles.closeIconContainer}>
            <Icon name="close" size={24} color="black" />
            </View>
            </TouchableOpacity>
          
          {/* Título del Dashboard */}
          <Text style={styles.sidebarTitle}>Dashboard</Text>

          {/* Opciones del Sidebar */}
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="person-outline" size={24} color="black" />
            <Text style={styles.menuText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="heart-outline" size={24} color="black" />
            <Text style={styles.menuText}>Donativos/Actividades</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="shield-outline" size={24} color="black" />
            <Text style={styles.menuText}>Seguridad</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="help-circle-outline" size={24} color="black" />
            <Text style={styles.menuText}>Soporte</Text>
          </TouchableOpacity>

          {/* Botón de Cerrar Sesión */}
          <TouchableOpacity style={styles.logoutButton} onPress={onClose}>
            <View style={styles.logoutButtonContent}>
            <Icon name="arrow-back-outline" size={24} color="white" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Sidebar;
