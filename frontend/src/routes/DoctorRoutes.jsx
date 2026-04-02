
import { useRoutes } from "react-router-dom";
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
import DoctorViewAppointment from "@/pages/doctor/DoctorViewAppointment";
import DoctorPatientProfile from "@/pages/doctor/DoctorPatientProfile";
import DoctorPatientRecords from "@/pages/doctor/DoctorPatientRecords";
import NotFound from "@/pages/NotFound";
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import DoctorConsultationPage from "@/pages/doctor/DoctorConsultationPage";

const DoctorRoutes = () => {
  return useRoutes([
    {
      element: (
        <ProtectedRoute allowedRoles={["doctor", "admin"]}>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <DoctorDashboard /> },
        { path: "profile", element: <DoctorProfile /> },
        { path: "edit-profile", element: <DoctorEditProfile /> },
        { path: "documents", element: <DoctorDocuments /> },
        { path: "messages", element: <DoctorMessages /> },
        { path: "messages/:id", element: <DoctorMessages /> },
        { path: "availability", element: <DoctorAvailbility /> },
        { path: "appointments", element: <DoctorAppointments /> },
        { path: "appointments/:id", element: <DoctorViewAppointment /> },
        { path: "appointments/patient-profile/:id", element: <DoctorPatientProfile /> },
        { path: "appointments/patient/records/:patientId", element: <DoctorPatientRecords /> },
        { path: "payments", element: <DoctorPayments /> },
      ],
    },
    { path: "*", element: <NotFound /> },
    {
      path: "personal-info",
      element: (
        <ProtectedRoute allowedRoles={["doctor"]}>
          <>
            <Navbar />
            <DoctorOnboarding />
          </>
        </ProtectedRoute>
      ),
    },
    {
      path:'/appointments/consultation/:id',
      element: (
        <ProtectedRoute allowedRoles={['doctor']}>
          <>
            {/* <Navbar/> */}
            <DoctorConsultationPage/>
          </>
        </ProtectedRoute>
      )
    }
  ]);
};

export default DoctorRoutes;