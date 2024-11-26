import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import WithSidebar from "./WithSidebar"; // Wrapper with sidebar functionality
import { LOCALHOST } from "../constants";

const AddDonation: React.FC = () => {
  const [hours, setHours] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [packages, setPackages] = useState<
    Array<{ unity: string; quantity: number; object: string }>
  >([]);

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const handleAddPackage = () => {
    setPackages([...packages, { unity: "", quantity: 0, object: "" }]);
  };

  const handleUpdatePackage = (
    index: number,
    field: "unity" | "quantity" | "object",
    value: string | number
  ) => {
    const updatedPackages = [...packages];
    updatedPackages[index][field] = value;
    setPackages(updatedPackages);
  };

  const handleSubmit = async () => {
    if (!hours || !name || !img || !type || !dueDate) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    try {
      const response = await fetch(`${LOCALHOST}/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hours: parseFloat(hours), // Ensure hours is a number
          name,
          img,
          due_date: dueDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
          type,
          packages,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Donación creada con éxito.");
        setHours("");
        setName("");
        setImg("");
        setType("");
        setDueDate(null);
        setPackages([]);
      } else {
        Alert.alert("Error", data.error || "No se pudo crear la donación.");
      }
    } catch (error) {
      console.error("Error creating donation:", error);
      Alert.alert("Error", "Hubo un problema al crear la donación.");
    }
  };

  return (
    <WithSidebar>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Agregar Donación</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la Donación"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Horas"
          keyboardType="numeric"
          value={hours}
          onChangeText={setHours}
        />
        <TextInput
          style={styles.input}
          placeholder="URL de la Imagen"
          value={img}
          onChangeText={setImg}
        />
        <TextInput
          style={styles.input}
          placeholder="Tipo de Donación (e.g., food, clothes)"
          value={type}
          onChangeText={setType}
        />
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.datePickerText}>
            {dueDate
              ? `Fecha Límite: ${dueDate.toLocaleDateString()}`
              : "Seleccionar Fecha Límite"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDueDate(selectedDate);
              }
            }}
          />
        )}
        <Text style={styles.subTitle}>Paquetes</Text>
        {packages.map((pkg, index) => (
          <View key={index} style={styles.packageContainer}>
            <TextInput
              style={styles.input}
              placeholder="Unidad (e.g., Box)"
              value={pkg.unity}
              onChangeText={(value) =>
                handleUpdatePackage(index, "unity", value)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Cantidad"
              keyboardType="numeric"
              value={pkg.quantity.toString()}
              onChangeText={(value) =>
                handleUpdatePackage(index, "quantity", parseInt(value) || 0)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Objeto (e.g., Food, Clothes)"
              value={pkg.object}
              onChangeText={(value) =>
                handleUpdatePackage(index, "object", value)
              }
            />
          </View>
        ))}
        <TouchableOpacity
          style={styles.addPackageButton}
          onPress={handleAddPackage}
        >
          <Text style={styles.addPackageButtonText}>Agregar Paquete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Crear Donación</Text>
        </TouchableOpacity>
      </ScrollView>
    </WithSidebar>
  );
};

export default AddDonation;

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
  datePickerButton: {
    backgroundColor: "#FF5722",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  datePickerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  packageContainer: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addPackageButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addPackageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
