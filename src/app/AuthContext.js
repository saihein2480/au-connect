"use client";
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(''); // Track user role
  const [userId, setUserId] = useState(null); // Track user ID
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Use a try-catch block to handle localStorage safely
    try {
      const loggedIn = localStorage.getItem('isLoggedIn');
      const storedRole = localStorage.getItem('role');
      const storedUserId = localStorage.getItem('userId');

      if (loggedIn === 'true') {
        setIsLoggedIn(true);
        setRole(storedRole || '');
        setUserId(storedUserId || null);
      }
    } catch (error) {
      console.error('Error accessing localStorage', error);
    }

    setLoading(false); // Once the state is loaded from localStorage, stop loading
  }, []);

  const login = ({ role, userId }) => {
    try {
      setIsLoggedIn(true);
      setRole(role);
      setUserId(userId);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  };

  const logout = () => {
    try {
      setIsLoggedIn(false);
      setRole('');
      setUserId(null);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, role, userId, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
