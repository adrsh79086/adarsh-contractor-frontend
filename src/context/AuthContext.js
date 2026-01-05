import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("/api/auth/me");
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const response = await api.post("/api/auth/login", {
      username,
      password,
    });

    const { token, user } = response.data;
    localStorage.setItem("token", token);
    setUser(user);

    return response.data;
  };

  const signup = async (username, email, password) => {
    const response = await api.post("/api/auth/signup", {
      username,
      email,
      password,
    });

    const { token, user } = response.data;
    localStorage.setItem("token", token);
    setUser(user);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
