import { useUser } from "../../../contexts/UserContext";
import { Navigate } from "react-router-dom";
import ShimmerCard from "../../ui/loaders/ShimmerCard";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, role, isLoading } = useUser();
  if (isLoading) return <ShimmerCard />;

  if (isAuthenticated) {
    const redirectMap = {
      doctor: "/doctor/profile",
      patient: "/patient/profile",
      admin: "/admin/dashboard",
    };
    return <Navigate to={redirectMap[role] || "/signin"} replace />;
  }

  return children;
};

export default PublicRoute;
