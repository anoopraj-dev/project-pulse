
// import PatientAppointments from "@/pages/patient/PatientAppointments";
// import ProtectedRoute from "../components/auth/routes/ProtectedRoute";
// import Layout from "../components/layout/components/Layout";
// import Navbar from "../components/layout/components/Navbar";
// import PatientDashboard from "../pages/patient/PatientDashboard";
// import PatientDoctorProfile from "../pages/patient/PatientDoctorProfile";
// import PatientDoctors from "../pages/patient/PatientDoctors";
// import PatientEditProfile from "../pages/patient/PatientEditProfile";
// import PatientMessages from "../pages/patient/PatientMessages";
// import PatientOnboarding from "../pages/patient/PatientOnboarding";
// import PatientsProfile from "../pages/patient/PatientsProfile";
// import PatientPayments from "@/pages/patient/PatientPayments";
// import PatientViewAppointment from "@/pages/patient/PatientViewAppointment";
// import PatientWallet from "@/pages/patient/PatientWallet";

// const PatientRoutes = [{
//   element: (
//     <ProtectedRoute allowedRoles={["patient"]}>
//       <Layout />
//     </ProtectedRoute>
//   ),
//   children: [
//     { path: "/patient/dashboard", element: <PatientDashboard /> },
//     { path: "/patient/profile", element: <PatientsProfile /> },
//     { path: "/patient/edit-profile", element: <PatientEditProfile /> },
//     { path: "/patient/doctors", element: <PatientDoctors /> },
//     { path: "/patient/doctor/:id", element: <PatientDoctorProfile /> },
//     { path: "/patient/messages", element: <PatientMessages/> },
//     { path: "/patient/messages/:id", element: <PatientMessages/>},
//     { path: "/patient/appointments", element: <PatientAppointments/>},
//     { path: "/patient/appointments/:id", element: <PatientViewAppointment/>},
//     { path: "/patient/payments", element: <PatientPayments/>},
//     { path: "/patient/wallet", element: <PatientWallet/>},
//   ],
// },

// {
//     path: "/patient/personal-info",
//     element: (
//       <ProtectedRoute allowedRoles={["patient"]}>
//         <>
//         <Navbar/>
//         <PatientOnboarding />
//         </>
//       </ProtectedRoute>
//     ),
//   }
// ];

// export default PatientRoutes;


import { useRoutes } from "react-router-dom";
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
import PatientPayments from "@/pages/patient/PatientPayments";
import PatientViewAppointment from "@/pages/patient/PatientViewAppointment";
import PatientWallet from "@/pages/patient/PatientWallet";
import NotFound from "../pages/NotFound";
import PatientConsultationPage from "@/pages/patient/PatientConsultationPage";

const PatientRoutes = () => {
  return useRoutes([
    {
      element: (
        <ProtectedRoute allowedRoles={["patient"]}>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <PatientDashboard /> },
        { path: "profile", element: <PatientsProfile /> },
        { path: "edit-profile", element: <PatientEditProfile /> },
        { path: "doctors", element: <PatientDoctors /> },
        { path: "doctor/:id", element: <PatientDoctorProfile /> },
        { path: "messages", element: <PatientMessages /> },
        { path: "messages/:id", element: <PatientMessages /> },
        { path: "appointments", element: <PatientAppointments /> },
        { path: "appointments/:id", element: <PatientViewAppointment /> },
        { path: "payments", element: <PatientPayments /> },
        { path: "wallet", element: <PatientWallet /> },
    
      ],
    },
    { path: "*", element: <NotFound /> },
    {
      path: "personal-info",
      element: (
        <ProtectedRoute allowedRoles={["patient"]}>
          <>
            <Navbar />
            <PatientOnboarding />
          </>
        </ProtectedRoute>
      ),
    },
    {
      path:'/appointments/consultation',
      element:(
        <ProtectedRoute allowedRoles={['patient']}>
          <>
            {/* <Navbar/> */}
            <PatientConsultationPage/>
          </>
        </ProtectedRoute>
      )
    }
  ]);
};

export default PatientRoutes;