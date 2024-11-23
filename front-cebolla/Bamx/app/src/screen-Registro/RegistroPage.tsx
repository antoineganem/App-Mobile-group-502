import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Logo from "../screen-Login/Logo";
import styles from "./stylesRegistro";
import { styles as styles2 } from "../screen-Login/stylesLogin";
import bcrypt from "react-native-bcrypt";
import { AuthContext } from "../AuthContext";
import { Link } from "expo-router";
import { LOCALHOST } from "../constants";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const RegistroPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [nombre, setNombre] = useState("");

  const [contrasena, setContrasena] = useState("");
  const [correo, setCorreo] = useState("");
  const [matricula, setMatricula] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [isStudent, setIsStudent] = useState(false); // New state to track if the user is a student

  const handleCreateAccount = () => {
    if (!isValidEmail(correo)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    console.log("Cuenta creada...");
    console.log("Nombre:", nombre);
    console.log("Contraseña:", contrasena);
    console.log("Correo:", correo);

    console.log("Matrícula:", isStudent ? matricula : "N/A");
    console.log("Confirmar contraseña:", confirmarContrasena);
    const hashedPassword = bcrypt.hashSync(contrasena, 10);
    console.log("Contraseña encriptada", hashedPassword);

    const saltRounds = 10;

    if (contrasena !== confirmarContrasena) {
      Alert.alert("Las contraseñas no coinciden");
      return;
    }
    if (!nombre || !contrasena || !correo || !confirmarContrasena) {
      Alert.alert("Por favor llena todos los campos");
      return;
    }
    if (isStudent && !matricula) {
      Alert.alert("Por favor llena el campo de matrícula");
      return;
    }

    const bodyData = JSON.stringify({
      name: nombre,
      email: correo,
      password_hash: hashedPassword,
      isStudent: isStudent,
      enrollmentNum: isStudent ? matricula : null,
    });

    console.log("Body data:", bodyData);

    fetch(`${LOCALHOST}/users/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Cuenta creada exitosamente");
        } else {
          alert("Error al crear la cuenta: " + data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Alert.alert("Error al crear la cuenta");
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
        <Text style={styles.title}>Registro</Text>

        {/* Campo Nombre con Icono de Persona */}
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#666" style={styles.iconLeft} />
          <TextInput
            style={styles.textInput}
            placeholder="Ingresa tu nombre"
            onChange={(e) => setNombre(e.nativeEvent.text)}
          />
        </View>

        {/* Switch for "Eres alumno?" */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>¿Eres alumno? </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#FFA500" }}
            value={isStudent}
            onValueChange={(value) => setIsStudent(value)}
            thumbColor={isStudent ? "FFA500" : "#f4f3f4"}
          />
        </View>

        {/* Conditionally render the Matricula field if isStudent is true */}
        {isStudent && (
          <View style={styles.inputContainer}>
            <Icon
              name="id-card"
              size={20}
              color="#666"
              style={styles.iconLeft}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Ingresa tu matrícula"
              onChange={(e) => setMatricula(e.nativeEvent.text)}
            />
          </View>
        )}

        {/* Campo Correo con Icono de Correo */}
        <View style={styles.inputContainer}>
          <Icon
            name="envelope"
            size={20}
            color="#666"
            style={styles.iconLeft}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Ingresa tu correo"
            keyboardType="email-address"
            onChange={(e) => setCorreo(e.nativeEvent.text)}
          />
        </View>

        {/* Campo de Contraseña con Iconos */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#666" style={styles.iconLeft} />
          <TextInput
            style={styles.textInput}
            placeholder="Ingresa tu contraseña"
            secureTextEntry={!showPassword}
            onChange={(e) => setContrasena(e.nativeEvent.text)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? "eye" : "eye-slash"}
              size={20}
              color="#666"
              style={styles.iconRight}
            />
          </TouchableOpacity>
        </View>

        {/* Campo de Repetir Contraseña con Iconos */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#666" style={styles.iconLeft} />
          <TextInput
            style={styles.textInput}
            placeholder="Repetir contraseña"
            secureTextEntry={!showRepeatPassword}
            onChange={(e) => setConfirmarContrasena(e.nativeEvent.text)}
          />
          <TouchableOpacity
            onPress={() => setShowRepeatPassword(!showRepeatPassword)}
          >
            <Icon
              name={showRepeatPassword ? "eye" : "eye-slash"}
              size={20}
              color="#666"
              style={styles.iconRight}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Crear Cuenta</Text>
        </TouchableOpacity>

        <Text style={styles2.footerText2}>
          ¿Ya tienes una cuenta?{" "}
          <Text style={styles2.orangeLink} onPress={() => {}}>
            <Link href="/src/screen-Login/LoginPage    ">Inicia Sesión</Link>;
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegistroPage;
