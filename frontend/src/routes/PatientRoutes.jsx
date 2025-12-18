import ProtectedRoute from "../features/auth/routes/ProtectedRoute";
import Layout from "../components/layout/components/Layout";
import PatientDashboard from "../pages/patient/PatientDashboard";
import PatientOnboarding from "../pages/patient/PatientOnboarding";
import PatientsProfile from "../pages/patient/PatientsProfile";

const PatientRoutes = [
  { path: "/patient/dashboard", element: <ProtectedRoute><Layout><PatientDashboard /></Layout></ProtectedRoute> },
  { path: "/patient/personal-info", element: <ProtectedRoute><PatientOnboarding /></ProtectedRoute> },
  { path: "/patient/profile", element: <ProtectedRoute><Layout><PatientsProfile /></Layout></ProtectedRoute> },
];

export default PatientRoutes;



