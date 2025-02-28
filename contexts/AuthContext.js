"use client";

import { userLogin, userRegistration } from "api/auth/auth";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (loginData) => {
    try {
      const response = await userLogin(loginData);
      console.log(response);
      const userData = {
        id: response.data.userId,
        userName: response.data.userName,
        roleName: response.data.roleName,
      };
      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  const register = async (registerData) => {
    try {
      await userRegistration(registerData);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
