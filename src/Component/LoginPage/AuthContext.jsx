import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userName: "Guest",
  setUserName: () => {},
  userId: null,
  setUserId: () => {},
  handleLogout: () => {},
});

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("username") || "Guest");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const storedUserId = localStorage.getItem("userId");

      if (token && storedUserId) {
        try {
          const res = await fetch(`${API_URL}/api/UserAccount/${storedUserId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          const data = await res.json();
          if (data.success && data.data) {
            setUserName(data.data.username);
            setUserId(data.data.userId);
            localStorage.setItem("username", data.data.username);
            localStorage.setItem("userId", data.data.userId);
          } else {
            console.error("Lỗi: Không tìm thấy dữ liệu người dùng");
          }
        } catch (err) {
          console.error("Lỗi khi lấy dữ liệu user:", err);
        }
      }
    };

    fetchUserData();
  }, []);

  // Hàm logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUserName("Guest");
    setUserId(null);
  };

  const authContextValue = {
    isLoggedIn,
    setIsLoggedIn,
    userName,
    setUserName,
    userId,
    setUserId,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
