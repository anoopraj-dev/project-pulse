
import { useRoutes } from "react-router-dom";
import PublicLayout from "../components/layout/components/PublicLayout"
import ProtectedLayout from "../components/layout/components/ProtectedLayout";
import CommonRoutes from '../routes/CommonRoutes'
import AdminRoutes from '../routes/AdminRoutes'
import DoctorRoutes from '../routes/DoctorRoutes'
import PatientRoutes from '../routes/PatientRoutes'
import NotFound from "../pages/NotFound";

const AppRoutes = () =>
  useRoutes([
    {
      element: <PublicLayout />,
      children: CommonRoutes,
    },
    {
      element: <ProtectedLayout />,
      children: [
        AdminRoutes,
        ...DoctorRoutes,
        ...PatientRoutes,
      ],
    },
    { path: "*", element: <NotFound /> },
  ]);

export default AppRoutes;

