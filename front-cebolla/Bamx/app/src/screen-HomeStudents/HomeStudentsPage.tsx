import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import HeaderIcons from "./HeaderIcons";
import SearchBar from "./SearchBar";
import CategoryButtons from "./CategoryButtons";
import Sidebar from "./Sidebar";
import styles from "./stylesHomeStudents";

const fallbackImage =
  "https://static8.depositphotos.com/1067257/874/v/450/depositphotos_8744393-stock-illustration-happy-guy-cheering.jpg"; // Fallback image URL

const HomeStudentsPage: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          "http://10.43.107.95:5000/activities?student_id=12"
        );
        const data = await response.json();
        // Add a fallback image to each activity item if it doesn't already have one
        const activitiesWithFallback = data.map((activity: any) => ({
          ...activity,
          img: activity.img || fallbackImage,
        }));
        setActivities(activitiesWithFallback);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const openModal = (activity: any) => {
    setSelectedActivity(activity);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedActivity(null);
    setModalVisible(false);
  };

  const renderActivityCard = ({ item }: { item: any }) => (
    <View style={activityStyles.card}>
      <Image
        source={{ uri: item.img }}
        style={activityStyles.image}
        onError={({ nativeEvent }) => {
          // Replace the image URL with the fallback image if it fails to load
          item.img = fallbackImage;
        }}
      />
      <View style={activityStyles.infoContainer}>
        <Text style={activityStyles.title}>{item.name}</Text>
        <Text style={activityStyles.description}>{item.description}</Text>
        <Text style={activityStyles.hours}>Duración: {item.hours} horas</Text>
        <TouchableOpacity
          style={activityStyles.button}
          onPress={() => openModal(item)}
        >
          <Text style={activityStyles.buttonText}>Registrarme</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderIcons onMenuPress={toggleSidebar} />
      <SearchBar />
      <Text style={styles.sectionTitle}>Donaciones</Text>
      <CategoryButtons />
      <Text style={styles.activitiesTitle}>Actividades</Text>

      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderActivityCard}
        contentContainerStyle={activityStyles.listContainer}
      />

      <TouchableOpacity style={styles.homeIconContainer}>
        <Icon name="home-outline" size={32} color="white" />
      </TouchableOpacity>

      {/* Modal for Activity Details */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalContainer}>
            <TouchableOpacity
              style={modalStyles.closeButton}
              onPress={closeModal}
            >
              <Icon name="close-outline" size={24} color="#000" />
            </TouchableOpacity>
            {selectedActivity && (
              <>
                <Text style={modalStyles.title}>{selectedActivity.name}</Text>
                <Text style={modalStyles.description}>
                  {selectedActivity.description}
                </Text>
                <Text style={modalStyles.date}>
                  Fecha: {selectedActivity.date}
                </Text>
                <TouchableOpacity style={modalStyles.registerButton}>
                  <Text style={modalStyles.registerButtonText}>
                    Registrarme
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeStudentsPage;

const activityStyles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
  infoContainer: {
    flex: 1,
    padding: 8,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  hours: {
    fontSize: 12,
    color: "#999",
  },
  button: {
    backgroundColor: "#FF5722",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "80%",
    padding: 16,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: "#FF5722",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
