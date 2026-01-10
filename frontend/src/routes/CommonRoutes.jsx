
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import Signup from "../pages/Signup";
import VerifyEmail from "../pages/VerifyEmail";
import NotFound from "../pages/NotFound";
import AdminLogin from "../pages/admin/AdminLogin";
import PublicRoute from "../components/auth/routes/PublicRoute";
import AboutUs from "../pages/AboutUs";

const CommonRoutes = [
  { path: "/", 
    element: 
    (<PublicRoute>
        <Home/>
      </PublicRoute> )},

  {
    path: "/signin",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    ),
  },

  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },

  {
    path: "/verify-email",
    element: (
      <PublicRoute>
        <VerifyEmail />
      </PublicRoute>
    ),
  },

  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/about-us", element: <AboutUs /> },
  { path: "/reset-password", element: <VerifyEmail /> },
  { path: "/page-not-found", element: <NotFound /> },
];

export default CommonRoutes;
