import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import styles from './styleSoporteScreen';
import Sidebar from '../screen-HomeStudents/Sidebar'; 
import Header from '../screen-HomeStudents/HeaderIcons'; 

const SupportPage = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const openSidebar = () => {
    setSidebarVisible(true);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Usamos el componente Header */}
      <Header onMenuPress={openSidebar} />
      <Text style={styles.title}>Soporte</Text>
      {/* Sección FAQ */}
      <View style={styles.section}>
        <Text style={styles.header}>Preguntas Frecuentes (FAQ)</Text>
        <View>
          <Text style={styles.faqItem}>¿Cómo puedo restablecer mi contraseña?</Text>
          <Text style={styles.faqContent}>
            Para restablecer tu contraseña, ve a la página de inicio de sesión y haz clic en "¿Olvidaste tu contraseña?". Sigue los pasos que aparecerán en la pantalla.
          </Text>
        </View>
        <View>
          <Text style={styles.faqItem}>¿Cómo contactar al soporte?</Text>
          <Text style={styles.faqContent}>
            Puedes ponerte en contacto con nuestro equipo de soporte mediante el formulario que se encuentra en nuestra página web.
          </Text>
        </View>
      </View>

      {/* Sección de contacto */}
      <View style={styles.contactSection}>
        <Text style={styles.header}>Contáctanos</Text>
        <View style={styles.contactItem}>
          <Icon name="phone" size={20} color="black" style={styles.icon} />
          <Text style={styles.contactText}>+52 123 456 7890</Text>
        </View>
        <View style={styles.contactItem}>
          <Icon name="envelope" size={20} color="black" style={styles.icon} />
          <Text style={styles.contactText}>soporte@ejemplo.com</Text>
        </View>
      </View>

      {/* Sidebar componente */}
      <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar} />
    </View>
  );
};

export default SupportPage;
