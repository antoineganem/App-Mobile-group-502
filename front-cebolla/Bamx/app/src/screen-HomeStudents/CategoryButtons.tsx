  import React, { useState } from "react";
  import {
    View,
    TouchableOpacity,
    FlatList,
    Text,
    Image,
    StyleSheet,
  } from "react-native";
  import Icon from "react-native-vector-icons/Ionicons";
  import styles from "./stylesHomeStudents";

  const fallbackImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/640px-Good_Food_Display_-_NCI_Visuals_Online.jpg"; // Fallback image URL

  const CategoryButtons: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [items, setItems] = useState([]);

    const [cart, setCart] = useState({
      activities_ids: [],
      donations_ids: [],
    });

    const categories = [
      { type: "food", icon: "nutrition-outline", label: "Food" },
      { type: "clothes", icon: "shirt-outline", label: "Clothes" },
      { type: "appliances", icon: "cafe-outline", label: "Appliances" },
    ];

    const fetchDonations = async (category: string) => {
      try {
        const response = await fetch(
          `http://10.43.107.95:5000/donations?student_id=12&type=${category}`
        );
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    const handleCategoryPress = (category: string) => {
      if (selectedCategory === category) {
        // If the category is already selected, deselect it and clear items
        setSelectedCategory(null);
        setItems([]);
      } else {
        // Otherwise, select the category and fetch its items
        setSelectedCategory(category);
        fetchDonations(category);
      }
    };

    const renderDonationCard = ({ item }: { item: any }) => {
      return (
        <View style={donationStyles.card}>
          <Image
            source={{ uri: item.img || fallbackImage }}
            style={donationStyles.image}
          />
          <View style={donationStyles.infoContainer}>
            <Text style={donationStyles.title}>{item.name}</Text>
            <Text style={donationStyles.date}>Fecha límite: {item.due_date}</Text>
            <Text style={donationStyles.hours}>Horas: {item.hours}</Text>
            <Text style={donationStyles.packages}>
              Paquetes: {item.packages?.length || 0}
            </Text>
            <TouchableOpacity
              style={donationStyles.button}
              onPress={() => addToCart(item.id, "donation")}
            >
              <Text style={donationStyles.buttonText}>Agregar al carrito</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    const addToCart = (id: number, type: "donation" | "activity") => {
      // Add logic to save the donation or activity to a local state (cart)
      setCart((prev) => ({
        ...prev,
        donations_ids:
          type === "donation" ? [...prev.donations_ids, id] : prev.donations_ids,
        activities_ids:
          type === "activity"
            ? [...prev.activities_ids, id]
            : prev.activities_ids,
      }));
    };

    return (
      <View>
        {/* Category Buttons */}
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.type}
              style={[
                styles.categoryButton,
                selectedCategory === category.type && styles.selectedButton,
              ]}
              onPress={() => handleCategoryPress(category.type)}
            >
              <Icon name={category.icon} size={32} color="black" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Donation Cards */}
        {selectedCategory && (
          <FlatList
            data={items}
            keyExtractor={(item) => item.donation_id.toString()}
            renderItem={renderDonationCard}
            contentContainerStyle={donationStyles.listContainer}
          />
        )}
      </View>
    );
  };

  export default CategoryButtons;

  const donationStyles = StyleSheet.create({
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
    date: {
      fontSize: 12,
      color: "#666",
      marginVertical: 4,
    },
    hours: {
      fontSize: 12,
      color: "#999",
    },
    packages: {
      fontSize: 12,
      color: "#999",
    },
  });
