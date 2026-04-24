import { useUser } from "../../../contexts/UserContext";
import { Navigate, useLocation } from "react-router-dom";
import ShimmerCard from "../../ui/loaders/ShimmerCard";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, role, isLoading } = useUser();
  const location = useLocation();

  if (isLoading || isAuthenticated === null) return <ShimmerCard />;

  const publicPaths = [
    "/",
    "/signin",
    "/signup",
    "/verify-email",
    "/about-us",
    "/admin/login",
  ];
  const isPublicPage = publicPaths.includes(location.pathname);

  if (isAuthenticated === true && isPublicPage) {
    const redirectMap = {
      doctor: "/doctor/dashboard",
      patient: "/patient/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={redirectMap[role]} replace />;
  }

  return children;
};

export default PublicRoute;
