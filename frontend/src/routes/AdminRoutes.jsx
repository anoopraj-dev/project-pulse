
import Layout from "../components/layout/components/Layout";
import ProtectedRoute from "../components/auth/routes/ProtectedRoute";
import Dashboard from "../pages/admin/Dashboard";
import ViewDocuments from "../pages/admin/ViewDocuments";
import DoctorProfileView from "../pages/admin/DoctorProfileView";
import ViewDoctors from "../pages/admin/ViewDoctors";
import ViewPatients from "../pages/admin/ViewPatients";
import PatientProfileView from "../pages/admin/PatientProfileView";

const AdminRoutes = [
  { path: "/admin/dashboard", element: ( <ProtectedRoute allowedRoles={['admin']}><Layout><Dashboard /> </Layout></ProtectedRoute> ), }, 
  { path:'/admin/doctor/:id',element: (<ProtectedRoute allowedRoles={['admin']}><Layout><DoctorProfileView/></Layout></ProtectedRoute>)},
  { path: '/admin/doctor/:id/documents', element: (<ProtectedRoute allowedRoles={['admin']}><Layout><ViewDocuments/></Layout></ProtectedRoute>)},
  { path: '/admin/doctors', element: (<ProtectedRoute allowedRoles={['admin']}><Layout><ViewDoctors/></Layout></ProtectedRoute>)},
  { path: '/admin/patients', element: (<ProtectedRoute allowedRoles={['admin']}><Layout><ViewPatients/></Layout></ProtectedRoute>)},
  { path:'/admin/patient/:id',element: (<ProtectedRoute allowedRoles={['admin']}><Layout><PatientProfileView/></Layout></ProtectedRoute>)},
]

export default AdminRoutes;
