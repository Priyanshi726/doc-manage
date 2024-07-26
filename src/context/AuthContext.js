
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    if(localStorage.getItem("TEST_LOGIN")){
        setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [])

  const login = (email, password) => {
    if (email === 'admin@gmail.com' && password === 'Admin@123') {
      setIsAuthenticated(true);
      localStorage.setItem("TEST_LOGIN", JSON.stringify({email}));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.setItem("TEST_LOGIN","");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        {isLoading?<>Please wait...</>:
        children
        }
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
