import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
  Image,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface Activity {
  id: number;
  name: string;
  description: string;
  hours: number;
  img: string;
}

interface Donation {
  id: number;
  name: string;
  hours: number;
  img: string;
  due_date: string;
  packages: Array<{
    package_id: number;
    object: string;
    quantity: number;
    unity: string;
  }>;
}

interface Student {
  id: number;
  name: string;
  email: string;
  hours: number;
  status: boolean;
}

interface EventPageProps {
  studentId: number;
}

import { LOCALHOST } from "../constants";
import WithSidebar from "./WithSideBar";

const EventPage: React.FC<EventPageProps> = ({ studentId }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<null | {
    id: number;
    name: string;
    type: "activity" | "donation";
  }>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [originalStudents, setOriginalStudents] = useState<Student[]>([]); // For cancel changes
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  studentId = 0; // Replace with the actual student ID

  // Fetch activities and donations
  const fetchEvents = async () => {
    try {
      const [activitiesResponse, donationsResponse] = await Promise.all([
        fetch(`${LOCALHOST}/activities?student_id=${studentId}`),
        fetch(`${LOCALHOST}/donations?student_id=${studentId}&type=all`),
      ]);

      const activitiesData = await activitiesResponse.json();
      const donationsData = await donationsResponse.json();

      const formattedDonations = donationsData.map((donation: any) => ({
        id: donation.donation_id,
        name: donation.name,
        hours: donation.hours,
        img: donation.img,
        due_date: donation.due_date,
        packages: donation.packages || [],
      }));

      setActivities(activitiesData);
      setFilteredActivities(activitiesData);
      setDonations(formattedDonations);
      setFilteredDonations(formattedDonations);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search query changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Filter activities
    const filteredActs = activities.filter((activity) =>
      activity.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredActivities(filteredActs);

    // Filter donations
    const filteredDons = donations.filter((donation) =>
      donation.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDonations(filteredDons);
  };

  // Fetch students involved in an activity or donation
  const fetchStudents = async (id: number, type: "activity" | "donation") => {
    try {
      const url =
        type === "activity"
          ? `${LOCALHOST}/event/activity?activity_id=${id}`
          : `${LOCALHOST}/event/donation?donation_id=${id}`;
      const response = await fetch(url);
      const data = await response.json();
      setStudents(data);
      setOriginalStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Handle selecting an event
  const handleSelectEvent = async (
    id: number,
    name: string,
    type: "activity" | "donation"
  ) => {
    setSelectedEvent({ id, name, type });
    await fetchStudents(id, type);
    setModalVisible(true);
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    try {
      const url = `${LOCALHOST}/student/update_status`;

      const updates = students.filter(
        (student, index) => student.status !== originalStudents[index].status
      );

      await Promise.all(
        updates.map((student) =>
          fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              student_id: student.id,
              event_id: selectedEvent?.id,
              event_type: selectedEvent?.type,
              status: student.status,
            }),
          })
        )
      );

      setModalVisible(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  // Handle canceling changes
  const handleCancelChanges = () => {
    setStudents(originalStudents);
    setModalVisible(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

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
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  handleSelectEvent(item.id, item.name, "activity")
                }
              >
                <View style={styles.cardFlex}>
                  <Icon name="calendar-outline" size={24} color="black" />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>{item.description}</Text>
                    <Text style={styles.cardHours}>Horas: {item.hours}</Text>
                  </View>
                </View>
                <Icon name="chevron-forward-outline" size={24} color="#555" />
              </TouchableOpacity>
            )}
          />

          <Text style={styles.sectionTitle}>Donaciones</Text>
          <FlatList
            data={filteredDonations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  handleSelectEvent(item.id, item.name, "donation")
                }
              >
                <View style={styles.cardFlex}>
                  <Icon name="grid-outline" size={24} color="black" />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardHours}>Horas: {item.hours}</Text>
                  </View>
                </View>
                <Icon name="chevron-forward-outline" size={24} color="#555" />
              </TouchableOpacity>
            )}
          />
        </ScrollView>

        {/* Modal for Students */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={false}
        >
          <View style={styles.modalContainer}>
            {selectedEvent && (
              <View style={styles.detailsCard}>
                <View style={styles.detailsContent}>
                  <View style={styles.detailsText}>
                    {selectedEvent.type === "activity" && (
                      <>
                        <Text style={styles.detailsTitle}>
                          {selectedEvent.name}
                        </Text>
                        <Text style={styles.detailsDescription}>
                          Descripción:{" "}
                          {
                            activities.find((a) => a.id === selectedEvent.id)
                              ?.description
                          }
                        </Text>
                        <Text style={styles.detailsHours}>
                          Horas:{" "}
                          {
                            activities.find((a) => a.id === selectedEvent.id)
                              ?.hours
                          }
                        </Text>
                      </>
                    )}
                    {selectedEvent.type === "donation" && (
                      <>
                        <Text style={styles.detailsTitle}>
                          {selectedEvent.name}
                        </Text>
                        <Text style={styles.detailsDescription}>
                          Fecha límite:{" "}
                          {new Date(
                            donations.find((d) => d.id === selectedEvent.id)
                              ?.due_date || ""
                          ).toLocaleDateString()}
                        </Text>
                        <Text style={styles.detailsHours}>
                          Horas:{" "}
                          {
                            donations.find((d) => d.id === selectedEvent.id)
                              ?.hours
                          }
                        </Text>
                        <Text style={styles.detailsPackages}>
                          Paquetes incluidos:
                        </Text>
                        {donations
                          .find((d) => d.id === selectedEvent.id)
                          ?.packages.map((pkg, index) => (
                            <Text key={index} style={styles.packageItem}>
                              - {pkg.quantity} {pkg.unity} de {pkg.object}
                            </Text>
                          ))}
                      </>
                    )}
                  </View>
                  <Image
                    source={{
                      uri:
                        selectedEvent.type === "activity"
                          ? activities.find((a) => a.id === selectedEvent.id)
                              ?.img
                          : donations.find((d) => d.id === selectedEvent.id)
                              ?.img,
                    }}
                    style={styles.detailsImage}
                  />
                </View>
              </View>
            )}

            <FlatList
              data={students}
              keyExtractor={(student) => student.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.studentCard}>
                  <View style={styles.studentInfo}>
                    <Icon name="person-circle-outline" size={24} color="#555" />
                    <Text style={styles.studentName}>{item.name}</Text>
                    <Text style={styles.studentEmail}>{item.email}</Text>
                  </View>
                  <Switch
                    value={item.status}
                    onValueChange={(value) =>
                      setStudents((prev) =>
                        prev.map((student) =>
                          student.id === item.id
                            ? { ...student, status: value }
                            : student
                        )
                      )
                    }
                  />
                </View>
              )}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelChanges}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveChanges}
              >
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </WithSidebar>
  );
};

export default EventPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 18, color: "#555" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 8 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textTransform: "capitalize",
  },
  cardSubtitle: { fontSize: 14, color: "#555" },
  cardHours: { fontSize: 12, color: "#777" },
  modalContainer: { flex: 1, padding: 16 },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  studentInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  studentName: { fontSize: 16, marginLeft: 8, color: "#333" },
  studentEmail: { fontSize: 12, marginLeft: 8, color: "#777" },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4, // Adjust spacing to make both buttons symmetrical
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#FF5722",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4, // Adjust spacing to align with the cancel button
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  detailsCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  detailsContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailsText: {
    flex: 2,
    marginRight: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  detailsDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  detailsHours: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  detailsPackages: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    marginBottom: 4,
  },
  packageItem: {
    fontSize: 14,
    color: "#555",
  },
  detailsImage: {
    flex: 1,
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  cardFlex: {
    flex: 1,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
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
});
