
import Layout from "../components/layout/components/Layout";
import ProtectedRoute from "../components/auth/routes/ProtectedRoute";
import Dashboard from "../pages/admin/Dashboard";
import ApproveDoctors from "../pages/admin/ApproveDoctors";

const AdminRoutes = [
  { path: "/admin/dashboard", element: ( <ProtectedRoute allowedRoles={['admin']}><Layout><Dashboard /> </Layout></ProtectedRoute> ), }, 
  { path:'/admin/doctor/:id',element: (<ProtectedRoute allowedRoles={['admin']}><Layout><ApproveDoctors/></Layout></ProtectedRoute>)} 
]
export default AdminRoutes;
