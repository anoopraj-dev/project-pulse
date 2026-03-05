
// import Layout from "../components/layout/components/Layout";
// import ProtectedRoute from "../components/auth/routes/ProtectedRoute";
// import DoctorProfile from "../pages/doctor/DoctorProfile";
// import DoctorEditProfile from "../pages/doctor/DoctorEditProfile";
// import DoctorDocuments from "../pages/doctor/DoctorDocuments";
// import DoctorOnboarding from "../pages/doctor/DoctorOnboarding";
// import Navbar from "../components/layout/components/Navbar";
// import DoctorMessages from "../pages/doctor/DoctorMessages";
// import DoctorAvailbility from "@/pages/doctor/DoctorAvailbility";
// import DoctorAppointments from "@/pages/doctor/DoctorAppointments";
// import DoctorPayments from "@/pages/doctor/DoctorPayments";
// import DoctorViewAppointment from "@/pages/doctor/DoctorViewAppointment";
// import DoctorPatientProfile from "@/pages/doctor/DoctorPatientProfile";
// import DoctorPatientRecords from "@/pages/doctor/DoctorPatientRecords";

// const DoctorRoutes = [{
//   element: (
//     <ProtectedRoute allowedRoles={["doctor", "admin"]}>
//       <Layout />
//     </ProtectedRoute>
//   ),
//   children: [
//     { path: "/doctor/profile", element: <DoctorProfile /> },
//     { path: "/doctor/edit-profile", element: <DoctorEditProfile /> },
//     { path: "/doctor/documents", element: <DoctorDocuments /> },
//     { path: "/doctor/messages", element: <DoctorMessages /> },
//     { path: "/doctor/messages/:id", element: <DoctorMessages /> },
//     { path: "/doctor/availability", element: <DoctorAvailbility/> },
//     { path: "/doctor/appointments", element: <DoctorAppointments/> },
//     { path: "/doctor/appointments/:id", element: <DoctorViewAppointment/> },
//     { path: "/doctor/appointments/patient-profile/:id", element: <DoctorPatientProfile/> },
//     { path: "/doctor/appointments/patient/records", element: <DoctorPatientRecords/> },
//     { path: "/doctor/payments", element: <DoctorPayments/> },
//   ],
// },

// {
//   path: "/doctor/personal-info",
//   element: (
//     <ProtectedRoute allowedRoles={["doctor"]}>
//       <>
//       <Navbar/>
//       <DoctorOnboarding />
//       </>
//     </ProtectedRoute>
    
//   ),
// }

// ];

// export default DoctorRoutes;


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

const DoctorRoutes = () => {
  return useRoutes([
    {
      element: (
        <ProtectedRoute allowedRoles={["doctor", "admin"]}>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "profile", element: <DoctorProfile /> },
        { path: "edit-profile", element: <DoctorEditProfile /> },
        { path: "documents", element: <DoctorDocuments /> },
        { path: "messages", element: <DoctorMessages /> },
        { path: "messages/:id", element: <DoctorMessages /> },
        { path: "availability", element: <DoctorAvailbility /> },
        { path: "appointments", element: <DoctorAppointments /> },
        { path: "appointments/:id", element: <DoctorViewAppointment /> },
        { path: "appointments/patient-profile/:id", element: <DoctorPatientProfile /> },
        { path: "appointments/patient/records", element: <DoctorPatientRecords /> },
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
  ]);
};

export default DoctorRoutes;