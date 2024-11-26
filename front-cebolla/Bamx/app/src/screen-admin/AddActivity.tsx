import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import WithSidebar from "./WithSideBar"; // Wrapper with sidebar functionality
import { LOCALHOST } from "../constants";

const AddActivity: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [hours, setHours] = useState<string>("");

  const handleSubmit = async () => {
    if (!name || !description || !location || !date || !img || !hours) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    try {
      const response = await fetch(`${LOCALHOST}/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          location,
          date,
          img,
          hours: parseFloat(hours), // Ensure hours is a number
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Actividad creada con éxito.");
        setName("");
        setDescription("");
        setLocation("");
        setDate("");
        setImg("");
        setHours("");
      } else {
        Alert.alert("Error", data.error || "No se pudo crear la actividad.");
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      Alert.alert("Error", "Hubo un problema al crear la actividad.");
    }
  };

  return (
    <WithSidebar>
      <View style={styles.container}>
        <Text style={styles.title}>Agregar Actividad</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la actividad"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Ubicación"
          value={location}
          onChangeText={setLocation}
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={styles.input}
          placeholder="URL de la imagen"
          value={img}
          onChangeText={setImg}
        />
        <TextInput
          style={styles.input}
          placeholder="Duración en horas"
          keyboardType="numeric"
          value={hours}
          onChangeText={setHours}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Crear Actividad</Text>
        </TouchableOpacity>
      </View>
    </WithSidebar>
  );
};

export default AddActivity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#FF5722",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
