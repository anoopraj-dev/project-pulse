
import Layout from "../components/layout/components/Layout";
import ProtectedRoute from "../components/auth/routes/ProtectedRoute";
import DoctorProfile from "../pages/doctor/DoctorProfile";
import DoctorEditProfile from "../pages/doctor/DoctorEditProfile";
import DoctorDocuments from "../pages/doctor/DoctorDocuments";
import DoctorOnboarding from "../pages/doctor/DoctorOnboarding";
import Navbar from "../components/layout/components/Navbar";

const DoctorRoutes = [{
  element: (
    <ProtectedRoute allowedRoles={["doctor", "admin"]}>
      <Layout />
    </ProtectedRoute>
  ),
  children: [
    { path: "/doctor/profile", element: <DoctorProfile /> },
    { path: "/doctor/edit-profile", element: <DoctorEditProfile /> },
    { path: "/doctor/documents", element: <DoctorDocuments /> },
    { path: '/doctor/personal-info',element:<DoctorOnboarding/>}
  ],
},

{
  path: "/doctor/personal-info",
  element: (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <>
      <Navbar/>
      <DoctorOnboarding />
      </>
    </ProtectedRoute>
    
  ),
}

];

export default DoctorRoutes;
