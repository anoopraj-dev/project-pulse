
import { useRoutes } from "react-router-dom";
import PublicLayout from "../components/layout/components/PublicLayout";
import ProtectedLayout from "../components/layout/components/ProtectedLayout";
import CommonRoutes from "../routes/CommonRoutes";
import NotFound from "../pages/NotFound";
import { Suspense, lazy } from "react";
import PageLoader from "@/components/ui/loaders/PageLoader";

// Lazy load route groups
const AdminRoutes = lazy(() => import("../routes/AdminRoutes"));
const DoctorRoutes = lazy(() => import("../routes/DoctorRoutes"));
const PatientRoutes = lazy(() => import("../routes/PatientRoutes"));

const AppRoutes = () => {
  const routes = useRoutes([
    {
      element: <PublicLayout />,
      children: CommonRoutes,
    },
    {
      element: <ProtectedLayout />,
      children: [
        { path: "admin/*", element: <AdminRoutes /> },
        { path: "doctor/*", element: <DoctorRoutes /> },
        { path: "patient/*", element: <PatientRoutes /> },
      ],
    },
  ]);

  return (
    <Suspense fallback={<PageLoader />}>
      {routes}
    </Suspense>
  );
};

export default AppRoutes;