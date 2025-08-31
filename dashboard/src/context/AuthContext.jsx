import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Configure axios base URL for your backend
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        const urlUser = urlParams.get('user');
        
        if (urlToken && urlUser) {
          console.log("Received auth data from frontend app");
          
          const decodedToken = decodeURIComponent(urlToken);
          const decodedUser = JSON.parse(decodeURIComponent(urlUser));
          
          localStorage.setItem('token', decodedToken);
          localStorage.setItem('user', JSON.stringify(decodedUser));
          
          setToken(decodedToken);
          setUser(decodedUser);
          
          // Set axios header with the correct format
          axios.defaults.headers.common['Authorization'] = `Bearer ${decodedToken}`;
          
          window.history.replaceState({}, document.title, window.location.pathname);
          
          console.log("Auth data saved to dashboard localStorage");
        } else {
          const storedToken = localStorage.getItem('token');
          const storedUser = localStorage.getItem('user');
          
          if (storedToken && storedUser) {
            console.log("Found existing auth data in localStorage");
            
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
            
            // Set axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          } else {
            console.log("No auth data found");
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, authToken) => {
    console.log("Dashboard login called:", { userData, authToken });
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  const logout = () => {
    console.log("Dashboard logout called");
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    
    window.location.href = 'https://treding-app-tranquvest-5.onrender.com/login';
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
