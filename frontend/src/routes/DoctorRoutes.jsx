
import Layout from "../components/layout/components/Layout";
import ProtectedRoute from "../components/auth/routes/ProtectedRoute";
import DoctorProfile from "../pages/doctor/DoctorProfile";
import DoctorEditProfile from "../pages/doctor/DoctorEditProfile";
import DoctorDocuments from "../pages/doctor/DoctorDocuments";
import DoctorOnboarding from "../pages/doctor/DoctorOnboarding";
import Navbar from "../components/layout/components/Navbar";
import DoctorMessages from "../pages/doctor/DoctorMessages";
import DoctorAvailbility from "@/pages/doctor/DoctorAvailbility";
import DoctorAppointments from "@/pages/doctor/DoctorAppointments";
import DoctorPayments from "@/pages/doctor/DoctorPayments";

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
    { path: "/doctor/messages", element: <DoctorMessages /> },
    { path: "/doctor/messages/:id", element: <DoctorMessages /> },
    { path: "/doctor/availability", element: <DoctorAvailbility/> },
    { path: "/doctor/appointments", element: <DoctorAppointments/> },
    { path: "/doctor/payments", element: <DoctorPayments/> },
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
