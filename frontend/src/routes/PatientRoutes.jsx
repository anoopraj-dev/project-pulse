import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import PatientDashboard from "../pages/patient/PatientDashboard";
import PatientProfile from "../pages/patient/PatientProfile";
import PatientOnboarding from "../pages/patient/PatientOnboarding";

const PatientRoutes = [
  { path: "/patient/dashboard", element: <ProtectedRoute><Layout><PatientDashboard /></Layout></ProtectedRoute> },
  { path: "/patient/personal-info", element: <ProtectedRoute><PatientOnboarding /></ProtectedRoute> },
  { path: "/patient/profile", element: <ProtectedRoute><Layout><PatientProfile /></Layout></ProtectedRoute> },
];

export default PatientRoutes;



