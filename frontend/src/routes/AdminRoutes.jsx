
import Layout from "../components/layout/components/Layout";
import ProtectedRoute from "../components/auth/routes/ProtectedRoute";
import Dashboard from "../pages/admin/Dashboard";
import ViewDocuments from "../pages/admin/ViewDocuments";
import DoctorProfileView from "../pages/admin/DoctorProfileView";
import ViewDoctors from "../pages/admin/ViewDoctors";
import ViewPatients from "../pages/admin/ViewPatients";
import PatientProfileView from "../pages/admin/PatientProfileView";

const AdminRoutes = {
  element: (

    <ProtectedRoute allowedRoles={["admin"]}>
      <Layout/>
    </ProtectedRoute>
    
  ),
  children: [
    { path: "/admin/dashboard", element: <Dashboard /> },
    { path: "/admin/doctors", element: <ViewDoctors /> },
    { path: "/admin/doctor/:id", element: <DoctorProfileView /> },
    { path: "/admin/doctor/:id/documents", element: <ViewDocuments /> },
    { path: "/admin/patients", element: <ViewPatients /> },
    { path: "/admin/patient/:id", element: <PatientProfileView /> },
  ],
};

export default AdminRoutes;
