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
interface CategoryButtonsProps {
  cart: Cart; // Replace `Cart` with your actual cart type
  setCart: React.Dispatch<React.SetStateAction<Cart>>; // Correct typing for setCart
  addToCart: (id: number, type: string, item: any) => void; // Correct typing for addToCart
  removeFromCart: (id: number, type: string) => void; // Correct typing for removeFromCart
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({
  cart,
  setCart,
  addToCart,
  removeFromCart,
}) => {
  // Your component logic here

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [items, setItems] = useState([]);

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
    const donationDetails = cart.donations_details[item.donation_id] || {};
    const quantity = donationDetails.quantity || 0;

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
          <View style={donationStyles.quantityRow}>
            <TouchableOpacity
              style={donationStyles.quantityButton}
              onPress={() => removeFromCart(item.donation_id, "donation")}
            >
              <Icon name="remove-outline" size={20} color="white" />
            </TouchableOpacity>
            <Text style={donationStyles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={donationStyles.quantityButton}
              onPress={() =>
                addToCart(item.donation_id, "donation", {
                  id: item.donation_id,
                  name: item.name,
                  description: item.description,
                  hours: item.hours,
                  imgUrl: item.img,
                })
              }
            >
              <Icon
                name="add-outline"
                size={20}
                color="white"
                disabled={item.packages?.length > 0 ? true : false}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
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
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: "#FF5722",
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 4,
  },
});
