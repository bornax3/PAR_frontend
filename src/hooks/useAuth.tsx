import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Load user information from localStorage if available
  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    const storedRoles = JSON.parse(localStorage.getItem("roles") || "null");
    const storedUserId = JSON.parse(localStorage.getItem("userId") || "null");

    if (storedToken && storedRoles !== "null" && storedUserId !== "null") {
      context.login(storedToken, storedRoles, storedUserId);
    }
  }, [context]);

  return context;
};

export default useAuth;
