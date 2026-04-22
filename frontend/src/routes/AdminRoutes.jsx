import { useRoutes } from "react-router-dom";
import Layout from "../components/layout/components/Layout";
import ProtectedRoute from "../components/auth/routes/ProtectedRoute";

import Dashboard from "../pages/admin/Dashboard";
import ViewDocuments from "../pages/admin/ViewDocuments";
import DoctorProfileView from "../pages/admin/DoctorProfileView";
import ViewDoctors from "../pages/admin/ViewDoctors";
import ViewPatients from "../pages/admin/ViewPatients";
import PatientProfileView from "../pages/admin/PatientProfileView";
import ViewAppointments from "@/pages/admin/ViewAppointments";
import NotFound from "@/pages/NotFound";
import SupportCenter from "@/pages/admin/SupportCenter";
import RevenuePage from "@/pages/admin/Revenue";

const AdminRoutes = () => {
  return useRoutes([
    {
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "doctors", element: <ViewDoctors /> },
        { path: "doctor/:id", element: <DoctorProfileView /> },
        { path: "doctor/:id/documents", element: <ViewDocuments /> },
        { path: "patients", element: <ViewPatients /> },
        { path: "patient/:id", element: <PatientProfileView /> },
        { path: "appointments", element: <ViewAppointments /> },
        { path: "support-center", element: <SupportCenter/> },
        { path: "revenue", element: <RevenuePage/> },
      ],
    },

    { path: "*", element: <NotFound /> },
  ]);
};

export default AdminRoutes;