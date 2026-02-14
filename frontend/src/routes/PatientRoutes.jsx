
import PatientAppointments from "@/pages/patient/PatientAppointments";
import ProtectedRoute from "../components/auth/routes/ProtectedRoute";
import Layout from "../components/layout/components/Layout";
import Navbar from "../components/layout/components/Navbar";
import PatientDashboard from "../pages/patient/PatientDashboard";
import PatientDoctorProfile from "../pages/patient/PatientDoctorProfile";
import PatientDoctors from "../pages/patient/PatientDoctors";
import PatientEditProfile from "../pages/patient/PatientEditProfile";
import PatientMessages from "../pages/patient/PatientMessages";
import PatientOnboarding from "../pages/patient/PatientOnboarding";
import PatientsProfile from "../pages/patient/PatientsProfile";

const PatientRoutes = [{
  element: (
    <ProtectedRoute allowedRoles={["patient"]}>
      <Layout />
    </ProtectedRoute>
  ),
  children: [
    { path: "/patient/dashboard", element: <PatientDashboard /> },
    { path: "/patient/profile", element: <PatientsProfile /> },
    { path: "/patient/edit-profile", element: <PatientEditProfile /> },
    { path: "/patient/doctors", element: <PatientDoctors /> },
    { path: "/patient/doctor/:id", element: <PatientDoctorProfile /> },
    { path: "/patient/messages", element: <PatientMessages/> },
    { path: "/patient/messages/:id", element: <PatientMessages/>},
    { path: "/patient/appointments", element: <PatientAppointments/>},
  ],
},

{
    path: "/patient/personal-info",
    element: (
      <ProtectedRoute allowedRoles={["patient"]}>
        <>
        <Navbar/>
        <PatientOnboarding />
        </>
      </ProtectedRoute>
    ),
  }
];

export default PatientRoutes;
