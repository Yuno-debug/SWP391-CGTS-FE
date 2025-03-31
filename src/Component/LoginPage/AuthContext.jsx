import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("username") || "Guest");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || ""); // Avatar

  // ✅ Hàm fetch user info (kèm avatar)
  const fetchUserInfo = (storedUserId = localStorage.getItem("userId")) => {
    const token = localStorage.getItem("token");

    if (token && storedUserId) {
      fetch(`${API_URL}/api/UserAccount/${storedUserId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (data.success && data.data) {
            setUserName(data.data.username);
            setUserId(data.data.userId);
            setAvatar(data.data.profilePicture || "");

            // Lưu localStorage để giữ khi reload
            localStorage.setItem("username", data.data.username);
            localStorage.setItem("userId", data.data.userId);
            localStorage.setItem("avatar", data.data.profilePicture || "");
          } else {
            console.error("Lỗi: Không tìm thấy dữ liệu người dùng");
          }
        })
        .catch((err) => console.error("Lỗi khi lấy dữ liệu user:", err));
    }
  };

  // ✅ Fetch user info khi app load lần đầu hoặc khi userId thay đổi
  useEffect(() => {
    if (userId) fetchUserInfo(userId);
  }, [userId]);

  // ✅ Hàm logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("avatar");

    setIsLoggedIn(false);
    setUserName("Guest");
    setUserId(null);
    setAvatar("");
  };

  // ✅ Alias hàm refetch (cho dễ nhớ khi dùng)
  const refetchUserInfo = () => fetchUserInfo(userId);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userName,
        setUserName,
        userId,
        setUserId,
        avatar,
        setAvatar,
        handleLogout,
        fetchUserInfo, // Dùng khi cần fetch theo ID khác
        refetchUserInfo, // Dùng lại chính user hiện tại
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
