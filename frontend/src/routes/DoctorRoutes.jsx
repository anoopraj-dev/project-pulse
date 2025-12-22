// import DoctorProfile from "../pages/doctor/DoctorProfile";
import DoctorOnboarding from '../pages/doctor/DoctorOnboarding'
import Layout from "../components/layout/components/Layout";
import ProtectedRoute from "../components/auth/routes/ProtectedRoute";
import DoctorsProfile from "../pages/doctor/DoctorsProfile";
import DoctorEditProfile from '../pages/doctor/DoctorEditProfile';

const DoctorRoutes = [
  { path: "/doctor/profile", element: ( <ProtectedRoute allowedRoles={['doctor']}> <Layout> <DoctorsProfile /> </Layout> </ProtectedRoute> ),},
  { path: "/doctor/edit-profile", element: ( <ProtectedRoute allowedRoles={['doctor']}> <Layout> <DoctorEditProfile/> </Layout> </ProtectedRoute> ),},
  {path:'/doctor/personal-info', element: (<ProtectedRoute allowedRoles={['doctor']}><DoctorOnboarding/></ProtectedRoute>)},
];

export default DoctorRoutes;
