// AuthContext.tsx
import React, { createContext, useState, ReactNode, FC, ReactElement } from "react";

// Define types for the context
interface User {
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  test: string;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context with a default empty object
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Define props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AuthProvider: FC<AuthProviderProps> = ({ children }): ReactElement<any, any> => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const test = "test";

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, test }}
    >
      {children}
    </AuthContext.Provider>
  );
};
