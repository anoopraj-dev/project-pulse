import DoctorProfile from "../pages/doctor/DoctorProfile";
import DoctorRegistration from '../pages/doctor/DoctorRegistration'
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

const DoctorRoutes = [
  { path: "/doctor/profile", element: ( <ProtectedRoute> <Layout> <DoctorProfile /> </Layout> </ProtectedRoute> ),},
  {path:'doctor/personal-info', element: (<ProtectedRoute><DoctorRegistration/></ProtectedRoute>)},
];

export default DoctorRoutes;
