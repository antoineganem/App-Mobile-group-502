import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import HeaderIcons from "./HeaderIcons";
import SearchBar from "./SearchBar";
import CategoryButtons from "./CategoryButtons";
import Sidebar from "./Sidebar";
import CartPage from "../cartPage/CartPage"; // Import CartPage
import styles from "./stylesHomeStudents";

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Sin fecha";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

const fallbackImage =
  "https://static8.depositphotos.com/1067257/874/v/450/depositphotos_8744393-stock-illustration-happy-guy-cheering.jpg"; // Fallback image URL

// Types for activity and cart
type Activity = {
  id: number;
  name: string;
  description: string;
  img: string;
  hours: number;
  date?: string;
};

type Activities = {
  id: number;
  name: string;
  description: string;
  hours: number;
  imgUrl: string;
};
type Donations = {
  id: number;
  name: string;
  description: string;
  hours: number;
  imgUrl: string;
};

type Cart = {
  activities_ids: number[];
  donations_ids: number[];
  activities_details: Record<number, Activities>; // Use object with keys as `id`
  donations_details: Record<number, Donations>;
};

import { LOCALHOST } from "../constants";

const HomeStudentsPage: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const [cart, setCart] = useState<Cart>({
    activities_ids: [],
    donations_ids: [],
    activities_details: {}, // Initialize as empty objects
    donations_details: {},
  });

  const [showCartPage, setShowCartPage] = useState<boolean>(false); // Track whether to show the cart page

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const url = `${LOCALHOST}/activities?student_id=12`;
        console.log("Fetching activities from:", url);
        const response = await fetch(`${LOCALHOST}/activities?student_id=12`);
        const data = await response.json();
        const activitiesWithFallback = data.map((activity: Activity) => ({
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

  const openModal = (activity: Activity) => {
    setSelectedActivity(activity);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedActivity(null);
    setModalVisible(false);
  };

  const addToCart = (
    id: number,
    type: "activity" | "donation",
    details: Activities | Donations
  ) => {
    setCart((prevCart) => {
      if (type === "activity") {
        // Only add the activity if it's not already in the cart
        if (prevCart.activities_ids.includes(id)) return prevCart;

        return {
          ...prevCart,
          activities_ids: [...prevCart.activities_ids, id],
          activities_details: {
            ...prevCart.activities_details,
            [id]: details as Activities,
          },
        };
      }

      if (type === "donation") {
        // Handle donations with quantities
        const updatedDonationsDetails = { ...prevCart.donations_details };
        if (updatedDonationsDetails[id]) {
          updatedDonationsDetails[id].quantity += 1; // Increment quantity
        } else {
          updatedDonationsDetails[id] = { ...details, quantity: 1 }; // Initialize quantity
        }

        return {
          ...prevCart,
          donations_ids: [...new Set([...prevCart.donations_ids, id])], // Ensure no duplicates
          donations_details: updatedDonationsDetails,
        };
      }

      return prevCart; // Fallback case
    });
  };

  const removeFromCart = (id: number, type: "activity" | "donation") => {
    setCart((prevCart) => {
      if (type === "activity") {
        // Remove activity if it exists in the cart
        const updatedActivitiesDetails = { ...prevCart.activities_details };
        delete updatedActivitiesDetails[id];

        return {
          ...prevCart,
          activities_ids: prevCart.activities_ids.filter(
            (activityId) => activityId !== id
          ),
          activities_details: updatedActivitiesDetails,
        };
      }

      if (type === "donation") {
        // Handle donations with quantities
        const updatedDonationsDetails = { ...prevCart.donations_details };

        if (updatedDonationsDetails[id]) {
          if (updatedDonationsDetails[id].quantity > 1) {
            updatedDonationsDetails[id].quantity -= 1; // Decrement quantity
          } else {
            delete updatedDonationsDetails[id]; // Remove donation if quantity is 0
          }
        }

        return {
          ...prevCart,
          donations_ids: prevCart.donations_ids.filter(
            (donationId) => donationId !== id || updatedDonationsDetails[id]
          ),
          donations_details: updatedDonationsDetails,
        };
      }

      return prevCart; // Fallback case
    });
  };

  const renderActivityCard = ({ item }: { item: Activity }) => {
    const isInCart = cart.activities_ids.includes(item.id);

    return (
      <View style={activityStyles.card}>
        <Image
          source={{ uri: item.img || fallbackImage }}
          style={activityStyles.image}
        />
        <View style={activityStyles.infoContainer}>
          <Text style={activityStyles.title}>{item.name}</Text>
          <Text style={activityStyles.description}>{item.description}</Text>
          <Text style={activityStyles.hours}>Duración: {item.hours} horas</Text>
          <View style={activityStyles.buttonRow}>
            <TouchableOpacity
              style={activityStyles.button}
              onPress={() => openModal(item)} // Open modal on "Detalles" click
            >
              <Text style={activityStyles.buttonText}>Detalles</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                activityStyles.cartButton,
                isInCart && activityStyles.buttonInCart,
              ]}
              onPress={() => {
                if (isInCart) {
                  removeFromCart(item.id, "activity");
                } else {
                  addToCart(item.id, "activity", item);
                }
              }}
            >
              <Icon
                name={isInCart ? "trash-outline" : "cart-outline"}
                size={18}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (showCartPage) {
    return (
      <CartPage
        cart={cart}
        setCart={setCart}
        setShowCartPage={setShowCartPage}
      />
    );
  }

  return (
    <View style={styles.container}>
      <HeaderIcons
        onMenuPress={toggleSidebar}
        onCartPress={() => setShowCartPage(true)} // Navigate to the cart page
      />
      <SearchBar />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.sectionTitle}>Donaciones</Text>
        <CategoryButtons
          cart={cart}
          setCart={setCart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
        <Text style={styles.activitiesTitle}>Actividades</Text>

        <FlatList
          data={activities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderActivityCard}
          contentContainerStyle={activityStyles.listContainer}
          scrollEnabled={false} // Disable FlatList scrolling to allow ScrollView to handle scrolling
        />
      </ScrollView>

      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />

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
                <Image
                  source={{ uri: selectedActivity.img || fallbackImage }}
                  style={modalStyles.image}
                />
                <Text style={modalStyles.title}>{selectedActivity.name}</Text>
                <Text style={modalStyles.description}>
                  {selectedActivity.description}
                </Text>
                <Text style={modalStyles.date}>
                  Fecha: {formatDate(selectedActivity.date)}
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeStudentsPage;

// Add styles for activities and modal here

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
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#FF5722",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  cartButton: {
    backgroundColor: "#FF5722",
    borderRadius: 4,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonInCart: {
    backgroundColor: "#FF2C2C",
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
});
