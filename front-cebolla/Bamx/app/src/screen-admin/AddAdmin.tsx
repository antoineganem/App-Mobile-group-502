import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { LOCALHOST } from "../constants";
import WithSidebar from "./WithSideBar";

const AuthorizeUserComponent: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const handleAuthorize = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor, ingresa un correo electrónico válido.");
      return;
    }

    try {
      const response = await fetch(`${LOCALHOST}/users/authorize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 200) {
        Alert.alert(
          "Éxito",
          "El usuario ha sido autorizado como administrador."
        );
        setEmail(""); // Clear input field
      } else {
        Alert.alert(
          "Error",
          data.error || "Hubo un problema al autorizar al usuario."
        );
      }
    } catch (error) {
      console.error("Error al autorizar usuario:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al conectar con el servidor. Inténtalo más tarde.",
        error
      );
    }
  };

  return (
    <WithSidebar>
      <View style={styles.container}>
        <Text style={styles.title}>Autorizar Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico del usuario"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={handleAuthorize}>
          <Text style={styles.buttonText}>Autorizar</Text>
        </TouchableOpacity>
      </View>
    </WithSidebar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#FF5722",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AuthorizeUserComponent;
