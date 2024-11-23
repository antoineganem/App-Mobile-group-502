import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";

const fallbackImage = "https://via.placeholder.com/150";

const CartPage: React.FC<{
  cart: any;
  setShowCartPage: (show: boolean) => void;
}> = ({ cart, setShowCartPage }) => {
  console.log("Cart:", cart);

  // Extract activities and donations details
  const activities = Object.values(cart.activities_details || {});
  const donations = Object.values(cart.donations_details || {});

  // Render Cart Item
  const renderCartItem = ({ item }: { item: any }) => {
    if (!item) return null;

    return (
      <View style={styles.cartItem}>
        <Image
          source={{ uri: item.imgUrl || fallbackImage }} // Use `imgUrl` for consistency
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.hours}>Horas: {item.hours}</Text>
          {/* Add Quantity for Donations */}
          {item.quantity && (
            <Text style={styles.quantity}>Cantidad: {item.quantity}</Text>
          )}
        </View>
      </View>
    );
  };

  const submitCart = async () => {
    try {
      const response = await fetch(
        `http://10.43.107.95:5000/cart?student_id=12`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cart),
        }
      );

      if (response.ok) {
        const data = await response.json();
        Alert.alert("Éxito", data.message); // Show success message
        console.log("Cart submitted successfully:", data);
        setShowCartPage(false); // Go back to the previous page
      } else {
        const error = await response.json();
        Alert.alert("Error", error.error || "No se pudo enviar el carrito");
      }
    } catch (error) {
      console.error("Error submitting cart:", error);
      Alert.alert("Error", "Hubo un problema al enviar el carrito");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowCartPage(false)}>
        <Text style={styles.backButton}>{"< Volver"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Mi Carrito</Text>

      {/* Render Activities */}
      <Text style={styles.sectionHeader}>Actividades</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCartItem}
      />

      {/* Render Donations */}
      <Text style={styles.sectionHeader}>Donaciones</Text>
      <FlatList
        data={donations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCartItem}
      />

      <TouchableOpacity style={styles.submitButton} onPress={submitCart}>
        <Text style={styles.submitButtonText}>Enviar Carrito</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartPage;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  hours: {
    fontSize: 14,
    color: "#666",
  },
  quantity: {
    fontSize: 14,
    color: "#666",
    fontWeight: "bold",
    marginTop: 4,
  },
  backButton: {
    fontSize: 16,
    color: "#FF5722",
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: "#FF5722",
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
