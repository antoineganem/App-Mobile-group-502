// App.tsx
import React from "react";
import LoginPage from "./src/screen-Login/LoginPage";
import { useAuth0, Auth0Provider } from "react-native-auth0";

export default function App() {
  useAuth0();

  return (
    <Auth0Provider
      domain={"dev-7h8wa2ewzisofb0k.us.auth0.com"}
      clientId="2NYucTSQQU3s4Nzs9DIUYnFO7Nkw4ieA"
    >
      <LoginPage />
    </Auth0Provider>
  );
}
