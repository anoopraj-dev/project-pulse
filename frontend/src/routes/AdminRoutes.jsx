
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/admin/Dashboard";
import ApproveDoctors from "../pages/admin/ApproveDoctors";

const AdminRoutes = [
  { path: "/admin/dashboard", element: ( <ProtectedRoute><Layout><Dashboard /> </Layout></ProtectedRoute> ), }, 
  { path:'/admin/doctor/:id',element: (<ProtectedRoute role='admin'><Layout><ApproveDoctors/></Layout></ProtectedRoute>)} 
]
export default AdminRoutes;
