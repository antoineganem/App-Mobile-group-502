import React from "react";
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

const LoginPage: React.FC = () => {
  const handleLogin = async () => {
    console.log("Iniciando sesión...");
    try {
      const response = await fetch("http://localhost:5000/test"); // Adjust the URL if your server is hosted elsewhere
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Response from server:", data);
      // You could set state or navigate based on the response here
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
            label="Usuario"
            placeholder="Ingresa tu usuario"
            type="text"
          />
        </View>

        <View style={styles.inputContainer}>
          <InputField
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            type="password"
          />
        </View>
        <LoginButtonAuth />
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
            <Text
              style={styles.orangeLink}
              onPress={() => {
                /* Navegar a la página de registro */
              }}
            >
              Regístrate
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const LoginButtonAuth = () => {
  const { authorize } = useAuth0();

  const onPress = async () => {
    console.log("Iniciando sesión...");
    try {
      await authorize();
    } catch (e) {
      console.log(e);
    }
  };

  return <Button onPress={onPress} title="Log in" />;
};
export default LoginPage;
