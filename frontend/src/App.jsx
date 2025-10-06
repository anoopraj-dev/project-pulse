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

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin/dashboard" element={<Dashboard/>} />
        <Route path="/patient/dashbord" element={<PatientDashboard/>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
         <Route path="/patient/personal-info" element={<PatientRegistration />} />
        <Route path="/patient/profile" element={<Layout><PatientProfile /></Layout>} />
        <Route path="/doctor/profile" element={<Layout><DoctorProfile /></Layout>} />
       
      </Routes>
    </Router>
  );
};

export default App;
