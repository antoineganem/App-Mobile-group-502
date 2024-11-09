// src/LoginPage.tsx
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Logo from './Logo';

const LoginPage: React.FC = () => {
  const handleLogin = () => {
    console.log("Iniciando sesión...");
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.welcomeText}>¡Bienvenido!</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu usuario"
        />
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          <Text style={styles.link} onPress={() => { /* Navegar a la página de recuperación */ }}>¿Olvidaste tu contraseña?</Text>
        </Text>
        <Text style={styles.footerText}>
          ¿No tienes una cuenta? <Text style={styles.link} onPress={() => { /* Navegar a la página de registro */ }}>Regístrate</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  welcomeText: {
    color: '#ff6600',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    width: '100%',
    marginVertical: 15,
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loginButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ff6600',
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 15,
    alignItems: 'center',
  },
  footerText: {
    color: '#777',
  },
  link: {
    color: '#ff6600',
    textDecorationLine: 'underline',
  },
});

export default LoginPage;
