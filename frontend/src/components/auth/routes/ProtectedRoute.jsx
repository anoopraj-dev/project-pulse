import { useUser } from "../../../contexts/UserContext";
import { Navigate } from "react-router-dom";
import ShimmerCard from "../../ui/loaders/ShimmerCard";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, role, isLoading } = useUser();
  console.log('logs from protected route ', isAuthenticated, role, isLoading )
  if (isLoading) return <ShimmerCard />; // Wait for API

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const redirectMap = {
      doctor: "/doctor/profile",
      patient: "/patient/profile",
      admin: "/admin/dashboard",
    };
    return <Navigate to={redirectMap[role] || "/signin"} replace />;
  }

  return children;
};

export default ProtectedRoute;
