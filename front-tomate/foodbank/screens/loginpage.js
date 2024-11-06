import React from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

export function LogInScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [selectedValue, setSelectedValue] = React.useState('');

    const handleCreateAccount = async () => {
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Save user role in Firestore
            await firestore().collection('users').doc(user.uid).set({
                email: email,
                role: selectedValue,
            });

            Alert.alert('Account Created!', `User role: ${selectedValue}`);
            console.log('Account Created with role:', selectedValue);
        } catch (error) {
            console.log('Error creating the account', error);
            Alert.alert(error.message);
        }
    };

    const handleSignIn = async () => {
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Retrieve user role from Firestore
            const userDoc = await firestore().collection('users').doc(user.uid).get();
            const userData = userDoc.data();

            if (userData.role === 'admin') {
                navigation.replace('AdminHome');
            } else {
                navigation.replace('StudentHome');
            }
            console.log('Signed In as:', userData.role);
        } catch (error) {
            console.log('Error signing in the account', error);
            Alert.alert(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Image 
                source={require('../assets/food_bank_images/food_logo_4.png')}
                style={styles.profilePicture}
            />
            <View>
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#FF5F1F', textAlign: 'left', marginTop: 20, marginBottom: 10 }}>¡Bienvenido!</Text>
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'black' }}>Usuario</Text>
                <TextInput onChangeText={(text => setEmail(text))} style={styles.input} placeholder="bank_food@gmail.com" placeholderTextColor="#aaa" />
            </View>

            <View>
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'black', marginTop: 7 }}>Contraseña</Text>
                <TextInput onChangeText={(text => setPassword(text))} style={styles.input} placeholder="Contraseña" placeholderTextColor="#aaa" secureTextEntry />

                <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'black', marginTop: 7 }}>Perfil:</Text>
                <Picker
                    selectedValue={selectedValue}
                    style={styles.input}
                    onValueChange={(itemValue) => setSelectedValue(itemValue)}
                >
                    <Picker.Item label="Estudiante" value="student" />
                    <Picker.Item label="Administrador" value="admin" />
                </Picker>
            </View>

            <TouchableOpacity onPress={handleSignIn} style={[styles.button, { backgroundColor: '#FF5F1F' }]}>
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'white' }}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCreateAccount} style={[styles.button]}>
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#FF5F1F' }}>Registrase</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    input: {
        width: 280,
        height: 40,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    button: {
        width: 280,
        height: 40,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
});
