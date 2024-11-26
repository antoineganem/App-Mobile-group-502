import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Sidebar from "./Sidebar";
import HeaderIcons from "./HeaderIcons"; // Include the header with menu icon

interface WithSidebarProps {
  children: React.ReactNode;
}

const WithSidebar: React.FC<WithSidebarProps> = ({ children }) => {
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <View style={styles.container}>
      {/* Header with menu and cart icons */}
      <HeaderIcons onMenuPress={toggleSidebar} cart={false} />

      {/* Main Content */}
      <View style={styles.content}>{children}</View>

      {/* Sidebar */}
      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
    </View>
  );
};

export default WithSidebar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
  },
});
