import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("username") || "Guest");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || ""); // Avatar

  // ✅ Hàm fetch user info (kèm avatar)
  const fetchUserInfo = async (storedUserId = localStorage.getItem("userId")) => {
    const token = localStorage.getItem("token");
    
    if (!token || !storedUserId) {
      console.warn("Token hoặc userId không tồn tại!");
      setIsLoggedIn(false);
      return;
    }
  
    try {
      console.log("🔄 Đang gọi API để lấy thông tin user...");
      const res = await fetch(`${API_URL}/api/UserAccount/${storedUserId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        console.error(`❌ API trả về lỗi: ${res.status}`);
        if (res.status === 401 || res.status === 403) {
          handleLogout();
        }
        return;
      }
  
      const data = await res.json();
      if (data.success && data.data) {
        console.log("✅ Lấy dữ liệu thành công!", data.data);
        setUserName(data.data.username);
        setUserId(data.data.userId);
        setAvatar(data.data.profilePicture || "");
        setIsLoggedIn(true);
  
        localStorage.setItem("username", data.data.username);
        localStorage.setItem("userId", data.data.userId);
        localStorage.setItem("avatar", data.data.profilePicture || "");
      } else {
        console.warn("⚠️ API không trả về dữ liệu hợp lệ.");
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error("❌ Lỗi khi gọi API:", err);
      setIsLoggedIn(false);
    }
  };

  // ✅ Fetch user info khi app load lần đầu
  useEffect(() => {
    if (userId) fetchUserInfo(userId);
  }, [userId]);

  // ✅ Hàm logout
  const handleLogout = () => {
    localStorage.clear();
 

    setIsLoggedIn(false);
    setUserName("Guest");
    setUserId(null);
    setAvatar("");
    window.location.href = "/";
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