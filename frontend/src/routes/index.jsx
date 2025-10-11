
import { useRoutes } from "react-router-dom";
import CommonRoutes from "./CommonRoutes";
import AdminRoutes from "./AdminRoutes";
import PatientRoutes from "./PatientRoutes";
import DoctorRoutes from "./DoctorRoutes";

const AppRoutes = () => {
  const routes = [
    ...CommonRoutes,
    ...AdminRoutes,
    ...PatientRoutes,
    ...DoctorRoutes,
  ];

  return useRoutes(routes);
};

export default AppRoutes;
