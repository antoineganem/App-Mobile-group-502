import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Checkbox } from 'react-native-paper'; // Usando react-native-paper
import styles from './styleSeguridadScreen';
import Sidebar from '../screen-HomeStudents/Sidebar';
import Header from '../screen-HomeStudents/HeaderIcons';
import Icon from 'react-native-vector-icons/Ionicons';

// Definir tipos explícitos para la política de privacidad
interface PolicyVersion {
  date: string;
  content: string;
}

interface PolicyContent {
  current: PolicyVersion;
  previous: PolicyVersion;
}

const SeguridadScreen = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<'current' | 'previous'>('current');
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);

  // Definir el contenido de las políticas
  const policyContent: PolicyContent = {
    current: {
      date: "2024-11-01",
      content: `Política de privacidad actualizada:

      La privacidad y seguridad de tus datos es nuestra principal preocupación. Esta política describe cómo recopilamos, usamos y protegemos tu información personal. Al utilizar nuestra aplicación, aceptas los términos y condiciones de esta política.

      1. **Información que recopilamos**: Recopilamos información personal como nombre, dirección de correo electrónico y preferencias de uso de la aplicación.

      2. **Uso de la información**: Utilizamos tu información para personalizar tu experiencia en la app y mejorar nuestros servicios.

      3. **Protección de datos**: Implementamos medidas de seguridad para proteger tu información personal contra acceso no autorizado, alteración o divulgación.

      4. **Tus derechos**: Tienes derecho a acceder, corregir o eliminar la información que hemos recopilado sobre ti. Si deseas ejercer alguno de estos derechos, por favor, contáctanos.

      5. **Cambios en la política**: Nos reservamos el derecho de modificar esta política en cualquier momento. Cualquier cambio será comunicado a los usuarios a través de la aplicación.
      
      6. **Contactos**: Si tienes alguna duda o inquietud acerca de esta política, no dudes en contactarnos.
      
      Última actualización: 01 de noviembre de 2024`
    },
    previous: {
      date: "2024-10-01",
      content: `Política de privacidad anterior:

      Esta política describe cómo recopilamos, usamos y protegemos tu información personal en nuestra aplicación. Es importante que la leas para entender cómo manejamos tus datos.

      1. **Recopilación de información**: Recopilamos datos básicos como nombre, correo electrónico y datos de uso de la app.

      2. **Uso de la información**: Usamos tus datos para mejorar la experiencia del usuario y proporcionar soporte técnico.

      3. **Seguridad de los datos**: Tomamos medidas de seguridad adecuadas para proteger tu información personal.

      4. **Derechos del usuario**: Puedes solicitar la eliminación o actualización de tu información personal en cualquier momento.

      5. **Modificaciones de la política**: En el caso de que esta política sea modificada, los usuarios serán notificados a través de la aplicación.

      Última actualización: 01 de octubre de 2024`
    }
  };

  // Función para abrir el Sidebar
  const openSidebar = () => {
    setSidebarVisible(true);
  };

  // Función para cerrar el Sidebar
  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  // Manejo del cambio de los CheckBoxes para asegurarse de que solo uno esté activado
  const handleAcceptChange = () => {
    setIsAccepted(true);
    setIsDeclined(false); // Desactiva el otro checkbox
  };

  const handleDeclineChange = () => {
    setIsDeclined(true);
    setIsAccepted(false); // Desactiva el otro checkbox
  };

  return (
    <View style={styles.container}>
      {/* Componente Header */}
      <Header onMenuPress={openSidebar} />
      
      {/* Título */}
      <Text style={styles.title}>Seguridad</Text>

      {/* Sección de Política de Privacidad */}
      <Text style={styles.header}>Política de privacidad de la app</Text>

      {/* Selector de versiones */}
      <Picker
        selectedValue={selectedVersion}
        onValueChange={(itemValue) => setSelectedVersion(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Versión actual" value="current" />
        <Picker.Item label="Versiones anteriores" value="previous" />
      </Picker>

      {/* Contenedor de política con scroll */}
      <ScrollView style={styles.policyContainer}>
        <Text style={styles.policyText}>
          {policyContent[selectedVersion].content} {/* Aquí se muestra el contenido según la versión seleccionada */}
        </Text>
      </ScrollView>

      {/* Aceptación de términos */}
      <View style={styles.termsContainer}>
        <View style={styles.termRow}>
          <Text style={styles.termText}>Acepto los términos y condiciones</Text>
          <Checkbox
            status={isAccepted ? 'checked' : 'unchecked'}
            onPress={handleAcceptChange} // Solo se activa este checkbox
            color="orange" // Aquí cambiamos el color del checkbox a naranja
          />
        </View>
        <View style={styles.termRow}>
          <Text style={styles.termText}>No acepto los términos y condiciones</Text>
          <Checkbox
            status={isDeclined ? 'checked' : 'unchecked'}
            onPress={handleDeclineChange} // Solo se activa este checkbox
            color="orange" // Aquí cambiamos el color del checkbox a naranja
          />
        </View>
      </View>

      {/* Botón de autenticación multifactor */}
      <TouchableOpacity style={styles.multiFactorButton}>
        <Text style={styles.multiFactorButtonText}>Quiero activar autenticación multifactor</Text>
      </TouchableOpacity>

      {/* Nuevo botón: Quiero más información (Profeco) */}
      <TouchableOpacity style={styles.multiFactorButton}>
        <Text style={styles.multiFactorButtonText}>Quiero más información (Profeco)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.homeIconContainer}>
        <Icon name="home-outline" size={32} color="white" />
      </TouchableOpacity>

      {/* Sidebar componente */}
      <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar} />
    </View>
  );
};

export default SeguridadScreen;
