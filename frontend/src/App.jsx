import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import SignIn from "./pages/SignIn";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import PatientProfile from "./pages/patient/PatientProfile";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import Layout from "./components/Layout";
import PatientRegistration from "./pages/patient/PatientRegistration";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorRegistration from "./pages/doctor/DoctorRegistration";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";


const App = () => {

  return (
    <>
  
    <Router>
      <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/admin/profile" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/patient/dashboard" element={<ProtectedRoute><Layout><PatientDashboard /></Layout></ProtectedRoute>} />
        <Route path="/patient/personal-info" element={<ProtectedRoute><PatientRegistration /> </ProtectedRoute>} />
        <Route path="/doctor/personal-info" element={<ProtectedRoute><DoctorRegistration /></ProtectedRoute>} />
        <Route path="/patient/profile" element={<ProtectedRoute><Layout><PatientProfile /></Layout></ProtectedRoute>} />
        <Route path="/doctor/profile" element={<ProtectedRoute><Layout><DoctorProfile /></Layout></ProtectedRoute>} />

        <Route path="/page-not-found" element={<NotFound />} />

      </Routes>
    </Router>
    </>
  );
};

export default App;
