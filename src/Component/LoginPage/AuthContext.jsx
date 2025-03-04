import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("username") || "Guest");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);  // Thêm userId và setUserId

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (token && storedUserId) {
      fetch(`http://localhost:5200/api/UserAccount/${storedUserId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setUserName(data.data.username);
            setUserId(data.data.userId);
            localStorage.setItem("username", data.data.username);
            localStorage.setItem("userId", data.data.userId);
          }
        })
        .catch((err) => console.error("Lỗi khi lấy dữ liệu user:", err));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userName, setUserName, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
