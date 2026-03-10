import { useUser } from "../../../contexts/UserContext";
import { Navigate, useLocation } from "react-router-dom";
import SidebarShimmer from "../../ui/loaders/SidebarShimmer";
import ProfileShimmer from "../../ui/loaders/ProfileShimmer";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, role, isLoading, firstLogin } = useUser();
  const location = useLocation();

  if (isLoading || isAuthenticated === null) {
    return (
      <div className="flex">
        <SidebarShimmer />
        <ProfileShimmer />
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/signin" replace />;
  }

  // ------------ Force onboarding if first login
  let onboardingPath;
  if (role !== "admin") {
    onboardingPath = `/${role}/personal-info`;

    if (firstLogin === true && location.pathname !== onboardingPath) {
      return <Navigate to={onboardingPath} replace />;
    }
  }

  // Role protection
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
