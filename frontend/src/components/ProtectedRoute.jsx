import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../api/api";
import ShimmerCard from "./ShimmerCard";


const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    api
      .get("/api/auth/authenticate")
      .then((res) => setIsAuthenticated(true))
      .catch((err) => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null)
    return <div className="flex items-center min-h-screen"><ShimmerCard/></div>;

  return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
