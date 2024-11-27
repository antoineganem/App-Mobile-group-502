import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useWindowDimensions } from "react-native";
import { router } from "expo-router";
import Sidebar from "../screen-HomeStudents/Sidebar";
import { LOCALHOST } from "../constants";

const ProfileScreen: React.FC = () => {
  const { width, height } = useWindowDimensions(); // Dynamically get width and height

  interface User {
    name: string;
    email: string;
    profileImage: string;
  }

  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    profileImage: "",
  });
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${LOCALHOST}/getUser?user_id=114`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }
      const data = await response.json();
      if (data?.user) {
        setUser(data.user);
      } else {
        console.error("Unexpected response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [width, height]);

  const styles = dynamicStyles(width, height); // Generate dynamic styles

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <>
      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
      <View style={styles.container}>
        <TouchableOpacity style={styles.menu} onPress={toggleSidebar}>
          <Icon name="menu" size={30} color="red" />
        </TouchableOpacity>
        <Text style={styles.header}>Perfil</Text>
        <View style={[styles.profilePictureContainer, { width: width * 0.35, height: width * 0.35 }]}>
          <Image
            source={{
              uri:
                user.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={[styles.profilePicture, { width: "100%", height: "100%", borderRadius: (width * 0.35) / 2 }]}
            resizeMode="cover"
          />
        </View>
        <View style={styles.inputField}>
          <Icon name="person-outline" size={20} color="red" style={styles.inputIcon} />
          <TextInput style={styles.textInput} value={user.name} editable={false} />
        </View>
        <View style={styles.inputField}>
          <Icon name="mail-outline" size={20} color="red" style={styles.inputIcon} />
          <TextInput style={styles.textInput} value={user.email} editable={false} />
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => console.log("Delete Account")}>
          <Text style={styles.deleteButtonText}>Eliminar Cuenta</Text>
        </TouchableOpacity>
        <View style={styles.bottomNavigation}>
          <TouchableOpacity onPress={() => router.push("src/screen-HomeStudents/HomeStudentsPage")}>
            <Icon name="home" size={30} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ProfileScreen;

const dynamicStyles = (width: number, height: number) =>
   StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: "flex-start",
  },
  menu: {
    alignSelf: "flex-start",
    marginLeft: 15,
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    width: "100%",
  },
  profilePictureContainer: {
    width: width * 0.3, // 35% of screen width
    height: width * 0.3,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePicture: {
    width: "100%", // Use the full container width
    height: "100%", // Match height to width for a perfect circle
    borderRadius: (width * 0.35) / 2,
    borderWidth: 3,
    borderColor: "red",
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    width: "90%", // Ensure it fits the screen width
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "90%", // Ensure it fits the screen width
    alignItems: "center",
    marginBottom: 20,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Inter_700Bold",
  },
  bottomNavigation: {
    position: "absolute", // Fix it to the bottom of the screen
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Ensure it spans the full width
  },
});
