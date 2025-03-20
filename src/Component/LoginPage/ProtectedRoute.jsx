import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    setCheckingAuth(false);
  }, [isLoggedIn]);

  if (checkingAuth) return null; // Đợi kiểm tra xong

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location, message: "You need to login first" }} />;
  }

  return children;
};

export default ProtectedRoute;
