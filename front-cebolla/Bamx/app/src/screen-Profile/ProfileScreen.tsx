import React,{ useEffect,useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window"); // Get device dimensions

import { LOCALHOST } from "../constants";

const ProfileScreen: React.FC = () => {
  
  interface user {
    name: string;
    email: string;
  }

  const [user, setUser] = useState<user>({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState<boolean>(true);

const fetchUser = async () => {
  setLoading(true);
  try{
    const response = await fetch(`${LOCALHOST}/getUser?user_id=114`);
    const data = await response.json();
    console.log(data);
    setUser({name: data.user.name, email: data.user.email});
  } catch(error){
    console.error(error);
  }
  setLoading(false);
};

  useEffect(() => {
    fetchUser();
  },[loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }


  return (
  <View style={styles.container}>
      {/* Header */}
    <Text style={styles.header}>Perfil</Text>

    {/* Centered Input Fields */}
      <View style={styles.inputField}>
        <Icon name="person-outline" size={20} color="red" style={styles.inputIcon} />
        <TextInput style={styles.textInput} value={user.name} editable={false} />
      </View>

      <View style={styles.inputField}>
        <Icon name="mail-outline" size={20} color="red" style={styles.inputIcon} />
        <TextInput style={styles.textInput} value={user.email} editable={false} />
      </View>

      <View style={styles.inputField}>
        <Icon name="lock-closed-outline" size={20} color="red" style={styles.inputIcon} />
        <TextInput style={styles.textInput} value="********" editable={false} />
      </View>

    {/* Bottom Navigation */}
    <View style={styles.bottomNavigation}>
      <TouchableOpacity onPress={() => router.push("src/screen-HomeStudents/HomeStudentsPage")}>
        <Icon name="home" size={30} color="red" />
      </TouchableOpacity>
    </View>
  </View>

  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f8f9fa",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Inter_700Bold",
    },
      inputField: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "red",
        borderRadius: 12,
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.01,
        marginBottom: height * 0.02,
        marginTop: height * 0.02,
        width: "90%",
      },
      inputIcon: {
        marginRight: 10,
      },
      textInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: "Inter_400Regular",
      },
      bottomNavigation: {
        position: "absolute",
        bottom: 20,
        alignItems: "center",
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
    });