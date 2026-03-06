import { useUser } from "../../../contexts/UserContext";
import { Navigate } from "react-router-dom";
import SidebarShimmer from "../../ui/loaders/SidebarShimmer";
import ProfileShimmer from "../../ui/loaders/ProfileShimmer";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, role, isLoading } = useUser();
  
  if (isLoading || isAuthenticated===null) {
    return (
      <div className="flex">
        <SidebarShimmer/>
        <ProfileShimmer/>
     
      </div>
    ); 
  }

  if (isAuthenticated === false ) {
    console.log('navigating to signin')
    return <Navigate to="/signin" replace />;
  }

  // If authenticated but wrong role, redirect to their correct profile
  if (allowedRoles && !allowedRoles.includes(role)) {
    const redirectMap = {
      doctor: "/doctor/profile",
      patient: "/patient/profile",
      admin: "/admin/dashboard",
    };
    return <Navigate to={redirectMap[role] || "/signin"} replace />;
  }

  // All checks passed, render the protected content
  return children;
};

export default ProtectedRoute;