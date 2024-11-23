import React, { useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Button,
} from "react-native";
import Logo from "./Logo";
import InputField from "./InputField";
import LoginButton from "./LoginButton";
import { styles } from "./stylesLogin";
import { useAuth0, Auth0Provider } from "react-native-auth0";
import { AuthContext } from "../AuthContext";
import bcrypt from "react-native-bcrypt";
import { useRouter } from "expo-router";

import { Link, router } from "expo-router";
import { LOCALHOST } from "../constants";

const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  // const authContext = useContext(AuthContext);
  // if (!authContext) {
  //   throw new Error("AuthContext must be used within an AuthProvider");
  // }
  // const { test } = authContext;
  // console.log("Si?:", test);
  const handleLogin = async () => {
    console.log("Iniciando sesión...");
    console.log("Email:", email);
    console.log("Contraseña", password);

    try {
      // Use a POST request and send email and password in the request body
      const response = await fetch(`${LOCALHOST}/users/log-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // Replace with the actual email input from the user
          password: password, // Replace with the actual password input from the user
        }),
      });

      const data = await response.json();

      console.log("Response from server:", data);

      // Handle login success or error based on the server response
      if (data.message === "Log ok") {
        console.log("Login successful");
        if (data.userType === "admin")
          router.push("src/screen-HomeAdmin/HomeAdminPage");
        else {
          router.push("src/screen-HomeStudents/HomeStudentsPage");
        }
        // Navigate or update state here
      } else if (data.error) {
        console.error("Login error:", data.error);
        // Show error message to user or handle it in the UI
      }
    } catch (error) {
      console.error("There was an error with the fetch operation:", error);
    }
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

        <Text style={styles.welcomeText}>¡Bienvenido!</Text>

        <View style={styles.inputContainer}>
          <InputField
            label="Email"
            placeholder="Ingresa tu email"
            type="text"
            onChangeText={(text) => setEmail(text)} // Use onChangeText instead of onChange
          />
        </View>

        <View style={styles.inputContainer}>
          <InputField
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            type="password"
            onChangeText={(text) => setPassword(text)} // Use onChangeText instead of onChange
          />
        </View>

        <View style={styles.loginButtonContainer}>
          <LoginButton
            text="Iniciar Sesión"
            onClick={handleLogin}
            style={styles.loginButton}
            textStyle={styles.loginButtonText}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            <Text
              style={styles.blackLink}
              onPress={() => {
                /* Navegar a la página de recuperación */
              }}
            >
              ¿Olvidaste tu contraseña?
            </Text>
          </Text>
          <Text style={styles.footerText2}>
            ¿No tienes una cuenta?{" "}
            <Text style={styles.orangeLink} onPress={() => {}}>
              <Link href="/src/screen-Registro/RegistroPage    ">
                Registrate
              </Link>
              ;
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;
