import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext({});

// Helper to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('userToken');
      const storedUser = await SecureStore.getItemAsync('userProfile');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load auth data', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    await delay(500); // Simulate network
    
    // Standalone Mode: accept any name and password!
    const mockToken = `mock-token-${Date.now()}`;
    const mockUser = { id: Math.floor(Math.random() * 1000), username };
      
    await SecureStore.setItemAsync('userToken', mockToken);
    await SecureStore.setItemAsync('userProfile', JSON.stringify(mockUser));
      
    setToken(mockToken);
    setUser(mockUser);
    return { success: true };
  };

  const register = async (username, password) => {
    await delay(500);
    
    const mockToken = `mock-reg-token-${Date.now()}`;
    const mockUser = { id: Math.floor(Math.random() * 1000), username };
      
    await SecureStore.setItemAsync('userToken', mockToken);
    await SecureStore.setItemAsync('userProfile', JSON.stringify(mockUser));
      
    setToken(mockToken);
    setUser(mockUser);
    return { success: true };
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userProfile');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
