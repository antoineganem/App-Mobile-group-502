import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import WithSidebar from "./WithSideBar";

interface Activity {
  id: number;
  name: string;
  description: string;
  hours: number;
  img: string;
  location?: string;
  date?: string;
}

interface Donation {
  id: number;
  name: string;
  hours: number;
  img: string;
  due_date: string;
  type?: string;
  packages: Array<{
    package_id: number;
    object: string;
    quantity: number;
    unity: string;
  }>;
}

interface EventPageProps {}

import { LOCALHOST } from "../constants";

const AdminEventPage: React.FC<EventPageProps> = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<null | {
    type: "activity" | "donation";
    data: Activity | Donation;
  }>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  // Fetch activities and donations
  const fetchEvents = async () => {
    try {
      const [activitiesResponse, donationsResponse] = await Promise.all([
        fetch(`${LOCALHOST}/activities?student_id=0`),
        fetch(`${LOCALHOST}/donations?student_id=0&type=all`),
      ]);

      const activitiesData = await activitiesResponse.json();
      const donationsData = await donationsResponse.json();

      const validActivities = activitiesData.filter(
        (item: Activity) => item?.id
      );
      const validDonations = donationsData.map((donation: any) => ({
        id: donation.donation_id,
        name: donation.name,
        hours: donation.hours,
        img: donation.img,
        due_date: donation.due_date,
        type: donation.type,
        packages: donation.packages || [],
      }));

      setActivities(validActivities);
      setFilteredActivities(validActivities);
      setDonations(validDonations);
      setFilteredDonations(validDonations);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle search query changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const filteredActs = activities.filter((activity) =>
      activity.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredActivities(filteredActs);

    const filteredDons = donations.filter((donation) =>
      donation.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDonations(filteredDons);
  };

  // Handle editing an item
  const handleEditItem = (
    type: "activity" | "donation",
    item: Activity | Donation
  ) => {
    setSelectedItem({ type, data: item });
    setModalVisible(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedItem) return;

    const { type, data } = selectedItem;

    const url = `${LOCALHOST}/${
      type === "activity" ? "activities" : "donations"
    }?id=${data.id}`;

    try {
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      fetchEvents(); // Refresh the list
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDeleteItem = async (
    type: "activity" | "donation",
    id: number
  ) => {
    const url = `${LOCALHOST}/${
      type === "activity" ? "activities" : "donations"
    }?id=${id}`;

    const confirmDelete = new Promise((resolve) => {
      Alert.alert(
        "Confirmar eliminación",
        `¿Estás seguro que deseas eliminar este ${
          type === "activity" ? "actividad" : "donación"
        }?`,
        [
          { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: () => resolve(true),
          },
        ]
      );
    });

    const shouldDelete = await confirmDelete;
    if (!shouldDelete) return;

    try {
      await fetch(url, {
        method: "DELETE",
      });
      fetchEvents(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <WithSidebar>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar actividades o donaciones..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <Icon
            name="search"
            size={20}
            color="gray"
            style={styles.searchIcon}
          />
        </View>

        <ScrollView>
          <Text style={styles.sectionTitle}>Actividades</Text>
          <FlatList
            data={filteredActivities}
            keyExtractor={(item) =>
              item?.id?.toString() || String(Math.random())
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.innerContent}
                  onPress={() => handleEditItem("activity", item)}
                >
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardHours}>Horas: {item.hours}</Text>
                </TouchableOpacity>
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 20 }}
                >
                  <TouchableOpacity
                    onPress={() => handleEditItem("activity", item)}
                  >
                    <Icon name="create-outline" size={24} color="black" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteItem("activity", item.id)}
                  >
                    <Icon name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <Text style={styles.sectionTitle}>Donaciones</Text>
          <FlatList
            data={filteredDonations}
            keyExtractor={(item) =>
              item?.id?.toString() || String(Math.random())
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.innerContent}
                  onPress={() => handleEditItem("donation", item)}
                >
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardHours}>Horas: {item.hours}</Text>
                </TouchableOpacity>
                <View
                  style={{ display: "flex", flexDirection: "row", gap: 20 }}
                >
                  <TouchableOpacity
                    onPress={() => handleEditItem("donation", item)}
                  >
                    <Icon name="create-outline" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteItem("donation", item.id)}
                  >
                    <Icon name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </ScrollView>

        {/* Modal for Editing */}
        {selectedItem && (
          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={false}
            onRequestClose={() => setModalVisible(false)}
          >
            {console.log(selectedItem)}
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {selectedItem.type === "activity"
                  ? "Editar Actividad"
                  : "Editar Donación"}
              </Text>

              {/* Common Fields */}
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={selectedItem.data.name}
                onChangeText={(text) =>
                  setSelectedItem((prev) =>
                    prev
                      ? { ...prev, data: { ...prev.data, name: text } }
                      : null
                  )
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={selectedItem.data.description || ""}
                onChangeText={(text) =>
                  setSelectedItem((prev) =>
                    prev
                      ? { ...prev, data: { ...prev.data, description: text } }
                      : null
                  )
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Horas"
                value={String(selectedItem.data.hours || "")}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setSelectedItem((prev) =>
                    prev
                      ? {
                          ...prev,
                          data: { ...prev.data, hours: parseFloat(text) || 0 },
                        }
                      : null
                  )
                }
              />

              {/* Activity-Specific Fields */}
              {selectedItem.type === "activity" && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Ubicación"
                    value={(selectedItem.data as Activity).location || ""}
                    onChangeText={(text) =>
                      setSelectedItem((prev) =>
                        prev
                          ? { ...prev, data: { ...prev.data, location: text } }
                          : null
                      )
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Fecha (YYYY-MM-DD)"
                    value={(selectedItem.data as Activity).date || ""}
                    onChangeText={(text) =>
                      setSelectedItem((prev) =>
                        prev
                          ? { ...prev, data: { ...prev.data, date: text } }
                          : null
                      )
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="URL de la Imagen"
                    value={(selectedItem.data as Activity).img || ""}
                    onChangeText={(text) =>
                      setSelectedItem((prev) =>
                        prev
                          ? { ...prev, data: { ...prev.data, img: text } }
                          : null
                      )
                    }
                  />
                </>
              )}

              {/* Donation-Specific Fields */}
              {selectedItem.type === "donation" && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Fecha Límite (YYYY-MM-DD)"
                    value={(selectedItem.data as Donation).due_date || ""}
                    onChangeText={(text) =>
                      setSelectedItem((prev) =>
                        prev
                          ? { ...prev, data: { ...prev.data, due_date: text } }
                          : null
                      )
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Tipo (food, clothes, appliances)"
                    value={(selectedItem.data as Donation).type || ""}
                    onChangeText={(text) =>
                      setSelectedItem((prev) =>
                        prev
                          ? { ...prev, data: { ...prev.data, type: text } }
                          : null
                      )
                    }
                  />
                  {/* Packages */}
                  <View>
                    <Text style={styles.label}>Paquetes</Text>
                    {(selectedItem.data as Donation).packages.map(
                      (pkg, index) => (
                        <View key={index} style={styles.packageContainer}>
                          <TextInput
                            style={styles.packageInput}
                            placeholder="Objeto"
                            value={pkg.object}
                            onChangeText={(text) => {
                              const newPackages = [
                                ...(selectedItem.data as Donation).packages,
                              ];
                              newPackages[index].object = text;
                              setSelectedItem((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      data: {
                                        ...prev.data,
                                        packages: newPackages,
                                      },
                                    }
                                  : null
                              );
                            }}
                          />
                          <TextInput
                            style={styles.packageInput}
                            placeholder="Unidad"
                            value={pkg.unity}
                            onChangeText={(text) => {
                              const newPackages = [
                                ...(selectedItem.data as Donation).packages,
                              ];
                              newPackages[index].unity = text;
                              setSelectedItem((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      data: {
                                        ...prev.data,
                                        packages: newPackages,
                                      },
                                    }
                                  : null
                              );
                            }}
                          />
                          <TextInput
                            style={styles.packageInput}
                            placeholder="Cantidad"
                            keyboardType="numeric"
                            value={String(pkg.quantity)}
                            onChangeText={(text) => {
                              const newPackages = [
                                ...(selectedItem.data as Donation).packages,
                              ];
                              newPackages[index].quantity = parseInt(text) || 0;
                              setSelectedItem((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      data: {
                                        ...prev.data,
                                        packages: newPackages,
                                      },
                                    }
                                  : null
                              );
                            }}
                          />
                        </View>
                      )
                    )}
                    <TouchableOpacity
                      style={styles.addPackageButton}
                      onPress={() => {
                        const newPackages = [
                          ...(selectedItem.data as Donation).packages,
                          { object: "", unity: "", quantity: 0 },
                        ];
                        setSelectedItem((prev) =>
                          prev
                            ? {
                                ...prev,
                                data: { ...prev.data, packages: newPackages },
                              }
                            : null
                        );
                      }}
                    >
                      <Text style={styles.addPackageText}>Añadir Paquete</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Save and Cancel Buttons */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveChanges}
              >
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>
    </WithSidebar>
  );
};

export default AdminEventPage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  searchIcon: {
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "space-between",
  },
  innerContent: {
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  cardHours: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
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
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: "#FF5722",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});
