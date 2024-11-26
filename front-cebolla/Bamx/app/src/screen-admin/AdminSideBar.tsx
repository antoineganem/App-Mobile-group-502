import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import styles from "../screen-HomeStudents/stylesHomeStudents";

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
          <Text style={styles.sidebarTitle}>Admin Dashboard</Text>

          {/* Opciones del Sidebar */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              router.push("src/screen-HomeStudents/HomeStudentsPage")
            }
          >
            <Icon name="heart-outline" size={24} color="black" />
            <Text style={styles.menuText}>Donativos/Actividades</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("src/screen-HomeStudents/ProgressPage")}
          >
            <Icon name="stats-chart-outline" size={24} color="black" />
            <Text style={styles.menuText}>Progreso alumnos</Text>
          </TouchableOpacity>

          {/* Admin-specific Options */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("src/screen-admin/AddActivity")}
          >
            <Icon name="add-outline" size={24} color="black" />
            <Text style={styles.menuText}>Agregar Actividad</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("src/screen-admin/AddDonation")}
          >
            <Icon name="add-circle-outline" size={24} color="black" />
            <Text style={styles.menuText}>Agregar Donativo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("src/screen-admin/AddAdmin")}
          >
            <Icon name="person-add-outline" size={24} color="black" />
            <Text style={styles.menuText}>Agregar Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("src/screen-admin/DeleteItems")}
          >
            <Icon name="trash-outline" size={24} color="black" />
            <Text style={styles.menuText}>Editar Actividad/Donativo</Text>
          </TouchableOpacity>

          {/* Other Options */}

          {/* Botón de Cerrar Sesión */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              router.push("src/screen-Login/LoginPage");
            }}
          >
            <View style={styles.logoutButtonContent}>
              <Icon
                name="arrow-back-outline"
                size={24}
                color="white"
                style={styles.logoutIcon}
              />
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Sidebar;
