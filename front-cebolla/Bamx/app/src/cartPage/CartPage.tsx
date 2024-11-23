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
  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.img }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.hours}>Horas: {item.hours}</Text>
      </View>
    </View>
  );

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
      <FlatList
        data={cart.activities_ids.map((id) => ({
          id,
          name: `Actividad ${id}`,
          img: fallbackImage,
          hours: 2,
        }))}
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
    marginBottom: 16,
  },
  hours: {
    fontSize: 14,
    color: "#666",
  },
  backButton: {
    fontSize: 16,
    color: "#FF5722",
    marginBottom: 16,
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
