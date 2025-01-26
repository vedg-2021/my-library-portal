// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';


// Create a context to hold the authentication status
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLibrarian, setIsLibrarian] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    // Check if the user is authenticated by looking at localStorage
    const token = localStorage.getItem('token');
    const librarian = localStorage.getItem('librarian');
    const admin = localStorage.getItem('admin');

    if (token) {
      setIsAuthenticated(true);
    }

    if (librarian) {
      setIsLibrarian(true);
    }

    if (admin) {
      setIsAdmin(true);
    }
  }, []);

  // Function to log out the user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('librarian');
    localStorage.removeItem('admin');
    setIsAuthenticated(false);
    setIsLibrarian(false); // Update isLibrarian state when logging out
    setIsAdmin(false); // Update isAdmin state when logging out
    window.location.href = '/'; // Redirect to the home page after logout
    };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
