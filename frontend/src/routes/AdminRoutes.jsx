
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/admin/Dashboard";

const AdminRoutes = [
  { path: "/admin/profile", element: ( <ProtectedRoute> <Dashboard /> </ProtectedRoute> ), }, ];

export default AdminRoutes;
