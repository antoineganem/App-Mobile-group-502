// src/App.tsx
import React from "react";
import LoginPage from "./src/screen-Login/LoginPage";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={LoginPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
