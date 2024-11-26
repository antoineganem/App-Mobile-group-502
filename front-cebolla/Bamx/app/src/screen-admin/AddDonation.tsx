import WithSidebar from "./WithSideBar";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { LOCALHOST } from "../constants";

interface Package {
  object: string;
  quantity: string;
  unity: string;
}

const AddDonationPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [hours, setHours] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [tipo, setTipo] = useState<string>("food");
  const [packages, setPackages] = useState<Package[]>([]);
  const [packageObject, setPackageObject] = useState<string>("");
  const [packageQuantity, setPackageQuantity] = useState<string>("");
  const [packageUnity, setPackageUnity] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const handleAddPackage = () => {
    if (!packageObject || !packageQuantity || !packageUnity) {
      Alert.alert("Error", "Todos los campos del paquete son obligatorios.");
      return;
    }
    setPackages([
      ...packages,
      { object: packageObject, quantity: packageQuantity, unity: packageUnity },
    ]);
    setPackageObject("");
    setPackageQuantity("");
    setPackageUnity("");
  };

  const handleSubmit = async () => {
    if (!name || !hours || !img || !dueDate || !tipo) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch(`${LOCALHOST}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          hours: parseFloat(hours),
          img,
          due_date: dueDate.toISOString(),
          type: tipo,
          packages,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert("Éxito", "Donativo agregado correctamente");
        setName("");
        setHours("");
        setImg("");
        setDueDate(undefined);
        setTipo("food");
        setPackages([]);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Hubo un problema");
      }
    } catch (error) {
      console.error("Error al agregar donativo:", error);
      Alert.alert("Error", "No se pudo agregar el donativo");
    }
  };

  return (
    <View style={styles.container}>
      <WithSidebar>
        <Text style={styles.title}>Agregar Donativo</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre del donativo"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Horas estimadas"
          value={hours}
          onChangeText={setHours}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="URL de la imagen"
          value={img}
          onChangeText={setImg}
        />

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>
            {dueDate
              ? `Fecha de vencimiento: ${dueDate.toLocaleDateString()}`
              : "Seleccionar fecha de vencimiento"}
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

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Tipo de donativo:</Text>
          <Picker
            selectedValue={tipo}
            onValueChange={(itemValue) => setTipo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Comida" value="food" />
            <Picker.Item label="Ropa" value="clothes" />
            <Picker.Item label="Electrodomésticos" value="appliances" />
          </Picker>
        </View>

        <Text style={styles.sectionTitle}>Agregar Paquetes</Text>
        <TextInput
          style={styles.input}
          placeholder="Objeto"
          value={packageObject}
          onChangeText={setPackageObject}
        />
        <TextInput
          style={styles.input}
          placeholder="Cantidad"
          value={packageQuantity}
          onChangeText={setPackageQuantity}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Unidad (e.g., Caja, Unidad)"
          value={packageUnity}
          onChangeText={setPackageUnity}
        />
        <TouchableOpacity
          style={styles.addPackageButton}
          onPress={handleAddPackage}
        >
          <Text style={styles.addPackageButtonText}>Agregar Paquete</Text>
        </TouchableOpacity>

        <FlatList
          data={packages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.packageItem}>
              <Text>{`${item.quantity} ${item.unity} de ${item.object}`}</Text>
            </View>
          )}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Agregar Donativo</Text>
        </TouchableOpacity>
      </WithSidebar>
    </View>
  );
};

export default AddDonationPage;

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
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  datePickerButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  datePickerText: {
    color: "#333",
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  picker: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
  },
  addPackageButton: {
    backgroundColor: "#FF5722",
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
  packageItem: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#FF5722",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
