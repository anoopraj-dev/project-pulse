import DoctorProfile from "../pages/doctor/DoctorProfile";
import DoctorOnboarding from '../pages/doctor/DoctorOnboarding'
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

const DoctorRoutes = [
  { path: "/doctor/profile", element: ( <ProtectedRoute> <Layout> <DoctorProfile /> </Layout> </ProtectedRoute> ),},
  {path:'/doctor/personal-info', element: (<ProtectedRoute><DoctorOnboarding/></ProtectedRoute>)},
];

export default DoctorRoutes;
