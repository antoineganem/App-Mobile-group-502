// App.tsx
import React from "react";
import LoginPage from "./src/screen-Login/LoginPage";
import { AuthProvider } from "./src/AuthContext";
import { ExpoRouter } from "expo-router";

export default function App() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}
