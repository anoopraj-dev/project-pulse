
import Layout from "../components/layout/components/Layout";
import ProtectedRoute from "../components/auth/routes/ProtectedRoute";
import Dashboard from "../pages/admin/Dashboard";
import ViewDocuments from "../pages/admin/ViewDocuments";
import DoctorProfileView from "../pages/admin/DoctorProfileView";
import ViewDoctors from "../pages/admin/ViewDoctors";

const AdminRoutes = [
  { path: "/admin/dashboard", element: ( <ProtectedRoute allowedRoles={['admin']}><Layout><Dashboard /> </Layout></ProtectedRoute> ), }, 
  { path:'/admin/doctor/:id',element: (<ProtectedRoute allowedRoles={['admin']}><Layout><DoctorProfileView/></Layout></ProtectedRoute>)},
  { path: '/admin/doctor/:id/documents', element: (<ProtectedRoute allowedRoles={['admin']}><Layout><ViewDocuments/></Layout></ProtectedRoute>)},
  { path: '/admin/doctors', element: (<ProtectedRoute allowedRoles={['admin']}><Layout><ViewDoctors/></Layout></ProtectedRoute>)}
]
export default AdminRoutes;
