import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { formatDate } from "./HomeStudentsPage";
import WithSidebar from "./WithSidebar";

interface Activity {
  id: number;
  description: string;
  hours: number;
  date?: string;
  status: boolean; // true: completed, false: pending
}

interface Donation {
  id: number;
  name: string;
  hours: number;
  due_date?: string;
  status: boolean; // true: completed, false: pending
}

interface ProgressData {
  total_hours: number;
  activities: Activity[];
  donations: Donation[];
}

interface ProgressPageProps {
  studentId: number;
}

import { LOCALHOST } from "../constants";

const fallbackImage =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/640px-Good_Food_Display_-_NCI_Visuals_Online.jpg";

const ProgressPage: React.FC<ProgressPageProps> = () => {
  const studentId = 12; // Replace with actual student ID
  const [totalHours, setTotalHours] = useState<number>(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProgressData = async () => {
    try {
      const response = await fetch(
        `${LOCALHOST}/student/total_hours?student_id=${studentId}`
      );
      const data: ProgressData = await response.json();

      setTotalHours(data.total_hours);
      setActivities(data.activities);
      setDonations(data.donations);
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  const renderActivity = ({ item }: { item: Activity }) => (
    <View style={styles.card}>
      <Image source={{ uri: fallbackImage }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.description}</Text>
        <Text style={styles.cardSubtitle}>Horas: {item.hours}</Text>
        <Text style={styles.cardDate}>
          Fecha: {formatDate(item.date) || "Sin fecha"}
        </Text>
        <Text
          style={[
            styles.cardStatus,
            item.status ? styles.completed : styles.pending,
          ]}
        >
          {item.status ? "Completado" : "Pendiente"}
        </Text>
      </View>
    </View>
  );

  const renderDonation = ({ item }: { item: Donation }) => (
    <View style={styles.card}>
      <Image source={{ uri: fallbackImage }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>Horas: {item.hours}</Text>
        <Text style={styles.cardDate}>
          Fecha límite: {formatDate(item.due_date) || "Sin fecha"}
        </Text>
        <Text
          style={[
            styles.cardStatus,
            item.status ? styles.completed : styles.pending,
          ]}
        >
          {item.status ? "Completado" : "Pendiente"}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Total Hours */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Progreso del Estudiante</Text>
        <Text style={styles.summaryHours}>Total de Horas: {totalHours}</Text>
      </View>

      {/* Activities Section */}
      <Text style={styles.sectionTitle}>Actividades</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderActivity}
        contentContainerStyle={styles.listContainer}
      />

      {/* Donations Section */}
      <Text style={styles.sectionTitle}>Donaciones</Text>
      <FlatList
        data={donations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDonation}
        contentContainerStyle={styles.listContainer}
      />
    </ScrollView>
  );
};

export default (props: ProgressPageProps) => (
  <WithSidebar>
    <ProgressPage {...props} />
  </WithSidebar>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  summaryContainer: {
    backgroundColor: "#FF5722",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  summaryHours: {
    fontSize: 18,
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
    elevation: 2,
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 8,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#555",
  },
  cardDate: {
    fontSize: 12,
    color: "#777",
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },
  completed: {
    color: "green",
  },
  pending: {
    color: "red",
  },
});
